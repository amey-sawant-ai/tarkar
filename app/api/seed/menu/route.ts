import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/models/Category";
import { Dish } from "@/models/Dish";
import { apiSuccess, apiError } from "@/lib/api-helpers";

// Helper function to create slug from name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Categories data
const categoriesData = [
  { name: "Vegetable Curries", slug: "vegetable-curries", description: "Traditional Indian vegetable dishes", displayOrder: 1 },
  { name: "Paneer Specialties", slug: "paneer-specialties", description: "Cottage cheese delicacies", displayOrder: 2 },
  { name: "Soups", slug: "soups", description: "Hot and refreshing soups", displayOrder: 3 },
  { name: "Appetizers", slug: "appetizers", description: "Starters and snacks", displayOrder: 4 },
  { name: "Noodles", slug: "noodles", description: "Various noodle preparations", displayOrder: 5 },
  { name: "Dal & Lentils", slug: "dal-lentils", description: "Protein-rich lentil dishes", displayOrder: 6 },
  { name: "Rice & Biryani", slug: "rice-biryani", description: "Rice preparations and biryani", displayOrder: 7 },
  { name: "Mumbai Local", slug: "mumbai-local", description: "Street food favorites", displayOrder: 8 },
  { name: "Beverages", slug: "beverages", description: "Refreshing drinks", displayOrder: 9 },
  { name: "Extras", slug: "extras", description: "Additional items and accompaniments", displayOrder: 10 },
  { name: "Breads", slug: "breads", description: "Indian breads", displayOrder: 11 }
];

