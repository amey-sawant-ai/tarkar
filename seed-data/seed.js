const { MongoClient } = require("mongodb");
const { EJSON } = require("bson");
const fs = require("fs");
const path = require("path");

// 👇 Change this to the target PC's MongoDB URL if needed
const MONGO_URI = "mongodb://localhost:27017";
const DB_NAME = "tarkari";
const SEED_DATA_DIR = __dirname;

const collections = [
    "categories",
    "dishes",
    "users",
    "settings",
    "orders",
    "addresses",
    "favorites",
    "partyorders",
    "paymentmethods",
    "reservations",
    "reviews",
    "wallettransactions",
];

async function seed() {
    const client = new MongoClient(MONGO_URI);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db(DB_NAME);

        for (const collectionName of collections) {
            const filePath = path.join(SEED_DATA_DIR, `${collectionName}.json`);

            if (!fs.existsSync(filePath)) {
                console.log(`⚠️  Skipping ${collectionName} — file not found`);
                continue;
            }

            const data = EJSON.parse(fs.readFileSync(filePath, "utf-8"), { relaxed: false });

            if (data.length === 0) {
                console.log(`⏭️  Skipping ${collectionName} — no data`);
                continue;
            }

            // Drop existing collection to avoid duplicates
            await db.collection(collectionName).deleteMany({});

            const result = await db.collection(collectionName).insertMany(data);
            console.log(`✅ Seeded ${collectionName}: ${result.insertedCount} records`);
        }

        console.log("\n🎉 All done! Database seeded successfully.");
    } catch (err) {
        console.error("❌ Error seeding database:", err);
    } finally {
        await client.close();
    }
}

seed();