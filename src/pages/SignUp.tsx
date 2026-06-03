import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type SignUpFormData = {
  email: string;
  password: string;
};

const SignUp = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>();

  const handleSignUp = async (data: SignUpFormData) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created");
      navigate("/");
      console.log(data);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit(handleSignUp)}>
        <h1 className="text-3xl font-bold mb-6 text-center">SignUp</h1>
        <input
          type="email"
          placeholder="Email Address"
          className="w-full border p-3 rounded-lg"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
        >
          SignUp
        </button>
      </form>
    </div>
  );
};

export default SignUp;
