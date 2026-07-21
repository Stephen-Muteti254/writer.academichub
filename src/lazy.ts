import { lazy } from "react";

export const OrderDetails = lazy(() => import("@/pages/OrderDetails"));

export const MyOrders = lazy(() => import("@/pages/MyOrders"));
export const AvailableOrders = lazy(() => import("@/pages/AvailableOrders"));
export const SubmitWork = lazy(() => import("@/pages/SubmitWork"));
export const DashboardLayout = lazy(() => import("@/components/DashboardLayout"));