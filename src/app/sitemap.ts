import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tawakkalpainthouse.com';

  // Static routes
  const routes = [
    '',
    '/cart',
    '/checkout',
    '/contact',
    '/deals',
    '/profile',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Categories
  const categories = ['decorative', 'industrial', 'auto', 'projects'].map((slug) => ({
    url: `${baseUrl}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // Products from Supabase
  // Note: Since this is a sitemap generation, it runs during build time or on-demand
  // using the server-side client or a service role if needed.
  // We'll use the public client for now to fetch published products.
  const supabase = createClient();
  const { data: products } = await supabase
    .from('products')
    .select('id, updated_at')
    .limit(1000);

  const productRoutes = (products || []).map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...routes, ...categories, ...productRoutes];
}
