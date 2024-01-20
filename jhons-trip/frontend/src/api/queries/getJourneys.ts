import { useQuery } from "@tanstack/react-query";
import getBaseUrl from "@/lib/getBaseUrl";
import cleanupObject from "@/lib/cleanupObject";
import { z } from "zod";

const journeysSchema = z
  .object({
    id: z.number().int(),
    name: z.string(),
    description: z.string(),
    details: z.string(),
    start: z.number().int(),
    end: z.number().int(),
    slots: z.number().int(),
    booked: z.number().int(),
    regionId: z.number().int(),
    countryId: z.number().int(),
  })
  .array();

export default function getJourneys({
  limit,
  name,
  id,
  countryId,
}: {
  limit?: number;
  name?: string;
  countryId?: number;
  id?: number;
}) {
  return useQuery({
    queryKey: ["journeys", String(limit), name, String(countryId)],
    queryFn: async () => {
      const params = new URLSearchParams(
        cleanupObject({
          limit,
          name,
          countryId,
          id,
        }),
      ).toString();

      const res = await (
        await fetch(
          getBaseUrl() + "api/regions" + (params ? "&" + params : ""),
          {
            mode: "cors",
            method: "GET",
          },
        )
      ).json();
      if (res["error"]) throw new Error(res["error"]);
      return journeysSchema.parse(res["data"]);
    },
    staleTime: 10000,
  });
}
