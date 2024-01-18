import getBaseUrl from "@/lib/getBaseUrl";
import { useMutation } from "@tanstack/react-query";

export default function addCoutries(
  data: {
    code: string;
    name: string;
  }[],
) {
  return useMutation({
    mutationKey: ["countries"],
    mutationFn: async () => {
      const res = await (
        await fetch(getBaseUrl() + "api/countries", {
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
