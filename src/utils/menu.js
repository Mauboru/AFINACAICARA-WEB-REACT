import { TbLayoutDashboardFilled } from "react-icons/tb";
import { GiPlantsAndAnimals } from "react-icons/gi";

const menu = [
    {
        label: "Items 01",
        path: "/items01",
        icon: TbLayoutDashboardFilled,
        subItems: [
            { label: "SubItem 01", path: "/items01/subItem01", icon: GiPlantsAndAnimals },
            { label: "SubItem 02", path: "/items01/subItem02", icon: GiPlantsAndAnimals },
        ]
    },
    {
        label: "Items 02",
        path: "/items02",
        icon: TbLayoutDashboardFilled,
        subItems: [
            { label: "SubItem 03", path: "/items02/subItem03", icon: GiPlantsAndAnimals },
            { label: "SubItem 04", path: "/items02/subItem04", icon: GiPlantsAndAnimals },
        ]
    },
];

export const getMenuByRole = (role) => {
    return menu.filter(item => {
        if (item.label === "Items 02" && role !== "manager") return false;
        return true;
    });
};

export default menu;