// Dishes data extracted from menu images
const dishesData = [
  // VEGETABLE CURRIES (TARKARI)
  { name: "Aloo Methi", price: 150, category: "vegetable-curries", description: "Potato cooked with fresh methi (fenugreek leaves)", isVeg: true },
  { name: "Aloo Mutter", price: 160, category: "vegetable-curries", description: "Potato and green peas curry", isVeg: true },
  { name: "Dhaba Style Aloo Jeera", price: 150, category: "vegetable-curries", description: "Potatoes with cumin seeds", isVeg: true },
  { name: "Dahi Wale Aloo", price: 170, category: "vegetable-curries", description: "Potatoes in yogurt gravy", isVeg: true },
  { name: "Aachari Dahi Aloo Bhendi", price: 180, category: "vegetable-curries", description: "Potato and okra in pickle-spiced yogurt gravy", isVeg: true },
  { name: "Lasooni Bhindi Masala", price: 180, category: "vegetable-curries", description: "Okra with garlic and spices", isVeg: true },
  { name: "Chana Masala", price: 160, category: "vegetable-curries", description: "Chickpea curry with aromatic spices", isVeg: true },
  { name: "Kaju Butter Masala", price: 250, category: "vegetable-curries", description: "Cashews in rich butter gravy", isVeg: true },
  { name: "Kaju Mushroom Masala", price: 260, category: "vegetable-curries", description: "Cashews and mushrooms in creamy gravy", isVeg: true },
  { name: "Malai Malhi Mutter", price: 170, category: "vegetable-curries", description: "Peas in cream-based gravy", isVeg: true },
  { name: "Subz Navratan Korma", price: 190, category: "vegetable-curries", description: "Nine different vegetables in rich gravy", isVeg: true },
  { name: "Makai Palak", price: 190, category: "vegetable-curries", description: "Corn and spinach curry", isVeg: true },
  { name: "Kumbh Palak (Mushroom)", price: 190, category: "vegetable-curries", description: "Mushroom and spinach curry", isVeg: true },
  { name: "Kumbh Mutter Masala", price: 190, category: "vegetable-curries", description: "Mushroom and peas curry", isVeg: true },
  
  // SUBS SECTION
  { name: "Achari Subz", price: 180, category: "vegetable-curries", description: "Mixed vegetables in pickle spices", isVeg: true },
  { name: "Subz Kolhapuri", price: 170, category: "vegetable-curries", description: "Kolhapuri style mixed vegetables", isVeg: true, isSpicy: true },
  { name: "Subz Labahdar", price: 170, category: "vegetable-curries", description: "Mixed vegetables in rich tomato gravy", isVeg: true },
  { name: "Darbari Veg Handi", price: 190, category: "vegetable-curries", description: "Royal style mixed vegetables", isVeg: true },
  { name: "Subz Kheema Masala", price: 220, category: "vegetable-curries", description: "Minced vegetables masala", isVeg: true },
  { name: "Subz Do Pyaza", price: 180, category: "vegetable-curries", description: "Mixed vegetables with double onions", isVeg: true },
  { name: "Beethe Baigan Tarkari", price: 200, category: "vegetable-curries", description: "Stuffed brinjal curry", isVeg: true },
  { name: "Hyderabadi Tarkari", price: 200, category: "vegetable-curries", description: "Hyderabadi style mixed vegetables", isVeg: true },
  { name: "Tarkari Handi", price: 190, category: "vegetable-curries", description: "Mixed vegetables in earthen pot style", isVeg: true },
  { name: "Subz Diwani Handi", price: 190, category: "vegetable-curries", description: "Royal mixed vegetables", isVeg: true },

  // PANEER SPECIALTIES
  { name: "Kasturi Paneer Mutter", price: 190, category: "paneer-specialties", description: "Cottage cheese with peas and kasturi methi", isVeg: true },
  { name: "Paneer Butter Masala", price: 200, category: "paneer-specialties", description: "Cottage cheese in rich butter gravy", isVeg: true },
  { name: "Paneer Makhani", price: 190, category: "paneer-specialties", description: "Cottage cheese in creamy tomato gravy", isVeg: true },
  { name: "Paneer Lababdar", price: 190, category: "paneer-specialties", description: "Cottage cheese in spicy tomato gravy", isVeg: true },
  { name: "Paneer Papad Ki Sabji", price: 200, category: "paneer-specialties", description: "Cottage cheese with crispy papad", isVeg: true },
  { name: "Malai Matar Paneer", price: 200, category: "paneer-specialties", description: "Cottage cheese and peas in cream", isVeg: true },
  { name: "Mughlai Shahi Paneer Korma", price: 200, category: "paneer-specialties", description: "Royal cottage cheese curry", isVeg: true },
  { name: "Kaju Paneer Masala", price: 270, category: "paneer-specialties", description: "Cottage cheese with cashews", isVeg: true },
  { name: "Dahi Wale Paneer Lasuni", price: 230, category: "paneer-specialties", description: "Cottage cheese in garlic yogurt gravy", isVeg: true },
  { name: "Paneer Kolhapuri", price: 200, category: "paneer-specialties", description: "Kolhapuri style cottage cheese", isVeg: true, isSpicy: true },
  { name: "Lasooni Palak Paneer", price: 210, category: "paneer-specialties", description: "Cottage cheese in garlic spinach", isVeg: true },
  { name: "Kumbh Paneer Masala", price: 220, category: "paneer-specialties", description: "Cottage cheese with mushrooms", isVeg: true },
  { name: "Makai Paneer Masala", price: 220, category: "paneer-specialties", description: "Cottage cheese with corn", isVeg: true },
  { name: "Paneer Do Pyaza", price: 200, category: "paneer-specialties", description: "Cottage cheese with double onions", isVeg: true },
  { name: "Paneer Tikka Masala", price: 200, category: "paneer-specialties", description: "Grilled cottage cheese in masala gravy", isVeg: true },
  { name: "Lahori Khada Palak Paneer", price: 200, category: "paneer-specialties", description: "Cottage cheese in whole leaf spinach", isVeg: true },
  { name: "Amritsari Paneer Bhurji", price: 240, category: "paneer-specialties", description: "Scrambled cottage cheese Amritsar style", isVeg: true },
  { name: "Aachari Paneer", price: 200, category: "paneer-specialties", description: "Cottage cheese in pickle spices", isVeg: true },
  { name: "Tawa Paneer", price: 240, category: "paneer-specialties", description: "Tawa-grilled cottage cheese", isVeg: true },
  { name: "Darbari Paneer Handi", price: 220, category: "paneer-specialties", description: "Royal cottage cheese in earthen pot", isVeg: true },
  { name: "Paneer Nizami Handi", price: 200, category: "paneer-specialties", description: "Nizami style cottage cheese", isVeg: true },
  { name: "Paneer Makhani Shahi", price: 350, category: "paneer-specialties", description: "Royal cottage cheese makhani", isVeg: true },
  { name: "Lal Mirch Ka Paneer Korma", price: 320, category: "paneer-specialties", description: "Cottage cheese in red chili gravy", isVeg: true, isSpicy: true },
  { name: "Kadhai Paneer", price: 320, category: "paneer-specialties", description: "Cottage cheese in kadhai masala", isVeg: true },

  // SOUPS
  { name: "Manchow Soup", price: 90, category: "soups", description: "Spicy Chinese soup with vegetables", isVeg: true, half: 90, full: 120 },
  { name: "Lemon Coriander Soup", price: 100, category: "soups", description: "Tangy soup with lemon and coriander", isVeg: true, half: 100, full: 140 },
  { name: "Manchurian Soup", price: 100, category: "soups", description: "Chinese soup with manchurian balls", isVeg: true, half: 100, full: 140 },
  { name: "Hot & Sour Soup", price: 100, category: "soups", description: "Spicy and tangy Chinese soup", isVeg: true, half: 100, full: 140 },
  { name: "Veg Noodle Soup", price: 100, category: "soups", description: "Vegetable soup with noodles", isVeg: true, half: 100, full: 140 },
  { name: "Sweet Corn Soup", price: 120, category: "soups", description: "Creamy sweet corn soup", isVeg: true, half: 120, full: 150 },
  { name: "Palak Soup", price: 100, category: "soups", description: "Healthy spinach soup", isVeg: true, half: 100, full: 140 },
  { name: "Cream of Spinach Soup", price: 120, category: "soups", description: "Creamy spinach soup", isVeg: true, half: 120, full: 150 },

  // APPETIZERS - VEGETABLE STARTERS
  { name: "Chinese Bhel", price: 60, category: "appetizers", description: "Indo-Chinese bhel mix", isVeg: true, half: 60, full: 80 },
  { name: "Manchurian Bhel", price: 70, category: "appetizers", description: "Bhel with manchurian sauce", isVeg: true, half: 70, full: 100 },
  { name: "Soya Chilly", price: 80, category: "appetizers", description: "Spicy soya chunks", isVeg: true, half: 80, full: 120 },
  { name: "Gobi Manchurian", price: 100, category: "appetizers", description: "Cauliflower in manchurian sauce", isVeg: true, half: 100, full: 160 },
  { name: "Veg Crispy", price: 100, category: "appetizers", description: "Crispy mixed vegetables", isVeg: true, half: 100, full: 170 },
  { name: "Mushroom Crispy", price: 120, category: "appetizers", description: "Crispy mushrooms", isVeg: true, half: 120, full: 190 },
  { name: "Babycorn Mushroom Chilly", price: 110, category: "appetizers", description: "Babycorn and mushroom in chilly sauce", isVeg: true, half: 110, full: 180 },
  { name: "Mushroom Mongolian", price: 120, category: "appetizers", description: "Mushroom in Mongolian sauce", isVeg: true, half: 120, full: 200 },
  { name: "Lemon Baby Corn", price: 110, category: "appetizers", description: "Baby corn with lemon flavor", isVeg: true, half: 110, full: 170 },
  { name: "Mushroom Chilly", price: 120, category: "appetizers", description: "Spicy mushroom preparation", isVeg: true, half: 120, full: 200 },
  { name: "Mushroom Patai", price: 130, category: "appetizers", description: "Mushroom in special patai sauce", isVeg: true, half: 130, full: 210 },
  { name: "Baby Corn Mushroom Patai", price: 130, category: "appetizers", description: "Baby corn and mushroom patai", isVeg: true, half: 130, full: 210 },
  { name: "Mushroom Garlic Dry", price: 120, category: "appetizers", description: "Dry mushroom with garlic", isVeg: true, half: 120, full: 210 },
  { name: "Crispy Chilly Potato", price: 110, category: "appetizers", description: "Crispy potato in chilly sauce", isVeg: true, half: 110, full: 190 },

  // PANEER STARTERS
  { name: "Paneer 65", price: 110, category: "appetizers", description: "Spicy paneer appetizer", isVeg: true, half: 110, full: 180 },
  { name: "Paneer Crispy", price: 130, category: "appetizers", description: "Crispy cottage cheese", isVeg: true, half: 130, full: 220 },
  { name: "Paneer Chilly", price: 110, category: "appetizers", description: "Cottage cheese in chilly sauce", isVeg: true, half: 110, full: 180 },
  { name: "Paneer Mushroom Chilly", price: 120, category: "appetizers", description: "Cottage cheese and mushroom chilly", isVeg: true, half: 120, full: 190 },
  { name: "Lemon Paneer", price: 130, category: "appetizers", description: "Paneer with lemon flavor", isVeg: true, half: 130, full: 200 },
  { name: "Roasted Paneer Chilly", price: 130, category: "appetizers", description: "Roasted paneer in chilly sauce", isVeg: true, half: 130, full: 200 },
  { name: "Paneer Mongolian", price: 140, category: "appetizers", description: "Paneer in Mongolian sauce", isVeg: true, half: 140, full: 220 },
  { name: "Paneer Patai", price: 130, category: "appetizers", description: "Paneer in patai sauce", isVeg: true, half: 130, full: 200 },
  { name: "Paneer Schezwan", price: 130, category: "appetizers", description: "Paneer in schezwan sauce", isVeg: true, half: 130, full: 200 },
  { name: "Paneer Garlic Dry", price: 130, category: "appetizers", description: "Dry paneer with garlic", isVeg: true, half: 130, full: 200 },
  { name: "Paneer Manchurian", price: 120, category: "appetizers", description: "Paneer in manchurian sauce", isVeg: true, half: 120, full: 180 },

  // CHINA RETURN - Rice Preparations
  { name: "Veg Fried Rice", price: 100, category: "rice-biryani", description: "Chinese style fried rice", isVeg: true, half: 100, full: 140 },
  { name: "Veg Jeera Fried Rice", price: 100, category: "rice-biryani", description: "Cumin flavored fried rice", isVeg: true, half: 100, full: 150 },
  { name: "Corn Fried Rice", price: 110, category: "rice-biryani", description: "Sweet corn fried rice", isVeg: true, half: 110, full: 150 },
  { name: "Mushroom Fried Rice", price: 100, category: "rice-biryani", description: "Mushroom fried rice", isVeg: true, half: 100, full: 160 },
  { name: "Paneer Fried Rice", price: 110, category: "rice-biryani", description: "Paneer fried rice", isVeg: true, half: 110, full: 160 },
  { name: "Paneer S/Z Fried Rice", price: 120, category: "rice-biryani", description: "Paneer schezwan fried rice", isVeg: true, half: 120, full: 180 },
  { name: "Paneer Tikka Fried Rice", price: 120, category: "rice-biryani", description: "Paneer tikka fried rice", isVeg: true, half: 120, full: 180 },
  { name: "Schezwan Fried Rice", price: 110, category: "rice-biryani", description: "Spicy schezwan fried rice", isVeg: true, half: 110, full: 150 },
  { name: "Lemon Coriander Fried Rice", price: 120, category: "rice-biryani", description: "Lemon coriander flavored rice", isVeg: true, half: 120, full: 160 },
  { name: "Burnt Garlic Chilly Rice", price: 110, category: "rice-biryani", description: "Rice with burnt garlic and chilly", isVeg: true, half: 110, full: 160 },
  { name: "Hong Kong Fried Rice", price: 110, category: "rice-biryani", description: "Hong Kong style fried rice", isVeg: true, half: 110, full: 160 },
  { name: "Corn Paneer Fried Rice", price: 120, category: "rice-biryani", description: "Corn and paneer fried rice", isVeg: true, half: 120, full: 180 },
  { name: "Manchurian Fried Rice", price: 130, category: "rice-biryani", description: "Manchurian with fried rice", isVeg: true, half: 130, full: 180 },
  { name: "Triple Schezwan Fried Rice", price: 190, category: "rice-biryani", description: "Triple schezwan fried rice", isVeg: true },
  { name: "Singapore Fried Rice", price: 190, category: "rice-biryani", description: "Singapore style fried rice", isVeg: true },
  { name: "Paneer Triple Rice", price: 200, category: "rice-biryani", description: "Triple paneer fried rice", isVeg: true },
  { name: "Paneer Manchurian Rice", price: 200, category: "rice-biryani", description: "Paneer manchurian with rice", isVeg: true },
  { name: "Paneer Tikka Kepsa", price: 250, category: "rice-biryani", description: "Paneer tikka kepsa rice", isVeg: true },

  // NOODLE'S Preparation
  { name: "Veg Hakka Noodle", price: 100, category: "noodles", description: "Chinese hakka noodles", isVeg: true, half: 100, full: 160 },
  { name: "Paneer Hakka Noodle", price: 110, category: "noodles", description: "Hakka noodles with paneer", isVeg: true, half: 110, full: 170 },
  { name: "Burnt Garlic Chilly Noodle", price: 110, category: "noodles", description: "Noodles with burnt garlic", isVeg: true, half: 110, full: 170 },
  { name: "Mushroom Chilly Noodle", price: 110, category: "noodles", description: "Mushroom chilly noodles", isVeg: true, half: 110, full: 170 },
  { name: "Mushroom Chilly Garlic Noodles", price: 120, category: "noodles", description: "Mushroom garlic chilly noodles", isVeg: true, half: 120, full: 180 },
  { name: "Hong Kong Noodle", price: 120, category: "noodles", description: "Hong Kong style noodles", isVeg: true, half: 120, full: 180 },
  { name: "Veg Schezwan Noodle", price: 110, category: "noodles", description: "Spicy schezwan noodles", isVeg: true, half: 110, full: 170 },
  { name: "Paneer Schezwan Noodle", price: 120, category: "noodles", description: "Paneer schezwan noodles", isVeg: true, half: 120, full: 180 },
  { name: "Singapore Noodle", price: 190, category: "noodles", description: "Singapore style noodles", isVeg: true },
  { name: "Veg Triple Noodle", price: 190, category: "noodles", description: "Triple vegetable noodles", isVeg: true },
  { name: "Veg Manchurian Noodle", price: 190, category: "noodles", description: "Manchurian with noodles", isVeg: true },
  { name: "Paneer Triple Noodle", price: 200, category: "noodles", description: "Triple paneer noodles", isVeg: true },
  { name: "Paneer Manchurian Noodle", price: 200, category: "noodles", description: "Paneer manchurian noodles", isVeg: true },

  // PYARWALI DAL
  { name: "Home Style Dal Fry", price: 120, category: "dal-lentils", description: "Traditional home-style dal", isVeg: true },
  { name: "Jain Dal Fry", price: 130, category: "dal-lentils", description: "Jain style dal without onion-garlic", isVeg: true },
  { name: "Degai Mirch Ka Dal Tadka", price: 150, category: "dal-lentils", description: "Dal with degai mirch tadka", isVeg: true, isSpicy: true },
  { name: "Dal Pappu", price: 160, category: "dal-lentils", description: "South Indian style dal", isVeg: true },
  { name: "Lasooni Dal Palak", price: 160, category: "dal-lentils", description: "Garlic dal with spinach", isVeg: true },
  { name: "Masala Chatpata Dal", price: 150, category: "dal-lentils", description: "Spicy tangy dal", isVeg: true, isSpicy: true },
  { name: "Dal Kolhapuri", price: 150, category: "dal-lentils", description: "Kolhapuri style spicy dal", isVeg: true, isSpicy: true },
  { name: "Dal Kolhapuri Tadka", price: 160, category: "dal-lentils", description: "Kolhapuri dal with special tadka", isVeg: true, isSpicy: true },
  { name: "Aachari Dal Palak", price: 160, category: "dal-lentils", description: "Pickle-flavored dal with spinach", isVeg: true },

  // CHAWAL KI KHALIYAN - Rice
  { name: "Curd Rice", price: 160, category: "rice-biryani", description: "South Indian curd rice", isVeg: true },
  { name: "Steam Rice", price: 120, category: "rice-biryani", description: "Plain steamed rice", isVeg: true },
  { name: "Jeera Rice", price: 140, category: "rice-biryani", description: "Cumin flavored rice", isVeg: true },
  { name: "Tarkari Pulao", price: 150, category: "rice-biryani", description: "Mixed vegetable pulao", isVeg: true },
  { name: "Laju Tawa Pulao", price: 160, category: "rice-biryani", description: "Tawa-cooked pulao", isVeg: true },
  { name: "Navratan Pulao", price: 170, category: "rice-biryani", description: "Nine gems pulao", isVeg: true },
  { name: "Moti Pulao", price: 160, category: "rice-biryani", description: "Pearl-like rice preparation", isVeg: true },
  { name: "Subz Aachari Pulao", price: 170, category: "rice-biryani", description: "Pickle-flavored vegetable pulao", isVeg: true },
  { name: "Subz Tawa Pulao", price: 160, category: "rice-biryani", description: "Vegetable tawa pulao", isVeg: true },
  { name: "Aachari Gheto Pulao", price: 160, category: "rice-biryani", description: "Pickle-flavored special pulao", isVeg: true },
  { name: "Aloo Matar Ki Tehri", price: 170, category: "rice-biryani", description: "Potato pea rice", isVeg: true },
  { name: "Subz Biryani", price: 170, category: "rice-biryani", description: "Vegetable biryani", isVeg: true },
  { name: "Hydrabadi Biryani", price: 180, category: "rice-biryani", description: "Hyderabadi style vegetable biryani", isVeg: true },
  { name: "Nizami Biryani", price: 190, category: "rice-biryani", description: "Nizami style biryani", isVeg: true },
  { name: "Tarkari Fusion Biryani", price: 190, category: "rice-biryani", description: "Fusion style vegetable biryani", isVeg: true },
  { name: "Paneer Tikka Biryani", price: 190, category: "rice-biryani", description: "Paneer tikka biryani", isVeg: true },

  // MUMBAI LOCAL - Street Food
  { name: "Tarkari Masala Pav", price: 100, category: "mumbai-local", description: "Spiced vegetable pav", isVeg: true },
  { name: "Cheese Chilly Masala Pav", price: 120, category: "mumbai-local", description: "Cheese chilly pav", isVeg: true },
  { name: "Paneer Masala Pav", price: 120, category: "mumbai-local", description: "Paneer masala pav", isVeg: true },
  { name: "Tarkari Pav Bhaji", price: 110, category: "mumbai-local", description: "Mixed vegetable pav bhaji", isVeg: true },
  { name: "Tarkari Cheese Pav Bhaji", price: 130, category: "mumbai-local", description: "Cheese pav bhaji", isVeg: true },
  { name: "Double Maska Pav Bhaji", price: 130, category: "mumbai-local", description: "Extra butter pav bhaji", isVeg: true },
  { name: "Kheema Paneer Pav Bhaji", price: 150, category: "mumbai-local", description: "Paneer kheema pav bhaji", isVeg: true },
  { name: "Butter Pav", price: 8, category: "mumbai-local", description: "Buttered pav bread", isVeg: true },

  // REFRESHMENT DRINKS
  { name: "Solkadhi", price: 40, category: "beverages", description: "Traditional kokum drink", isVeg: true },
  { name: "Masala Chaas", price: 40, category: "beverages", description: "Spiced buttermilk", isVeg: true },

  // RASOI KA BADSHAH - Special Curries
  { name: "Tarkari Kofta Curry", price: 310, category: "vegetable-curries", description: "Vegetable kofta in rich gravy", isVeg: true },
  { name: "Hariyali Kofta Curry", price: 310, category: "vegetable-curries", description: "Green herb kofta curry", isVeg: true },
  { name: "Malai Kofta", price: 310, category: "vegetable-curries", description: "Creamy cottage cheese kofta", isVeg: true },
  { name: "Shahi Kofta Curry", price: 240, category: "vegetable-curries", description: "Royal kofta curry", isVeg: true },

  // INDIANA BREAD
  { name: "Chapati", price: 7, category: "breads", description: "Plain wheat chapati", isVeg: true },
  { name: "Phulka Chapati", price: 10, category: "breads", description: "Puffed chapati", isVeg: true },
  { name: "Malbari Paratha", price: 25, category: "breads", description: "Layered Malabar paratha", isVeg: true },
  { name: "Butter Malbari Paratha", price: 30, category: "breads", description: "Butter Malabar paratha", isVeg: true },
  { name: "Bhakri", price: 20, category: "breads", description: "Thick millet bread", isVeg: true },

  // EXTRA'S
  { name: "Schezwan Chutney", price: 10, category: "extras", description: "Spicy schezwan sauce", isVeg: true },
  { name: "Raita", price: 15, category: "extras", description: "Yogurt-based side dish", isVeg: true },
  { name: "Papad", price: 5, category: "extras", description: "Crispy papad", isVeg: true },
  { name: "Tadka", price: 10, category: "extras", description: "Tempering for dal", isVeg: true },
  { name: "Green Salad", price: 60, category: "extras", description: "Fresh green salad", isVeg: true }
];

