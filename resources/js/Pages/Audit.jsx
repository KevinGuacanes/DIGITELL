import { useState, useEffect } from "react";
import { Head, useRemember } from "@inertiajs/react";
import Header from "@/Components/Header";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Box from "@/Layouts/Box";
import ExportData from "@/Components/ExportData";
import TableCustomViewOnly from "@/Components/AuditTable";
import CardsCustomOnlyView from "@/Components/AuditCard";
import { FilterButton } from "@/Components/CustomButtons";
import Modal from "@/Components/Modal";
import FloatInputText from "@/Components/FloatInputText";
import CustomSelect from "@/Components/CustomSelect";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";

const Audit = ({ auth, audits }) => {
    const [formattedAudits, setFormattedAudits] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const [filters, setFilters] = useRemember(
        {
            user: "",
            role: "",
            modifiedTable: "",
            event: "",
            dateFrom: "",
            dateTo: "",
        },
        "audit-filters",
    );

    useEffect(() => {
        formatAndFilterAudits();
    }, [audits, filters]);

    const formatAndFilterAudits = () => {
        if (audits?.length) {
            let filteredData = audits.filter((audit) => {
                return (
                    (filters.user === "" ||
                        audit.user?.name
                            ?.toLowerCase()
                            .includes(filters.user.toLowerCase())) &&
                    (filters.role === "" ||
                        audit.user_roles.includes(filters.role)) &&
                    (filters.modifiedTable === "" ||
                        audit.modified_table.table_name
                            .toLowerCase()
                            .includes(filters.modifiedTable.toLowerCase())) &&
                    (filters.event === "" || audit.event === filters.event) &&
                    (filters.dateFrom === "" ||
                        new Date(audit.created_at) >=
                            new Date(filters.dateFrom)) &&
                    (filters.dateTo === "" ||
                        new Date(audit.created_at) <= new Date(filters.dateTo))
                );
            });

            const formatted = filteredData.map((audit) => ({
                ...audit,
                user: audit.user?.name ?? "Registro de nuevo usuario",
                user_roles:
                    audit.user_roles.length < 1
                        ? "sin rol"
                        : audit.user_roles.join(", "),
                modified_table: `${audit.modified_table.table_name} (${audit.modified_table.record_id})`,
                event: auditEvent(audit.event),
                created_at: new Date(audit.created_at).toLocaleString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                }),
                new_values: JSON.stringify(audit.new_values, null, 2),
                old_values: JSON.stringify(audit.old_values, null, 2),
            }));
            setFormattedAudits(formatted);
        }
    };

    const headers = [
        "Usuario",
        "Roles",
        "Tabla Modificada",
        "Tipo de Evento",
        "Fecha y Hora",
    ];
    const searchColumns = [
        "user",
        "user_roles",
        "modified_table",
        "event",
        "created_at",
    ];

    const openFilterModal = () => {
        setShowFilter(true);
    };

    const closeFilterModal = () => {
        setShowFilter(false);
    };

    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters);
        closeFilterModal();
    };

    const resetFilters = () => {
        setFilters({
            user: "",
            role: "",
            modifiedTable: "",
            event: "",
            dateFrom: "",
            dateTo: "",
        });
    };

    return (
        <AuthenticatedLayout
            header={<Header subtitle="Auditoria" />}
            user={auth.user}
            roles={auth.user.roles.map((role) => role.name)}
        >
            <Head title="Auditoría" />

            <Box className="mt-3">
                <div className="flex flex-wrap items-center justify-center md:justify-between gap-2">
                    <div className="w-full sm:w-auto flex flex-wrap justify-center gap-2">
                        <FilterButton onClick={openFilterModal} />
                    </div>
                    <ExportData
                        data={formattedAudits}
                        searchColumns={[
                            ...searchColumns,
                            "old_values",
                            "new_values",
                        ]}
                        headers={[
                            ...headers,
                            "Datos Anteriores",
                            "Datos Nuevos",
                        ]}
                        fileName="Auditoría"
                    />
                </div>
            </Box>

            <Box className="mt-3 hidden md:block">
                <TableCustomViewOnly
                    headers={headers}
                    data={formattedAudits}
                    searchColumns={searchColumns}
                    idKey="id"
                />
            </Box>
            <Box className="mt-3  md:hidden">
                <CardsCustomOnlyView
                    headers={headers}
                    data={formattedAudits}
                    searchColumns={searchColumns}
                    idKey="id"
                />
            </Box>
            <FilterModal
                title="Filtrar Datos"
                showFilter={showFilter}
                closeModalFilter={closeFilterModal}
                handleApplyFilters={handleApplyFilters}
                initialFilters={filters}
                audits={audits}
                resetFilters={resetFilters}
            />
        </AuthenticatedLayout>
    );
};

