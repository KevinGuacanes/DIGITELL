// src/Pages/Dashboard.js
import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Header from "@/Components/Header";
import { Head } from "@inertiajs/react";
import Box from "@/Layouts/Box";
import LikertChart from "@/Components/LikertChart";
import {
    TimelineChart,
    RoleActivityChart,
    EntityActivityChart,
    SalesFunnelChart,
    ClientsByPlanChart,
    MonthlySalesChart,
    ParishHeatmapChart,
    OrdersByTypeChart,
    AverageResolutionTimeChart,
    EventDistributionChart
} from "@/Components/CustomChart";
import {
    transformAuditData,
    transformTimelineData,
    transformRoleActivityData,
    transformEntityActivityData,
    transformEventCounts,
} from "@/Utils/transformAuditData";
import StatCard from "@/Components/StatCard";
import { GrDocumentUser } from "react-icons/gr";
import { RiToolsLine } from "react-icons/ri";
import { FaUsers, FaMoneyBill } from "react-icons/fa";
import { PiFileCloudBold, PiUsersThreeFill } from "react-icons/pi";
import { SiMattermost } from "react-icons/si";
import { MdPendingActions } from "react-icons/md";

export default function Dashboard({
    auth,
    audits,
    salesFunnelData,
    clientsByPlanData,
    monthlySalesData,
    clientsByParishData,
    totalContractsCount,
    totalPlansCount,
    totalEmployees,
    managedOrders,
    mostUsedPlan,
    ordersByType,
    averageResolutionTime,
    managedOrdersPending,
}) {
    const likertData = transformAuditData(audits);
    const roleActivityData = transformRoleActivityData(audits);
    const entityActivityData = transformEntityActivityData(audits);
    const timelineData = transformTimelineData(audits);
    const eventCounts = transformEventCounts(audits);

    const DashboardComponents = {
        auditor: [
            <Box key="box-1" className="pt-6">
                <div className="flex flex-wrap">
                    <div className="w-full p-2">
                        <LikertChart data={likertData} />
                    </div>
                </div>
            </Box>,
            <Box key="box-1-1" className="pt-6">
                <div className="flex flex-wrap">
                    <div className="w-full md:w-1/2 p-2">
                        <EventDistributionChart data={eventCounts} />
                    </div>
                    <div className="w-full md:w-1/2 p-2">
                        <EntityActivityChart data={entityActivityData} />
                    </div>
                </div>
            </Box>,
        ],
        admin: [
            <Box key="box-0-2" className="pt-6">
                <div className="flex flex-wrap">
                    <div className="w-full md:w-1/2 p-2">
                        <StatCard
                            icon={PiUsersThreeFill}
                            title="Empleados Totales"
                            value={totalEmployees}
                            color="yellow"
                        />
                    </div>
                    <div className="w-full md:w-1/2 p-2">
                        <StatCard
                            icon={PiFileCloudBold}
                            title="Planes"
                            value={totalPlansCount}
                            color="purple"
                        />
                    </div>
                </div>
            </Box>,
            <Box key="box-2" className="pt-6">
                <div className="flex flex-wrap">
                    <div className="w-full md:w-1/2 p-2">
                        <RoleActivityChart data={roleActivityData} />
                    </div>
                    <div className="w-full md:w-1/2 p-2">
                        <TimelineChart data={timelineData} />
                    </div>
                </div>
            </Box>,
        ],
        vendedor: [
            <Box key="box-0-3" className="pt-6">
                <div className="flex flex-wrap">
                    <div className="w-full md:w-1/2 p-2">
                        <StatCard
                            icon={GrDocumentUser}
                            title="Contratos Totales"
                            value={totalContractsCount}
                            color="blue"
                        />
                    </div>
                    <div className="w-full md:w-1/2 p-2">
                        <StatCard
                            icon={SiMattermost}
                            title="Plan más usado"
                            value={mostUsedPlan}
                            color="red"
                        />
                    </div>
                </div>
            </Box>,
            <Box key="box-3" className="pt-6">
                <div className="flex flex-wrap">
                    <div className="w-full md:w-1/2 p-2">
                        <SalesFunnelChart data={salesFunnelData} />
                    </div>
                    <div className="w-full md:w-1/2 p-2">
                        <ClientsByPlanChart data={clientsByPlanData} />
                    </div>
                </div>
            </Box>,
            <Box key="box-4" className="pt-6">
                <div className="flex flex-wrap">
                    <div className="w-full md:w-1/2 p-2">
                        <MonthlySalesChart data={monthlySalesData} />
                    </div>
                    <div className="w-full md:w-1/2 p-2">
                        <ParishHeatmapChart data={clientsByParishData} />
                    </div>
                </div>
            </Box>,
        ],
        tecnico: [
            <Box key="box-5" className="pt-6">
                <div className="flex flex-wrap">
                    <div className="w-full md:w-1/2 p-2">
                        <StatCard
                            icon={RiToolsLine}
                            title="Órdenes Realizadas"
                            value={managedOrders}
                            color="green"
                        />
                    </div>
                    <div className="w-full md:w-1/2 p-2">
                        <StatCard
                            icon={MdPendingActions}
                            title="Órdenes Pendientes"
                            value={managedOrdersPending}
                            color="red"
                        />
                    </div>
                </div>
            </Box>,
            <Box key="box-6" className="pt-6">
                <div className="flex flex-wrap">
                    <div className="w-full md:w-1/2 p-2">
                        <OrdersByTypeChart data={ordersByType} />
                    </div>
                    <div className="w-full md:w-1/2 p-2">
                        <AverageResolutionTimeChart
                            data={averageResolutionTime}
                        />
                    </div>
                </div>
            </Box>,
        ],
    };

    const userRoles = auth.user.roles.map((role) => role.name);

    const renderDashboardComponents = () => {
        return userRoles.flatMap((role) =>
            DashboardComponents[role] ? DashboardComponents[role] : [],
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<Header subtitle={"Dashboard"} />}
            roles={userRoles}
        >
            <Head title="Dashboard" />
            {renderDashboardComponents()}
        </AuthenticatedLayout>
    );
}
