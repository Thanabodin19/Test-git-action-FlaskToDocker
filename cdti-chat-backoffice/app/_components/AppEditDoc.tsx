"use client";
import React, { FC, useCallback, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input, DatePicker, notification, ConfigProvider, Button } from "antd";
const { RangePicker } = DatePicker;
import dayjs from "dayjs";
import { DocData } from "@/utils/type";
import { fetcher } from "@/utils/fetchers/db_fetcher";
import useSWR from "swr";
import AppLoading from "./AppLoading";
import "@ant-design/v5-patch-for-react-19";
import AppHeader from "./AppHeader";
import AppSubHeader from "./AppSubHeader";
import { useRouter } from "next/navigation";

interface IFormInput {
  topic: string;
  header: string;
  desc: string;
  date: any;
}

const docFormSchema = Yup.object().shape({
  topic: Yup.string().required("Topic is required"),
  header: Yup.string().required("Header is required"),
  desc: Yup.string().required("Description is required"),
  date: Yup.array()
    .of(Yup.date().required("Both start and end dates are required"))
    .required("Date range is required")
    .min(2, "Both start and end dates are required"),
});
interface AppEditDocProps {
  id: string;
}

const AppEditDoc: FC<AppEditDocProps> = ({ id }) => {
  const router = useRouter();
  const [currentFolder, setCurrentFolder] = useState<string>("");
  const {
    data: doc,
    error,
    isLoading,
  } = useSWR<DocData>(`/api/db/docs/log/${id}`, fetcher);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<IFormInput>({
    mode: "onBlur",
    resolver: yupResolver(docFormSchema),
  });

  useEffect(() => {
    if (doc) {
      setValue("topic", doc.data.topic);
      setValue("header", doc.data.header);
      setValue("desc", doc.data.desc);
      setValue("date", [dayjs(doc.data.startDate), dayjs(doc.data.endDate)]);
      setCurrentFolder(doc.data.folder);
    }
  }, [doc]);

  const onDelete = useCallback(async () => {
    try {
      const [log_res, bucket_res] = await Promise.all([
        fetch(`/api/db/docs/log/${id}`, {
          method: "DELETE",
        }),
        fetch(
          `http://localhost:80/minio/all?bucket_name=cdti-policies&folder=${doc?.data.folder}&filename=${doc?.data.filename}`,
          {
            method: "DELETE",
          }
        ),
      ]);

      if (log_res.ok || bucket_res.ok) {
        notification.success({
          message: "",
          description: "ลบไฟล์เสร็จสิ้น",
        });
        setTimeout(() => {
          router.back();
        }, 2000);
      } else {
        notification.error({
          message: "ลบไฟล์ผิดพลาด",
          description: `Something went wrong`,
        });
      }
    } catch (err) {
      console.error(err);
      notification.error({
        message: "Submission Failed",
        description: "An error occurred while submitting the form.",
      });
    }
  }, [doc]);

  const onSubmit: SubmitHandler<IFormInput> = useCallback(
    async (data) => {
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

      try {
        const response = await fetch(
          `http://localhost:80/md/create?&folder=${doc?.data.folder}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyData),
          }
        );

        const resDoc = await fetch(`/api/db/docs/log/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        });

        const res = await fetch(`/api/triggerDag`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dag_id: `${doc?.data.folder}_producer`,
          }),
        });

        if (response.ok) {
          notification.success({
            message: "",
            description: "แก้ไขไฟล์เสร็จสิ้น",
          });
          setTimeout(() => {
            router.back();
          }, 2000);
        } else {
          notification.error({
            message: "การแก้ไขผิดพลาด",
            description: `Error: ${response.statusText}`,
          });
        }
      } catch (err) {
        console.error(err);
        notification.error({
          message: "Submission Failed",
          description: "An error occurred while submitting the form.",
        });
      }
    },
    [doc]
  );

  if (isLoading) {
    return <AppLoading />;
  }

  return (
    <section>
      <div className="mt-10">
        <AppHeader label={"การแก้ไขเอกสาร"} color={"tertiary"} />
      </div>
      <div className="p-6 rounded-md bg-white border shadow-lg w-full mt-5 space-y-2">
        <div className="flex justify-between items-center space-x-5">
          <p>โฟลเดอร์: </p>
          <AppSubHeader label={doc?.data.folder ?? ""} />
        </div>
        <div className="flex justify-between items-center space-x-5">
          <p>ชื่อไฟล์: </p>
          <AppSubHeader label={doc?.data.filename ?? ""} />
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ConfigProvider>
          <div className="bg-white p-6 rounded-md border w-full mt-5 space-y-7">
            {["student_activities", "academic_calendar"].includes(
              currentFolder
            ) && (
              <>
                <p className="-mb-5">เวลาของกำหนดการ</p>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <RangePicker
                      {...field}
                      placeholder={[
                        "วันเริ่มต้นกำหนดการ",
                        "วันสิ้นสุดกำหนดการ",
                      ]}
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
                      className="h-[300px]"
                    />
                  )}
                />
                {errors.desc?.message && (
                  <p className="error text-sm ml-2">{errors.desc.message}</p>
                )}
              </>
            )}
            <div className="space-x-2">
              <Button
                type="primary"
                variant="solid"
                onClick={() => onDelete()}
                className="px-8 py-3 bg-red-600"
              >
                ลบไฟล์
              </Button>
              {["student_activities", "academic_calendar"].includes(
                doc?.data.folder ?? "none"
              ) && (
                <Button
                  type="primary"
                  variant="solid"
                  disabled={!isDirty}
                  htmlType="submit"
                  className="px-8 py-3"
                >
                  ยืนยัน
                </Button>
              )}
            </div>
          </div>
        </ConfigProvider>
      </form>
    </section>
  );
};

export default AppEditDoc;
