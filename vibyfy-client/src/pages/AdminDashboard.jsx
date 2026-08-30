import DashboardStats from "../components/admin/DashboardStats";

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-slate-400 mt-2">
          Welcome to Moodify Admin Panel
        </p>
      </div>

      <DashboardStats />
    </div>
  );
};

export default AdminDashboard;