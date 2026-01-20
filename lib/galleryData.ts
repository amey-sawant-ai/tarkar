export interface GalleryImage {
  id: number;
  title: string;
  category: "dishes" | "ambiance" | "events" | "kitchen" | "staff";
  description: string;
  tags: string[];
  featured: boolean;
}

export const galleryImages: GalleryImage[] = [
  // Dishes
  {
    id: 1,
    title: "Paneer Butter Masala",
    category: "dishes",
    description:
      "Rich and creamy paneer curry in our signature tomato-based gravy",
    tags: ["North Indian", "Paneer", "Main Course", "Popular"],
    featured: true,
  },
  {
    id: 2,
    title: "Dal Makhani",
    category: "dishes",
    description: "Slow-cooked black lentils with butter and cream",
    tags: ["North Indian", "Dal", "Main Course"],
    featured: true,
  },
  {
    id: 3,
    title: "Masala Dosa",
    category: "dishes",
    description: "Crispy rice crepe with spiced potato filling",
    tags: ["South Indian", "Dosa", "Breakfast", "Popular"],
    featured: false,
  },
  {
    id: 4,
    title: "Chole Bhature",
    category: "dishes",
    description: "Spicy chickpeas with fluffy deep-fried bread",
    tags: ["North Indian", "Combo", "Popular"],
    featured: true,
  },
  {
    id: 5,
    title: "Veg Biryani",
    category: "dishes",
    description: "Aromatic basmati rice with mixed vegetables and spices",
    tags: ["Rice", "Biryani", "Main Course"],
    featured: false,
  },
  {
    id: 6,
    title: "Palak Paneer",
    category: "dishes",
    description: "Cottage cheese in smooth spinach gravy",
    tags: ["North Indian", "Paneer", "Healthy"],
    featured: false,
  },
  {
    id: 7,
    title: "Idli Sambar",
    category: "dishes",
    description: "Steamed rice cakes with lentil soup",
    tags: ["South Indian", "Breakfast", "Healthy"],
    featured: false,
  },
  {
    id: 8,
    title: "Pav Bhaji",
    category: "dishes",
    description: "Mashed vegetable curry with buttered bread rolls",
    tags: ["Street Food", "Mumbai Special", "Popular"],
    featured: true,
  },
  {
    id: 9,
    title: "Gulab Jamun",
    category: "dishes",
    description: "Soft milk dumplings in rose-flavored sugar syrup",
    tags: ["Dessert", "Sweet", "Popular"],
    featured: false,
  },
  {
    id: 10,
    title: "Veg Thali",
    category: "dishes",
    description: "Complete meal with dal, sabzi, rice, roti, and dessert",
    tags: ["Thali", "Combo", "Complete Meal"],
    featured: true,
  },

  // Ambiance
  {
    id: 11,
    title: "Main Dining Area",
    category: "ambiance",
    description: "Spacious and comfortable seating with traditional décor",
    tags: ["Interior", "Seating", "Dining"],
    featured: true,
  },
  {
    id: 12,
    title: "Family Section",
    category: "ambiance",
    description: "Private family dining area for intimate gatherings",
    tags: ["Interior", "Family", "Private"],
    featured: false,
  },
  {
    id: 13,
    title: "Outdoor Seating",
    category: "ambiance",
    description: "Al fresco dining under the stars",
    tags: ["Outdoor", "Garden", "Evening"],
    featured: false,
  },
  {
    id: 14,
    title: "Entrance Décor",
    category: "ambiance",
    description: "Traditional Indian welcome with modern aesthetics",
    tags: ["Entrance", "Décor", "Welcome"],
    featured: false,
  },

  // Events
  {
    id: 15,
    title: "Diwali Celebration",
    category: "events",
    description: "Festival of lights special menu and decorations",
    tags: ["Festival", "Diwali", "Celebration"],
    featured: true,
  },
  {
    id: 16,
    title: "Birthday Party Setup",
    category: "events",
    description: "Custom arrangements for birthday celebrations",
    tags: ["Birthday", "Party", "Celebration"],
    featured: false,
  },
  {
    id: 17,
    title: "Corporate Gathering",
    category: "events",
    description: "Professional setup for business meetings and events",
    tags: ["Corporate", "Business", "Meeting"],
    featured: false,
  },

  // Kitchen
  {
    id: 18,
    title: "Live Kitchen",
    category: "kitchen",
    description: "Watch our chefs prepare your meals with care",
    tags: ["Kitchen", "Cooking", "Live"],
    featured: false,
  },
  {
    id: 19,
    title: "Tandoor Station",
    category: "kitchen",
    description: "Traditional clay oven for authentic flavors",
    tags: ["Tandoor", "Traditional", "Cooking"],
    featured: true,
  },
  {
    id: 20,
    title: "Fresh Ingredients",
    category: "kitchen",
    description: "Locally sourced fresh vegetables and ingredients",
    tags: ["Ingredients", "Fresh", "Quality"],
    featured: false,
  },

  // Staff
  {
    id: 21,
    title: "Our Chef Team",
    category: "staff",
    description: "Experienced chefs passionate about vegetarian cuisine",
    tags: ["Team", "Chef", "Professional"],
    featured: true,
  },
  {
    id: 22,
    title: "Service Excellence",
    category: "staff",
    description: "Friendly staff ensuring the best dining experience",
    tags: ["Service", "Staff", "Hospitality"],
    featured: false,
  },
];

export const getImagesByCategory = (
  category: GalleryImage["category"]
): GalleryImage[] => {
  return galleryImages.filter((image) => image.category === category);
};

export const getFeaturedImages = (): GalleryImage[] => {
  return galleryImages.filter((image) => image.featured);
};

export const getImageById = (id: number): GalleryImage | undefined => {
  return galleryImages.find((image) => image.id === id);
};

export const categories = [
  { id: "all", label: "All Photos", count: galleryImages.length },
  {
    id: "dishes",
    label: "Our Dishes",
    count: getImagesByCategory("dishes").length,
  },
  {
    id: "ambiance",
    label: "Ambiance",
    count: getImagesByCategory("ambiance").length,
  },
  {
    id: "events",
    label: "Events",
    count: getImagesByCategory("events").length,
  },
  {
    id: "kitchen",
    label: "Kitchen",
    count: getImagesByCategory("kitchen").length,
  },
  {
    id: "staff",
    label: "Our Team",
    count: getImagesByCategory("staff").length,
  },
];
