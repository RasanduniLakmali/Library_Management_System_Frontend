
import type {Reader, ReaderFormData} from "../../types/Reader.ts";
import React, {useState, useEffect} from "react";

interface ReaderFormProps {
    reader?: Reader | null;
    onSubmit: (readerData: Omit<Reader, "_id">) => void;
}

interface FormErrors {
    readerId?: string;
    name?:string,
    email?:string,
    phone?:string,
    address?:string,
    membershipDate?:string,
    status?:'Active' | 'Inactive' | 'Suspended',
    avatar?: string
}

const statuses = ["Select Status", "Active", "Inactive", "Suspended"];

const ReaderForm = ({ reader,onSubmit }: ReaderFormProps) => {
    const [formData,setFormData] = useState<ReaderFormData>({
        readerId: "",
        name: "",
        email: "",
        phone: "",
        address: "",
        membershipDate: "",
        status: "Active",
        avatar: "",
    })

    const [errors, setErrors] = useState<FormErrors>({})

    useEffect(() => {
        if(reader){
            setFormData({
                readerId: reader.readerId,
                name: reader.name,
                email:reader.email,
                phone: reader.phone,
                address: reader.address,
                membershipDate: reader.membershipDate,
                status: reader.status,
                avatar: reader.avatar,
            })
        }else {
            setFormData({
                readerId: "",
                name: "",
                email: "",
                phone: "",
                address: "",
                membershipDate: "",
                status: "Active",
                avatar: "",
            })
        }
        setErrors({})
    },[reader])


    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (formData.readerId === null) {
            newErrors.readerId = "Reader ID is required"
        }

        if (!formData.name.trim()) {
            newErrors.name = "Name is required"
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters"
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address"
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone is required"
        } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
            newErrors.phone = "Please enter a valid phone number"
        }

        if (!formData.address.trim()) {
            newErrors.address = "Address is required"
        } else if (formData.address.trim().length < 5) {
            newErrors.address = "Address must be at least 5 characters"
        }

        if (!formData.membershipDate.trim()) {
            newErrors.membershipDate = "Membership Date is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0

       }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            onSubmit(formData)
        }
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    return (
        <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 rounded-t-2xl p-6 text-white">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{reader ? "Edit Reader" : "Add New Reader"}</h1>
                            <p className="text-purple-200">Fill in the reader details below</p>
                        </div>
                    </div>
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-b-2xl shadow-xl border border-purple-100">
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Reader ID */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Reader ID</label>
                                <input
                                    type="text"
                                    id="readerId"
                                    name="readerId"
                                    value={formData.readerId}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ${
                                        errors.readerId ? "border-red-500 bg-red-50" : "border-purple-200 hover:border-purple-300"
                                    }`}
                                    placeholder="Enter Reader ID"
                                />
                                {errors.readerId && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {errors.readerId}
                                    </p>
                                )}
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ${
                                        errors.name ? "border-red-500 bg-red-50" : "border-purple-200 hover:border-purple-300"
                                    }`}
                                    placeholder="Enter Reader Name"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ${
                                        errors.email ? "border-red-500 bg-red-50" : "border-purple-200 hover:border-purple-300"
                                    }`}
                                    placeholder="Enter Email"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ${
                                        errors.phone ? "border-red-500 bg-red-50" : "border-purple-200 hover:border-purple-300"
                                    }`}
                                    placeholder="Enter Phone Number"
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {errors.phone}
                                    </p>
                                )}
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ${
                                        errors.address ? "border-red-500 bg-red-50" : "border-purple-200 hover:border-purple-300"
                                    }`}
                                    placeholder="Enter Address"
                                />
                                {errors.address && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {errors.address}
                                    </p>
                                )}
                            </div>

                            {/* Membership Date */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                                <input
                                    type="text"
                                    id="membershipDate"
                                    name="membershipDate"
                                    value={formData.membershipDate}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ${
                                        errors.membershipDate ? "border-red-500 bg-red-50" : "border-purple-200 hover:border-purple-300"
                                    }`}
                                    placeholder="Enter Membership Date"
                                />
                                {errors.membershipDate && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {errors.membershipDate}
                                    </p>
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 appearance-none bg-white hover:border-purple-300"
                                >
                                    {statuses.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-purple-100">
                            <button
                                type="button"
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium flex items-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span>Cancel</span>
                            </button>
                            <button
                                type="submit"
                                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium flex items-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{reader ? "Update Reader" : "Add Reader"}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

}

export default ReaderForm


