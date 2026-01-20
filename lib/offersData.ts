export interface Offer {
  id: number;
  title: string;
  description: string;
  discount: string;
  code: string;
  validUntil: string;
  category: "festival" | "weekday" | "combo" | "delivery" | "firsttime";
  terms: string[];
  image: string;
  isActive: boolean;
  minOrder?: number;
}

export const offers: Offer[] = [
  {
    id: 1,
    title: "Diwali Dhamaka Special",
    description:
      "Celebrate the festival of lights with our special vegetarian feast! Get amazing discounts on combo meals and festive thalis.",
    discount: "25% OFF",
    code: "DIWALI25",
    validUntil: "2025-12-15",
    category: "festival",
    terms: [
      "Valid on orders above ₹500",
      "Cannot be combined with other offers",
      "Valid for dine-in and takeaway only",
      "Not applicable on beverages",
    ],
    image: "🪔",
    isActive: true,
    minOrder: 500,
  },
  {
    id: 2,
    title: "Monday Madness",
    description:
      "Start your week deliciously! Enjoy special discounts on all North Indian dishes every Monday.",
    discount: "20% OFF",
    code: "MONDAY20",
    validUntil: "2025-12-31",
    category: "weekday",
    terms: [
      "Valid only on Mondays",
      "Applicable on North Indian category only",
      "Valid for all order types",
      "Maximum discount: ₹200",
    ],
    image: "📅",
    isActive: true,
  },
  {
    id: 3,
    title: "Family Feast Combo",
    description:
      "Perfect for family gatherings! Order our special family combo with Dal Makhani, Paneer dishes, Rice, and Naan.",
    discount: "30% OFF",
    code: "FAMILY30",
    validUntil: "2025-12-31",
    category: "combo",
    terms: [
      "Valid on Family Combo orders only",
      "Serves 4-5 people",
      "Pre-order 2 hours in advance",
      "Available for dine-in and takeaway",
    ],
    image: "👨‍👩‍👧‍👦",
    isActive: true,
    minOrder: 1200,
  },
  {
    id: 4,
    title: "Free Delivery Special",
    description:
      "Order from home and get FREE delivery on all orders! No minimum order required for nearby areas.",
    discount: "FREE DELIVERY",
    code: "FREEDEL",
    validUntil: "2025-12-20",
    category: "delivery",
    terms: [
      "Valid for DombivLi East and nearby areas",
      "Free delivery on orders above ₹300",
      "Order before 9 PM",
      "Subject to delivery partner availability",
    ],
    image: "🚚",
    isActive: true,
    minOrder: 300,
  },
  {
    id: 5,
    title: "First Order Bonanza",
    description:
      "New to Tarkari? Get a special welcome discount on your first order! Experience pure vegetarian flavors.",
    discount: "15% OFF",
    code: "WELCOME15",
    validUntil: "2026-01-31",
    category: "firsttime",
    terms: [
      "Valid for new customers only",
      "One-time use per customer",
      "Valid on all menu items",
      "Minimum order: ₹400",
    ],
    image: "🎁",
    isActive: true,
    minOrder: 400,
  },
  {
    id: 6,
    title: "Thali Thursday",
    description:
      "Every Thursday is Thali Day! Get our delicious Pure Veg Thali with unlimited servings at special prices.",
    discount: "₹299 Only",
    code: "THALI299",
    validUntil: "2025-12-31",
    category: "weekday",
    terms: [
      "Valid only on Thursdays",
      "Unlimited thali refills (dine-in only)",
      "Available from 12 PM to 9 PM",
      "Advance booking recommended",
    ],
    image: "🍛",
    isActive: true,
  },
  {
    id: 7,
    title: "Weekend Paneer Party",
    description:
      "Weekends are for indulgence! Get flat discount on all Paneer dishes - Paneer Tikka, Paneer Butter Masala, and more!",
    discount: "25% OFF",
    code: "PANEER25",
    validUntil: "2025-12-31",
    category: "weekday",
    terms: [
      "Valid on Saturdays and Sundays only",
      "Applicable on Paneer category dishes",
      "Valid for all order types",
      "Cannot be clubbed with combo offers",
    ],
    image: "🧀",
    isActive: true,
  },
  {
    id: 8,
    title: "Breakfast Bliss Combo",
    description:
      "Start your day right! Order our special breakfast combo with South Indian delights at unbeatable prices.",
    discount: "₹199 Only",
    code: "BREAK199",
    validUntil: "2025-12-25",
    category: "combo",
    terms: [
      "Valid from 8 AM to 11 AM only",
      "Includes 2 Idlis, 1 Dosa, Vada, and Coffee",
      "Dine-in and takeaway available",
      "Not valid on public holidays",
    ],
    image: "🌅",
    isActive: true,
  },
];

export const getActiveOffers = (): Offer[] => {
  return offers.filter((offer) => {
    if (!offer.isActive) return false;
    const validDate = new Date(offer.validUntil);
    return validDate >= new Date();
  });
};

export const getOffersByCategory = (
  category: Offer["category"]
): Offer[] => {
  return getActiveOffers().filter((offer) => offer.category === category);
};

export const getOfferById = (id: number): Offer | undefined => {
  return offers.find((offer) => offer.id === id);
};
