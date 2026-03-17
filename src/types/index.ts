export const ORDER_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const;
export type OrderStatus = typeof ORDER_STATUSES[number];

export type ItemSize = 'quarter' | 'gallon' | 'drum';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  sub_category: string | null;
  description: string | null;
  image_url: string | null;
  price_quarter: number;
  price_gallon: number;
  price_drum: number;
  in_stock: boolean;
  shade_card_url?: string | null;
  selectedShade?: {
    name: string;
    code: string;
    hex: string;
  };
  created_at: string;
}


export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  size: ItemSize;
  quantity: number;
  created_at: string;
  product?: Product;
  selectedShade?: {
    name: string;
    code: string;
    hex: string;
  };
}

export interface OrderItem {
  product_id: string;
  name: string;
  brand: string;
  size: ItemSize;
  quantity: number;
  price: number;
  image_url: string | null;
  selectedShade?: {
    name: string;
    code: string;
    hex: string;
  };
}

export interface Order {
  id: string;
  user_id?: string | null;
  items: OrderItem[];
  subtotal: number;
  discount_percent: number;
  discount_amount: number;
  shipping_amount?: number;
  total: number;
  payment_method: string;
  status: OrderStatus;
  delivery_area: string;
  delivery_address: string;
  phone: string;
  created_at: string;
}

export interface DealPackage {
  id: string;
  name: string;
  description: string;
  includes: string[];
  icon?: any;
  color?: string;
  bg?: string;
  border?: string;
}

export interface SiteSettings {
  logo?: string;
  contact?: {
    phone: string;
    email: string;
    whatsapp: string;
  };
  socials?: {
    facebook: string;
    instagram: string;
    tiktok?: string;
  };
  banners?: string[];
  deals_base_pricing?: {
    local: number;
    normal: number;
    best: number;
    premium: number;
  };
  deals_packages_config?: DealPackage[];
  deals_labour_discount?: number;
  deals_visit_fee?: number;
}

export interface DiscountRule {
  id: string;
  min_amount: number;
  max_amount: number;
  discount_percent: number;
  is_active: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'cod' | 'bank' | 'jazz_cash' | 'easy_paisa';
  details: string | null;
  is_active: boolean;
}

export interface ShippingRate {
  id: string;
  city: string;
  area: string;
  rate: number;
  min_order_for_free: number | null;
  is_active: boolean;
}

export const KARACHI_AREAS = [
  'Airport',
  'Arambagh',
  'Baldia',
  'Bin Qasim',
  'Civil Lines',
  'Clifton',
  'DHA',
  'F.B Area',
  'Ferozabad',
  'Gadap',
  'Garden',
  'Gulberg',
  'Gulshan-e-Iqbal',
  'Gulistan-e-Johar',
  'Gulzar-e-Hijri',
  'Harbor',
  'Ibrahim Hyderi',
  'Jamshed Quarters',
  'Keamari',
  'Korangi',
  'Landhi',
  'Liaquatabad',
  'Lyari',
  'Malir',
  'Mango Pir',
  'Maripur',
  'Model Colony',
  'Mominabad',
  'Murad Memon',
  'Nazimabad',
  'New Karachi',
  'New Nazimabad',
  'North Karachi',
  'Orangi Town',
  'Saddar',
  'Shah Faisal',
  'Shah Mureed',
  'SITE'
] as const;

export type KarachiArea = typeof KARACHI_AREAS[number];

export const DISCOUNT_TIERS = [
  { min: 0, max: 4999, discount: 0 },
  { min: 5000, max: 9999, discount: 15 },
  { min: 10000, max: 19999, discount: 20 },
  { min: 20000, max: Infinity, discount: 25 }
] as const;

export function getDiscount(subtotal: number): number {
  const tier = DISCOUNT_TIERS.find(t => subtotal >= t.min && subtotal <= t.max);
  return tier?.discount ?? 0;
}

export function getNextDiscountTier(subtotal: number): { discount: number; amountNeeded: number } | null {
  const currentTier = DISCOUNT_TIERS.find(t => subtotal >= t.min && subtotal <= t.max);
  const currentIndex = DISCOUNT_TIERS.indexOf(currentTier!);

  if (currentIndex < DISCOUNT_TIERS.length - 1) {
    const nextTier = DISCOUNT_TIERS[currentIndex + 1];
    return {
      discount: nextTier.discount,
      amountNeeded: nextTier.min - subtotal
    };
  }
  return null;
}

export const BRANDS = ['Gobi\'s', 'Berger', 'Diamond', 'Saasi', 'Brighto', 'Choice', 'Dior', 'Rozzilac', 'Reliance', 'Reliable'] as const;

export const BRAND_LOGOS: Record<string, string> = {
  "Gobi's": '/images/brands/gobis.png',
  'Berger': '/images/brands/berger.png',
  'Diamond': '/images/brands/diamond.png',
  'Saasi': '/images/brands/saasi.png',
  'Brighto': '/images/brands/brighto.png',
  'Choice': '/images/brands/choice.png',
  'Dior': '/images/brands/dior.png',
  'Rozzilac': '/images/brands/rozzi.png',
  'Reliance': '/images/brands/reliance.png',
  'Reliable': '/images/brands/reliable.png'
};

export type PaintType = {
  id: string;
  label: string;
  coverage: number;
};

export const PAINT_TYPES: PaintType[] = [
  { id: 'wall', label: 'Wall Paint', coverage: 50 },
  { id: 'primer', label: 'Primer', coverage: 50 },
  { id: 'putty', label: 'Putty', coverage: 30 },
  { id: 'wood', label: 'Wood Paint', coverage: 50 },
  { id: 'metal', label: 'Metal Paint', coverage: 50 }
];

