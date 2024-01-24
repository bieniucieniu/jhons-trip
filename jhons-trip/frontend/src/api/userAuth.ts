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

export function logout() {
  console.log("daksjdhk");
  document.cookie = "token=0; expires=Fri, 31 Dec 2000 23:59:59 GMT; path=/";
}
