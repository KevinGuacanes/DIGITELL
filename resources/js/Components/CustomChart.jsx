import React, { useContext } from "react";
import { Pie, Bar, Line, Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
} from "chart.js";
import { DarkModeContext } from "@/Components/DarkModeContext";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
);

export const chartOptions = (title, isDarkMode, chartType) => {
    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: title,
                color: isDarkMode ? "white" : "var(--text-color)",
            },
            legend: {
                labels: {
                    color: isDarkMode ? "white" : "var(--text-color)",
                },
            },
        },
    };

    if (chartType === "doughnut" || chartType === "pie") {
        return {
            ...commonOptions,
            plugins: {
                ...commonOptions.plugins,
                legend: {
                    ...commonOptions.plugins.legend,
                    display: true,
                },
            },
        };
    } else {
        return {
            ...commonOptions,
            scales: {
                x: {
                    ticks: {
                        color: isDarkMode ? "white" : "var(--text-color)",
                    },
                    grid: {
                        color: isDarkMode
                            ? "rgba(255, 255, 255, 0.2)"
                            : "rgba(0, 0, 0, 0.1)",
                    },
                },
                y: {
                    ticks: {
                        color: isDarkMode ? "white" : "var(--text-color)",
                    },
                    grid: {
                        color: isDarkMode
                            ? "rgba(255, 255, 255, 0.2)"
                            : "rgba(0, 0, 0, 0.1)",
                    },
                },
            },
        };
    }
};

const pieChartOptions = (title, isDarkMode) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: true,
            text: title,
            color: isDarkMode ? "white" : "var(--text-color)",
        },
        legend: {
            labels: {
                color: isDarkMode ? "white" : "var(--text-color)",
            },
        },
    },
});

export const RoleActivityChart = ({ data }) => {
    const { isDarkMode } = useContext(DarkModeContext);

    return (
        <div className="w-full h-full">
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg h-full">
                <Pie
                    data={data}
                    options={pieChartOptions(
                        "Actividad por Rol",
                        isDarkMode,
                        "pie",
                    )}
                />
            </div>
        </div>
    );
};

