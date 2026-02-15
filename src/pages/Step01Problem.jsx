import React from 'react';

const Step01Problem = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-900">Step 1: Problem Statement</h1>
            <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-600">
                    Define the core problem the AI Resume Builder solves.
                </p>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                    <h3 className="font-bold text-blue-900 mb-2">Goal</h3>
                    <p className="text-blue-800">
                        To build an AI-powered tool that helps users generate ATS-friendly resumes
                        tailored to specific job descriptions.
                    </p>
                </div>

                <h3>Key Pain Points</h3>
                <ul>
                    <li>Resume writing is time-consuming.</li>
                    <li>Hard to tailor for every job application.</li>
                    <li>ATS rejection due to formatting issues.</li>
                </ul>
            </div>
        </div>
    );
};

export default Step01Problem;
