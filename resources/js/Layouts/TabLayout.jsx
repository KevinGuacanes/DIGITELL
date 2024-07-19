import { Link } from "@inertiajs/react";
const Tab = ({ tabs, children }) => {
    return (
        <>
            <div className="mx-auto max-w-8xl sm:px-6 lg:px-8 py-3">
                <ul className="inline-flex justify-center sm:justify-normal flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    {tabs.map((tab, index) => (
                        <li key={index} className="me-2">
                            <NavLink
                                href={route(tab.route)}
                                active={route().current(tab.route)}
                            >
                                <tab.icon className="w-4 h-4 me-2 " />
                                {tab.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
            {children}
        </>
    );
};

function NavLink({ children, active = false, ...props }) {
    return (
        <Link
            {...props}
            className={
                `inline-flex items-center justify-center p-4  border-b-2 rounded-t-lg group ` +
                (active
                    ? "text-violet-600 dark:text-violet-500 border-violet-600 dark:border-violet-600 focus:border-violet-700 "
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700 ")
            }
        >
            {children}
        </Link>
    );
}

export default Tab;