export const COLOR_FAMILIES = [
  {
    name: 'Whites & Creams',
    colors: [
      { name: 'Pure White', hex: '#FFFFFF' },
      { name: 'Ivory', hex: '#FFFFF0' },
      { name: 'Cream', hex: '#FFFDD0' },
      { name: 'Vanilla', hex: '#F3E5AB' },
      { name: 'Pearl', hex: '#EAE0C8' },
      { name: 'Champagne', hex: '#F7E7CE' }
    ]
  },
  {
    name: 'Beiges & Tans',
    colors: [
      { name: 'Sand', hex: '#C2B280' },
      { name: 'Beige', hex: '#F5F5DC' },
      { name: 'Tan', hex: '#D2B48C' },
      { name: 'Camel', hex: '#C19A6B' },
      { name: 'Caramel', hex: '#AA6C39' },
      { name: 'Mocha', hex: '#6F4E37' }
    ]
  },
  {
    name: 'Blues & Navys',
    colors: [
      { name: 'Sky Blue', hex: '#87CEEB' },
      { name: 'Steel Blue', hex: '#4682B4' },
      { name: 'Ocean Blue', hex: '#006994' },
      { name: 'Royal Blue', hex: '#4169E1' },
      { name: 'Navy', hex: '#000080' },
      { name: 'Midnight', hex: '#191970' }
    ]
  },
  {
    name: 'Greens',
    colors: [
      { name: 'Mint', hex: '#98FF98' },
      { name: 'Sage', hex: '#9DC183' },
      { name: 'Olive', hex: '#808000' },
      { name: 'Forest', hex: '#228B22' },
      { name: 'Emerald', hex: '#50C878' },
      { name: 'Jade', hex: '#00A86B' }
    ]
  },
  {
    name: 'Greys',
    colors: [
      { name: 'Light Grey', hex: '#D3D3D3' },
      { name: 'Silver', hex: '#C0C0C0' },
      { name: 'Grey', hex: '#808080' },
      { name: 'Charcoal', hex: '#36454F' },
      { name: 'Slate', hex: '#708090' },
      { name: 'Graphite', hex: '#383838' }
    ]
  },
  {
    name: 'Warm Reds',
    colors: [
      { name: 'Coral', hex: '#FF7F50' },
      { name: 'Salmon', hex: '#FA8072' },
      { name: 'Terra Cotta', hex: '#E2725B' },
      { name: 'Brick', hex: '#CB4154' },
      { name: 'Burgundy', hex: '#800020' },
      { name: 'Maroon', hex: '#800000' }
    ]
  },
  {
    name: 'Earthy Oranges',
    colors: [
      { name: 'Peach', hex: '#FFDAB9' },
      { name: 'Apricot', hex: '#FBCEB1' },
      { name: 'Burnt Orange', hex: '#CC5500' },
      { name: 'Rust', hex: '#B7410E' },
      { name: 'Sienna', hex: '#A0522D' },
      { name: 'Brown', hex: '#8B4513' }
    ]
  },
  {
    name: 'Soft Yellows',
    colors: [
      { name: 'Lemon', hex: '#FFF44F' },
      { name: 'Butter', hex: '#F9E376' },
      { name: 'Canary', hex: '#FFEF00' },
      { name: 'Gold', hex: '#FFD700' },
      { name: 'Mustard', hex: '#FFDB58' },
      { name: 'Ochre', hex: '#CC7722' }
    ]
  }
];

export const FAQS = [
  {
    question: 'Which areas in Karachi do you deliver to?',
    answer: 'We deliver to all major areas across Karachi, including DHA, Clifton, Gulshan, Nazimabad, Korangi, Malir, and 30+ other locations. You can select your specific area from the location popup to see service availability.'
  },
  {
    question: 'Are all products 100% original and sealed?',
    answer: 'Absolutely! We are authorized dealers for Gobi\'s, Berger, Diamond, Saasi, Brighto, Choice, and exclusive distributor for Rozzilac. All our products are factory-sealed with no refills or fakes. Quality is guaranteed.'
  },
  {
    question: 'How does Cash on Delivery work?',
    answer: 'Simply place your order online, select Cash on Delivery, and our team will deliver your paint products to your doorstep. You pay when you receive your order. It\'s that simple!'
  },
  {
    question: 'Do you offer bulk pricing for contractors?',
    answer: 'Yes! We offer special contractor pricing for bulk orders. Contact us on WhatsApp with your project requirements and we\'ll provide you with a custom quote.'
  },
  {
    question: 'How does the free colour consultation work?',
    answer: 'Our expert color consultants help you choose the perfect shades for your space. Simply WhatsApp us or visit our store and we\'ll guide you through color selection based on your preferences and requirements.'
  },
  {
    question: 'What brands do you carry?',
    answer: 'We carry premium brands including Gobi\'s, Berger, Diamond, Saasi, Brighto, Choice, and are exclusive distributors for Rozzilac. All products are authentic and factory-sealed.'
  },
  {
    question: 'How do I unlock the discount system?',
    answer: 'Simply register an account on our website. Once logged in, you\'ll automatically unlock our discount tiers: 15% off on orders Rs. 5,000+, 20% off on Rs. 10,000+, and 25% off on Rs. 20,000+!'
  },
  {
    question: 'Can I track my order after placing it?',
    answer: 'Yes! Once your order is confirmed, you can track it by WhatsApping us with your Order ID. Our team will provide you with regular updates on your delivery status.'
  }
];

export interface Shade {
  id: string;
  product_id: string;
  name: string;
  code: string;
  hex: string;
  image_url?: string;
  is_drum_available: boolean;
  created_at?: string;
}
