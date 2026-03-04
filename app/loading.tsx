export default function Loading() {
    return (
        <div className="flex flex-col min-h-full p-6 space-y-6 animate-pulse mt-8 md:mt-12">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
                    <div className="h-8 bg-slate-200 rounded w-48"></div>
                </div>
                <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
            </div>

            {/* Hero Card Skeleton */}
            <div className="h-32 bg-slate-200 rounded-3xl w-full"></div>

            {/* Main Content Skeleton */}
            <div className="h-64 bg-slate-200 rounded-3xl w-full"></div>

            {/* Small Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="h-24 bg-slate-200 rounded-2xl"></div>
                <div className="h-24 bg-slate-200 rounded-2xl"></div>
            </div>
        </div>
    );
}
