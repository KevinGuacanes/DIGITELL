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

const Sector = ({ auth, Parishes, Sectors }) => {
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
        parish_id: "",
        parish_name: "",
        sector_name: "",
        description: "",
        ids: [],
    });

    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [selectedSectors, setSelectedSectors] = useState([]);
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

    const openEditModal = (sector) => {
        setShowEdit(true);
        setEditData(sector);
        setData({
            parish_id: sector.parish_id,
            parish_name: Parishes.find(
                (parish) => parish.parish_id === sector.parish_id,
            )?.parish_name,
            sector_name: sector.sector_name,
            description: sector.description,
        });
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();

        post(route("sectors.store"), {
            preserveScroll: true,
            onSuccess: () => {
                closeModalCreate();
                notify("success", "Sector agregado.");
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();

        patch(route("sectors.update", { id: editData.sector_id }), {
            preserveScroll: true,
            onSuccess: () => {
                closeEditModal();
                notify("success", "Sector actualizado.");
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    const handleDelete = (id) => {
        if (Array.isArray(id)) {
            data.ids = id;
            destroy(route("sectors.multiple.destroy"), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedSectors([]);
                    closeDeleteModal();
                    notify("success", "Sectores eliminados.");
                },
                onError: (error) =>
                    console.error(Object.values(error).join(", ")),
            });
        } else {
            destroy(route("sectors.destroy", { id }), {
                preserveScroll: true,
                onSuccess: () => {
                    closeDeleteModal();
                    notify("success", "Sector eliminado.");
                },
                onError: (error) =>
                    console.error(Object.values(error).join(", ")),
            });
        }
    };

    const inputs = [
        {
            label: "Nombre del Sector",
            id: "sector_name",
            type: "text",
            name: "sector_name",
            value: data.sector_name,
            onChange: (e) => setData("sector_name", e.target.value),
            inputError: (
                <InputError message={errors.sector_name} className="mt-2" />
            ),
            defaultValue: data.sector_name,
        },
        {
            placeholder: "Parroquia",
            type: "select",
            labelKey: "parish_name",
            valueKey: "parish_id",
            options: Parishes,
            onSelect: (id) => setData("parish_id", id),
            inputError: (
                <InputError message={errors.parish_id} className="mt-2" />
            ),
            defaultValue: data.parish_name,
        },
        {
            label: "Descripción",
            id: "description",
            type: "text",
            name: "description",
            value: data.description,
            onChange: (e) => setData("description", e.target.value),
            inputError: (
                <InputError message={errors.description} className="mt-2" />
            ),
            defaultValue: data.description,
        },
    ];

    const theaders = ["ID", "Nombre", "Parroquia", "Descripción"];
    const searchColumns = [
        "sector_id",
        "sector_name",
        "parish_name",
        "description",
    ];

    const handleCheckboxChange = (id) => {
        setSelectedSectors((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedSectors.length === Sectors.length) {
            setSelectedSectors([]);
        } else {
            setSelectedSectors(Sectors.map((sector) => sector.sector_id));
        }
    };

    const openDeleteModalForSelected = () => {
        setShowDelete(true);
        setDataToDelete(selectedSectors);
    };

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Administrar Sectores" />}
            roles={auth.user.roles.map((role) => role.name)}
        >
            <Head title="Sectores" />
            <Tab tabs={tabs}>
                <Box>
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                        <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                            <AddButton onClick={openCreateModal} />
                            <DeleteButton
                                disabled={selectedSectors.length === 0}
                                onClick={openDeleteModalForSelected}
                            />
                        </div>
                        <ExportData
                            data={Sectors}
                            searchColumns={searchColumns}
                            headers={theaders}
                            fileName="Sectores"
                        />
                    </div>
                </Box>
                <ModalCreate
                    showCreate={showCreate}
                    closeModalCreate={closeModalCreate}
                    title={"Añadir Sector"}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitAdd={handleSubmitAdd}
                />
                <DeleteModal
                    showDelete={showDelete}
                    closeDeleteModal={closeDeleteModal}
                    title={"Borrar Sectores"}
                    handleDelete={() => handleDelete(dataToDelete)}
                    processing={processing}
                />
                <ModalEdit
                    title="Editar Sector"
                    showEdit={showEdit}
                    closeEditModal={closeEditModal}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitEdit={handleSubmitEdit}
                />
                <Box className="mt-3 hidden md:block">
                    <TableCustom
                        headers={theaders}
                        data={Sectors}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="sector_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedSectors}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
                <Box className="mt-3  md:hidden">
                    <CardsCustom
                        headers={theaders}
                        data={Sectors}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="sector_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedSectors}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
            </Tab>
        </Authenticated>
    );
};

export default Sector;
