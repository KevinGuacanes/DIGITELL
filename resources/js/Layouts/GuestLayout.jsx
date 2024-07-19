import ApplicationLogo from "@/Components/ApplicationLogo";
import { DarkModeContext } from "@/Components/DarkModeContext";
import { useContext } from "react";

export default function Guest({ children }) {
    const {toggleDarkMode} = useContext(DarkModeContext);
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gradient-to-b from-violet-500 dark:from-violet-950 dark:bg-gray-900">
            <div>
                <button onClick={toggleDarkMode}>
                    <ApplicationLogo className="w-40 h-40"/>
                </button>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
