import { useDispatch } from "react-redux";
import { connectionWindow } from "../redux/actions/connectionAction";

const TwitterConnect = () => {
  const dispatch = useDispatch();
  //console.log("close windownd ")
  window.close();
  dispatch(connectionWindow(false));
};
export default TwitterConnect;
