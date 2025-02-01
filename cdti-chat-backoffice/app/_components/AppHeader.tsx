import { FC } from "react";

interface AppHeaderProps {
  label: string;
  color: string;
}

const AppHeader: FC<AppHeaderProps> = ({ label, color }) => {
  return <h1 className={`text-4xl font-bold text-${color}`}>{label}</h1>;
};

export default AppHeader;
