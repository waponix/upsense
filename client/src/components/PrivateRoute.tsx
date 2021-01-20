import React from "react"
import { navigate } from "gatsby"
import { isLoggedIn } from "../services/auth"

const PrivateRoute = ({ location, ...rest }) => {
    if (!isLoggedIn() && location.pathname !== `/app/login`) {
        navigate("/auth/login")
        return null
    }
    return null;
}

export default PrivateRoute;
