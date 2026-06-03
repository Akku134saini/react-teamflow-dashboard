import { useForm } from "react-hook-form";
import { supabase } from "../services/supabase";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Todo {
  id: number;
  text: string;
  user_id: string | null;
  created_at: string;
}

interface TodoFormData {
  todo: string;
}

const Dashboard = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<TodoFormData>();

  const fetchTodos = async (): Promise<void> => {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (!error) {
      setTodos(data ?? []);
    }
  };

  useEffect(() => {
    const loadTodos = async (): Promise<void> => {
      await fetchTodos();
    };

    loadTodos();
  }, []);

  const addTodo = async (formData: TodoFormData): Promise<void> => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("todos").insert([
      {
        text: formData.todo,
        user_id: user && user.id,
      },
    ]);

    if (!error) {
      reset();
      fetchTodos();
      toast.success("Todo added");
    }
  };

  const deleteTodo = async (id: number): Promise<void> => {
    await supabase.from("todos").delete().eq("id", id);

    toast.success("Todo deleted");
    fetchTodos();
  };

  const handleLogout = async (): Promise<void> => {
    await supabase.auth.signOut();
    toast.success("Logged out");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Todo App</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
        <form onSubmit={handleSubmit(addTodo)} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Add todo..."
            className="flex-1 border p-3 rounded-lg"
            {...register("todo", { required: "Todo cannot be empty" })}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-black text-white px-6 rounded-lg"
          >
            {isSubmitting ? "Adding..." : "Add"}
          </button>
        </form>

        <div className="space-y-3">
          {todos.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border p-3 rounded-lg"
            >
              <p>{item.text}</p>

              <button
                onClick={() => deleteTodo(item.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
