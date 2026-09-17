import { Outlet } from "react-router-dom";
import TabBar from "./TabBar";

/**
 * Wraps the three tabbed routes (Restaurants, Drinks, Pantry) plus their
 * drill-in screens (restaurant detail). Each page still renders its own
 * <PageContainer> — this only adds the persistent tab bar alongside it.
 */
export default function TabsLayout() {
  return (
    <>
      <Outlet />
      <TabBar />
    </>
  );
}
