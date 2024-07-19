import { forwardRef, useEffect, useRef } from "react";
import FloatInputText from "./FloatInputText";

const SearchBar = forwardRef(
    ({ type = "text", className = "", isFocused = false, ...props }, ref) => {
        const input = ref ? ref : useRef();
        useEffect(() => {
            if (isFocused) {
                input.current.focus();
            }
        }, []);
        return (
            <form className="w-full sm:w-64">
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg
                            className="w-3 h-3 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 20"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                stroke="currentColor"
                            />
                        </svg>
                    </div>
                    <FloatInputText
                        {...props}
                        type="search"
                        className={
                            `block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500 ` +
                            className
                        }
                        placeholder="Search..."
                        required
                    />
                </div>
            </form>
        );
    },
);

export default SearchBar;
