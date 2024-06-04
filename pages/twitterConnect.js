import { useDispatch } from "react-redux";
import { connectionWindowsOpened } from "../redux/slices/connectionSlice";

const TwitterConnect = () => {
    const dispatch = useDispatch();
    //console.log("close windownd ")
    window.close();
    dispatch(connectionWindowsOpened(false))
}
export default TwitterConnect;
