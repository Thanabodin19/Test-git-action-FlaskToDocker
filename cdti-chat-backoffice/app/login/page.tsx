"use client";

import { useState, FC, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import * as Yup from "yup";
import YupPassword from "yup-password";
YupPassword(Yup);
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input, Spin } from "antd";
import Image, { ImageLoaderProps } from "next/image";
import AppSubHeader from "../_components/AppSubHeader";
import AppHeader from "../_components/AppHeader";
import AppButton from "../_components/AppButton";

const userLoginSchema = Yup.object().shape({
  email: Yup.string().email().required("Email is required"),
  password: Yup.string().required("Password is required"),
});

interface IFormInput {
  email: string;
  password: string;
}

const LoginPage: FC = () => {
  const [unauthenticated, setUnauthenticated] = useState<string>("");
  const router = useRouter();
  const [loader, setLoader] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(userLoginSchema),
  });

  const onSubmit: SubmitHandler<IFormInput> = useCallback(
    async (data) => {
      try {
        setLoader(true);
        const res = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });
        if (res?.error) {
          setUnauthenticated(res.error);
        }
        if (res?.ok) {
          router.push("/profile");
        }
        setLoader(false);
        return true;
      } catch (error) {
        console.log("error", error);
      }
    },
    [router, unauthenticated]
  );
  const iconLoader = useCallback(
    ({ src, width, quality = 100 }: ImageLoaderProps): string => {
      return `https://persevere.cdti.ac.th/pluginfile.php/1/core_admin/logo/0x200/${src}?w=${width}&q=${quality}`;
    },
    []
  );
  return (
    <main className="relative w-full h-screen flex items-center justify-center bg-[#0a0a0a] p-5">
      <div className="xs:flex sm:hidden flex-col justify-center items-center w-full">
        <Spin spinning={loader} size="large" className="absolute z-20" />
        {loader && (
          <div className="absolute w-full h-full bg-black opacity-70 z-10 rounded-3xl"></div>
        )}
        <AppSubHeader label="CDTI CPE" color="white" />
        <AppHeader
          label="P'YUI-GPT"
          color=" bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent mt-2"
        />
        <form
          className="p-6 w-full max-w-[400px] flex flex-col justify-between items-center gap-2 text-black"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="text-white w-full mt-5">
            <h1 className="text-2xl font-bold">Log In</h1>
            <div className="mt-5">
              <label
                className={`mb-1 text-sm ${
                  unauthenticated === "Email"
                    ? "text-red-700 dark:text-red-500"
                    : "text-white"
                } `}
              >
                Email
              </label>
              <div className="">
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="กรอก email"
                      status={errors.email ? "error" : ""}
                    />
                  )}
                />
                {errors.email?.message && (
                  <p className="error text-sm ml-2">{errors.email?.message}</p>
                )}
              </div>
            </div>
            <div className="mt-5">
              <label
                className={`mb-1 text-sm ${
                  unauthenticated === "Password"
                    ? "text-red-700 dark:text-red-500"
                    : "text-white"
                } `}
              >
                Password
              </label>
              <div className="">
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input.Password
                      {...field}
                      placeholder="กรอก password"
                      status={errors.password ? "error" : ""}
                    />
                  )}
                />
                {errors.password?.message && (
                  <p className="error text-sm ml-2">
                    {errors.password?.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <AppButton
            label={"Login"}
            variant={"secondary"}
            className="mt-10 w-full"
            disabled={loader}
          />
          {unauthenticated && (
            <p className="error">
              {unauthenticated} is invalid, please try again.
            </p>
          )}
        </form>
      </div>
      <div className="xs:hidden sm:flex shadow-lg shadow-main h-[65%] rounded-3xl">
        <div className="flex flex-col justify-center items-center bg-white rounded-l-3xl shadow-lg p-10 h-full">
          <Image
            loader={iconLoader}
            src={"1721268127/Logo%20รอง%20CDTI%20PNG.png"}
            alt={"cdti-logo"}
            width={200}
            height={200}
          />
        </div>
        <div className="relative flex flex-col justify-center items-center bg-tertiary rounded-r-3xl h-full p-10">
          <Spin spinning={loader} size="large" className="absolute z-20" />
          {loader && (
            <div className="absolute w-full h-full bg-black opacity-70 z-10 rounded-3xl"></div>
          )}
          <AppSubHeader label="CDTI CPE" color="white" />
          <AppHeader
            label="P'YUI-GPT"
            color=" bg-gradient-to-r from-main to-secondary bg-clip-text text-transparent mt-2"
          />
          <form
            className="p-6 w-full max-w-[400px] flex flex-col justify-between items-center gap-2 text-black"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="text-white w-full mt-5">
              <h1 className="text-2xl font-bold">Log In</h1>
              <div className="mt-5">
                <label
                  className={`mb-1 text-sm ${
                    unauthenticated === "Email"
                      ? "text-red-700 dark:text-red-500"
                      : "text-white"
                  } `}
                >
                  Email
                </label>
                <div className="">
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="กรอก email"
                        status={errors.email ? "error" : ""}
                      />
                    )}
                  />
                  {errors.email?.message && (
                    <p className="error text-sm ml-2">
                      {errors.email?.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-5">
                <label
                  className={`mb-1 text-sm ${
                    unauthenticated === "Password"
                      ? "text-red-700 dark:text-red-500"
                      : "text-white"
                  } `}
                >
                  Password
                </label>
                <div className="">
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <Input.Password
                        {...field}
                        placeholder="กรอก password"
                        status={errors.password ? "error" : ""}
                      />
                    )}
                  />
                  {errors.password?.message && (
                    <p className="error text-sm ml-2">
                      {errors.password?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <AppButton
              label={"Login"}
              variant={"secondary"}
              className="mt-10 w-full"
              disabled={loader}
            />
            {unauthenticated && (
              <p className="error">
                {unauthenticated} is invalid, please try again.
              </p>
            )}
          </form>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
