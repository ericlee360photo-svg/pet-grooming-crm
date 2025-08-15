export interface GroomingService {
  id: string;
  name: string;
  description: string;
  category: 'basic' | 'grooming' | 'styling' | 'spa' | 'addon';
  priceCents: number;
  durationMinutes: number;
  isPopular: boolean;
}

export interface GroomingStyle {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  durationMinutes: number;
  breeds: string[];
  imageUrl?: string;
}

// Default basic services that every business gets
export const DEFAULT_BASIC_SERVICES: GroomingService[] = [
  {
    id: 'bath-blowdry',
    name: 'Bath & Blow Dry',
    description: 'Complete bath with premium shampoo, conditioner, and professional blow dry',
    category: 'basic',
    priceCents: 3500, // $35.00
    durationMinutes: 45,
    isPopular: true,
  },
  {
    id: 'nail-trim',
    name: 'Nail Trim',
    description: 'Professional nail trimming and filing',
    category: 'basic',
    priceCents: 1500, // $15.00
    durationMinutes: 15,
    isPopular: true,
  },
  {
    id: 'ear-cleaning',
    name: 'Ear Cleaning',
    description: 'Gentle ear cleaning and inspection',
    category: 'basic',
    priceCents: 1200, // $12.00
    durationMinutes: 10,
    isPopular: false,
  },
  {
    id: 'teeth-brushing',
    name: 'Teeth Brushing',
    description: 'Dental hygiene with pet-safe toothpaste',
    category: 'basic',
    priceCents: 1000, // $10.00
    durationMinutes: 10,
    isPopular: false,
  },
];

// Popular grooming styles
export const POPULAR_GROOMING_STYLES: GroomingStyle[] = [
  {
    id: 'teddy-bear',
    name: 'Teddy Bear Cut',
    description: 'Round, fluffy cut that gives your dog a cute teddy bear appearance. Perfect for small breeds like Bichons, Poodles, and Maltese.',
    priceCents: 6500, // $65.00
    durationMinutes: 90,
    breeds: ['Bichon Frise', 'Poodle', 'Maltese', 'Shih Tzu', 'Havanese', 'Coton de Tulear'],
  },
  {
    id: 'puppy-cut',
    name: 'Puppy Cut',
    description: 'Short, even cut all over the body. Low maintenance and perfect for active dogs.',
    priceCents: 5500, // $55.00
    durationMinutes: 75,
    breeds: ['Poodle', 'Bichon Frise', 'Maltese', 'Shih Tzu', 'Cockapoo', 'Goldendoodle'],
  },
  {
    id: 'lamb-cut',
    name: 'Lamb Cut',
    description: 'Short body with longer legs, giving a lamb-like appearance. Great for small to medium breeds.',
    priceCents: 6000, // $60.00
    durationMinutes: 80,
    breeds: ['Poodle', 'Bichon Frise', 'Maltese', 'Shih Tzu'],
  },
  {
    id: 'asian-fusion',
    name: 'Asian Fusion',
    description: 'Modern, sculpted cut with clean lines and geometric shapes. Popular in Asian grooming competitions.',
    priceCents: 8500, // $85.00
    durationMinutes: 120,
    breeds: ['Poodle', 'Bichon Frise', 'Maltese', 'Shih Tzu'],
  },
  {
    id: 'continental',
    name: 'Continental Cut',
    description: 'Classic poodle cut with shaved face, feet, and tail base, with pom-poms on legs and tail.',
    priceCents: 9000, // $90.00
    durationMinutes: 120,
    breeds: ['Poodle'],
  },
  {
    id: 'english-saddle',
    name: 'English Saddle Cut',
    description: 'Traditional poodle cut with shaved face, feet, and tail base, with a "saddle" pattern on the body.',
    priceCents: 8500, // $85.00
    durationMinutes: 110,
    breeds: ['Poodle'],
  },
  {
    id: 'miami-cut',
    name: 'Miami Cut',
    description: 'Short body with longer legs and tail. Perfect for hot weather and active dogs.',
    priceCents: 7000, // $70.00
    durationMinutes: 90,
    breeds: ['Poodle', 'Bichon Frise', 'Maltese'],
  },
  {
    id: 'summer-cut',
    name: 'Summer Cut',
    description: 'Short cut all over for maximum comfort in hot weather. Great for double-coated breeds.',
    priceCents: 5000, // $50.00
    durationMinutes: 60,
    breeds: ['Golden Retriever', 'Labrador', 'Husky', 'Samoyed', 'Chow Chow'],
  },
  {
    id: 'show-cut',
    name: 'Show Cut',
    description: 'Breed-specific cut designed for dog shows. Maintains breed standards and appearance.',
    priceCents: 9500, // $95.00
    durationMinutes: 150,
    breeds: ['Poodle', 'Bichon Frise', 'Maltese', 'Shih Tzu', 'Havanese'],
  },
  {
    id: 'puppy-first-groom',
    name: 'Puppy First Groom',
    description: 'Gentle introduction to grooming for puppies 12-16 weeks old. Includes bath, light trim, and positive reinforcement.',
    priceCents: 4500, // $45.00
    durationMinutes: 60,
    breeds: ['All Breeds'],
  },
];

