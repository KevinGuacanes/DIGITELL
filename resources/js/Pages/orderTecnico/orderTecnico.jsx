import { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import Header from "@/Components/Header";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import Tab from "@/Layouts/TabLayout";
import InputError from "@/Components/InputError";
import ModalEdit from "@/Components/EditWork";
import Box from "@/Layouts/Box";
import ExportData from "@/Components/ExportData";
import tabs from "./tabs";
import TableCustomT from "@/Components/tableTecnic";
import CardsCustomT from "@/Components/CardCustomTecnic";
import { useNotify } from "@/Components/Toast";
import PrimaryButton from "@/Components/PrimaryButton";

const WorkOrder = ({
    auth,
    Employees,
    Clients,
    Plans,
    Olts,
    Distributions,
    LastMiles,
    Ips,
    Sector,
    TypeReports,
    TypeOrders,
    Contracts,
    Phones,
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
        employee_id: "",
        employee_name: "",
        type_report_id: "",
        name_type_report: "",
        name_type_order: "",
        contract_num: "",
        contract_id: "",
        olt_name: "",
        olt_id: "",
        distribution_nap_name: "",
        distribution_nap_id: "",
        last_mile_nap_name: "",
        last_mile_nap_id: "",
        ip_address: "",
        address: "",
        phone_number: "",
        sector_name: "",
        type_order_id: "",
        plan_details: "",

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
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState(null);
    const [selectedWorkOrders, setSelectedWorkOrders] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [workOrders, setWorkOrders] = useState([]);

    const notify = useNotify();

    const closeEditModal = () => {
        // Limpiar otros estados o realizar reinicios adicionales según sea necesario
        clearErrors();
        reset();
        setSelectedStatus("");
        setEditData(null);

        // Cerrar el modal de edición
        setShowEdit(false);
    };

    const formatDateForFrontend = (dateString) => {
        if (!dateString) return "";
        // Si la fecha ya tiene una 'T', asumimos que está en el formato correcto
        if (dateString.includes("T")) {
            return dateString.slice(0, 16); // Recorta los segundos y la zona horaria si existen
        }
        // Si no tiene 'T', asumimos que está en formato "YYYY-MM-DD HH:mm:ss"
        return dateString.replace(" ", "T").slice(0, 16);
    };

    const openEditModal = (workOrder) => {
        const contract = Contracts.find(
            (contract) => contract.contract_num === workOrder.contract_num,
        );

        if (contract) {
            const client = Clients.find(
                (client) => client.client_id === contract.client_id,
            );

            if (client) {
                const clientPhones = Phones.filter(
                    (phone) => phone.client_id === contract.client_id,
                );
                const phoneNumbers = clientPhones
                    .map((phone) => phone.phone_number)
                    .join(" / ");
                const sector = Sector.find(
                    (sector) => sector.sector_id === client.sector_id,
                );

                const plan = Plans.find(
                    (plan) => plan.plan_id === contract.plan_id,
                );
                const planDetails = plan
                    ? `${plan.plan_id} / ${plan.plan_name} / ${plan.plan_value} / ${plan.plan_megas}`
                    : "";
                const ip = Ips.find(
                    (ip) => ip.ip_address === contract.ip_address,
                );

                let oltName = "";
                let distributionNapName = "";
                let lastMileNapName = "";

                if (ip) {
                    const lastMileNap = LastMiles.find(
                        (lastMile) =>
                            ip.last_mile_nap_id === lastMile.last_mile_nap_id,
                    );
                    if (lastMileNap) {
                        lastMileNapName = lastMileNap.last_mile_nap_name;

                        const distributionNap = Distributions.find(
                            (distribution) =>
                                distribution.distribution_nap_id ===
                                lastMileNap.distribution_nap_id,
                        );
                        if (distributionNap) {
                            distributionNapName =
                                distributionNap.distribution_nap_name;

                            const olt = Olts.find(
                                (olt) => olt.olt_id === distributionNap.olt_id,
                            );
                            if (olt) {
                                oltName = olt.olt_name;
                            }
                        }
                    }
                }

                // Buscar el tipo de reporte en TypeReports por el ID almacenado en workOrder
                const typeReport = TypeReports.find(
                    (report) =>
                        report.type_report_id === workOrder.type_report_id,
                );
                let typeOrderName = "";
                let typeOrderId = "";
                if (typeReport) {
                    const typeOrder = TypeOrders.find(
                        (typeOrder) =>
                            typeOrder.type_order_id ===
                            typeReport.type_order_id,
                    );
                    if (typeOrder) {
                        typeOrderName = typeOrder.name_type_order;
                        typeOrderId = typeOrder.type_order_id;
                    }
                }

                const employeeOptions = generateEmployeeOptions();
                const selectedEmployee = employeeOptions.find(
                    (emp) => emp.id === workOrder.employee_id,
                );

                const newData = {
                    work_order_id: workOrder.work_order_id,
                    employee_id: workOrder.employee_id,
                    employee_name: selectedEmployee
                        ? selectedEmployee.name
                        : "",
                    type_report_id: workOrder.type_report_id,
                    type_order_id: typeOrderId,
                    name_type_report: typeReport
                        ? typeReport.name_type_report
                        : "", // Obtener el nombre del tipo de reporte
                    name_type_order: typeOrderName, // Obtener el nombre del tipo de orden
                    type_report_id: workOrder.type_report_id,
                    order_channel: workOrder.order_channel || "",
                    issue_date: formatDateForFrontend(workOrder.issue_date),
                    solution_date: formatDateForFrontend(
                        workOrder.solution_date,
                    ),
                    order_precedents: workOrder.order_precedents, // Condicionar los precedentes a "Sí" o "No"
                    order_status: workOrder.order_status || "",
                    order_abclaim: workOrder.order_abclaim || "",
                    order_initial_abis: workOrder.order_initial_abis || "",
                    order_initial_potency:
                        workOrder.order_initial_potency || "",
                    order_final_abis: workOrder.order_final_abis || "",
                    order_initial_diagnosis:
                        workOrder.order_initial_diagnosis || "",
                    order_solution: workOrder.order_solution || "",
                    order_final_potency: workOrder.order_final_potency || "",
                    order_final_diagnosis:
                        workOrder.order_final_diagnosis || "",
                    value_due: workOrder.value_due || "",

                    contract_num: contract.contract_num,
                    contract_id: `${contract.contract_id} - ${client.client_name}`,
                    client_id: client.client_id,
                    client_name: client.client_name,
                    address: client.address,
                    reference: client.reference,
                    phone_number: phoneNumbers,
                    sector_name: sector ? sector.sector_name : "",
                    plan_details: planDetails,
                    ip_address: contract.ip_address, // Si ya está en workOrder, no necesitas buscarlo de nuevo
                    last_mile_nap_name: lastMileNapName || "",
                    distribution_nap_name: distributionNapName || "",
                    olt_name: oltName || "",
                    status_id: workOrder.order_status,
                    order_status: workOrder.order_status,
                };

                setEditData(newData);
                setData(newData);
                setShowEdit(true);
                setSelectedStatus(workOrder.order_status || "");
            }
        }
    };

    const handleSubmitEdit = (e) => {
        e.preventDefault();

        patch(route("orderTecnico.updateT", { id: editData.work_order_id }), {
            preserveScroll: true,
            onSuccess: () => {
                closeEditModal();
                notify("success", "Orden de trabajo actualizada.");
            },
            onError: (error) => console.error(Object.values(error).join(", ")),
        });
    };

    const handleChangeStatus = (value) => {
        setSelectedStatus(value);
        setData("order_status", value);
    };

    const transformForCombobox = (arrays) => {
        return arrays.map((array) => ({
            value: array,
            label: `${array}`,
        }));
    };

    const comboboxstatus = transformForCombobox(["Pendiente", "Realizado"]);
    // Función para generar opciones de empleados
    const generateEmployeeOptions = () => {
        return Employees.map((employee) => ({
            id: employee.id,
            name: employee.name,
        }));
    };

    // Función para generar opciones de contratos

    const generateContractOptions = () => {
        return Contracts.map((contract) => ({
            contract_num: contract.contract_num,
            contract_id: `${contract.contract_id} - ${Clients.find((client) => client.client_id === contract.client_id)?.client_name}`,
        }));
    };
    const contr = generateContractOptions();

    const contractInputs = [
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
        },
        {
            placeholder: "Empleado",
            label: "Empleado",
            type: "text",
            value: data.employee_name || "",
            disabled: true,
            inputError: (
                <InputError message={errors.employee_id} className="mt-2" />
            ),
        },
        {
            placeholder: "Contrato",
            label: "Contrato",
            type: "text",
            options: contr,
            value: data.contract_id || "",
            disabled: true,
            inputError: (
                <InputError message={errors.contract_num} className="mt-2" />
            ),
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
        },
        {
            label: "Plan",
            id: "plan_details",
            type: "text",
            name: "plan_details",
            value: data.plan_details || "",
            disabled: true,
            inputError: (
                <InputError message={errors.plan_details} className="mt-2" />
            ),
        },
        {
            label: "Teléfonos",
            id: "phone_numbers",
            type: "text",
            name: "phone_numbers",
            value: data.phone_number || "",
            disabled: true,
            inputError: (
                <InputError message={errors.phone_numbers} className="mt-1" />
            ),
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
        },
    ];
    const suportInputs = [
        {
            placeholder: "Tipo de Orden",
            label: "Tipo de Orden",
            type: "text",
            value: data.name_type_order || "",
            disabled: true,
            inputError: (
                <InputError message={errors.type_order_id} className="mt-2" />
            ),
        },
        {
            placeholder: "Tipo de Reporte",
            label: "Tipo de reporte",
            type: "text",
            value: data.name_type_report || "",
            disabled: true,
            inputError: (
                <InputError message={errors.type_report_id} className="mt-2" />
            ),
        },

        {
            label: "Canal",
            id: "order_channel",
            type: "text",
            name: "order_channel",
            value: data.order_channel || "",
            disabled: true,
            inputError: (
                <InputError message={errors.order_channel} className="mt-2" />
            ),
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
            disabled: true,
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
            disabled: true,
            inputError: (
                <InputError message={errors.order_abclaim} className="mt-2" />
            ),
            defaultValue: data.order_abclaim,
        },
        {
            type: "text",
            label: "Precedentes",
            disabled: true,
            value: data.order_precedents === 1 ? "Sí" : "No" || "", // Usa data en lugar de preceOptions
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

    const theaders = ["ID", "Empleado", "Tipo de Reporte", "Cliente", "Estado"];

    const searchColumns = [
        "work_order_id",
        "employee_name",
        "name_type_report",
        "contract_client",
        "order_status",
    ];

    const handleCheckboxChange = (id) => {
        setSelectedWorkOrders((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((item) => item !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedWorkOrders.length === WorkOrders.length) {
            setSelectedWorkOrders([]);
        } else {
            setSelectedWorkOrders(
                WorkOrders.map((order) => order.work_order_id),
            );
        }
    };
    const handleUpdateSelectedStatus = () => {
        if (selectedWorkOrders.length === 0) {
            notify("error", "No se han seleccionado órdenes de trabajo.");
            return;
        }

        // Extraer solo los IDs de las órdenes seleccionadas
        const selectedIds = selectedWorkOrders
            .map((order) =>
                typeof order === "object" ? order.work_order_id : order,
            )
            .filter((id) => id !== undefined);

        if (selectedIds.length === 0) {
            notify("error", "No se encontraron IDs válidos.");
            return;
        }

        const data = {
            workOrderIds: selectedIds,
            newStatus: "Realizado",
        };
        router.post(route("manage-tecnico.update-status"), data, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                // Actualizar el estado local de las órdenes de trabajo
                setWorkOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        selectedIds.includes(order.work_order_id)
                            ? { ...order, order_status: "Realizado" }
                            : order,
                    ),
                );
                setSelectedWorkOrders([]);
                notify("success", "Estado actualizado correctamente.");
            },
            onError: (errors) => {
                console.error("Error updating work orders:", errors);
                notify("error", "Error al actualizar las órdenes de trabajo.");
            },
        });
    };

    return (
        <Authenticated
            user={auth.user}
            header={<Header subtitle="Administrar Orden de Trabajo" />}
            roles={auth.user.roles.map((role) => role.name)}
        >
            <Head title="Ordenes de Trabajo" />
            <Tab tabs={tabs}>
                <Box>
                    <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                        <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                            <PrimaryButton
                                disabled={selectedWorkOrders.length === 0}
                                onClick={handleUpdateSelectedStatus}
                            >
                                Actualizar Estado
                            </PrimaryButton>
                        </div>
                        <ExportData
                            data={WorkOrders}
                            searchColumns={searchColumns}
                            headers={theaders}
                            fileName="Órdenes de Trabajo"
                        />
                    </div>
                </Box>
                <ModalEdit
                    title="Editar Orden de Trabajo"
                    showEdit={showEdit}
                    closeEditModal={closeEditModal}
                    contractInputs={contractInputs}
                    supportInputs={suportInputs}
                    processing={processing}
                    handleSubmitEdit={handleSubmitEdit}
                    numOrder={data.work_order_id}
                />

                <Box className="mt-3 hidden md:block">
                    <TableCustomT
                        headers={theaders}
                        data={WorkOrders}
                        searchColumns={searchColumns}
                        onEdit={openEditModal}
                        idKey="work_order_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedWorkOrders}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
                <Box className="mt-3 md:hidden">
                    <CardsCustomT
                        headers={theaders}
                        data={WorkOrders}
                        searchColumns={searchColumns}
                        onEdit={openEditModal}
                        idKey="work_order_id"
                        onSelectChange={handleCheckboxChange}
                        selectedItems={selectedWorkOrders}
                        onSelectAll={handleSelectAll}
                    />
                </Box>
            </Tab>
        </Authenticated>
    );
};

export default WorkOrder;
