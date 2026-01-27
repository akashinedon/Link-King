'use client';

import { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ArrowRight,
    Link2,
    BarChart3,
    Palette,
    Zap,
    Github,
    Sparkles,
    Moon,
    Sun,
    Shield,
    Globe,
    Smartphone,
    ChevronRight,
    ChevronDown
} from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { Plus, Check, ExternalLink, Copy, MousePointer2, Linkedin, Youtube, MessageCircle, Send, Lock, Code, Terminal, CheckCircle2, Twitter, Instagram } from 'lucide-react';

// Animated Laptop Demo Component
// Animated Laptop Demo Component
function LaptopDemo({ isDark }: { isDark: boolean }) {
    const [step, setStep] = useState(0);
    const [typedText, setTypedText] = useState('');
    const [showCursor, setShowCursor] = useState(true);
    const [cursorPos, setCursorPos] = useState({ x: 300, y: 150 });
    const [hoveredLink, setHoveredLink] = useState(-1);
    const [isClicking, setIsClicking] = useState(false);

    const steps = [
        { title: 'Create your profile', subtitle: 'Choose your username' },
        { title: 'Add your first link', subtitle: 'Connect your socials' },
        { title: 'Your links are ready', subtitle: 'All connected!' },
        { title: 'Share your MiniLink!', subtitle: 'Copy & share' },
    ];

    // 🔴 CHANGED: Username
    const username = 'aakash';

    // SVG icons for each link
    const linkIcons = {
        portfolio: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
        linkedin: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>,
        twitter: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
        github: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>,
    };

    const links = [
        { name: 'Portfolio', icon: linkIcons.portfolio, color: 'from-blue-500 to-cyan-500' },
        { name: 'LinkedIn', icon: linkIcons.linkedin, color: 'from-blue-600 to-blue-700' },
        { name: 'GitHub', icon: linkIcons.github, color: 'from-purple-600 to-purple-800' },
    ];

    // Step 0: Typing animation with cursor following
    useEffect(() => {
        if (step === 0) {
            setTypedText('');
            setHoveredLink(-1);
            setIsClicking(false);
            setCursorPos({ x: 320, y: 155 });
            let i = 0;
            const typingInterval = setInterval(() => {
                if (i < username.length) {
                    setTypedText(username.slice(0, i + 1));
                    setCursorPos({ x: 320 + (i * 8), y: 155 });
                    i++;
                } else {
                    clearInterval(typingInterval);
                }
            }, 200);
            return () => clearInterval(typingInterval);
        }
    }, [step]);

    // Step 1: Cursor moves to Add Link button
    useEffect(() => {
        if (step === 1) {
            setHoveredLink(-1);
            setIsClicking(false);
            const timer = setTimeout(() => {
                setCursorPos({ x: 310, y: 225 });
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [step]);

    // Step 2: Cursor hovers over each link sequentially
    useEffect(() => {
        if (step === 2) {
            setIsClicking(false);
            let currentLink = 0;
            const linkPositions = [
                { x: 420, y: 175 },
                { x: 420, y: 210 },
                { x: 420, y: 245 },
            ];

            setHoveredLink(0);
            setCursorPos(linkPositions[0]);

            const hoverInterval = setInterval(() => {
                currentLink = (currentLink + 1) % 3;
                setHoveredLink(currentLink);
                setCursorPos(linkPositions[currentLink]);
            }, 600);

            return () => clearInterval(hoverInterval);
        }
    }, [step]);

    // Step 3: Show congratulations
    useEffect(() => {
        if (step === 3) {
            setHoveredLink(-1);
            setIsClicking(false);
            setCursorPos({ x: 300, y: 200 });
        }
    }, [step]);

    useEffect(() => {
        const cursorInterval = setInterval(() => setShowCursor(s => !s), 530);
        return () => clearInterval(cursorInterval);
    }, []);

    useEffect(() => {
        const stepInterval = setInterval(() => {
            setStep(s => (s + 1) % 4);
        }, 3500);
        return () => clearInterval(stepInterval);
    }, []);

    return (
        <div className="relative">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                {steps.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-violet-500' : 'w-1.5 bg-gray-300 dark:bg-gray-600'}`}
                    />
                ))}
            </div>

            <div className="relative w-[600px] h-[380px] bg-gray-900 rounded-t-xl p-2 shadow-2xl mx-auto">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-700 rounded-full"></div>
                <div className="w-full h-full rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
                    <div className="h-8 bg-gray-100 dark:bg-gray-800 flex items-center px-3 gap-2 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="flex-1 mx-2">
                            <div className="bg-white dark:bg-gray-700 rounded-md h-5 flex items-center px-2">
                                <span className="text-[10px] text-gray-400">minianonlink.vercel.app/dashboard</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 h-[calc(100%-2rem)]">
                        <div className="text-center mb-4">
                            <div className="text-xs text-violet-600 dark:text-violet-400 font-medium mb-1">Step {step + 1} of 4</div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{steps[step].title}</h3>
                            <p className="text-xs text-gray-500">{steps[step].subtitle}</p>
                        </div>

                        {step === 0 && (
                            <div className="flex flex-col items-center animate-fadeIn">
                                <div className="flex items-center gap-1 bg-white dark:bg-gray-700 rounded-xl px-4 py-3 shadow-lg border-2 border-violet-500 w-80">
                                    <span className="text-gray-400 text-xs">minianonlink.vercel.app/</span>
                                    <span className="text-gray-900 dark:text-white font-medium text-sm">{typedText}</span>
                                    <span className={`w-0.5 h-4 bg-violet-500 ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-green-500 text-xs">
                                    <Check className="w-3 h-3" />
                                    <span>Username available!</span>
                                </div>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="flex flex-col items-center gap-3 animate-fadeIn">
                                <div className="bg-white dark:bg-gray-700 rounded-xl p-3 shadow-lg border border-gray-200 dark:border-gray-600 w-72">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-6 h-6 rounded bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                                            {links[0].icon}
                                        </div>
                                        <input className="flex-1 bg-gray-50 dark:bg-gray-600 rounded-lg px-2 py-1 text-sm text-gray-700 dark:text-gray-200" defaultValue="Portfolio" readOnly />
                                    </div>
                                    {/* 🔴 CHANGED: Default URL */}
                                    <input className="w-full bg-gray-50 dark:bg-gray-600 rounded-lg px-2 py-1 text-xs text-gray-500" defaultValue="https://portfolioaakash.lovable.app" readOnly />
                                </div>
                                <button className="px-4 py-2 bg-gradient-to-r from-violet-600 to-pink-600 text-white text-sm font-medium rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all">
                                    <Plus className="w-4 h-4" />
                                    Add Link
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-2 animate-fadeIn">
                                {links.map((link, i) => (
                                    <div
                                        key={i}
                                        className={`flex items-center gap-3 bg-white dark:bg-gray-700 rounded-lg p-2 shadow-sm border transition-all duration-200 ${hoveredLink === i ? 'border-violet-500 scale-[1.02] shadow-lg' : 'border-gray-200 dark:border-gray-600'}`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${link.color} flex items-center justify-center text-white text-sm`}>
                                            {link.icon}
                                        </div>
                                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{link.name}</span>
                                        <Check className={`w-4 h-4 ml-auto transition-colors ${hoveredLink === i ? 'text-violet-500' : 'text-green-500'}`} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {step === 3 && (
                            <div className="flex flex-col items-center gap-4 animate-fadeIn">
                                <div className="text-4xl animate-bounce">🎉</div>
                                <h3 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                                    Congratulations!
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
                                    Your MiniLink is ready to share
                                </p>
                                <div className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-lg px-4 py-2 shadow-lg">
                                    {/* 🔴 CHANGED: Final URL */}
                                    <span className="text-sm font-medium">minianonlink.vercel.app/aakash</span>
                                    <ExternalLink className="w-4 h-4" />
                                </div>
                                <div className="grid grid-cols-4 gap-2 mt-2">
                                    {links.map((link, i) => (
                                        <div key={i} className={`w-10 h-10 rounded-lg bg-gradient-to-r ${link.color} flex items-center justify-center text-white shadow-lg animate-bounce`} style={{ animationDelay: `${i * 0.1}s` }}>
                                            {link.icon}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div
                className={`absolute pointer-events-none z-20 transition-all duration-300 ease-out ${isClicking ? 'scale-90' : ''}`}
                style={{ left: cursorPos.x, top: cursorPos.y }}
            >
                <MousePointer2 className="w-5 h-5 text-gray-800 dark:text-white drop-shadow-lg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
            </div>

            <div className="relative w-[680px] h-4 bg-gray-300 dark:bg-gray-700 rounded-b-xl -mt-1 mx-auto">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gray-400 dark:bg-gray-600 rounded-b"></div>
            </div>
            <div className="w-[700px] h-2 bg-gray-200 dark:bg-gray-800 rounded-b-3xl mx-auto shadow-lg"></div>
        </div>
    );
}

// Collapsing Logos Animation Component - shows social icons collapsing into one link
function CollapsingLogosAnimation() {
    const [phase, setPhase] = useState(0); // 0: scattered, 1: collapsing, 2: merged

    useEffect(() => {
        const timer = setInterval(() => {
            setPhase(p => (p + 1) % 3);
        }, 2000);
        return () => clearInterval(timer);
    }, []);

    const socialIcons = [
        { icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>, color: 'from-blue-600 to-blue-700', name: 'LinkedIn', pos: { x: -120, y: -80 } },
        { icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>, color: 'from-gray-700 to-gray-900', name: 'GitHub', pos: { x: 120, y: -80 } },
        { icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>, color: 'from-gray-800 to-black', name: 'X', pos: { x: -100, y: 80 } },
        { icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>, color: 'from-pink-500 to-purple-500', name: 'Instagram', pos: { x: 100, y: 80 } },
        { icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>, color: 'from-red-500 to-red-600', name: 'YouTube', pos: { x: 0, y: -100 } },
        { icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>, color: 'from-blue-400 to-cyan-400', name: 'Portfolio', pos: { x: 0, y: 100 } },
    ];

    return (
        <div className="relative w-[400px] h-[300px] mx-auto">
            {/* Scattered/Collapsing icons */}
            {socialIcons.map((social, i) => (
                <div
                    key={i}
                    className={`absolute left-1/2 top-1/2 transition-all duration-1000 ease-in-out ${phase === 2 ? 'opacity-0 scale-0' : 'opacity-100'}`}
                    style={{
                        transform: phase === 0
                            ? `translate(calc(-50% + ${social.pos.x}px), calc(-50% + ${social.pos.y}px)) rotate(${i * 15}deg)`
                            : 'translate(-50%, -50%) rotate(0deg) scale(0.5)',
                        transitionDelay: phase === 1 ? `${i * 100}ms` : '0ms',
                    }}
                >
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${social.color} flex items-center justify-center text-white shadow-lg`}>
                        {social.icon}
                    </div>
                </div>
            ))}

            {/* Center MiniLink logo that appears */}
            <div
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${phase === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
            >
                <div className="flex flex-col items-center gap-3">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-violet-500/30">
                        <span className="text-3xl font-black text-white">M</span>
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-lg text-gray-900 dark:text-white">
                            Mini<span className="text-violet-500">Link</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">All your links in one place</div>
                    </div>
                </div>
            </div>

            {/* Decorative connecting lines during collapse */}
            {phase === 1 && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-2 border-dashed border-violet-300 dark:border-violet-700 animate-spin" style={{ animationDuration: '3s' }}></div>
                </div>
            )}
        </div>
    );
}

// Typewriter Effect Component
function TypewriterEffect({ words }: { words: string[] }) {
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [reverse, setReverse] = useState(false);
    const [blink, setBlink] = useState(true);

    // Blinking cursor
    useEffect(() => {
        const timeout2 = setTimeout(() => {
            setBlink(!blink);
        }, 500);
        return () => clearTimeout(timeout2);
    }, [blink]);

    // Typing effect
    useEffect(() => {
        if (index >= words.length) {
            setIndex(0);
            return;
        }

        if (subIndex === words[index].length + 1 && !reverse) {
            const timeout = setTimeout(() => setReverse(true), 1500);
            return () => clearTimeout(timeout);
        }

        if (subIndex === 0 && reverse) {
            setReverse(false);
            setIndex((prev) => (prev + 1) % words.length);
            return;
        }

        const timeout = setTimeout(() => {
            setSubIndex((prev) => prev + (reverse ? -1 : 1));
        }, reverse ? 50 : 100);

        return () => clearTimeout(timeout);
    }, [subIndex, index, reverse, words]);

    return (
        <span className="inline-flex text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600">
            {`${words[index].substring(0, subIndex)}`}
            <span className={`${blink ? 'opacity-100' : 'opacity-0'} ml-1 text-violet-600`}>|</span>
        </span>
    );
}

// FAQ Accordion Item Component
function FAQItem({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
    return (
        <div
            className={`bg-gray-100 dark:bg-gray-800/50 rounded-2xl overflow-hidden border transition-all duration-300 ${isOpen ? 'border-violet-500/50 shadow-lg shadow-violet-500/10' : 'border-gray-200 dark:border-gray-700/50 hover:border-violet-400/30'}`}
        >
            <button
                onClick={onToggle}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
            >
                <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-violet-600 dark:text-violet-400' : 'text-gray-900 dark:text-white'}`}>{question}</span>
                <ChevronDown
                    className={`w-5 h-5 transition-all duration-300 ${isOpen ? 'rotate-180 text-violet-600 dark:text-violet-400' : 'text-gray-400 dark:text-gray-500'}`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="px-6 pb-5 text-gray-600 dark:text-gray-400 leading-relaxed">
                    {answer}
                </div>
            </div>
        </div>
    );
}

// Feature Demo Animations
// Feature Demo Animations
function AnimatedLinksFeature() {
    const [links, setLinks] = useState<number[]>([]);

    useEffect(() => {
        let step = 0;
        const interval = setInterval(() => {
            if (step < 2) {
                setLinks(prev => [...prev, step]);
                step++;
            } else {
                setLinks([]);
                step = 0;
            }
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    const linkData = [
        { icon: Linkedin, color: 'bg-[#0077b5]', text: 'LinkedIn' },
        { icon: Github, color: 'bg-[#333]', text: 'GitHub' },
        { icon: Youtube, color: 'bg-[#ff0000]', text: 'YouTube' },
        { icon: Twitter, color: 'bg-[#000000]', text: 'X / Twitter' }
    ];

    return (
        <div className="w-full max-w-[240px] space-y-3 opacity-90 p-4">
            {links.map((i) => {
                const data = linkData[i];
                if (!data) return null;
                const LinkIcon = data.icon;
                return (
                    <div key={i} className="h-12 w-full bg-white/10 backdrop-blur-md rounded-xl flex items-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-500 border border-white/10 shadow-lg">
                        <div className={`w-8 h-8 rounded-full ${data.color} flex items-center justify-center mr-3 shadow-md`}>
                            <LinkIcon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="h-2.5 w-24 bg-white/40 rounded-full mb-1.5"></div>
                            <div className="h-2 w-16 bg-white/20 rounded-full"></div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-white/30" />
                    </div>
                );
            })}
            {links.length < 2 && (
                <div className="h-12 w-full border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center animate-pulse">
                    <div className="flex items-center gap-2 text-white/40 font-medium text-sm">
                        <Plus className="w-4 h-4" />
                        <span>Add Link</span>
                    </div>
                </div>
            )}
        </div>
    );
}

function AnimatedThemesFeature() {
    const [activeTheme, setActiveTheme] = useState(0);
    const themes = [
        { name: 'Violet', color: 'bg-violet-500', gradient: 'from-violet-500 to-purple-600' },
        { name: 'Pink', color: 'bg-pink-500', gradient: 'from-pink-500 to-rose-500' },
        { name: 'Amber', color: 'bg-amber-500', gradient: 'from-amber-500 to-orange-500' },
        { name: 'Teal', color: 'bg-teal-500', gradient: 'from-emerald-500 to-teal-500' }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTheme(prev => (prev + 1) % themes.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex gap-4 items-center">
            {/* Theme Selector Sidebar */}
            <div className="flex flex-col gap-3 p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
                {themes.map((t, i) => (
                    <div
                        key={i}
                        className={`w-8 h-8 rounded-full ${t.color} cursor-pointer transition-all duration-300 ${activeTheme === i ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'opacity-40'}`}
                    />
                ))}
            </div>

            {/* Phone Mockup Preview */}
            <div className={`w-32 h-56 rounded-[2rem] bg-gradient-to-br ${themes[activeTheme].gradient} transition-all duration-700 shadow-2xl overflow-hidden relative border-[6px] border-white dark:border-gray-800 ring-1 ring-black/5`}>
                <div className="absolute top-0 inset-x-0 h-4 bg-black/10 mx-8 rounded-b-xl backdrop-blur-sm z-10"></div>
                <div className="flex flex-col items-center gap-3 pt-8 pb-4 px-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md shadow-inner mb-1"></div>
                    <div className="h-2 w-16 bg-white/30 rounded-full shadow-sm mb-3"></div>
                    <div className="w-full space-y-2">
                        <div className="h-7 w-full bg-white/20 rounded-lg shadow-sm backdrop-blur-sm transform transition-all duration-500 translate-y-0"></div>
                        <div className="h-7 w-full bg-white/20 rounded-lg shadow-sm backdrop-blur-sm transform transition-all duration-500 delay-75 translate-y-0"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AnimatedFastFeature() {
    const [state, setState] = useState(0);

    useEffect(() => {
        const times = [0, 1500, 2500, 3000];
        let timeouts: NodeJS.Timeout[] = [];
        const run = () => {
            setState(0);
            timeouts.push(setTimeout(() => setState(1), 1000));
            timeouts.push(setTimeout(() => setState(2), 2500));
            timeouts.push(setTimeout(() => setState(3), 3000));
            timeouts.push(setTimeout(run, 7000)); // Longer pause
        };
        run();
        return () => timeouts.forEach(clearTimeout);
    }, []);

    return (
        <div className="relative w-64 h-40 bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col shadow-xl">
            {/* Browser Window Overlay */}
            <div className={`absolute inset-0 bg-white dark:bg-gray-950 z-20 flex flex-col transition-all duration-500 transform ${state === 3 ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                <div className="h-6 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-2 gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <div className="ml-2 flex-1 h-3 bg-white dark:bg-gray-700 rounded text-[6px] text-gray-400 flex items-center px-1">minilink.bio/me</div>
                </div>
                <div className="flex-1 p-4 flex flex-col items-center pt-6 bg-gray-50 dark:bg-[#0a0a0f] space-y-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg"></div>
                    <div className="h-2 w-20 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                    <div className="w-full space-y-2 mt-2">
                        <div className="h-8 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm flex items-center px-3 gap-2">
                            <div className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/30"></div>
                            <div className="h-1.5 w-12 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
                        </div>
                        <div className="h-8 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm flex items-center px-3 gap-2">
                            <div className="w-4 h-4 rounded-full bg-pink-100 dark:bg-pink-900/30"></div>
                            <div className="h-1.5 w-12 bg-gray-100 dark:bg-gray-800 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Interface */}
            <div className="h-8 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex items-center px-3 justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center"><MessageCircle size={12} /></div>
                    <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>
            </div>
            <div className="flex-1 p-3 space-y-3 bg-gray-50 dark:bg-gray-900/50">
                {/* Message Bubble */}
                <div className={`flex justify-end transition-all duration-300 ${state >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="bg-blue-500 text-white text-[10px] py-2 px-3 rounded-2xl rounded-tr-sm shadow-md max-w-[80%]">
                        <p className="mb-1">Check my new profile! 🔥</p>
                        <div className={`bg-blue-600/50 rounded p-1.5 flex items-center gap-1.5 cursor-pointer hover:bg-blue-600 transition-colors ${state === 2 ? 'ring-2 ring-white/50' : ''}`}>
                            <Link2 size={10} />
                            <span className="font-mono opacity-90">minilink.bio/me</span>
                            <MousePointer2 className={`w-4 h-4 text-white absolute bottom-[-10px] right-[-10px] transition-opacity duration-300 ${state === 2 ? 'opacity-100' : 'opacity-0'}`} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Animated Analytics Feature
function AnimatedAnalyticsFeature() {
    const [clicks, setClicks] = useState(842);
    const [activeAction, setActiveAction] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveAction(1); // Move
            setTimeout(() => setActiveAction(2), 1000); // Click
            setTimeout(() => {
                setClicks(c => c + 1);
                setActiveAction(3); // Update
            }, 1200);
            setTimeout(() => setActiveAction(0), 4000); // Reset
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Graph points logic
    const startPath = "M0,40 L0,30 C20,35 40,10 60,25 C80,35 90,5 100,20 L100,40 Z";
    const endPath = "M0,40 L0,30 C20,35 40,10 60,25 C80,35 90,5 100,10 L100,40 Z"; // Last point raises to 10

    const lineStartPath = "M0,30 C20,35 40,10 60,25 C80,35 90,5 100,20";
    const lineEndPath = "M0,30 C20,35 40,10 60,25 C80,35 90,5 100,10";

    return (
        <div className="w-full h-full flex flex-col md:flex-row gap-4 absolute inset-0 p-6">
            {/* Left Side: Mockup Linktree */}
            <div className="flex-1 bg-gray-100 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-white/10 p-3 flex flex-col items-center relative overflow-hidden shadow-2xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-500 mb-3 shadow-lg"></div>
                <div className="w-full space-y-2 opacity-80">
                    <div className={`h-8 w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg flex items-center px-2 gap-2 transition-all duration-300 origin-center ${activeAction >= 1 && activeAction <= 2 ? 'bg-blue-50 dark:bg-white/20 scale-110 shadow-lg border-blue-200 dark:border-white/30' : ''}`}>
                        <div className="w-4 h-4 rounded-full bg-[#0077b5] flex items-center justify-center"><Linkedin size={8} className="text-white" /></div>
                        <div className="h-1.5 w-12 bg-gray-200 dark:bg-white/20 rounded-full"></div>
                    </div>
                    <div className="h-8 w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg flex items-center px-2 gap-2">
                        <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center"><Github size={8} className="text-white" /></div>
                        <div className="h-1.5 w-10 bg-gray-200 dark:bg-white/20 rounded-full"></div>
                    </div>
                </div>
                {/* Cursor */}
                <MousePointer2
                    className={`w-6 h-6 text-gray-800 dark:text-white absolute transition-all duration-1000 ease-in-out drop-shadow-md z-20 ${activeAction === 0 ? 'top-[80%] right-[10%]' : 'top-[62px] left-[50%]'
                        } ${activeAction === 2 ? 'scale-90' : 'scale-100'}`}
                />
            </div>

            {/* Right Side: Dashboard */}
            <div className="flex-1 bg-gray-50 dark:bg-white/10 backdrop-blur-md rounded-xl p-3 border border-gray-200 dark:border-white/10 flex flex-col justify-between shadow-2xl relative">
                <div>
                    <div className="text-gray-500 dark:text-white/50 text-[10px] font-medium uppercase tracking-wider mb-1">Total Clicks</div>
                    <div className={`text-3xl font-bold text-gray-900 dark:text-white transition-all duration-300 ${activeAction === 3 ? 'scale-110 text-green-500 dark:text-green-400' : ''}`}>{clicks.toLocaleString()}</div>
                </div>

                {/* Graph Area */}
                <div className="relative h-16 w-full mt-2">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                        {/* Area Gradient */}
                        <defs>
                            <linearGradient id="graphGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="currentColor" className="text-green-500 dark:text-white" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="currentColor" className="text-green-500 dark:text-white" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path
                            d={activeAction === 3 ? endPath : startPath}
                            fill="url(#graphGradient)"
                            className="transition-all duration-500 ease-out text-green-500 dark:text-white"
                        />
                        <path
                            d={activeAction === 3 ? lineEndPath : lineStartPath}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            className={`transition-all duration-500 ease-out ${activeAction === 3 ? 'text-green-500 dark:text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'text-gray-400 dark:text-white/80'}`}
                        />
                    </svg>
                </div>

                {/* Arrow indicating data flow */}
                <div className={`absolute top-1/2 -left-4 w-4 h-[2px] bg-gradient-to-r from-transparent to-gray-400 dark:to-white/50 transition-opacity duration-300 ${activeAction === 3 ? 'opacity-100' : 'opacity-0'}`}></div>
            </div>
        </div>
    );
}

function AnimatedSecurityFeature() {
    const [stage, setStage] = useState(0); // 0: scanning, 1: locking, 2: secured

    useEffect(() => {
        const interval = setInterval(() => {
            setStage(0);
            setTimeout(() => setStage(1), 2000);
            setTimeout(() => setStage(2), 3000);
        }, 5000); // Slower cycle
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-2xl bg-[#0d1117] group">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

            {/* Floating Icons that get sucked in */}
            {[
                { Icon: Github, color: 'text-white', pos: 'translate(-60px, -40px)', delay: 0 },
                { Icon: Linkedin, color: 'text-blue-400', pos: 'translate(60px, -40px)', delay: 100 },
                { Icon: Twitter, color: 'text-gray-400', pos: 'translate(-60px, 40px)', delay: 200 },
                { Icon: Instagram, color: 'text-pink-500', pos: 'translate(60px, 40px)', delay: 300 }
            ].map((item, i) => (
                <div
                    key={i}
                    className={`absolute transition-all duration-700 ease-in-out z-10 ${stage >= 1
                        ? 'translate-x-0 translate-y-0 opacity-0 scale-0' // Sucked into vault
                        : `${item.pos} opacity-100 scale-100 animate-float`
                        }`}
                    style={{ transitionDelay: `${item.delay}ms` }}
                >
                    <div className="p-2 bg-gray-800 rounded-full border border-gray-700 shadow-lg">
                        <item.Icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                </div>
            ))}

            {/* Vault/Lock Central Hub */}
            <div className="relative z-20 flex flex-col items-center">
                <div className={`w-24 h-24 bg-gray-900 border-2 ${stage === 2 ? 'border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.4)]' : 'border-gray-700'} rounded-3xl flex items-center justify-center transition-all duration-500 relative overflow-hidden`}>
                    {/* Vault Door Effect */}
                    <div className={`absolute inset-0 bg-emerald-900/20 transition-transform duration-500 ${stage >= 1 ? 'translate-y-0' : 'translate-y-full'}`}></div>

                    {/* Lock Icon */}
                    <Lock className={`w-10 h-10 transition-all duration-500 ${stage === 2 ? 'text-emerald-400 scale-110' : 'text-gray-500 scale-100'}`} />

                    {/* Particles when locked */}
                    {stage === 2 && (
                        <div className="absolute inset-0 animate-pulse bg-emerald-500/10"></div>
                    )}
                </div>

                {/* Status Badge */}
                <div className={`mt-4 px-4 py-1.5 rounded-full border flex items-center gap-2 transition-all duration-500 ${stage === 2 ? 'bg-emerald-500/10 border-emerald-500/30 translate-y-0 opacity-100' : 'bg-gray-800 border-gray-700 translate-y-2 opacity-0'}`}>
                    <Shield className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Encrypted</span>
                </div>
            </div>
        </div>
    )
}

// Animated Counter Component
function CountUp({ end, suffix = '', duration = 2000 }: { end: number, suffix?: string, duration?: number }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [end, duration]);

    return <span>{count}{suffix}</span>;
}

export default function HomePage() {
    const { isSignedIn, isLoaded } = useUser();
    const [isDark, setIsDark] = useState(false);
    const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
    const [openFAQ, setOpenFAQ] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark');
    };

    const features = [
        {
            icon: Link2,
            title: 'Unlimited Links',
            shortDesc: 'No restrictions',
            description: 'Add as many links as you want. Organize, reorder, and customize each one with icons and descriptions.',
            color: 'from-violet-500 to-purple-600',
            bgColor: 'bg-violet-500/10',
        },
        {
            icon: BarChart3,
            title: 'Real-Time Analytics',
            shortDesc: 'Track everything',
            description: 'Monitor clicks, views, and engagement with beautiful charts. Know exactly what resonates with your audience.',
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-500/10',
        },
        {
            icon: Palette,
            title: 'Custom Themes',
            shortDesc: '6+ themes',
            description: 'Express yourself with stunning themes. From minimal to neon cyberpunk, find your perfect aesthetic.',
            color: 'from-pink-500 to-rose-500',
            bgColor: 'bg-pink-500/10',
        },
        {
            icon: Zap,
            title: 'Lightning Fast',
            shortDesc: 'Edge-optimized',
            description: 'Built on cutting-edge technology. Your page loads instantly from anywhere in the world.',
            color: 'from-amber-500 to-orange-500',
            bgColor: 'bg-amber-500/10',
        },
        {
            icon: Shield,
            title: 'Secure & Private',
            shortDesc: 'Your data, protected',
            description: 'Enterprise-grade security with OAuth authentication. We never sell your data or show ads.',
            color: 'from-emerald-500 to-teal-500',
            bgColor: 'bg-emerald-500/10',
        },
        {
            icon: Globe,
            title: 'Open Source',
            shortDesc: 'Community-driven',
            description: 'Fully open source. Contribute, customize, or self-host. Built by the community, for the community.',
            color: 'from-indigo-500 to-blue-600',
            bgColor: 'bg-indigo-500/10',
        },
    ];

    return (
        <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'dark bg-[#0a0a0f]' : 'bg-[#fafafa]'}`}>
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-0 -left-40 w-96 h-96 rounded-full blur-3xl transition-opacity duration-1000 ${isDark ? 'bg-violet-600/20' : 'bg-violet-400/30'}`}></div>
                <div className={`absolute top-1/3 -right-40 w-96 h-96 rounded-full blur-3xl transition-opacity duration-1000 ${isDark ? 'bg-blue-600/20' : 'bg-blue-400/20'}`}></div>
                <div className={`absolute bottom-0 left-1/3 w-96 h-96 rounded-full blur-3xl transition-opacity duration-1000 ${isDark ? 'bg-pink-600/10' : 'bg-pink-400/20'}`}></div>
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/70 dark:bg-[#0a0a0f]/70 border-b border-gray-200/50 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="relative w-9 h-9">
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 group-hover:scale-110 transition-transform duration-300"></div>
                                <div className="absolute inset-[2px] rounded-[10px] bg-white dark:bg-[#0a0a0f] flex items-center justify-center">
                                    <span className="text-lg font-black bg-gradient-to-br from-violet-500 to-pink-500 bg-clip-text text-transparent">M</span>
                                </div>
                            </div>
                            <span className="font-bold text-xl tracking-tight">
                                Mini<span className="bg-gradient-to-r from-violet-500 to-pink-500 bg-clip-text text-transparent">Link</span>
                            </span>
                        </Link>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                                aria-label="Toggle theme"
                            >
                                {mounted ? (
                                    isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />
                                ) : (
                                    <Moon className="w-5 h-5 text-slate-600" />
                                )}
                            </button>
                            {!isLoaded ? (
                                <div className="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                            ) : isSignedIn ? (
                                <Link
                                    href="/dashboard"
                                    className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/sign-in"
                                        className="px-4 py-2 text-sm font-medium hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        href="/sign-up"
                                        className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5 transition-all duration-300"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Hero Text */}
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 text-sm font-medium mb-8 border border-violet-500/20">
                                <Sparkles className="w-4 h-4" />
                                <span>One Link For All </span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                                <span className="text-gray-900 dark:text-white">One Link For</span>
                                <br />
                                <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Everything You Create
                                </span>
                            </h1>

                            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed">
                                Create your personalized link hub in seconds. Share your content,
                                track your impact, and grow your audience — completely free.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <Link
                                    href={isSignedIn ? "/dashboard" : "/sign-up"}
                                    className="group inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-violet-600 to-pink-600 rounded-2xl hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-1 transition-all duration-300"
                                >
                                    {isSignedIn ? "Go to Dashboard" : "Create Your MiniLink"}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    href="#features"
                                    className="inline-flex items-center gap-2 px-8 py-4 text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                                >
                                    See Features
                                    <ChevronRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>

                        {/* Collapsing Logos Animation - Right Column */}
                        <div className="hidden lg:flex justify-center flex-col items-center">
                            <div className="relative scale-110">
                                <div className="text-center mb-6">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">All your platforms</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">→ One Link</p>
                                </div>
                                <CollapsingLogosAnimation />
                                <div className="mt-8 text-center h-12">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Trusted by</p>
                                    <div className="text-2xl font-bold">
                                        <TypewriterEffect words={[
                                            "creators", "influencers", "small businesses", "athletes", "models", "monetizers",
                                            "health educators", "streamers", "vloggers", "fitness coaches", "ecommerce sellers",
                                            "retailers", "products", "wellness leaders", "musicians", "bands", "podcasters",
                                            "fashion designers", "culture creators", "merch sellers", "writers", "DJs"
                                        ]} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* Live Demo Section */}
            <section className="py-12 sm:py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4">
                            See It In Action
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Watch how easily you can build and customize your page in real-time.
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
                        {/* Laptop Mockup (Creation Flow) */}
                        <div className="w-full max-w-[600px] flex justify-center">
                            {/* Scaled wrapper to fit mobile screens */}
                            <div className="transform scale-[0.5] xs:scale-[0.6] sm:scale-[0.8] md:scale-90 lg:scale-100 origin-center -my-24 sm:-my-12 lg:my-0 transition-transform duration-500">
                                <LaptopDemo isDark={isDark} />
                            </div>
                        </div>

                        {/* iPhone Mockup (Result) */}
                        <div className="relative mt-8 lg:mt-0 transform scale-[0.85] sm:scale-100 transition-transform duration-500">
                            {/* Live Preview Label */}
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-violet-600 to-pink-600 rounded-full shadow-lg z-20">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                <span className="text-xs font-semibold text-white whitespace-nowrap">Live Preview</span>
                            </div>
                            {/* iPhone Frame */}
                            <div className="relative w-[280px] h-[570px] bg-gray-900 rounded-[50px] p-3 shadow-2xl border-4 border-gray-800 mx-auto">
                                {/* Dynamic Island */}
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-10"></div>
                                {/* Screen */}
                                <div className="w-full h-full rounded-[38px] bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 overflow-hidden">
                                    {/* Profile Content */}
                                    <div className="w-full h-full bg-white dark:bg-gray-900 mt-1 rounded-t-[38px] p-6 pt-12">
                                        <div className="flex flex-col items-center text-center">
                                            {/* Avatar with actual photo */}
                                            <div className="w-20 h-20 rounded-full mb-3 ring-4 ring-white dark:ring-gray-800 shadow-xl overflow-hidden">
                                                <img src="/me.jpeg" alt="Aakash Chauhan" className="w-full h-full object-cover" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Aakash Chauhan</h3>
                                            <p className="text-gray-500 dark:text-gray-400 text-[10px] mt-0.5 px-2 leading-relaxed">Software Developer</p>

                                            {/* Interactive Links with animations */}
                                            <div className="w-full mt-5 space-y-2.5">
                                                {/* Portfolio */}
                                                <a
                                                    href="https://portfolioaakash-delta.vercel.app/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center gap-3 border border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-600 hover:scale-[1.03] hover:shadow-lg transition-all duration-300 cursor-pointer group"
                                                    style={{ animationDelay: '0.1s' }}
                                                >
                                                    <svg className="w-5 h-5 text-blue-500 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                                                    <span className="group-hover:translate-x-1 transition-transform">Portfolio</span>
                                                    <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
                                                </a>
                                                {/* LinkedIn */}
                                                <a
                                                    href="https://www.linkedin.com/in/aakash-chauhan-196ba6229/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center gap-3 border border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-400 dark:hover:border-blue-500 hover:scale-[1.03] hover:shadow-lg transition-all duration-300 cursor-pointer group"
                                                    style={{ animationDelay: '0.2s' }}
                                                >
                                                    <svg className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                                    <span className="group-hover:translate-x-1 transition-transform">LinkedIn</span>
                                                    <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-blue-600" />
                                                </a>
                                                
                                    
                                                {/* GitHub */}
                                                <a
                                                    href="https://github.com/akashinedon"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center gap-3 border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-purple-400 dark:hover:border-purple-500 hover:scale-[1.03] hover:shadow-lg transition-all duration-300 cursor-pointer group"
                                                    style={{ animationDelay: '0.4s' }}
                                                >
                                                    <svg className="w-5 h-5 group-hover:rotate-[360deg] transition-transform duration-500" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                                                    <span className="group-hover:translate-x-1 transition-transform">GitHub</span>
                                                    <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-purple-500" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Home Indicator */}
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 right-0 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto relative">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                            Everything You Need
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                            Build your perfect link hub with powerful features designed for creators
                        </p>
                    </div>

                    {/* Bento Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Large Feature Card */}
                        <div className="lg:col-span-2 group relative p-8 rounded-[2.5rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-500 hover:-translate-y-1 h-96">
                            {/* Full Height Animation Container */}
                            <div className="absolute inset-0 z-0">
                                <AnimatedAnalyticsFeature />
                            </div>

                            {/* Overlay Title (Floating top left) */}
                            <div className="absolute top-8 left-8 z-10 pointer-events-none">
                                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Real-Time Analytics</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
                                    Track every click live.
                                </p>
                            </div>
                        </div>

                        {/* Unlimited Links */}
                        <div className="group relative p-8 rounded-[2.5rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 h-96">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500 opacity-0 group-hover:opacity-100"></div>
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="mb-auto flex justify-center py-6">
                                    <AnimatedLinksFeature />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Unlimited Links</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                        Add as many links as you want. Drag and drop to reorder in seconds.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Custom Themes */}
                        <div className="group relative p-8 rounded-[2.5rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 hover:-translate-y-1">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500 opacity-0 group-hover:opacity-100"></div>
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="mb-auto flex justify-center py-4">
                                    <AnimatedThemesFeature />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">6+ Themes</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                        From minimal to neon cyberpunk. Express your unique style instantly.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Lightning Fast */}
                        <div className="group relative p-8 rounded-[2.5rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500 opacity-0 group-hover:opacity-100"></div>
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="mb-auto flex justify-center py-4">
                                    <AnimatedFastFeature />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                        Loads instantly. Optimized for speed and performance.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Wide Card */}
                        <div className="lg:col-span-2 group relative p-8 rounded-[2.5rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-1">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500 opacity-0 group-hover:opacity-100"></div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                                <div className="shrink-0">
                                    <AnimatedSecurityFeature />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Secure, Private & Open Source</h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Your data is protected with enterprise-grade security. Fully open source — contribute, customize, or self-host.
                                    </p>
                                </div>
                                <Link href="https://github.com/akashinedon" target="_blank" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                                    <Github className="w-5 h-5" />
                                    <span>View on GitHub</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 relative" id="faq">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Questions? <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">Answered</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                            Everything you need to know about MiniLink
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "Why do I need a link in bio tool?",
                                a: "Social media platforms typically only allow one clickable link in your bio. MiniLink lets you share all your important links — your website, social profiles, online store, and more — through a single, customizable landing page."
                            },
                            {
                                q: "Is MiniLink the original link in bio tool?",
                                a: "MiniLink is a modern, open-source alternative to other link-in-bio tools. We focus on simplicity, speed, and giving you full control over your online presence without any ads or hidden costs."
                            },
                            {
                                q: "Can you get paid and sell things from a MiniLink?",
                                a: "Yes! You can add links to your online store, payment platforms like PayPal or Stripe, or any e-commerce solution. MiniLink helps you direct traffic to wherever you want to monetize."
                            },
                            {
                                q: "Is MiniLink safe to use on all of my social media profiles?",
                                a: "Absolutely! MiniLink is 100% safe and trusted by thousands of creators. Our links work seamlessly across Instagram, TikTok, Twitter, YouTube, and all other major platforms."
                            },
                            {
                                q: "What makes MiniLink better than other link in bio options?",
                                a: "MiniLink is completely free, open-source, and ad-free. We offer beautiful themes, real-time analytics, and lightning-fast load times. Plus, you can self-host it if you want complete control."
                            },
                            {
                                q: "How can I drive more traffic to and through my MiniLink?",
                                a: "Share your MiniLink URL everywhere — in your social bios, email signatures, business cards, and content. Use our analytics to understand what links perform best and optimize accordingly."
                            },
                            {
                                q: "How many links should I have on my MiniLink?",
                                a: "There's no limit! However, we recommend keeping it focused. 5-10 links is ideal for most creators. Prioritize your most important destinations at the top for maximum engagement."
                            },
                            {
                                q: "Do I need a website to use MiniLink?",
                                a: "Not at all! MiniLink can serve as your complete online presence. Many creators use their MiniLink page as their primary hub without needing a separate website."
                            }
                        ].map((faq, index) => (
                            <FAQItem
                                key={index}
                                question={faq.q}
                                answer={faq.a}
                                isOpen={openFAQ === index}
                                onToggle={() => setOpenFAQ(openFAQ === index ? null : index)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-5xl mx-auto">
                    <div className="relative rounded-[2.5rem] overflow-hidden">
                        {/* Animated Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600"></div>
                        <div className="absolute inset-0">
                            <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                        </div>

                        {/* Floating Social Icons */}
                        <div className="absolute inset-0 overflow-hidden">
                            {/* YouTube */}
                            <div className="absolute top-10 left-10 w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center rotate-12 animate-float">
                                <svg className="w-7 h-7 text-white/80" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                            </div>
                            {/* LinkedIn */}
                            <div className="absolute top-20 right-16 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center -rotate-12 animate-float" style={{ animationDelay: '0.5s' }}>
                                <svg className="w-6 h-6 text-white/80" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                            </div>
                            {/* GitHub */}
                            <div className="absolute bottom-16 left-20 w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center rotate-6 animate-float" style={{ animationDelay: '1s' }}>
                                <Github className="w-7 h-7 text-white/80" />
                            </div>
                            {/* X (Twitter) */}
                            <div className="absolute bottom-10 right-10 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center -rotate-6 animate-float" style={{ animationDelay: '1.5s' }}>
                                <svg className="w-5 h-5 text-white/80" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                            </div>
                            {/* Instagram */}
                            <div className="absolute top-1/2 left-6 w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center rotate-3 animate-float" style={{ animationDelay: '0.8s' }}>
                                <svg className="w-5 h-5 text-white/80" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                            </div>
                            {/* Twitch */}
                            <div className="absolute top-1/3 right-8 w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center -rotate-3 animate-float" style={{ animationDelay: '1.2s' }}>
                                <svg className="w-5 h-5 text-white/80" fill="currentColor" viewBox="0 0 24 24"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" /></svg>
                            </div>
                        </div>

                        <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">

                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
                                Ready to Share
                                <br />
                                <span className="text-white/90">Your World?</span>
                            </h2>

                            <p className="text-white/80 mb-10 text-lg sm:text-xl max-w-2xl mx-auto">
                                Create your personalized MiniLink in under 60 seconds. No credit card required.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    href={isSignedIn ? "/dashboard" : "/sign-up"}
                                    className="group inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-violet-600 bg-white rounded-2xl hover:shadow-2xl hover:shadow-white/20 hover:-translate-y-1 transition-all duration-300"
                                >
                                    {isSignedIn ? "Go to Dashboard" : "Get Started Free"}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <SiteFooter />
        </div>
    );
}
