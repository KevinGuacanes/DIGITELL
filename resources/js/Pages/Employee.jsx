import { useState, useEffect } from "react";
import { useForm, Head } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import Header from "@/Components/Header";
import Box from "@/Layouts/Box";
import { DeleteButton } from "@/Components/CustomButtons";
import TableCustom from "@/Components/TableCustom";
import CardsCustom from "@/Components/CardCustom";
import DeleteModal from "@/Components/DeleteModal";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import ExportData from "@/Components/ExportData";
import { useNotify } from "@/Components/Toast";

const Employee = ({ auth, roles, employees }) => {
    const notify = useNotify();
    const {
        data,
        setData,
        processing,
        reset,
        delete: destroy,
        patch,
        clearErrors,
    } = useForm({
        role_id: [],
        ids: [],
    });

    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [selectedEmployees, setSelectedEmployees] = useState([]);

    const closeDeleteModal = () => {
        setShowDelete(false);
        setDataToDelete(null);
    };

    const openDeleteModal = (id) => {
        setShowDelete(true);
        setDataToDelete(id);
    };

    const closeEditModal = () => {
        clearErrors();
        setShowEdit(false);
        setEditData(null);
        reset();
    };

    const openEditModal = (employee) => {
        setEditData(employee);
        setData({
            role_id: employee.roles.map((role) => role.role_id),
        });
        setShowEdit(true);
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();
        patch(route("employees.update", { id: editData.user_id }), {
            preserveScroll: true,
            onSuccess: () => {
                closeEditModal();
                notify("success", "Empleado actualizado.");
            },
            onError: (error) => console.error(error.message),
        });
    };

    const handleDelete = (id) => {
        if (Array.isArray(id)) {
            data.ids = id;
            destroy(route("employees.destroyMultiple"), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedEmployees([]);
                    closeDeleteModal();
                    notify("success", "Empleados eliminados.");
                },
                onError: (error) => console.error(error.message),
            });
        } else {
            destroy(route("employees.destroy", { id }), {
                preserveScroll: true,
                onSuccess: () => {
                    closeDeleteModal();
                    notify("success", "Empleado eliminado.");
                },
                onError: (error) => console.error(error),
            });
        }
    };

    const theaders = ["ID", "Empleado", "Roles"];
    const searchColumns = ["user_id", "user_name", "roles"];

    const handleCheckboxChange = (id) => {
        setSelectedEmployees((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedEmployees.length === employees.length) {
            setSelectedEmployees([]);
        } else {
            setSelectedEmployees(employees.map((employee) => employee.user_id));
        }
    };

    const openDeleteModalForSelected = () => {
        setShowDelete(true);
        setDataToDelete(selectedEmployees);
    };

    return (
        <Authenticated
            user={auth.user}
            roles={auth.user.roles.map((role) => role.name)}
            header={<Header subtitle="Empleados" />}
        >
            <Head title="Empleados" />
            <Box className="mt-3">
                <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                    <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                        <DeleteButton
                            disabled={selectedEmployees.length === 0}
                            onClick={openDeleteModalForSelected}
                        />
                    </div>
                    <ExportData
                        data={employees}
                        searchColumns={searchColumns}
                        headers={theaders}
                        fileName="Empleados"
                    />
                </div>
            </Box>
            <ModalEdit
                title="Editar Roles"
                showEdit={showEdit}
                closeEditModal={closeEditModal}
                processing={processing}
                handleSubmitEdit={handleSubmitEdit}
                roles={roles}
                initialSelectedRoles={data.role_id}
                setData={setData}
            />
            <DeleteModal
                showDelete={showDelete}
                closeDeleteModal={closeDeleteModal}
                title={"Borrar Empleado"}
                handleDelete={() => handleDelete(dataToDelete)}
                processing={processing}
            />
            <Box className="mt-3 hidden md:block">
                <TableCustom
                    headers={theaders}
                    data={employees}
                    searchColumns={searchColumns}
                    onDelete={openDeleteModal}
                    onEdit={openEditModal}
                    idKey="user_id"
                    onSelectChange={handleCheckboxChange}
                    selectedItems={selectedEmployees}
                    onSelectAll={handleSelectAll}
                />
            </Box>
            <Box className="mt-3  md:hidden">
                <CardsCustom
                    headers={theaders}
                    data={employees}
                    searchColumns={searchColumns}
                    onDelete={openDeleteModal}
                    onEdit={openEditModal}
                    idKey="user_id"
                    onSelectChange={handleCheckboxChange}
                    selectedItems={selectedEmployees}
                    onSelectAll={handleSelectAll}
                />
            </Box>
        </Authenticated>
    );
};

export default Employee;

const ModalEdit = ({
    title,
    showEdit,
    closeEditModal,
    processing,
    handleSubmitEdit,
    roles,
    initialSelectedRoles = [],
    setData,
}) => {
    const [selectedRoles, setSelectedRoles] = useState(initialSelectedRoles);

    useEffect(() => {
        setSelectedRoles(initialSelectedRoles);
    }, [initialSelectedRoles]);

    const handleRoleChange = (roleId) => {
        const updatedRoles = selectedRoles.includes(roleId)
            ? selectedRoles.filter((id) => id !== roleId)
            : [...selectedRoles, roleId];

        setSelectedRoles(updatedRoles);
        setData((prevData) => ({ ...prevData, role_id: updatedRoles }));
    };
    return (
        <Modal show={showEdit} onClose={closeEditModal}>
            <form onSubmit={handleSubmitEdit} className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {title.toUpperCase()}
                </h3>
                <div className="mt-4">
                    {roles.map((role) => (
                        <div key={role.id} className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                id={`role-${role.id}`}
                                checked={selectedRoles.includes(role.id)}
                                onChange={() => handleRoleChange(role.id)}
                                className="mr-2 rounded dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800"
                            />
                            <label
                                htmlFor={`role-${role.id}`}
                                className="text-sm text-gray-700 dark:text-gray-300"
                            >
                                {role.name}
                            </label>
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
