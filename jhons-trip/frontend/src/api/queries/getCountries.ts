import { useQuery } from "@tanstack/react-query";
import getBaseUrl from "@/lib/getBaseUrl";
import cleanupObject from "@/lib/cleanupObject";
import { z } from "zod";

const countriesSchema = z
  .object({
    id: z.number().int(),
    name: z.string(),
    code: z.string(),
  })
  .array();

export default function getCoutries({
  limit,
  name,
}: {
  limit?: number;
  name?: string;
}) {
  return useQuery({
    queryKey: ["countries", String(limit), name],
    queryFn: async () => {
      const params = new URLSearchParams(
        cleanupObject({
          limit: String(limit),
          name,
        }),
      ).toString();

      const res = await (
        await fetch(
          getBaseUrl() + "api/countries" + (params ? "&" + params : ""),
          {
            mode: "cors",
            method: "GET",
          },
        )
      ).json();
      if (res["error"]) throw new Error(res["error"]);
      return countriesSchema.parse(res["data"]);
    },
    staleTime: 10000,
  });
}
