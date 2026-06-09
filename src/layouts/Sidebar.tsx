import Button from "../components/ui/Button";

interface SidebarProps {
  darkMode: boolean;
  toggleTheme: () => void;
  handleLogout: () => void;
  avatarUrl?: string;
}

export default function Sidebar({
  darkMode,
  toggleTheme,
  handleLogout,
  avatarUrl,
}: SidebarProps) {
  return (
    <aside
      className="
        w-64
        min-h-screen
        bg-white
        dark:bg-zinc-900
        border-r
        border-gray-200
        dark:border-zinc-800
        p-6
        flex
        flex-col
        justify-between
        transition-colors
      "
    >
      {/* TOP */}

      <div>
        {/* LOGO */}

        <div className="mb-10">
          <h1
            className="
              text-2xl
              font-bold
              dark:text-white
            "
          >
            TeamFlow
          </h1>

          <p
            className="
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            Productivity Dashboard
          </p>
        </div>

        {/* PROFILE */}

        <div
          className="
            flex
            items-center
            gap-3
            mb-10
          "
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="
                w-12
                h-12
                rounded-full
                object-cover
              "
            />
          ) : (
            <div
              className="
                w-12
                h-12
                rounded-full
                bg-gray-300
                dark:bg-zinc-700
              "
            />
          )}

          <div>
            <p
              className="
                font-medium
                dark:text-white
              "
            >
              Welcome 👋
            </p>

            <p
              className="
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Manage your tasks
            </p>
          </div>
        </div>

        {/* NAVIGATION */}

        <nav className="space-y-3">
          <Button
            className="
              w-full
              text-left
              px-4
              py-3
              rounded-xl
              bg-black
              text-white
              dark:bg-zinc-700
            "
          >
            Dashboard
          </Button>

          <Button
            className="
              w-full
              text-left
              px-4
              py-3
              rounded-xl
              hover:bg-gray-100
              dark:hover:bg-zinc-800
              dark:text-white
              transition
            "
          >
            Analytics
          </Button>

          <Button
            className="
              w-full
              text-left
              px-4
              py-3
              rounded-xl
              hover:bg-gray-100
              dark:hover:bg-zinc-800
              dark:text-white
              transition
            "
          >
            Settings
          </Button>
        </nav>
      </div>

      {/* BOTTOM */}

      <div className="space-y-3">
        <Button
          onClick={toggleTheme}
          className="
            w-full
            bg-gray-200
            dark:bg-zinc-700
            dark:text-white
          "
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </Button>

        <Button
          onClick={handleLogout}
          className="
            w-full
            bg-red-500
          "
        >
          Logout
        </Button>
      </div>
    </aside>
  );
}
