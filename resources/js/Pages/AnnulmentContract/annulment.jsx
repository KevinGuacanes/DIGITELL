import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import Header from "@/Components/Header";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { DeleteButton } from "@/Components/CustomButtons";
import Tab from "@/Layouts/TabLayout";
import Box from "@/Layouts/Box";
import ExportData from "@/Components/ExportData";
import tabs from "./tabs";
import TableContractAdmin from "@/Components/TableContractAdmin";
import CardsCustom from "@/Components/CardCustom";
import { useNotify } from "@/Components/Toast";
import DeleteModal from "@/Components/DeleteModal";

const Contract = ({
    auth,

    Contracts,
}) => {
    const {
        data,
        processing,

        delete: destroy,
    } = useForm({
        ids: [],
    });
    const [showDelete, setShowDelete] = useState(false);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [selectedContracts, setSelectedContracts] = useState([]);

    const notify = useNotify();
    const closeDeleteModal = () => {
        setShowDelete(false);
        setDataToDelete(null);
    };

    const openDeleteModal = (id) => {
        setShowDelete(true);
        setDataToDelete(id);
    };

    const handleDelete = (id) => {
        if (Array.isArray(id)) {
            data.ids = id;
            destroy(route("contracts.multiple.destroy"), {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedContracts([]);
                    closeDeleteModal();
                    notify("success", "Contratos anulados.");
                },
                onError: (error) =>
                    console.error(Object.values(error).join(", ")),
            });
        } else {
            destroy(route("contracts.destroy", { id }), {
                preserveScroll: true,
                onSuccess: () => {
                    closeDeleteModal();
                    notify("success", "Contrato anulado.");
                },
                onError: (error) =>
                    console.error(Object.values(error).join(", ")),
            });
        }
    };

    const theaders = ["Id Contrato", "Cliente", "Plan", "Ip", "Estado"];
    const searchColumns = [
        "contract_num",
        "client_name",
        "plan_name",
        "ip_address",
        "status_name",
    ];

    const handleCheckboxChange = (id) => {
        setSelectedContracts((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedContracts.length === Contracts.length) {
            setSelectedContracts([]);
        } else {
            setSelectedContracts(
                Contracts.map((contract) => contract.contract_num),
            );
        }
    };
    const openDeleteModalForSelected = () => {
        setShowDelete(true);
        setDataToDelete(selectedContracts);
    };

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Anular Contratos" />}
            roles={auth.user.roles.map((role) => role.name)}
        >
            <Head title="Contratos" />
            <Tab tabs={tabs}>
                <Box>
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                        <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                            <DeleteButton
                                disabled={selectedContracts.length === 0}
                                onClick={openDeleteModalForSelected}
                            />
                        </div>

                        <ExportData
                            data={Contracts}
                            searchColumns={searchColumns}
                            headers={theaders}
                            fileName="Contratos_No_Anulados"
                        />
                    </div>
                </Box>
                <DeleteModal
                    showDelete={showDelete}
                    closeDeleteModal={closeDeleteModal}
                    title={"Anular Contrato"}
                    handleDelete={() => handleDelete(dataToDelete)}
                    processing={processing}
                />
                <Box className="mt-3 hidden md:block">
                    <TableContractAdmin
                        headers={theaders}
                        data={Contracts}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        idKey="contract_num"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedContracts}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
                <Box className="mt-3  md:hidden">
                    <CardsCustom
                        headers={theaders}
                        data={Contracts}
                        searchColumns={searchColumns}
                        onDelete={openDeleteModal}
                        idKey="contract_num"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedContracts}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
            </Tab>
        </Authenticated>
    );
};

export default Contract;
