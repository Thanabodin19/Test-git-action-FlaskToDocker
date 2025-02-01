"use client";
import { UserOutlined } from "@ant-design/icons";
import React, { FC } from "react";
import AppHeader from "./AppHeader";
import { SessionData } from "@/utils/type";
import { Capitalized } from "@/utils/text";

const AppProfile: FC<{ session: SessionData }> = ({ session }) => {
  return (
    <div className="bg-white p-6 rounded-md shadow-md w-full mt-5">
      <div className="flex justify-between items-center">
        <div className="flex justify-between items-center space-x-5">
          <UserOutlined className="text-[50px]" />
          <div className="">
            <AppHeader label={session?.name} color={"tertiary"} />
            <p>Email: {session?.email}</p>
          </div>
        </div>
        <div
          className={`px-5 py-2 border ${
            session.role === "admin"
              ? "bg-green-400 text-white "
              : "bg-secondary text-tertiary"
          } rounded-xl w-fit`}
        >
          {Capitalized(session?.role)}
        </div>
      </div>
    </div>
  );
};

export default AppProfile;
