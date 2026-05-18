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
    .select('name, brand, category, image_url, description')
    .eq('slug', slug)
    .single();

  if (!product) {
    return {
      title: 'Product Not Found | Tawakkal Paint House',
    };
  }

  const title = `${product.brand} ${product.name} - Best Price in Pakistan | Tawakkal Paint`;
  const description = product.description || `Get the best price for ${product.brand} ${product.name} in Pakistan at Tawakkal Paint House. Authorized dealer for ${product.brand}. Original sealed products with fast delivery in Karachi. Shop ${product.category} now.`;

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
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('products')
    .select('name, brand, category, image_url, description, price_gallon, price_quarter, price_drum, in_stock')
    .eq('slug', slug)
    .single();

  const jsonLd = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${product.brand} ${product.name}`,
    "image": product.image_url ? [product.image_url] : [],
    "description": product.description || `Buy ${product.brand} ${product.name} at the best price in Karachi, Pakistan. Original sealed paint directly from Tawakkal Paint House.`,
    "category": product.category,
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "PKR",
      "price": product.price_gallon || product.price_quarter || product.price_drum || 0,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `https://tawakkalpainthouse.com/product/${slug}`,
      "seller": {
        "@type": "LocalBusiness",
        "name": "Tawakkal Paint House"
      }
    }
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductView initialSlug={slug} />
    </>
  );
}
