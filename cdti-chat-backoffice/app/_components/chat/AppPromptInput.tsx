"use client";
import { PromptInput } from "@/utils/type";
import { ArrowUpOutlined } from "@ant-design/icons";
import { Button, Input, Space } from "antd";
import React, { FC } from "react";
import {
  Control,
  Controller,
  SubmitHandler,
  useForm,
  UseFormHandleSubmit,
} from "react-hook-form";

interface AppPromptInputProps {
  onSubmit: SubmitHandler<PromptInput>;
  control: Control<PromptInput>;
  handleSubmit: UseFormHandleSubmit<PromptInput>;
}

const AppPromptInput: FC<AppPromptInputProps> = ({
  onSubmit,
  control,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="prompt"
        control={control}
        render={({ field }) => (
          <Space.Compact style={{ width: "100%" }}>
            <Input
              {...field}
              placeholder="ถามอะไรก็ได้เกี่ยวกับคณะเทคโนโลยีดิจิทัล..."
              size="large"
              className="bg-gray-700 border-0 pl-5 rounded-full hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-700 text-gray-100 placeholder:text-gray-400"
            />
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              className="bg-gray-700 p-5 h-full rounded-r-full hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-700"
            >
              <ArrowUpOutlined className="" />
            </Button>
          </Space.Compact>
        )}
      />
    </form>
  );
};

export default AppPromptInput;
