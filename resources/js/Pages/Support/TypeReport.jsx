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

const TypeReport = ({ auth, Orders, Reports }) => {
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
        type_order_id: "",
        type_report_id: "",
        name_type_order: "",
        name_type_report: "",
        description_type_report: "",
        ids: [],
    });

    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [selectedReports, setSelectedReports] = useState([]);
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

    const openEditModal = (typeReport) => {
        setEditData(typeReport);
        setData({
            type_order_id: typeReport.type_order_id,
            name_type_order:typeReport.name_type_order,
            name_type_report: typeReport.name_type_report,
            description_type_report: typeReport.description_type_report,
        });
        setShowEdit(true);
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();

        post(route("typereport.store"), {
            preserveScroll: true,
            onSuccess: () => {
                closeModalCreate();
                notify("success", "Tipo de reporte agregado.");
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();

        patch(route("typereport.update", { id: editData.type_report_id }), {
            preserveScroll: true,
            onSuccess: () => {
                closeEditModal();
                notify("success", "Tipo de reporte actualizado.");
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    const handleDelete = (id) => {
        if (Array.isArray(id)) {
            data.ids = id;
            destroy(route("typereport.multiple.destroy"), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedReports([]);
                    closeDeleteModal();
                    notify("success", "Tipos de reportes eliminados.");
                },
                onError: (error) =>
                    console.error(Object.values(error).join(", ")),
            });
        } else {
            destroy(route("typereport.destroy", { id }), {
                preserveScroll: true,
                onSuccess: () => {
                    closeDeleteModal();
                    notify("success", "Tipo de reporte eliminado.");
                },
                onError: (error) =>
                    console.error(Object.values(error).join(", ")),
            });
        }
    };

    const inputs = [
        {
            placeholder: "Orden",
            type: "select",
            labelKey: "name_type_order",
            valueKey: "type_order_id",
            options: Orders,
            onSelect: (id) => setData("type_order_id", id),
            inputError: (
                <InputError message={errors.type_order_id} className="mt-2" />
            ),
            defaultValue: data.name_type_order,
        },
        {
            label: "Nombre",
            id: "name_type_report",
            type: "text",
            name: "name_type_report",
            value: data.name_type_report,
            onChange: (e) => setData("name_type_report", e.target.value),
            inputError: (
                <InputError
                    message={errors.name_type_report}
                    className="mt-2"
                />
            ),
            defaultValue: data.type_report_id,
        },
        {
            label: "Descripción",
            id: "description_type_report",
            type: "text",
            name: "description_type_report",
            value: data.description_type_report,
            onChange: (e) => setData("description_type_report", e.target.value),
            inputError: (
                <InputError
                    message={errors.description_type_report}
                    className="mt-2"
                />
            ),
            defaultValue: data.description_type_report,
        },
    ];

    const theaders = ["ID", "Tipo de Orden", "Reporte", "Descripción"];
    const searchColumns = [
        "type_report_id",
        "name_type_order",
        "name_type_report",
        "description_type_report",
    ];

    const handleCheckboxChange = (id) => {
        setSelectedReports((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedReports.length === Reports.length) {
            setSelectedReports([]);
        } else {
            setSelectedReports(Reports.map((report) => report.type_report_id));
        }
    };

    const openDeleteModalForSelected = () => {
        setShowDelete(true);
        setDataToDelete(selectedReports);
    };

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Tipos de Reportes" />}
            roles={auth.user.roles.map((role) => role.name)}
        >
            <Head title="Tipos de Reportes" />
            <Tab tabs={tabs}>
                <Box>
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                        <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                            <AddButton onClick={openCreateModal} />
                            <DeleteButton
                                disabled={selectedReports.length === 0}
                                onClick={openDeleteModalForSelected}
                            />
                        </div>
                        <ExportData
                            data={Reports}
                            searchColumns={searchColumns}
                            headers={theaders}
                            fileName="tipos_de_reporte"
                        />
                    </div>
                </Box>
                <ModalCreate
                    showCreate={showCreate}
                    closeModalCreate={closeModalCreate}
                    title="Añadir tipo de reporte"
                    inputs={inputs}
                    processing={processing}
                    handleSubmitAdd={handleSubmitAdd}
                />
                <DeleteModal
                    showDelete={showDelete}
                    closeDeleteModal={closeDeleteModal}
                    title="Borrar tipo de reporte"
                    handleDelete={() => handleDelete(dataToDelete)}
                    processing={processing}
                />
                <ModalEdit
                    title="Editar tipo reporte"
                    showEdit={showEdit}
                    closeEditModal={closeEditModal}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitEdit={handleSubmitEdit}
                />
                <Box className="mt-3 hidden md:block">
                    <TableCustom
                        headers={theaders}
                        data={Reports}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="type_report_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedReports}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
                <Box className="mt-3 md:hidden">
                    <CardsCustom
                        headers={theaders}
                        data={Reports}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="type_report_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedReports}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
            </Tab>
        </Authenticated>
    );
};

export default TypeReport;
