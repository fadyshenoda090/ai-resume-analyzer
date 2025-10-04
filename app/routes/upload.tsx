import React, {useState, type FormEvent} from 'react'
import FileUploader from '~/components/fileUploader/FileUploader'
import Navbar from '~/components/navbar/Navbar'
import {usePuterStore} from '~/lib/puter'
import {useNavigate} from 'react-router'
import {convertPdfToImage} from "~/lib/pdfToImage";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "~/constants";

const Upload = () => {

    const {auth, isLoading, fs, ai, kv,} = usePuterStore()
    const navigate = useNavigate()
    const [isProcessing, setIsProcessing] = useState(false)
    const [statusText, setStatusText] = useState('')
    const [file, setFile] = useState<File | null>(null)


    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({companyName, jobTitle, jobDescription, file,}: {
        companyName: string
        jobTitle: string
        jobDescription: string
        file: File
    }) => {
        if (!file) return
        setIsProcessing(true)
        setStatusText(`Uploading the File...`)
        const uploadedFile = await fs.upload([file])
        if (!uploadedFile) return setStatusText(`failed to upload your resume`)
        setStatusText(`Converting to image...`)
        const imageFile = await convertPdfToImage(file)
        if (!imageFile.file) return setStatusText(`failed to convert pdf to image your resume`)
        console.log(imageFile)
        setStatusText(`Uploading the image...`)
        const uploadedImage = await fs.upload([imageFile?.file])
        if (!uploadedImage) return setStatusText(`failed to upload your image`)
        setStatusText(`Preparing Data...`)
        const uuid = generateUUID()
        const data = {
            id: uuid,
            resumePath : uploadedFile.path,
            imagePath : uploadedImage.path,
            companyName,
            jobTitle,
            jobDescription,
            feedback: '',
        }
        await kv.set(`resume:${uuid}`, JSON.stringify(data))
        setStatusText(`Analyzing...`)
        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({jobTitle, jobDescription})
        )
        if (!feedback) return setStatusText(`failed to analyze your resume`)
        const feedbackText = typeof feedback.message.content === 'string'
            ? feedback.message.content
            : feedback.message.content[0].text

        data.feedback=JSON.parse(feedbackText)
        await kv.set(`resume:${uuid}`, JSON.stringify(data))
        setStatusText(`All done! Redirecting...`)
        console.log(data)
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget
        if (!form) return;
        const formData = new FormData(form)
        const companyName = formData.get('company-name') as string
        const jobTitle = formData.get('job-title') as string
        const jobDescription = formData.get('job-description') as string

        if (!file) return
        handleAnalyze({companyName, jobTitle, jobDescription, file})
    }
    return (<main className={`bg-[url('/images/bg-main.svg')] bg-cover`}>
            <Navbar/>
            <section className={`main-section`}>
                <div className={`page-heading py-10`}>
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img alt={`scan`} src='/images/resume-scan.gif'
                                 className={`w-full`}
                            />
                        </>
                    ) : <h2>Drop your resume for an ATS</h2>}
                </div>
                {!isProcessing && (
                    <form id='upload-form' onSubmit={handleSubmit}
                          className={`flex flex-col gap-4 mt-8`}>
                        <div className={`form-div`}>
                            <label htmlFor="company-name">Company Name</label>
                            <input type='text' name='company-name' id='company-name' placeholder='Company Name'/>
                        </div>
                        <div className={`form-div`}>
                            <label htmlFor="job-title">Job Title</label>
                            <input type='text' name='job-title' id='job-title' placeholder='Job Title'/>
                        </div>
                        <div className={`form-div`}>
                            <label htmlFor="job-description">Job Description</label>
                            <textarea rows={6} name='job-description' id='job-description'
                                      placeholder='Job Description'/>
                        </div>
                        <div className={`form-div`}>
                            <label htmlFor="uploader">Upload your resume</label>
                            <FileUploader onFileSelect={handleFileSelect}/>
                        </div>
                        <button type='submit' className='primary-button'>Analyze Resume</button>
                    </form>
                )}
            </section>
        </main>
    )
}

export default Upload