import { useMemo } from "react";
import { userPermissions } from "../rbac";
import { SessionData } from "../type";

export const usePermission = (session: SessionData | undefined) => {
  const permissions = useMemo(() => {
    return userPermissions[session?.role as keyof typeof userPermissions] || [];
  }, [session]);

  return {
    permissions,
  };
};
