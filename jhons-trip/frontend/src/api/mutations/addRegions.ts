import getBaseUrl from "@/lib/getBaseUrl";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

const regionsSchema = z
  .object({
    name: z.string(),
    countryId: z.number().int(),
  })
  .array();

export default function addRegions(data: z.infer<typeof regionsSchema>) {
  return useMutation({
    mutationKey: ["regions"],
    mutationFn: async () => {
      const res = await (
        await fetch(getBaseUrl() + "api/regions", {
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
