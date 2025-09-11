import { internalMutation, mutation, query, QueryCtx } from "./_generated/server";
import { UserJSON } from "@clerk/backend";
import { asyncMap } from "convex-helpers";
import { v, Validator } from "convex/values";

// Helper function to filter out null/undefined values from asyncMap results
function filterNulls<T>(arr: (T | null | undefined)[]): T[] {
  return arr.filter((item): item is T => item !== null && item !== undefined);
}

export const current = mutation({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});


export const getCurrentUserInfo = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      return null;
    }
    const user = await ctx.db
    .query("users")
    .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
    .unique();
 
    if (!user) {
      throw new Error("User not found");
    }
    const barePosts = await ctx.db
    .query("posts")
    .withIndex("byCreatorId", (q) => q.eq("creatorId", user._id ?? null))
    .collect(); 

    const posts = await asyncMap(barePosts, async (post) => {
      if (post.creatorId) {
        const creator = await ctx.db.get(post.creatorId);
        return { ...post, creator };
      }
      return null;
    });

    const bareFollowingList = await ctx.db
    .query("relationships")
    .withIndex("byFollowerId", (q) => q.eq("followerUserId", user._id ?? null))
    .collect();

    const followingList = await asyncMap(bareFollowingList, async (item) => {
      if (item.followedUserId) {
        const followedUser = await ctx.db.get(item.followedUserId);
        return followedUser
      }
      return null;
    });

    const bareFollowerList = await ctx.db
    .query("relationships")
    .filter((q) => q.eq(q.field("followedUserId"), user._id ?? null))
    .collect();
    
    const followerList = await asyncMap(bareFollowerList, async (item) => {
      if (item.followerUserId) {
        const followerUser = await ctx.db.get(item.followerUserId);
        return followerUser;
      }
      return null;
    });

    return {
      user, 
      posts: filterNulls(posts), 
      followingList: filterNulls(followingList), 
      followerList: filterNulls(followerList)
    };
  }
})

export const getUserInfo = mutation({
  args: {id: v.string()},
  handler: async (ctx, args) => {

    const user = await ctx.db
    .query("users")
    .withIndex("byExternalId", (q) => q.eq("externalId", args.id))
    .unique();
 
    if (!user) {
      throw new Error("User not found");
    }
    const barePosts = await ctx.db
    .query("posts")
    .withIndex("byCreatorId", (q) => q.eq("creatorId", user._id ?? null))
    .collect(); 

    const posts = await asyncMap(barePosts, async (post) => {
      if (post.creatorId) {
        const creator = await ctx.db.get(post.creatorId);
        return { ...post, creator };
      }
      return null;
    });

    const bareFollowingList = await ctx.db
    .query("relationships")
    .withIndex("byFollowerId", (q) => q.eq("followerUserId", user._id ?? null))
    .collect();

    const followingList = await asyncMap(bareFollowingList, async (item) => {
      if (item.followedUserId) {
        const followedUser = await ctx.db.get(item.followedUserId);
        return followedUser
      }
      return null;
    });

    const bareFollowerList = await ctx.db
    .query("relationships")
    .filter((q) => q.eq(q.field("followedUserId"), user._id ?? null))
    .collect();

    const followerList = await asyncMap(bareFollowerList, async (item) => {
      if (item.followerUserId) {
        const followerUser = await ctx.db.get(item.followerUserId);
        return followerUser;
      }
      return null;
    });

    return {
      user, 
      posts: filterNulls(posts), 
      followingList: filterNulls(followingList), 
      followerList: filterNulls(followerList)
    };
  }
})

export const getUserFollowing = mutation({
  args: {id: v.id("users")},
  handler: async (ctx, args) => {

    const bareFollowing = await ctx.db
    .query("relationships")
    .withIndex("byFollowerId", (q) => q.eq("followerUserId", args.id))
    .collect(); 
    const followingList = await asyncMap(bareFollowing, async (following) => {
      if (following.followedUserId) {
        const followedUserId = await ctx.db.get(following.followedUserId);
        return { ...following, followedUserId };
      }
      return null;
    });

    return filterNulls(followingList);
  }
})


export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
  async handler(ctx, { data }) {
    const userAttributes = {
      externalId: data.id as string,   
      firstName: data.first_name as string,
      lastName: data.last_name as string,
      profilePhoto: data.image_url as string,
      email:  data.email_addresses[0].email_address,
      username: data.username ?? "",
      posts: [],
      savedPosts: [],
      likedPosts: [],
      followers: [],
      following: [],
    };

    const user = await userByExternalId(ctx, data.id);
    if (user === null) {
      await ctx.db.insert("users", userAttributes);
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByExternalId(ctx, clerkUserId);

    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`,
      );
    }
  },
});


export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }

  return await userByExternalId(ctx, identity.subject);
}

export async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query("users")
    .withIndex("byExternalId", (q) => q.eq("externalId", externalId))
    .unique();
}

// Get all users (for seeding status)
export const getAllUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

// Debug query to check relationships
export const debugRelationships = query({
  handler: async (ctx) => {
    const relationships = await ctx.db.query("relationships").collect();
    const users = await ctx.db.query("users").collect();
    
    return {
      relationships,
      users: users.map(u => ({ id: u._id, externalId: u.externalId, username: u.username }))
    };
  },
});

// Clean up orphaned relationships
export const cleanupOrphanedRelationships = internalMutation({
  handler: async (ctx) => {
    const relationships = await ctx.db.query("relationships").collect();
    const users = await ctx.db.query("users").collect();
    const userIds = new Set(users.map(u => u._id));
    
    let cleanedCount = 0;
    
    for (const rel of relationships) {
      const followerExists = userIds.has(rel.followerUserId);
      const followedExists = userIds.has(rel.followedUserId);
      
      if (!followerExists || !followedExists) {
        console.log(`Deleting orphaned relationship: ${rel.followerUserId} -> ${rel.followedUserId}`);
        await ctx.db.delete(rel._id);
        cleanedCount++;
      }
    }
    
    return { cleanedCount };
  },
});

// Public version for cleanup
export const cleanupOrphanedRelationshipsPublic = mutation({
  handler: async (ctx) => {
    const relationships = await ctx.db.query("relationships").collect();
    const users = await ctx.db.query("users").collect();
    const userIds = new Set(users.map(u => u._id));
    
    let cleanedCount = 0;
    
    for (const rel of relationships) {
      const followerExists = userIds.has(rel.followerUserId);
      const followedExists = userIds.has(rel.followedUserId);
      
      if (!followerExists || !followedExists) {
        await ctx.db.delete(rel._id);
        cleanedCount++;
      }
    }
    
    return { cleanedCount };
  },
});

