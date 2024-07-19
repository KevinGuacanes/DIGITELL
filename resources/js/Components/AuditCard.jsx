import { useState, useEffect } from "react";
import { CgUnavailable } from "react-icons/cg";
import { RiArrowUpDownFill } from "react-icons/ri";
import FloatInputText from "@/Components/FloatInputText";
import { FaArrowDownShortWide, FaArrowUpShortWide } from "react-icons/fa6";
import SecondaryButton from "@/Components/SecondaryButton";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import Modal from "@/Components/Modal";

const CardsCustomOnlyView = ({ headers, data, searchColumns, idKey }) => {
    const styles =
        "text-violet-600 shadow-sm focus:ring-violet-500 dark:focus:ring-violet-600";
    const [searchValue, setSearchValue] = useState("");
    const [filteredData, setFilteredData] = useState(data);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc",
    });
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);

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

    const handleViewDetails = (item) => {
        setModalData(item);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalData(null);
    };

    return (
        <>
            {data.length > 0 ? (
                <>
                    <nav className="flex flex-wrap justify-between pb-3">
                        <div className="flex items-center gap-2 my-3">
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
                            onChange={handleSearch}
                            value={searchValue}
                            className="my-3"
                        />
                    </nav>
                    {filteredData.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {currentData.map((item, index) => (
                                <div
                                    key={item[idKey]}
                                    className={`border rounded-lg p-4 shadow-md dark:border-gray-700 dark:bg-gray-800 bg-white`}
                                >
                                    {searchColumns.map((column, idx) => (
                                        <div
                                            key={idx}
                                            className="mb-2 whitespace-pre-wrap truncate"
                                        >
                                            <strong>{headers[idx]}: </strong>
                                            {item[column]}
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => handleViewDetails(item)}
                                        className="mt-2 w-full bg-violet-500 text-white py-1 rounded-md hover:bg-violet-600"
                                    >
                                        Ver detalles
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-500 dark:text-gray-400">
                            No se han encontrado resultados
                            <CgUnavailable className="text-red-500 text-xl" />
                        </h2>
                    )}
                    <div className="flex justify-between gap-3 py-3 items-center sm:justify-center">
                        <SecondaryButton
                            className="px-3 py-1 flex items-center gap-1 bg-gray-200 dark:bg-gray-600"
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                        >
                            <IoIosArrowBack />
                            Atras
                        </SecondaryButton>
                        <span>
                            Página {currentPage} de{" "}
                            {Math.ceil(filteredData.length / itemsPerPage)}
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
                    {isModalOpen && modalData && (
                        <Modal show={isModalOpen} onClose={closeModal}>
                            <div className="p-6">
                                <h2 className="text-2xl font-bold mb-3 dark:text-white">
                                    Detalles
                                </h2>
                                {searchColumns.map((column, idx) => (
                                    <div
                                        key={idx}
                                        className="mb-2 dark:text-white"
                                    >
                                        <strong className="font-bold">
                                            {headers[idx]}:{" "}
                                        </strong>
                                        {modalData[column]}
                                    </div>
                                ))}
                                <div className="mt-4 flex justify-between space-x-4">
                                    <div className="w-1/2">
                                        <h3 className="font-semibold dark:text-white mb-3">
                                            Valores Nuevos:
                                        </h3>
                                        <pre className="bg-gray-100 dark:text-white dark:bg-gray-700 p-2 rounded-md overflow-auto whitespace-pre-wrap break-all">
                                            {JSON.stringify(
                                                JSON.parse(
                                                    modalData.new_values,
                                                ),
                                                null,
                                                2,
                                            )}
                                        </pre>
                                    </div>
                                    <div className="w-1/2">
                                        <h3 className="font-semibold dark:text-white mb-3">
                                            Valores Anteriores:
                                        </h3>
                                        <pre className="bg-gray-100 dark:text-white dark:bg-gray-700 p-2 rounded overflow-auto whitespace-pre-wrap break-all">
                                            {JSON.stringify(
                                                JSON.parse(
                                                    modalData.old_values,
                                                ),
                                                null,
                                                2,
                                            )}
                                        </pre>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <SecondaryButton onClick={closeModal}>
                                        Cerrar
                                    </SecondaryButton>
                                </div>
                            </div>
                        </Modal>
                    )}
                </>
            ) : (
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-500 dark:text-gray-400">
                    No hay registros disponibles
                    <CgUnavailable className="text-red-500 text-xl" />
                </h2>
            )}
        </>
    );
};

export default CardsCustomOnlyView;
