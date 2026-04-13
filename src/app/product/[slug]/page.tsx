import { Metadata } from 'next';
import { ProductView } from './ProductView';
import { createClient } from '@/lib/supabase/server';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { slug } = params;
  const supabase = await createClient();
  
  const { data: product } = await supabase
    .from('products')
    .select('name, brand, category, image_url')
    .eq('slug', slug)
    .single();

  if (!product) {
    return {
      title: 'Product Not Found | Tawakkal Paint House',
    };
  }

  const title = `${product.brand} ${product.name} - Best Price in Pakistan | Tawakkal Paint`;
  const description = `Get the best price for ${product.brand} ${product.name} in Pakistan at Tawakkal Paint House. Authorized dealer for ${product.brand}. Original sealed products with fast delivery in Karachi. Shop ${product.category} now.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.image_url ? [product.image_url] : [],
      url: `https://tawakkalpainthouse.com/product/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.image_url ? [product.image_url] : [],
    }
  };
}

export default async function ProductPage(props: Props) {
  const params = await props.params;
  const { slug } = params;
  return <ProductView initialSlug={slug} />;
}
