import axios from "axios";
import React, { useRef, useState } from "react";
import Modal from "@/Components/Modal";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import FloatInputText from "./FloatInputText";

const ConfirmsPassword = ({
    title = "Confirmar Contraseña",
    content = "Para tu seguridad, por favor confirma tu contraseña para continuar.",
    button = "Confirmar",
    onConfirm,
    children,
}) => {
    const [confirmingPassword, setConfirmingPassword] = useState(false);
    const [form, setForm] = useState({
        password: "",
        error: "",
        processing: false,
    });
    const passwordRef = useRef(null);

    const startConfirmingPassword = () => {
        axios.get(route("password.confirmation")).then((response) => {
            if (response.data.confirmed) {
                onConfirm();
            } else {
                setConfirmingPassword(true);
                setTimeout(() => passwordRef.current?.focus(), 250);
            }
        });
    };

    const confirmPassword = () => {
        setForm({ ...form, processing: true });

        axios
            .post(route("password.confirm.2fa"), {
                password: form.password,
            })
            .then(() => {
                closeModal();
                setTimeout(() => onConfirm(), 250);
            })
            .catch((error) => {
                setForm({
                    ...form,
                    processing: false,
                    error: error.response.data.errors.password[0],
                });
                passwordRef.current?.focus();
            });
    };

    const closeModal = () => {
        setConfirmingPassword(false);
        setForm({ processing: false, password: "", error: "" });
    };

    return (
        <span>
            <span onClick={startConfirmingPassword}>{children}</span>

            <Modal show={confirmingPassword} onClose={closeModal}>
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {title}
                    </h2>
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                        {content}
                    </p>

                    <div className="mt-4">
                        <FloatInputText
                            label="Contraseña"
                            type="password"
                            className="mt-1 block w-3/4"
                            placeholder="Password"
                            value={form.password}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    password: e.currentTarget.value,
                                })
                            }
                            ref={passwordRef}
                        />

                        <InputError message={form.error} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal}>
                            Cancelar
                        </SecondaryButton>

                        <PrimaryButton
                            onClick={confirmPassword}
                            disabled={form.processing}
                        >
                            {button}
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </span>
    );
};

export default ConfirmsPassword;
