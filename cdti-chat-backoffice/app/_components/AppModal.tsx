"use client";
import React, { FC } from "react";
import AppButton from "./AppButton";

interface AppModalProps {
  message: string;
  cancleAction: () => void;
  acceptAction: () => void;
}

const AppModal: FC<AppModalProps> = ({
  message,
  cancleAction,
  acceptAction,
}) => {
  return (
    <section className="absolute z-30 top-0 left-0 w-full h-screen flex justify-center items-center bg-black bg-opacity-80">
      <div className="bg-white bg-opacity-100 rounded-xl flex flex-col justify-center items-center space-y-2 p-10">
        <h1 className="mb-5 text-2xl font-bold">{message}</h1>
        <div className="flex justify-center items-center space-x-5 w-full text-xl">
          <AppButton
            label={"ยกเลิก"}
            variant={"ghost"}
            className="w-full"
            onClick={cancleAction}
          />
          <AppButton
            label={"ใช่"}
            variant={"delete"}
            className="w-full"
            onClick={acceptAction}
          />
        </div>
      </div>
    </section>
  );
};

export default AppModal;
