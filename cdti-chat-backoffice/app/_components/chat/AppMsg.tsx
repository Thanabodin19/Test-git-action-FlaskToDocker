import React, { FC } from "react";
import AI from "@/app/assets/ai-icon.png";
import Image from "next/image";
import Markdown from "react-markdown";

interface AppMsgProps {
  type: "question" | "answer";
  msg: string;
  isLoading?: boolean;
}

const AppMsg: FC<AppMsgProps> = ({ type, msg, isLoading }) => {
  return (
    <>
      {type === "question" && (
        <div
          className={`p-3 mb-10 rounded-lg max-w-[80%] bg-orange-900 self-end`}
        >
          {msg}
        </div>
      )}
      {type === "answer" && (
        <div className="flex justify-start items-center self-start">
          <Image
            src={AI}
            alt="ai-icon"
            width={30}
            height={30}
            className="rounded-full self-start mr-3"
          />
          <div className={`p-3 mb-10 rounded-lg max-w-[80%] bg-gray-700 `}>
            <Markdown>{msg}</Markdown>
          </div>
        </div>
      )}
    </>
  );
};

export default AppMsg;
