// file #4: ~/lib/pdfToImage.ts (CORRECTED CODE)

export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

// 👇 REPLACE the old loadPdfJs function with this revised version
async function loadPdfJs(): Promise<any> {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;

    isLoading = true;

    // @ts-expect-error - Use the new import path for the main library
    loadPromise = import("pdfjs-dist/build/pdf.mjs").then(async (lib) => {

        // CRITICAL FIX: Dynamically import the worker path using the build tool's asset handling.
        const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");

        // Set the worker source to the URL provided by the build tool
        lib.GlobalWorkerOptions.workerSrc = worker.default;

        pdfjsLib = lib;
        isLoading = false;
        return lib;
    });

    return loadPromise;
}
// 👆 END of revised loadPdfJs function

export async function convertPdfToImage(
    file: File
): Promise<PdfConversionResult> {
    // ... (KEEP ALL THE EXISTING LOGIC OF convertPdfToImage HERE) ...
    try {
        const lib = await loadPdfJs(); // <--- This calls the fixed function

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 4 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (context) {
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = "high";
        }

        await page.render({ canvasContext: context!, viewport }).promise;

        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const originalName = file.name.replace(/\.pdf$/i, "");
                        const imageFile = new File([blob], `${originalName}.png`, {
                            type: "image/png",
                        });

                        resolve({
                            imageUrl: URL.createObjectURL(blob),
                            file: imageFile,
                        });
                    } else {
                        resolve({
                            imageUrl: "",
                            file: null,
                            error: "Failed to create image blob",
                        });
                    }
                },
                "image/png",
                1.0
            );
        });
    } catch (err) {
        return {
            imageUrl: "",
            file: null,
            error: `Failed to convert PDF: ${err}`,
        };
    }
}