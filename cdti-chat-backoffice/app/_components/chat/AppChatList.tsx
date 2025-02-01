import Link from "next/link";
import React, { FC } from "react";

const dashboard = [
  { name: "สร้างแชทใหม่", route: "/" },
  { name: "ติดต่อแจ้งปัญหา", route: "/" },
];

const chatHistory = [
  { name: "chat - 1", route: "/" },
  { name: "chat - 2", route: "/" },
  { name: "chat - 3", route: "/" },
  { name: "chat - 4", route: "/" },
  { name: "chat - 5", route: "/" },
  { name: "chat - 6", route: "/" },
  { name: "chat - 7", route: "/" },
];

const AppChatList = () => {
  return (
    <aside className="h-full w-[20%] text-white font-bold">
      <LogContainer title={"DASHBOARD"} logList={dashboard} />
      {/* <LogContainer title={"ประวัติการแชท"} logList={chatHistory} /> */}
    </aside>
  );
};

export default AppChatList;

interface LogContainer {
  title: string;
  logList: { name: string; route: string }[];
}

const LogContainer: FC<LogContainer> = ({ title, logList }) => {
  return (
    <>
      <section className="py-5 px-10">
        <h3 className="text-xs">{title}</h3>
        <div className="flex flex-col justify-start items-start px-4 py-3">
          {logList.map((ele, idx) => (
            <Link className="mt-5" key={idx} href={ele.route}>
              {ele.name}
            </Link>
          ))}
        </div>
      </section>
      <div className="px-8 py-3">
        <hr className="h-px bg-gray-800 border-0" />
      </div>
    </>
  );
};
