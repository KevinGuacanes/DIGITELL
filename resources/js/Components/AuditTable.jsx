import React, { useState, useEffect } from "react";
import { RiArrowUpDownFill } from "react-icons/ri";
import FloatInputText from "@/Components/FloatInputText";
import { FaArrowDownShortWide, FaArrowUpShortWide } from "react-icons/fa6";
import SecondaryButton from "@/Components/SecondaryButton";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { CgUnavailable } from "react-icons/cg";
import Modal from "@/Components/Modal"; // Importar el modal de Laravel Breeze

const TableCustomViewOnly = ({ headers, data, searchColumns, idKey }) => {
    const [searchValue, setSearchValue] = useState("");
    const [filteredData, setFilteredData] = useState(data);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc",
    });
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({});

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchValue(value);
        const filtered = data.filter((item) => {
            return searchColumns.some((column) => {
                const fieldValue = item[column].toString().toLowerCase();
                return fieldValue.includes(value);
            });
        });
        setFilteredData(filtered);
        setCurrentPage(1);
    };

    const handleSort = (columnKey) => {
        let direction = "asc";
        if (sortConfig.key === columnKey && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key: columnKey, direction });
        const sortedData = [...filteredData].sort((a, b) => {
            if (a[columnKey] < b[columnKey]) {
                return direction === "asc" ? -1 : 1;
            }
            if (a[columnKey] > b[columnKey]) {
                return direction === "asc" ? 1 : -1;
            }
            return 0;
        });
        setFilteredData(sortedData);
    };

    const renderSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) {
            return <RiArrowUpDownFill />;
        }
        if (sortConfig.direction === "asc") {
            return <FaArrowUpShortWide />;
        }
        return <FaArrowDownShortWide />;
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const handleNextPage = () => {
        if (currentPage * itemsPerPage < filteredData.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);
    const currentData = filteredData.slice(startIndex, endIndex);

    const handleViewDetails = (audit) => {
        setModalData(audit);
        setShowModal(true);
    };

    return (
        <>
            {data.length > 0 ? (
                <>
                    <nav className="flex justify-between pb-3">
                        <div className="flex items-center gap-2">
                            <select
                                onChange={handleItemsPerPageChange}
                                value={itemsPerPage}
                                className="bg-white dark:bg-gray-800 rounded-md border-gray-300 dark:border-gray-700 shadow-md focus:ring-violet-500 dark:focus:ring-violet-600 dark:focus:ring-offset-gray-800"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                            </select>
                            <span>
                                {startIndex + 1}-{endIndex} de{" "}
                                {filteredData.length} registros
                            </span>
                        </div>
                        <FloatInputText
                            label="Buscar..."
                            id="search-audit-table"
                            onChange={handleSearch}
                            value={searchValue}
                        />
                    </nav>
                    {filteredData.length > 0 ? (
                        <div className="relative overflow-x-scroll shadow-md sm:rounded-lg">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        {headers.map((header, index) => (
                                            <th
                                                key={index}
                                                scope="col"
                                                className="px-6 py-3 truncate"
                                            >
                                                <button
                                                    className="flex items-center gap-2"
                                                    onClick={() =>
                                                        handleSort(
                                                            searchColumns[
                                                                index
                                                            ],
                                                        )
                                                    }
                                                >
                                                    {header}
                                                    {renderSortIcon(
                                                        searchColumns[index],
                                                    )}
                                                </button>
                                            </th>
                                        ))}
                                        <th
                                            scope="col"
                                            className="px-6 py-3 truncate"
                                        >
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentData.map((item, index) => (
                                        <tr
                                            key={item[idKey]}
                                            className={`border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600`}
                                        >
                                            {searchColumns.map(
                                                (column, idx) => (
                                                    <td
                                                        key={idx}
                                                        className="px-6 py-4 whitespace-pre-wrap truncate"
                                                    >
                                                        {item[column]}
                                                    </td>
                                                ),
                                            )}
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() =>
                                                        handleViewDetails(item)
                                                    }
                                                    className="text-indigo-500 hover:underline"
                                                >
                                                    Ver Detalle
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="flex justify-center gap-3 items-center p-4">
                                <SecondaryButton
                                    className="px-3 py-1 flex items-center gap-1 bg-gray-200 dark:bg-gray-600"
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1}
                                >
                                    <IoIosArrowBack />
                                    Atrás
                                </SecondaryButton>
                                <span>
                                    Página {currentPage} de{" "}
                                    {Math.ceil(
                                        filteredData.length / itemsPerPage,
                                    )}
                                </span>
                                <SecondaryButton
                                    className="px-3 py-1 flex items-center gap-1 bg-gray-200 dark:bg-gray-600"
                                    onClick={handleNextPage}
                                    disabled={
                                        currentPage * itemsPerPage >=
                                        filteredData.length
                                    }
                                >
                                    Siguiente
                                    <IoIosArrowForward />
                                </SecondaryButton>
                            </div>
                        </div>
                    ) : (
                        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-500 dark:text-gray-400">
                            No se han encontrado resultados
                            <CgUnavailable className="text-red-500 text-xl" />
                        </h2>
                    )}
                </>
            ) : (
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-500 dark:text-gray-400">
                    No hay registros disponibles
                    <CgUnavailable className="text-red-500 text-xl" />
                </h2>
            )}
            {showModal && (
                <Modal show={showModal} onClose={() => setShowModal(false)}>
                    <div className="p-6 flex flex-col">
                        <h2 className="text-lg font-bold mb-4 dark:text-white ">
                            Detalles de la Auditoría
                        </h2>
                        <div className="flex mb-4">
                            <div className="w-1/2 pl-2">
                                <h3 className="font-semibold dark:text-white mb-3">
                                    Valores Anteriores:
                                </h3>
                                <pre className="bg-gray-100 dark:text-white  dark:bg-gray-700 p-2 rounded-md whitespace-pre-wrap truncate">
                                    {JSON.stringify(
                                        JSON.parse(modalData.old_values),
                                        null,
                                        2,
                                    )}
                                </pre>
                            </div>
                            <div className="w-px bg-gray-300 dark:text-white dark:bg-gray-700 mx-2"></div>
                            <div className="w-1/2 pr-2">
                                <h3 className="font-semibold dark:text-white mb-3">
                                    Valores Nuevos:
                                </h3>
                                <pre className="bg-gray-100 dark:text-white  dark:bg-gray-700 p-2 rounded-md whitespace-pre-wrap truncate">
                                    {JSON.stringify(
                                        JSON.parse(modalData.new_values),
                                        null,
                                        2,
                                    )}
                                </pre>
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <SecondaryButton
                                onClick={() => setShowModal(false)}
                            >
                                Cerrar
                            </SecondaryButton>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default TableCustomViewOnly;
