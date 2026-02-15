import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
            <h1 className="text-5xl font-extrabold tracking-tight lg:text-7xl font-serif mb-6">
                Build a Resume That <span className="text-primary">Gets Read.</span>
            </h1>
            <p className="max-w-[600px] text-lg text-muted-foreground mb-10">
                Create a professional, ATS-friendly resume in minutes. No distractions, just pure focus on your career story.
            </p>
            <Link
                to="/builder"
                className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
                Start Building
            </Link>
        </div>
    );
};

export default Home;
