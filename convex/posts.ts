import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createPost = mutation({
  args: { creatorId: v.id("users"),
    caption: v.string(),
    postVideo: v.string(),
    tag: v.string()},
  handler: async (ctx, args) => {
    await ctx.db.insert("posts", {...args})
  }
})