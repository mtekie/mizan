import { getOrCreateDbUser } from '@/lib/supabase/auth-adapter';
import { calculateMizanScore } from '@/lib/engine/mizan-score';
import { buildScoreScreenDataContract } from '@mizan/shared';

export async function getScoreScreenApiResponse(req?: Request) {
  const userContext = await getOrCreateDbUser(req);
  if (!userContext?.dbUser) {
    return null;
  }

  const result = await calculateMizanScore(userContext.dbUser.id);
  
  const contract = buildScoreScreenDataContract({
    scoreValue: result.score,
    factors: result.factors,
    tip: 'Your Mizan activity is looking good. Maintain this consistency to see your score grow.',
  });

  return {
    scoreScreen: contract,
  };
}
