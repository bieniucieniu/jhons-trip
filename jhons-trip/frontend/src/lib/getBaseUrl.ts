export default function getBaseUrl() {
  if (import.meta.env.DEV) return "http://localhost:3000/";
  return "/";
}
