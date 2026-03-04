// Auth middleware is temporarily disabled for development.
// Re-enable by switching back to the withAuth version below.

// import { withAuth } from "next-auth/middleware"
// export default withAuth({ pages: { signIn: "/login" } })
// export const config = { matcher: ["/wealth", "/ledger", "/transfer", "/notifications", "/score"] }

export function middleware() {
    // pass-through in dev
}
export const config = {}
