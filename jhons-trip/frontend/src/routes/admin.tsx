import useGetUser from "@/api/queries/user";
import { ModDashboard } from "./mod";

export default function Admin() {
  const user = useGetUser();
  if (user.data && user.data.privilege < 100) return <div>406</div>;

  return (
    <main className="grid grid-cols-3">
      <AdminDashboard />
    </main>
  );
}

export function AdminDashboard() {
  return (
    <>
      <ModDashboard />
      <div></div>
    </>
  );
}
