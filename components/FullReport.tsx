
import React from 'react';
import { CombinedAnalysisReport, FeatureId } from '../types';
import { Package } from './Packages';

interface FullReportProps {
    report: CombinedAnalysisReport;
    pkg: Package;
    onClose: () => void;
}

const FullReport: React.FC<FullReportProps> = ({ report, pkg, onClose }) => {
    return (
        <div className="max-w-5xl mx-auto animate-[fadeIn_0.8s_ease-in-out] pb-24">
            {/* Cover Page Style Header */}
            <div className="text-center py-16 border-b border-yellow-500/20 mb-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent pointer-events-none"></div>
                <h1 className="text-5xl md:text-7xl font-playfair font-bold text-white mb-4 drop-shadow-lg">Your Cosmic Blueprint</h1>
                <h2 className="text-2xl text-yellow-300 font-light tracking-widest uppercase">{pkg.name} Report</h2>
                <div className="mt-8 w-24 h-1 bg-yellow-500 mx-auto"></div>
            </div>

            {/* Introduction & Holistic Guidance */}
            <div className="space-y-12 px-4 md:px-12">
                <section className="bg-gray-900/40 p-8 rounded-2xl border border-yellow-500/30 shadow-xl">
                    <h3 className="text-3xl font-playfair text-yellow-400 mb-6 text-center">Executive Summary</h3>
                    <p className="text-lg text-gray-300 leading-relaxed mb-6 italic text-center">
                        "{report.introduction}"
                    </p>
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent my-8"></div>
                    <h4 className="text-2xl font-playfair text-white mb-4">Holistic Guidance</h4>
                    <p className="text-gray-300 leading-loose whitespace-pre-wrap">
                        {report.holisticGuidance}
                    </p>
                </section>

                {/* Individual Modules */}
                <div className="grid gap-12">
                    {report.astrology && (
                        <section className="bg-gray-900/30 p-8 rounded-xl border border-gray-700/50">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-4xl">✨</span>
                                <h3 className="text-3xl font-playfair text-white">Vedic Astrology</h3>
                            </div>
                            <div className="space-y-6">
                                {report.astrology.analysis.map((sec, i) => (
                                    <div key={i}>
                                        <h4 className="text-xl font-bold text-yellow-300 mb-2">{sec.title}</h4>
                                        <p className="text-gray-400">{sec.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {report.palmistry && (
                        <section className="bg-gray-900/30 p-8 rounded-xl border border-gray-700/50">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-4xl">✋</span>
                                <h3 className="text-3xl font-playfair text-white">Palmistry Insights</h3>
                            </div>
                            <div className="space-y-6">
                                {report.palmistry.sections.map((sec, i) => (
                                    <div key={i}>
                                        <h4 className="text-xl font-bold text-yellow-300 mb-2">{sec.title}</h4>
                                        <p className="text-gray-400">{sec.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {report.faceReading && (
                        <section className="bg-gray-900/30 p-8 rounded-xl border border-gray-700/50">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-4xl">🎭</span>
                                <h3 className="text-3xl font-playfair text-white">Physiognomy</h3>
                            </div>
                            <div className="space-y-6">
                                {report.faceReading.sections.map((sec, i) => (
                                    <div key={i}>
                                        <h4 className="text-xl font-bold text-yellow-300 mb-2">{sec.title}</h4>
                                        <p className="text-gray-400">{sec.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                    
                    {report.handwriting && (
                        <section className="bg-gray-900/30 p-8 rounded-xl border border-gray-700/50">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-4xl">✍️</span>
                                <h3 className="text-3xl font-playfair text-white">Graphology</h3>
                            </div>
                            <div className="space-y-6">
                                {report.handwriting.sections.map((sec, i) => (
                                    <div key={i}>
                                        <h4 className="text-xl font-bold text-yellow-300 mb-2">{sec.title}</h4>
                                        <p className="text-gray-400">{sec.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {report.moleology && (
                        <section className="bg-gray-900/30 p-8 rounded-xl border border-gray-700/50">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-4xl">💠</span>
                                <h3 className="text-3xl font-playfair text-white">Moleology</h3>
                            </div>
                            <div className="space-y-6">
                                {report.moleology.sections.map((sec, i) => (
                                    <div key={i}>
                                        <h4 className="text-xl font-bold text-yellow-300 mb-2">{sec.title}</h4>
                                        <p className="text-gray-400">{sec.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {report.mantra && (
                        <section className="bg-gray-900/30 p-8 rounded-xl border border-gray-700/50">
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-4xl">🧘</span>
                                <h3 className="text-3xl font-playfair text-white">Your Personal Mantra</h3>
                            </div>
                            <div className="text-center">
                                <p className="text-4xl font-serif text-yellow-300 mb-2">{report.mantra.sanskritMantra}</p>
                                <p className="text-xl text-white italic mb-6">{report.mantra.transliteration}</p>
                                <p className="text-gray-400 text-left">{report.mantra.overallMeaning}</p>
                            </div>
                        </section>
                    )}
                </div>
            </div>

            <div className="mt-16 text-center print-hidden">
                <button 
                    onClick={onClose}
                    className="bg-gray-700 text-white font-bold py-3 px-8 rounded-full hover:bg-gray-600 transition-colors"
                >
                    Close Report
                </button>
                <button 
                    onClick={() => window.print()}
                    className="ml-4 bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-full hover:bg-yellow-400 transition-colors"
                >
                    Print / Save as PDF
                </button>
            </div>
        </div>
    );
};

export default FullReport;
