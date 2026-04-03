import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  illustrations: defineTable({
    prompt: v.string(),
    imageBase64: v.string(),
    userId: v.id("users"),
    createdAt: v.number(),
    style: v.optional(v.string()),
  }).index("by_user", ["userId"]).index("by_created", ["createdAt"]),
});
