'use server';

import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function performUpdateOnboardingPhase(phase: string, data: any) {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return { error: 'Unauthorized' };
    }

    const payload: any = { onboardingPhase: phase };
    
    // Core profile updates
    if (data.name) payload.name = data.name;
    if (data.gender) payload.gender = data.gender;
    if (data.dateOfBirth) payload.dateOfBirth = new Date(data.dateOfBirth);
    if (data.educationLevel) payload.educationLevel = data.educationLevel;
    if (data.employmentStatus) payload.employmentStatus = data.employmentStatus;
    if (data.monthlyIncomeRange) payload.monthlyIncomeRange = data.monthlyIncomeRange;
    if (data.familyStatus) payload.familyStatus = data.familyStatus;

    // Persona Enrichment
    if (data.financialPriority) payload.financialPriority = data.financialPriority;
    if (data.riskAppetite) payload.riskAppetite = data.riskAppetite;
    if (data.interestFree !== undefined) payload.interestFree = data.interestFree;
    if (data.dependents !== undefined) payload.dependents = parseInt(data.dependents);
    if (data.housingStatus) payload.housingStatus = data.housingStatus;
    if (data.incomeStability) payload.incomeStability = data.incomeStability;
    if (data.digitalAdoption) payload.digitalAdoption = data.digitalAdoption;
    if (data.behavioralStyle) payload.behavioralStyle = data.behavioralStyle;
    
    // If finishing profile step, mark it complete
    if (phase === 'complete' || phase === 'goals') {
       payload.isProfileComplete = true;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: payload,
    });

    // Special handling for nested creation if provided
    if (data.accounts && Array.isArray(data.accounts)) {
       for (const acc of data.accounts) {
          await prisma.account.create({
             data: {
                userId: user.id,
                name: acc.name,
                type: acc.type,
                balance: parseFloat(acc.balance) || 0,
                color: acc.color || '#3EA63B'
             }
          });
       }
    }

    if (data.goal) {
       await prisma.goal.create({
          data: {
             userId: user.id,
             name: data.goal.name,
             target: parseFloat(data.goal.target) || 0,
             emoji: data.goal.emoji || '🎯'
          }
       });
    }

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('Onboarding update error:', error);
    return { error: error.message || 'Failed to update onboarding data' };
  }
}
