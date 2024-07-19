import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { BiCustomize } from "react-icons/bi";
const tabs = [
    {
        name: "Productos",
        route: "products.index",
        icon: MdOutlineProductionQuantityLimits,
    },

    {
        name: "Movimientos",
        route: "movements.index",
        icon: BiCustomize,
    },
    /*
    {
        name: "Direcciones",
        route: "addresses",
        icon: FaHome,
    },
    {
        name: "Parroquias",
        route: "parishes",
        icon: FaMapMarked,
    },
    {
        name: "Cantones",
        route: "cantons",
        icon: PiCityFill,
    },*/
];

export default tabs;
