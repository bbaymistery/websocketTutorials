import PublicChat from "./components/PublicChat";
import RoomChat from "./components/RoomChat";
import LiveVisitors from "./components/LiveVisitors";

export const routes = [
    { path: "/", exact: true, Component: PublicChat },
    { path: "/roomChat", Component: RoomChat },
    { path: "/liveVisitors", Component: LiveVisitors }
];