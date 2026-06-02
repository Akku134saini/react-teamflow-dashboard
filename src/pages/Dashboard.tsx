import { supabase } from "../services/supabase";

const Dashboard = () => {
  const handleLogOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div>
      Dashboard
      <button onClick={handleLogOut}>Logout</button>
    </div>
  );
};

export default Dashboard;
