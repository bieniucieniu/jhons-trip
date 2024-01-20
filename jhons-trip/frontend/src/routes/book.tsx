import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { User, getUser } from "@/api/userAuth";

export default function Book() {
  const { id } = useParams();
  const [user, setUser] = useState<User>(undefined);

  useEffect(() => {
    getUser((v) => {
      if (v.error || !v.user) {
        return;
      }
      setUser(v.user);
    });
  }, []);

  if (!id) return null;
  if (!user) return <div>not login</div>;
  return <main className="max-w-screen-lg mx-auto"></main>;
}
