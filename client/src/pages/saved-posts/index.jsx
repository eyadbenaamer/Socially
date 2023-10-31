import { useWindowWidth } from "hooks/useWindowWidth";
import Sidebar from "components/sidebar";

const SavedPosts = () => {
  const windowWidth = useWindowWidth();
  return <>{windowWidth >= 1100 && <Sidebar />}</>;
};

export default SavedPosts;
