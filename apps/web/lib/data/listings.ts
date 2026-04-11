// ──────────────────────────────────────────────
// Marketplace Listings — Real Estate & Vehicles
// ──────────────────────────────────────────────

export interface PropertyListing {
    id: string;
    type: 'apartment' | 'villa' | 'commercial' | 'land';
    title: string;
    location: string;
    neighborhood: string;
    price: number;
    priceUnit: 'ETB' | 'ETB/sqm' | 'ETB/month';
    bedrooms?: number;
    bathrooms?: number;
    area: number;
    yearBuilt?: number;
    features: string[];
    description: string;
    listingType: 'sale' | 'rent';
    agent: string;
    verified: boolean;
}

export interface VehicleListing {
    id: string;
    make: string;
    model: string;
    year: number;
    mileage: number;
    price: number;
    fuelType: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
    transmission: 'Automatic' | 'Manual';
    color: string;
    condition: 'New' | 'Used — Excellent' | 'Used — Good' | 'Used — Fair';
    features: string[];
    description: string;
    dealer: string;
    verified: boolean;
}

export const properties: PropertyListing[] = [
    {
        id: 'bole-3br-apt', type: 'apartment',
        title: '3BR Luxury Apartment in Bole',
        location: 'Bole Sub-City, Addis Ababa', neighborhood: 'Bole',
        price: 8500000, priceUnit: 'ETB',
        bedrooms: 3, bathrooms: 2, area: 150, yearBuilt: 2023,
        features: ['24/7 security', 'Underground parking', 'Elevator', 'Gym access', 'Generator backup'],
        description: 'Modern 3-bedroom apartment in the heart of Bole with panoramic city views. Walking distance to Edna Mall and Bole International Airport.',
        listingType: 'sale', agent: 'Habesha Real Estate', verified: true,
    },
    {
        id: 'cmc-2br-apt', type: 'apartment',
        title: '2BR Apartment Near CMC',
        location: 'Yeka Sub-City, Addis Ababa', neighborhood: 'CMC',
        price: 4200000, priceUnit: 'ETB',
        bedrooms: 2, bathrooms: 1, area: 90, yearBuilt: 2022,
        features: ['Gated community', 'Parking space', 'Balcony', 'Water tank'],
        description: 'Affordable 2-bedroom apartment in the rapidly developing CMC area. Close to schools and shopping centers.',
        listingType: 'sale', agent: 'Aden Properties', verified: true,
    },
    {
        id: 'sarbet-villa', type: 'villa',
        title: '4BR Villa with Garden in Sarbet',
        location: 'Nifas Silk-Lafto, Addis Ababa', neighborhood: 'Sarbet',
        price: 22000000, priceUnit: 'ETB',
        bedrooms: 4, bathrooms: 3, area: 350, yearBuilt: 2021,
        features: ['Private garden', 'Servant quarter', '2-car garage', 'Solar water heater', 'CCTV cameras'],
        description: 'Spacious villa in the quiet Sarbet neighborhood. Perfect for families seeking space and privacy with modern amenities.',
        listingType: 'sale', agent: 'Habesha Real Estate', verified: true,
    },
    {
        id: 'merkato-commercial', type: 'commercial',
        title: 'Prime Commercial Space in Merkato',
        location: 'Addis Ketema, Addis Ababa', neighborhood: 'Merkato',
        price: 120000, priceUnit: 'ETB/month',
        area: 200,
        features: ['Ground floor', 'High foot traffic', 'Loading dock', 'Power backup'],
        description: 'Prime retail or warehouse space in Africa\'s largest open-air market. Ideal for wholesale or retail businesses.',
        listingType: 'rent', agent: 'Merkato Properties', verified: true,
    },
    {
        id: 'summit-studio', type: 'apartment',
        title: 'Studio Apartment — Summit Condos',
        location: 'Bole Sub-City, Addis Ababa', neighborhood: 'Summit',
        price: 25000, priceUnit: 'ETB/month',
        bedrooms: 1, bathrooms: 1, area: 45, yearBuilt: 2024,
        features: ['Furnished', 'Shared pool', 'Concierge', 'High-speed internet'],
        description: 'Modern furnished studio in the new Summit Condominium. Perfect for young professionals and expats.',
        listingType: 'rent', agent: 'Aden Properties', verified: true,
    },
    {
        id: 'ayat-land', type: 'land',
        title: '500sqm Residential Plot in Ayat',
        location: 'Yeka Sub-City, Addis Ababa', neighborhood: 'Ayat',
        price: 12000, priceUnit: 'ETB/sqm',
        area: 500,
        features: ['Title deed ready', 'Road access', 'Water and electricity nearby', 'Residential zone'],
        description: 'Build your dream home on this 500sqm plot in the fast-growing Ayat neighborhood. All utilities available.',
        listingType: 'sale', agent: 'Habesha Real Estate', verified: true,
    },
    {
        id: 'kazanchis-office', type: 'commercial',
        title: 'Grade A Office Space — Kazanchis',
        location: 'Kirkos Sub-City, Addis Ababa', neighborhood: 'Kazanchis',
        price: 180000, priceUnit: 'ETB/month',
        area: 300, yearBuilt: 2023,
        features: ['Grade A finish', 'Meeting rooms', '24/7 access', 'Underground parking', 'Fiber internet'],
        description: 'Premium office space near the AU headquarters. Ideal for international organizations, embassies, and corporate offices.',
        listingType: 'rent', agent: 'Addis Business Hub', verified: true,
    },
    {
        id: 'lebu-3br-apt', type: 'apartment',
        title: '3BR Apartment in Lebu',
        location: 'Nifas Silk-Lafto, Addis Ababa', neighborhood: 'Lebu',
        price: 3800000, priceUnit: 'ETB',
        bedrooms: 3, bathrooms: 2, area: 120, yearBuilt: 2022,
        features: ['Gated compound', 'Parking', 'Balcony with view', 'Water reserve'],
        description: 'Affordable family apartment in the growing Lebu area. Quiet neighborhood with easy access to the ring road.',
        listingType: 'sale', agent: 'Aden Properties', verified: true,
    },
];

