const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kadkryylyzfwtxknvcic.supabase.co';
const supabaseKey = 'sb_publishable_fJrcCMjovWvsxV1Dg7Cs5A_ZM-8Q7Xp';
const supabase = createClient(supabaseUrl, supabaseKey);

const productId = '88298dc5-59d7-4060-8540-15b42e952c28'; // Brighto Super Emulsion

const shades = [
    { product_id: productId, name: 'Brilliant White', code: '9000', hex: '#FFFFFF', is_drum_available: true },
    { product_id: productId, name: 'Off White', code: '9012', hex: '#FAF9F6', is_drum_available: true },
    { product_id: productId, name: 'Ash White', code: '9041', hex: '#F2F2F2', is_drum_available: true },
    { product_id: productId, name: 'Lavender White', code: '9071', hex: '#F4F0FF', is_drum_available: false },
    { product_id: productId, name: 'Wisteria White', code: '9805', hex: '#FDF5E6', is_drum_available: false },
    { product_id: productId, name: 'Twilight', code: '9807', hex: '#E6E6FA', is_drum_available: false },
    { product_id: productId, name: 'Kitten White', code: '9802', hex: '#FFF5EE', is_drum_available: false },
    { product_id: productId, name: 'New Ash White', code: '9141', hex: '#E8E8E8', is_drum_available: false },
    { product_id: productId, name: 'Silver Grey', code: '9808', hex: '#C0C0C0', is_drum_available: false },
    { product_id: productId, name: 'Shell Grey', code: '9809', hex: '#D3D3D3', is_drum_available: false },
    { product_id: productId, name: 'Dove White', code: '9803', hex: '#F8F8F8', is_drum_available: false },
    { product_id: productId, name: 'Goose Wing', code: '9684', hex: '#DCDCDC', is_drum_available: false },
    { product_id: productId, name: 'Ice Grey', code: '9681', hex: '#D1D1D1', is_drum_available: false },
    { product_id: productId, name: 'Rose White', code: '9070', hex: '#FFF0F5', is_drum_available: false },
    { product_id: productId, name: 'Whisper', code: '9043', hex: '#F5F5F5', is_drum_available: false },
    { product_id: productId, name: 'Dove Grey', code: '9046', hex: '#A9A9A9', is_drum_available: false },
    { product_id: productId, name: 'Cream', code: '9001', hex: '#FFFDD0', is_drum_available: false },
    { product_id: productId, name: 'Ivory Silk', code: '9801', hex: '#FFFFF0', is_drum_available: false },
    { product_id: productId, name: 'Peach Cream', code: '9040', hex: '#FFEFD5', is_drum_available: false },
    { product_id: productId, name: 'Champaign', code: '9306', hex: '#F7E7CE', is_drum_available: false },
    { product_id: productId, name: 'Badami', code: '9048', hex: '#EEDC82', is_drum_available: false },
    { product_id: productId, name: 'Brazil Nut', code: '9804', hex: '#A67B5B', is_drum_available: false },
    { product_id: productId, name: 'Sand Stone', code: '9042', hex: '#C2B280', is_drum_available: false },
    { product_id: productId, name: 'Stone', code: '9017', hex: '#8B8680', is_drum_available: false },
    { product_id: productId, name: 'Coca Milk', code: '9305', hex: '#D2B48C', is_drum_available: false },
    { product_id: productId, name: 'Chocolate', code: '9022', hex: '#7B3F00', is_drum_available: false },
    { product_id: productId, name: 'Pale Peach', code: '9045', hex: '#FFDAB9', is_drum_available: false },
    { product_id: productId, name: 'Rose Petal', code: '9050', hex: '#F7CAC9', is_drum_available: false },
    { product_id: productId, name: 'Palm Peach Pink', code: '9302', hex: '#FFD1DC', is_drum_available: false },
    { product_id: productId, name: 'Apricot', code: '9024', hex: '#FBCEB1', is_drum_available: false },
    { product_id: productId, name: 'Tea Rose', code: '9686', hex: '#F4C2C2', is_drum_available: false },
    { product_id: productId, name: 'Deep Pink', code: '9221', hex: '#FF1493', is_drum_available: false },
    { product_id: productId, name: 'Coral Spice', code: '9688', hex: '#E2725B', is_drum_available: false },
    { product_id: productId, name: 'Rose Pink', code: '9015', hex: '#FF66CC', is_drum_available: false },
    { product_id: productId, name: 'Brighto Pink', code: '9009', hex: '#FF007F', is_drum_available: false },
    { product_id: productId, name: 'Summer Pink', code: '9300', hex: '#FFB6C1', is_drum_available: false },
    { product_id: productId, name: 'Carnival Pink', code: '9222', hex: '#E4007C', is_drum_available: false },
    { product_id: productId, name: 'Brighto Red', code: '9007', hex: '#ED1C24', is_drum_available: false },
    { product_id: productId, name: 'Pastle Green', code: '9690', hex: '#77DD77', is_drum_available: false },
    { product_id: productId, name: 'Fresh Green', code: '9506', hex: '#90EE90', is_drum_available: false },
    { product_id: productId, name: 'Pine Frost', code: '9689', hex: '#E0F2F1', is_drum_available: false },
    { product_id: productId, name: 'Lime Green', code: '9006', hex: '#32CD32', is_drum_available: false },
    { product_id: productId, name: 'Melody Green', code: '9010', hex: '#98FF98', is_drum_available: false },
    { product_id: productId, name: 'Apple Green', code: '9027', hex: '#8DB600', is_drum_available: false },
    { product_id: productId, name: 'Brighto Green', code: '9004', hex: '#008000', is_drum_available: false },
    { product_id: productId, name: 'Forest Green', code: '9510', hex: '#228B22', is_drum_available: false },
    { product_id: productId, name: 'Green Summit', code: '9513', hex: '#004225', is_drum_available: false },
    { product_id: productId, name: 'Leaf Green', code: '9035', hex: '#3CB371', is_drum_available: false },
    { product_id: productId, name: 'Lilac', code: '9011', hex: '#C8A2C8', is_drum_available: false },
    { product_id: productId, name: 'Soothing Lilac', code: '9683', hex: '#E6E6FA', is_drum_available: false },
    { product_id: productId, name: 'Purple', code: '9501', hex: '#800080', is_drum_available: false },
    { product_id: productId, name: 'Ice Blue', code: '9014', hex: '#AFEEEE', is_drum_available: false },
    { product_id: productId, name: 'Light Blue', code: '9002', hex: '#ADD8E6', is_drum_available: false },
    { product_id: productId, name: 'Brighto Blue', code: '9008', hex: '#0000FF', is_drum_available: false },
    { product_id: productId, name: 'Peacock Plum', code: '9502', hex: '#BDB76B', is_drum_available: false },
    { product_id: productId, name: 'Fluorite', code: '9503', hex: '#996515', is_drum_available: false },
    { product_id: productId, name: 'Electric Blue', code: '9508', hex: '#7DF9FF', is_drum_available: false },
    { product_id: productId, name: 'Cockleshell', code: '9072', hex: '#FFE5B4', is_drum_available: false },
    { product_id: productId, name: 'Zephyr', code: '9303', hex: '#778899', is_drum_available: false },
    { product_id: productId, name: 'Cameo', code: '9687', hex: '#D2B48C', is_drum_available: false },
    { product_id: productId, name: 'Parasol', code: '9692', hex: '#EEDC82', is_drum_available: false },
    { product_id: productId, name: 'Classical', code: '9332', hex: '#F5F5DC', is_drum_available: false },
    { product_id: productId, name: 'Orange', code: '9005', hex: '#FFA500', is_drum_available: false },
    { product_id: productId, name: 'Terracotta', code: '9698', hex: '#E2725B', is_drum_available: false },
    { product_id: productId, name: 'Black', code: '9810', hex: '#000000', is_drum_available: false }
];

async function seedShades() {
    console.log('Seeding', shades.length, 'shades...');

    // First, clear existing shades for this product to avoid duplicates
    const { error: deleteError } = await supabase
        .from('product_shades')
        .delete()
        .eq('product_id', productId);

    if (deleteError) {
        console.error('Error clearing old shades:', deleteError);
        return;
    }

    const { data, error } = await supabase
        .from('product_shades')
        .insert(shades);

    if (error) {
        console.error('Error seeding shades:', error);
    } else {
        console.log('Successfully seeded shades!');
    }
}

seedShades();
