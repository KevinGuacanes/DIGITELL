import React from "react";
import Modal from "./Modal";
import SecondaryButton from "./SecondaryButton";
import PrimaryButton from "./PrimaryButton";

const ConfirmationModal = ({
    title,
    message,
    show,
    onClose,
    onConfirm,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    processing = false,
}) => {
    return (
        <Modal show={show} onClose={onClose}>
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {title.toUpperCase()}
                </h3>
                <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {message}
                    </p>
                </div>
                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={onClose}>
                        {cancelText}
                    </SecondaryButton>
                    <PrimaryButton
                        className="ms-3"
                        onClick={onConfirm}
                        disabled={processing}
                    >
                        {confirmText}
                    </PrimaryButton>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;
