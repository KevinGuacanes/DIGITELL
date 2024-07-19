import { usePage } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import { IoArrowBack } from "react-icons/io5";
import GuestLayout from "@/Layouts/GuestLayout";
import PrimaryButton from "@/Components/PrimaryButton";
export default function ErrorPage({ status }) {
    const { url } = usePage();

    const errorNumberStyle = {
        fontSize: "6rem",
        fontWeight: "bold",
        color: "#EF4444",
        marginBottom: "1rem",
    };

    const title =
        {
            503: "Servicio No Disponible",
            500: "Error del Servidor",
            404: "Página No Encontrada",
            403: "Prohibido",
        }[status] || "Error Desconocido";

    const description =
        {
            503: "Lo siento, estamos haciendo mantenimiento. Por favor, vuelve pronto.",
            500: "Vaya, algo salió mal en nuestros servidores.",
            404: "Lo siento, no se pudo encontrar la página que estás buscando.",
            403: "Lo siento, no tienes permiso para acceder a esta página.",
        }[status] || "Ocurrió un error inesperado.";

    const handleBack = () => {
        window.history.back();
    };

    return (
        <GuestLayout>
            <Head title={`Error ${status}`} />
            <div className="absolute inset-0 bg-gradient-animation flex items-center justify-center dark:bg-gray-900">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
                    <h1
                        className="text-5xl font-bold text-red-500 mb-4"
                        style={errorNumberStyle}
                    >
                        {status}
                    </h1>
                    <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">
                        {title}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-8">
                        {description}
                    </p>
                    <div className="flex justify-center">
                        <PrimaryButton onClick={handleBack}>
                            <IoArrowBack className="text-lg mr-2" /> Volver
                        </PrimaryButton>
                    </div>
                </div>
            </div>
             
        </GuestLayout>
    );
}
