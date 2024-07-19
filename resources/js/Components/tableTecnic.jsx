import { useState, useEffect } from "react";
import { CgUnavailable } from "react-icons/cg";
import { RiArrowUpDownFill } from "react-icons/ri";
import FloatInputText from "@/Components/FloatInputText";
import { FaArrowDownShortWide, FaArrowUpShortWide } from "react-icons/fa6";
import {
    EditCircleButton
} from "@/Components/CustomButtons";
import SecondaryButton from "@/Components/SecondaryButton";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import Checkbox from "@/Components/Checkbox";

const TableCustomT = ({
    headers,
    data,
    searchColumns,
    onEdit,
    idKey,
    onSelectChange,
    selectedItems,
    onSelectAll,
}) => {
    const styles =
        "text-indigo-600 shadow-sm focus:ring-violet-500 dark:focus:ring-violet-600";
    const [searchValue, setSearchValue] = useState("");
    const [filteredData, setFilteredData] = useState(data);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc",
    });
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchValue(value);
        const filtered = data.filter((item) => {
            return searchColumns.some((column) => {
                if (column === "roles") {
                    return item[column].some((role) =>
                        role.role_name.toLowerCase().includes(value),
                    );
                }
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
            if (columnKey === "roles") {
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
                            id="search-button"
                            onChange={handleSearch}
                            value={searchValue}
                        />
                    </nav>
                    {filteredData.length > 0 ? (
                        <div className="relative overflow-x-scroll shadow-md sm:rounded-lg">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="p-4">
                                            <div className="flex items-center">
                                                <Checkbox
                                                    className={styles}
                                                    checked={
                                                        selectedItems.length ===
                                                        data.length
                                                    }
                                                    onChange={onSelectAll}
                                                />
                                                <label
                                                    htmlFor="checkbox-all"
                                                    className="sr-only"
                                                >
                                                    checkbox
                                                </label>
                                            </div>
                                        </th>
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
                                            className="px-6 py-3 items-center"
                                        >
                                            Acción
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentData.map((item, index) => (
                                        <tr
                                            key={item[idKey]}
                                            className={`border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 ${
                                                selectedItems.includes(
                                                    item[idKey],
                                                )
                                                    ? "bg-violet-100 dark:bg-violet-900"
                                                    : "bg-white dark:bg-gray-800"
                                            }`}
                                        >
                                            <td className="w-4 p-4">
                                                <div className="flex items-center">
                                                    <Checkbox
                                                        className={styles}
                                                        checked={selectedItems.includes(
                                                            item[idKey],
                                                        )}
                                                        onChange={() =>
                                                            onSelectChange(
                                                                item[idKey],
                                                            )
                                                        }
                                                    />
                                                    <label
                                                        htmlFor="checkbox-table-search-1"
                                                        className="sr-only"
                                                    >
                                                        checkbox
                                                    </label>
                                                </div>
                                            </td>
                                            {searchColumns.map(
                                                (column, idx) => (
                                                    <td
                                                        key={idx}
                                                        className="px-6 py-4 whitespace-pre-wrap truncate"
                                                    >
                                                        {column === "roles"
                                                            ? item[column]
                                                                  .length > 0
                                                                ? item[column]
                                                                      .map(
                                                                          (
                                                                              role,
                                                                          ) =>
                                                                              role.role_name,
                                                                      )
                                                                      .join(
                                                                          ", ",
                                                                      )
                                                                : "Sin Rol"
                                                            : item[column]}
                                                    </td>
                                                ),
                                            )}
                                            <td className="flex items-center px-6 py-4 gap-1">
                                                <EditCircleButton
                                                    onClick={() => onEdit(item)}
                                                />
                                              
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
                                    Atras
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
        </>
    );
};

export default TableCustomT;
