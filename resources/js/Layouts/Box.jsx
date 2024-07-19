const Box = ({ className = "", children }) => {
    return (
        <div className={`max-w-8xl mx-auto sm:px-6 lg:px-8 ${className}`}>
            <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6 text-gray-900 dark:text-gray-100">
                {children}
            </div>
        </div>
    );
};

export default Box;
