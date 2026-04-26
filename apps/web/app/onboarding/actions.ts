'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { isCoreProfileComplete } from '@/lib/profile/completeness';
import { getOrCreateDbUser } from '@/lib/supabase/auth-adapter';

export async function performUpdateOnboardingPhase(phase: string, data: any) {
  try {
    const userContext = await getOrCreateDbUser();
    const user = userContext?.dbUser;

    if (!user) {
      return { error: 'Unauthorized' };
    }

    const existingUser = user;

    const nextOnboardingPhase =
      phase === 'progressive'
        ? (existingUser?.onboardingPhase || 'signup')
        : existingUser?.onboardingPhase === 'complete'
          ? 'complete'
          : phase;

    const payload: any = { onboardingPhase: nextOnboardingPhase };
    
    // Core profile updates
    if (data.name) payload.name = data.name;
    if (data.gender) payload.gender = data.gender;
    if (data.dateOfBirth) payload.dateOfBirth = new Date(data.dateOfBirth);
    if (data.educationLevel) payload.educationLevel = data.educationLevel;
    if (data.employmentStatus) payload.employmentStatus = data.employmentStatus;
    if (data.employmentSector) payload.employmentSector = data.employmentSector;
    if (data.residencyStatus) payload.residencyStatus = data.residencyStatus;
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
    
    payload.isProfileComplete = isCoreProfileComplete({
       ...(existingUser || {}),
       ...payload,
    });

    // Check for username uniqueness if provided
    if (data.username) {
      const usernameExists = await prisma.user.findFirst({
        where: { 
          username: data.username,
          NOT: { id: user.id }
        },
      });
      if (usernameExists) {
        return { error: 'Username is already taken' };
      }
      payload.username = data.username;
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
                type: acc.type || 'Savings',
                number: acc.accountNumber || null,
                balance: parseFloat(acc.balance) || 0,
                isCompulsory: Boolean(acc.isCompulsory),
                color: acc.color || '#3EA63B'
             }
          });
       }
    }

    if (data.goals && Array.isArray(data.goals)) {
       for (const goal of data.goals) {
          await prisma.goal.create({
             data: {
                userId: user.id,
                name: goal.name,
                target: parseFloat(goal.target) || 0,
                emoji: goal.emoji || '🎯'
             }
          });
       }
    }

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('Onboarding update error:', error);
    return { error: error.message || 'Failed to update onboarding data' };
  }
}
