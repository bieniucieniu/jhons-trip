import getBaseUrl from "@/lib/getBaseUrl";
import { useQuery } from "@tanstack/react-query";

export type User =
  | {
      username: string;
      userID: number;
      privilege: number;
    }
  | undefined;

export default function useGetUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const res = await fetch(getBaseUrl() + "api/auth", {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const body = (await res.json()) as {
          user?: User;
          error?: any;
        };

        if (body.error) throw new Error(body.error);

        return body.user;
      } catch (e) {
        console.log(e);
      }
    },
    staleTime: 1000 * 60 * 60 * 60,
  });
}
