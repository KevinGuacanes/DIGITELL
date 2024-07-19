import React, { useEffect, useRef, useContext } from "react";
import {
    Chart,
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";
import { DarkModeContext } from "@/Components/DarkModeContext"; // Ajusta la ruta según sea necesario

Chart.register(
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
);

const LikertChart = ({ data }) => {
    const chartRef = useRef(null);
    const { isDarkMode } = useContext(DarkModeContext);

    useEffect(() => {
        const ctx = chartRef.current.getContext("2d");
        const chartInstance = new Chart(ctx, {
            type: "bar",
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: "Creado",
                        data: data.datasets.creado,
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                    },
                    {
                        label: "Actualizado",
                        data: data.datasets.actualizado,
                        backgroundColor: "rgba(54, 162, 235, 0.2)",
                        borderColor: "rgba(54, 162, 235, 1)",
                        borderWidth: 1,
                    },
                    {
                        label: "Eliminado",
                        data: data.datasets.eliminado,
                        backgroundColor: "rgba(255, 99, 132, 0.2)",
                        borderColor: "rgba(255, 99, 132, 1)",
                        borderWidth: 1,
                    },
                    {
                        label: "Restaurado",
                        data: data.datasets.restaurado,
                        backgroundColor: "rgba(255, 206, 86, 0.2)",
                        borderColor: "rgba(255, 206, 86, 1)",
                        borderWidth: 1,
                    },
                    {
                        label: "Cambio de Rol",
                        data: data.datasets["cambio de rol"],
                        backgroundColor: "rgba(153, 102, 255, 0.2)",
                        borderColor: "rgba(153, 102, 255, 1)",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            callback: function (value) {
                                if (Number.isInteger(value)) {
                                    return value;
                                }
                            },
                            color: isDarkMode ? "white" : "var(--text-color)",
                        },
                        grid: {
                            color: isDarkMode
                                ? "rgba(255, 255, 255, 0.2)"
                                : "rgba(0, 0, 0, 0.1)",
                        },
                    },
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
                },
                plugins: {
                    legend: {
                        labels: {
                            color: isDarkMode ? "white" : "var(--text-color)",
                        },
                    },
                },
                layout: {
                    padding: {
                        top: 5,
                        right: 5,
                        bottom: 5,
                        left: 5,
                    },
                },
            },
        });

        return () => {
            chartInstance.destroy();
        };
    }, [data, isDarkMode]);

    return (
        <div className="w-full h-full">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
                <div className="relative h-64 md:h-96">
                    <canvas ref={chartRef} className="w-full h-full"></canvas>
                </div>
            </div>
        </div>
    );
};

export default LikertChart;
