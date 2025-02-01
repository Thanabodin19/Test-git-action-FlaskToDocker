import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { SessionData } from "../type";

export const useFetchSession = () => {
  const [session, setSession] = useState<SessionData>();
  useEffect(() => {
    const fetchSession = async () => {
      const currentSession = await getSession();
      if (currentSession?.user) {
        setSession({
          name: currentSession.user.name || "None",
          email: currentSession.user.email || "None",
          role:
            typeof currentSession.user.role === "string"
              ? currentSession.user.role
              : "None",
        });
      }
    };

    fetchSession();
  }, []);

  return { session };
};
