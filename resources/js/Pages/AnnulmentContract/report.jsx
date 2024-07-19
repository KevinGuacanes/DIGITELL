import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import Header from "@/Components/Header";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import Tab from "@/Layouts/TabLayout";
import Box from "@/Layouts/Box";
import ExportData from "@/Components/ExportData";
import tabs from "./tabs";
import TableReport from "@/Components/TableReport";
import CardsCustom from "@/Components/CardCustom";

const Contract = ({ auth, Contracts }) => {
    const {} = useForm({
        ids: [],
    });
    const [selectedContracts, setSelectedContracts] = useState([]);
    const handleSelectAll = () => {
        if (selectedContracts.length === Contracts.length) {
            setSelectedContracts([]);
        } else {
            setSelectedContracts(
                Contracts.map((contract) => contract.contract_num),
            );
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
                        <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2"></div>{" "}
                        <ExportData
                            data={Contracts}
                            searchColumns={searchColumns}
                            headers={theaders}
                            fileName="Contratos_Anulados"
                        />
                    </div>
                </Box>

                <Box className="mt-3 hidden md:block">
                    <TableReport
                        headers={theaders}
                        data={Contracts}
                        searchColumns={searchColumns}
                        idKey="contract_num"
                        selectedItems={selectedContracts}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
                <Box className="mt-3  md:hidden">
                    <CardsCustom
                        headers={theaders}
                        data={Contracts}
                        searchColumns={searchColumns}
                        idKey="contract_num"
                        selectedItems={selectedContracts}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
            </Tab>
        </Authenticated>
    );
};

export default Contract;