export async function POST() {
  try {
    await connectToDatabase();

    // Clear existing data
    console.log("Clearing existing dishes and categories...");
    await Dish.deleteMany({});
    await Category.deleteMany({});

    // Create categories
    console.log("Creating categories...");
    const createdCategories = await Category.insertMany(categoriesData);
    const categoryMap = new Map();
    createdCategories.forEach(cat => {
      categoryMap.set(cat.slug, cat._id);
    });

    // Prepare dishes data with proper category IDs and price conversion
    const dishesToInsert = dishesData.map(dish => ({
      name: dish.name,
      slug: createSlug(dish.name),
      description: dish.description,
      categoryId: categoryMap.get(dish.category),
      pricePaise: dish.price * 100, // Convert rupees to paise
      isVeg: dish.isVeg ?? true,
      isSpicy: dish.isSpicy ?? false,
      spicyLevel: dish.isSpicy ? 2 : 0,
      isAvailable: true,
      preparationTime: 15, // Default preparation time
      tags: [dish.category.replace('-', ' '), dish.name.toLowerCase()],
      // Add half/full pricing if available
      ...(dish.half && dish.full && {
        shortDescription: `Half: ₹${dish.half}, Full: ₹${dish.full}`,
      }),
    }));

    // Create dishes
    console.log("Creating dishes...");
    await Dish.insertMany(dishesToInsert);

    return apiSuccess({
      message: "Successfully seeded menu data!",
      stats: {
        categoriesCreated: categoriesData.length,
        dishesCreated: dishesToInsert.length,
        categories: categoriesData.map(cat => cat.name)
      }
    });

  } catch (error) {
    console.error("Error seeding menu data:", error);
    return apiError("INTERNAL_ERROR", "Failed to seed menu data");
  }
}