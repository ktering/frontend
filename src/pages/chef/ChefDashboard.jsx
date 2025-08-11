import ChefLayout from "../../components/chef/chefLayout";
import { FaClipboardList, FaClock, FaUtensils } from "react-icons/fa";

export default function ChefDashboard() {
  const chefName = localStorage.getItem("chefName") || "Chef";

  const stats = [
    { id: 1, title: "Orders Completed", value: 24, icon: <FaClipboardList className="text-xl sm:text-2xl text-red-600" /> },
    { id: 2, title: "Pending Orders", value: 6, icon: <FaClock className="text-xl sm:text-2xl text-yellow-500" /> },
    { id: 3, title: "Total Dishes", value: 42, icon: <FaUtensils className="text-xl sm:text-2xl text-green-600" /> },
  ];

  return (
    <ChefLayout>
      <div className="mb-8 px-4 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 truncate">
          Welcome back, {chefName}!
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-0">
        {stats.map(({ id, title, value, icon }) => (
          <div
            key={id}
            className="bg-white rounded-xl shadow-md p-4 sm:p-6 flex items-center gap-4 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
          >
            <div className="p-3 rounded-full bg-gray-100 flex items-center justify-center shadow-sm">
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm sm:text-base font-semibold text-gray-700 truncate">{title}</h2>
              <span className="text-xl sm:text-2xl font-bold text-gray-900">{value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Section */}
      <div className="mt-12 px-4 sm:px-0">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
          {/* Replace with real order data */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700 text-sm sm:text-base">Order #1024</span>
                <span className="text-gray-400 text-xs sm:text-sm">2 items</span>
              </div>
              <div className="flex items-center gap-4 mt-2 sm:mt-0">
                <span className="text-green-600 font-bold text-sm sm:text-base">Completed</span>
                <span className="text-gray-500 text-xs sm:text-sm">Today, 10:30 AM</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700 text-sm sm:text-base">Order #1023</span>
                <span className="text-gray-400 text-xs sm:text-sm">1 item</span>
              </div>
              <div className="flex items-center gap-4 mt-2 sm:mt-0">
                <span className="text-yellow-500 font-bold text-sm sm:text-base">Pending</span>
                <span className="text-gray-500 text-xs sm:text-sm">Today, 9:15 AM</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700 text-sm sm:text-base">Order #1022</span>
                <span className="text-gray-400 text-xs sm:text-sm">3 items</span>
              </div>
              <div className="flex items-center gap-4 mt-2 sm:mt-0">
                <span className="text-green-600 font-bold text-sm sm:text-base">Completed</span>
                <span className="text-gray-500 text-xs sm:text-sm">Yesterday, 4:45 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ChefLayout>
  );
}
