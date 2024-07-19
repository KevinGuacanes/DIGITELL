import { useEffect } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { Head, useForm } from "@inertiajs/react";
import FloatInputText from "@/Components/FloatInputText";
import LoadingSpinner from "@/Components/LoadingSpinner";

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: "",
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route("password.confirm.2fa"));
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Esta es un área segura de la aplicación. Confirme su contraseña
                antes de continuar.
            </div>

            <form onSubmit={submit}>
                <div className="mt-4">
                    <FloatInputText
                        label="Contraseña"
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        isFocused={true}
                        onChange={(e) => setData("password", e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        {processing ? (
                            <LoadingSpinner text="Cargando..." />
                        ) : (
                            "Confirmar"
                        )}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
