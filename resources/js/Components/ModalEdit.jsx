import Modal from "./Modal";
import FloatInputText from "./FloatInputText";
import SearchDropdown from "./SearchInput";
import SecondaryButton from "./SecondaryButton";
import PrimaryButton from "./PrimaryButton";
import ComboBox from "./ComboBox";

const ModalEdit = ({
    title,
    showEdit,
    closeEditModal,
    inputs,
    processing,
    handleSubmitEdit,
}) => {
    return (
        <Modal show={showEdit} onClose={closeEditModal}>
            <form onSubmit={handleSubmitEdit} className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {title.toUpperCase()}
                </h3>
                <div className="mt-4">
                    {inputs &&
                        inputs.map((input, index) => (
                            <div key={index}>
                                {input.type === "select" ? (
                                    <SearchDropdown
                                        {...input}
                                        className="mt-3 block w-full"
                                        defaultValue={input.defaultValue}
                                    />
                                ) : input.type === "combobox" ? (
                                    <ComboBox
                                        {...input}
                                        className="mt-3 block w-full"
                                        defaultValue={input.defaultValue}
                                    />
                                ) : (
                                    <FloatInputText
                                        {...input}
                                        isFocused={index === 0}
                                        className="mt-3 block w-full"
                                        defaultValue={input.defaultValue}
                                    />
                                )}
                                {input.inputError}
                            </div>
                        ))}
                </div>
                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={closeEditModal}>
                        Cancelar
                    </SecondaryButton>

                    <PrimaryButton className="ms-3" disabled={processing}>
                        Actualizar
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
};

export default ModalEdit;
