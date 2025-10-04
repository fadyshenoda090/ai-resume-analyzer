interface Resume {
    id: string;
    companyName?: string;
    jobTitle?: string;
    imagePath: string;
    resumePath: string;
    feedback: Feedback;
}

interface Feedback {
    overallScore: number;
    ATS: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
        }[];
    };
    toneAndStyle: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    content: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    structure: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    skills: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
}
// 1. Resolves the error for importing the main PDF.js module (pdf.mjs)
declare module "pdfjs-dist/build/pdf.mjs" {
    // 🚨 CRITICAL FIX: Add the worker types here
    export * from "pdfjs-dist/types/src/display/worker";
    // Re-export the main API types
    export * from "pdfjs-dist/types/src/display/api";
}

// 2. Resolves the error for the build-tool-style import of the worker URL
declare module "pdfjs-dist/build/pdf.worker.min.mjs?url" {
    const workerUrl: string;
    export default workerUrl;
}