import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });
import connectToDatabase from "../lib/mongodb";
import { Dish } from "../models/Dish";

const priceMap: Record<string, number> = {
    // Breads
    "Roti": 1500, "Butter Roti": 2000, "Jeera Roti": 2000,
    "Jeera Butter Roti": 2500, "Naan": 2500, "Butter Naan": 3000,
    "Butter Garlic Naan": 3500, "Butter Jeera Naan": 3500,
    "Cheese Garlic Naan": 4500, "Cheese Butter Garlic Naan": 5000,
    "Kashmiri Naan": 4000, "Jeera Naan": 3000, "Kulcha": 3000,
    "Butter Kulcha": 3500, "Pyaz Pudina Kulcha": 4000,
    "Butter Garlic Roti": 2500, "Cheese Butter Garlic Roti": 4000,
    "Butter Pav": 2000,

    // Parothas
    "Aaloo Stuff Parotha": 8000, "Gobi Stuff Parotha": 8000,
    "Paneer Stuff Parotha": 9000, "Cheese Parotha": 9000,
    "Plain Butter Parotha": 7000, "Jeera Parotha": 7500,

    // Rice & Pulao
    "Jeera Rice": 17900, "Steam Rice": 12000, "Corn Fried Rice": 16000,
    "Veg Fried Rice": 16000, "Mushroom Fried Rice": 18000,
    "Corn Sz Fried Rice": 17000, "Mushroom Sz Fried Rice": 18000,
    "Veg Jeera Fried Rice": 16500, "Green Peas Mint Pulao": 17000,
    "Navratan Pulao": 18000, "Moti Pulao": 22000,
    "Aachari Chana Pulao": 19000, "Subz Aachari Pulao": 18000,
    "Tarkari Pulao": 19000, "Jain Tawa Pulao": 18000,
    "Subz Tawa Pulao": 18000, "Soya Chaap Tikka Pulav": 22000,
    "Paneer Peppery Rice With Gravy": 22000,
    "Veg Peppery Rice With Gravy": 20000,

    // Biryani
    "Hydrabadi Biryani": 22000, "Nizami Biryani": 22000,
    "Subz Biryani": 20000, "Tarkari Fusion Biryani": 25000,
    "Mushroom Tikka Biryani": 23000, "Paneer Tika Biryani": 23000,
    "Soya Chaap Tikka Biryani": 23000,

    // Dal
    "Dal Makhni": 18000, "Dal Kolhapuri": 17000,
    "Dal Kolhapuri Tadka": 18000, "Deggi Mirch Ka Dal Tadka": 17000,
    "Hariyali Dal Tadka": 17000, "Lasooni Dal Palak": 17000,
    "Home Style Dal Fry": 16000, "Jain Dal Fry": 16000,
    "Panchratna Dal": 18000, "Masala Chatpata Dal": 17000,

    // Khichdi
    "Dal Khichdi": 16000, "Dal Khichdi With Tadka": 17000,
    "Jain Dal Khichdi": 16000, "Fulson Dal Khichdi": 18000,
    "Kolhapuri Dal Khichadi": 17000, "Kolhapuri Dal Khichadi Tadka": 18000,
    "Palak Dal Khichadi": 17000, "Hare Pyaz Lasooni Khichadi": 18000,
    "Masala Chatpata Dal Khichadi": 18000,

    // Soups
    "Lemon Coriander Soup": 14000, "Hot And Sour Soup": 14000,
    "Manchurian Soup": 14000, "Vegetable Noodle Soup": 14000,
    "Manchow Soup 2": 14000,
    "Big Chinese Vegetable Trio Soup ( Diabetic Recipe ) 2368": 16000,
    "Cream Of Spinach": 15000,

    // Chinese Starters
    "Babycorn Chilly": 18000, "Babycorn Mushroom Chilly": 19000,
    "Babycorn Mushroom Patai": 19000, "Veg Chilly": 17000,
    "Veg Crispy": 18000, "Veg 65": 18000, "Gobi 65": 18000,
    "Paneer 65": 20000, "Paneer Crispy": 20000,
    "Paneer Manchurian": 20000, "Mushroom Crispy": 19000,
    "Kobi Manchurian": 18000, "Veg Manchurian": 18000,
    "Soya Chilly": 20000, "Dragon Paneer": 22000,
    "Mangolian Veg Crispy": 19000, "Mushroom Mangolian": 20000,
    "Hot Garlic Soya Choop": 21000,
    "Crispy Chilli Baby Corn Recipe In Hindi": 18000,
    "Chilli Mushroom Recipe": 19000, "Scripy Chilli Patato": 17000,
    "Mushroom Garlic Dry": 19000, "Paneer Garlic Dry": 20000,
    "Veg Garlic Dry": 18000, "Chaha Garlic Dry": 19000,
    "Mushroom Patai": 20000, "Paneer Patai": 21000,
    "Hot Garlic Sauce": 15000,

    // Chinese Mains / Noodles
    "Hakka Noodles Recipe": 17000, "Singapore Noodle": 18000,
    "Hong Kong Noodle": 18000, "Burnt Garlic Chilly Noodle": 18000,
    "Mushroom Chilly Noodle": 19000, "Paneer Hakka Noodle": 20000,
    "Mushroom Chilly Garlic Noodle": 19000,
    "Paneer Manchurian Noodles": 20000, "Veg Manchurian Noodle": 18000,
    "Veg Triple Noodle": 19000, "Paneer Triple Noodle": 21000,
    "Veg Peppery Noodles With Gravy": 20000,
    "Paneer Peppey Noodles With Gravy": 22000,
    "Plain Manchurian Gravy": 16000, "Plain Schezwan Gravy": 16000,
    "Mushroom Tikka Kepsa": 22000, "Paneer Tikka Kepsa": 23000,

    // Bhel & Street Food
    "Chinese Bhel": 14000, "Corn Bhel": 14000, "Manchurian Bhel": 15000,

    // Pav Bhaji
    "Pav Bhaji": 16000, "Double Maska Pav Bhaji": 18000,
    "Khada Paneer Pav Bhaji": 19000, "Tarkari Cheese Pav Bhaji": 22000,
    "Cheese Chilly Masala Pav": 18000, "Paneer Masala Pav": 18000,
    "Tarkari Masala Pav": 19000,

    // Jain dishes
    "Jain Aachari Paneer": 22000, "Jain Aachari Subz": 20000,
    "Jain Kadhai Paneer": 22000, "Jain Kadhai Subz": 20000,
    "Jain Kesari Paneer Karma": 23000, "Jain Paneer Butter Masala": 22000,
    "Jain Paneer Kolhapuri": 22000, "Jain Paneer Lababdar": 22000,
    "Jain Subz Kesri Kroma": 20000, "Jain Subz Kolhapuri": 20000,
    "Jain Subz Lababdar": 20000, "Jain Subz Nizami Handi": 21000,

    // Drinks & Sides
    "Masala Chaas": 8000, "Solkadhi": 9000, "Raita": 8000,
    "Green Salad": 10000,

    // Desserts
    "Caramel Custurd": 10000, "Custurd Gulab Jamun": 12000,
    "Coffee Panacata": 11000, "Panacata": 10000,
};

