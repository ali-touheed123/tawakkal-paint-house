export interface Branch {
    slug: string;
    name: string;
    type: 'Head Office' | 'Authorized Branch' | 'Dealer Store' | 'Express Center';
    address: string;
    city: string;
    area: string;
    phones: string[];
    whatsapp: string;
    googleMapsUrl: string;
    timings: string;
    landmark?: string;
}

export const BRANCHES_DATA: Branch[] = [
    {
        slug: 'maripur-head-office',
        name: 'Tawakkal Paint House (Head Office)',
        type: 'Head Office',
        address: 'Maripur Hawksbay Road, Karachi, Sindh',
        city: 'Karachi',
        area: 'Maripur',
        phones: ['03475658761'],
        whatsapp: '923475658761',
        googleMapsUrl: 'https://maps.google.com/?q=Maripur+Hawksbay+Road+Karachi',
        timings: '09:00 AM - 08:00 PM (Mon - Sat)',
        landmark: 'Main Hawksbay Road'
    },
    {
        slug: 'hawksbay-truck-stand',
        name: 'Tawakkal Paint House (Truck Stand)',
        type: 'Authorized Branch',
        address: 'Khaleel Market, Opp Gate No. 5 New Truck Stand, Hawksbay Road, Karachi, Sindh',
        city: 'Karachi',
        area: 'Hawksbay',
        phones: ['03212986388', '03162224576'],
        whatsapp: '923212986388',
        googleMapsUrl: 'https://maps.google.com/?q=New+Truck+Stand+Hawksbay+Road+Karachi',
        timings: '09:00 AM - 08:00 PM (Mon - Sat)',
        landmark: 'Opposite Gate No. 5, New Truck Stand'
    },
    {
        slug: 'site-karachi',
        name: 'Moosa & Adil Paint Shop',
        type: 'Dealer Store',
        address: 'Shop# 55, Near Binoria Welfare Trust, S.I.T.E Karachi, Sindh',
        city: 'Karachi',
        area: 'S.I.T.E',
        phones: ['03132606332'],
        whatsapp: '923132606332',
        googleMapsUrl: 'https://maps.google.com/?q=SITE+Karachi',
        timings: '09:00 AM - 07:00 PM (Mon - Sat)',
        landmark: 'Near Binoria Welfare Trust'
    },
    {
        slug: 'naval-colony',
        name: 'Muhammad Paint Store',
        type: 'Dealer Store',
        address: 'Naval Colony Road, Gulshan-e-Mazdoor, Ahmed Raza Chowk, Near L Patti, Karachi, Sindh',
        city: 'Karachi',
        area: 'Naval Colony',
        phones: ['03138282331'],
        whatsapp: '923138282331',
        googleMapsUrl: 'https://maps.google.com/?q=Naval+Colony+Gulshan-e-Mazdoor+Karachi',
        timings: '09:00 AM - 08:00 PM (Mon - Sat)',
        landmark: 'Near L Patti, Ahmed Raza Chowk'
    },
    {
        slug: 'bara-board-maripur',
        name: 'Shahzain Paint Store',
        type: 'Dealer Store',
        address: 'Maripur Bara Board, Opposite Puma Petrol Pump, Hawksbay Road, Karachi, Sindh',
        city: 'Karachi',
        area: 'Bara Board',
        phones: ['03481004630'],
        whatsapp: '923481004630',
        googleMapsUrl: 'https://maps.google.com/?q=Bara+Board+Hawksbay+Road+Karachi',
        timings: '09:00 AM - 08:00 PM (Mon - Sat)',
        landmark: 'Opposite Puma Petrol Pump'
    },
    {
        slug: 'balkassar-talagang',
        name: 'Tawakal Paints (Balkassar Branch)',
        type: 'Authorized Branch',
        address: 'Talagang Road, Old Lari Adda Balkassar, Near MCB Bank, Balkassar, Punjab',
        city: 'Balkassar',
        area: 'Talagang Road',
        phones: ['03157368917'],
        whatsapp: '923157368917',
        googleMapsUrl: 'https://maps.google.com/?q=Talagang+Road+Balkassar',
        timings: '08:00 AM - 06:00 PM (Mon - Sat)',
        landmark: 'Near MCB Bank, Old Lari Adda'
    },
    {
        slug: 'dera-ismail-khan',
        name: 'Tawakkal Paint & Building Material Store',
        type: 'Dealer Store',
        address: 'Multan Road, Nazd Naseem College, Dera Ismail Khan, KPK',
        city: 'Dera Ismail Khan',
        area: 'Multan Road',
        phones: ['03007036367'],
        whatsapp: '923007036367',
        googleMapsUrl: 'https://maps.google.com/?q=Multan+Road+Naseem+College+Dera+Ismail+Khan',
        timings: '08:00 AM - 07:00 PM (Mon - Sat)',
        landmark: 'Near Naseem College, Multan Road'
    }
];
