type CardProps = {
  children: React.ReactNode;
};

export default function Card({
  children,
}: CardProps) {
  return (
    <div
      className="
        bg-white
        dark:bg-zinc-900
        dark:text-white
        p-8
        rounded-2xl
        shadow-md
        transition-colors
      "
    >
      {children}
    </div>
  );
}