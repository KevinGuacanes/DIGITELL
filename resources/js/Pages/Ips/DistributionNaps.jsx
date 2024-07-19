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
import axios from "axios";
import { useNotify } from "@/Components/Toast";

const distributionNap = ({ auth, Olts, DistributionNaps }) => {
    const [selectedOlt, setSelectedOlt] = useState("");
    const [availablePorts, setAvailablePorts] = useState([]);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        clearErrors,
        reset,
        delete: destroy,
        patch,
    } = useForm({
        olt_id: "",
        olt_ports: "",
        olt_name:"",
        distribution_nap_name: "",
        distribution_nap_address: "",
        distribution_nap_coordx: "",
        distribution_nap_coordy: "",
        distribution_nap_splitter: "",
        ids: [],
    });

    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [selectedOption, setSelectedOption] = useState("");
    const [selectedSplitter, setSelectedSplitter] = useState("");
    const [selectedDistributionNaps, setSelectedDistributionNaps] = useState(
        [],
    );
    const notify = useNotify();

    useEffect(() => {
        if (selectedOlt) {
            setSelectedOption("");
            fetchAvailablePorts(selectedOlt);
        }
    }, [selectedOlt]);

 
    const fetchAvailablePorts = (oltId) => {
        axios
            .get(`/manage-ips/distributionNaps/${oltId}/available-ports`)
            .then((response) => {
                const availablePorts = Object.values(response.data);
                const transformedPorts = transformForCombobox(availablePorts);
                setAvailablePorts(transformedPorts);
            })
            .catch((error) => {
                console.error("Error fetching available ports:", error);
            });
    };
    const closeDeleteModal = () => {
        setShowDelete(false);
        setDataToDelete(null);
    };

    const openDeleteModal = (id) => {
        setShowDelete(true);
        setDataToDelete(id);
    };

    const openCreateModal = () => {
        reset();
        setShowCreate(true);
        setSelectedOption("");
        setSelectedSplitter("");

    };

    const closeModalCreate = () => {
        setShowCreate(false);
        reset();
        clearErrors();
    };

    const closeEditModal = () => {
        setShowEdit(false);
        setEditData(null);
        reset();
        clearErrors();
    };

    const openEditModal = (distributionNap) => {
        setShowEdit(true);
        setEditData(distributionNap); 
        setSelectedSplitter(distributionNap.distribution_nap_splitter);
            const olt = Olts.find(
                (olt) => olt.olt_id === distributionNap.olt_id,
            );
        
        setData({
            olt_id: olt.olt_id,
            olt_name: olt.olt_name,
            distribution_nap_name: distributionNap.distribution_nap_name,
            distribution_nap_address: distributionNap.distribution_nap_address,
            distribution_nap_coordx: distributionNap.distribution_nap_coordx,
            distribution_nap_coordy: distributionNap.distribution_nap_coordy,
            olt_ports: distributionNap.olt_ports,
            distribution_nap_splitter:
                distributionNap.distribution_nap_splitter,
        });

        if (distributionNap.olt_id) {
            fetchAvailablePorts(distributionNap.olt_id);
        }
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();

        post(route("distributionNaps.store"), {
            preserveScroll: true,
            onSuccess: () => {
                closeModalCreate();
                setSelectedOption("");
                if (data.olt_id) {
                    fetchAvailablePorts(data.olt_id);
                }
                notify("success", "Nap agregada.");
                setSelectedSplitter("");
                setSelectedOption("");
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });

    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();

        patch(
            route("distributionNaps.update", {
                id: editData.distribution_nap_id,
            }),
            {
                preserveScroll: true,
                onSuccess: () => {
                    closeEditModal();
                    if (data.olt_id) {
                        fetchAvailablePorts(data.olt_id);
                    }
                    notify("success", "Nap Actualizada.");
                },
                onError: (error) => console.error(Object.values(error).join(", ")),
            },
        );
    };

    const handleDelete = (id) => {
        if (Array.isArray(id)) {
            data.ids = id;
            destroy(route("distributionNaps.multiple.destroy"), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedDistributionNaps([]);
                    closeDeleteModal();
                    if (data.olt_id) {
                        fetchAvailablePorts(data.olt_id);
                    }
                    notify("success", "Naps Eliminadas.");
                },
                onError: (error) => console.error(Object.values(error).join(", ")),
            });
        } else {
            destroy(route("distributionNaps.destroy", { id }), {
                preserveScroll: true,
                onSuccess: () => {
                    closeDeleteModal();
                    if (data.olt_id) {
                        fetchAvailablePorts(data.olt_id);
                    }
                    notify("success", "Nap eliminada.");
                },
                onError: (error) => console.error(Object.values(error).join(", ")),
            });
        }
    };
    const transformForCombobox = (arrays) => {
        return arrays.map((array) => ({
            value: array,
            label: `${array}`,
        }));
    };
    const handleChange = (value) => {
        setSelectedOption(value);
        setData("olt_ports", value);
    };
    const handleChangeSplitter = (value) => {
        setSelectedSplitter(value);
        setData("distribution_nap_splitter", value);
    };
    const comboboxspliter = transformForCombobox([8, 16]);

    const inputs = [
        {
            placeholder: "Olt",
            type: "select",
            labelKey: "olt_name",
            valueKey: "olt_id",
            options: Olts,
            onSelect: (id) => {
                setSelectedOlt(id);
                setData("olt_id", id);
            },
            inputError: <InputError message={errors.olt_id} className="mt-2" />,
            defaultValue: data.olt_name,
        },
        {
            type: "combobox",
            label: "Puerto",
            options: availablePorts,
            value: selectedOption,
            onChange: handleChange,
            inputError: (
                <InputError message={errors.olt_ports} className="mt-2" />
            ),
            defaultValue: data.olt_ports,
        },

        {
            label: "Nombre",
            id: "distribution_nap_name",
            type: "text",
            name: "distribution_nap_name",
            value: data.distribution_nap_name,
            onChange: (e) => setData("distribution_nap_name", e.target.value),
            inputError: (
                <InputError
                    message={errors.distribution_nap_name}
                    className="mt-2"
                />
            ),
            defaultValue: data.distribution_nap_name,
        },
        {
            label: "Dirección ",
            id: "distribution_nap_address",
            type: "text",
            name: "distribution_nap_address",
            value: data.distribution_nap_address,
            onChange: (e) =>
                setData("distribution_nap_address", e.target.value),
            inputError: (
                <InputError
                    message={errors.distribution_nap_address}
                    className="mt-2"
                />
            ),
            defaultValue: data.distribution_nap_address,
        },
        {
            label: "Coordenada X",
            id: "distribution_nap_coordx",
            type: "text",
            name: "distribution_nap_coordx",
            value: data.distribution_nap_coordx,
            onChange: (e) => {
                let inputValue = e.target.value;
                if (inputValue.length > 25) {
                    inputValue = inputValue.slice(0, 25);
                }
                const onlyNumbers = inputValue.replace(/[^0-9]/g, "");
                setData("distribution_nap_coordx", onlyNumbers);
            },
            inputError: (
                <InputError
                    message={errors.distribution_nap_coordx}
                    className="mt-2"
                />
            ),
            defaultValue: data.distribution_nap_coordx,
        },
        {
            label: "Coordenada Y",
            id: "distribution_nap_coordy",
            type: "text",
            name: "distribution_nap_coordy",
            value: data.distribution_nap_coordy,
            onChange: (e) => {
                let inputValue = e.target.value;
                if (inputValue.length > 25) {
                    inputValue = inputValue.slice(0, 25);
                }
                const onlyNumbers = inputValue.replace(/[^0-9]/g, "");
                setData("distribution_nap_coordy", onlyNumbers);
            },
            inputError: (
                <InputError
                    message={errors.distribution_nap_coordy}
                    className="mt-2"
                />
            ),
            defaultValue: data.distribution_nap_coordy,
        },
        {
            type: "combobox",
            label: "splitter",
            options: comboboxspliter,
            value: selectedSplitter,
            onChange: handleChangeSplitter,
            inputError: (
                <InputError
                    message={errors.distribution_nap_splitter}
                    className="mt-2"
                />
            ),
        },
    ];

    const theaders = [
        "ID",
        "OLT",
        "Nombre ",
        "Dirección",
        "OLT Ports",
    ];
    const searchColumns = [
        "distribution_nap_id",
        "olt_name",
        "distribution_nap_name",
        "distribution_nap_address",
        "olt_ports",
    ];

    const handleCheckboxChange = (id) => {
        setSelectedDistributionNaps((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedDistributionNaps.length === DistributionNaps.length) {
            setSelectedDistributionNaps([]);
        } else {
            setSelectedDistributionNaps(
                DistributionNaps.map((nap) => nap.distribution_nap_id),
            );
        }
    };

    const openDeleteModalForSelected = () => {
        setShowDelete(true);
        setDataToDelete(selectedDistributionNaps);
    };

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Administrar Naps de Distribución" />}
            roles={auth.user.roles.map((role) => role.name)}
        >
            <Head title="distribucion de Naps" />
            <Tab tabs={tabs}>
                <Box>
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                        <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                            <AddButton onClick={openCreateModal} />
                            <DeleteButton
                                disabled={selectedDistributionNaps.length === 0}
                                onClick={openDeleteModalForSelected}
                            />
                        </div>
                        <ExportData
                            data={DistributionNaps}
                            searchColumns={searchColumns}
                            headers={theaders}
                        />
                    </div>
                </Box>
                <ModalCreate
                    showCreate={showCreate}
                    closeModalCreate={closeModalCreate}
                    title={"Agregar Nap de Distribución"}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitAdd={handleSubmitAdd}
                    errors={errors}
                />
                <DeleteModal
                    showDelete={showDelete}
                    closeDeleteModal={closeDeleteModal}
                    title={"Eliminar Nap de distribución"}
                    handleDelete={() => handleDelete(dataToDelete)}
                    processing={processing}
                />
                <ModalEdit
                    title="Editar Nap de Distribución"
                    showEdit={showEdit}
                    closeEditModal={closeEditModal}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitEdit={handleSubmitEdit}
                />
                <Box className="mt-3 hidden md:block">
                    <TableCustom
                        headers={theaders}
                        data={DistributionNaps}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="distribution_nap_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedDistributionNaps}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
                <Box className="mt-3  md:hidden">
                    <CardsCustom
                        headers={theaders}
                        data={DistributionNaps}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="distribution_nap_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedDistributionNaps}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
            </Tab>
        </Authenticated>
    );
};

export default distributionNap;
