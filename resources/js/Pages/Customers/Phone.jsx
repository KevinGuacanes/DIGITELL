import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import Header from "@/Components/Header";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import Tab from "@/Layouts/TabLayout";
import { AddButton, DeleteButton } from "@/Components/CustomButtons";
import InputError from "@/Components/InputError";
import ModalCreate from "@/Components/ModalCreate";
import ModalEdit from "@/Components/ModalEdit";
import Box from "@/Layouts/Box";
import ExportData from "@/Components/ExportData";
import tabs from "./tabs";
import DeleteModal from "@/Components/DeleteModal";
import TableCustom from "@/Components/TableCustom";
import CardsCustom from "@/Components/CardCustom";
import { useNotify } from "@/Components/Toast";

const Phone = ({ auth, Clients, Phones }) => {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        delete: destroy,
        patch,
        clearErrors,
    } = useForm({
        phone_number: "",
        client_id: "",
        client_name: "",
        ids: [],
    });

    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [selectedPhones, setSelectedPhones] = useState([]);
    const notify = useNotify();

    const closeModalCreate = () => {
        clearErrors();
        setShowCreate(false);
        reset();
    };

    const openCreateModal = () => setShowCreate(true);

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

    const openEditModal = (phone) => {
        setShowEdit(true);
        setEditData(phone);
        setData({
            phone_number: phone.phone_number,
            client_id: phone.client_id,
            client_name: Clients.find(
                (client) => client.client_id === phone.client_id,
            )?.client_name,
        });
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();

        post(route("phones.store"), {
            preserveScroll: true,
            onSuccess: () => {
                closeModalCreate();
                notify("success", "Télefono agregado.");
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();

        patch(route("phones.update", { phone: editData.phone_number }), {
            preserveScroll: true,
            onSuccess: () => {
                closeEditModal();
                notify("success", "Télefono actualizado.");
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    const handleDelete = (id) => {
        if (Array.isArray(id)) {
            data.ids = id;
            destroy(route("phones.multiple.destroy"), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedPhones([]);
                    closeDeleteModal();
                    notify("success", "Télefonos eliminados.");
                },
            });
        } else {
            destroy(route("phones.destroy", { id }), {
                preserveScroll: true,
                onSuccess: () => {
                    closeDeleteModal();
                    notify("success", "Télefono eliminado.");
                },
                onError: (error) =>
                    console.error(Object.values(error).join(", ")),
            });
        }
    };

    const inputs = [
        {
            placeholder: "Cliente cédula",
            type: "select",
            labelKey: "client_name",
            valueKey: "client_id",
            options: Clients,
            onSelect: (id) => setData("client_id", id),
            inputError: (
                <InputError message={errors.client_id} className="mt-2" />
            ),
            defaultValue: data.client_name,
        },
        {
            label: "Número de teléfono",
            id: "phone_number",
            type: "text",
            name: "phone_number",
            value: data.phone_number,
            onChange: (e) => setData("phone_number", e.target.value),
            inputError: (
                <InputError message={errors.phone_number} className="mt-2" />
            ),
            defaultValue: data.phone_number,
        },
    ];

    const theaders = ["Número Teléfono", "Cédula", "Nombre"];
    const searchColumns = ["phone_number", "client_id", "client_name"];

    const handleCheckboxChange = (id) => {
        setSelectedPhones((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedPhones.length === Phones.length) {
            setSelectedPhones([]);
        } else {
            setSelectedPhones(Phones.map((phone) => phone.phone_number));
        }
    };

    const openDeleteModalForSelected = () => {
        setShowDelete(true);
        setDataToDelete(selectedPhones);
    };

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Administrar Teléfonos" />}
            roles={auth.user.roles.map((role) => role.name)}
        >
            <Head title="Phonees" />
            <Tab tabs={tabs}>
                <Box>
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                        <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                            <AddButton onClick={openCreateModal} />
                            <DeleteButton
                                disabled={selectedPhones.length === 0}
                                onClick={openDeleteModalForSelected}
                            />
                        </div>
                        <ExportData
                            data={Phones}
                            searchColumns={searchColumns}
                            headers={theaders}
                            fileName="Teléfonos"
                        />
                    </div>
                </Box>
                <ModalCreate
                    showCreate={showCreate}
                    closeModalCreate={closeModalCreate}
                    title={"Añadir Teléfono"}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitAdd={handleSubmitAdd}
                />
                <DeleteModal
                    showDelete={showDelete}
                    closeDeleteModal={closeDeleteModal}
                    title={"Borrar Teléfono"}
                    handleDelete={() => handleDelete(dataToDelete)}
                    processing={processing}
                />
                <ModalEdit
                    title="Editar Teléfono"
                    showEdit={showEdit}
                    closeEditModal={closeEditModal}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitEdit={handleSubmitEdit}
                />
                <Box className="mt-3 hidden md:block">
                    <TableCustom
                        headers={theaders}
                        data={Phones}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="phone_number"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedPhones}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
                <Box className="mt-3  md:hidden">
                    <CardsCustom
                        headers={theaders}
                        data={Phones}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="phone_number"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedPhones}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
            </Tab>
        </Authenticated>
    );
};

export default Phone;
