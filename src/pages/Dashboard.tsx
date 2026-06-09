import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";

import { supabase } from "../services/supabase";

import {
  fetchTodos,
  createTodo,
  updateTodoById,
  deleteTodoById,
} from "../services/todoService";

import { fetchProfile, saveProfileAvatar } from "../services/profileService";

import { useThemeStore } from "../store/themeStore";
import Button from "../components/ui/Button";
import AvatarUpload from "../components/AvatarUpload";
import TodoSkeleton from "../components/TodoSkeleton";
import Input from "../components/ui/input";
import Sidebar from "../layouts/Sidebar";

interface Todo {
  id: number;
  text: string;
  user_id: string | null;
  created_at: string;
}

interface TodoFormData {
  todo: string;
}

export default function Dashboard() {
  const queryClient = useQueryClient();

  const { darkMode, toggleTheme } = useThemeStore();

  const [editingId, setEditingId] = useState<number | null>(null);

  const [editText, setEditText] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<TodoFormData>();

  // =========================
  // TODOS QUERY
  // =========================

  const {
    data: todos = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todos"],

    queryFn: async () => {
      const { data, error } = await fetchTodos();

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
  });

  // =========================
  // PROFILE
  // =========================

  const { data: profileData } = useQuery({
    queryKey: ["profile"],

    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not found");
      }

      const { data, error } = await fetchProfile(user.id);

      if (error) {
        throw new Error(error.message);
      }

      return {
        userId: user.id,
        avatarUrl: data?.avatar_url || "",
        email: user.email || "",
      };
    },
  });

  const userId = profileData?.userId || "";
  const avatarUrl = profileData?.avatarUrl || "";
  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    const channel = supabase
      .channel("todos-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "todos",
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["todos"],
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
  // =========================
  // ADD TODO
  // =========================

  const addTodoMutation = useMutation({
    mutationFn: async (formData: TodoFormData) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not found");
      }

      const { error } = await createTodo(formData.todo, user.id);

      if (error) {
        throw new Error(error.message);
      }
    },

    onSuccess: () => {
      toast.success("Todo added");

      reset();

      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // =========================
  // UPDATE TODO
  // =========================

  const updateTodo = async (id: number) => {
    const { error } = await updateTodoById(id, editText);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Todo updated");

    setEditingId(null);

    setEditText("");

    queryClient.invalidateQueries({
      queryKey: ["todos"],
    });
  };

  // =========================
  // DELETE TODO
  // =========================

  const deleteTodoMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await deleteTodoById(id);

      if (error) {
        throw new Error(error.message);
      }
    },

    onSuccess: () => {
      toast.success("Todo deleted");

      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // =========================
  // SAVE AVATAR
  // =========================

  const saveAvatar = async (url: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await saveProfileAvatar(user.id, user.email || "", url);

    if (error) {
      toast.error(error.message);
      return;
    }

    queryClient.invalidateQueries({
      queryKey: ["profile"],
    });
    toast.success("Avatar updated");
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = async () => {
    await supabase.auth.signOut();

    toast.success("Logged out");
  };

  let content;
  // =========================
  // LOADING STATE
  // =========================

  if (isLoading) {
    content = (
      <div className="space-y-3">
        <TodoSkeleton />
        <TodoSkeleton />
        <TodoSkeleton />
      </div>
    );
  } else if (isError) {
    content = (
      <div
        className="
        bg-white
        dark:bg-zinc-900
        p-8
        rounded-2xl
        shadow-md
      "
      >
        <p className="text-red-500 text-lg">Failed to load todos</p>
      </div>
    );
  } else {
    content = (
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
        {/* HEADER */}

        <div className="mb-6">
          <h1 className="text-3xl font-bold">Todo App</h1>

          <p
            className="
            text-gray-500
            dark:text-gray-400
          "
          >
            Manage your daily tasks
          </p>
        </div>

        {/* AVATAR */}

        <div className="mb-6">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="
              w-24
              h-24
              rounded-full
              object-cover
              mb-4
            "
            />
          )}

          <AvatarUpload userId={userId} onUpload={saveAvatar} />
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit((data) => addTodoMutation.mutate(data))}
          className="flex gap-2 mb-6"
        >
          <Input
            type="text"
            placeholder="Add todo..."
            className="flex-1"
            {...register("todo", {
              required: "Todo cannot be empty",
            })}
          />

          <Button
            type="submit"
            disabled={isSubmitting || addTodoMutation.isPending}
          >
            {addTodoMutation.isPending ? "Adding..." : "Add"}
          </Button>
        </form>

        {/* TODOS */}

        <div className="space-y-3">
          {todos.length === 0 && (
            <div
              className="
              text-center
              py-16
              border
              border-dashed
              border-gray-300
              dark:border-zinc-700
              rounded-2xl
            "
            >
              <h2
                className="
                text-2xl
                font-semibold
                mb-2
              "
              >
                No todos yet
              </h2>

              <p
                className="
                text-gray-500
                dark:text-gray-400
              "
              >
                Add your first task 🚀
              </p>
            </div>
          )}

          {todos.map((todo: Todo) => (
            <div
              key={todo.id}
              className="
              border
              border-gray-300
              dark:border-zinc-700
              rounded-lg
              p-3
              flex
              items-center
              justify-between
            "
            >
              {editingId === todo.id ? (
                <div className="flex gap-2 w-full">
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1"
                  />

                  <Button
                    onClick={() => updateTodo(todo.id)}
                    className="bg-green-500"
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <>
                  <p>{todo.text}</p>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setEditingId(todo.id);

                        setEditText(todo.text);
                      }}
                      className="bg-blue-500"
                    >
                      Edit
                    </Button>

                    <Button
                      onClick={() => deleteTodoMutation.mutate(todo.id)}
                      className="bg-red-500"
                    >
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="
      min-h-screen
      flex
      bg-gray-100
      dark:bg-zinc-950
      transition-colors
    "
    >
      <Sidebar
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        handleLogout={handleLogout}
        avatarUrl={avatarUrl}
      />

      <main className="flex-1 p-10">
        <div className="max-w-3xl mx-auto">{content}</div>
      </main>
    </div>
  );
}
