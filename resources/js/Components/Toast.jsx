import { useContext } from "react";
import { toast } from "react-toastify";
import { DarkModeContext } from "@/Components/DarkModeContext";

const defaultOptions = {
    pauseOnFocusLoss: false,
    position: "top-right",
    autoClose: 2000,
};

const useNotify = () => {
    const { isDarkMode = false } = useContext(DarkModeContext) || {};
    const theme = isDarkMode ? "dark" : "light";

    const notify = (type, message, customOptions = {}) => {
        const toastOptions = {
            ...defaultOptions,
            ...customOptions,
            theme,
        };

        const icons = {
            success: "👌",
            error: "❌",
            info: "ℹ",
            warning: "⚠",
        };

        try {
            if (type in toast) {
                toast[type](message, {
                    ...toastOptions,
                    icon: icons[type] || null,
                });
            } else {
                toast(message, toastOptions);
            }
        } catch (error) {
            console.error("Error al mostrar la notificación:", error);
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    };

    return notify;
};

export { useNotify };
