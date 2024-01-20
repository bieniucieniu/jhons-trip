import { useQuery } from "@tanstack/react-query";
import getBaseUrl from "@/lib/getBaseUrl";
import cleanupObject from "@/lib/cleanupObject";
import { z } from "zod";

const journeysSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string(),
  details: z.string(),
  start: z.number().int(),
  end: z.number().int(),
  slots: z.number().int(),
  booked: z.number().int(),
  regionId: z.number().int(),
  imageUrl: z.string().optional(),
  region: z
    .object({
      id: z.number().int(),
      name: z.string(),
      countryId: z.number(),
    })
    .optional(),
});

export type Journey = z.infer<typeof journeysSchema>;

export default function getJourneys({
  limit,
  name,
  id,
  regionId,
  offset,
}: {
  limit?: number;
  name?: string;
  regionId?: number;
  id?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: [
      "journeys",
      "limit" + limit,
      "offset" + offset,
      name,
      "region" + regionId,
    ],
    queryFn: async () => {
      const params = new URLSearchParams(
        cleanupObject({
          limit,
          name,
          regionId,
          id,
          offset,
        }),
      ).toString();

      const res = await (
        await fetch(
          getBaseUrl() + "api/journeys" + (params ? "?" + params : ""),
          {
            mode: "cors",
            method: "GET",
          },
        )
      ).json();

      console.log(res);
      if (res["error"]) throw new Error(res["error"]);
      return journeysSchema.array().parse(res["data"]);
    },
    staleTime: 10000,
  });
}
