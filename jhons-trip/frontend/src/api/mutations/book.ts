import getBaseUrl from "@/lib/getBaseUrl";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

const bookSchema = z
  .object({
    for: z.number().int(),
    journeyName: z.string(),
    userId: z.number().int(),
    journeyId: z.number().int(),
  })
  .array();

export default function book(data: z.infer<typeof bookSchema>) {
  return useMutation({
    mutationKey: ["journeys", "history"],
    mutationFn: async () => {
      bookSchema.parse(data);
      const res = await (
        await fetch(getBaseUrl() + "api/book", {
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
