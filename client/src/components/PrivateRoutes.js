import React from "react"
import { navigate } from "gatsby";
import { isLoggedIn } from "../services/auth";

const PrivateRoute = () => {
    if (!isLoggedIn() && location.pathname !== `/app/login`) {
        navigate("/auth/login")
        return null
    }
}
export default PrivateRoute;
