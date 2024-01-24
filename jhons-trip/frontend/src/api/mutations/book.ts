import getBaseUrl from "@/lib/getBaseUrl";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

export const bookSchema = z.object({
  for: z.number().int(),
  journeyName: z.string(),
  userId: z.number().int(),
  journeyId: z.number().int(),
});

export type Book = z.infer<typeof bookSchema>;

export function useBook() {
  return useMutation({
    mutationKey: ["journeys", "history"],
    mutationFn: async (data: Partial<z.infer<typeof bookSchema>>[]) => {
      bookSchema.array().parse(data);
      const res = await (
        await fetch(getBaseUrl() + "api/book", {
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
export function useCancelJourney() {
  return useMutation({
    mutationKey: ["regions"],
    mutationFn: async (id: number) => {
      const res = await (
        await fetch(getBaseUrl() + "api/cancel", {
          headers: {
            "Content-Type": "application/json",
          },
          mode: "cors",
          method: "POST",
          body: JSON.stringify({ id }),
        })
      ).json();
      if (res["error"]) throw new Error(res["error"]);

      return res["data"];
    },
  });
}
