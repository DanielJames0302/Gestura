"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

/**
 * Admin component for seeding sample data
 * This should only be used in development environments
 */
export default function SeedDataButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const seedDatabase = useMutation(api.seed.seedDatabasePublic);
  const clearDatabase = useMutation(api.seed.clearAllDataPublic);

  const handleSeed = async () => {
    if (!confirm("This will populate the database with sample data. Continue?")) {
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const result = await seedDatabase();
      setMessage(
        `✅ Seeding completed! Created ${result.usersCreated} users, ${result.postsCreated} posts, and ${result.relationshipsCreated} relationships.`
      );
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    if (!confirm("This will clear all sample data. Continue?")) {
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await clearDatabase();
      setMessage("✅ Sample data cleared successfully!");
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Only show in development
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Database Seeding (Development Only)</h3>
      
      <div className="space-y-2">
        <button
          onClick={handleSeed}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Seeding..." : "Seed Sample Data"}
        </button>
        
        <button
          onClick={handleClear}
          disabled={isLoading}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed ml-2"
        >
          {isLoading ? "Clearing..." : "Clear Sample Data"}
        </button>
      </div>

      {message && (
        <div className={`mt-3 p-2 rounded text-sm ${
          message.includes("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {message}
        </div>
      )}

      <p className="text-xs text-gray-600 mt-2">
        This will create sample users, posts, and follow relationships for testing.
      </p>
    </div>
  );
}



