import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="min-h-screen bg-background font-sans text-foreground antialiased">
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold tracking-tight font-serif">KodNest Resume</span>
                    </div>
                    <nav className="flex items-center gap-6">
                        <NavLink
                            to="/builder"
                            className={({ isActive }) =>
                                `text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`
                            }
                        >
                            Builder
                        </NavLink>
                        <NavLink
                            to="/preview"
                            className={({ isActive }) =>
                                `text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`
                            }
                        >
                            Preview
                        </NavLink>
                        <NavLink
                            to="/proof"
                            className={({ isActive }) =>
                                `text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`
                            }
                        >
                            Proof
                        </NavLink>
                    </nav>
                </div>
            </header>
            <main className="container mx-auto py-8 px-4 flex-1">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
