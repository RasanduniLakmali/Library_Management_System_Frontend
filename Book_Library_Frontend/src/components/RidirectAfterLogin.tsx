import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UseAuth } from "../context/UseAuth";

const RedirectAfterLogin = () => {
    const { isLoggedIn, isAuthenticating } = UseAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticating && isLoggedIn) {
            const currentPath = location.pathname;
            const isOnPublicPage =
                currentPath === "/" || currentPath === "/login" || currentPath === "/signup";

            if (isOnPublicPage) {
                navigate("/dashboard", { replace: true });
            }
        }
    }, [isLoggedIn, isAuthenticating, location.pathname, navigate]);

    return null;
};

export default RedirectAfterLogin;

