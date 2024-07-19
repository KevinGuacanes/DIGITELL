import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import Header from "@/Components/Header";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import Tab from "@/Layouts/TabLayout";
import { AddButton } from "@/Components/CustomButtons";
import InputError from "@/Components/InputError";
import ModalCreate from "@/Components/ContractModel";
import ModalEdit from "@/Components/ContractEdit";
import Box from "@/Layouts/Box";
import ExportData from "@/Components/ExportData";
import tabs from "./tabs";
import TableContract from "@/Components/TableContract";
import CardsCustom from "@/Components/CardCustom";
import { useNotify } from "@/Components/Toast";
import ModalCreateOrder from "@/Components/orderModel";
import ConfirmationModal from "@/Components/ConfirmationModal";

const Contract = ({
    auth,
    Clients,
    Employees,
    TypeReports,
    TypeOrders,
    Plans,
    Olts,
    LastMiles,
    Distributions,
    Ips,
    Status,
    Discounts,
    Phones,
    Contracts,
    WorkOrders,
}) => {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,

        patch,
        clearErrors,
    } = useForm({
        client_id: "",
        contract_num: "",
        contract_id: "",
        installation_date: "",
        maximum_date: "",
        plan_id: "",
        plan_name: "",
        plan_value: "",
        plan_megas: "",
        client_name: "",
        client_email: "",
        address: "",
        reference: "",
        phone_numbers: "",
        parish_name: "",
        province_name: "",
        sector_name: "",
        canton_name: "",
        olt_id: "",
        olt_name: "",
        distribution_nap_id: "",
        distribution_nap_name: "",
        last_mile_nap_id: "",
        last_mile_nap_name: "",
        ip_address: "",
        discount_id: "",
        discount_name: "",
        status_id: "",
        status_name: "",
        type_order_id: "",
        plan_details: "",

        employee_id: "",
        employee_name: "",
        type_report_id: "",
        name_type_report: "",
        name_type_order: "",
        order_channel: "",
        issue_date: "",
        order_precedents: "",
        order_status: "",
        order_abclaim: "",
        solution_date: "",
        order_initial_abis: "",
        order_initial_potency: "",
        order_final_abis: "",
        order_initial_diagnosis: "",
        order_solution: "",
        order_final_potency: "",
        order_final_diagnosis: "",
        value_due: "",

        ids: [],
    });
    const [showCreate, setShowCreate] = useState(false);

    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);

    const [selectedContracts, setSelectedContracts] = useState([]);
    //napdistribution
    const [selectedOlt, setSelectedOlt] = useState("");
    const [filteredDistributionNaps, setFilteredDistributionNaps] = useState(
        [],
    );
    const [filteredLastMileNaps, setFilteredLastMileNaps] = useState([]);
    const [filteredIps, setFilteredIps] = useState([]);

    const [selectedOption, setSelectedOption] = useState("");

    const handleOltChange = (id) => {
        const selectedOlt = Olts.find((olt) => olt.olt_id === id); // Suponiendo que tus OLTs tienen una estructura con id y name
        setSelectedOlt(id);
        const filteredNaps = Distributions.filter((nap) => nap.olt_id === id);
        setData((prevData) => ({
            ...prevData,
            olt_id: id,
            olt_name: selectedOlt ? selectedOlt.olt_name : "", // Guardar el nombre del OLT
            distribution_nap_id: "", // Limpiar distribución NAP ID
            last_mile_nap_id: "", // Limpiar última milla NAP ID
            ip_address: "", // Limpiar dirección IP
        }));
        setFilteredDistributionNaps(filteredNaps);
        setFilteredLastMileNaps([]);
        setFilteredIps([]);
    };

    const handleDistributionNapChange = (id) => {
        const selectedNap = Distributions.find(
            (nap) => nap.distribution_nap_id === id,
        ); // Suponiendo que tus NAPs tienen una estructura con id y name
        setData((prevData) => ({
            ...prevData,
            distribution_nap_id: id,
            distribution_nap_name: selectedNap
                ? selectedNap.distribution_nap_name
                : "", // Guardar el nombre de la NAP de distribución
        }));

        // Obtener todas las IPs asignadas a la NAP de Distribución seleccionada
        const ipsAssignedToDistributionNap = Ips.filter(
            (ip) => ip.distribution_nap_id === id,
        );

        // Filtrar las NAPs de Última Milla basadas en la NAP de Distribución seleccionada
        const filteredLastMileNaps = LastMiles.filter((nap) => {
            // Contar cuántas IPs tienen asignada esta NAP de Última Milla
            const ipsAssignedToLastMileNap =
                ipsAssignedToDistributionNap.filter(
                    (ip) => ip.last_mile_nap_id === nap.last_mile_nap_id,
                );

            // Verificar si el número de splitters asignados a esta NAP de Última Milla es menor o igual al número de IPs asignadas
            return (
                nap.distribution_nap_id === id &&
                nap.last_mile_nap_splitter >= ipsAssignedToLastMileNap.length
            );
        });
        setFilteredLastMileNaps(filteredLastMileNaps);

        // Filtrar las direcciones IP basadas en la NAP de Distribución seleccionada y estado de IP
        const filteredIps = Ips.filter((ip) => {
            return ip.distribution_nap_id === id && ip.ip_status === 0;
        });
        setFilteredIps(filteredIps);

        // Limpiar selección previa de NAP de Última Milla y Dirección IP
        setData((prevData) => ({
            ...prevData,
            last_mile_nap_id: "",
            ip_address: "",
        }));
    };

    const handleLastMileNapChange = (id) => {
        const selectedLastMileNap = LastMiles.find(
            (nap) => nap.last_mile_nap_id === id,
        ); // Suponiendo que tus NAPs de última milla tienen una estructura con last_mile_nap_id y name

        setData((prevData) => ({
            ...prevData,
            last_mile_nap_id: id,
            last_mile_nap_name: selectedLastMileNap
                ? selectedLastMileNap.last_mile_nap_name
                : "", // Guardar el nombre de la NAP de última milla
        }));
    };
    const notify = useNotify();

    const closeModalCreate = () => {
        clearErrors();
        setShowCreate(false);
    };

    const openCreateModal = () => {
        reset();
        const latestContractNum = Contracts.reduce((maxNum, contract) => {
            const numParts = contract.contract_num.split("-");
            const num = parseInt(numParts[numParts.length - 1]);
            return num > maxNum ? num : maxNum;
        }, 0);

        const nextNumber = latestContractNum + 1;
        const contractNum = `001-001-${nextNumber.toString().padStart(5, "0")}`;
        const contractId = `DEC-${nextNumber.toString().padStart(4, "0")}`;

        // Setear los valores en el formulario
        setData({
            ...data,
            contract_num: contractNum,
            contract_id: contractId,
        });
        setShowCreate(true);
    };

    const closeEditModal = () => {
        clearErrors();
        setShowEdit(false);
        setEditData(null);
        reset();
    };

    const openEditModal = (contract) => {
        const ip = Ips.find((ip) => ip.ip_address === contract.ip_address);

        // Encontrar la NAP de Última Milla asociada a la IP
        const lastMileNap = LastMiles.find(
            (nap) => nap.last_mile_nap_id === ip?.last_mile_nap_id,
        );
        const distributionNap = Distributions.find(
            (nap) => nap.distribution_nap_id === ip?.distribution_nap_id,
        );

        // Encontrar el OLT asociado a la NAP de Distribución
        const olt = Olts.find((olt) => olt.olt_id === distributionNap?.olt_id);

        const client = Clients.find(
            (client) => client.client_id === contract.client_id,
        );

        // Busca el teléfono en la lista de teléfonos
        const clientPhones = Phones.filter(
            (telefono) => telefono.client_id === contract.client_id,
        );

        // Extrae los números de teléfono y los concatena en una cadena separada por /
        const phoneNumbers = clientPhones
            .map((telefono) => telefono.phone_number)
            .join(" / ");

        const plan = Plans.find((plan) => plan.plan_id === contract.plan_id);

        const newData = {
            contract_num: contract.contract_num,
            contract_id: contract.contract_id,
            installation_date: contract.installation_date,
            maximum_date: contract.maximum_date,
            discount_id: contract.discount_id,
            discount_name: contract.discount_name,
            status_id: contract.status_id,
            status_name: contract.status_name,

            client_id: client.client_id,
            client_name: client.client_name,
            client_email: client.client_email,
            address: client.address,
            reference: client.reference,
            phone_numbers: phoneNumbers,
            sector_name: client.sector_name,
            parish_name: client.parish_name,
            canton_name: client.canton_name,
            province_name: client.province_name,

            plan_id: contract.plan_id,
            plan_name: plan.plan_name,
            plan_value: plan.plan_value,
            plan_megas: plan.plan_megas,

            ip_address: contract.ip_address,
            olt_id: olt?.olt_id,
            olt_name: olt?.olt_name,
            last_mile_nap_id: lastMileNap?.last_mile_nap_id,
            last_mile_nap_name: lastMileNap?.last_mile_nap_name,
            distribution_nap_id: distributionNap?.distribution_nap_id,
            distribution_nap_name: distributionNap?.distribution_nap_name,
        };

        setEditData(contract);
        setData(newData);

        setShowEdit(true);
        setSelectedOption(contract.maximum_date);
    };

    const handleSubmitAdd = (e) => {
        e.preventDefault();
        post(route("contracts.store"), {
            preserveScroll: true,
            onSuccess: () => {
                closeModalCreate();
                setShowModalConfirm(true);
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();

        patch(route("contracts.update", { contract: editData.contract_num }), {
            preserveScroll: true,
            onSuccess: () => {
                closeEditModal();
                notify("success", "Contrato actualizado.");
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    const handleClientIdChange = (id) => {
        // Actualiza el client_id en el estado
        setData("client_id", id);

        // Busca el cliente en la lista de clientes
        const client = Clients.find((client) => client.client_id === id);

        // Si se encuentra el cliente
        if (client) {
            // Busca el teléfono en la lista de teléfonos
            const clientPhones = Phones.filter(
                (telefono) => telefono.client_id === id,
            );

            // Extrae los números de teléfono y los concatena en una cadena separada por /
            const phoneNumbers = clientPhones
                .map((telefono) => telefono.phone_number)
                .join(" / ");

            // Actualiza el estado con los datos del cliente y el teléfono
            setData({
                ...data,
                client_id: client.client_id,
                client_name: client.client_name,
                client_email: client.client_email,
                address: client.address,
                reference: client.reference,
                phone_numbers: phoneNumbers,
                sector_name: client.sector_name,
                parish_name: client.parish_name,
                canton_name: client.canton_name,
                province_name: client.province_name,
            });
        }
    };
    const handlePlanIdChange = (id) => {
        setData("plan_id", id);

        const plan = Plans.find((plan) => plan.plan_id === id);

        if (plan) {
            setData({
                ...data,
                plan_id: plan.plan_id,
                plan_name: plan.plan_name,
                plan_value: plan.plan_value,
                plan_megas: plan.plan_megas,
            });
        }
    };
    const handleChange = (value) => {
        setSelectedOption(value); // Actualiza el estado cuando cambia la selección
        setData("maximum_date", value); // Asegura que movement_type también se actualice
    };
    const filteredStatus = Status.filter(
        (status) => status.status_id !== "STS-0002",
    );

    const contractInputs = [
        {
            label: "Num Contrato",
            id: "contract_num",
            type: "text",
            name: "contract_num",
            value: data.contract_num,
            disabled: true,
            inputError: (
                <InputError message={errors.contract_num} className="mt-1" />
            ),
        },
        {
            label: "ID del contrato",
            id: "contract_id",
            type: "text",
            name: "contract_id",
            value: data.contract_id,
            disabled: true,
            inputError: (
                <InputError message={errors.contract_id} className="mt-1" />
            ),
        },
        {
            placeholder: "Descuentos",
            type: "select",
            labelKey: "discount_name",
            valueKey: "discount_id",
            label: "Descuento",
            value: data.discount_id,
            options: Discounts,
            onSelect: (id) => setData("discount_id", id),
            inputError: (
                <InputError message={errors.discount_id} className="mt-2" />
            ),
            defaultValue: data.discount_name,
        },
        {
            placeholder: "Estados",
            type: "select",
            labelKey: "status_name",
            valueKey: "status_id",
            label: "Estado",
            options: filteredStatus,
            value: data.status_id,
            onSelect: (id) => setData("status_id", id),
            inputError: (
                <InputError message={errors.status_id} className="mt-2" />
            ),
            defaultValue: data.status_name,
        },
    ];
    const clientInfoInputs = [
        {
            placeholder: "Cédula",
            type: "select",
            labelKey: "client_id",
            valueKey: "client_id",
            options: Clients,
            label: "Cédula",
            value: data.client_id,
            onSelect: handleClientIdChange,
            onChange: (e) => setData("client_id", e.target.value),
            inputError: (
                <InputError message={errors.client_id} className="mt-2" />
            ),
            defaultValue: data.client_id,
        },

        {
            label: "Nombres",
            id: "client_name",
            type: "text",
            name: "client_name",
            value: data.client_name,
            disabled: true,
            inputError: (
                <InputError message={errors.client_name} className="mt-1" />
            ),
            defaultValue: data.client_name,
        },
        {
            label: "Correo Electrónico",
            id: "client_email",
            type: "email",
            name: "client_email",
            value: data.client_email,
            disabled: true,

            inputError: (
                <InputError message={errors.client_email} className="mt-1" />
            ),
            defaultValue: data.client_email,
        },
        {
            label: "Dirección",
            id: "address",
            type: "text",
            name: "address",
            value: data.address,
            disabled: true,
            inputError: (
                <InputError message={errors.address} className="mt-1" />
            ),
            defaultValue: data.address,
        },
        {
            label: "Teléfonos",
            id: "phone_numbers",
            type: "text",
            name: "phone_numbers",
            value: data.phone_numbers,
            disabled: true,
            inputError: (
                <InputError message={errors.phone_numbers} className="mt-1" />
            ),
            defaultValue: data.phone_numbers,
        },
        {
            label: "Referencia",
            id: "reference",
            type: "text",
            name: "reference",
            value: data.reference,
            disabled: true,

            inputError: (
                <InputError message={errors.reference} className="mt-1" />
            ),
            defaultValue: data.reference,
        },
        {
            label: "Sector",
            id: "sector_name",
            type: "text",
            name: "sector_name",
            value: data.sector_name,
            disabled: true,

            inputError: (
                <InputError message={errors.sector_name} className="mt-1" />
            ),
            defaultValue: data.sector_name,
        },
        {
            label: "Cantón",
            id: "canton_name",
            type: "text",
            name: "canton_name",
            value: data.canton_name,
            disabled: true,

            inputError: (
                <InputError message={errors.canton_name} className="mt-1" />
            ),
            defaultValue: data.canton_name,
        },
        {
            label: "Parroquia",
            id: "parish_name",
            type: "text",
            name: "parish_name",
            value: data.parish_name,
            disabled: true,

            inputError: (
                <InputError message={errors.parish_name} className="mt-1" />
            ),
            defaultValue: data.parish_name,
        },
        {
            label: "Provincia",
            id: "province_name",
            type: "text",
            name: "province_name",
            value: data.province_name,
            disabled: true,

            inputError: (
                <InputError message={errors.province_name} className="mt-1" />
            ),
            defaultValue: data.province_name,
        },
        {
            type: "combobox",
            label: "Fecha de pago",
            options: [
                { value: "5", label: "5" },
                { value: "15", label: "15" },
                { value: "25", label: "25" },
            ],
            value: selectedOption,
            onChange: handleChange,
            inputError: (
                <InputError message={errors.maximum_date} className="mt-2" />
            ),
            defaultValue: data.maximum_date,
        },
    ];
    const technicalInfoInputs = [
        {
            placeholder: "Planes",
            type: "select",
            labelKey: "plan_name",
            valueKey: "plan_id",
            label: "Planes",
            options: Plans,
            value: data.plan_name,
            onSelect: handlePlanIdChange,
            inputError: (
                <InputError message={errors.plan_id} className="mt-2" />
            ),
            defaultValue: data.plan_name,
        },
        {
            placeholder: "OLT",
            type: "select",
            labelKey: "olt_name",
            valueKey: "olt_id",
            options: Olts,
            label: "OLT",
            value: data.olt_id,
            onSelect: handleOltChange,
            inputError: <InputError message={errors.olt_id} className="mt-2" />,
            defaultValue: data.olt_name,
        },
        {
            label: "Valor",
            id: "plan_value",
            type: "text",
            name: "plan_value",
            value: data.plan_value,
            disabled: true,
            inputError: (
                <InputError message={errors.plan_value} className="mt-1" />
            ),
            defaultValue: data.plan_value,
        },
        {
            placeholder: "Nap de Distribución",
            type: "select",
            labelKey: "distribution_nap_name",
            valueKey: "distribution_nap_id",
            options: filteredDistributionNaps,
            label: "Nap de Distribución",
            value: data.distribution_nap_id,

            inputError: (
                <InputError
                    message={errors.distribution_nap_id}
                    className="mt-2"
                />
            ),
            onSelect: handleDistributionNapChange,
            disabled: !selectedOlt,
            defaultValue: data.distribution_nap_name,
        },
        {
            label: "Megas",
            id: "plan_megas",
            type: "text",
            name: "plan_megas",
            value: data.plan_megas,
            disabled: true,
            inputError: (
                <InputError message={errors.plan_megas} className="mt-1" />
            ),
            defaultValue: data.plan_megas,
        },

        {
            placeholder: "Nap de Ultima Milla",
            type: "select",
            labelKey: "last_mile_nap_name",
            valueKey: "last_mile_nap_id",
            options: filteredLastMileNaps,
            label: "última Milla",
            value: data.last_mile_nap_id,
            inputError: (
                <InputError
                    message={errors.last_mile_nap_id}
                    className="mt-2"
                />
            ),
            onSelect: handleLastMileNapChange,
            disabled: !data.distribution_nap_id,
            defaultValue: data.last_mile_nap_name,
        },

        {
            label: "Fecha de la instalación ",
            id: "installation_date",
            type: "date",
            name: "installation_date",
            value: data.installation_date,
            onChange: (e) => setData("installation_date", e.target.value),
            inputError: (
                <InputError
                    message={errors.installation_date}
                    className="mt-2"
                />
            ),
            defaultValue: data.installation_date,
        },
        {
            placeholder: "Ips",
            type: "select",
            labelKey: "ip_address",
            valueKey: "ip_address",
            options: filteredIps,
            label: "Dirección IP",
            value: data.ip_address,
            onChange: (e) => setData("ip_address", e.target.value),
            onSelect: (id) => setData("ip_address", id),
            defaultValue: data.ip_address,
        },
    ];
    /*inputsss */

    const [reportsOptions, setReportsOptions] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [preceOptions, setpreceOptions] = useState([]);
    const handleEmployeeChange = (id) => {
        setData("employee_id", id);
    };

    const handleTypeReportChange = (id) => {
        setData("type_report_id", id);
    };
    const handleTypeOrderChange = (id) => {
        const filteredReports = TypeReports.filter(
            (report) => report.type_order_id === id,
        );

        setReportsOptions(filteredReports);
        setData({
            ...data,
            type_order_id: id,
            type_report_id: "",
        });
    };

    const handleChangeStatus = (value) => {
        setSelectedStatus(value);
        setData("order_status", value);
    };
    const handleChangepreceO = (value) => {
        setpreceOptions(value);
        setData("order_precedents", value);
    };

    const transformForCombobox = (arrays) => {
        return arrays.map((array) => ({
            value: array,
            label: `${array}`,
        }));
    };
    const transformCombobox = (arrays) => {
        return arrays.map((array) => ({
            value: array === "Si" ? 1 : 0,

            label: `${array}`,
        }));
    };
    const comboboxpreced = transformCombobox(["Si", "No"]);

    const comboboxstatus = transformForCombobox(["Pendiente", "Realizado"]);
    // Función para generar opciones de empleados
    const generateEmployeeOptions = () => {
        return Employees.map((employee) => ({
            id: employee.id,
            name: employee.name,
        }));
    };

    const employeesOptions = generateEmployeeOptions();

    const orderInputs = [
        {
            label: "Id orden",
            id: "work_order_id",
            type: "text",
            name: "work_order_id",
            value: data.work_order_id || "",
            disabled: true,
            inputError: (
                <InputError message={errors.work_order_id} className="mt-1" />
            ),
            defaultValue: data.work_order_id,
        },
        {
            placeholder: "Empleado",
            label: "Empleado",
            type: "select",
            labelKey: "name",
            valueKey: "id",
            value: data.employee_id || "",
            options: employeesOptions,
            onSelect: handleEmployeeChange,
            inputError: (
                <InputError message={errors.employee_id} className="mt-2" />
            ),
            defaultValue: data.id,
        },
        {
            label: "Contrato",
            type: "text",
            id: "contract_num",
            name: "contract_num",
            value: data.contract_num || "",
            disabled: true,
            inputError: (
                <InputError message={errors.contract_num} className="mt-2" />
            ),
            defaultValue: data.contract_num,
        },
        {
            label: "Dirección",
            id: "address",
            type: "text",
            name: "address",
            value: data.address || "",
            disabled: true,
            inputError: (
                <InputError message={errors.address} className="mt-2" />
            ),
            defaultValue: data.address,
        },
        {
            label: "Sector",
            id: "sector_name",
            type: "text",
            name: "sector_name",
            value: data.sector_name || "",
            disabled: true,
            inputError: (
                <InputError message={errors.sector_name} className="mt-2" />
            ),
            defaultValue: data.sector_name,
        },
        {
            label: "Plan",
            id: "plan_id",
            type: "text",
            name: "plan_name",
            value: data.plan_name || "",
            disabled: true,
            inputError: (
                <InputError message={errors.plan_id} className="mt-2" />
            ),
            defaultValue: data.plan_name,
        },
        {
            label: "Teléfonos",
            id: "phone_numbers",
            type: "text",
            name: "phone_numbers",
            value: data.phone_numbers || "",
            disabled: true,
            inputError: (
                <InputError message={errors.phone_numbers} className="mt-1" />
            ),
            defaultValue: data.phone_numbers,
        },
        {
            label: "IP Asociada",
            id: "ip_address",
            type: "text",
            name: "ip_address",
            value: data.ip_address || "",
            disabled: true,
            inputError: (
                <InputError message={errors.ip_address} className="mt-2" />
            ),

            defaultValue: data.ip_address,
        },
        {
            label: "NAP de Última Milla",
            id: "last_mile_nap_id",
            type: "text",
            name: "last_mile_nap_name",
            value: data.last_mile_nap_name || "",
            disabled: true,
            inputError: (
                <InputError
                    message={errors.last_mile_nap_name}
                    className="mt-2"
                />
            ),
            defaultValue: data.last_mile_nap_name,
        },
        {
            label: "NAP de Distribución",
            id: "distribution_nap_name",
            type: "text",
            name: "distribution_nap_name",
            value: data.distribution_nap_name || "",
            disabled: true,
            inputError: (
                <InputError
                    message={errors.distribution_nap_name}
                    className="mt-2"
                />
            ),
            defaultValue: data.distribution_nap_name,
        },
        {
            label: "OLT",
            id: "olt_name",
            type: "text",
            name: "olt_name",
            value: data.olt_name || "",
            disabled: true,
            inputError: (
                <InputError message={errors.olt_name} className="mt-2" />
            ),
            defaultValue: data.olt_name,
        },
    ];
    const suportInputs = [
        {
            placeholder: "Tipo de Orden",
            label: "Tipo de Orden",
            type: "select",
            labelKey: "name_type_order",
            valueKey: "type_order_id",
            value: data.type_order_id || "",
            options: TypeOrders,
            onSelect: handleTypeOrderChange,
            inputError: (
                <InputError message={errors.type_order_id} className="mt-2" />
            ),
            defaultValue: data.name_type_order,
        },
        {
            placeholder: "Tipo de Reporte",
            label: "Tipo de reporte",
            type: "select",
            labelKey: "name_type_report",
            valueKey: "type_report_id",
            value: data.type_report_id || "",
            options: reportsOptions,
            onSelect: handleTypeReportChange,
            inputError: (
                <InputError message={errors.type_report_id} className="mt-2" />
            ),
            defaultValue: data.name_type_report,
        },

        {
            label: "Canal",
            id: "order_channel",
            type: "text",
            name: "order_channel",
            value: data.order_channel || "",
            onChange: (e) => setData("order_channel", e.target.value),
            inputError: (
                <InputError message={errors.order_channel} className="mt-2" />
            ),
            defaultValue: data.order_channel,
        },
        {
            label: "Fecha de Problema",
            id: "issue_date",
            type: "datetime-local",
            name: "issue_date",
            value: data.issue_date || "",
            onChange: (e) => setData("issue_date", e.target.value),
            inputError: (
                <InputError message={errors.issue_date} className="mt-2" />
            ),
        },
        {
            type: "combobox",
            label: "Estado",
            id: "order_status",
            options: comboboxstatus,
            value: selectedStatus || "",
            onChange: handleChangeStatus,
            inputError: (
                <InputError message={errors.order_status} className="mt-2" />
            ),
            defaultValue: data.order_status,
        },
        {
            label: "Reclamación AB",
            id: "order_abclaim",
            type: "text",
            name: "order_abclaim",
            value: data.order_abclaim || "",
            onChange: (e) => setData("order_abclaim", e.target.value),
            inputError: (
                <InputError message={errors.order_abclaim} className="mt-2" />
            ),
            defaultValue: data.order_abclaim,
        },
        {
            type: "combobox",
            label: "Precedentes",
            options: comboboxpreced,
            value: preceOptions || "", // Usa data en lugar de preceOptions
            onChange: handleChangepreceO,
            inputError: (
                <InputError
                    message={errors.order_precedents}
                    className="mt-2"
                />
            ),
            defaultValue: data.order_precedents === 1 ? "Sí" : "No", // Ajusta esto también
        },
        {
            placeholder: "Fecha de Solución",
            label: "Fecha de Solución",
            id: "solution_date",
            type: "datetime-local",
            name: "solution_date",
            value: data.solution_date || "",
            onChange: (e) => setData("solution_date", e.target.value),
            inputError: (
                <InputError message={errors.solution_date} className="mt-2" />
            ),
        },
        {
            label: "Inicio de ABIS",
            id: "order_initial_abis",
            type: "text",
            name: "order_initial_abis",
            value: data.order_initial_abis || "",
            onChange: (e) => setData("order_initial_abis", e.target.value),
            inputError: (
                <InputError
                    message={errors.order_initial_abis}
                    className="mt-2"
                />
            ),
            defaultValue: data.order_initial_abis,
        },
        {
            label: "Potencia Inicial",
            id: "order_initial_abis",
            type: "text",
            name: "order_initial_potency",
            value: data.order_initial_potency || "",
            onChange: (e) => setData("order_initial_potency", e.target.value),
            inputError: (
                <InputError
                    message={errors.order_initial_potency}
                    className="mt-2"
                />
            ),
            defaultValue: data.order_initial_potency,
        },
        {
            label: "ABIS Final",
            id: "order_final_abis",
            type: "text",
            name: "order_final_abis",
            value: data.order_final_abis || "",
            onChange: (e) => setData("order_final_abis", e.target.value),
            inputError: (
                <InputError
                    message={errors.order_final_abis}
                    className="mt-2"
                />
            ),
            defaultValue: data.order_final_abis,
        },
        {
            label: "Diagnostico Inicial",
            id: "order_initial_diagnosis",
            type: "text",
            name: "order_initial_diagnosis",
            value: data.order_initial_diagnosis || "",
            onChange: (e) => setData("order_initial_diagnosis", e.target.value),
            inputError: (
                <InputError
                    message={errors.order_initial_diagnosis}
                    className="mt-2"
                />
            ),
            defaultValue: data.order_initial_diagnosis,
        },
        {
            label: "Solución",
            id: "order_solution",
            type: "text",
            name: "order_solution",
            value: data.order_solution || "",
            onChange: (e) => setData("order_solution", e.target.value),
            inputError: (
                <InputError message={errors.order_solution} className="mt-2" />
            ),
            defaultValue: data.order_solution,
        },
        {
            label: "Potencia Final",
            id: "order_final_potency",
            type: "text",
            name: "order_final_potency",
            value: data.order_final_potency || "",
            onChange: (e) => setData("order_final_potency", e.target.value),
            inputError: (
                <InputError
                    message={errors.order_final_potency}
                    className="mt-2"
                />
            ),
            defaultValue: data.order_final_potency,
        },
        {
            label: "Diagnóstico Final",
            id: "order_final_diagnosis",
            type: "text",
            name: "order_final_diagnosis",
            value: data.order_final_diagnosis || "",
            onChange: (e) => setData("order_final_diagnosis", e.target.value),
            inputError: (
                <InputError
                    message={errors.order_final_diagnosis}
                    className="mt-2"
                />
            ),
            defaultValue: data.order_final_diagnosis,
        },
        {
            label: "Valor a pagar",
            id: "value_due",
            type: "number",
            name: "value_due",
            value: data.value_due || "",
            onChange: (e) => setData("value_due", e.target.value),
            inputError: (
                <InputError message={errors.value_due} className="mt-2" />
            ),
            defaultValue: data.value_due,
        },
    ];
    /** */
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

    /* para order */
    const [showCreateOrder, setShowCreateOrder] = useState(false);
    const [showModalConfirm, setShowModalConfirm] = useState(false);
    const closeModalConfirm = () => {
        setShowModalConfirm(false);

        reset();
        setSelectedOption("");
    };

    const handleConfirm = () => {
        closeModalConfirm();
        setShowCreateOrder(true);

        // Encontrar el último número de orden de trabajo para generar el siguiente
        const latestOrder = WorkOrders.reduce((maxNum, order) => {
            const numParts = order.work_order_id.split("-");
            const num = parseInt(numParts[numParts.length - 1]);
            return num > maxNum ? num : maxNum;
        }, 0);

        const nextNumber = latestOrder + 1;
        const orderId = `ORT-${nextNumber.toString().padStart(4, "0")}`;

        // Setear los valores en el formulario
        setData({
            ...data,
            work_order_id: orderId,
        });
        setShowCreate(true);
    };

    const closeModalCreateOrder = () => {
        clearErrors();
        setShowCreateOrder(false);
        reset();
    };

    const handleSubmitAddOrder = (e) => {
        e.preventDefault();

        post(route("workorder.store"), {
            preserveScroll: true,
            onSuccess: () => {
                closeModalCreateOrder();
                notify("success", "Orden de trabajo creada.");
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    /*finnnn*/
    const filteredContracts = Contracts.filter(
        (contract) => contract.status_id !== "STS-0002",
    );
    //console.log(filteredContracts);

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Administrar Contratos" />}
            roles={auth.user.roles.map((role) => role.name)}
        >
            <Head title="Contratos" />
            <Tab tabs={tabs}>
                <Box>
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                        <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                            <AddButton onClick={openCreateModal} />
                        </div>
                        <ExportData
                            data={filteredContracts}
                            searchColumns={searchColumns}
                            headers={theaders}
                            fileName="Contratos"
                        />
                    </div>
                </Box>
                <ModalCreate
                    showCreate={showCreate}
                    closeModalCreate={closeModalCreate}
                    contractInputs={contractInputs}
                    clientInfoInputs={clientInfoInputs}
                    technicalInfoInputs={technicalInfoInputs}
                    processing={processing}
                    handleSubmitAdd={handleSubmitAdd}
                    numContract={data.contract_num}
                />

                <ModalEdit
                    title="Editar Contratos"
                    showEdit={showEdit}
                    closeEditModal={closeEditModal}
                    contractInputs={contractInputs}
                    clientInfoInputs={clientInfoInputs}
                    technicalInfoInputs={technicalInfoInputs}
                    processing={processing}
                    handleSubmitEdit={handleSubmitEdit}
                    numContract={data.contract_num}
                />
                <ConfirmationModal
                    title="Agregar orden de trabajo"
                    message="El contrato se ha agregado con éxito. ¿Desea agregar una orden de trabajo  para este cliente?"
                    show={showModalConfirm}
                    onClose={closeModalConfirm}
                    onConfirm={handleConfirm}
                    processing={processing}
                />
                <ModalCreateOrder
                    showCreate={showCreateOrder}
                    closeModalCreate={closeModalCreateOrder}
                    title="Crear Órden de Trabajo"
                    contractInputs={orderInputs}
                    supportInputs={suportInputs}
                    processing={processing}
                    handleSubmitAdd={handleSubmitAddOrder}
                    numOrder={data.work_order_id}
                />

                <Box className="mt-3 hidden md:block">
                    <TableContract
                        headers={theaders}
                        data={filteredContracts}
                        searchColumns={searchColumns}
                        onEdit={openEditModal}
                        idKey="contract_num"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedContracts}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
                <Box className="mt-3  md:hidden">
                    <CardsCustom
                        headers={theaders}
                        data={filteredContracts}
                        searchColumns={searchColumns}
                        onEdit={openEditModal}
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