function normalize(str: string) {
    return str.toLowerCase().trim().replace(/[\s-_]+/g, " ");
}

async function updatePrices() {
    try {
        await connectToDatabase();
        console.log("✅ Connected to MongoDB");

        // Build normalized price map
        const normalizedPriceMap = new Map<string, number>();
        for (const [name, price] of Object.entries(priceMap)) {
            normalizedPriceMap.set(normalize(name), price);
        }

        const dishes = await Dish.find({});
        let updatedCount = 0;
        let fallbackCount = 0;

        for (const dish of dishes) {
            const normalizedName = normalize(dish.name);
            const newPrice = normalizedPriceMap.get(normalizedName);

            if (newPrice !== undefined) {
                dish.pricePaise = newPrice;
                await dish.save();
                updatedCount++;
                console.log(`✅ Updated: "${dish.name}" -> ₹${(newPrice / 100).toFixed(2)}`);
            } else {
                console.log(`⚠️  No price found for: "${dish.name}"`);
                fallbackCount++;
            }
        }

        console.log(`\n📊 Update Summary:`);
        console.log(`   - Dishes Updated: ${updatedCount}`);
        console.log(`   - Dishes Skipped (No Match): ${fallbackCount}`);
        console.log(`   - Total Dishes Proccessed: ${dishes.length}`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Error running script:", error);
        process.exit(1);
    }
}

updatePrices();
