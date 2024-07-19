const colorOptions = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    indigo: "bg-indigo-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    pink: "bg-pink-500",
    teal: "bg-teal-500",
};

const StatCard = ({ icon: Icon, title, value, color }) => {
    const bgColor = colorOptions[color] || "bg-gray-500";

    return (
        <div
            className={`bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md flex items-center`}
        >
            <div className={`p-3 rounded-full ${bgColor} text-white`}>
                <Icon size={24} />
            </div>
            <div className="ml-4">
                <h4 className="text-gray-700 dark:text-gray-200 text-lg font-semibold">
                    {title}
                </h4>
                <p className="text-gray-900 dark:text-gray-100 text-2xl">
                    {value}
                </p>
            </div>
        </div>
    );
};

export default StatCard;
