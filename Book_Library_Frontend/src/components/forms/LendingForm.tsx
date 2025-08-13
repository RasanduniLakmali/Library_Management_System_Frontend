import type {Lending, LendingBook, LendingFormData} from "../../types/Lending.ts";
import React, {useEffect, useState} from "react";
import { getBookTitleWithISBN} from "../../services/bookService.ts";
import {viewReaderNames} from "../../services/readerService.ts";



interface LendingFormProps {
    lending: Lending | null;
    onSubmit: (data: LendingFormData) => void;
}

interface FormErrors {
    readerName?: string;
    books?: LendingBook[];
    borrowDate?: string;
    dueDate?: Date;
    returnDate?: Date | null;
    status?: string;
}


const LendingForm = ( {lending, onSubmit} : LendingFormProps) => {

    const [bookTitles, setBookTitles] = useState<LendingBook[]>([]);
    const [readerNames, setReaderNames] = useState<string[]>([]);

    const [formData,setFormData] = useState<LendingFormData>({
        readerName: "",
        books: [],
        borrowDate: "",
        dueDate: "",
        returnDate: "",
        status: ""
    })

    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {

        fetchBookNames()
        fetchReaderNames()

        if(lending) {
            setFormData({
                readerName: lending.readerName,
                books: lending.books,
                borrowDate: lending.borrowDate,
                dueDate: lending.dueDate,
                returnDate: lending.returnDate,
                status: lending.status,
            })
        }else {
            setFormData({
                readerName: "",
                books: [],
                borrowDate: "",
                dueDate: "",
                returnDate: "",
                status: ""
            })
        }
        setErrors({})

    },[lending])

    const validateForm = () : boolean => {

        const newErrors: FormErrors = {};

        if(!formData.status.trim()){
            newErrors.status = "Status is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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

        setFormData((prev) => {
            const updatedFormData = { ...prev, [name]: value };

            if (name === "borrowDate") {
                const borrowDate = new Date(value);


                if (!isNaN(borrowDate.getTime())) {
                    const dueDate = new Date(borrowDate);
                    dueDate.setDate(borrowDate.getDate() + 5);

                    updatedFormData.dueDate = dueDate.toISOString().slice(0, 10);
                } else {

                    updatedFormData.dueDate = "";
                }
            }

            return updatedFormData;
        });

        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };


    const fetchBookNames = async () => {
        try{
            const titles = await getBookTitleWithISBN();
            setBookTitles(titles);
        }catch(error){
            console.log(error);
        }

    }

    const fetchReaderNames = async () => {

        try{
            const readerNames = await viewReaderNames();
            setReaderNames(readerNames);
        }catch(error){
            console.log(error);
        }

    }


    return (
        <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 min-h-screen p-6">
            <div className="max-w-4xl mx-auto">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 rounded-t-2xl p-6 text-white">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl shadow-lg">
                            <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">
                                {lending ? "Edit Lending" : "Add New Lending"}
                            </h1>
                            <p className="text-purple-200">Fill in the lending details below</p>
                        </div>
                    </div>
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-b-2xl shadow-xl border border-purple-100">
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Reader Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Reader Name
                                </label>
                                <select
                                    id="readerName"
                                    name="readerName"
                                    value={formData.readerName}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ${
                                        errors.readerName ? "border-red-500 bg-red-50" : "border-purple-200 hover:border-purple-300"
                                    }`}
                                >
                                    <option value="">Select a reader</option>
                                    {readerNames.map((name, index) => (
                                        <option key={index} value={name}>
                                            {name}
                                        </option>
                                    ))}
                                </select>
                                {errors.readerName && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center">
                                        <svg
                                            className="w-4 h-4 mr-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        {errors.readerName}
                                    </p>
                                )}
                            </div>

                            {/* Books */}
                            {[0, 1].map((index) => (
                                <div key={index} className="grid grid-cols-2 gap-4 items-center">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Book {index + 1}
                                        </label>
                                        <select
                                            value={formData.books[index]?.title || ""}
                                            onChange={(e) => {
                                                const selectedTitle = e.target.value;
                                                const selectedBook = bookTitles.find(
                                                    (book) => book.title === selectedTitle
                                                );
                                                setFormData((prev) => {
                                                    const updatedBooks = [...prev.books];
                                                    updatedBooks[index] = selectedBook || { title: "", isbn: "" };
                                                    return { ...prev, books: updatedBooks };
                                                });
                                            }}
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ${
                                                errors.books && errors.books[index]
                                                    ? "border-red-500 bg-red-50"
                                                    : "border-purple-200 hover:border-purple-300"
                                            }`}
                                        >
                                            <option value="">Select a book</option>
                                            {bookTitles.map((book) => (
                                                <option key={book.title} value={book.title}>
                                                    {book.title}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.books && errors.books[index] && (
                                            <p className="text-red-500 text-sm mt-2 flex items-center">
                                                <svg
                                                    className="w-4 h-4 mr-1"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>

                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            ISBN
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.books[index]?.isbn || ""}
                                            readOnly
                                            className="w-full px-4 py-3 border rounded-xl bg-gray-100"
                                        />
                                    </div>
                                </div>
                            ))}

                            {/* Borrowed Date */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Borrowed Date
                                </label>
                                <input
                                    type="text"
                                    id="borrowDate"
                                    name="borrowDate"
                                    value={formData.borrowDate}
                                    onChange={handleChange}
                                    placeholder="Enter Borrowed Date"
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ${
                                        errors.borrowDate ? "border-red-500 bg-red-50" : "border-purple-200 hover:border-purple-300"
                                    }`}
                                />
                                {errors.borrowDate && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center">
                                        <svg
                                            className="w-4 h-4 mr-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        {errors.borrowDate}
                                    </p>
                                )}
                            </div>

                            {/* Due Date */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    id="dueDate"
                                    name="dueDate"
                                    value={
                                        formData.dueDate
                                            ? new Date(formData.dueDate).toISOString().slice(0, 10)
                                            : ""
                                    }
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ${
                                        errors.dueDate ? "border-red-500 bg-red-50" : "border-purple-200 hover:border-purple-300"
                                    }`}
                                />
                            </div>

                            {/* Return Date */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Return Date
                                </label>
                                <input
                                    type="date"
                                    id="returnDate"
                                    name="returnDate"
                                    value={formData.returnDate ?? ""}
                                    onChange={handleChange}
                                    placeholder="Enter Return Date"
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ${
                                        errors.returnDate ? "border-red-500 bg-red-50" : "border-purple-200 hover:border-purple-300"
                                    }`}
                                />
                                {/* Uncomment below if you want to show returnDate errors */}
                                {/* {errors.returnDate && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {errors.returnDate}
                </p>
              )} */}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Status
                                </label>
                                <input
                                    type="text"
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    placeholder="Enter Status"
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ${
                                        errors.status ? "border-red-500 bg-red-50" : "border-purple-200 hover:border-purple-300"
                                    }`}
                                />
                                {errors.status && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center">
                                        <svg
                                            className="w-4 h-4 mr-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        {errors.status}
                                    </p>
                                )}
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
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{lending ? "Update Lending" : "Add Lending"}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

}

export default LendingForm;