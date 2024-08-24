import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";



export default defineSchema({
  users: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    username: v.string(),
    email: v.string(),
    profilePhoto: v.string(),
    posts: v.optional(v.array(v.id("posts"))),
    savedPosts: v.optional(v.array(v.id("posts"))),
    likedPosts: v.optional(v.array(v.id("posts"))),
    followers: v.optional(v.array(v.id("users"))),
    following: v.optional(v.array(v.id("users"))),
    // this the Clerk ID, stored in the subject JWT field
    externalId: v.string(),
  }).index("byExternalId", ["externalId"]),

  posts: defineTable({
    creatorId: v.union(v.id("users"), v.null()),
    caption: v.string(),
    postVideo: v.string(),
    tag: v.string(),
  }).index("byCreatorId", ["creatorId"])
 
});