import { Id } from "@/convex/_generated/dataModel";

export interface Post {
  creatorId: Id<"users">;
  caption: string;
  tag: string;
  postVideo: FileList | string | null;
}