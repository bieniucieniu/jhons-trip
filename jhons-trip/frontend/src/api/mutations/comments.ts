import getBaseUrl from "@/lib/getBaseUrl";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

const commentSchema = z.object({
  rating: z.number().int().min(0).max(10),
  title: z.string(),
  content: z.string().max(5000),
});

export type Comment = z.infer<typeof commentSchema>;

export function useAddComment({ historyId }: { historyId: number }) {
  return useMutation({
    mutationKey: ["comments", "history", "historyId" + historyId],
    mutationFn: async (data: Comment) => {
      commentSchema.parse(data);
      const res = await (
        await fetch(getBaseUrl() + "api/comments", {
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          method: "POST",
          body: JSON.stringify({
            data: {
              historyId,
              ...data,
            },
          }),
        })
      ).json();
      if (res["error"]) throw new Error(res["error"]);

      return res["data"];
    },
  });
}

export function useDeleteComment() {
  return useMutation({
    mutationKey: ["comments"],
    mutationFn: async (id: number) => {
      if (typeof id !== "number") throw new Error("incorect id type");

      const res = await (
        await fetch(getBaseUrl() + "api/comments" + "?id=" + String(id), {
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          method: "DELETE",
        })
      ).json();
      if (res["error"]) throw new Error(res["error"]);

      return res;
    },
  });
}
