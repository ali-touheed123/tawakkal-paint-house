import { Metadata } from 'next';
import { ProductView } from './ProductView';
import { createClient } from '@/lib/supabase/client';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  const supabase = createClient();
  
  const { data: product } = await supabase
    .from('products')
    .select('name, brand, category, image_url')
    .eq('id', id)
    .single();

  if (!product) {
    return {
      title: 'Product Not Found | Tawakkal Paint House',
    };
  }

  const title = `${product.brand} ${product.name} | Tawakkal Paint House Karachi`;
  const description = `Buy ${product.brand} ${product.name} at the best price in Karachi. Authorized dealer for ${product.brand}. Original sealed paint with doorstep delivery. Shop ${product.category} products online.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.image_url ? [product.image_url] : [],
      url: `https://tawakkalpainthouse.com/product/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.image_url ? [product.image_url] : [],
    }
  };
}

export default function ProductPage({ params }: Props) {
  return <ProductView initialId={params.id} />;
}
