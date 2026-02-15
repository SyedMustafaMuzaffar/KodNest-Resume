import React, { useState, useEffect } from 'react';
import { useStepProgress } from '../hooks/useStepProgress';
import { CheckCircle, Circle, Copy, ExternalLink, ShieldCheck } from 'lucide-react';

const Proof = () => {
    const { steps, getStepStatus } = useStepProgress();
    const [links, setLinks] = useState({
        lovable: '',
        github: '',
        deploy: ''
    });
    const [copyStatus, setCopyStatus] = useState('Copy Final Submission');

    // Load saved links
    useEffect(() => {
        const saved = localStorage.getItem('rb_final_submission');
        if (saved) {
            setLinks(JSON.parse(saved));
        }
    }, []);

    // Save links
    useEffect(() => {
        localStorage.setItem('rb_final_submission', JSON.stringify(links));
    }, [links]);

    const handleLinkChange = (key, value) => {
        setLinks(prev => ({ ...prev, [key]: value }));
    };

    // Validation Logic
    const stepsCompleted = steps.every(step => getStepStatus(step.id).status === 'completed');

    // Check checklist from localStorage
    const checklist = JSON.parse(localStorage.getItem('rb_test_checklist') || '{}');
    const testsPassed = Object.values(checklist).filter(Boolean).length === 10;

    const linksProvided =
        links.lovable.startsWith('https://lovable.dev') &&
        links.github.startsWith('https://github.com') &&
        links.deploy.startsWith('https://');

    const isShipped = stepsCompleted && testsPassed && linksProvided;

    const handleCopy = () => {
        const text = `
------------------------------------------
AI Resume Builder — Final Submission

Lovable Project: ${links.lovable}
GitHub Repository: ${links.github}
Live Deployment: ${links.deploy}

Core Capabilities:
- Structured resume builder
- Deterministic ATS scoring
- Template switching
- PDF export with clean formatting
- Persistence + validation checklist
------------------------------------------
`;
        navigator.clipboard.writeText(text.trim());
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus('Copy Final Submission'), 2000);
    };

    return (
        <div className="max-w-3xl mx-auto py-10 px-6">
            <header className="mb-10 text-center">
                <h1 className="text-4xl font-bold text-slate-900 mb-2 font-serif">Proof of Work</h1>
                <p className="text-slate-600">Final Verification & Submission</p>
            </header>

            {/* 1. Step Overview */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Step Completion</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {steps.map((step, index) => {
                        const status = getStepStatus(step.id);
                        return (
                            <div key={step.id} className="flex items-center gap-2 text-sm">
                                {status.status === 'completed' ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                    <Circle className="w-4 h-4 text-slate-300" />
                                )}
                                <span className={status.status === 'completed' ? 'text-slate-700 font-medium' : 'text-slate-400'}>
                                    Step {index + 1}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 2. Artifact Collection */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-slate-800 mb-2 border-b pb-2">Submission Artifacts</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Lovable Project Link</label>
                        <input
                            type="url"
                            placeholder="https://lovable.dev/..."
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={links.lovable}
                            onChange={(e) => handleLinkChange('lovable', e.target.value)}
                        />
                        {!links.lovable.startsWith('https://lovable.dev') && links.lovable && (
                            <p className="text-xs text-red-500 mt-1">Must start with https://lovable.dev</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">GitHub Repository</label>
                        <input
                            type="url"
                            placeholder="https://github.com/..."
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={links.github}
                            onChange={(e) => handleLinkChange('github', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Deployed Application URL</label>
                        <input
                            type="url"
                            placeholder="https://..."
                            className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={links.deploy}
                            onChange={(e) => handleLinkChange('deploy', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* 3. Final Status & Export */}
            <div className={`p-8 rounded-xl border text-center transition-all duration-300 ${isShipped ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                {isShipped ? (
                    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-2">
                            <ShieldCheck className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-green-800 mb-2">Project 3 Shipped Successfully.</h2>
                            <p className="text-green-700">All systems operational. Ready for submission.</p>
                        </div>

                        <button
                            onClick={handleCopy}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors shadow-sm"
                        >
                            <Copy className="w-5 h-5" />
                            {copyStatus}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4 opacity-75">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-200 rounded-full mb-2">
                            <div className="w-8 h-8 border-4 border-slate-400 border-t-transparent rounded-full animate-spin" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-700 mb-1">Submission In Progress</h2>
                            <p className="text-slate-500 text-sm">
                                Complete all steps, pass all tests, and provide all links to ship.
                            </p>
                        </div>
                        <div className="flex justify-center gap-4 text-xs font-mono text-slate-500 mt-4">
                            <span className={stepsCompleted ? 'text-green-600' : ''}>Steps: {stepsCompleted ? '8/8' : 'Pending'}</span>
                            <span className="text-slate-300">|</span>
                            <span className={testsPassed ? 'text-green-600' : ''}>Tests: {testsPassed ? '10/10' : 'Pending'}</span>
                            <span className="text-slate-300">|</span>
                            <span className={linksProvided ? 'text-green-600' : ''}>Links: {linksProvided ? '3/3' : 'Pending'}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Proof;
