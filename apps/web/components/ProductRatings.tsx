'use client';

import { useState } from 'react';
import { Star, ThumbsUp, MessageCircle, User, ChevronDown, ChevronUp } from 'lucide-react';

type Review = {
    id: number;
    author: string;
    rating: number;
    date: string;
    body: string;
    helpful: number;
    tags: string[];
};

const demoReviews: Review[] = [
    {
        id: 1,
        author: 'Abebe T.',
        rating: 5,
        date: 'Jan 2026',
        body: 'Very easy process. Got approved within 3 days and the interest rate was competitive. Staff were helpful throughout.',
        helpful: 24,
        tags: ['Fast Approval', 'Great Rate', 'Easy Process'],
    },
    {
        id: 2,
        author: 'Sara M.',
        rating: 4,
        date: 'Dec 2025',
        body: 'Good product overall. The documentation requirements were a bit much but the loan was disbursed quickly once submitted. Would recommend to friends.',
        helpful: 11,
        tags: ['Quick Disbursement'],
    },
    {
        id: 3,
        author: 'Robel H.',
        rating: 3,
        date: 'Nov 2025',
        body: 'Average experience. The rate is fine but the process felt slow. Would be nice to have a mobile app for tracking repayments.',
        helpful: 6,
        tags: ['Needs Digital Access'],
    },
];

const ratingBreakdown = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: demoReviews.filter(r => r.rating === star).length,
}));

const avgRating = demoReviews.reduce((s, r) => s + r.rating, 0) / demoReviews.length;

export function ProductRatings({ productName }: { productName: string }) {
    const [helpful, setHelpful] = useState<Record<number, boolean>>({});
    const [showAll, setShowAll] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newRating, setNewRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const visibleReviews = showAll ? demoReviews : demoReviews.slice(0, 2);

    return (
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mt-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-slate-400" /> Community Voice
                </h3>
                <button
                    onClick={() => setShowReviewForm(v => !v)}
                    className="text-xs font-bold text-[#3EA63B] border border-[#3EA63B]/30 bg-[#3EA63B]/5 px-3 py-1.5 rounded-lg hover:bg-[#3EA63B]/10 transition"
                >
                    + Write a Review
                </button>
            </div>

            {/* Summary Row */}
            <div className="flex gap-6 mb-6 pb-6 border-b border-slate-100">
                {/* Big number */}
                <div className="flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-slate-900">{avgRating.toFixed(1)}</span>
                    <div className="flex gap-0.5 my-1">
                        {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} className={`w-4 h-4 ${s <= Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                        ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{demoReviews.length} reviews</span>
                </div>

                {/* Breakdown bars */}
                <div className="flex-1 space-y-1.5">
                    {ratingBreakdown.map(({ star, count }) => (
                        <div key={star} className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-500 w-3">{star}</span>
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-amber-400 rounded-full transition-all"
                                    style={{ width: `${(count / demoReviews.length) * 100}%` }}
                                />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 w-4 text-right">{count}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Write Review Form */}
            {showReviewForm && !submitted && (
                <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Your Rating</p>
                    <div className="flex gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map(s => (
                            <button
                                key={s}
                                onMouseEnter={() => setHoverRating(s)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setNewRating(s)}
                            >
                                <Star className={`w-7 h-7 transition-colors ${s <= (hoverRating || newRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                            </button>
                        ))}
                    </div>
                    <textarea
                        value={reviewText}
                        onChange={e => setReviewText(e.target.value)}
                        placeholder={`Share your experience with ${productName}…`}
                        className="w-full h-24 text-sm text-slate-800 border border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-[#3EA63B] bg-white"
                    />
                    <div className="flex gap-2 mt-3">
                        <button onClick={() => setShowReviewForm(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-100 transition">Cancel</button>
                        <button
                            onClick={() => { if (newRating && reviewText) setSubmitted(true); }}
                            disabled={!newRating || !reviewText}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition ${newRating && reviewText ? 'bg-[#0F172A] text-white hover:bg-slate-800' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                        >
                            Submit Review
                        </button>
                    </div>
                </div>
            )}
            {submitted && (
                <div className="bg-[#3EA63B]/10 rounded-xl p-4 mb-6 border border-[#3EA63B]/20 text-center text-sm font-bold text-[#3EA63B]">
                    ✓ Thank you! Your review will appear after moderation.
                </div>
            )}

            {/* Review List */}
            <div className="space-y-5">
                {visibleReviews.map(review => (
                    <div key={review.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                            <User className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-slate-900">{review.author}</span>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                                        ))}
                                    </div>
                                </div>
                                <span className="text-[10px] text-slate-400 font-bold">{review.date}</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed mb-2">{review.body}</p>
                            <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-1">
                                    {review.tags.map(tag => (
                                        <span key={tag} className="text-[9px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{tag}</span>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setHelpful(h => ({ ...h, [review.id]: true }))}
                                    className={`flex items-center gap-1 text-[10px] font-bold transition ${helpful[review.id] ? 'text-[#3EA63B]' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <ThumbsUp className="w-3.5 h-3.5" /> {review.helpful + (helpful[review.id] ? 1 : 0)}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {demoReviews.length > 2 && (
                <button
                    onClick={() => setShowAll(v => !v)}
                    className="w-full mt-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center justify-center gap-1 transition"
                >
                    {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    {showAll ? 'Show less' : `See all ${demoReviews.length} reviews`}
                </button>
            )}
        </section>
    );
}
