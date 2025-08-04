import DistributorSidebar from "../../components/DistributorSidebar";

export default function OrdersAwarded() {
    return (
        <div className="flex">
            <DistributorSidebar />
            <div className="flex-1 ml-64 p-6">
                <h2 className="text-2xl font-bold text-orange-600 mb-4">Orders Awarded</h2>
                {/* TODO: List orders awarded to the distributor */}
            </div>
        </div>
    );
}