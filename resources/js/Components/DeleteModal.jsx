import Modal from "./Modal";
import SecondaryButton from "./SecondaryButton";
import PrimaryButton from "./PrimaryButton";

const DeleteModal = ({
    title,
    showDelete,
    closeDeleteModal,
    handleDelete,
    processing,
}) => {
    return (
        <Modal show={showDelete} onClose={closeDeleteModal}>
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {title.toUpperCase()}
                </h3>
                <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        ¿Está seguro de que desea eliminar los elementos
                        seleccionados? Este la acción no se puede deshacer.
                    </p>
                </div>
                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={closeDeleteModal}>
                        Cancelar
                    </SecondaryButton>
                    <PrimaryButton
                        className="ms-3"
                        onClick={handleDelete}
                        disabled={processing}
                    >
                        Eliminar
                    </PrimaryButton>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteModal;
