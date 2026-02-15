import React from 'react';

const Step03Architecture = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-900">Step 3: System Architecture</h1>
            <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-600">
                    Define the technical stack and data flow.
                </p>

                <div className="bg-slate-900 text-slate-200 p-6 rounded-xl font-mono text-sm">
                    <p>Frontend: React + Tailwind CSS</p>
                    <p>State Management: React Context / LocalStorage</p>
                    <p>AI Integration: Gemini API / OpenAI API</p>
                    <p>Export: PDF / Markdown</p>
                </div>
            </div>
        </div>
    );
};

export default Step03Architecture;
