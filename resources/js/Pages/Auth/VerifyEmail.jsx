import GuestLayout from "@/Layouts/GuestLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import { Head, Link, useForm } from "@inertiajs/react";
import LoadingSpinner from "@/Components/LoadingSpinner";

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route("verification.send"));
    };

    return (
        <GuestLayout>
            <Head title="Verificacion de email" />

            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Gracias por registrarte! Antes de comenzar, ¿podría verificar su
                dirección de correo electrónico haciendo clic en el enlace que
                le acabamos de enviar por correo electrónico? Si no recibió el
                correo electrónico, con gusto le enviaremos otro.
            </div>

            {status === "verification-link-sent" && (
                <div className="mb-4 font-medium text-sm text-green-600 dark:text-green-400">
                    Se ha enviado un nuevo enlace de verificación a la dirección
                    de correo electrónico que proporcionó durante el registro.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton disabled={processing}>
                        {processing ? (
                            <LoadingSpinner text="Reenviando..." />
                        ) : (
                            "Reenviar correo de verificación"
                        )}
                    </PrimaryButton>

                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                    >
                        Cerrar sesión
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
