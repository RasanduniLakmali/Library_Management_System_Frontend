import { useState } from "react"
import { useNavigate,useLocation } from "react-router-dom"
import {UseAuth} from "../context/UseAuth.ts";
// import {logOutUser} from "../services/authService.ts";
import toast from "react-hot-toast";
import axios from "axios";


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation();
  const currentPath = location.pathname;
  const {isLoggedIn, logout} = UseAuth()

  console.log(isLoggedIn)

  const handleLogin = () => {

    console.log("Login")
    navigate("/login")

  }


  const handleLogout = async () => {

    try {
      console.log("Logout")
      // await logOutUser()
      toast.success("Logout successful!")
      logout()
      navigate("/login")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.message)
      } else {
        toast.error("Something went wrong")
      }
    }

  }

  const handleDashboard = () => {
    console.log("Dashboard")
    navigate("/dashboard")
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
      <nav className='bg-gradient-to-r from-purple-100 via-indigo-50 to-purple-50 shadow-lg border-b-2 border-purple-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            {/* Logo Section */}
            <div className='flex items-center'>
              <div className='flex items-center space-x-3'>
                <div className='p-2 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-md border border-purple-300'>
                  <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h1 className='text-xl font-bold text-purple-800 tracking-tight'>
                    LibraryMS
                  </h1>
                  <p className='text-purple-600 text-xs font-medium'>Management System</p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className='hidden md:flex items-center space-x-3'>
              {!isLoggedIn && (
                  <button
                      onClick={handleLogin}
                      className='flex items-center space-x-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-medium text-sm'
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign In</span>
                  </button>
              )}

              {isLoggedIn && currentPath !== "/login" && (
                  <>
                    <button
                        onClick={handleDashboard}
                        className='flex items-center space-x-2 bg-gray-600 text-white px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-medium text-sm'
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0H8v0z" />
                      </svg>
                      <span>Dashboard</span>
                    </button>
                    </>
              )}

              {isLoggedIn && currentPath !== "/login" && (
                  <>
                    <button
                        onClick={handleLogout}
                        className='flex items-center space-x-2 bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-medium text-sm'
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </>
                )}

            </div>

            {/* Mobile menu button */}
            <div className='md:hidden'>
              <button
                  onClick={toggleMenu}
                  className='p-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300 shadow-md'
              >
                <svg className={`h-5 w-5 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`} fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  {isMenuOpen ? (
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  ) : (
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <div className='px-3 pt-3 pb-4 space-y-2 bg-purple-100 rounded-b-xl border-t border-purple-200 mt-2'>
              {!isLoggedIn && (
                  <button
                      onClick={handleLogin}
                      className='flex items-center space-x-3 w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-all duration-300 shadow-md font-medium'
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign In</span>
                  </button>
              )}

              {isLoggedIn && (
                  <>
                    <button
                        onClick={handleDashboard}
                        className='flex items-center space-x-3 w-full bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-all duration-300 shadow-md font-medium'
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0H8v0z" />
                      </svg>
                      <span>Dashboard</span>
                    </button>
                    </>
                  )}

              {isLoggedIn && (
                  <>
                    <button
                        onClick={handleLogout}
                        className='flex items-center space-x-3 w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md font-medium'
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </>
              )}
            </div>
          </div>
        </div>
      </nav>
  )
}

export default Navbar
