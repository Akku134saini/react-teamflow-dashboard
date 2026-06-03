import { useForm } from "react-hook-form";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

type LoginFormData = {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error(error.message);
      console.log(error.message);
    } else {
      toast.success("Login successful");
      console.log("Login successful");
      navigate("/");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
        <div>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full border p-3 rounded-lg"
            {...register("email", { required: "Email is required" })}
          />

          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded-lg"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
