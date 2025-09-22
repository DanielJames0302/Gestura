import { internalMutation, mutation } from "./_generated/server";
import { v } from "convex/values";

// Sample user data
const sampleUsers = [
  {
    firstName: "Sarah",
    lastName: "Johnson",
    username: "sarah_signs",
    email: "sarah.johnson@example.com",
    profilePhoto: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    externalId: "sample_user_1",
  },
  {
    firstName: "Michael",
    lastName: "Chen",
    username: "mike_gestures",
    email: "michael.chen@example.com",
    profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    externalId: "sample_user_2",
  },
  {
    firstName: "Emma",
    lastName: "Williams",
    username: "emma_hands",
    email: "emma.williams@example.com",
    profilePhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    externalId: "sample_user_3",
  },
  {
    firstName: "David",
    lastName: "Brown",
    username: "david_signing",
    email: "david.brown@example.com",
    profilePhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    externalId: "sample_user_4",
  },
  {
    firstName: "Lisa",
    lastName: "Garcia",
    username: "lisa_communicates",
    email: "lisa.garcia@example.com",
    profilePhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    externalId: "sample_user_5",
  },
  {
    firstName: "James",
    lastName: "Wilson",
    username: "james_gestures",
    email: "james.wilson@example.com",
    profilePhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    externalId: "sample_user_6",
  },
];

// Sample post data
const samplePosts = [
  {
    caption: "Learning sign language has been such an amazing journey! Today I practiced the alphabet and some basic greetings. The community here is so supportive! 🤟",
    postVideo: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    signVideo: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
    tag: "learning",
  },
  {
    caption: "Beautiful day for a walk in the park! The weather is perfect and I love seeing everyone enjoying the outdoors. Nature is truly healing 🌳",
    postVideo: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
    signVideo: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    tag: "nature",
  },
  {
    caption: "Cooking my favorite pasta recipe today! Italian food always brings back such wonderful memories. Sharing the recipe in the comments below 👨‍🍳",
    postVideo: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
    signVideo: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
    tag: "cooking",
  },
  {
    caption: "Just finished reading an incredible book about accessibility in technology. It's inspiring to see how we can make the world more inclusive for everyone! 📚",
    postVideo: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    signVideo: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
    tag: "technology",
  },
  {
    caption: "Morning coffee and some quiet reflection time. Sometimes the best moments are the simple ones. Grateful for this peaceful start to the day ☕",
    postVideo: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
    signVideo: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    tag: "lifestyle",
  },
  {
    caption: "Working on a new art project! I love how creativity can express emotions that words sometimes can't capture. Art is truly universal 🎨",
    postVideo: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
    signVideo: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
    tag: "art",
  },
  {
    caption: "Exercise time! Staying active is so important for both physical and mental health. What's your favorite way to stay fit? 💪",
    postVideo: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    signVideo: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
    tag: "fitness",
  },
  {
    caption: "Travel memories from last summer! Exploring new places and meeting people from different cultures is one of life's greatest joys ✈️",
    postVideo: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
    signVideo: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    tag: "travel",
  },
  {
    caption: "Family dinner tonight! Nothing beats spending quality time with loved ones. These moments are what make life special ❤️",
    postVideo: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
    signVideo: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
    tag: "family",
  },
  {
    caption: "Music practice session! Learning to play the guitar has been challenging but so rewarding. Music truly speaks to the soul 🎸",
    postVideo: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    signVideo: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
    tag: "music",
  },
];

// Create a sample user
export const createSampleUser = internalMutation({
  args: {
    userData: v.object({
      firstName: v.string(),
      lastName: v.string(),
      username: v.string(),
      email: v.string(),
      profilePhoto: v.string(),
      externalId: v.string(),
    }),
  },
  handler: async (ctx, { userData }) => {
    const userAttributes = {
      ...userData,
      posts: [],
      savedPosts: [],
      likedPosts: [],
      followers: [],
      following: [],
    };

    const existingUser = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", userData.externalId))
      .unique();

    if (existingUser) {
      console.log(`User ${userData.username} already exists, skipping...`);
      return existingUser._id;
    }

    const userId = await ctx.db.insert("users", userAttributes);
    console.log(`Created user: ${userData.username} (${userId})`);
    return userId;
  },
});

