"use client";

import React, { FC, useCallback, useState } from "react";
import AppSubHeader from "./AppSubHeader";
import { Input, Radio } from "antd";
import "@ant-design/v5-patch-for-react-19";
import AppButton from "./AppButton";
import * as Yup from "yup";
import YupPassword from "yup-password";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
YupPassword(Yup);

interface IFormInput {
  name: string;
  email: string;
  password: string;
  role?: string;
}

const userSignupSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email().required("Email is required"),
  password: Yup.string().password().required("Password is required"),
  role: Yup.string(),
});

const AppAddUser: FC = () => {
  const [addSuccessfully, setAddSuccessfully] = useState<boolean>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(userSignupSchema),
  });

  const onSubmit: SubmitHandler<IFormInput> = useCallback(async (data) => {
    console.log(data);
    await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then(() => {
        setAddSuccessfully(true);
        setTimeout(() => {
          setAddSuccessfully(false);
        }, 2000);
      })
      .catch((error) => error);
  }, []);

  return (
    <section className="z-0 relative bg-white p-6 rounded-md border w-full mt-10">
      <div className="absolute -top-4 bg-white px-2">
        <AppSubHeader label="เพิ่ม User" color={"tertiary"} />
      </div>
      <div className="w-1/2 px-2">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  addonBefore={<p>Username</p>}
                  placeholder="กรอก username"
                  status={errors.name ? "error" : ""}
                />
              )}
            />
            {errors.name?.message && (
              <p className="error text-sm ml-2">{errors.name?.message}</p>
            )}
          </div>
          <div className="">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  addonBefore={<p>Email</p>}
                  placeholder="กรอก email"
                  status={errors.email ? "error" : ""}
                />
              )}
            />
            {errors.email?.message && (
              <p className="error text-sm ml-2">{errors.email?.message}</p>
            )}
          </div>
          <div className="">
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  addonBefore={<p>Password</p>}
                  placeholder="กรอก password"
                  status={errors.password ? "error" : ""}
                />
              )}
            />
            {errors.password?.message && (
              <p className="error text-sm ml-2">{errors.password?.message}</p>
            )}
          </div>

          <div className="flex flex-wrap justify-start items-start ">
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Radio.Group {...field} defaultValue={"viewer"}>
                  <Radio value="admin">Admin</Radio>
                  <Radio value="viewer">Viewer</Radio>
                  <Radio value="user">User</Radio>
                </Radio.Group>
              )}
            />
            <p className="text-sm text-gray-400 italic">
              // default ของ role คือ Viewer
            </p>
          </div>
          <AppButton label="Submit" />
        </form>
      </div>
    </section>
  );
};

export default AppAddUser;
