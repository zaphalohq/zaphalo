import { useRecoilState } from "recoil";
import { currentUserState } from "../states/currentUserState";
import { Outlet } from "react-router-dom";
import Unauthorized from "../components/Unauthorized";

const AdminProtectedRoute = () => {
    const [currentUser] = useRecoilState(currentUserState);
    let isadmin=false
    if(currentUser?.currentUserWorkspace.role==="admin"){
        isadmin=true;
    }

  return isadmin ? <Outlet /> : <Unauthorized/>;
}

export default AdminProtectedRoute