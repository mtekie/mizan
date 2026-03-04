'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle2, UserCircle, Briefcase, GraduationCap, Users, Banknote, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        gender: '',
        dateOfBirth: '',
        educationLevel: '',
        employmentStatus: '',
        monthlyIncomeRange: '',
        familyStatus: ''
    });

    const steps = [
        {
            id: 'basics',
            title: "Let's personalize Mizan for you.",
            subtitle: "Basic details help us tailor your experience.",
            icon: UserCircle,
            type: 'mixed', // Has multiple different inputs
        },
        {
            id: 'education',
            title: "What's your highest level of education?",
            subtitle: "This helps us understand your financial journey.",
            icon: GraduationCap,
            type: 'select',
            field: 'educationLevel',
            options: ['High School', 'Diploma', 'Bachelor’s Degree', 'Master’s Degree', 'PhD / Doctorate', 'Other']
        },
        {
            id: 'employment',
            title: "Current employment status?",
            subtitle: "Your Mizan Score relies heavily on income stability.",
            icon: Briefcase,
            type: 'select',
            field: 'employmentStatus',
            options: ['Salaried Employee', 'Self-Employed / Business Owner', 'Freelancer / Gig Worker', 'Student', 'Unemployed', 'Retired']
        },
        {
            id: 'income',
            title: "What is your average monthly income?",
            subtitle: "We keep this strictly confidential.",
            icon: Banknote,
            type: 'select',
            field: 'monthlyIncomeRange',
            options: ['Below 10,000 ETB', '10,000 - 25,000 ETB', '25,000 - 50,000 ETB', '50,000 - 100,000 ETB', 'Above 100,000 ETB']
        },
        {
            id: 'family',
            title: "Tell us about your household.",
            subtitle: "Family status affects loan suitability.",
            icon: Users,
            type: 'select',
            field: 'familyStatus',
            options: ['Single', 'Married (No Children)', 'Married (With Children)', 'Single Parent', 'Other']
        }
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(c => c + 1);
        } else {
            submitProfile();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(c => c - 1);
        }
    };

    const submitProfile = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Failed to save profile');

            // Force refresh data in router context
            router.refresh();
            router.push('/profile?onboarding_success=true');
        } catch (e) {
            console.error(e);
            toast.error('Something went wrong saving your profile.');
        } finally {
            setLoading(false);
        }
    };

    const currentStepData = steps[currentStep];
    const StepIcon = currentStepData.icon;

    // Validation logic
    const isNextDisabled = () => {
        if (currentStepData.id === 'basics') {
            return !formData.gender || !formData.dateOfBirth;
        }
        const val = (formData as any)[currentStepData.field as string];
        return !val;
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pt-safe">
            {/* Header */}
            <header className="px-6 py-4 flex items-center justify-between z-10 relative">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded bg-[#3EA63B] flex items-center justify-center text-white font-black text-sm">M</div>
                    <span className="text-xl font-bold text-slate-900 group-hover:text-[#3EA63B] transition-colors">Mizan</span>
                </Link>
                <button onClick={() => router.push('/')} className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">Skip for now</button>
            </header>

            {/* Progress Bar */}
            <div className="max-w-xl mx-auto w-full px-6 mt-4">
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#3EA63B] transition-all duration-500 ease-out"
                        style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    />
                </div>
                <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">
                    Step {currentStep + 1} of {steps.length}
                </p>
            </div>

            <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-xl mx-auto -mt-16">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                    >
                        <div className="text-center mb-10">
                            <div className="w-16 h-16 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <StepIcon className="w-8 h-8 text-[#3EA63B]" />
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 mb-3">{currentStepData.title}</h1>
                            <p className="text-slate-500">{currentStepData.subtitle}</p>
                        </div>

                        {/* Render Output Form Based on Step Type */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl shadow-slate-200/50">

                            {/* Basics Step (Custom) */}
                            {currentStepData.id === 'basics' && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-900 mb-3">Gender</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['Male', 'Female'].map(g => (
                                                <button
                                                    key={g}
                                                    onClick={() => setFormData(f => ({ ...f, gender: g }))}
                                                    className={`p-4 rounded-xl border text-sm font-bold transition-all ${formData.gender === g
                                                            ? 'bg-[#3EA63B]/10 border-[#3EA63B] text-[#3EA63B] shadow-sm'
                                                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                        }`}
                                                >
                                                    {g}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-900 mb-3">Date of Birth</label>
                                        <input
                                            type="date"
                                            max="2006-01-01" // Only 18+ realistically
                                            value={formData.dateOfBirth}
                                            onChange={(e) => setFormData(f => ({ ...f, dateOfBirth: e.target.value }))}
                                            className="w-full p-4 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3EA63B] focus:border-transparent font-medium"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* standard selection steps */}
                            {currentStepData.type === 'select' && currentStepData.options && (
                                <div className="space-y-3">
                                    {currentStepData.options.map(opt => {
                                        const fieldVal = (formData as any)[currentStepData.field as string];
                                        const isSelected = fieldVal === opt;
                                        return (
                                            <button
                                                key={opt}
                                                onClick={() => setFormData(f => ({ ...f, [currentStepData.field as string]: opt }))}
                                                className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${isSelected
                                                        ? 'bg-[#3EA63B]/10 border-[#3EA63B] shadow-sm'
                                                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <span className={`font-bold text-sm ${isSelected ? 'text-[#3EA63B]' : 'text-slate-700'}`}>{opt}</span>
                                                {isSelected && <CheckCircle2 className="w-5 h-5 text-[#3EA63B]" />}
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex items-center justify-between mt-8">
                            <button
                                onClick={handlePrev}
                                disabled={currentStep === 0}
                                className={`p-4 rounded-full transition-colors ${currentStep === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-200 hover:text-slate-900 bg-white shadow-sm border border-slate-100'}`}
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>

                            <button
                                onClick={handleNext}
                                disabled={isNextDisabled() || loading}
                                className={`flex items-center gap-2 px-8 py-4 rounded-full font-black text-sm transition-all shadow-lg ${isNextDisabled() || loading
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed border-none shadow-none'
                                        : 'bg-[#3EA63B] text-white hover:bg-[#328a2f] hover:shadow-[#3EA63B]/30'
                                    }`}
                            >
                                {loading ? 'Saving...' : currentStep === steps.length - 1 ? 'Complete Profile' : 'Continue'}
                                {!loading && (currentStep === steps.length - 1 ? <Sparkles className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />)}
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
