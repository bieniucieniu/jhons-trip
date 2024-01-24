import cleanupObject from "@/lib/cleanupObject";
import getBaseUrl from "@/lib/getBaseUrl";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

export const commentSchema = z.object({
  id: z.number(),
  rating: z.number(),
  title: z.string(),
  content: z.string(),
  user: z
    .object({
      username: z.string(),
      id: z.number().int(),
    })
    .optional(),
});

export type Comment = z.infer<typeof commentSchema>;

export default function useGetComments({
  limit,
  id,
  offset,
  journeyId,
}: {
  limit?: number;
  id?: number;
  journeyId?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ["comments", "offset" + offset, "journeyId" + journeyId],
    queryFn: async () => {
      const params = new URLSearchParams(
        cleanupObject({
          limit,
          journeyId,
          id,
          offset,
        }),
      ).toString();
      const res = await (
        await fetch(
          getBaseUrl() + "api/comments" + (params ? "?" + params : ""),
          {
            mode: "cors",
            method: "GET",
          },
        )
      ).json();

      if (res["error"]) throw new Error(res["error"]);
      return commentSchema.array().parse(res["data"]);
    },
  });
}
