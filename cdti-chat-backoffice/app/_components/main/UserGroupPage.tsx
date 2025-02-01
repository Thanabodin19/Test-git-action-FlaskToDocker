"use client";
import AppHeader from "@/app/_components/AppHeader";
import AppSubHeader from "@/app/_components/AppSubHeader";
import { fetcher } from "@/utils/fetchers/db_fetcher";
import React, { FC } from "react";
import useSWR from "swr";
import { Table, Tag } from "antd";
import type { TableProps } from "antd";
import { Capitalized } from "@/utils/text";

interface TabelDataType {
  key: string;
  name: string;
  email: string;
  role: string;
}

const columns: TableProps<TabelDataType>["columns"] = [
  {
    title: "ชื่อ",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Role",
    key: "role",
    dataIndex: "role",
    render: (_, { role }) => (
      <>
        {role === "admin" && (
          <Tag color={"green"} key={role}>
            {Capitalized(role)}
          </Tag>
        )}
        {role === "viewer" && (
          <Tag color={"geekblue"} key={role}>
            {Capitalized(role)}
          </Tag>
        )}
        {role === "user" && (
          <Tag color={"red"} key={role}>
            {Capitalized(role)}
          </Tag>
        )}
      </>
    ),
    filters: [
      {
        text: "Admin",
        value: "admin",
      },
      {
        text: "Viewer",
        value: "viewer",
      },
    ],
    filterMode: "tree",
    filterSearch: true,
    onFilter: (value, record) => record.role.startsWith(value as string),
  },
];

const UserGroupPage: FC = () => {
  const { data, error, isLoading } = useSWR("/api/db/users", fetcher);

  return (
    <section>
      <div className="mt-10">
        <AppHeader label={"การจัดการ user"} color={"tertiary"} />
      </div>
      <div className="mt-10">
        <AppSubHeader label={"กลุ่ม user"} color={"tertiary"} />
      </div>
      <Table<TabelDataType>
        columns={columns}
        dataSource={data?.data}
        pagination={false}
        scroll={{ y: 700 }}
        loading={isLoading}
        className="mt-10"
      />
    </section>
  );
};

export default UserGroupPage;
