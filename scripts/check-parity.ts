#!/usr/bin/env node

/**
 * UI Parity Checker
 *
 * Statically validates that both web and mobile platforms implement
 * all required sections from the shared appSurfaceContracts,
 * and that they reference shared view models and component tokens.
 *
 * Usage: npx ts-node scripts/check-parity.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// ─── Config ───
const ROOT = path.resolve(__dirname, '..');

const WEB_FILES: Record<string, string> = {
  home: path.join(ROOT, 'apps/web/app/DashboardClient.tsx'),
  money: path.join(ROOT, 'apps/web/app/ledger/LedgerClient.tsx'),
  find: path.join(ROOT, 'apps/web/app/catalogue/CatalogueClient.tsx'),
  goals: path.join(ROOT, 'apps/web/app/dreams/DreamsClient.tsx'),
  me: path.join(ROOT, 'apps/web/app/profile/ProfileClient.tsx'),
};

const MOBILE_FILES: Record<string, string> = {
  home: path.join(ROOT, 'apps/mobile/app/(tabs)/index.tsx'),
  money: path.join(ROOT, 'apps/mobile/app/(tabs)/ledger.tsx'),
  find: path.join(ROOT, 'apps/mobile/app/(tabs)/catalogue.tsx'),
  goals: path.join(ROOT, 'apps/mobile/app/(tabs)/goals.tsx'),
  me: path.join(ROOT, 'apps/mobile/app/(tabs)/profile.tsx'),
};

// Section keywords that must appear in both platforms
const SECTION_MARKERS: Record<string, string[]> = {
  home: ['mizan_score', 'quick_actions', 'insight', 'recent_transactions'],
  money: ['money_summary', 'accounts', 'spending_summary', 'recent_transactions'],
  find: ['product_search', 'product_categories', 'product_list'],
  goals: ['budget_overview', 'bill_reminders', 'savings_goals', 'quick_stats'],
  me: ['profile_identity', 'mizan_score', 'accounts', 'security_privacy', 'settings_links'],
};

// View models that should be imported
const REQUIRED_VMS: Record<string, string[]> = {
  home: ['buildMoneySummaryVM', 'buildBudgetOverviewVM', 'buildRecentTransactionsVM'],
  money: ['buildMoneySummaryVM', 'buildAccountsVM', 'buildSpendingSummaryVM', 'buildRecentTransactionsVM'],
  goals: ['buildBudgetOverviewVM', 'buildGoalsVM'],
  me: ['buildAccountsVM'],
};

// Component token references
const TOKEN_PATTERNS = [
  'MizanComponentTokens',
  'statCard',
  'transactionRow',
  'insightCard',
  'accountTile',
  'scoreCard',
  'progressBar',
];

// ─── Runner ───

interface Issue {
  tab: string;
  platform: 'web' | 'mobile';
  type: 'missing_section' | 'missing_vm' | 'missing_token' | 'file_not_found';
  detail: string;
}

function checkFile(filePath: string, tab: string, platform: 'web' | 'mobile'): Issue[] {
  const issues: Issue[] = [];

  if (!fs.existsSync(filePath)) {
    issues.push({ tab, platform, type: 'file_not_found', detail: `File not found: ${filePath}` });
    return issues;
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  // Check section markers via comments
  const markers = SECTION_MARKERS[tab] || [];
  for (const marker of markers) {
    // Look for the marker as a comment, variable name, or section identifier
    const patterns = [
      marker,                           // exact key
      marker.replace(/_/g, ' '),        // "money summary"
      marker.replace(/_/g, '_'),        // direct underscore
    ];
    const found = patterns.some(p => content.toLowerCase().includes(p.toLowerCase()));
    if (!found) {
      issues.push({
        tab,
        platform,
        type: 'missing_section',
        detail: `Section "${marker}" not found`,
      });
    }
  }

  // Check view model imports (mobile only for now, web uses different patterns)
  if (platform === 'mobile') {
    const vms = REQUIRED_VMS[tab] || [];
    for (const vm of vms) {
      if (!content.includes(vm)) {
        issues.push({
          tab,
          platform,
          type: 'missing_vm',
          detail: `Shared VM "${vm}" not imported`,
        });
      }
    }
  }

  // Check for component token usage
  const hasTokenImport = TOKEN_PATTERNS.some(p => content.includes(p));
  if (platform === 'mobile' && !hasTokenImport) {
    issues.push({
      tab,
      platform,
      type: 'missing_token',
      detail: 'No MizanComponentTokens reference found',
    });
  }

  return issues;
}

function run() {
  console.log('🔍 Mizan UI Parity Check\n');
  console.log('═'.repeat(50));

  let totalIssues = 0;
  const tabs = ['home', 'money', 'find', 'goals', 'me'];

  for (const tab of tabs) {
    console.log(`\n📋 ${tab.toUpperCase()} TAB`);

    const webFile = WEB_FILES[tab];
    const mobileFile = MOBILE_FILES[tab];

    const webIssues = checkFile(webFile, tab, 'web');
    const mobileIssues = checkFile(mobileFile, tab, 'mobile');

    const allIssues = [...webIssues, ...mobileIssues];

    if (allIssues.length === 0) {
      console.log('   ✅ Both platforms aligned');
    } else {
      for (const issue of allIssues) {
        const icon = issue.type === 'file_not_found' ? '⚠️' :
                     issue.type === 'missing_section' ? '❌' :
                     issue.type === 'missing_vm' ? '🔧' : '📐';
        console.log(`   ${icon} [${issue.platform}] ${issue.detail}`);
      }
      totalIssues += allIssues.length;
    }
  }

  console.log('\n' + '═'.repeat(50));
  if (totalIssues === 0) {
    console.log('✅ All tabs aligned! No parity issues found.');
    process.exit(0);
  } else {
    console.log(`❌ Found ${totalIssues} parity issue(s). Please fix before committing.`);
    process.exit(1);
  }
}

run();
