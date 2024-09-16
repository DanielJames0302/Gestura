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
    const user = await ctx.db.query("users").collect();

    return user;
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