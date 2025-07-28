import {UseAuth} from "../context/UseAuth.ts";
import Navbar from "../components/Navbar.tsx";
import {Outlet} from "react-router-dom";



const Layout = () => {
    const {isAuthenticating} = UseAuth()

    if (isAuthenticating) return <div>Loading...</div>

    return (
        <div className='h-screen'>

            <div className='fixed top-0 left-0 right-0 z-50'>
                <Navbar />
            </div>
            <main className='pt-16 h-full overflow-y-auto'>
                <Outlet />
            </main>
        </div>
    )
}

export default Layout