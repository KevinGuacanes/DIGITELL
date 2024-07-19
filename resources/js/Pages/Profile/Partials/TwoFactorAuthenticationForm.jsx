import { router, useForm, usePage } from "@inertiajs/react";
import axios from "axios";
import React, { useState } from "react";
import ConfirmsPassword from "@/Components/ConfirmsPassword";
import DangerButton from "@/Components/DangerButton";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import FloatInputText from "@/Components/FloatInputText";
import { useNotify } from "@/Components/Toast";

export default function TwoFactorAuthenticationForm() {
    const { auth } = usePage().props;
    const [enabling, setEnabling] = useState(false);
    const [disabling, setDisabling] = useState(false);
    const [qrCode, setQrCode] = useState(null);
    const [recoveryCodes, setRecoveryCodes] = useState([]);
    const [confirming, setConfirming] = useState(false);
    const [setupKey, setSetupKey] = useState(null);
    const confirmationForm = useForm({
        code: "",
    });
    const twoFactorEnabled =
        !enabling &&
        auth.user?.two_factor_secret &&
        auth.user?.two_factor_confirmed_at;
    const notify = useNotify();

    function enableTwoFactorAuthentication() {
        setEnabling(true);

        router.post(
            "/user/two-factor-authentication",
            {},
            {
                preserveScroll: true,
                onSuccess() {
                    return Promise.all([
                        showQrCode(),
                        showSetupKey(),
                        showRecoveryCodes(),
                    ]);
                },
                onFinish() {
                    setEnabling(false);
                    setConfirming(true);
                },
            },
        );
    }

    async function showSetupKey() {
        const response = await axios.get("/user/two-factor-secret-key");
        setSetupKey(response.data.secretKey);
    }

    function confirmTwoFactorAuthentication() {
        confirmationForm.post("/user/confirmed-two-factor-authentication", {
            preserveScroll: true,
            preserveState: true,
            errorBag: "confirmTwoFactorAuthentication",
            onSuccess: () => {
                setConfirming(false);
                setQrCode(null);
                setSetupKey(null);
                notify("success", "2FA Habilitada.")
            },
            onError: (errors) => {
                console.error("Error al confirmar 2FA:", errors);
            },
        });
    }

    async function showQrCode() {
        const response = await axios.get("/user/two-factor-qr-code");
        setQrCode(response.data.svg);
    }

    async function showRecoveryCodes() {
        const response = await axios.get("/user/two-factor-recovery-codes");
        setRecoveryCodes(response.data);
    }

    function regenerateRecoveryCodes() {
        axios.post("/user/two-factor-recovery-codes").then(() => {
            showRecoveryCodes();
        });
    }

    function disableTwoFactorAuthentication() {
        setDisabling(true);

        router.delete("/user/two-factor-authentication", {
            preserveScroll: true,
            onSuccess() {
                setDisabling(false);
                setConfirming(false);
                notify("success", "2FA Deshabilitada.")
            },
        });
    }

    return (
        <>
            {(() => {
                if (twoFactorEnabled) {
                    return (
                        <h3 className="text-lg font-medium text-gray-900">
                            Has habilitado la autenticación de dos factores.
                        </h3>
                    );
                }
                if (
                    confirming ||
                    (auth.user?.two_factor_secret &&
                        !auth.user?.two_factor_confirmed_at)
                ) {
                    return (
                        <h3 className="text-lg font-medium text-gray-900">
                            Termina de habilitar la autenticación de dos
                            factores.
                        </h3>
                    );
                }
                return (
                    <h3 className="text-lg font-medium text-gray-900">
                        No has habilitado la autenticación de dos factores.
                    </h3>
                );
            })()}

            <div className="mt-3 max-w-xl text-sm text-gray-600">
                <p>
                    Cuando la autenticación de dos factores está habilitada, se
                    te solicitará un token seguro y aleatorio durante la
                    autenticación. Puedes obtener este token desde la aplicación
                    Google Authenticator de tu teléfono.
                </p>
            </div>

            {twoFactorEnabled || confirming ? (
                <div>
                    {qrCode ? (
                        <div>
                            <div className="mt-4 max-w-xl text-sm text-gray-600">
                                {confirming ? (
                                    <p className="font-semibold">
                                        Para finalizar la habilitación de la
                                        autenticación de dos factores, escanea
                                        el siguiente código QR usando la
                                        aplicación autenticadora de tu teléfono
                                        o ingresa la clave de configuración y
                                        proporciona el código OTP generado.
                                    </p>
                                ) : (
                                    <p>
                                        La autenticación de dos factores está
                                        ahora habilitada. Escanea el siguiente
                                        código QR usando la aplicación
                                        autenticadora de tu teléfono o ingresa
                                        la clave de configuración.
                                    </p>
                                )}
                            </div>

                            <div
                                className="mt-4"
                                dangerouslySetInnerHTML={{
                                    __html: qrCode || "",
                                }}
                            />

                            {setupKey && (
                                <div className="mt-4 max-w-xl text-sm text-gray-600">
                                    <p className="font-semibold">
                                        Clave de configuración:{" "}
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: setupKey || "",
                                            }}
                                        />
                                    </p>
                                </div>
                            )}

                            {confirming &&
                                !auth.user.two_factor_confirmed_at && (
                                    <div className="mt-4">
                                        <FloatInputText
                                            label="Código"
                                            id="code"
                                            type="text"
                                            name="code"
                                            className="mt-1 block w-1/2"
                                            inputMode="numeric"
                                            autoFocus={true}
                                            autoComplete="one-time-code"
                                            value={confirmationForm.data.code}
                                            onChange={(e) =>
                                                confirmationForm.setData(
                                                    "code",
                                                    e.currentTarget.value,
                                                )
                                            }
                                        />

                                        <InputError
                                            message={
                                                confirmationForm.errors.code
                                            }
                                            className="mt-2"
                                        />
                                    </div>
                                )}
                        </div>
                    ) : null}

                    {recoveryCodes.length > 0 && !confirming ? (
                        <div>
                            <div className="mt-4 max-w-xl text-sm text-gray-600">
                                <p className="font-semibold">
                                    Guarda estos códigos de recuperación en un
                                    gestor de contraseñas seguro. Pueden ser
                                    utilizados para recuperar el acceso a tu
                                    cuenta si pierdes tu dispositivo de
                                    autenticación de dos factores.
                                </p>
                            </div>

                            <div className="mt-4 grid max-w-xl gap-1 rounded-lg bg-gray-100 px-4 py-4 font-mono text-sm">
                                {recoveryCodes.map((code) => (
                                    <div key={code}>{code}</div>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </div>
            ) : null}

            <div className="mt-5">
                {twoFactorEnabled || confirming ? (
                    <div>
                        {confirming ? (
                            <ConfirmsPassword
                                onConfirm={confirmTwoFactorAuthentication}
                            >
                                <PrimaryButton
                                    className="me-2"
                                    disabled={enabling}
                                >
                                    Confirmar
                                </PrimaryButton>
                            </ConfirmsPassword>
                        ) : null}
                        {recoveryCodes.length > 0 && !confirming ? (
                            <ConfirmsPassword
                                onConfirm={regenerateRecoveryCodes}
                            >
                                <SecondaryButton className="mr-3">
                                    Regenerar códigos de recuperación
                                </SecondaryButton>
                            </ConfirmsPassword>
                        ) : null}
                        {recoveryCodes.length === 0 && !confirming ? (
                            <ConfirmsPassword onConfirm={showRecoveryCodes}>
                                <SecondaryButton className="mr-3">
                                    Mostrar códigos de recuperación
                                </SecondaryButton>
                            </ConfirmsPassword>
                        ) : null}

                        {confirming ? (
                            <ConfirmsPassword
                                onConfirm={disableTwoFactorAuthentication}
                            >
                                <SecondaryButton
                                    className=""
                                    disabled={disabling}
                                >
                                    Cancelar
                                </SecondaryButton>
                            </ConfirmsPassword>
                        ) : (
                            <ConfirmsPassword
                                onConfirm={disableTwoFactorAuthentication}
                            >
                                <DangerButton className="" disabled={disabling}>
                                    Deshabilitar
                                </DangerButton>
                            </ConfirmsPassword>
                        )}
                    </div>
                ) : (
                    <div>
                        <ConfirmsPassword
                            onConfirm={enableTwoFactorAuthentication}
                        >
                            <PrimaryButton type="button" disabled={enabling}>
                                Habilitar
                            </PrimaryButton>
                        </ConfirmsPassword>
                    </div>
                )}
            </div>
        </>
    );
}
