"use client";

import { FC } from "react";
import { Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import AppHeader from "./AppHeader";
import AppSubHeader from "./AppSubHeader";
import { userPermissions } from "@/utils/rbac";
import { Capitalized } from "@/utils/text";

interface DataType {
  key: string;
  roles: string;
  actions: string[];
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "Roles",
    dataIndex: "roles",
    key: "roles",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Actions",
    key: "actions",
    dataIndex: "actions",
    render: (_, { actions }) => (
      <>
        {actions.map((tag) => {
          const color =
            tag.split(":")[0] === "read"
              ? "geekblue"
              : tag.split(":")[0] === "create" || tag.split(":")[0] === "edit"
              ? "green"
              : "red";
          return (
            <Tag color={color} key={tag}>
              {tag}
            </Tag>
          );
        })}
      </>
    ),
  },
];

const roleData: DataType[] = Object.keys(userPermissions).map((role, idx) => {
  return {
    key: (idx + 1).toString(),
    roles: Capitalized(role),
    actions: userPermissions[role as keyof typeof userPermissions],
  };
});

const AppRoleInfo: FC = () => (
  <section>
    <div className="mt-10">
      <AppHeader label={"การจัดการ user"} color={"tertiary"} />
    </div>
    <div className="mt-10">
      <AppSubHeader label={"รายละเอียดของ roles"} color={"tertiary"} />
    </div>
    <Table<DataType>
      columns={columns}
      dataSource={roleData}
      className="mt-10"
      pagination={false}
      scroll={{ y: 700 }}
    />
  </section>
);

export default AppRoleInfo;
