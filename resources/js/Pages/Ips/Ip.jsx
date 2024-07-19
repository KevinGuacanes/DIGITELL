import { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import Header from "@/Components/Header";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import Tab from "@/Layouts/TabLayout";
import ExportData from "@/Components/ExportData";
import tabs from "./tabs";
import TableCustomViewOnly from "@/Components/TableCustomViewOnly";
import Box from "@/Layouts/Box";
import CardsCustom from "@/Components/CardCustomViewOnly";
import Combobox from "@/Components/ComboBox"; // Importa el componente Combobox

const Ips = ({ auth, Ips, lastMileNaps }) => {
    const { data, setData, errors } = useForm({
        ip_address: "",
        last_mile_nap_id: "",
        ip_status: false,
    });

    const [selectedIps, setSelectedIps] = useState([]);
    const [filteredIps, setFilteredIps] = useState([]);

    const getStatusLabel = (status) => {
        return status ? "Activa" : "Inactiva";
    };

    const theaders = ["Dirección IP", "NAP de Última Milla", "Estado"];

    const searchColumns = [
        "ip_address",
        "last_mile_nap_name",
        "ip_status_label",
    ];

    useEffect(() => {
        if (data.last_mile_nap_id) {
            const filtered = Ips.filter(
                (ip) => ip.last_mile_nap_id === data.last_mile_nap_id,
            );
            setFilteredIps(filtered);
        } else {
            setFilteredIps(Ips);
        }
    }, [data.last_mile_nap_id, Ips]);

    const modifiedIps = filteredIps.map((ip) => ({
        ...ip,
        ip_status_label: getStatusLabel(ip.ip_status),
    }));

    const handleSelectAll = () => {
        if (selectedIps.length === Ips.length) {
            setSelectedIps([]);
        } else {
            setSelectedIps(Ips.map((ip) => ip.ip_address));
        }
    };

    const handleSelectChange = (id) => {
        if (selectedIps.includes(id)) {
            setSelectedIps(selectedIps.filter((item) => item !== id));
        } else {
            setSelectedIps([...selectedIps, id]);
        }
    };

    const handleNapChange = (value) => {
        setData("last_mile_nap_id", value);
    };

    // Preparar las opciones para el Combobox
    const napOptions = [
        { value: "", label: "NAP de Última Milla" },
        ...lastMileNaps.map((nap) => ({
            value: nap.last_mile_nap_id,
            label: nap.last_mile_nap_name,
        })),
    ];

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Administrar IPs" />}
            roles={auth.user.roles.map((role) => role.name)}
        >
            <Head title="IPs" />
            <Tab tabs={tabs}>
                <Box>
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                        <div className="relative w-full sm:w-auto flex flex-wrap justify-center gap-2">
                            <Combobox
                                options={napOptions}
                                label="NAP de Última Milla"
                                value={data.last_mile_nap_id}
                                onChange={handleNapChange}
                                inputError={errors.last_mile_nap_id}
                                className="w-full max-w-xs "
                            />
                        </div>
                        <ExportData
                            data={Ips}
                            searchColumns={searchColumns}
                            headers={theaders}
                        />
                    </div>
                </Box>
                <Box className="mt-3 hidden md:block">
                    <TableCustomViewOnly
                        headers={theaders}
                        data={modifiedIps}
                        searchColumns={searchColumns}
                        idKey="ip_address"
                        selectedItems={selectedIps}
                        onSelectAll={handleSelectAll}
                        onSelectChange={handleSelectChange}
                    />
                </Box>
                <Box className="mt-3 md:hidden">
                    <CardsCustom
                        headers={theaders}
                        data={modifiedIps}
                        searchColumns={searchColumns}
                        idKey="ip_address"
                        onSelectChange={handleSelectChange}
                        selectedItems={selectedIps}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
            </Tab>
        </Authenticated>
    );
};

export default Ips;