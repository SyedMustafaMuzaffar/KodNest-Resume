import React from 'react';

const Step05LLD = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-900">Step 5: Low Level Design (LLD)</h1>
            <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-600">
                    Detailed component design, API contracts, and database schema.
                </p>

                <h3>Component Hierarchy</h3>
                <ul>
                    <li>App (Root)</li>
                    <li>PremiumLayout (Wrapper)</li>
                    <li>StepPages (01-08)</li>
                    <li>ProofPage</li>
                </ul>
            </div>
        </div>
    );
};

export default Step05LLD;
