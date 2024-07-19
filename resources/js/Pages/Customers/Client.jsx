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
import ConfirmationModal from "@/Components/ConfirmationModal";
import TableCustom from "@/Components/TableCustom";
import CardsCustom from "@/Components/CardCustom";
import { useNotify } from "@/Components/Toast";

const Client = ({ auth, Sectors, Clients }) => {
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
        client_id: "",
        sector_id: "",
        sector_name: "",
        client_name: "",
        client_email: "",
        address: "",
        reference: "",
        phone_number: "",
        ids: [],
    });

    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [selectedClients, setSelectedClients] = useState([]);

    const notify = useNotify();

    const closeModalCreate = () => {
        clearErrors();
        setShowCreate(false);
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

    const openEditModal = (client) => {
        setShowEdit(true);
        setEditData(client);
        setData({
            client_id: client.client_id,
            sector_id: client.sector_id,
            sector_name: Sectors.find(
                (sector) => sector.sector_id === client.sector_id,
            )?.sector_name,
            client_name: client.client_name,
            client_email: client.client_email,
            address: client.address,
            reference: client.reference,
        });
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();

        post(route("clients.store"), {
            preserveScroll: true,
            onSuccess: () => {
                closeModalCreate();
                setShowModalConfirm(true);
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();

        patch(route("clients.update", { client: editData.client_id }), {
            preserveScroll: true,
            onSuccess: () => {
                closeEditModal();
                notify("success", "Cliente actualizado.");
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    const handleDelete = (id) => {
        if (Array.isArray(id)) {
            data.ids = id;
            destroy(route("clients.multiple.destroy"), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedClients([]);
                    closeDeleteModal();
                    notify("success", "Clientes eliminados.");
                },
                onError: (error) =>
                    console.error(Object.values(error).join(", ")),
            });
        } else {
            destroy(route("clients.destroy", { id }), {
                preserveScroll: true,
                onSuccess: () => {
                    closeDeleteModal();
                    notify("success", "Cliente eliminado.");
                },
                onError: (error) =>
                    console.error(Object.values(error).join(", ")),
            });
        }
    };

    const inputs = [
        {
            label: "Cédula",
            id: "client_id",
            type: "text",
            name: "client_id",
            value: data.client_id,
            onChange: (e) => setData("client_id", e.target.value),
            inputError: (
                <InputError message={errors.client_id} className="mt-2" />
            ),
            defaultValue: data.client_id,
        },
        {
            placeholder: "Sector",
            type: "select",
            labelKey: "sector_name",
            valueKey: "sector_id",
            options: Sectors,
            onSelect: (id) => setData("sector_id", id),
            inputError: (
                <InputError message={errors.sector_id} className="mt-2" />
            ),
            defaultValue: data.sector_name,
        },
        {
            label: "Nombres",
            id: "client_name",
            type: "text",
            name: "client_name",
            value: data.client_name,
            onChange: (e) => setData("client_name", e.target.value),
            inputError: (
                <InputError message={errors.client_name} className="mt-2" />
            ),
            defaultValue: data.client_name,
        },
        {
            label: "Email",
            id: "client_email",
            type: "email",
            name: "client_email",
            value: data.client_email,
            onChange: (e) => setData("client_email", e.target.value),
            inputError: (
                <InputError message={errors.client_email} className="mt-2" />
            ),
            defaultValue: data.client_email,
        },
        {
            label: "Dirección",
            id: "address",
            type: "text",
            name: "address",
            value: data.address,
            onChange: (e) => setData("address", e.target.value),
            inputError: (
                <InputError message={errors.address} className="mt-2" />
            ),
            defaultValue: data.address,
        },
        {
            label: "Referencia",
            id: "reference",
            type: "text",
            name: "reference",
            value: data.reference,
            onChange: (e) => setData("reference", e.target.value),
            inputError: (
                <InputError message={errors.reference} className="mt-2" />
            ),
            defaultValue: data.reference,
        },
    ];

    const inputsPhone = [
        {
            placeholder: "Cliente",
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
            label: "Número de telefono",
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

    const theaders = [
        "Cédula",
        "Nombres",
        "Sector",
        "Email",
        "Direccion",
        "Referencia",
    ];
    const searchColumns = [
        "client_id",
        "client_name",
        "sector_name",
        "client_email",
        "address",
        "reference",
    ];

    const handleCheckboxChange = (id) => {
        setSelectedClients((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedClients.length === Clients.length) {
            setSelectedClients([]);
        } else {
            setSelectedClients(Clients.map((client) => client.client_id));
        }
    };

    const openDeleteModalForSelected = () => {
        setShowDelete(true);
        setDataToDelete(selectedClients);
    };

    const [showCreatePhone, setShowCreatePhone] = useState(false);
    const [showModalConfirm, setShowModalConfirm] = useState(false);
    const closeModalConfirm = () => {
        setShowModalConfirm(false);
    };

    const handleConfirm = () => {
        closeModalConfirm();
        setShowCreatePhone(true);
    };

    const closeModalCreatePhone = () => {
        clearErrors();
        setShowCreatePhone(false);
        reset();
    };

    const handleSubmitAddPhone = (e) => {
        e.preventDefault();

        post(route("phones.store"), {
            preserveScroll: true,
            onSuccess: () => {
                closeModalCreatePhone();
                notify("success", "Télefono agregado.");
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Administrar Clientes" />}
            roles={auth.user.roles.map((role) => role.name)}
        >
            <Head title="Clientes" />
            <Tab tabs={tabs}>
                <Box>
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                        <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                            <AddButton onClick={openCreateModal} />
                            <DeleteButton
                                disabled={selectedClients.length === 0}
                                onClick={openDeleteModalForSelected}
                            />
                        </div>
                        <ExportData
                            data={Clients}
                            searchColumns={searchColumns}
                            headers={theaders}
                            fileName="Clientes"
                        />
                    </div>
                </Box>
                <ModalCreate
                    showCreate={showCreate}
                    closeModalCreate={closeModalCreate}
                    title={"Añadir Cliente"}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitAdd={handleSubmitAdd}
                />
                <DeleteModal
                    showDelete={showDelete}
                    closeDeleteModal={closeDeleteModal}
                    title={"Borrar Clientes"}
                    handleDelete={() => handleDelete(dataToDelete)}
                    processing={processing}
                />
                <ModalEdit
                    title="Editar Cliente"
                    showEdit={showEdit}
                    closeEditModal={closeEditModal}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitEdit={handleSubmitEdit}
                />
                <ConfirmationModal
                    title="Agregar número de teléfono"
                    message="El cliente se ha agregado con éxito. ¿Desea agregar un número de teléfono para este cliente?"
                    show={showModalConfirm}
                    onClose={closeModalConfirm}
                    onConfirm={handleConfirm}
                    processing={processing}
                />
                <ModalCreate
                    showCreate={showCreatePhone}
                    closeModalCreate={closeModalCreatePhone}
                    title={"Añadir Teléfono"}
                    inputs={inputsPhone}
                    processing={processing}
                    handleSubmitAdd={handleSubmitAddPhone}
                />
                <Box className="mt-3 hidden md:block">
                    <TableCustom
                        headers={theaders}
                        data={Clients}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="client_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedClients}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
                <Box className="mt-3  md:hidden">
                    <CardsCustom
                        headers={theaders}
                        data={Clients}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="client_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedClients}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
            </Tab>
        </Authenticated>
    );
};

export default Client;
