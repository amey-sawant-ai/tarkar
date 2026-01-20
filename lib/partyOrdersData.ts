export interface PartyPackage {
  id: number;
  name: string;
  description: string;
  servings: string;
  price: number;
  category: "breakfast" | "lunch" | "dinner" | "snacks" | "dessert";
  items: string[];
  customizable: boolean;
  minOrder: number;
  image: string;
  popular: boolean;
}

export const partyPackages: PartyPackage[] = [
  {
    id: 1,
    name: "Grand Thali Package",
    description:
      "Complete traditional meal with dal, sabzi, rice, roti, raita, papad, and dessert",
    servings: "Per Person",
    price: 299,
    category: "lunch",
    items: [
      "Dal Makhani / Tadka Dal",
      "2 Sabzi (Paneer + Seasonal Veg)",
      "Jeera Rice / Plain Rice",
      "4 Roti / 2 Naan",
      "Raita",
      "Salad & Papad",
      "Gulab Jamun (1 pc)",
    ],
    customizable: true,
    minOrder: 10,
    image: "🍛",
    popular: true,
  },
  {
    id: 2,
    name: "Breakfast Bonanza",
    description:
      "Perfect morning spread with South Indian and North Indian breakfast items",
    servings: "10-12 People",
    price: 2499,
    category: "breakfast",
    items: [
      "20 Idlis with Sambar",
      "10 Masala Dosas",
      "10 Vadas",
      "4 types of Chutneys",
      "Filter Coffee (12 cups)",
      "Fresh Fruits",
    ],
    customizable: true,
    minOrder: 1,
    image: "🌅",
    popular: false,
  },
  {
    id: 3,
    name: "Paneer Paradise",
    description: "Premium package featuring 4 signature paneer dishes",
    servings: "15-20 People",
    price: 4999,
    category: "lunch",
    items: [
      "Paneer Butter Masala (1.5 kg)",
      "Palak Paneer (1.5 kg)",
      "Paneer Tikka (40 pcs)",
      "Kadhai Paneer (1.5 kg)",
      "Jeera Rice (3 kg)",
      "Butter Naan (40 pcs)",
      "Raita & Salad",
    ],
    customizable: true,
    minOrder: 1,
    image: "🧀",
    popular: true,
  },
  {
    id: 4,
    name: "Snack Attack Combo",
    description: "Assorted snacks perfect for evening parties and gatherings",
    servings: "20-25 People",
    price: 3499,
    category: "snacks",
    items: [
      "Samosas (50 pcs)",
      "Paneer Pakoda (40 pcs)",
      "Veg Spring Rolls (40 pcs)",
      "Bread Pakoda (30 pcs)",
      "Green Chutney",
      "Tamarind Chutney",
      "Masala Chai (25 cups)",
    ],
    customizable: true,
    minOrder: 1,
    image: "🥟",
    popular: true,
  },
  {
    id: 5,
    name: "Diwali Special Package",
    description:
      "Festive spread with traditional sweets and savory items for celebrations",
    servings: "25-30 People",
    price: 6999,
    category: "dinner",
    items: [
      "Pav Bhaji (5 kg)",
      "Chole Bhature (30 sets)",
      "Mixed Veg Pulao (4 kg)",
      "Dal Makhani (3 kg)",
      "Gulab Jamun (50 pcs)",
      "Rasgulla (30 pcs)",
      "Namkeen Mix (2 kg)",
    ],
    customizable: true,
    minOrder: 1,
    image: "🪔",
    popular: true,
  },
  {
    id: 6,
    name: "South Indian Fiesta",
    description: "Authentic South Indian dishes for your special occasions",
    servings: "15-20 People",
    price: 3999,
    category: "dinner",
    items: [
      "Mini Dosas (40 pcs)",
      "Idli (60 pcs)",
      "Medu Vada (40 pcs)",
      "Upma (2 kg)",
      "Sambar (3 liters)",
      "Coconut Chutney (1 kg)",
      "Tomato Chutney (1 kg)",
      "Filter Coffee (20 cups)",
    ],
    customizable: true,
    minOrder: 1,
    image: "🥥",
    popular: false,
  },
  {
    id: 7,
    name: "Birthday Bash Package",
    description: "Complete party package with food and desserts for birthdays",
    servings: "30-35 People",
    price: 8999,
    category: "dinner",
    items: [
      "Veg Biryani (5 kg)",
      "Paneer Butter Masala (3 kg)",
      "Dal Tadka (3 kg)",
      "Jeera Rice (3 kg)",
      "Roti/Naan (70 pcs)",
      "Raita (2 kg)",
      "Ice Cream (2 liters)",
      "Cake (2 kg - add-on)",
    ],
    customizable: true,
    minOrder: 1,
    image: "🎂",
    popular: true,
  },
  {
    id: 8,
    name: "Corporate Lunch Box",
    description: "Individual packed meals perfect for office events and meetings",
    servings: "Per Box",
    price: 199,
    category: "lunch",
    items: [
      "1 Main Curry (Paneer/Veg)",
      "Dal",
      "Rice",
      "2 Roti",
      "Raita",
      "Salad",
      "1 Sweet",
    ],
    customizable: false,
    minOrder: 20,
    image: "💼",
    popular: false,
  },
  {
    id: 9,
    name: "Sweet Delight Platter",
    description: "Assorted Indian sweets for gifting and celebrations",
    servings: "30-40 Pieces",
    price: 1999,
    category: "dessert",
    items: [
      "Gulab Jamun (15 pcs)",
      "Rasgulla (15 pcs)",
      "Jalebi (500g)",
      "Kaju Katli (500g)",
      "Soan Papdi (500g)",
      "Premium Packaging",
    ],
    customizable: false,
    minOrder: 1,
    image: "🍬",
    popular: false,
  },
  {
    id: 10,
    name: "Street Food Carnival",
    description: "Popular Mumbai street food favorites for casual parties",
    servings: "20-25 People",
    price: 4499,
    category: "snacks",
    items: [
      "Pani Puri (200 pcs)",
      "Sev Puri (50 plates)",
      "Dahi Puri (50 plates)",
      "Pav Bhaji (4 kg)",
      "Vada Pav (30 pcs)",
      "Bhel Puri (3 kg)",
      "Cutting Chai (30 cups)",
    ],
    customizable: true,
    minOrder: 1,
    image: "🎪",
    popular: true,
  },
];

export const getPackagesByCategory = (
  category: PartyPackage["category"]
): PartyPackage[] => {
  return partyPackages.filter((pkg) => pkg.category === category);
};

export const getPopularPackages = (): PartyPackage[] => {
  return partyPackages.filter((pkg) => pkg.popular);
};

export const getPackageById = (id: number): PartyPackage | undefined => {
  return partyPackages.find((pkg) => pkg.id === id);
};

export const categories = [
  { id: "all", label: "All Packages", icon: "🎉" },
  { id: "breakfast", label: "Breakfast", icon: "🌅" },
  { id: "lunch", label: "Lunch", icon: "🍽️" },
  { id: "dinner", label: "Dinner", icon: "🌙" },
  { id: "snacks", label: "Snacks", icon: "🥟" },
  { id: "dessert", label: "Desserts", icon: "🍬" },
];
