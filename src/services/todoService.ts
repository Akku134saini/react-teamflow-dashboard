import { supabase } from "./supabase";

export const fetchTodos = async () => {
  return await supabase.from("todos").select("*").order("created_at", {
    ascending: false,
  });
};

export const createTodo = async (text: string, userId: string) => {
  return await supabase.from("todos").insert({
    text,
    user_id: userId,
  });
};

export const updateTodoById = async (id: number, text: string) => {
  return await supabase
    .from("todos")
    .update({
      text,
    })
    .eq("id", id);
};

export const deleteTodoById = async (id: number) => {
  return await supabase.from("todos").delete().eq("id", id);
};
