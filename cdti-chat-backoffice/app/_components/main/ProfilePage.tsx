"use client";

import AppAddUser from "@/app/_components/AppAddUser";
import AppHeader from "@/app/_components/AppHeader";
import AppProfile from "@/app/_components/AppProfile";
import { useFetchSession } from "@/utils/hooks/usefetchSession";
import { usePermission } from "@/utils/hooks/usePermission";
import { userPermissions } from "@/utils/rbac";
import { BasePageProps } from "@/utils/type";
import { Spin } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FC, useCallback, useEffect, useState } from "react";
import AppModal from "../AppModal";

const ProfilePage: FC = () => {
  const { session } = useFetchSession();
  const { permissions } = usePermission(session);
  const { data, status } = useSession();
  // const [session, setSession] = useState<SessionData>();
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [status, router]);

  if (status === "loading" || loading)
    return (
      <div className="flex max-w-full h-screen items-start justify-center">
        <Spin />
      </div>
    );

  return (
    status === "authenticated" &&
    session?.role && (
      <section className="flex flex-col max-w-full h-screen items-start justify-start text-black">
        <div className="mt-10">
          <AppHeader label={"การจัดการ user"} color={"tertiary"} />
        </div>
        <AppProfile session={session} />
        {permissions.includes("create:user") && <AppAddUser />}
      </section>
    )
  );
};

export default ProfilePage;
