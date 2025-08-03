import DistributorSidebar from "../../components/DistributorSidebar";

export default function ProfileInfo() {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div className="flex">
            <DistributorSidebar />
            <div className="flex-1 p-6">
                <h2 className="text-2xl font-bold text-orange-600 mb-4">Profile Info</h2>
                <div className="bg-white p-4 rounded shadow w-[400px]">
                    <p><strong>Username:</strong> {user?.username}</p>
                    <p><strong>Role:</strong> {user?.role}</p>
                    <p><strong>User ID:</strong> {user?.userId}</p>
                </div>
            </div>
        </div>
    );
}
