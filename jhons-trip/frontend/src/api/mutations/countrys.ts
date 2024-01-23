import getBaseUrl from "@/lib/getBaseUrl";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

const countriesSchema = z
  .object({
    name: z.string(),
    code: z.string(),
  })
  .array();

export function useAddCoutries(data: z.infer<typeof countriesSchema>) {
  return useMutation({
    mutationKey: ["countries"],
    mutationFn: async () => {
      countriesSchema.parse(data);
      const res = await (
        await fetch(getBaseUrl() + "api/countries", {
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