export const EntityActivityChart = ({ data }) => {
    const { isDarkMode } = useContext(DarkModeContext);
    const height = Math.max(data.labels.length * 40, 400);
    return (
        <div className="w-full h-full">
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg h-full">
                <div className="relative" style={{ height: `${height}px` }}>
                    <Bar
                        data={data}
                        options={{
                            ...chartOptions(
                                "Actividad por Entidad",
                                isDarkMode,
                            ),
                            indexAxis: "y",
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export const TimelineChart = ({ data }) => {
    const { isDarkMode } = useContext(DarkModeContext);
    const height = Math.max(data.labels.length * 40, 400);
    return (
        <div className="w-full h-full">
            <div className="bg-white dark:bg-gray-700 dark:text-white p-4 rounded-lg shadow-lg h-full">
                <div className="relative" style={{ height: `${height}px` }}>
                    <Line
                        data={data}
                        options={chartOptions(
                            "Línea de Tiempo de Actividad",
                            isDarkMode,
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

export const SalesFunnelChart = ({ data }) => {
    const { isDarkMode } = useContext(DarkModeContext);

    const chartData = {
        labels: data.map((item) => item.status_name),
        datasets: [
            {
                label: "Contador",
                data: data.map((item) => item.count),
                backgroundColor: "rgba(139, 92, 246, 0.6)",
                borderColor: "rgba(139, 92, 246, 1)",
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="w-full h-full">
            <div className="bg-white dark:bg-gray-700 bg-vio dark:text-white p-4 rounded-lg shadow-lg h-full">
                <div className="relative" style={{ height: "400px" }}>
                    <Bar
                        data={chartData}
                        options={chartOptions("Contratos", isDarkMode)}
                    />
                </div>
            </div>
        </div>
    );
};

export const ClientsByPlanChart = ({ data }) => {
    const { isDarkMode } = useContext(DarkModeContext);

    const chartData = {
        labels: data.map((item) => item.plan_name),
        datasets: [
            {
                label: "Clientes",
                data: data.map((item) => item.count),
                backgroundColor: "rgba(16, 185, 129, 0.6)",
                borderColor: "rgba(16, 185, 129, 1)",
                borderWidth: 1,
            },
        ],
    };
    return (
        <div className="w-full h-full">
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg h-full">
                <div className="relative" style={{ height: "400px" }}>
                    <Bar
                        data={chartData}
                        options={chartOptions("Tipos de Planes", isDarkMode)}
                    />
                </div>
            </div>
        </div>
    );
};

export const MonthlySalesChart = ({ data }) => {
    const { isDarkMode } = useContext(DarkModeContext);

    const chartData = {
        labels: data.map((item) => item.month),
        datasets: [
            {
                label: "Recuento de ventas",
                data: data.map((item) => item.count),
                backgroundColor: "rgba(249, 115, 22, 0.6)",
                borderColor: "rgba(249, 115, 22, 1)",
                borderWidth: 2,
                fill: false,
                tension: 0.5,
            },
        ],
    };

    return (
        <div className="w-full h-full">
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg h-full">
                <div className="relative" style={{ height: "400px" }}>
                    <Line
                        data={chartData}
                        options={chartOptions(
                            "Datos de ventas mensuales",
                            isDarkMode,
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

export const ParishHeatmapChart = ({ data }) => {
    const { isDarkMode } = useContext(DarkModeContext);

    const chartData = {
        labels: data.map((item) => item.parish_name),
        datasets: [
            {
                label: "Cantidad de Clientes",
                data: data.map((item) => item.count),
                backgroundColor: "rgba(234, 179, 8, 0.6)",
                borderColor: "rgba(234, 179, 8, 1)",
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="w-full h-full">
            <div className="bg-white dark:bg-gray-700 dark:text-white p-4 rounded-lg shadow-lg h-full">
                <div className="relative" style={{ height: "400px" }}>
                    <Bar
                        data={chartData}
                        options={chartOptions(
                            "Clientes por Parroquia",
                            isDarkMode,
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

export const OrdersByTypeChart = ({ data }) => {
    const { isDarkMode } = useContext(DarkModeContext);

    const chartData = {
        labels: data.map((item) => item.name_type_order),
        datasets: [
            {
                label: "Cantidad de Órdenes",
                data: data.map((item) => item.total),
                backgroundColor: "rgba(99, 102, 241, 0.6)",
                borderColor: "rgba(99, 102, 241, 1)",
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="w-full h-full">
            <div className="bg-white dark:bg-gray-700 dark:text-white p-4 rounded-lg shadow-lg h-full bg-ind">
                <div className="relative" style={{ height: "400px" }}>
                    <Bar
                        data={chartData}
                        options={chartOptions("Órdenes por Tipo", isDarkMode)}
                    />
                </div>
            </div>
        </div>
    );
};

export const AverageResolutionTimeChart = ({ data }) => {
    const { isDarkMode } = useContext(DarkModeContext);

    if (!Array.isArray(data) || data.length === 0) {
        return (
            <div
                className={`w-full h-full p-4 rounded-lg shadow-lg ${isDarkMode ? "bg-gray-700 text-white" : "bg-white"}`}
            >
                <p>No hay datos disponibles para mostrar.</p>
            </div>
        );
    }

    const groupedData = data.reduce((acc, { date, avg_resolution_time }) => {
        if (!date || avg_resolution_time == null) return acc;

        const [year, month] = date.split("-");
        const key = `${year}-${month}`;

        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(parseFloat(avg_resolution_time) || 0);
        return acc;
    }, {});

    const labels = Object.keys(groupedData).sort();
    const dataValues = labels.map((key) => {
        const times = groupedData[key];
        return times.length > 0
            ? times.reduce((sum, time) => sum + time, 0) / times.length
            : 0;
    });

    const formattedLabels = labels.map((key) => {
        const [year, month] = key.split("-");
        return new Date(year, month - 1).toLocaleString("default", {
            month: "short",
            year: "numeric",
        });
    });

    const chartData = {
        labels: formattedLabels,
        datasets: [
            {
                label: "Tiempo Promedio de Resolución (Horas)",
                data: dataValues,
                backgroundColor: "rgba(99, 102, 241, 0.6)",
                borderColor: "rgba(99, 102, 241, 1)",
                borderWidth: 2,
                fill: false,
                tension: 0.5,
            },
        ],
    };

    return (
        <div className="w-full h-full">
            <div
                className={`p-4 rounded-lg shadow-lg h-full ${isDarkMode ? "bg-gray-700 text-white" : "bg-white"}`}
            >
                <div className="relative" style={{ height: "400px" }}>
                    <Line
                        data={chartData}
                        options={chartOptions(
                            "Tiempo Promedio de Resolución",
                            isDarkMode,
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

export const EventDistributionChart = ({ data }) => {
    const { isDarkMode } = useContext(DarkModeContext);

    const donutChartData = {
        labels: Object.keys(data),
        datasets: [
            {
                label: "Distribución de Eventos",
                data: Object.values(data),
                backgroundColor: [
                    "rgba(99, 102, 241, 0.6)",
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(255, 205, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                ],
                borderColor: [
                    "rgba(99, 102, 241, 1)",
                    "rgba(255, 99, 132, 1)",
                    "rgba(255, 205, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="w-full h-full">
            <div
                className={`p-4 rounded-lg shadow-lg h-full ${isDarkMode ? "bg-gray-700 text-white" : "bg-white"}`}
            >
                <div className="relative" style={{ height: "400px" }}>
                    <Doughnut
                        data={donutChartData}
                        options={chartOptions(
                            "Distribución de Eventos",
                            isDarkMode,
                            "doughnut",
                        )}
                    />
                </div>
            </div>
        </div>
    );
};
