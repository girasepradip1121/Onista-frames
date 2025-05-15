import { Navigate } from "react-router-dom";
import { userToken } from "../../Components/Variable";
import toast from "react-hot-toast";


const AdminRoute = ({ children }) => {
    const userData=userToken()
  const token = userData?.token
  const role = userData?.role

  if (!token || role !== "admin") {
    toast.error('Please Login With Admin Credentials')
    return <Navigate to="/"/>;
  }

  return children;
};

export default AdminRoute;
