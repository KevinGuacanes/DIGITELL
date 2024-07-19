import { createContext, useState } from "react";
const DarkModeContext = createContext();
function DarkModeProvider({ children }) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle("dark");
    };

    const values = {
        isDarkMode,
        toggleDarkMode,
    };

    return (
        <DarkModeContext.Provider value={values}>
            {children}
        </DarkModeContext.Provider>
    );
}

export {
    DarkModeContext,
    DarkModeProvider
}