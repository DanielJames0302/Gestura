import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { asyncMap } from "convex-helpers";


export const follow = mutation({
  args: { followerId: v.string(), followedId: v.id("users") },
  handler: async (ctx, args) => {

    const followerUser = await ctx.db
    .query("users")
    .withIndex("byExternalId", (q) => q.eq("externalId", args.followerId ?? null))
    .unique();

    if (!followerUser) {
      throw new Error("User not found");
    }

    const bareFollowingList = await ctx.db
    .query("relationships")
    .withIndex("byFollowerId", (q) => q.eq("followerUserId", followerUser?._id ?? null))
    .filter((q) => q.eq(q.field("followedUserId"), args.followedId))
    .unique();

   if (bareFollowingList) {
    await ctx.db.delete(bareFollowingList._id);
   } else {
    await ctx.db.insert("relationships", { followerUserId: followerUser?._id, followedUserId: args.followedId });
   }
  },
});

export const getAllUsers = query({
  handler: async(ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      return [];
    }
    
    // Get current user to exclude them from the list
    const currentUser = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .unique();
    
    if (!currentUser) {
      return [];
    }
    
    // Get all users except the current user
    const allUsers = await ctx.db.query("users").collect();
    const otherUsers = allUsers.filter(user => user._id !== currentUser._id);
    
    return otherUsers;
  }
})



export const searchPeople = mutation({
  args: { queryStr: v.string() },
  handler: async (ctx, args) => {
    const user = ctx.db
      .query("users")
      .withSearchIndex("search_user", (q) =>
        q.search("username", args.queryStr)
      ).collect();

    return user;
  },
});

// Get followers for a specific user
export const getFollowers = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const bareFollowerList = await ctx.db
      .query("relationships")
      .filter((q) => q.eq(q.field("followedUserId"), args.userId))
      .collect();
    
    const followerList = await asyncMap(bareFollowerList, async (item) => {
      if (item.followerUserId) {
        const followerUser = await ctx.db.get(item.followerUserId);
        return followerUser;
      }
      return null;
    });

    return followerList.filter((user): user is NonNullable<typeof user> => user !== null);
  },
});

// Get following list for a specific user
export const getFollowing = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const bareFollowingList = await ctx.db
      .query("relationships")
      .withIndex("byFollowerId", (q) => q.eq("followerUserId", args.userId))
      .collect();

    const followingList = await asyncMap(bareFollowingList, async (item) => {
      if (item.followedUserId) {
        const followedUser = await ctx.db.get(item.followedUserId);
        return followedUser;
      }
      return null;
    });

    return followingList.filter((user): user is NonNullable<typeof user> => user !== null);
  },
});

// Get current user's followers
export const getCurrentUserFollowers = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      return [];
    }
    
    const currentUser = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .unique();
    
    if (!currentUser) {
      return [];
    }

    return await getFollowers(ctx, { userId: currentUser._id });
  },
});

// Get current user's following list
export const getCurrentUserFollowing = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      return [];
    }
    
    const currentUser = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .unique();
    
    if (!currentUser) {
      return [];
    }

    return await getFollowing(ctx, { userId: currentUser._id });
  },
});

// Check if current user is following a specific user
export const isFollowing = query({
  args: { targetUserId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      return false;
    }
    
    const currentUser = await ctx.db
      .query("users")
      .withIndex("byExternalId", (q) => q.eq("externalId", identity.subject))
      .unique();
    
    if (!currentUser) {
      return false;
    }

    const relationship = await ctx.db
      .query("relationships")
      .withIndex("byFollowerId", (q) => q.eq("followerUserId", currentUser._id))
      .filter((q) => q.eq(q.field("followedUserId"), args.targetUserId))
      .unique();

    return relationship !== null;
  },
});

// Get follow count for a user
export const getFollowCounts = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const [followers, following] = await Promise.all([
      getFollowers(ctx, { userId: args.userId }),
      getFollowing(ctx, { userId: args.userId })
    ]);

    return {
      followersCount: followers.length,
      followingCount: following.length
    };
  },
});