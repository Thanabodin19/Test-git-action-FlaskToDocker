"use client";

import React, { useCallback, useEffect, useState } from "react";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  ConfigProvider,
  Radio,
  Spin,
  Upload,
  message,
  notification,
} from "antd";
import type { UploadProps } from "antd/es/upload/interface";
import "@ant-design/v5-patch-for-react-19";
import JSZip, { folder } from "jszip";
const { Dragger } = Upload;
import * as Yup from "yup";
import YupPassword from "yup-password";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import useSWR from "swr";
import { fetcher } from "@/utils/fetchers/db_fetcher";
import { FoldersData } from "@/utils/type";
import { doc_directories } from "@/utils/const";
YupPassword(Yup);
import dayjs from "dayjs";

interface AppFileUploaderProps {
  uploadUrl: string;
}

interface IFormInput {
  folder: string;
}

const userSignupSchema = Yup.object().shape({
  folder: Yup.string().required("Folder destination is required"),
});

const AppFileUploader = ({ uploadUrl }: AppFileUploaderProps) => {
  const [fileList, setFileList] = useState<any[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInput>({
    resolver: yupResolver(userSignupSchema),
  });

  const handleUpload: SubmitHandler<IFormInput> = useCallback(
    async (data) => {
      const formData = new FormData();

      const logData = {
        file_name: fileList[0].name,
        folder: data.folder,
        content: {
          topic: "It's a file",
          header: "It's a file",
          desc: "It's a file",
          startDate: dayjs().format("YYYY-MM-DD"),
          endDate: dayjs().format("YYYY-MM-DD"),
        },
      };

      if (fileList.length === 0) {
        message.warning("โปรดเพิ่มไฟล์ก่อนอัปโหลด");
        return;
      }

      if (fileList.length === 1) {
        const file = fileList[0];
        formData.append("file", file);
        try {
          const log_res = await fetch(`/api/db/docs/log`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(logData),
          });

          if (!log_res.ok) {
            notification.error({
              message: "โฟล์เดอร์นี้เคยมีการเพิ่มไฟล์แล้ว",
              description: `โปรดลบไฟล์หรือทำการแก้ไขไฟล์เก่าก่อน`,
            });
            return false;
          }

          const [bucket_res] = await Promise.all([
            fetch(
              `${uploadUrl}/upload?bucket_name=cdti-policies&folder=${data.folder}`,
              {
                method: "POST",
                body: formData,
              }
            ),
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

          if (!bucket_res.ok) {
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
          setFileList([]);
          reset();
        } catch (err) {
          console.error(err);
          notification.error({
            message: "Something went wrong",
            description: "การเพิ่มไฟล์ผิดพลาด",
          });
        }
      }
    },
    [fileList, uploadUrl, setFileList]
  );

  const uploadProps: UploadProps = {
    fileList,
    accept: ".doc,.docx,.pdf",
    multiple: false,
    maxCount: 1,
    beforeUpload: (file) => {
      if (fileList.length >= 1) {
        message.warning("คุณสามารถเพิ่มได้เพียงไฟล์เดียวเท่านั้น");
        return false;
      }
      setFileList([file]);
      return false;
    },
    onRemove: (file) => {
      setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
    },
  };

  return (
    <div className="mt-5 bg-white p-6 rounded-md border w-full">
      <ConfigProvider>
        <form onSubmit={handleSubmit(handleUpload)}>
          <Dragger {...uploadProps} className="mb-4">
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">ลากหรือคลิ๊ก เพื่อเพิ่มไฟล์</p>
            <p className="ant-upload-hint">
              คุณสามารถเพิ่มได้หลายไฟล์ และอัปโหลดพร้อมกันได้
            </p>
          </Dragger>
          {doc_directories ? (
            <div className="mt-10 space-y-3">
              <p>Folder ที่จะจัดเก็บ </p>
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
                <p className="error text-sm ml-2">{errors?.folder?.message}</p>
              )}
            </div>
          ) : (
            <p className="error mt-10">Folder ที่จะจัดเก็บมีความผิดพลาด</p>
          )}
          <Button
            type="primary"
            icon={<UploadOutlined />}
            // onClick={() => handleUpload}
            disabled={fileList.length === 0}
            className="mt-10 w-full"
            htmlType="submit"
          >
            อัปโหลด
          </Button>
        </form>
      </ConfigProvider>
    </div>
  );
};

export default AppFileUploader;
