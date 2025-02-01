"use client";
import AppHeader from "@/app/_components/AppHeader";
import AppSubHeader from "@/app/_components/AppSubHeader";
import AppUploadDynamics from "@/app/_components/AppDocumentsForm";
import { Tabs, TabsProps, Tag } from "antd";
import React from "react";
import AppFileUploader from "@/app/_components/AppFileUploader";

const fileTypes = [
  { color: "red", type: ".pdf" },
  { color: "geekblue", type: ".doc" },
  { color: "geekblue", type: ".docx" },
  // { color: "green", type: "zip" },
];

const items: TabsProps["items"] = [
  {
    key: "upload-form",
    label: "ด้วยการกรอกฟอร์ม",
    children: (
      <div className="mt-5">
        <AppSubHeader label={"อัปโหลดด้วยการกรอกฟอร์ม"} />
        <AppUploadDynamics />
      </div>
    ),
  },
  {
    key: "upload-file",
    label: "ด้วยการเพิ่มไฟล์",
    children: (
      <div className="mt-5">
        <AppSubHeader label={"อัปโหลดด้วยการเพิ่มไฟล์"} />
        <div className="">
          <p className="italic text-gray-400">
            ประเภทไฟล์ที่อัปโหลดได้ .pdf / .doc / .docx เท่านั้น
          </p>
          <div className="flex justify-start items-center mt-2">
            {fileTypes.map((ele, idx) => (
              <Tag key={ele.type} color={ele.color}>
                {ele.type}
              </Tag>
            ))}
          </div>
        </div>
        <AppFileUploader uploadUrl={"http://localhost:80/minio"} />
      </div>
    ),
  },
];

const UploadDocumentsPage = () => {
  const onChange = (key: string) => {
    console.log(key);
  };
  return (
    <section>
      <div className="mt-10">
        <AppHeader label={"อัปโหลดเอกสารให้ ChatBot"} color={"tertiary"} />
      </div>
      <Tabs onChange={onChange} type="card" items={items} className="mt-10" />
    </section>
  );
};

export default UploadDocumentsPage;
