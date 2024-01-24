import { useQuery } from "@tanstack/react-query";
import getBaseUrl from "@/lib/getBaseUrl";
import cleanupObject from "@/lib/cleanupObject";
import { z } from "zod";

export const journeysSchema = z.object({
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
  price: z.number(),
  comment: z
    .object({
      rating: z.number(),
      title: z.string(),
      content: z.string(),
      user: z
        .object({
          username: z.string(),
          id: z.number().int(),
        })
        .optional(),
    })
    .array()
    .optional(),
  region: z
    .object({
      id: z.number().int(),
      name: z.string(),
      countryId: z.number(),
      country: z
        .object({
          code: z.string(),
          id: z.number().int(),
          name: z.string(),
        })
        .optional(),
    })
    .optional(),
});

export type Journey = z.infer<typeof journeysSchema>;

export default function useGetJourneys({
  limit,
  name,
  id,
  regionId,
  offset,
  start,
  end,
  min,
  max,
  withComments,
}: {
  limit?: number;
  name?: string;
  start?: number;
  end?: number;
  regionId?: number;
  id?: number;
  offset?: number;
  max?: number;
  min?: number;
  withComments?: boolean;
}) {
  return useQuery({
    queryKey: [
      "journeys",
      "limit" + limit,
      "offset" + offset,
      name,
      "region" + regionId,
      "max" + max,
      "min" + min,
    ],
    queryFn: async () => {
      const params = new URLSearchParams(
        cleanupObject({
          limit,
          name,
          regionId,
          id,
          offset,
          start,
          end,
          withComments,
          minPrice: min,
          maxPrice: max,
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
    staleTime: 1000 * 60 * 60,
  });
}
