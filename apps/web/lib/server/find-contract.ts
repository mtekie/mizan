import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/supabase/auth-adapter';
import { buildFindScreenDataContract, type FindScreenApiResponse } from '@mizan/shared';

const productSelect = {
  id: true,
  name: true,
  title: true,
  bankName: true,
  bankId: true,
  bankLogo: true,
  category: true,
  productClass: true,
  productType: true,
  minBalance: true,
  maxAmount: true,
  interestRate: true,
  interestMax: true,
  term: true,
  matchScore: true,
  isFeatured: true,
  isVerified: true,
  updatedAt: true,
  currency: true,
  digital: true,
  interestFree: true,
  genderBased: true,
  sourceName: true,
  sourceUrl: true,
  sourceType: true,
  lastReviewedAt: true,
  reviewedBy: true,
  dataConfidence: true,
  features: true,
  eligibility: true,
  requirements: true,
  description: true,
  provider: {
    select: {
      id: true,
      name: true,
      logoUrl: true,
      shortCode: true,
      brandColor: true,
    },
  },
};

export async function getFindScreenApiResponse(req?: Request, take = 50): Promise<FindScreenApiResponse> {
  const authUser = await getAuthUser(req);

  const [products, providers, profile] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      select: productSelect,
      take,
      orderBy: [
        { isFeatured: 'desc' },
        { matchScore: 'desc' },
      ],
    }),
    prisma.provider.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        shortCode: true,
        brandColor: true,
        logoUrl: true,
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
      orderBy: { name: 'asc' },
    }),
    authUser ? prisma.user.findUnique({ where: { id: authUser.id } }) : null,
  ]);

  const providersWithCounts = providers.map(provider => ({
    ...provider,
    productCount: provider._count.products,
  }));
  const find = buildFindScreenDataContract({ products, providers: providersWithCounts });

  return {
    products,
    providers: providersWithCounts,
    featured: products.filter(product => product.isFeatured).slice(0, 5),
    find,
    profile: profile
      ? {
          id: profile.id,
          fullName: profile.name,
          isComplete: Boolean(profile.gender && profile.employmentStatus && profile.monthlyIncomeRange),
        }
      : null,
  };
}
