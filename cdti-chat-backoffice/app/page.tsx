"use client";

import { useState, FC, useCallback } from "react";
import { useRouter } from "next/navigation";
import AppButton from "./_components/AppButton";
import AppHeader from "./_components/AppHeader";
import AppSubHeader from "./_components/AppSubHeader";
import Image, { ImageLoaderProps } from "next/image";
import Wave from "@/app/assets/wave.png";
import Robot from "@/app/assets/robot.png";
import { TypeAnimation } from "react-type-animation";

const iconLoader = ({
  src,
  width,
  quality = 100,
}: ImageLoaderProps): string => {
  return `https://persevere.cdti.ac.th/pluginfile.php/1/core_admin/logo/0x200/${src}?w=${width}&q=${quality}`;
};

const LandingPage: FC = () => {
  const router = useRouter();
  const handleLogin = useCallback(() => {
    router.push("/login");
  }, []);
  return (
    <>
      <main className="flex flex-wrap-reverse justify-evenly items-center lg:space-x-0 h-screen w-full bg-[#0a0a0a] p-5 overflow-hidden relative">
        <Image
          src={Wave}
          alt={"wave-bg"}
          width={950}
          height={950}
          className="absolute z-0 top-0 left-0 opacity-10 animate-spin-slow"
          quality={100}
        />
        <div className="relative flex-col justify-center items-center xs:hidden xl:flex">
          <div className="">
            <Image
              src={Robot}
              alt={"robot"}
              width={500}
              height={500}
              className="bot z-20"
              quality={100}
            />
          </div>
          <div className="absolute bottom-0 left-0 bg-[#2c2937] self-start z-20 px-5 py-3 rounded-lg text-white text-lg flex justify-center items-center space-x-3">
            <TypeAnimation
              sequence={[
                ": กิจกรรม Assambly มีอะไรบ้างครับ",
                2000,

                ": ถ้าติด I ต้องทำอย่างไรบ้างครับ",
                2000,

                ": อยากทราบหลักสูตรทั้งหมดของคณะเทคโนโลยีดิจิทัลค่ะ",
                2000,

                ": วิศวะคอม เรียนอะไรบ้างคะ",
                2000,
              ]}
              wrapper="span"
              repeat={Infinity}
              cursor={true}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
        <div className="z-10">
          <div className="">
            <Image
              loader={iconLoader}
              src={"1721268127/Logo%20รอง%20CDTI%20PNG.png"}
              alt={"cdti-logo"}
              width={70}
              height={70}
              className="self-end mr-14"
            />
            <h1 className="text-8xl mt-3 mb-5 font-bold bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent">
              P'YUI-GPT
            </h1>
            <AppHeader
              label={"ผู้ช่วย AI ที่พร้อมตอบคำถามของทุกคน"}
              color="white"
            />
            <div className="mb-3"></div>
            <AppSubHeader
              label={"ประจำคณะเทคโนโลยีดิจิทัล สถาบันเทคโนโลยีจิตรลดา"}
              color="white"
            />
            <div className="mt-10">
              <AppButton
                label={"เริ่มกันเลย"}
                variant={"secondary"}
                onClick={handleLogin}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default LandingPage;
