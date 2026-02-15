import { useState, useEffect } from 'react';

const STORAGE_KEY = 'rb-progress';

const STEPS = [
    { id: '01-problem', label: 'Problem Statement' },
    { id: '02-market', label: 'Market Research' },
    { id: '03-architecture', label: 'Architecture' },
    { id: '04-hld', label: 'HLD' },
    { id: '05-lld', label: 'LLD' },
    { id: '06-build', label: 'Build' },
    { id: '07-test', label: 'Test' },
    { id: '08-ship', label: 'Ship' },
];

export const useStepProgress = () => {
    const [progress, setProgress] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
    });

    const updateStep = (stepId, status, artifact) => {
        const newProgress = {
            ...progress,
            [stepId]: { status, artifact }
        };
        setProgress(newProgress);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
    };

    const getStepStatus = (stepId) => {
        return progress[stepId] || { status: 'pending', artifact: null };
    };

    const isStepCompleted = (stepId) => {
        return progress[stepId]?.status === 'completed';
    };

    const canAccessStep = (stepId) => {
        const index = STEPS.findIndex(s => s.id === stepId);
        if (index === 0) return true;
        const prevStepId = STEPS[index - 1].id;
        return isStepCompleted(prevStepId);
    };

    return {
        steps: STEPS,
        progress,
        updateStep,
        getStepStatus,
        isStepCompleted,
        canAccessStep
    };
};
