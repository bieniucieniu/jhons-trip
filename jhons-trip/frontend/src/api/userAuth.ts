import getBaseUrl from "@/lib/getBaseUrl";

export async function genUser(
  username: string,
  password: string,
  callback?: (res: { token?: string; error?: any }) => void,
) {
  try {
    const res = await fetch(getBaseUrl() + "api/signin", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const body = await res.json();
    if (callback !== undefined) callback(body);
    return res;
  } catch (e) {
    console.log(e);
  }
}
export async function login(
  username: string,
  password: string,
  callback?: (res: { token?: string; error?: any }) => void,
) {
  try {
    const res = await fetch(getBaseUrl() + "api/login", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const body = await res.json();
    if (callback !== undefined) callback(body);
    return res;
  } catch (e) {
    console.log(e);
  }
}

export type User =
  | {
      username: string;
      userID: number;
      privilege: number;
    }
  | undefined;

export async function getUser(
  callback?: (res: { user?: User; error?: any }) => void,
) {
  try {
    const res = await fetch(getBaseUrl() + "api/auth", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const body = (await res.json()) as {
      user: User;
      error: any;
    };

    if (callback !== undefined) callback(body);
    return body;
  } catch (e) {
    console.log(e);
  }
}
