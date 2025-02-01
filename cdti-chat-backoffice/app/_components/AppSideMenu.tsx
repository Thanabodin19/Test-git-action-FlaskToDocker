"use client";

import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import AppSubHeader from "./AppSubHeader";
import Image, { ImageLoaderProps } from "next/image";
import {
  CloudUploadOutlined,
  InfoCircleOutlined,
  ProfileOutlined,
  SearchOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";
import AppButton from "./AppButton";
import { signOut, useSession } from "next-auth/react";
import { useFetchSession } from "@/utils/hooks/usefetchSession";
import { userPermissions } from "@/utils/rbac";

type MenuItem = Required<MenuProps>["items"][number];

const menuList: MenuItem[] = [
  {
    key: "user-management",
    icon: <ProfileOutlined />,
    label: "การจัดการ user",
    children: [
      { key: "profile", icon: <UserOutlined />, label: "โปรไฟล์" },
      {
        key: "users-group",
        icon: <UsergroupAddOutlined />,
        label: "กลุ่ม users",
      },
      {
        key: "roleInfo",
        icon: <InfoCircleOutlined />,
        label: "รายละเอียดของ roles",
      },
    ],
  },
  {
    key: "upload-documents",
    icon: <CloudUploadOutlined />,
    label: "อัปโหลดเอกสารให้ ChatBot",
  },
  {
    key: "search-docs",
    icon: <SearchOutlined />,
    label: "ค้นหาเอกสาร",
  },
];

interface LevelKeysProps {
  key?: string;
  children?: LevelKeysProps[];
}

const getLevelKeys = (items1: LevelKeysProps[]) => {
  const key: Record<string, number> = {};
  const func = (items2: LevelKeysProps[], level = 1) => {
    items2.forEach((item) => {
      if (item.key) {
        key[item.key] = level;
      }
      if (item.children) {
        func(item.children, level + 1);
      }
    });
  };
  func(items1);
  return key;
};

const levelKeys = getLevelKeys(menuList as LevelKeysProps[]);

// Component
const AppSideMenu: FC = () => {
  const { session } = useFetchSession();
  const router = useRouter();
  const pathName = usePathname();
  const iconLoader = useCallback(
    ({ src, width, quality = 100 }: ImageLoaderProps): string => {
      return `https://persevere.cdti.ac.th/pluginfile.php/1/core_admin/logo/0x200/${src}?w=${width}&q=${quality}`;
    },
    []
  );
  const [stateOpenKeys, setStateOpenKeys] = useState(["1", "11"]);
  const [currentKey, setCurrentKey] = useState<string>("");

  useEffect(() => {
    setCurrentKey(pathName.slice(1));
  }, [currentKey, pathName]);

  const onOpenChange: MenuProps["onOpenChange"] = (openKeys) => {
    const currentOpenKey = openKeys.find(
      (key) => stateOpenKeys.indexOf(key) === -1
    );
    // open
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);

      setStateOpenKeys(
        openKeys
          // remove repeat key
          .filter((_, index) => index !== repeatIndex)
          // remove current level all child
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey])
      );
    } else {
      // close
      setStateOpenKeys(openKeys);
    }
  };

  const handleMenu: MenuProps["onClick"] = useCallback((e: any) => {
    if (e.key !== "user-management") router.push(`/${e.key}`);
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut({
      callbackUrl: "/",
    });
  }, []);

  const filteredMenuList = useMemo(() => {
    return menuList
      .map((menu: any) => {
        const role = session?.role as keyof typeof userPermissions;
        const permissions = userPermissions[role] || [];
        if (
          menu.key === "upload-documents" &&
          !permissions.includes("create:docs")
        ) {
          return false;
        }
        return menu;
      })
      .filter(Boolean);
  }, [session]);

  return (
    <aside className="w-[25%] h-screen bg-wite shadow-xl flex flex-col justify-between items-center">
      <section className="w-full">
        <div className="flex flex-wrap justify-center items-center space-x-4 mt-8">
          <Image
            loader={iconLoader}
            src={"1721268127/Logo%20รอง%20CDTI%20PNG.png"}
            alt={"cdti-logo"}
            width={70}
            height={70}
          />
          <div className="">
            <AppSubHeader label="P'YUI-GPT" color={"tertiary"} />
            <AppSubHeader label="BackOffice" color={"tertiary"} />
          </div>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[currentKey]}
          // defaultSelectedKeys={["profile"]}
          openKeys={stateOpenKeys}
          onOpenChange={onOpenChange}
          onClick={handleMenu}
          items={filteredMenuList}
          className="mt-10 space-y-5 w-full"
        />
      </section>
      <AppButton
        label={"Logout"}
        className="w-[90%] mb-8"
        onClick={() => handleSignOut()}
      />
    </aside>
  );
};

export default AppSideMenu;
