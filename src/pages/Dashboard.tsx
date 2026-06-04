import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import toast from "react-hot-toast";

import Button from "../components/ui/Button";
import AvatarUpload from "../components/AvatarUpload";

import { useThemeStore } from "../store/themeStore";

import { supabase } from "../services/supabase";

import {
  fetchTodos,
  createTodo,
  updateTodoById,
  deleteTodoById,
} from "../services/todoService";

import { fetchProfile, saveProfileAvatar } from "../services/profileService";
import Input from "../components/ui/input";

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
  const { darkMode, toggleTheme } = useThemeStore();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [userId, setUserId] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<TodoFormData>();

  const loadTodos = async () => {
    const { data, error } = await fetchTodos();

    if (error) {
      toast.error(error.message);
      return;
    }

    setTodos(data || []);
  };

  const loadProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setUserId(user.id);

    const { data, error } = await fetchProfile(user.id);

    if (error) {
      toast.error(error.message);
      return;
    }

    if (data?.avatar_url) {
      setAvatarUrl(data.avatar_url);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await loadTodos();
      await loadProfile();
    };

    initialize();

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
          loadTodos();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addTodo = async (formData: TodoFormData) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await createTodo(formData.todo, user.id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Todo added");

    reset();
  };

  const updateTodo = async (id: number) => {
    const { error } = await updateTodoById(id, editText);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Todo updated");

    setEditingId(null);

    setEditText("");
  };

  const deleteTodo = async (id: number) => {
    const { error } = await deleteTodoById(id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Todo deleted");
  };

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

    setAvatarUrl(url);

    toast.success("Avatar updated");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();

    toast.success("Logged out");
  };

  return (
    <div
      className="
        min-h-screen
        bg-gray-100
        dark:bg-zinc-950
        transition-colors
        p-10
      "
    >
      <div
        className="
          max-w-xl
          mx-auto
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

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Todo App</h1>

          <div className="flex gap-3">
            <Button
              onClick={toggleTheme}
              className="
                bg-gray-300
                dark:bg-zinc-700
                dark:text-white
              "
            >
              {darkMode ? "Light" : "Dark"}
            </Button>

            <Button onClick={handleLogout} className="bg-red-500">
              Logout
            </Button>
          </div>
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

        <form onSubmit={handleSubmit(addTodo)} className="flex gap-2 mb-6">
          <Input
            type="text"
            placeholder="Add todo..."
            className="flex-1"
            {...register("todo", {
              required: "Todo cannot be empty",
            })}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add"}
          </Button>
        </form>

        {/* TODOS */}

        <div className="space-y-3">
          {todos.map((todo) => (
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
                      onClick={() => deleteTodo(todo.id)}
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
    </div>
  );
}
