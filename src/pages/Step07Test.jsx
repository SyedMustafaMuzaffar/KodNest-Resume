import React, { useState, useEffect } from 'react';

const CHECKLIST_ITEMS = [
    { id: 'resume_gen', label: 'Resume Generation: Data flows correctly to preview.' },
    { id: 'template_switch', label: 'Template Switching: Layouts change without data loss.' },
    { id: 'color_theme', label: 'Color Themes: Accents update across all templates.' },
    { id: 'ats_score', label: 'ATS Scoring: Score calculates live and updates UI.' },
    { id: 'pdf_export', label: 'PDF Export: Download button works (toast appears).' },
    { id: 'data_persist', label: 'Persistence: Data remains after page refresh.' },
    { id: 'empty_states', label: 'Empty States: UI handles missing fields gracefully.' },
    { id: 'mobile_resp', label: 'Mobile: Layout is usable on smaller screens.' },
    { id: 'copy_text', label: 'Copy Function: Text output is formatted correctly.' },
    { id: 'no_console', label: 'Console: No errors during navigation/usage.' }
];

const Step07Test = () => {
    const [checkedItems, setCheckedItems] = useState(() => {
        const saved = localStorage.getItem('rb_test_checklist');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('rb_test_checklist', JSON.stringify(checkedItems));
    }, [checkedItems]);

    const toggleItem = (id) => {
        setCheckedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const passedCount = Object.values(checkedItems).filter(Boolean).length;
    const isAllPassed = passedCount === CHECKLIST_ITEMS.length;

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Step 7: Testing & QA</h1>
                <p className="text-lg text-slate-600">
                    Verify all core functionalities before shipping efficiently.
                </p>
            </header>

            {/* Progress Summary */}
            <div className={`p-6 rounded-xl border ${isAllPassed ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200 shadow-sm'}`}>
                <div className="flex justify-between items-center mb-2">
                    <h3 className={`font-bold ${isAllPassed ? 'text-green-800' : 'text-slate-800'}`}>
                        Test Progress
                    </h3>
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${isAllPassed ? 'bg-green-200 text-green-800' : 'bg-slate-100 text-slate-600'}`}>
                        {passedCount} / {CHECKLIST_ITEMS.length} Passed
                    </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ${isAllPassed ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: `${(passedCount / CHECKLIST_ITEMS.length) * 100}%` }}
                    />
                </div>
                {!isAllPassed && (
                    <p className="text-sm text-slate-500 mt-2">
                        You must pass all 10 tests to unlock the Ship step.
                    </p>
                )}
            </div>

            {/* Checklist */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {CHECKLIST_ITEMS.map((item, index) => (
                    <label
                        key={item.id}
                        className={`flex items-center gap-4 p-4 border-b border-slate-100 last:border-0 cursor-pointer transition-colors ${checkedItems[item.id] ? 'bg-slate-50/50' : 'hover:bg-slate-50'}`}
                    >
                        <input
                            type="checkbox"
                            checked={!!checkedItems[item.id]}
                            onChange={() => toggleItem(item.id)}
                            className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                            <span className={`text-sm font-medium ${checkedItems[item.id] ? 'text-slate-900' : 'text-slate-700'}`}>
                                {item.label}
                            </span>
                        </div>
                    </label>
                ))}
            </div>

            <div className="flex justify-end">
                <button
                    onClick={() => setCheckedItems({})}
                    className="text-sm text-slate-400 hover:text-red-500 underline"
                >
                    Reset Checklist
                </button>
            </div>
        </div>
    );
};

export default Step07Test;
