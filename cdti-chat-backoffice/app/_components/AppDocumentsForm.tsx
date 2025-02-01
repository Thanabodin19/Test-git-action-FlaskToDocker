"use client";
import React, { useCallback } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";
import YupPassword from "yup-password";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Input,
  DatePicker,
  notification,
  ConfigProvider,
  Radio,
  Button,
} from "antd";
YupPassword(Yup);
const { RangePicker } = DatePicker;
import dayjs from "dayjs";
import { doc_directories } from "@/utils/const";

interface IFormInput {
  topic: string;
  header: string;
  desc: string;
  date: any;
  file_name: string;
  folder: string;
}

const docFormSchema = Yup.object().shape({
  topic: Yup.string().required("Topic is required"),
  header: Yup.string().required("Header is required"),
  desc: Yup.string().required("Description is required"),
  date: Yup.array()
    .of(Yup.date().required("Both start and end dates are required"))
    .required("Date range is required")
    .min(2, "Both start and end dates are required"),
  file_name: Yup.string().required("File name is required"),
  folder: Yup.string().required("Folder destination is required"),
});

const AppDocumentsForm = () => {
  // const {
  //   data: folders,
  //   error,
  //   isLoading,
  // } = useSWR<FoldersData>("http://localhost:80/minio/list-folders", fetcher);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<IFormInput>({
    resolver: yupResolver(docFormSchema),
  });

  const onSubmit: SubmitHandler<IFormInput> = useCallback(async (data) => {
    const formattedDates = data.date
      ? data.date.map((date: string) =>
          String(dayjs(date).format("YYYY-MM-DD"))
        )
      : [];
    const formattedData = {
      topic: data.topic,
      header: data.header,
      desc: data.desc,
      startDate: dayjs(formattedDates[0]).format("YYYY-MM-DD"),
      endDate: dayjs(formattedDates[1]).format("YYYY-MM-DD"),
    };
    const bodyData = {
      content: formattedData,
    };
    const bodyDocData = {
      file_name: data.file_name + ".md",
      folder: data.folder,
      content: formattedData,
    };

    try {
      const log_doc = await fetch(`/api/db/docs/log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyDocData),
      });

      if (!log_doc.ok) {
        notification.error({
          message: "โฟล์เดอร์นี้เคยมีการเพิ่มไฟล์แล้ว",
          description: `โปรดลบไฟล์หรือทำการแก้ไขไฟล์เก่าก่อน`,
        });
        return false;
      }

      const [bucket_res, triggerDag_res] = await Promise.all([
        fetch(`http://localhost:80/md/create?&folder=${data.folder}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        }),
        fetch(`/api/triggerDag`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dag_id: `${data.folder}_producer`,
          }),
        }),
      ]);

      if (!bucket_res.ok || !triggerDag_res.ok) {
        notification.error({
          message: "Something went wrong",
          description: `อัปโหลดไฟล์ไม่สำเร็จ`,
        });
        return false;
      }
      notification.success({
        message: "",
        description: "อัปโหลดไฟล์เสร็จสิ้น",
      });
      reset();
    } catch (err) {
      console.error(err);
      notification.error({
        message: "Something went wrong",
        description: "การเพิ่มไฟล์ผิดพลาด",
      });
    }
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ConfigProvider>
          <div className="bg-white p-6 rounded-md border w-full mt-5 space-y-7">
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <RangePicker
                  {...field}
                  placeholder={["วันเริ่มต้นกำหนดการ", "วันสิ้นสุดกำหนดการ"]}
                  onChange={(dates) => {
                    field.onChange(dates);
                  }}
                  status={errors.date ? "error" : ""}
                />
              )}
            />
            {errors.date?.message && (
              <p className="error text-sm ml-2">
                {typeof errors.date.message === "string"
                  ? errors.date.message
                  : String(errors.date.message)}
              </p>
            )}
            <Controller
              name="topic"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  addonBefore={<p>หัวเรื่อง</p>}
                  placeholder="กรอกหัวเรื่อง"
                  status={errors.topic ? "error" : ""}
                />
              )}
            />
            {errors.topic?.message && (
              <p className="error text-sm ml-2">{errors.topic.message}</p>
            )}
            <Controller
              name="header"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  addonBefore={<p>หัวข้อ</p>}
                  placeholder="กรอกหัวข้อ"
                  status={errors.header ? "error" : ""}
                />
              )}
            />
            {errors.header?.message && (
              <p className="error text-sm ml-2">{errors.header.message}</p>
            )}
            <Controller
              name="desc"
              control={control}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  placeholder="กรอกเนื้อหา"
                  className="h-52"
                  rows={10}
                />
              )}
            />
            {errors.desc?.message && (
              <p className="error text-sm ml-2">{errors.desc.message}</p>
            )}
          </div>
          <div className="bg-white p-6 rounded-md border w-full mt-5 space-y-7">
            <div className="">
              <Controller
                name="file_name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    addonBefore={<p>ชื่อไฟล์</p>}
                    placeholder="กรอกชื่อไฟล์"
                    status={errors.file_name ? "error" : ""}
                  />
                )}
              />
              {errors.file_name?.message && (
                <p className="error text-sm ml-2">{errors.file_name.message}</p>
              )}
            </div>
            {doc_directories ? (
              <div className="mt-0 space-y-3">
                <p>Folder ที่จะจัดเก็บ</p>
                <Controller
                  name="folder"
                  control={control}
                  render={({ field }) => (
                    <Radio.Group {...field}>
                      {doc_directories.map((ele, idx) => (
                        <Radio checked={true} value={ele.key} key={idx}>
                          {ele.name}
                        </Radio>
                      ))}
                    </Radio.Group>
                  )}
                />
                {errors?.folder?.message && (
                  <p className="error text-sm ml-2">
                    {errors?.folder?.message}
                  </p>
                )}
              </div>
            ) : (
              <p className="error mt-10">Folder ที่จะจัดเก็บมีความผิดพลาด</p>
            )}
            <Button
              type="primary"
              variant="solid"
              disabled={!isDirty}
              htmlType="submit"
              className="px-8 py-2"
            >
              Submit
            </Button>
          </div>
        </ConfigProvider>
      </form>
    </>
  );
};

export default AppDocumentsForm;
