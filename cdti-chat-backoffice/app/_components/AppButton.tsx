"use client";
import { VariantProps, cva } from "class-variance-authority";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

interface AppButtonProps {
  label: string;
}

export const buttonStyle = cva(["transition-colors"], {
  variants: {
    variant: {
      primary: ["bg-primary text-white"],
      secondary: ["bg-secondary text-black", "hover:bg-main hover:text-white"],
      delete: ["bg-red-500 text-white", "hover:bg-red-800"],
      ghost: ["hover:bg-gray-100"],
      dark: ["bg-tertiary", "hover:bg-gray-800", "text-secondary"],
    },
    size: {
      default: [
        "rounded-3xl hover:rounded-xl transition-all duration-300",
        "px-8 py-3",
      ],
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "default",
  },
});

type ButtonProps = VariantProps<typeof buttonStyle> & ComponentProps<"button">;

const AppButton = ({
  variant,
  size,
  className,
  ...props
}: ButtonProps & AppButtonProps) => {
  return (
    <button
      {...props}
      className={twMerge(buttonStyle({ variant, size, className }), className)}
    >
      {props.label}
    </button>
  );
};

export default AppButton;
