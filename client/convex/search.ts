import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { asyncMap } from "convex-helpers";

export const searchPost = mutation({
  args: { queryStr: v.string() },
  handler: async (ctx, args) => {
    const barePosts = ctx.db
      .query("posts")
      .withSearchIndex("search_post", (q) =>
        q.search("caption", args.queryStr)
      ).collect();
      const posts = await asyncMap(barePosts, async (post) => {
        if (post.creatorId) {
          const creator = await ctx.db.get(post.creatorId);
          return { ...post, creator };
        }
      });

    return posts;
  },
});



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