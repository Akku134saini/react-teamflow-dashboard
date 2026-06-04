import { forwardRef, type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      className={`
        w-full
        border
        border-gray-300
        dark:border-zinc-700
        bg-white
        dark:bg-zinc-900
        text-black
        dark:text-white
        p-3
        rounded-lg
        outline-none
        focus:ring-2
        focus:ring-black
        dark:focus:ring-white
        transition-colors
        ${props.className || ""}
      `}
    />
  );
});

Input.displayName = "Input";

export default Input;
