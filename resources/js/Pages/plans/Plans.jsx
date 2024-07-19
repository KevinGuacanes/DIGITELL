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

const Plan = ({ auth, Plans }) => {
    const { data, setData, post, patch, delete: destroy, processing, errors,
        clearErrors, reset } = useForm({
        plan_id: "",
        plan_name: "",
        plan_value: "",
        plan_megas: "",
        plan_description: "",
    });

    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [selectedPlans, setSelectedPlans] = useState([]);

    const openCreateModal = () => {
        reset();
        setShowCreate(true);
    };

    const closeModalCreate = () => {
        setShowCreate(false);
        reset();
        clearErrors();
    };

    const closeDeleteModal = () => {
        setShowDelete(false);
        setDataToDelete(null);
    };

    const openDeleteModal = (id) => {
        setShowDelete(true);
        setDataToDelete(id);
        reset();
    };

    const closeEditModal = () => {
        setShowEdit(false);
        setEditData(null);
        reset();
        clearErrors();
    };

    const openEditModal = (plan) => {
        setShowEdit(true);
        setEditData(plan);
        setData({
            plan_id: plan.plan_id,
            plan_name: plan.plan_name,
            plan_value: plan.plan_value,
            plan_megas: plan.plan_megas,
            plan_description: plan.plan_description,
        });
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();

        post(route("plans.store"), {
            preserveScroll: true,
            onSuccess: () => {closeModalCreate();
                closeDeleteModal();
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();

        patch(route("plans.update", { id: editData.plan_id }), {
            preserveScroll: true,
            onSuccess: () => closeEditModal(),
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    const handleDelete = (id) => {
        if (Array.isArray(id)) {
            data.ids = id;
            destroy(route("plans.multiple.destroy"), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedPlans([]);
                    closeDeleteModal();
                },
                onError: (error) => console.error(Object.values(error).join(", ")),
            });
        } else {
            destroy(route("plans.destroy", { id }), {
                preserveScroll: true,
                onSuccess: () => closeDeleteModal(),
                onError: (error) => console.error(Object.values(error).join(", ")),
            });
        }
    };

    const inputs = [
        {
            label: " Nombre",
            id: "plan_name",
            type: "text",
            name: "plan_name",
            value: data.plan_name,
            onChange: (e) => setData("plan_name", e.target.value),
            inputError: <InputError message={errors.plan_name} className="mt-2" />,
            defaultValue: data.plan_name,
        },
        {
            label: "Valor",
            id: "plan_value",
            type: "number",
            name: "plan_value",
            value: data.plan_value,
            onChange: (e) => setData("plan_value", e.target.value),
            inputError: <InputError message={errors.plan_value} className="mt-2" />,
            defaultValue: data.plan_value,
        },
        {
            label: " Megas",
            id: "plan_megas",
            type: "number",
            name: "plan_megas",
            value: data.plan_megas,
            onChange: (e) => setData("plan_megas", e.target.value),
            inputError: <InputError message={errors.plan_megas} className="mt-2" />,
            defaultValue: data.plan_megas,
            min: "0", 
        },
        {
            label: "Descripción",
            id: "plan_description",
            type: "text",
            name: "plan_description",
            value: data.plan_description,
            onChange: (e) => setData("plan_description", e.target.value),
            inputError: <InputError message={errors.plan_description} className="mt-2" />,
            defaultValue: data.plan_description,
        },
    ];

    const theaders = [
        "Plan ID",
        " Nombre",
        " Valor",
        " Megas",
        "Descripción",
    ];

    const searchColumns = [
        "plan_id",
        "plan_name",
        "plan_value",
        "plan_megas",
        "plan_description",
    ];

    const handleCheckboxChange = (id) => {
        setSelectedPlans((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedPlans.length === Plans.length) {
            setSelectedPlans([]);
        } else {
            setSelectedPlans(Plans.map((plan) => plan.plan_id));
        }
    };

    const openDeleteModalForSelected = () => {
        setShowDelete(true);
        setDataToDelete(selectedPlans);
    };

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Administrar Planes" />}
            roles={auth.user.roles.map((role) => role.name)}
        >
            <Head title="Planes" />
            <Tab tabs={tabs}>
                <Box>
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                        <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                            <AddButton onClick={openCreateModal} />
                            <DeleteButton
                                disabled={selectedPlans.length === 0}
                                onClick={openDeleteModalForSelected}
                            />
                        </div>
                        <ExportData
                            data={Plans}
                            searchColumns={searchColumns}
                            headers={theaders}
                        />
                    </div>
                </Box>
                <ModalCreate
                    showCreate={showCreate}
                    closeModalCreate={closeModalCreate}
                    title={"Agregar Plan"}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitAdd={handleSubmitAdd}
                />
                <DeleteModal
                    showDelete={showDelete}
                    closeDeleteModal={closeDeleteModal}
                    title={"Eliminar Plan"}
                    handleDelete={() => handleDelete(dataToDelete)}
                    processing={processing}
                />
                <ModalEdit
                    title="Editar Plan"
                    showEdit={showEdit}
                    closeEditModal={closeEditModal}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitEdit={handleSubmitEdit}
                />
                <Box className="mt-3 hidden md:block">
                    <TableCustom
                        headers={theaders}
                        data={Plans}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="plan_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedPlans}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
                <Box className="mt-3 md:hidden">
                    <CardsCustom
                        headers={theaders}
                        data={Plans}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="plan_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedPlans}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
            </Tab>
        </Authenticated>
    );
};

export default Plan;
