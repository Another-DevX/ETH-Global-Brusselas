import { createContext, useContext } from "react";

export const DashboardContext = createContext(3);

export const useDashboardContext = () => {
    return useContext(DashboardContext);
}
