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

const Parish = ({ auth, Cantons, Parishes }) => {
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
        canton_id: "",
        canton_name: "",
        parish_name: "",
        ids: [],
    });

    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [selectedParishes, setSelectedParishes] = useState([]);
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

    const openEditModal = (parish) => {
        setShowEdit(true);
        setEditData(parish);
        setData({
            canton_id: parish.canton_id,
            canton_name: Cantons.find(
                (canton) => canton.canton_id === parish.canton_id,
            )?.canton_name,
            parish_name: parish.parish_name,
        });
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();

        post(route("parishes.store"), {
            preserveScroll: true,
            onSuccess: () => {
                closeModalCreate();
                notify("success", "Parroquia agregada.");
            },
            onError: (error) => console.error(error.message),
        });
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();

        patch(route("parishes.update", { id: editData.parish_id }), {
            preserveScroll: true,
            onSuccess: () => {
                closeEditModal();
                notify("success", "Parroquia actualizada.");
            },
            onError: (error) => console.error(error.message),
        });
    };

    const handleDelete = (id) => {
        if (Array.isArray(id)) {
            data.ids = id;
            destroy(route("parishes.multiple.destroy"), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedParishes([]);
                    closeDeleteModal();
                    notify("success", "Parroquias eliminadas.");
                },
                onError: (error) => console.error(error.message),
            });
        } else {
            destroy(route("parishes.destroy", { id }), {
                preserveScroll: true,
                onSuccess: () => {
                    closeDeleteModal();
                    notify("success", "Parroquia eliminada.");
                },
                onError: (error) => console.error(error),
            });
        }
    };

    const inputs = [
        {
            placeholder: "Canton",
            type: "select",
            labelKey: "canton_name",
            valueKey: "canton_id",
            options: Cantons,
            onSelect: (id) => setData("canton_id", id),
            inputError: (
                <InputError message={errors.canton_id} className="mt-2" />
            ),
            defaultValue: data.canton_name,
        },
        {
            label: "Nombre de la Parroquia",
            id: "parish_name",
            type: "text",
            name: "parish_name",
            value: data.parish_name,
            onChange: (e) => setData("parish_name", e.target.value),
            inputError: (
                <InputError message={errors.parish_name} className="mt-2" />
            ),
            defaultValue: data.parish_name,
        },
    ];

    const theaders = ["ID", "Canton", "Parroquia"];
    const searchColumns = ["parish_id", "canton_name", "parish_name"];

    const handleCheckboxChange = (id) => {
        setSelectedParishes((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedParishes.length === Parishes.length) {
            setSelectedParishes([]);
        } else {
            setSelectedParishes(Parishes.map((parish) => parish.parish_id));
        }
    };

    const openDeleteModalForSelected = () => {
        setShowDelete(true);
        setDataToDelete(selectedParishes);
    };

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Administrar Parroquias" />}
            roles={auth.user.roles.map((role) => role.name)}
        >
            <Head title="Parroquias" />
            <Tab tabs={tabs}>
                <Box>
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                        <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                            <AddButton onClick={openCreateModal} />
                            <DeleteButton
                                disabled={selectedParishes.length === 0}
                                onClick={openDeleteModalForSelected}
                            />
                        </div>
                        <ExportData
                            data={Parishes}
                            searchColumns={searchColumns}
                            headers={theaders}
                            fileName="Parroquias"
                        />
                    </div>
                </Box>
                <ModalCreate
                    showCreate={showCreate}
                    closeModalCreate={closeModalCreate}
                    title={"Añadir Parroquia"}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitAdd={handleSubmitAdd}
                />
                <DeleteModal
                    showDelete={showDelete}
                    closeDeleteModal={closeDeleteModal}
                    title={"Borrar Parroquias"}
                    handleDelete={() => handleDelete(dataToDelete)}
                    processing={processing}
                />
                <ModalEdit
                    title="Editar Parroquia"
                    showEdit={showEdit}
                    closeEditModal={closeEditModal}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitEdit={handleSubmitEdit}
                />
                <Box className="mt-3 hidden md:block">
                    <TableCustom
                        headers={theaders}
                        data={Parishes}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="parish_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedParishes}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
                <Box className="mt-3  md:hidden">
                    <CardsCustom
                        headers={theaders}
                        data={Parishes}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="parish_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedParishes}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
            </Tab>
        </Authenticated>
    );
};

export default Parish;
