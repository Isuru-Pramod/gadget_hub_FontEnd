import DistributorSidebar from "../../components/DistributorSidebar";

export default function MyResponses() {
    return (
        <div className="flex">
            <DistributorSidebar />
            <div className="flex-1 p-6">
                <h2 className="text-2xl font-bold text-orange-600 mb-4">My Responses</h2>
                {/* TODO: List all submitted responses */}
            </div>
        </div>
    );
}