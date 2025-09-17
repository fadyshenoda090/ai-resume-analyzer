import type {Route} from "./+types/home";
import Navbar from "~/components/navbar/Navbar";
import {resumes} from "~/constants";
import ResumeCard from "~/components/resumeCard/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {useLocation, useNavigate} from "react-router";
import {useEffect} from "react";

export function meta({}: Route.MetaArgs) {
    return [
        {title: "Resumind"},
        {name: "description", content: "AI ATS analyzer for free."},
    ];
}

export default function Home() {
    const {isLoading, auth} = usePuterStore()
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (!auth.isAuthenticated) navigate(`/`)
    }, [auth.isAuthenticated,]);

    return <main className={`bg-[url('/images/bg-main.svg')] bg-cover`}>
        <Navbar/>
        <section className={`main-section`}>
            <div className={`page-heading py-16`}>
                <h1>
                    Track Your applicants with AI ATS Analyzer
                </h1>
                <h2>
                    AI ATS Analyzer is a free tool that helps you track your applicants and their status.
                </h2>
            </div>
        </section>
        {resumes.length > 0 && (
            <div className="resumes-section">
                {resumes.map((resume) => (
                    <ResumeCard key={resume.id} resume={resume}/>
                ))}
            </div>
        )}

    </main>
}
