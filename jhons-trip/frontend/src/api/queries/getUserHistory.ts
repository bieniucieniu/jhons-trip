import { useQuery } from "@tanstack/react-query";
import getBaseUrl from "@/lib/getBaseUrl";
import cleanupObject from "@/lib/cleanupObject";
import { z } from "zod";
import { journeysSchema } from "./getJourneys";

const userHistorySchema = z.object({
  id: z.number().int(),
  for: z.number().int(),
  journeyName: z.string(),
  userId: z.number().int(),
  journeyId: z.number().int(),
  journey: journeysSchema.omit({ region: true }).optional(),
});

export default function getUserHistory({
  limit,
  name,
  journeyId,
  offset,
}: {
  limit?: number;
  name?: string;
  journeyId?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ["history", limit, name, journeyId, offset],
    queryFn: async () => {
      const params = new URLSearchParams(
        cleanupObject({
          limit,
          name,
          journeyId,
          offset,
        }),
      ).toString();

      const res = await (
        await fetch(
          getBaseUrl() + "api/history" + (params ? "?" + params : ""),
          {
            mode: "cors",
            method: "GET",
          },
        )
      ).json();
      if (res["error"]) throw new Error(res["error"]);
      return userHistorySchema.array().parse(res["data"]);
    },
    staleTime: 0,
  });
}