// Create a sample post
export const createSamplePost = internalMutation({
  args: {
    creatorId: v.id("users"),
    postData: v.object({
      caption: v.string(),
      postVideo: v.string(),
      signVideo: v.optional(v.string()),
      tag: v.string(),
    }),
  },
  handler: async (ctx, { creatorId, postData }) => {
    const postId = await ctx.db.insert("posts", {
      creatorId,
      ...postData,
    });
    console.log(`Created post: ${postData.caption.substring(0, 50)}... (${postId})`);
    return postId;
  },
});

// Create a follow relationship
export const createFollowRelationship = internalMutation({
  args: {
    followerId: v.id("users"),
    followedId: v.id("users"),
  },
  handler: async (ctx, { followerId, followedId }) => {
    // Check if relationship already exists
    const existingRelationship = await ctx.db
      .query("relationships")
      .withIndex("byFollowerId", (q) => 
        q.eq("followerUserId", followerId).eq("followedUserId", followedId)
      )
      .unique();

    if (existingRelationship) {
      console.log(`Relationship already exists between ${followerId} and ${followedId}`);
      return existingRelationship._id;
    }

    const relationshipId = await ctx.db.insert("relationships", {
      followerUserId: followerId,
      followedUserId: followedId,
    });
    console.log(`Created follow relationship: ${followerId} -> ${followedId}`);
    return relationshipId;
  },
});

// Main seed function
export const seedDatabase = internalMutation({
  args: {},
  handler: async (ctx) => {
    console.log("🌱 Starting database seeding...");

    // Create users
    const userIds: string[] = [];
    for (const userData of sampleUsers) {
      const userId = await createSampleUser(ctx, { userData });
      userIds.push(userId);
    }

    // Create posts (distribute among users)
    const postIds: string[] = [];
    for (let i = 0; i < samplePosts.length; i++) {
      const creatorId = userIds[i % userIds.length] as any; // Cycle through users
      const postId = await createSamplePost(ctx, {
        creatorId,
        postData: samplePosts[i],
      });
      postIds.push(postId);
    }

    // Create follow relationships (create a network)
    const relationships = [
      [0, 1], [0, 2], [0, 3], // User 0 follows users 1, 2, 3
      [1, 0], [1, 4], [1, 5], // User 1 follows users 0, 4, 5
      [2, 0], [2, 1], [2, 3], // User 2 follows users 0, 1, 3
      [3, 1], [3, 4], [3, 5], // User 3 follows users 1, 4, 5
      [4, 0], [4, 2], [4, 5], // User 4 follows users 0, 2, 5
      [5, 0], [5, 1], [5, 3], // User 5 follows users 0, 1, 3
    ];

    for (const [followerIndex, followedIndex] of relationships) {
      if (followerIndex < userIds.length && followedIndex < userIds.length) {
        await createFollowRelationship(ctx, {
          followerId: userIds[followerIndex] as any,
          followedId: userIds[followedIndex] as any,
        });
      }
    }

    console.log("✅ Database seeding completed!");
    console.log(`Created ${userIds.length} users`);
    console.log(`Created ${postIds.length} posts`);
    console.log(`Created ${relationships.length} follow relationships`);

    return {
      usersCreated: userIds.length,
      postsCreated: postIds.length,
      relationshipsCreated: relationships.length,
    };
  },
});

// Clear all data (useful for testing)
export const clearAllData = internalMutation({
  args: {},
  handler: async (ctx) => {
    console.log("🗑️ Clearing all data...");

    // Delete all relationships
    const relationships = await ctx.db.query("relationships").collect();
    for (const relationship of relationships) {
      await ctx.db.delete(relationship._id);
    }

    // Delete all posts
    const posts = await ctx.db.query("posts").collect();
    for (const post of posts) {
      await ctx.db.delete(post._id);
    }

    // Delete all users (except those with real external IDs)
    const users = await ctx.db.query("users").collect();
    for (const user of users) {
      // Only delete sample users (those with externalId starting with "sample_user_")
      if (user.externalId.startsWith("sample_user_")) {
        await ctx.db.delete(user._id);
      }
    }

    console.log("✅ All sample data cleared!");
  },
});

// Public mutation to seed data (for development)
export const seedDatabasePublic = mutation({
  args: {},
  handler: async (ctx) => {
    return await seedDatabase(ctx, {});
  },
});

// Public mutation to clear data (for development)
export const clearAllDataPublic = mutation({
  args: {},
  handler: async (ctx) => {
    return await clearAllData(ctx, {});
  },
});




