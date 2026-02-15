import React from 'react';

const Step02Market = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-900">Step 2: Market Research</h1>
            <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-600">
                    Analyze existing solutions and identify the target audience.
                </p>

                <div className="grid grid-cols-2 gap-4 not-prose">
                    <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                        <h3 className="font-bold text-slate-900">Competitors</h3>
                        <ul className="list-disc list-inside text-slate-600 mt-2">
                            <li>Resume.io</li>
                            <li>Teal</li>
                            <li>Canva</li>
                        </ul>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                        <h3 className="font-bold text-slate-900">Target Audience</h3>
                        <ul className="list-disc list-inside text-slate-600 mt-2">
                            <li>Job Seekers</li>
                            <li>Students</li>
                            <li>Professionals switching careers</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step02Market;
