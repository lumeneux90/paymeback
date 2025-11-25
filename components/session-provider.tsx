"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getSession } from "@/lib/auth";
import { Session } from "@/lib/types";

const SessionContext = createContext<Session>(null);

export function useSession() {
  return useContext(SessionContext);
}

export function SessionProvider({ children }) {
  const [session, setSession] = useState<Session>(null);

  useEffect(() => {
    const s = getSession();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSession(s);
  }, []);

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}
