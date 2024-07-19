import { useState, useEffect } from "react";
import { CgUnavailable } from "react-icons/cg";
import { RiArrowUpDownFill } from "react-icons/ri";
import FloatInputText from "@/Components/FloatInputText";
import { FaArrowDownShortWide, FaArrowUpShortWide } from "react-icons/fa6";
import {
    EditCircleButton,
    DeleteCircleButton,
} from "@/Components/CustomButtons";
import SecondaryButton from "@/Components/SecondaryButton";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import Checkbox from "@/Components/Checkbox";
import Modal from "@/Components/Modal";

const CardsCustom = ({
    headers,
    data,
    searchColumns,
    onDelete,
    onEdit,
    idKey,
    onSelectChange,
    selectedItems,
    onSelectAll,
}) => {
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
                if (column === "roles" && Array.isArray(item[column])) {
                    return item[column].some((role) =>
                        role.role_name.toLowerCase().includes(value),
                    );
                }
                const fieldValue = String(item[column]).toLowerCase();
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
            if (
                columnKey === "roles" &&
                Array.isArray(a[columnKey]) &&
                Array.isArray(b[columnKey])
            ) {
                const rolesA = a[columnKey]
                    .map((role) => role.role_name)
                    .join(", ");
                const rolesB = b[columnKey]
                    .map((role) => role.role_name)
                    .join(", ");
                return direction === "asc"
                    ? rolesA.localeCompare(rolesB)
                    : rolesB.localeCompare(rolesA);
            }
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
        if (item) {
            setModalData(item);
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalData(null);
    };

    const renderFieldValue = (item, column) => {
        if (column === "roles") {
            if (Array.isArray(item[column]) && item[column].length > 0) {
                return item[column].map((role) => role.role_name).join(", ");
            } else {
                return "Sin Rol";
            }
        }
        return String(item[column]);
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
                        <div className="flex items-center my-3">
                            <Checkbox
                                className={styles}
                                checked={selectedItems.length === data.length}
                                onChange={onSelectAll}
                                id="checkbox-all"
                            />
                            <label htmlFor="checkbox-all" className="ml-2">
                                Seleccionar todo
                            </label>
                        </div>
                    </nav>
                    {filteredData.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {currentData.map((item) => (
                                <div
                                    key={item[idKey]}
                                    className={`border rounded-lg p-4 shadow-md dark:border-gray-700 dark:bg-gray-800 ${
                                        selectedItems.includes(item[idKey])
                                            ? "bg-violet-100 dark:bg-violet-900"
                                            : "bg-white dark:bg-gray-800"
                                    }`}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <Checkbox
                                            className={styles}
                                            checked={selectedItems.includes(
                                                item[idKey],
                                            )}
                                            onChange={() =>
                                                onSelectChange(item[idKey])
                                            }
                                        />
                                        <div className="flex gap-2">
                                            <EditCircleButton
                                                onClick={() => onEdit(item)}
                                            />
                                            <DeleteCircleButton
                                                onClick={() =>
                                                    onDelete(item[idKey])
                                                }
                                            />
                                        </div>
                                    </div>
                                    {searchColumns.map((column, idx) => (
                                        <div
                                            key={idx}
                                            className="mb-2 whitespace-pre-wrap truncate"
                                        >
                                            <strong>{headers[idx]}: </strong>
                                            {renderFieldValue(item, column)}
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
                            Prev
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
                            Next
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
                                        {renderFieldValue(modalData, column)}
                                    </div>
                                ))}
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

export default CardsCustom;
