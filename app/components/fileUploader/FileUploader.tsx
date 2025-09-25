import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {formatSize} from '~/lib/formatSize'

interface FileUploadProps {
    onFileSelect: (file: File | null) => void
}

const FileUploader = ({onFileSelect}: FileUploadProps) => {

    const [file, setFile] = useState<File | null>(null)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null;
        setFile(file);
        onFileSelect?.(file);
    }, [onFileSelect]);

    const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({
        onDrop,
        multiple: false,
        accept: {'application/pdf': ['.pdf']},
        maxSize: 5 * 1024 * 1024
    })
    return (
        <div className='w-full gradient-border'>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className='space-y-4 cursor-pointer'>
                    {!file && <div className="mx-auto w-16 h-16 mb-2 flex justify-center items-center">
                        <img src="/icons/info.svg" alt="upload" className='size-20'/>
                    </div>}
                    {file ? (
                        <div className={`uploader-selected-file`} onClick={e=> e.stopPropagation()}>
                            <div className='flex items-center space-x-3'>
                                <img src="/images/pdf.png" alt="pdf" className='size-10'/>
                                <div className={``}>
                                    <p className='text-sm max-w-xs text-gray-700 font-medium truncate'>
                                        {file?.name}
                                    </p>
                                    <p className='text-sm text-gray-500'>
                                        {file ? formatSize(file.size) : ''}
                                    </p>
                                </div>
                            </div>
                            <button className={`p-2 cursor-pointer`} onClick={e=>{
                                onFileSelect?.(null)
                                setFile(null)
                            }}>
                                <img src={`/icons/cross.svg`} alt={`remove`} className={`w-4 h-4`} />
                            </button>
                        </div>) : (
                        <div className='flex flex-col items-center justify-center'>
                            <p className='text-lg text-gray-500'>
                                <span className='font-semibold'>
                                    Click to upload
                                </span> or drag and drop
                            </p>
                            <p className='text-lg to-gray-500'>PDF (max 20 MB)</p>
                        </div>)}
                </div>
            </div>
        </div>
    )
}

export default FileUploader