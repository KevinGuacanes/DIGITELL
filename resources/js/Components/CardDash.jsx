const CardDash = ({ title, icon, value, className = "" }) => {
    return (
        <div className={"bg-white dark:bg-gray-700 rounded-lg shadow-lg p-4 " + className}>
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 bg-indigo-500 rounded-full text-white text-2xl">
                        {icon}
                    </div>
                </div>
                <div className="ml-4">
                    <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h5>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-200">{value}</p>
                </div>
            </div>
        </div>
    );
};

export default CardDash;
