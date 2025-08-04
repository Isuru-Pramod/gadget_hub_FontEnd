import DistributorSidebar from "../../components/DistributorSidebar";

export default function UserProfile() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <DistributorSidebar />
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6 border-b-2 border-orange-500 pb-2">
            Profile Information
          </h1>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <p className="text-gray-500 font-medium">Username:</p>
                  <p className="text-gray-800 font-semibold">{user?.username || "N/A"}</p>
                </div>

                <div className="flex justify-between items-center border-b pb-2">
                  <p className="text-gray-500 font-medium">Role:</p>
                  <p className="text-gray-800 font-semibold">{user?.role || "N/A"}</p>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-gray-500 font-medium">User ID:</p>
                  <p className="text-gray-800 font-semibold">{user?.userId || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}