/**
 * MizanBottomNav — Universal bottom navigation bar
 *
 * Platform resolution:
 *  Metro (native)  → MizanBottomNav.native.tsx
 *  Next.js (web)   → MizanBottomNav.web.tsx
 */

export interface MizanNavTab {
  /** Internal route name / identifier */
  name: string;
  /** Display label shown under the icon */
  label: string;
  /** Icon node — consumer passes a platform-appropriate Lucide component */
  icon: React.ReactNode;
  /** href used by the web tab (Link href) */
  href?: string;
}

export interface MizanBottomNavProps {
  tabs: MizanNavTab[];
  /** name of the currently active tab */
  activeTab: string;
  /** Called with the tab `name` when a tab is pressed */
  onTabPress: (name: string) => void;
}

export { MizanBottomNav } from './MizanBottomNav.web';
