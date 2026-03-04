import { MetadataRoute } from 'next';
import { products } from '@/lib/data/products';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://mizan.et';

    // Static pages
    const staticPages = [
        '', '/catalogue', '/dreams', '/ledger', '/profile', '/score',
        '/wealth', '/settings', '/notifications', '/tips', '/login',
    ].map(path => ({
        url: `${baseUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: path === '' ? 1 : 0.8,
    }));

    // Product detail pages
    const productPages = products.map(product => ({
        url: `${baseUrl}/catalogue/${product.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    return [...staticPages, ...productPages];
}
