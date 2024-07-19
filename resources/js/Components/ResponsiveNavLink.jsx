import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={`w-full flex items-start ps-3 pe-4 py-2 border-l-4 ${
                active
                    ? 'border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/50 focus:text-green-800 dark:focus:text-green-200 focus:bg-green-100 dark:focus:bg-green-900 focus:border-green-700 dark:focus:border-green-300'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-green-200 hover:bg-green-50 dark:hover:bg-green-700 hover:border-green-300 dark:hover:border-green-600 focus:text-gray-800 dark:focus:text-gray-200 focus:bg-green-50 dark:focus:bg-green-700 focus:border-gray-300 dark:focus:border-gray-600'
            } text-base font-medium focus:outline-none transition duration-150 ease-in-out ${className}`}
        >
            {children}
        </Link>
    );
}
