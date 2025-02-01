import { FC } from "react";

interface AppSubHeaderProps {
  label: string;
  color?: string;
}

const AppSubHeader: FC<AppSubHeaderProps> = ({ label, color = "tertiary" }) => {
  return <h3 className={`text-xl text-${color} font-bold`}>{label}</h3>;
};

export default AppSubHeader;