export const vehicles: VehicleListing[] = [
    {
        id: 'toyota-vitz-2019', make: 'Toyota', model: 'Vitz (Yaris)',
        year: 2019, mileage: 45000, price: 1800000,
        fuelType: 'Petrol', transmission: 'Automatic', color: 'White',
        condition: 'Used — Excellent',
        features: ['AC', 'Power steering', 'Bluetooth', 'Rear camera', 'Keyless entry'],
        description: 'Well-maintained Toyota Vitz imported from Japan. Low mileage, full service history. The most popular car in Addis Ababa.',
        dealer: 'Nile Motors', verified: true,
    },
    {
        id: 'suzuki-swift-2020', make: 'Suzuki', model: 'Swift',
        year: 2020, mileage: 32000, price: 2100000,
        fuelType: 'Petrol', transmission: 'Automatic', color: 'Silver',
        condition: 'Used — Excellent',
        features: ['AC', 'Apple CarPlay', 'Lane assist', 'Cruise control'],
        description: 'Sporty and fuel-efficient Suzuki Swift. Perfect for navigating Addis Ababa traffic with excellent fuel economy.',
        dealer: 'Nile Motors', verified: true,
    },
    {
        id: 'hyundai-tucson-2021', make: 'Hyundai', model: 'Tucson',
        year: 2021, mileage: 28000, price: 4500000,
        fuelType: 'Diesel', transmission: 'Automatic', color: 'Black',
        condition: 'Used — Excellent',
        features: ['Leather seats', 'Panoramic sunroof', 'AWD', '360 camera', 'Heated seats'],
        description: 'Premium mid-size SUV with all-wheel drive. Handles diverse road conditions with comfort and style.',
        dealer: 'Marathon Auto', verified: true,
    },
    {
        id: 'toyota-hilux-2022', make: 'Toyota', model: 'Hilux Double Cab',
        year: 2022, mileage: 18000, price: 6200000,
        fuelType: 'Diesel', transmission: 'Manual', color: 'Grey',
        condition: 'Used — Excellent',
        features: ['4WD', 'Tow bar', 'Bed liner', 'Bull bar', 'Snorkel'],
        description: 'Legendary Toyota Hilux built for Ethiopian terrain. Perfect for business and adventure with bulletproof reliability.',
        dealer: 'Marathon Auto', verified: true,
    },
    {
        id: 'lifan-x60-2023', make: 'Lifan', model: 'X60',
        year: 2023, mileage: 8000, price: 1500000,
        fuelType: 'Petrol', transmission: 'Manual', color: 'Red',
        condition: 'New',
        features: ['AC', 'Touchscreen', 'Rear sensors', 'Fog lights'],
        description: 'Brand new Lifan X60 crossover assembled in Ethiopia. Affordable SUV-style vehicle with modern features.',
        dealer: 'Lifan Ethiopia', verified: true,
    },
    {
        id: 'toyota-corolla-2020', make: 'Toyota', model: 'Corolla',
        year: 2020, mileage: 41000, price: 3200000,
        fuelType: 'Petrol', transmission: 'Automatic', color: 'Pearl White',
        condition: 'Used — Good',
        features: ['Toyota Safety Sense', 'Adaptive cruise', 'Lane departure', 'Apple CarPlay'],
        description: 'Reliable Toyota Corolla sedan. Excellent condition with full Toyota service history. Addis Ababa based.',
        dealer: 'Nile Motors', verified: true,
    },
];
