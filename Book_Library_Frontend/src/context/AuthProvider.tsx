import {useState,useEffect} from "react";
import apiClient, {setHeader} from "../services/apiClient.ts";
import {AuthContext} from "./AuthContext.ts";
import router from "../router.tsx";

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isLoggedIn,setIsLoggedIn] = useState<boolean>(false)
    const [accessToken, setAccessToken] = useState<string>("")
    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true)


    const login = (token:string) => {
        setIsLoggedIn(true)
        setAccessToken(token)
    }

    const logout = () => setIsLoggedIn(false)

    useEffect(() => {
        setHeader(accessToken);
    },[accessToken])


    useEffect(() => {
        const tryRefresh = async () => {
            try {
                const result = await apiClient.post("/auth/refresh-token");

                if (result.data?.accessToken) {
                    setAccessToken(result.data.accessToken);
                    setIsLoggedIn(true);

                    const currentPath = window.location.pathname;
                    if (currentPath === "/" || currentPath === "/login" || currentPath === "/signup") {
                        router.navigate("/dashboard");
                    }
                }
            } catch (error) {
                console.log(error);
                setAccessToken("");
                setIsLoggedIn(false);
            } finally {
                setIsAuthenticating(false);
            }
        };

        tryRefresh()

    },[])


    return(
        <AuthContext.Provider value={{isLoggedIn,login,logout,isAuthenticating}}>
            {children}
        </AuthContext.Provider>
    )
}