
import { MenuItem, DeliveryBoy, MealPrepContainer } from './types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'f1',
    name: 'Brown Rice Mutton Dum Biryani',
    description: 'Lean mutton pieces slow-cooked with high-fiber brown basmati rice. High protein, complex carbs.',
    price: 495,
    category: 'Mass Gain',
    image: 'https://images.unsplash.com/photo-1563379091339-03b11adbc016?auto=format&fit=crop&q=80&w=800',
    calories: 620,
    macros: { p: 45, c: 65, f: 12 },
    rating: 4.9,
    fuelPoints: 49,
    dietType: 'non-veg'
  },
  {
    id: 'f2',
    name: 'Grilled Butter Chicken (No Cream)',
    description: 'Charcoal-grilled chicken breast in a Greek yogurt-based makhani gravy. Zero added sugar.',
    price: 380,
    category: 'Lean Shred',
    image: 'https://images.unsplash.com/photo-1603894527177-9d1f40fce640?auto=format&fit=crop&q=80&w=800',
    calories: 340,
    macros: { p: 52, c: 8, f: 10 },
    rating: 4.8,
    fuelPoints: 38,
    dietType: 'non-veg'
  },
  {
    id: 'f3',
    name: 'Keto Paneer Lababdar',
    description: 'Fresh paneer in a heavy cream and cashew-free gravy using almond paste. Perfect for Keto.',
    price: 320,
    category: 'Clean Keto',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=800',
    calories: 410,
    macros: { p: 22, c: 6, f: 32 },
    rating: 4.7,
    fuelPoints: 32,
    dietType: 'veg'
  },
  {
    id: 'f5',
    name: 'Nitro Pre-Workout Pasta',
    description: 'Whole wheat fusilli with a beetroot-pesto sauce (nitrates for pump) and grilled chicken.',
    price: 390,
    category: 'Pre-Workout Fuel',
    image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=800',
    calories: 450,
    macros: { p: 30, c: 55, f: 8 },
    rating: 5.0,
    fuelPoints: 39,
    dietType: 'non-veg'
  },
  {
    id: 'f6',
    name: 'Lean Chicken Steak & Broccoli',
    description: '250g Chicken breast steak with steamed broccoli mash and zero-calorie pepper jus.',
    price: 420,
    category: 'Lean Shred',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&q=80&w=800',
    calories: 310,
    macros: { p: 58, c: 4, f: 6 },
    rating: 4.9,
    fuelPoints: 42,
    dietType: 'non-veg'
  },
  {
    id: 'f9',
    name: 'Zucchini Ribbon Hakka Noodles',
    description: 'Low-carb zucchini spiralized "noodles" tossed with lean chicken breast and bell peppers.',
    price: 290,
    category: 'Clean Keto',
    image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=800',
    calories: 195,
    macros: { p: 32, c: 5, f: 7 },
    rating: 4.8,
    fuelPoints: 29,
    dietType: 'non-veg'
  },
  {
    id: 'f13',
    name: 'Grilled Sole Lemon-Mughlai',
    description: 'River Sole fillets in a tangy lemon and mustard infusion. Extremely lean and rich in Omega-3.',
    price: 520,
    category: 'Lean Shred',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800',
    calories: 240,
    macros: { p: 48, c: 2, f: 5 },
    rating: 5.0,
    fuelPoints: 52,
    dietType: 'non-veg'
  },
  {
    id: 'f14',
    name: 'Vegan Gains Szechuan Bowl',
    description: 'Sprouted moong beans, smoked tofu, and edamame tossed in fiery sugar-free Szechuan sauce.',
    price: 340,
    category: 'Lean Shred',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    calories: 280,
    macros: { p: 28, c: 32, f: 6 },
    rating: 4.8,
    fuelPoints: 34,
    dietType: 'vegan'
  },
  {
    id: 'f15',
    name: 'Spiced Quinoa Tikka Bowl',
    description: 'High-protein Paneer Tikkas served over cumin-infused quinoa and fresh garden salad.',
    price: 360,
    category: 'Mass Gain',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
    calories: 420,
    macros: { p: 26, c: 48, f: 14 },
    rating: 4.7,
    fuelPoints: 36,
    dietType: 'veg'
  },
  {
    id: 'f16',
    name: 'Whey Recovery Muffins',
    description: 'Box of 2 muffins made with chocolate whey, almond flour, and organic blueberries.',
    price: 195,
    category: 'Healthy Desserts',
    image: 'https://images.unsplash.com/photo-1587573089734-09cb99c7a0b3?auto=format&fit=crop&q=80&w=800',
    calories: 220,
    macros: { p: 20, c: 14, f: 8 },
    rating: 4.9,
    fuelPoints: 19,
    dietType: 'veg'
  }
];

export const MOCK_MEAL_PREP_CONTAINERS: MealPrepContainer[] = [
  {
    id: 'mp1',
    name: 'Weekly Shred Pack (7 Meals)',
    description: 'A curated set of 7 high-protein, low-carb meals to help you cut fat without losing muscle.',
    price: 2450,
    calories: 2100,
    macros: { p: 350, c: 80, f: 45 },
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'mp2',
    name: 'Bulking Phase Bundle (5 Meals)',
    description: '5 high-calorie, clean-carb meals designed to fuel intensive training sessions.',
    price: 1850,
    calories: 3500,
    macros: { p: 250, c: 450, f: 70 },
    image: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&q=80&w=1000'
  }
];

export const MOCK_DELIVERY_BOYS: DeliveryBoy[] = [
  { id: 'd1', name: 'Rohan Sharma', lat: 25.5941, lng: 85.1376, status: 'busy', phone: '+91 91428 05071' },
  { id: 'd2', name: 'Amit Kumar', lat: 25.6122, lng: 85.1212, status: 'active', phone: '+91 99999 12345' },
  { id: 'd3', name: 'Suresh Das', lat: 25.6000, lng: 85.1500, status: 'active', phone: '+91 88888 54321' }
];
