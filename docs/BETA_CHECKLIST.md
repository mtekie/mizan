# Mizan Private Beta: Launch Checklist
Target: 20 pilot users

## 1. Legal & Trust (Must Ship)
- [ ] **Disclaimers**: Add "Educational Only" and "Data Accuracy" disclaimers to Score and Find screens.
- [ ] **Privacy Policy**: Draft first version covering Supabase and data sharing logic.
- [ ] **Terms of Service**: Draft first version covering beta usage.
- [ ] **SMS Consent**: Clear copy for future ledger/notification integration.

## 2. Feedback Loops (Must Ship)
- [ ] **Feedback Link**: Add "Report a Bug / Suggestion" link in the Profile/Me tab.
- [ ] **Error Monitoring**: Ensure all API errors are logged to the backend console (or Sentry stub).
- [ ] **Usage Analytics**: Track "Score Generated", "Goal Created", and "Product Viewed" events.

## 3. Data & Product (Must Ship)
- [ ] **Institution Stubs**: Ensure at least 5 CBE, Abyssinia, and Hibret products are updated with fresh info.
- [ ] **Score Edge Cases**: Test score for users with 0 transactions/0 goals (should default to base trust).
- [ ] **Mobile Stability**: Run one full walkthrough on Android and iOS (Expo).

## 4. Onboarding (Secondary)
- [ ] **Invite Code**: Basic invite-only gate for the mobile app.
- [ ] **Welcome Message**: In-app welcome nudge for beta users.
- [ ] **Waitlist**: Simple landing page for non-beta users.

## 5. Deployment
- [ ] **Database Backup**: Ensure automated daily backups are configured.
- [ ] **Environment Variables**: Audit all keys (PostHog, Supabase, Google Fonts).
