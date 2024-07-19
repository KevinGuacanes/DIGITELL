import { useState, useEffect } from "react";
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

const Olts = ({ auth, Olts}) => {
    const { data, setData, post, processing, errors,clearErrors, reset,patch, delete:destroy } = useForm({
        olt_id: "",
        olt_name: "",
        olt_address: "",
        olt_coordx: "",
        olt_coordy: "",
        olt_ports: "",
    });

    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [selectedOlts, setSelectedOlts] = useState([]);
    const [selectedOption, setSelectedOption] = useState("");
    
    useEffect(() => {
        if (editData) {
            setSelectedOption(editData.olt_ports);
        }
    }, [editData]);
   
    const transformForCombobox = (arrays) => {
        return arrays.map((array) => ({
            value: array,
            label: `${array}`,
        }));
    };
    const openCreateModal = () => {
        setSelectedOption("");
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
        clearErrors();
    };
    const openDeleteModal = (id) => {
        setShowDelete(true);
        setDataToDelete(id);
    };

    const closeEditModal = () => {
        setShowEdit(false);
        setEditData(null);
        clearErrors();
    };
    const openEditModal = (olt) => {
        setShowEdit(true);
        setEditData(olt);
        setData({
            olt_id: olt.olt_id,
            olt_name: olt.olt_name,
            olt_address: olt.olt_address,
            olt_coordx: olt.olt_coordx,
            olt_coordy: olt.olt_coordy,
            olt_ports: olt.olt_ports,
        });
    };
    const handleChange = (value) => {
        setSelectedOption(value); // Actualiza el estado cuando cambia la selección
        setData("olt_ports", value);
    };
    const handleSubmitAdd = (e) => {
        e.preventDefault();
        clearErrors('olt_ports');  // Limpia los errores específicos de olt_ports
        post(route("olts.store"), {
            preserveScroll: true,
            onSuccess: () => closeModalCreate(),
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();

        patch(route("olts.update", { id: editData.olt_id }), {
            preserveScroll: true,
            onSuccess: () => closeEditModal(),
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    const handleDelete = (id) => {
        if (Array.isArray(id)) {
            data.ids = id;
            destroy(route("olts.multiple.destroy"), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedOlts([]);
                    closeDeleteModal();
                },
                onError: (error) => console.error(Object.values(error).join(", ")),
            });
        } else {
            destroy(route("olts.destroy", { id }), {
                preserveScroll: true,
                onSuccess: () => closeDeleteModal(),
                onError: (error) => console.error(Object.values(error).join(", ")),
            });
        }
    };
    const comboboxports = transformForCombobox([4,8,16,24]);

    const inputs = [
        {
            label: " Nombre",
            id: "olt_name",
            type: "text",
            name: "olt_name",
            value: data.olt_name,
            onChange: (e) => setData("olt_name", e.target.value),
            inputError: (
                <InputError message={errors.olt_name} className="mt-2" />
            ),
            defaultValue: data.olt_name,
        },
        {
            label: "Dirección",
            id: "olt_address",
            type: "text",
            name: "olt_address",
            value: data.olt_address,
            onChange: (e) => setData("olt_address", e.target.value),
            inputError: (
                <InputError message={errors.olt_address} className="mt-2" />
            ),
            defaultValue: data.olt_address,
        },
        {
            label: "Coordenada X",
            id: "olt_coordx",
            type: "text",
            name: "olt_coordx",
            value: data.olt_coordx,
            onChange: (e) => {
                let inputValue = e.target.value;
                if (inputValue.length > 25) {
            inputValue = inputValue.slice(0, 25);
        }                const onlyNumbers = inputValue.replace(/[^0-9]/g, ''); // Eliminar todo lo que no sea número
                setData("olt_coordx", onlyNumbers);
            },
            inputError: (
                <InputError message={errors.olt_coordx} className="mt-2" />
            ),

            defaultValue: data.olt_coordx,
        },
        {
            label: "Coordenada Y",
            id: "olt_coordy",
            type: "text",
            name: "olt_coordy",
            value: data.olt_coordy,
            onChange: (e) => {
                let inputValue = e.target.value;
                if (inputValue.length > 25) {
            inputValue = inputValue.slice(0, 25);
        }                const onlyNumbers = inputValue.replace(/[^0-9]/g, ''); // Eliminar todo lo que no sea número
                setData("olt_coordy", onlyNumbers);
            },
            inputError: (
                <InputError message={errors.olt_coordy} className="mt-2" />
            ),
            defaultValue: data.olt_coordy,
        },
        {
            type: "combobox",
            label: "Puerto",
            options: comboboxports,
            value: selectedOption,
            onChange: handleChange,
            inputError: (
                <InputError message={errors.olt_ports} className="mt-2" />),
            defaultValue: data.olt_ports,
        },
    ];


    const theaders = [
        " ID",
        "Nombre",
        " Direccion",
        "Puertos",
    ];
    
    const searchColumns = [
        "olt_id",
        "olt_name",
        "olt_address",
        "olt_ports",
    ];

    const handleCheckboxChange = (id) => {
        setSelectedOlts((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedOlts.length === Olts.length) {
            setSelectedOlts([]);
        } else {
            setSelectedOlts(Olts.map((olt) =>olt.olt_id));
        }
    };

    const openDeleteModalForSelected = () => {
        setShowDelete(true);
        setDataToDelete(selectedOlts);
    };

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Aministrar Olts" />}
            roles={auth.user.roles.map((role) => role.name)}
        >
            <Head title="Olts" />
            <Tab tabs={tabs}>
                <Box>
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                        <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                            <AddButton onClick={openCreateModal} />
                            <DeleteButton
                                disabled={selectedOlts.length === 0}
                                onClick={openDeleteModalForSelected}
                            />
                        </div>
                        <ExportData
                            data={Olts}
                            searchColumns={searchColumns}
                            headers={theaders}
                        />
                    </div>
                </Box>
                <ModalCreate
                    showCreate={showCreate}
                    closeModalCreate={closeModalCreate}
                    title={"Agregar Olt"}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitAdd={handleSubmitAdd}
                />
                <DeleteModal
                    showDelete={showDelete}
                    closeDeleteModal={closeDeleteModal}
                    title={"Eliminar Olt"}
                    handleDelete={() => handleDelete(dataToDelete)}
                    processing={processing}
                />
                <ModalEdit
                    title="Editar Olt"
                    showEdit={showEdit}
                    closeEditModal={closeEditModal}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitEdit={handleSubmitEdit}
                />
                <Box className="mt-3 hidden md:block">
                    <TableCustom
                        headers={theaders}
                        data={Olts}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="olt_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedOlts}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
                <Box className="mt-3  md:hidden">
                    <CardsCustom
                        headers={theaders}
                        data={Olts}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="olt_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedOlts}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
            </Tab>
        </Authenticated>
    );
};

export default Olts;
