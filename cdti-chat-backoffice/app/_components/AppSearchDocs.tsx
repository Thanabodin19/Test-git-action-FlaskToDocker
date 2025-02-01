"use client";
import React, { useCallback, useState, useEffect } from "react";
import AppHeader from "./AppHeader";
import {
  Controller,
  FieldError,
  FieldValue,
  RegisterOptions,
  SubmitHandler,
  useForm,
} from "react-hook-form";

import { Input, Spin } from "antd";
import { BookOutlined, SearchOutlined } from "@ant-design/icons";
import useSWR from "swr";
import { fetcher } from "@/utils/fetchers/db_fetcher";
import { Doc, DocsData } from "@/utils/type";
import AppSubHeader from "./AppSubHeader";
import AppButton from "./AppButton";
import { debounce } from "lodash";
import { useFetchSession } from "@/utils/hooks/usefetchSession";
import { usePermission } from "@/utils/hooks/usePermission";
import { useRouter } from "next/navigation";
import AppLoading from "./AppLoading";

interface IFormInput {
  search: string;
}

const AppSearchDocs = () => {
  const { control, handleSubmit, watch } = useForm<IFormInput>();
  const [searchValue, setSearhValue] = useState<string>("");

  const {
    data: docs,
    error,
    isLoading,
  } = useSWR<DocsData>("/api/db/docs/log", fetcher);

  const onSubmit: SubmitHandler<IFormInput> = useCallback((data) => {
    setSearhValue(data.search);
  }, []);

  return (
    <section>
      <div className="mt-10">
        <AppHeader label={"ค้นหาเอกสาร"} color={"tertiary"} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
        <Controller
          name="search"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="ชื่อเอกสาร"
              prefix={<SearchOutlined />}
              size="large"
            />
          )}
        />
      </form>
      {isLoading ? (
        <AppLoading />
      ) : (
        <>
          {docs?.data.length !== 0 ? (
            <>
              {docs?.data.map((ele, idx) => (
                <DocumentBlock
                  key={idx}
                  _id={ele._id}
                  filename={ele.filename}
                  folder={ele.folder}
                  topic={ele.topic}
                  header={ele.header}
                  startDate={ele.startDate}
                  endDate={ele.endDate}
                  desc={ele.desc}
                  hidden={ele.filename.includes(searchValue)}
                />
              ))}
            </>
          ) : (
            <p className="text-gray-400 mt-5">ยังไม่มีเอกสารในตอนนี้</p>
          )}
        </>
      )}
    </section>
  );
};

export default AppSearchDocs;

const DocumentBlock = ({
  filename,
  folder,
  startDate,
  endDate,
  hidden,
  _id,
}: Doc & { hidden: boolean }) => {
  const { session } = useFetchSession();
  const { permissions } = usePermission(session);
  const router = useRouter();
  return (
    <div
      className={`w-full mt-5 shadow-md rounded-lg p-10 flex justify-between items-center ${
        !hidden && "hidden"
      }`}
    >
      <div className="flex justify-center items-center space-x-5">
        <BookOutlined className="text-3xl" />
        <div className="">
          <AppSubHeader label={filename} />
          <p className="font-bold">
            <span className="font-normal">folder:</span> {folder}
          </p>
          <p className="text-gray-400">
            {startDate === endDate
              ? `สร้างเมื่อ: ${startDate}`
              : `ระยะเวลา: ${startDate} ถึง ${endDate}`}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap justify-end items-center space-x-2">
        {permissions.includes("edit:docs") && (
          <>
            <AppButton
              label={"แก้ไข"}
              className="mt-10 w-fit"
              variant={"dark"}
              onClick={() => {
                router.push(`/edit-doc/${_id}`);
              }}
            />
          </>
        )}
        <AppButton label={"ดาวน์โหลด"} className="mt-10 w-fit" />
      </div>
    </div>
  );
};
