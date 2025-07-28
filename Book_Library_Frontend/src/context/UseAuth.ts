import {useContext} from "react";
import {AuthContext} from "./AuthContext.ts";


export const UseAuth = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth must be used within useAuth")
    }

    return context
}