// Spa and addon services
export const SPA_SERVICES: GroomingService[] = [
  {
    id: 'blueberry-facial',
    name: 'Blueberry Facial',
    description: 'Soothing facial treatment with blueberry extract to brighten and clean the face',
    category: 'spa',
    priceCents: 2500, // $25.00
    durationMinutes: 20,
    isPopular: true,
  },
  {
    id: 'paw-balm',
    name: 'Paw Balm Treatment',
    description: 'Moisturizing paw treatment with natural balm to soothe and protect paw pads',
    category: 'spa',
    priceCents: 1500, // $15.00
    durationMinutes: 15,
    isPopular: false,
  },
  {
    id: 'de-shedding',
    name: 'De-shedding Treatment',
    description: 'Specialized treatment to remove loose fur and reduce shedding',
    category: 'spa',
    priceCents: 3000, // $30.00
    durationMinutes: 30,
    isPopular: true,
  },
  {
    id: 'flea-treatment',
    name: 'Flea & Tick Treatment',
    description: 'Safe flea and tick treatment using pet-friendly products',
    category: 'spa',
    priceCents: 3500, // $35.00
    durationMinutes: 25,
    isPopular: false,
  },
  {
    id: 'coat-conditioning',
    name: 'Coat Conditioning',
    description: 'Deep conditioning treatment for healthy, shiny coat',
    category: 'spa',
    priceCents: 2000, // $20.00
    durationMinutes: 20,
    isPopular: false,
  },
];

// Addon services
export const ADDON_SERVICES: GroomingService[] = [
  {
    id: 'anal-gland-expression',
    name: 'Anal Gland Expression',
    description: 'Professional anal gland expression for your dog\'s comfort',
    category: 'addon',
    priceCents: 2000, // $20.00
    durationMinutes: 10,
    isPopular: false,
  },
  {
    id: 'sanitary-trim',
    name: 'Sanitary Trim',
    description: 'Hygienic trimming around sensitive areas',
    category: 'addon',
    priceCents: 1500, // $15.00
    durationMinutes: 15,
    isPopular: true,
  },
  {
    id: 'face-trim',
    name: 'Face Trim',
    description: 'Precise trimming around the face and eyes',
    category: 'addon',
    priceCents: 1800, // $18.00
    durationMinutes: 20,
    isPopular: true,
  },
  {
    id: 'paw-trim',
    name: 'Paw Pad Trim',
    description: 'Trimming hair between paw pads for better traction',
    category: 'addon',
    priceCents: 1200, // $12.00
    durationMinutes: 10,
    isPopular: false,
  },
  {
    id: 'bandana',
    name: 'Bandana',
    description: 'Stylish bandana to complete your dog\'s look',
    category: 'addon',
    priceCents: 800, // $8.00
    durationMinutes: 5,
    isPopular: true,
  },
  {
    id: 'bow-tie',
    name: 'Bow Tie',
    description: 'Elegant bow tie accessory for special occasions',
    category: 'addon',
    priceCents: 1000, // $10.00
    durationMinutes: 5,
    isPopular: false,
  },
];

// Helper function to get all default services for a new business
export function getDefaultServicesForBusiness(): GroomingService[] {
  return [
    ...DEFAULT_BASIC_SERVICES,
    ...SPA_SERVICES,
    ...ADDON_SERVICES,
  ];
}

// Helper function to get popular grooming styles
export function getPopularGroomingStyles(): GroomingStyle[] {
  return POPULAR_GROOMING_STYLES;
}

// Helper function to format price from cents to dollars
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

// Helper function to get service by ID
export function getServiceById(id: string): GroomingService | undefined {
  const allServices = getDefaultServicesForBusiness();
  return allServices.find(service => service.id === id);
}

// Helper function to get grooming style by ID
export function getGroomingStyleById(id: string): GroomingStyle | undefined {
  return POPULAR_GROOMING_STYLES.find(style => style.id === id);
}
