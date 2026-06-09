export default function TodoSkeleton() {
  return (
    <div
      className="
        animate-pulse
        border
        border-gray-300
        dark:border-zinc-700
        rounded-lg
        p-4
        flex
        items-center
        justify-between
      "
    >
      <div className="space-y-2 flex-1">
        <div
          className="
            h-4
            bg-gray-300
            dark:bg-zinc-700
            rounded
            w-3/4
          "
        />

        <div
          className="
            h-4
            bg-gray-200
            dark:bg-zinc-800
            rounded
            w-1/2
          "
        />
      </div>

      <div className="flex gap-2 ml-4">
        <div
          className="
            w-16
            h-8
            rounded-lg
            bg-gray-300
            dark:bg-zinc-700
          "
        />

        <div
          className="
            w-16
            h-8
            rounded-lg
            bg-gray-300
            dark:bg-zinc-700
          "
        />
      </div>
    </div>
  );
}
