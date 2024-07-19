import { Head, useForm } from "@inertiajs/react";
import React, { useRef, useState } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import InputError from "@/Components/InputError";
import FloatInputText from "@/Components/FloatInputText";
import LoadingSpinner from "@/Components/LoadingSpinner";

const TwoFactorChallenge = () => {
    const [recovery, setRecovery] = useState(false);
    const form = useForm({
        code: "",
        recovery_code: "",
    });
    const recoveryCodeRef = useRef(null);
    const codeRef = useRef(null);

    const toggleRecovery = (e) => {
        e.preventDefault();
        const isRecovery = !recovery;
        setRecovery(isRecovery);

        setTimeout(() => {
            if (isRecovery) {
                recoveryCodeRef.current?.focus();
                form.setData("code", "");
            } else {
                codeRef.current?.focus();
                form.setData("recovery_code", "");
            }
        }, 100);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        form.post(route("two-factor.login.submit"));
    };

    return (
        <GuestLayout>
            <Head title="Confirmación de dos factores" />

            <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                {recovery
                    ? "Por favor, confirma el acceso a tu cuenta ingresando uno de tus códigos de recuperación de emergencia."
                    : "Por favor, confirma el acceso a tu cuenta ingresando el código de autenticación proporcionado por tu aplicación de autenticación."}
            </div>

            <form onSubmit={onSubmit}>
                {recovery ? (
                    <div>
                        <FloatInputText
                            label="Código Recuperación"
                            id="recovery_code"
                            type="text"
                            className="mt-1 block w-full"
                            value={form.data.recovery_code}
                            onChange={(e) =>
                                form.setData(
                                    "recovery_code",
                                    e.currentTarget.value,
                                )
                            }
                            ref={recoveryCodeRef}
                            autoComplete="one-time-code"
                        />
                        <InputError
                            className="mt-2"
                            message={form.errors.recovery_code}
                        />
                    </div>
                ) : (
                    <div>
                        <FloatInputText
                            label="Código"
                            id="code"
                            type="text"
                            inputMode="numeric"
                            className="mt-1 block w-full"
                            value={form.data.code}
                            onChange={(e) =>
                                form.setData("code", e.currentTarget.value)
                            }
                            autoFocus
                            autoComplete="one-time-code"
                            ref={codeRef}
                        />
                        <InputError
                            className="mt-2"
                            message={form.errors.code}
                        />
                    </div>
                )}

                <div className="mt-4 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        className="cursor-pointer text-sm text-gray-600 underline hover:text-gray-900 dark:text-gray-300"
                        onClick={toggleRecovery}
                    >
                        {recovery
                            ? "Usa un código de autenticación"
                            : "Usa un código de recuperación"}
                    </button>

                    <PrimaryButton disabled={form.processing}>
                        {form.processing ? (
                            <LoadingSpinner text="Iniciando..." />
                        ) : (
                            "Iniciar Sesión."
                        )}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
};

export default TwoFactorChallenge;
