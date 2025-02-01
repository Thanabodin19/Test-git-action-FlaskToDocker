"use client";
import Image, { ImageLoaderProps } from "next/image";
import React, { useCallback } from "react";
import { UserOutlined } from "@ant-design/icons";
import { signOut } from "next-auth/react";
import AppSubHeader from "../AppSubHeader";

const AppNavBar = () => {
  const handleSignOut = useCallback(async () => {
    await signOut({
      callbackUrl: "/",
    });
  }, []);
  return (
    <header>
      <nav className="flex justify-between items-center py-5 px-10">
        <AppSubHeader label={"CDTI P'YUI-GPT"} color="white" />
        <div className="flex justify-center items-center space-x-3">
          <button
            className="flex justify-center items-center space-x-2 bg-white rounded-full p-3 transition-all duration-300 hover:shadow-sm hover:shadow-main"
            onClick={() => handleSignOut()}
          >
            <UserOutlined className="text-xl" />
            <p className="text-sm">Logout</p>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default AppNavBar;
