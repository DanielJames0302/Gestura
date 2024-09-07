import { internalMutation, mutation, query, QueryCtx } from "./_generated/server";
import { UserJSON } from "@clerk/backend";
import { asyncMap } from "convex-helpers";
import { v, Validator } from "convex/values";

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
    });
    const bareFollowingList = await ctx.db
    .query("relationships")
    .withIndex("byFollowerId", (q) => q.eq("followerUserId", user._id ?? null))
    .collect();

    const followingList = await asyncMap(bareFollowingList, async (item) => {
      if (item.followedUserId) {
        const followedUser = await ctx.db.get(item.followedUserId);
        return { ...item, followedUser };
      }
    });



    const bareFollowerList = await ctx.db
    .query("relationships")
    .withIndex("byFollowerId", (q) => q.eq("followerUserId", user._id ?? null))
    .collect();


    const followerList = await asyncMap(bareFollowerList, async (item) => {
      if (item.followerUserId) {
        const followerUser = await ctx.db.get(item.followerUserId);
        return { ...item, followerUser };
      }
    });

    return {user, posts, followingList, followerList};
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
    });
    const bareFollowingList = await ctx.db
    .query("relationships")
    .withIndex("byFollowerId", (q) => q.eq("followerUserId", user._id ?? null))
    .collect();

    const followingList = await asyncMap(bareFollowingList, async (item) => {
      if (item.followedUserId) {
        const followedUser = await ctx.db.get(item.followedUserId);
        return { ...item, followedUser };
      }
    });



    const bareFollowerList = await ctx.db
    .query("relationships")
    .withIndex("byFollowerId", (q) => q.eq("followerUserId", user._id ?? null))
    .collect();


    const followerList = await asyncMap(bareFollowerList, async (item) => {
      if (item.followerUserId) {
        const followerUser = await ctx.db.get(item.followerUserId);
        return { ...item, followerUser };
      }
    });

    return {user, posts, followingList, followerList};
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
    });


    return followingList
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

