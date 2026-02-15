import React, { useState } from 'react';
import { useStepProgress } from '../hooks/useStepProgress';
import { CheckCircle, ExternalLink, Copy, AlertTriangle } from 'lucide-react';

const ProofPage = () => {
    const { steps, getStepStatus, isStepCompleted } = useStepProgress();

    const [lovableLink, setLovableLink] = useState('');
    const [githubLink, setGithubLink] = useState('');
    const [deployLink, setDeployLink] = useState('');
    const [copyStatus, setCopyStatus] = useState('Copy Final Submission');

    const allStepsCompleted = steps.every(step => isStepCompleted(step.id));
    const allLinksProvided = lovableLink && githubLink && deployLink;
    const isReadyToShip = allStepsCompleted && allLinksProvided;

    const generateSubmission = () => {
        return `
# Project 3: AI Resume Builder - Submission

## Links
- Lovable: ${lovableLink}
- GitHub: ${githubLink}
- Deployment: ${deployLink}

## Step Status
${steps.map(step => `- [x] ${step.label}`).join('\n')}

## Completion
- Date: ${new Date().toLocaleDateString()}
        `.trim();
    };

    const handleCopy = () => {
        if (!isReadyToShip) {
            alert("Please complete all steps and provide all links to generate submission.");
            return;
        }
        navigator.clipboard.writeText(generateSubmission());
        setCopyStatus('Copied to Clipboard!');
        setTimeout(() => setCopyStatus('Copy Final Submission'), 2000);
    };

    return (
        <div className="max-w-3xl mx-auto py-10 space-y-10">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Final Proof & Submission</h1>
                <p className="text-lg text-slate-600">Review your progress and submit your project.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="font-bold text-slate-900 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                        Step Completion Status
                    </h2>
                </div>
                <div className="p-6 grid gap-4 md:grid-cols-2">
                    {steps.map((step, index) => {
                        const status = getStepStatus(step.id);
                        return (
                            <div key={step.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50">
                                <span className="font-medium text-slate-700">{index + 1}. {step.label}</span>
                                {status.status === 'completed' ? (
                                    <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full">Completed</span>
                                ) : (
                                    <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-full">Pending</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="font-bold text-slate-900 flex items-center gap-2">
                        <ExternalLink className="w-5 h-5 text-blue-600" />
                        Project Links
                    </h2>
                </div>
                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Lovable Project Link</label>
                        <input
                            type="url"
                            placeholder="https://lovable.dev/..."
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={lovableLink}
                            onChange={(e) => setLovableLink(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">GitHub Repository</label>
                        <input
                            type="url"
                            placeholder="https://github.com/..."
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={githubLink}
                            onChange={(e) => setGithubLink(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Deployed URL</label>
                        <input
                            type="url"
                            placeholder="https://vercel.app/..."
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={deployLink}
                            onChange={(e) => setDeployLink(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center gap-4">
                <button
                    onClick={handleCopy}
                    disabled={!isReadyToShip}
                    className={`w-full max-w-md py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${isReadyToShip
                            ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                >
                    <Copy className="w-5 h-5" />
                    {copyStatus}
                </button>
                {!isReadyToShip && (
                    <p className="text-sm text-amber-600 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Complete all steps and fill all links to enable submission.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProofPage;
