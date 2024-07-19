import React, { useState } from "react";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import { router } from "@inertiajs/react";
import { TbLoaderQuarter } from "react-icons/tb";
import LoadingSpinner from "./LoadingSpinner";

const SessionExpiredModal = ({ show, closeModal }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleRedirectToLogin = () => {
        setIsProcessing(true);
        router.visit("/login", {
            method: "get",
            preserveState: false,
            preserveScroll: false,
            replace: true,
            onFinish: () => setIsProcessing(false),
        });
    };

    return (
        <Modal show={show} onClose={closeModal}>
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    SESIÓN EXPIRADA
                </h3>
                <div className="mt-4">
                    <p className="text-gray-800 dark:text-gray-300">
                        Tu sesión ha expirado. Por favor, vuelve a iniciar
                        sesión.
                    </p>
                </div>
                <div className="mt-6 flex justify-end">
                    <PrimaryButton
                        className="ms-3"
                        onClick={handleRedirectToLogin}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <LoadingSpinner text="Redirigiendo..." />
                        ) : (
                            "Ir a iniciar sesión"
                        )}
                    </PrimaryButton>
                </div>
            </div>
        </Modal>
    );
};

export default SessionExpiredModal;
