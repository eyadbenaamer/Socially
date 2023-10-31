import { useWindowWidth } from "hooks/useWindowWidth";
import Sidebar from "components/sidebar";

const Notifications = () => {
  const windowWidth = useWindowWidth();
  return <>{windowWidth >= 1100 && <Sidebar />}</>;
};

export default Notifications;
