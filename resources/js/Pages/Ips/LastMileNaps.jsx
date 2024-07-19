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

const lastmileNaps = ({ auth, Olts, DistributionNaps, LastMileNaps }) => {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        clearErrors,
        delete: destroy,
        patch,
    } = useForm({
        olt_id: "",
        olt_name: "",
        distribution_nap_id: "",
        distribution_nap_name: "",
        last_mile_nap_name: "",
        last_mile_nap_address: "",
        last_mile_nap_coordx: "",
        last_mile_nap_coordy: "",
        last_mile_nap_splitter: "",
        ids: [],
    });

    const [showCreate, setShowCreate] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [selectedSplitter, setSelectedSplitter] = useState("");
    const [selectedLastMileNaps, setSelectedLastMileNaps] = useState([]);
    const [selectedOlt, setSelectedOlt] = useState("");
    const [filteredDistributionNaps, setFilteredDistributionNaps] = useState(
        [],
    );
    const notify = useNotify();

    const handleOltChange = (id) => {
        setSelectedOlt(id);
        const filteredNaps = DistributionNaps.filter(
            (nap) => nap.olt_id === id,
        );
        setFilteredDistributionNaps(filteredNaps);
        setData("distribution_nap_id", "");
    };
    const openCreateModal = () => {
        setSelectedSplitter("");
        reset();
        setShowCreate(true);
    };
    const closeModalCreate = () => {
        clearErrors();
        setShowCreate(false);
        reset();
    };
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

    const openEditModal = (lastMileNap) => {
        setShowEdit(true);
        setEditData(lastMileNap);
        setSelectedSplitter(lastMileNap.last_mile_nap_splitter);
        let distributionNapName = "";
        let olt = "";
        let olts= "";
            const distributionNap = DistributionNaps.find(
                (distribution) =>
                    distribution.distribution_nap_id ===
                lastMileNap.distribution_nap_id,
            );
            if (distributionNap) {
                distributionNapName =
                    distributionNap.distribution_nap_name;

               olt = Olts.find(
                    (olt) => olt.olt_id === distributionNap.olt_id,
                );
                olts= olt.olt_id;

            }
        
        setData({
            olt_id:olts,
            olt_name: olt.olt_name,
            distribution_nap_id: lastMileNap.distribution_nap_id,
            distribution_nap_name: lastMileNap.distribution_nap_name,
            last_mile_nap_name: lastMileNap.last_mile_nap_name,
            last_mile_nap_address: lastMileNap.last_mile_nap_address,
            last_mile_nap_coordx: lastMileNap.last_mile_nap_coordx,
            last_mile_nap_coordy: lastMileNap.last_mile_nap_coordy,
            last_mile_nap_splitter: lastMileNap.last_mile_nap_splitter,
        });


    };
    const handleDistributionNapChange = (id) => {
        setData("distribution_nap_id", id);
        const distributionNap = DistributionNaps.find(
            (nap) => nap.distribution_nap_id === id,
        );
        if (distributionNap) {
            const lastMileCount = LastMileNaps.filter(
                (nap) => nap.distribution_nap_id === id,
            ).length;
            if (lastMileCount >= distributionNap.distribution_nap_splitter) {
                setData((prevData) => ({
                    ...prevData,
                    distribution_nap_error:
                        "La NAP de distribución ya ha alcanzado el número máximo de NAPs de última milla permitidas.",
                }));
            }
        }
    };
    const handleSubmitAdd = (e) => {
        e.preventDefault();

        post(route("lastmileNaps.store"), {
            preserveScroll: true,
            onSuccess: () => {
                closeModalCreate(), notify("success", "Nap agregada.");
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();

        patch(
            route("lastmileNaps.update", {
                id: editData.last_mile_nap_id,
            }),
            {
                preserveScroll: true,
                onSuccess: () => {
                    closeEditModal(), notify("success", "Nap actualizada.");
                },
                onError: (error) => console.error(Object.values(error).join(", ")),
            },
        );
    };

    const handleDelete = (id) => {
        if (Array.isArray(id)) {
            data.ids = id;
            destroy(route("lastmileNaps.multiple.destroy"), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedLastMileNaps([]);
                    closeDeleteModal();
                    notify("success", "Naps eliminadas.");
                },
                onError: (error) => console.error(Object.values(error).join(", ")),
            });
        } else {
            destroy(route("lastmileNaps.destroy", { id }), {
                preserveScroll: true,
                onSuccess: () => {
                    closeDeleteModal(), notify("success", "Nap eliminada.");
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
    const handleChangeSplitter = (value) => {
        setSelectedSplitter(value); // Actualiza el estado cuando cambia la selección del splitter
        setData("last_mile_nap_splitter", value);
    };
    const comboboxspliter = transformForCombobox([8, 16]);

    const handleCheckboxChange = (id) => {
        setSelectedLastMileNaps((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedLastMileNaps.length === LastMileNaps.length) {
            setSelectedLastMileNaps([]);
        } else {
            setSelectedLastMileNaps(
                LastMileNaps.map((nap) => nap.last_mile_nap_id),
            );
        }
    };

    const openDeleteModalForSelected = () => {
        setShowDelete(true);
        setDataToDelete(selectedLastMileNaps);
    };

    const inputs = [
        {
            placeholder: "OLT",
            type: "select",
            labelKey: "olt_name",
            valueKey: "olt_id",
            options: Olts,
            value: selectedOlt,
            onSelect: handleOltChange,
            inputError: <InputError message={errors.olt_id} className="mt-2" />,
            defaultValue: data.olt_name,

        },
        {
            placeholder: "Nap de Distribución",
            type: "select",
            labelKey: "distribution_nap_name",
            valueKey: "distribution_nap_id",
            options: filteredDistributionNaps,
            value: data.distribution_nap_id,
            onSelect: handleDistributionNapChange,
            inputError: (
                <InputError
                    message={errors.distribution_nap_id}
                    className="mt-2"
                />
            ),
            defaultValue: data.distribution_nap_name,
        },
        {
            label: "Nombre ",
            id: "last_mile_nap_name",
            type: "text",
            name: "last_mile_nap_name",
            value: data.last_mile_nap_name,
            onChange: (e) => setData("last_mile_nap_name", e.target.value),
            inputError: (
                <InputError
                    message={errors.last_mile_nap_name}
                    className="mt-2"
                />
            ),
            defaultValue: data.last_mile_nap_name,
        },
        {
            label: "Dirección",
            id: "last_mile_nap_address",
            type: "text",
            name: "last_mile_nap_address",
            value: data.last_mile_nap_address,
            onChange: (e) => setData("last_mile_nap_address", e.target.value),
            inputError: (
                <InputError
                    message={errors.last_mile_nap_address}
                    className="mt-2"
                />
            ),
            defaultValue: data.last_mile_nap_address,
        },
        {
            label: "Coordenada X",
            id: "last_mile_nap_coordx",
            type: "text",
            name: "last_mile_nap_coordx",
            value: data.last_mile_nap_coordx,
            onChange: (e) => {
                let inputValue = e.target.value;
                if (inputValue.length > 25) {
                    inputValue = inputValue.slice(0, 25);
                }
                const onlyNumbers = inputValue.replace(/[^0-9]/g, "");
                setData("last_mile_nap_coordx", onlyNumbers);
            },
            inputError: (
                <InputError
                    message={errors.last_mile_nap_coordx}
                    className="mt-2"
                />
            ),
            defaultValue: data.last_mile_nap_coordx,
        },
        {
            label: "Coordenada Y",
            id: "last_mile_nap_coordy",
            type: "text",
            name: "last_mile_nap_coordy",
            value: data.last_mile_nap_coordy,
            onChange: (e) => {
                let inputValue = e.target.value;
                if (inputValue.length > 25) {
                    inputValue = inputValue.slice(0, 25);
                }
                const onlyNumbers = inputValue.replace(/[^0-9]/g, "");
                setData("last_mile_nap_coordy", onlyNumbers);
            },
            inputError: (
                <InputError
                    message={errors.last_mile_nap_coordy}
                    className="mt-2"
                />
            ),
            defaultValue: data.last_mile_nap_coordy,
        },
        {
            type: "combobox",
            label: "Splitter",
            options: comboboxspliter,
            value: selectedSplitter,
            onChange: handleChangeSplitter,
            inputError: (
                <InputError
                    message={errors.last_mile_nap_splitter}
                    className="mt-2"
                />
            ),
            defaultValue: data.last_mile_nap_splitter,
        },
    ];
    const theaders = [
        "ID",
        "NAP de distribución",
        "Nombre",
        "Dirección",
        "Splitter",
    ];
    const searchColumns = [
        "last_mile_nap_id",
        "distribution_nap_name",
        "last_mile_nap_name",
        "last_mile_nap_address",
        "last_mile_nap_splitter",
    ];

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Administrar Naps Ultima Milla" />}
            roles={auth.user.roles.map((role) => role.name)}
        >
            <Head title="Naps Ultima Milla" />
            <Tab tabs={tabs}>
                <Box>
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                        <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                            <AddButton onClick={openCreateModal} />
                            <DeleteButton
                                disabled={selectedLastMileNaps.length === 0}
                                onClick={openDeleteModalForSelected}
                            />
                        </div>
                        <ExportData
                            data={LastMileNaps}
                            searchColumns={searchColumns}
                            headers={theaders}
                        />
                    </div>
                </Box>
                <ModalCreate
                    showCreate={showCreate}
                    closeModalCreate={closeModalCreate}
                    title={"Agregar Nap Ulima Milla"}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitAdd={handleSubmitAdd}
                />
                <DeleteModal
                    showDelete={showDelete}
                    closeDeleteModal={closeDeleteModal}
                    title={"Eliminar Nap "}
                    handleDelete={() => handleDelete(dataToDelete)}
                    processing={processing}
                />
                <ModalEdit
                    title="Editar Nap "
                    showEdit={showEdit}
                    closeEditModal={closeEditModal}
                    inputs={inputs}
                    processing={processing}
                    handleSubmitEdit={handleSubmitEdit}
                />
                <Box className="mt-3 hidden md:block">
                    <TableCustom
                        headers={theaders}
                        data={LastMileNaps}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="last_mile_nap_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedLastMileNaps}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
                <Box className="mt-3  md:hidden">
                    <CardsCustom
                        headers={theaders}
                        data={LastMileNaps}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        onEdit={openEditModal}
                        idKey="last_mile_nap_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedLastMileNaps}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
            </Tab>
        </Authenticated>
    );
};

export default lastmileNaps;
