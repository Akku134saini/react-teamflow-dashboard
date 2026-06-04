import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Input from "../components/ui/input";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

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
    <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-zinc-950">
      <form onSubmit={handleSubmit(handleSignUp)}>
        <Card>
          <h1 className="text-3xl font-bold mb-6 text-center">SignUp</h1>
          <Input
            type="email"
            placeholder="Email Address"
            className="w-full border p-3 rounded-lg mt-2"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}

          <Input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded-lg my-2"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 mt-2"
          >
            SignUp
          </Button>
        </Card>
      </form>
    </div>
  );
};

export default SignUp;
