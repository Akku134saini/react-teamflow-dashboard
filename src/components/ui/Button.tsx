type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export default function Button({
  children,
  type = "button",
  onClick,
  disabled,
  className = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-black
        dark:bg-white
        text-white
        dark:text-black
        px-4
        py-2
        rounded-lg
        disabled:opacity-50
        transition-colors
        ${className}
      `}
    >
      {children}
    </button>
  );
}
