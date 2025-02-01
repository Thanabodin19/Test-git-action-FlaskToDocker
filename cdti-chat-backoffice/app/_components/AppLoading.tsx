import { Spin } from "antd";
import React from "react";

const AppLoading = () => {
  return (
    <section className="w-full h-screen flex items-center justify-center">
      <Spin size="large" />
    </section>
  );
};

export default AppLoading;
