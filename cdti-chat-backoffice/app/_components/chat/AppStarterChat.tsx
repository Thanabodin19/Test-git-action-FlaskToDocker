"use client";
import { ArrowUpOutlined } from "@ant-design/icons";
import { App, Button, ConfigProvider, Input, Space } from "antd";
import Image, { ImageLoaderProps } from "next/image";
import Link from "next/link";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import "@ant-design/v5-patch-for-react-19";
import AppPromptInput from "./AppPromptInput";
import { PromptInput } from "@/utils/type";

const iconLoader = ({
  src,
  width,
  quality = 100,
}: ImageLoaderProps): string => {
  return `https://persevere.cdti.ac.th/pluginfile.php/1/core_admin/logo/0x200/${src}?w=${width}&q=${quality}`;
};

const AppStarterChat = () => {
  const { control, handleSubmit, setValue } = useForm<PromptInput>();

  const onSubmit: SubmitHandler<PromptInput> = useCallback((data) => {
    if (data.prompt) {
      console.log(data.prompt);
      setValue("prompt", "");
    }
  }, []);

  return (
    <ConfigProvider>
      <section className="h-full w-full bg-tertiary flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <Image
            loader={iconLoader}
            src={"1721268127/Logo%20รอง%20CDTI%20PNG.png"}
            alt={"cdti-logo"}
            width={70}
            height={70}
            className="opacity-60 animate-bounce"
          />
          <h1 className="opacity-60 text-8xl mt-3 mb-5 font-bold bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent">
            P'YUI-GPT
          </h1>
          <div className="flex justify-center items-center mt-7 px-10">
            <HintContainer hint={"กิจกรรม Assambly มีอะไรบ้างครับ"} />
            <HintContainer hint={"อยากทราบหลักสูตรทั้งหมดของคณะ"} />
            <HintContainer hint={"ถ้าติด I ต้องทำอย่างไรบ้างครับ"} />
          </div>
        </div>
        <div className="w-[70%] mt-28 justify-self-end">
          <AppPromptInput
            onSubmit={onSubmit}
            control={control}
            handleSubmit={handleSubmit}
          />
        </div>
      </section>
    </ConfigProvider>
  );
};

export default AppStarterChat;

interface HintContainerProps {
  hint: string;
}
const HintContainer: FC<HintContainerProps> = ({ hint }) => {
  return (
    <Link
      href={"/"}
      className="text-white border border-gray-500 p-4 rounded-xl m-2 hover:bg-white hover:text-tertiary hover:rounded-lg transition-all duration-300"
    >
      {hint}
    </Link>
  );
};
