import { IoPeopleSharp } from "react-icons/io5";
import { FaPhone } from "react-icons/fa";
import { FaMapMarkedAlt } from "react-icons/fa";
import { TbBuildingEstate } from "react-icons/tb";
import { FaMountainCity } from "react-icons/fa6";

const tabs = [
    {
        name: "Clientes",
        route: "clients.index",
        icon: IoPeopleSharp,
    },
    {
        name: "Telefonos",
        route: "phones.index",
        icon: FaPhone,
    },
    {
        name: "Sectores",
        route: "sectors.index",
        icon: FaMapMarkedAlt,
    },
    {
        name: "Parroquias",
        route: "parishes.index",
        icon: TbBuildingEstate,
    },
    {
        name: "Cantones",
        route: "cantons.index",
        icon: FaMountainCity,
    },
];

export default tabs;
