import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';

const Preview = () => {
    const { resumeData, selectedTemplate, selectedColor, atsScore, improvements } = useResume();
    const { personal, summary, education, experience, projects, skills, links } = resumeData;
    const [copyStatus, setCopyStatus] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [showScoreDetails, setShowScoreDetails] = useState(false);

    // --- Validation Logic ---
    const isComplete = personal.name && (experience.length > 0 || projects.length > 0);

    // --- Helpers ---
    const getScoreColor = (score) => {
        if (score <= 40) return '#ef4444'; // Red-500
        if (score <= 70) return '#f59e0b'; // Amber-500
        return '#22c55e'; // Green-500
    };

    const getScoreLabel = (score) => {
        if (score <= 40) return 'Needs Work';
        if (score <= 70) return 'Getting There';
        return 'Strong Resume';
    };

    // Get flattened skills for copy/print if needed, or check if any exist
    const getAllSkills = () => {
        if (!skills) return [];
        // Handle migration case where skills might be string temporarily
        if (typeof skills === 'string') return skills.split(',').filter(Boolean);
        return [
            ...(skills.technical || []),
            ...(skills.tools || []),
            ...(skills.soft || [])
        ];
    };

    const hasSkills = getAllSkills().length > 0;

    // --- Actions ---
    const handlePrint = () => {
        window.print();
        setToastMessage("PDF export ready! Check your downloads.");
        setTimeout(() => setToastMessage(''), 3000);
    };

    const handleCopyText = () => {
        const lines = [];
        lines.push(personal.name?.toUpperCase() || 'NAME');

        const contact = [personal.email, personal.phone, personal.location, links.linkedin, links.github].filter(Boolean).join(' | ');
        if (contact) lines.push(contact);

        if (summary) {
            lines.push('\nSUMMARY');
            lines.push(summary);
        }

        if (experience.length > 0) {
            lines.push('\nEXPERIENCE');
            experience.forEach(exp => {
                lines.push(`${exp.role} at ${exp.company} (${exp.duration})`);
                if (exp.description) lines.push(exp.description);
            });
        }

        if (projects.length > 0) {
            lines.push('\nPROJECTS');
            projects.forEach(proj => {
                lines.push(`${proj.title} ${proj.liveUrl ? `(${proj.liveUrl})` : ''}`);
                if (proj.techStack?.length > 0) lines.push(`Tech Stack: ${proj.techStack.join(', ')}`);
                if (proj.description) lines.push(proj.description);
            });
        }

        if (education.length > 0) {
            lines.push('\nEDUCATION');
            education.forEach(edu => {
                lines.push(`${edu.institution} - ${edu.degree} (${edu.year})`);
            });
        }

        if (hasSkills) {
            lines.push('\nSKILLS');
            if (skills.technical?.length) lines.push(`Technical: ${skills.technical.join(', ')}`);
            if (skills.tools?.length) lines.push(`Tools: ${skills.tools.join(', ')}`);
            if (skills.soft?.length) lines.push(`Soft Skills: ${skills.soft.join(', ')}`);
        }

        navigator.clipboard.writeText(lines.join('\n'));
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus(''), 2000);
    };

    // --- TEMPLATE COMPONENTS ---

    const ClassicTemplate = () => (
        <div className="font-serif text-black">
            <header className="border-b-[1px] pb-4 mb-6 text-center" style={{ borderColor: selectedColor }}>
                <h1 className="text-4xl font-bold uppercase tracking-wide mb-2" style={{ color: selectedColor }}>{personal.name || 'Your Name'}</h1>
                <div className="flex flex-wrap justify-center gap-x-4 text-sm text-gray-700 font-medium">
                    {personal.email && <span>{personal.email}</span>}
                    {personal.phone && <span>{personal.phone}</span>}
                    {personal.location && <span>{personal.location}</span>}
                    {links.linkedin && <span>{links.linkedin}</span>}
                    {links.github && <span>{links.github}</span>}
                </div>
            </header>

            {summary && (
                <section className="mb-6 break-inside-avoid">
                    <h2 className="text-sm font-bold uppercase tracking-widest border-b-[1px] pb-1 mb-3 text-center" style={{ borderColor: 'rgb(209 213 219)', color: selectedColor }}>Summary</h2>
                    <p className="text-sm leading-relaxed text-gray-900 text-justify">{summary}</p>
                </section>
            )}

            {/* Structured Skills for Classic: Grouped by category */}
            {hasSkills && (
                <section className="mb-6 break-inside-avoid">
                    <h2 className="text-sm font-bold uppercase tracking-widest border-b-[1px] pb-1 mb-3 text-center" style={{ borderColor: 'rgb(209 213 219)', color: selectedColor }}>Skills</h2>
                    <div className="text-center text-sm space-y-1">
                        {skills.technical?.length > 0 && (
                            <div><span className="font-bold">Technical:</span> {skills.technical.join(', ')}</div>
                        )}
                        {skills.tools?.length > 0 && (
                            <div><span className="font-bold">Tools:</span> {skills.tools.join(', ')}</div>
                        )}
                        {skills.soft?.length > 0 && (
                            <div><span className="font-bold">Soft Skills:</span> {skills.soft.join(', ')}</div>
                        )}
                    </div>
                </section>
            )}

            <Section title="Experience" data={experience} renderItem={(item) => (
                <div className="mb-4 break-inside-avoid">
                    <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-base">{item.role}</h3>
                        <span className="text-sm text-gray-700 italic">{item.duration}</span>
                    </div>
                    <div className="text-sm font-medium text-gray-800 mb-1">{item.company}</div>
                    <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-line">{item.description}</p>
                </div>
            )} />

            <Section title="Projects" data={projects} renderItem={(item) => (
                <div className="mb-4 break-inside-avoid">
                    <div className="flex justify-between items-baseline mb-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base">{item.title}</h3>
                            <div className="flex gap-2 text-xs">
                                {item.liveUrl && <span className="text-gray-600 underline">{item.liveUrl}</span>}
                            </div>
                        </div>
                    </div>
                    <div className="mb-1">
                        {item.techStack?.length > 0 && (
                            <span className="text-xs italic text-gray-700">Stack: {item.techStack.join(', ')}</span>
                        )}
                    </div>
                    <p className="text-sm text-gray-900 leading-relaxed text-justify">{item.description}</p>
                </div>
            )} />

            <Section title="Education" data={education} renderItem={(item) => (
                <div className="flex justify-between items-baseline mb-2 break-inside-avoid">
                    <div>
                        <h3 className="font-bold text-base">{item.institution}</h3>
                        <div className="text-sm text-gray-800">{item.degree}</div>
                    </div>
                    <span className="text-sm text-gray-700 italic">{item.year}</span>
                </div>
            )} />
        </div>
    );

    const ModernTemplate = () => (
        <div className="font-sans text-black grid grid-cols-[30%_70%] min-h-full">
            {/* Left Sidebar */}
            <div className="text-white p-6 space-y-8" style={{ backgroundColor: selectedColor }}>
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold leading-tight">{personal.name || 'Your Name'}</h1>
                    <div className="text-sm space-y-2 opacity-90">
                        {personal.email && <div className="break-all">{personal.email}</div>}
                        {personal.phone && <div>{personal.phone}</div>}
                        {personal.location && <div>{personal.location}</div>}
                        {links.linkedin && <div className="break-all">{links.linkedin}</div>}
                        {links.github && <div className="break-all">{links.github}</div>}
                    </div>
                </div>

                {hasSkills && (
                    <div className="space-y-4">
                        <h2 className="text-xs font-bold uppercase tracking-widest border-b border-white/30 pb-1">Skills</h2>
                        <div className="space-y-4 text-sm">
                            {skills.technical?.length > 0 && (
                                <div>
                                    <div className="font-bold opacity-70 mb-1 text-xs uppercase">Technical</div>
                                    <div className="flex flex-wrap gap-1">
                                        {skills.technical.map(s => <span key={s} className="bg-white/20 px-2 py-0.5 rounded textxs">{s}</span>)}
                                    </div>
                                </div>
                            )}
                            {skills.tools?.length > 0 && (
                                <div>
                                    <div className="font-bold opacity-70 mb-1 text-xs uppercase">Tools</div>
                                    <div className="flex flex-wrap gap-1">
                                        {skills.tools.map(s => <span key={s} className="bg-white/20 px-2 py-0.5 rounded textxs">{s}</span>)}
                                    </div>
                                </div>
                            )}
                            {skills.soft?.length > 0 && (
                                <div>
                                    <div className="font-bold opacity-70 mb-1 text-xs uppercase">Soft Skills</div>
                                    <div className="flex flex-wrap gap-1">
                                        {skills.soft.map(s => <span key={s} className="bg-white/20 px-2 py-0.5 rounded textxs">{s}</span>)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {education.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-xs font-bold uppercase tracking-widest border-b border-white/30 pb-1">Education</h2>
                        <div className="space-y-3">
                            {education.map((edu, idx) => (
                                <div key={idx} className="text-sm">
                                    <div className="font-bold">{edu.institution}</div>
                                    <div className="opacity-90">{edu.degree}</div>
                                    <div className="opacity-70 text-xs">{edu.year}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Right Content */}
            <div className="p-8">
                {summary && (
                    <section className="mb-8 break-inside-avoid">
                        <h2 className="text-lg font-bold text-slate-900 mb-3 border-b-2 pb-1" style={{ borderColor: selectedColor, color: selectedColor }}>Professional Profile</h2>
                        <p className="text-sm leading-relaxed text-slate-800">{summary}</p>
                    </section>
                )}

                <SectionModern title="Experience" data={experience} renderItem={(item) => (
                    <div className="mb-6 break-inside-avoid">
                        <div className="flex justify-between items-baseline mb-1">
                            <h3 className="font-bold text-base text-slate-900">{item.role}</h3>
                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{item.duration}</span>
                        </div>
                        <div className="text-sm font-medium text-slate-700 mb-2 italic">{item.company}</div>
                        <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">{item.description}</p>
                    </div>
                )} />

                <SectionModern title="Projects" data={projects} renderItem={(item) => (
                    <div className="mb-6 break-inside-avoid">
                        <div className="flex flex-wrap items-baseline gap-2 mb-1">
                            <h3 className="font-bold text-base text-slate-900">{item.title}</h3>
                            <div className="flex gap-2">
                                {item.liveUrl && <span className="text-xs text-slate-600 font-mono bg-slate-50 px-1 rounded border border-slate-200">Live</span>}
                                {item.githubUrl && <span className="text-xs text-slate-600 font-mono bg-slate-50 px-1 rounded border border-slate-200">GitHub</span>}
                            </div>
                        </div>
                        {item.techStack?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                                {item.techStack.map(t => <span key={t} className="text-[10px] uppercase font-bold text-slate-500 border border-slate-200 px-1 rounded">{t}</span>)}
                            </div>
                        )}
                        <p className="text-sm text-slate-800 leading-relaxed text-justify">{item.description}</p>
                    </div>
                )} />
            </div>
        </div>
    );


    const MinimalTemplate = () => (
        <div className="font-sans text-sm text-black">
            <header className="mb-8 flex justify-between items-end border-b pb-4 break-inside-avoid" style={{ borderColor: selectedColor }}>
                <div>
                    <h1 className="text-4xl font-light tracking-tight mb-1" style={{ color: selectedColor }}>{personal.name || 'Your Name'}</h1>
                    <p className="text-gray-600">{personal.location}</p>
                </div>
                <div className="text-right text-gray-600 text-xs space-y-1">
                    {personal.email && <div>{personal.email}</div>}
                    {personal.phone && <div>{personal.phone}</div>}
                    {links.linkedin && <div>{links.linkedin}</div>}
                </div>
            </header>

            <div className="grid grid-cols-1 gap-8">
                {summary && (
                    <section className="break-inside-avoid">
                        <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: selectedColor }}>Summary</h2>
                        <p className="leading-relaxed text-gray-900">{summary}</p>
                    </section>
                )}

                {hasSkills && (
                    <section className="break-inside-avoid">
                        <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: selectedColor }}>Skills</h2>
                        <div className="grid grid-cols-[100px_1fr] gap-y-2">
                            {skills.technical?.length > 0 && (
                                <>
                                    <span className="text-xs font-medium text-gray-500">Technical</span>
                                    <span className="text-gray-900">{skills.technical.join(', ')}</span>
                                </>
                            )}
                            {skills.tools?.length > 0 && (
                                <>
                                    <span className="text-xs font-medium text-gray-500">Tools</span>
                                    <span className="text-gray-900">{skills.tools.join(', ')}</span>
                                </>
                            )}
                            {skills.soft?.length > 0 && (
                                <>
                                    <span className="text-xs font-medium text-gray-500">Soft Skills</span>
                                    <span className="text-gray-900">{skills.soft.join(', ')}</span>
                                </>
                            )}
                        </div>
                    </section>
                )}

                <SectionMinimal title="Experience" data={experience} renderItem={(item) => (
                    <div className="mb-4">
                        <div className="flex justify-between font-medium mb-1 text-gray-900">
                            <span>{item.role}</span>
                            <span className="text-gray-600 text-xs">{item.duration}</span>
                        </div>
                        <div className="text-gray-700 mb-1 text-xs">{item.company}</div>
                        <p className="text-gray-900 leading-relaxed text-xs">{item.description}</p>
                    </div>
                )} />

                <SectionMinimal title="Projects" data={projects} renderItem={(item) => (
                    <div className="mb-4">
                        <div className="flex justify-between font-medium mb-1 text-gray-900">
                            <span>{item.title}</span>
                            <div className="flex gap-2">
                                {item.liveUrl && <span className="text-gray-500 text-[10px]">LIVE</span>}
                            </div>
                        </div>
                        {item.techStack?.length > 0 && <div className="text-gray-500 text-[10px] mb-1">{item.techStack.join(' • ')}</div>}
                        <p className="text-gray-900 leading-relaxed text-xs">{item.description}</p>
                    </div>
                )} />

                <SectionMinimal title="Education" data={education} renderItem={(item) => (
                    <div className="mb-4">
                        <div className="flex justify-between font-medium mb-1 text-gray-900">
                            <span>{item.institution}</span>
                            <span className="text-gray-600 text-xs">{item.year}</span>
                        </div>
                        <div className="text-gray-700 mb-1 text-xs">{item.degree}</div>
                    </div>
                )} />

            </div>
        </div>
    );

    // --- Helpers ---

    const Section = ({ title, data, renderItem }) => (
        data.length > 0 && (
            <section className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-widest border-b-[1px] border-gray-300 pb-1 mb-3 text-center" style={{ borderColor: 'rgb(209 213 219)', color: selectedColor }}>{title}</h2>
                <div>{data.map((item, i) => <div key={i}>{renderItem(item)}</div>)}</div>
            </section>
        )
    );

    const SectionModern = ({ title, data, renderItem }) => (
        data.length > 0 && (
            <section className="mb-8">
                <h2 className="text-lg font-bold text-slate-900 mb-4 border-b-2 pb-1" style={{ borderColor: selectedColor, color: selectedColor }}>{title}</h2>
                <div>{data.map((item, i) => <div key={i}>{renderItem(item)}</div>)}</div>
            </section>
        )
    );

    const SectionMinimal = ({ title, data, renderItem }) => (
        data.length > 0 && (
            <section className="break-inside-avoid">
                <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: selectedColor }}>{title}</h2>
                <div className="space-y-4">
                    {data.map((item, i) => (
                        <div key={i}>{renderItem(item)}</div>
                    ))}
                </div>
            </section>
        )
    );


    return (
        <>
            {/* Print specific styles */}
            <style>
                {`
                    @media print {
                        @page { margin: 0; size: auto; }
                        body { background: white; -webkit-print-color-adjust: exact; }
                        .no-print { display: none !important; }
                        .print-container { 
                            box-shadow: none !important; 
                            margin: 0 !important; 
                            width: 100% !important; 
                            max-width: none !important; 
                            padding: 0 !important;
                        }
                    }
                `}
            </style>

            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50 animate-fade-in-down no-print flex items-center gap-2">
                    <span>✅</span> {toastMessage}
                </div>
            )}

            <div className={`max-w-[210mm] mx-auto min-h-[297mm] print:min-h-0 bg-white shadow-lg print-container text-black transition-all duration-300 relative ${selectedTemplate === 'modern' ? 'p-0' : 'p-[15mm]'}`}>

                {/* Action Bar (Hidden in Print) */}
                <div className="no-print absolute top-0 left-0 right-0 -mt-20 flex items-center justify-between bg-white p-4 rounded-xl border shadow-sm z-20">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            {/* Score Circle */}
                            <div className="relative group cursor-pointer" onClick={() => setShowScoreDetails(!showScoreDetails)}>
                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-100 shadow-inner"
                                    style={{ background: `conic-gradient(${getScoreColor(atsScore)} ${atsScore * 3.6}deg, #e2e8f0 0deg)` }}>
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xs font-bold text-slate-800">
                                        {atsScore}
                                    </div>
                                </div>

                                {/* Score Details Dropdown */}
                                {showScoreDetails && (
                                    <div className="absolute top-14 left-0 w-64 bg-white rounded-lg shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-bold text-slate-700 text-sm">ATS Score Analysis</h3>
                                            <button onClick={(e) => { e.stopPropagation(); setShowScoreDetails(false); }} className="text-slate-400 hover:text-slate-600">×</button>
                                        </div>
                                        <div className="text-center mb-3">
                                            <span className="text-2xl font-bold flex items-center justify-center gap-1" style={{ color: getScoreColor(atsScore) }}>
                                                {atsScore} <span className="text-sm text-slate-400 font-normal">/ 100</span>
                                            </span>
                                            <div className="text-xs font-medium uppercase tracking-wider text-slate-500">{getScoreLabel(atsScore)}</div>
                                        </div>

                                        {improvements.length > 0 ? (
                                            <div className="space-y-2">
                                                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Improvements</div>
                                                <ul className="space-y-1.5">
                                                    {improvements.map((imp, i) => (
                                                        <li key={i} className="text-xs text-slate-600 flex gap-1.5 items-start">
                                                            <span className="text-amber-500 mt-0.5">•</span>
                                                            <span className="leading-tight">{imp}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : (
                                            <div className="text-xs text-center text-green-600 bg-green-50 p-2 rounded border border-green-200">
                                                🎉 Excellent work! Your resume is ready.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="text-xs font-bold text-slate-700">ATS Score</div>
                                <div className="text-[10px] font-medium" style={{ color: getScoreColor(atsScore) }}>{getScoreLabel(atsScore)}</div>
                            </div>
                        </div>

                        {!isComplete && (
                            <span className="text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded border border-amber-200 flex items-center gap-1">
                                ⚠️ Incomplete
                            </span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleCopyText}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded transition-colors"
                        >
                            {copyStatus || "Copy Text"}
                        </button>
                        <button
                            onClick={handlePrint}
                            className="bg-black hover:bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors"
                        >
                            Print / Save as PDF
                        </button>
                    </div>
                </div>

                {/* Templates */}
                {selectedTemplate === 'modern' ? <ModernTemplate /> :
                    selectedTemplate === 'minimal' ? <MinimalTemplate /> :
                        <ClassicTemplate />}
            </div>
        </>
    );
};

export default Preview;
