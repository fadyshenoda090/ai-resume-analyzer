import React from 'react'
import {Link} from "react-router";
import ScoreCircle from "~/components/scoreCircle/ScoreCircl";

const ResumeCard = ({ resume: { id, companyName, jobTitle, feedback, imagePath } }: { resume: Resume }) => {
    return (
        <Link to={`/resume/${id}`} className={`resume-card animate-in fade-in duration-1000`}>
            <div className="flex justify-between items-center gap-2 min-h-[110px]">
                <div className="flex flex-col gap-2">
                    {companyName && <h2 className="!text-black font-bold break-words">{companyName}</h2>}
                    {jobTitle && <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>}
                    {!companyName && !jobTitle && <h2 className="!text-black font-bold">Resume</h2>}
                </div>
                <div className="flex-shrink-0">
                    <ScoreCircle score={feedback.overallScore} />
                </div>
            </div>
            <div className={`gradient-border animate-in fade-in duration-1000`}>
                <div className={`h-full w-full`}>
                    <img
                        src={imagePath}
                        alt={`resume`}
                        className={`h-[350px] max-sm:h-[200px] w-full object-top object-cover`}
                    />
                </div>
            </div>
        </Link>
    )
}
export default ResumeCard
