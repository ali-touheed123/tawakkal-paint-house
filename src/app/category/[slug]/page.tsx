import { Metadata } from 'next';
import { CategoryView } from './CategoryView';

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const categoryTitles: Record<string, string> = {
  decorative: 'Decorative Paints & Wall Coatings',
  industrial: 'Industrial Protective Coatings',
  auto: 'Automotive & Vehicle Refinishing',
  projects: 'Bulk Project Paint Supply',
  deals: 'Exclusive Paint Deals & Packages'
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;
  const title = categoryTitles[slug] || 'Premium Paints';
  
  return {
    title: `${title} | Tawakkal Paint House Karachi`,
    description: `Shop high-quality ${title.toLowerCase()} in Karachi. Authorized dealer for Gobi's, Berger, Diamond, and more. Free color consultation and original sealed products.`,
    openGraph: {
      title: `${title} | Tawakkal Paint House`,
      description: `Premium ${title.toLowerCase()} for your home or business in Karachi.`,
      url: `https://tawakkalpainthouse.com/category/${slug}`,
    }
  };
}

export default function CategoryPage({ params }: Props) {
  return <CategoryView initialCategory={params.slug} />;
}
