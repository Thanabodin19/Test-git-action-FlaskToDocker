"use client";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import AppMsg from "./AppMsg";
import AppPromptInput from "./AppPromptInput";
import { PromptInput } from "@/utils/type";
import { SubmitHandler, useForm } from "react-hook-form";
import "@ant-design/v5-patch-for-react-19";

const AppChattes: FC = () => {
  const endRef = useRef<HTMLDivElement | null>(null);
  const [loadingAns, setLoadingAns] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const { control, handleSubmit, setValue } = useForm<PromptInput>();

  useEffect(() => {
    setTimeout(() => {
      endRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [question, answer]);

  const getStreamingAnswer = useCallback(
    async (prompt: string) => {
      setLoadingAns(true);
      const res = await fetch("http://localhost:80/typhoon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      const processResult = (
        result: ReadableStreamReadResult<Uint8Array>
      ): Promise<void> | void => {
        if (result.done) return;

        setLoadingAns(false);
        let token = decoder.decode(result.value);

        setAnswer((prev) => prev + token);
        return reader?.read().then(processResult);
      };

      reader?.read().then(processResult);
    },
    [setLoadingAns, answer, setAnswer]
  );

  const onSubmit: SubmitHandler<PromptInput> = useCallback((data) => {
    if (data.prompt) {
      setQuestion(data.prompt);
      setValue("prompt", "");
      getStreamingAnswer(data.prompt);
    }
  }, []);
  return (
    <section className="h-full w-full bg-tertiary flex flex-col justify-between items-center py-10">
      <div className="max-h-[70dvh] w-3/4 flex flex-col items-center overflow-auto text-white">
        {question && <AppMsg type={"question"} msg={question} />}
        {answer && (
          <AppMsg type={"answer"} msg={answer} isLoading={loadingAns} />
        )}
        <div ref={endRef} />
      </div>
      <div className="w-[70%] justify-self-end text-center">
        {loadingAns && (
          <div className="w-full flex justify-center items-center mb-10">
            <div className="loader"></div>
          </div>
        )}
        <AppPromptInput
          onSubmit={onSubmit}
          control={control}
          handleSubmit={handleSubmit}
        />
      </div>
    </section>
  );
};

export default AppChattes;
