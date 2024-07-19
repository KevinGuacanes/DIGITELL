import "./bootstrap";
import "../css/app.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { DarkModeProvider } from "@/Components/DarkModeContext";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

createInertiaApp({
    title: (title) => `${title} - Digitell`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx"),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <DarkModeProvider>
                <App {...props} />
                <ToastContainer autoClose={3000} />
            </DarkModeProvider>,
        );
    },
    progress: {
        color: "#4B5563",
    },
});
