#!/usr/bin/env node

/**
 * Database Seeding Script for Gestura
 * 
 * This script helps you populate your Convex database with sample data
 * including users, posts, and follow relationships.
 * 
 * Usage:
 *   node scripts/seed-database.js seed    # Populate database with sample data
 *   node scripts/seed-database.js clear   # Clear all sample data
 *   node scripts/seed-database.js status  # Show current data status
 */

const { ConvexHttpClient } = require("convex/browser");

// You'll need to replace this with your actual Convex deployment URL
const CONVEX_URL = "https://hip-grasshopper-639.convex.cloud" || "https://your-deployment-url.convex.cloud";

if (!CONVEX_URL || CONVEX_URL.includes("your-deployment-url")) {
  console.error("❌ Please set your CONVEX_URL environment variable or update the script");
  console.error("   You can find your Convex URL in your dashboard or .env.local file");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

async function seedDatabase() {
  try {
    console.log("🌱 Seeding database with sample data...");
    const result = await client.mutation("seed:seedDatabasePublic");
    console.log("✅ Seeding completed successfully!");
    console.log(`   - Users created: ${result.usersCreated}`);
    console.log(`   - Posts created: ${result.postsCreated}`);
    console.log(`   - Relationships created: ${result.relationshipsCreated}`);
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    process.exit(1);
  }
}

async function clearDatabase() {
  try {
    console.log("🗑️ Clearing sample data...");
    await client.mutation("seed:clearAllDataPublic");
    console.log("✅ Sample data cleared successfully!");
  } catch (error) {
    console.error("❌ Error clearing database:", error.message);
    process.exit(1);
  }
}

async function showStatus() {
  try {
    console.log("📊 Checking database status...");
    
    // Get user count
    const users = await client.query("users:getAllUsers");
    const userCount = users ? users.length : 0;
    
    // Get post count
    const posts = await client.query("posts:feedPost");
    const postCount = posts ? posts.length : 0;
    
    console.log(`   - Total users: ${userCount}`);
    console.log(`   - Total posts: ${postCount}`);
    
    if (userCount === 0) {
      console.log("💡 Run 'node scripts/seed-database.js seed' to populate with sample data");
    }
  } catch (error) {
    console.error("❌ Error checking database status:", error.message);
    process.exit(1);
  }
}

async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case "seed":
      await seedDatabase();
      break;
    case "clear":
      await clearDatabase();
      break;
    case "status":
      await showStatus();
      break;
    default:
      console.log("Usage: node scripts/seed-database.js <command>");
      console.log("");
      console.log("Commands:");
      console.log("  seed    Populate database with sample data");
      console.log("  clear   Clear all sample data");
      console.log("  status  Show current data status");
      console.log("");
      console.log("Examples:");
      console.log("  node scripts/seed-database.js seed");
      console.log("  node scripts/seed-database.js clear");
      console.log("  node scripts/seed-database.js status");
      break;
  }
}

main().catch(console.error);




