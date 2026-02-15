import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Circle, Lock, ArrowRight, Copy, ExternalLink, AlertTriangle } from 'lucide-react';
import { useStepProgress } from '../hooks/useStepProgress';

const PremiumLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { steps, getStepStatus, updateStep, canAccessStep } = useStepProgress();

    // Extract step ID from path
    const currentStepId = location.pathname.split('/').pop();
    const currentStepIndex = steps.findIndex(s => s.id === currentStepId);
    const currentStep = steps[currentStepIndex];

    const [artifactInput, setArtifactInput] = useState('');
    const [copyStatus, setCopyStatus] = useState('Copy');

    // Load existing artifact into input when step changes
    useEffect(() => {
        const status = getStepStatus(currentStepId);
        if (status.artifact) {
            setArtifactInput(status.artifact);
        } else {
            setArtifactInput('');
        }
    }, [currentStepId]);

    const handleCopy = () => {
        navigator.clipboard.writeText(artifactInput);
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus('Copy'), 2000);
    };

    const handleStatusUpdate = (status) => {
        // LOCK LOGIC: Step 7 Check
        if (currentStepId === '07-test') {
            const checklist = JSON.parse(localStorage.getItem('rb_test_checklist') || '{}');
            const passedCount = Object.values(checklist).filter(Boolean).length;
            if (passedCount < 10) {
                alert("You must complete all 10 checklist items before proceeding.");
                return;
            }
        }

        if (!artifactInput.trim()) {
            alert("Please enter an artifact (link, text, or screenshot description) before completing the step.");
            return;
        }
        updateStep(currentStepId, 'completed', artifactInput);
    };

    const handleNext = () => {
        if (currentStepIndex < steps.length - 1) {
            navigate(`/rb/${steps[currentStepIndex + 1].id}`);
        } else {
            navigate('/rb/proof');
        }
    };

    if (!currentStep && location.pathname !== '/rb/proof') {
        return <div className="p-10">Loading or Invalid Step...</div>;
    }

    // Calculate progress for top bar
    const progressPercent = ((currentStepIndex + 1) / 8) * 100;

    return (
        <div className="h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
            {/* Top Bar */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                        RB
                    </div>
                    <span className="font-bold text-lg tracking-tight">AI Resume Builder</span>
                </div>

                <div className="flex-1 max-w-xl mx-auto text-center">
                    <div className="text-sm font-medium text-slate-500 mb-1">
                        Project 3 — Step {currentStepIndex + 1} of 8
                    </div>
                    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 transition-all duration-500 ease-out"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                <div className="items-end min-w-[120px]">
                    {getStepStatus(currentStepId).status === 'completed' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-200">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Completed
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200">
                            <Circle className="w-3.5 h-3.5" />
                            In Progress
                        </span>
                    )}
                </div>
            </header>

            {/* Main Workspace */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Content (70%) */}
                <main className="flex-1 overflow-y-auto p-8 border-r border-slate-200 bg-white">
                    <div className="max-w-4xl mx-auto">
                        <Outlet />
                    </div>
                </main>

                {/* Right Panel: Build & Verify (30%) */}
                <aside className="w-[400px] shrink-0 bg-slate-50 flex flex-col border-l border-slate-200">
                    <div className="p-6 flex-1 overflow-y-auto">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                                    Build Context
                                </h3>
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                                    <label className="text-xs font-medium text-slate-500 block">
                                        Copy This Into Lovable
                                    </label>
                                    <textarea
                                        className="w-full h-32 p-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none font-mono"
                                        placeholder="Prompt content for this step..."
                                        value={artifactInput}
                                        onChange={(e) => setArtifactInput(e.target.value)}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleCopy}
                                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                        >
                                            <Copy className="w-4 h-4" />
                                            {copyStatus}
                                        </button>
                                        <a
                                            href="https://lovable.dev"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 rounded-lg text-sm font-medium text-white hover:bg-slate-800 transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Build
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                                    Verification
                                </h3>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => handleStatusUpdate('completed')}
                                        className="w-full flex items-center justify-center gap-2 p-4 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors shadow-sm"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        It Worked
                                    </button>
                                    <button
                                        className="w-full flex items-center justify-center gap-2 p-4 bg-white border border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors"
                                    >
                                        <AlertTriangle className="w-5 h-5" />
                                        Error / Issue
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step Navigation Footer in Panel */}
                    <div className="p-6 border-t border-slate-200 bg-white">
                        <button
                            onClick={handleNext}
                            disabled={getVideoStatus(currentStepId).status !== 'completed'}
                            className={`w-full flex items-center justify-center gap-2 p-4 rounded-xl font-bold text-lg transition-all ${getStepStatus(currentStepId).status === 'completed'
                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            Next Step
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </aside>
            </div>

            {/* Proof Footer (Global Status) */}
            <footer className="h-12 bg-white border-t border-slate-200 flex items-center justify-center gap-8 px-6 text-xs font-medium text-slate-500">
                {steps.map((step, index) => {
                    const status = getStepStatus(step.id);
                    return (
                        <div key={step.id} className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${status.status === 'completed' ? 'bg-green-500' : 'bg-slate-300'}`} />
                            <span className={status.status === 'completed' ? 'text-slate-900' : ''}>
                                {index + 1}. {step.label}
                            </span>
                        </div>
                    );
                })}
            </footer>
        </div>
    );

    function getVideoStatus(id) {
        return getStepStatus(id);
    }
};

export default PremiumLayout;