const auditEvent = (event) => {
    switch (event) {
        case "created":
            return "creado";
        case "updated":
            return "actualizado";
        case "deleted":
            return "eliminado";
        case "restored":
            return "restaurado";
        case "role_change":
            return "cambio de rol";
        default:
            return event;
    }
};

const FilterModal = ({
    title,
    showFilter,
    closeModalFilter,
    handleApplyFilters,
    initialFilters,
    audits,
    resetFilters
}) => {
    const [localFilters, setLocalFilters] = useState(initialFilters);

    useEffect(() => {
        setLocalFilters(initialFilters);
    }, [initialFilters]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleApplyFilters(localFilters);
    };

    const handleReset = () => {
        resetFilters();
        setLocalFilters({
            user: "",
            role: "",
            modifiedTable: "",
            event: "",
            dateFrom: "",
            dateTo: "",
        });
    };

    // Extract unique values from audits for dropdowns
    const users = [...new Set(audits.map(audit => audit.user?.name).filter(Boolean))];
    const roles = [...new Set(audits.flatMap(audit => audit.user_roles))];
    const tables = [...new Set(audits.map(audit => audit.modified_table.table_name))];
    const events = [...new Set(audits.map(audit => audit.event))];

    return (
        <Modal show={showFilter} onClose={closeModalFilter}>
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {title.toUpperCase()}
                </h3>
                <div className="mt-4">
                    <CustomSelect
                        label="Empleados"
                        id="user"
                        name="user"
                        value={localFilters.user}
                        onChange={handleChange}
                        options={users.map(user => ({ id: user, name: user }))}
                        className="mt-3 block w-full"
                    />
                    <CustomSelect
                        label="Roles"
                        id="role"
                        name="role"
                        value={localFilters.role}
                        onChange={handleChange}
                        options={roles.map(role => ({ id: role, name: role }))}
                        className="mt-3 block w-full"
                    />
                    <CustomSelect
                        label="Tablas Modificadas"
                        id="modifiedTable"
                        name="modifiedTable"
                        value={localFilters.modifiedTable}
                        onChange={handleChange}
                        options={tables.map(table => ({ id: table, name: table }))}
                        className="mt-3 block w-full"
                    />
                    <CustomSelect
                        label="Tipos de Evento"
                        id="event"
                        name="event"
                        value={localFilters.event}
                        onChange={handleChange}
                        options={events.map(event => ({ id: event, name: auditEvent(event) }))}
                        className="mt-3 block w-full"
                    />
                    <FloatInputText
                        label="Fecha desde"
                        type="date"
                        name="dateFrom"
                        value={localFilters.dateFrom}
                        onChange={handleChange}
                        className="mt-3 block w-full"
                    />
                    <FloatInputText
                        label="Fecha hasta"
                        type="date"
                        name="dateTo"
                        value={localFilters.dateTo}
                        onChange={handleChange}
                        className="mt-3 block w-full"
                    />
                </div>
                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={handleReset} className="mr-2">
                        Resetear
                    </SecondaryButton>
                    <SecondaryButton onClick={closeModalFilter} className="mr-2">
                        Cancelar
                    </SecondaryButton>
                    <PrimaryButton onClick={handleSubmit}>
                        Aplicar Filtros
                    </PrimaryButton>
                </div>
            </div>
        </Modal>
    );
};


export default Audit;
