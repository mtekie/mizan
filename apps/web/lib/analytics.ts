// Analytics wrapper — lightweight event tracking utility
// Integrates with Vercel Analytics or PostHog when deployed

type EventProperties = Record<string, string | number | boolean | undefined>;

const IS_DEV = typeof window !== 'undefined' && window.location.hostname === 'localhost';

export function track(event: string, properties?: EventProperties) {
    if (IS_DEV) {
        console.log('[Mizan Analytics]', event, properties);
        return;
    }

    // Vercel Analytics
    try {
        const w = window as any;
        if (w?.va) w.va('event', { name: event, ...properties });
        if (w?.posthog?.capture) w.posthog.capture(event, properties);
    } catch { /* noop in SSR */ }
}

// Pre-defined event names for consistency
export const Events = {
    PAGE_VIEW: 'page_view',
    PRODUCT_VIEWED: 'product_viewed',
    TRANSACTION_LOGGED: 'transaction_logged',
    EXPENSE_LOGGED: 'expense_logged',
    PROFILE_COMPLETED: 'profile_completed',
    LOAN_CHECK_STARTED: 'loan_check_started',
    LOAN_CALC_USED: 'loan_calc_used',
    REVIEW_SUBMITTED: 'review_submitted',
    BILL_CREATED: 'bill_created',
    RECEIPT_SCANNED: 'receipt_scanned',
    GOAL_CREATED: 'goal_created',
    TEMPLATE_APPLIED: 'template_applied',
    PRODUCT_COMPARED: 'product_compared',
    TIP_READ: 'tip_read',
    TIP_SAVED: 'tip_saved',
} as const;
