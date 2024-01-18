import getBaseUrl from "../utlis/getBaseUrl";

export default async function genUser(
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
