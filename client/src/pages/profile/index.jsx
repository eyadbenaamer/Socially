import { useWindowWidth } from "hooks/useWindowWidth";
import Sidebar from "components/sidebar";

const Profile = () => {
  const windowWidth = useWindowWidth();
  return <>{windowWidth >= 1100 && <Sidebar />}</>;
};

export default Profile;
