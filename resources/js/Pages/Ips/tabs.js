
import { TbCloudNetwork } from "react-icons/tb";
import { LuNetwork } from "react-icons/lu";
import { FaLocationPinLock } from "react-icons/fa6";
const tabs = [
    {
        name: "Olts",
        route: "olts.index",
        icon: TbCloudNetwork,
    },
    {
        name: "Naps de distribución",
        route: "distributionNaps.index",
        icon: LuNetwork,
    },
    {
        name: "Naps Ultima Milla",
        route: "lastmileNaps.index",
        icon: LuNetwork,
    },
    {
        name: "Ips",
        route: "ips.index",
        icon: FaLocationPinLock,
    },
];

export default tabs;