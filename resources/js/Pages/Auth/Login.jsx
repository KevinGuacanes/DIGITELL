import { useEffect, useState } from "react";
import Checkbox from "@/Components/Checkbox";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import FloatInputText from "@/Components/FloatInputText";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { useNotify } from "@/Components/Toast";
import LoadingSpinner from "@/Components/LoadingSpinner";

export default function Login({ status, canResetPassword }) {
    const { flash } = usePage().props;
    const notify = useNotify();
    const [message, setMessage] = useState(flash.message);
    const [messageType, setMessageType] = useState(flash.type);
    const { data, setData, post, processing, errors, reset } = useForm({
        login: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        if (message) {
            notify(messageType, message, { autoClose: 5000 });
            setMessage(null);
            setMessageType(null);
        }
    }, [message, messageType]);

    useEffect(() => {
        if (flash.message) {
            setMessage(flash.message);
            setMessageType(flash.type);
        }
    }, [flash]);

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route("login"));
    };

    return (
        <GuestLayout>
            <Head title="Iniciar Sesión" />

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <FloatInputText
                        label="Email o Nombre de usuario"
                        id="login"
                        type="text"
                        name="login"
                        value={data.login}
                        className="mt-1 block w-full"
                        autoComplete="login"
                        isFocused={true}
                        onChange={(e) => setData("login", e.target.value)}
                    />

                    <InputError message={errors.login} className="mt-2" />
                </div>

                <div className="mt-4">
                    <FloatInputText
                        label="Contraseña"
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData("password", e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="block mt-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">
                            Recuerdame
                        </span>
                    </label>
                </div>

                <div className="flex justify-center items-center mt-4 w-full">
                    <PrimaryButton className="px-16" disabled={processing}>
                        {processing ? (
                            <LoadingSpinner text="Iniciando..." />
                        ) : (
                            "Iniciar Sesión."
                        )}
                    </PrimaryButton>
                </div>

                <div className="flex items-center justify-between mt-4">
                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    )}

                    <Link
                        href={route("register")}
                        className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
                    >
                        ¿No tienes una cuenta?
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
