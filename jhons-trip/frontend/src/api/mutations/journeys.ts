import getBaseUrl from "@/lib/getBaseUrl";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

const journeysSchema = z
  .object({
    name: z.string(),
    description: z.string(),
    details: z.string(),
    start: z.number().int(),
    end: z.number().int(),
    slots: z.number().int(),
    regionId: z.number().int(),
    countryId: z.number().int(),
  })
  .array();

export function useAddJourneys(data: z.infer<typeof journeysSchema>) {
  return useMutation({
    mutationKey: ["journeys"],
    mutationFn: async () => {
      journeysSchema.parse(data);
      const res = await (
        await fetch(getBaseUrl() + "api/journeys", {
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          method: "POST",
          body: JSON.stringify({ data }),
        })
      ).json();
      if (res["error"]) throw new Error(res["error"]);

      return res["data"];
    },
  });
}
