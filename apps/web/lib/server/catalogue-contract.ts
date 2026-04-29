import prisma from '@/lib/db';
import { getProductFacts, getProductTrustMeta, getMatchExplanation, buildProductDetailDataContract, buildProviderDetailDataContract } from '@mizan/shared';

export async function getProductDetailApiResponse(productId: string, userId?: string) {
    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { provider: true }
    });

    if (!product) return null;

    if (!product.provider && product.bankId) {
        const provider = await prisma.provider.findUnique({ where: { slug: product.bankId } });
        if (provider) {
            (product as any).provider = provider;
        }
    }

    const isBookmarked = userId ? await prisma.productBookmark.count({
        where: { userId, productId: product.id }
    }) > 0 : false;

    const facts = getProductFacts(product);
    const trust = getProductTrustMeta(product);
    const matchExplanation = getMatchExplanation(product);

    const contract = buildProductDetailDataContract(product, isBookmarked, facts, trust, matchExplanation);

    return { productDetail: contract };
}

export async function getProviderDetailApiResponse(slugOrId: string) {
    let provider = await prisma.provider.findUnique({
        where: { slug: slugOrId }
    });

    if (!provider) {
        provider = await prisma.provider.findUnique({
            where: { id: slugOrId }
        });
    }

    if (!provider) return null;

    const bankProducts = await prisma.product.findMany({
        where: { OR: [{ providerId: provider.id }, { bankId: provider.slug }] }
    });

    const contract = buildProviderDetailDataContract(provider, bankProducts);

    return { providerDetail: contract };
}
