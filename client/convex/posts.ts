import { mutation, query } from "./_generated/server";
import { v, VString } from "convex/values";
import { asyncMap } from "convex-helpers";
import {
  getAll,
  getOneFrom,
  getManyFrom,
  getManyVia,
} from "convex-helpers/server/relationships";

export const createPost = mutation({
  args: {
    creatorId: v.id("users"),
    caption: v.string(),
    postVideo: v.string(),
    tag: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("posts", { ...args });
  },
});

export const feedPost = query({
  handler: async (ctx) => {
    const barePosts = await ctx.db.query("posts").order("desc").collect();
    const posts = await asyncMap(barePosts, async (post) => {
      if (post.creatorId) {
        const creator = await ctx.db.get(post.creatorId);
        return { ...post, creator };
      }
    });
    return posts;
  },
});

