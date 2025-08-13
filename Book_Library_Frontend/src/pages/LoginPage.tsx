import { Eye, Mail, Lock, LogIn } from 'lucide-react';
import {UseAuth} from "../context/UseAuth.ts";
import {useState} from "react";
import {loginUser} from "../services/authService.ts";
import { toast } from "react-toastify";
import {Link, useNavigate} from "react-router-dom";



interface FormData {
    email: string;
    password: string;
}

interface FormErrors {
    email?: string
    password?: string
}



const Login = () => {

    const navigate = useNavigate();

    const {login} = UseAuth()

    const [formData,setFormData] = useState<FormData>({
        email: "",
        password: ""
    })

    const [errors, setErrors] = useState<FormErrors>({})

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        // Email validation
        if (!formData.email) {
            newErrors.email = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address"
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required"
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }


    const handleSubmit = async(e:React.FormEvent) => {
        e.preventDefault()

        if(validateForm()){

            try{
                const loginUserDetail = {
                    email: formData.email,
                    password: formData.password
                }

                const loginResponse = await loginUser(loginUserDetail)
                localStorage.setItem("accessToken", loginResponse.accessToken);

                if( loginResponse !== null){

                    toast.success("Login Successfully!", {
                        position: "top-center"
                    });
                    login(loginResponse.accessToken)
                    navigate("/dashboard")
                }

                console.log(loginResponse)
            }catch(error){
                toast.error("Login Unsuccessful")
                console.log(error)
            }
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }))
        }
    }


    return (
        <>

        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo and Header */}
                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Club Library</h1>
                    <p className="text-gray-600">Welcome back, sign in to your account</p>
                </div>


                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="john.doe@bookclub.lk"
                                />
                                {errors.email && <p className='mt-1 text-sm text-red-600'>{errors.email}</p>}
                            </div>
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="••••••••"
                                />
                                {errors.password && <p className='mt-1 text-sm text-red-600'>{errors.password}</p>}
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <Eye className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Remember Me and Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    name="remember"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>
                            <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                        >
                            <LogIn className="w-5 h-5 mr-2" />
                            Sign In
                        </button>

                    </form>

                    <br/>

                    {/* Footer */}
                    <div className='text-center'>
                        <p className='text-sm text-gray-600'>
                            Don't have an account?{" "}
                            <Link
                                to='/signup'
                                className='font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150'
                            >
                                Create new account
                            </Link>
                        </p>
                    </div>
                </div>

            </div>
        </div>
        </>
    );
}

export default Login;