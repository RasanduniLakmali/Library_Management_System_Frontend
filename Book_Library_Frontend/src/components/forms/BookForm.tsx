import React, { useEffect, useState } from "react";
import type { Book, BookFormData } from "../../types/Book.ts";

interface BookFormProps {
    book?: Book | null;
    onSubmit: (bookData: Omit<Book, "_id">) => void;
}

interface FormErrors {
    title?: string;
    author?: string;
    isbn?: string;
    category?: string;
    status?: 'Available' | 'Lent' | 'Reserved';
    publicationYear?: string;
    publisher?: string;
    description?: string;
}


const categories = ["Select Category", "Fiction", "Non-Fiction", "Science", "History", "Biography","Child"];
const statuses = ["Select Status", "Available", "Lent", "Reserved"];

const BookForm = ({ book, onSubmit }: BookFormProps) => {
    const [formData, setFormData] = useState<BookFormData>({
        title: "",
        author: "",
        isbn: "",
        category: "",
        status: 'Available',
        publicationYear: "",
        publisher: "",
        description: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (book) {
            setFormData({
                title: book.title,
                author: book.author,
                isbn: book.isbn,
                category: book.category,
                status: book.status,
                publicationYear:book.publicationYear,
                publisher: book.publisher,
                description: book.description,
            });
        } else {
            setFormData({
                title: "",
                author: "",
                isbn: "",
                category: "",
                status: 'Available',
                publicationYear: "",
                publisher: "",
                description: "",
            });
        }
        setErrors({});
    }, [book]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        } else if (formData.title.trim().length < 3) {
            newErrors.title = "Title must be at least 3 characters";
        }

        if (!formData.author.trim()) {
            newErrors.author = "Author is required";
        } else if (formData.author.trim().length < 2) {
            newErrors.author = "Author name must be at least 2 characters";
        }

        if (!formData.isbn.trim()) {
            newErrors.isbn = "ISBN is required";
        }

        if (!formData.category.trim()) {
            newErrors.category = "Category is required";
        }

        if (!formData.publisher.trim()) {
            newErrors.publisher = "Publisher is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit({
                ...formData,
                publicationYear: String(formData.publicationYear).trim(),

            });
        }
    };



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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{book ? "Edit Book" : "Add New Book"}</h1>
                            <p className="text-purple-200">Fill in the book details below</p>
                        </div>
                    </div>
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-b-2xl shadow-xl border border-purple-100">
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ${
                                        errors.title ? "border-red-500 bg-red-50" : "border-purple-200 hover:border-purple-300"
                                    }`}
                                    placeholder="Enter Book Title"
                                />
                                {errors.title && <p className="text-red-500 text-sm mt-2 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.title}
                                </p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Author</label>
                                <input
                                    type="text"
                                    id="author"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ${
                                        errors.author ? "border-red-500 bg-red-50" : "border-purple-200 hover:border-purple-300"
                                    }`}
                                    placeholder="Enter Author Name"
                                />
                                {errors.author && <p className="text-red-500 text-sm mt-2 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.author}
                                </p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">ISBN</label>
                                <input
                                    type="text"
                                    id="isbn"
                                    name="isbn"
                                    value={formData.isbn}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ${
                                        errors.isbn ? "border-red-500 bg-red-50" : "border-purple-200 hover:border-purple-300"
                                    }`}
                                    placeholder="Enter ISBN Number"
                                />
                                {errors.isbn && <p className="text-red-500 text-sm mt-2 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.isbn}
                                </p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                <div className="relative">
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 appearance-none bg-white ${
                                            errors.category ? "border-red-500 bg-red-50" : "border-purple-200 hover:border-purple-300"
                                        }`}
                                    >
                                        {categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                    <svg className="absolute right-3 top-3 w-5 h-5 text-purple-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                                {errors.category && <p className="text-red-500 text-sm mt-2 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.category}
                                </p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                                <div className="relative">
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
                                    <svg className="absolute right-3 top-3 w-5 h-5 text-purple-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Publication Year</label>
                                <input
                                    type="text"
                                    id="publicationYear"
                                    name="publicationYear"
                                    value={formData.publicationYear}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ${
                                        errors.publicationYear ? "border-red-500 bg-red-50" : "border-purple-200 hover:border-purple-300"
                                    }`}
                                    placeholder="Enter Publication Year"
                                />
                                {errors.publicationYear && <p className="text-red-500 text-sm mt-2 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.publicationYear}
                                </p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Publisher</label>
                                <input
                                    type="text"
                                    id="publisher"
                                    name="publisher"
                                    value={formData.publisher}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 ${
                                        errors.publisher ? "border-red-500 bg-red-50" : "border-purple-200 hover:border-purple-300"
                                    }`}
                                    placeholder="Enter Publisher Name"
                                />
                                {errors.publisher && <p className="text-red-500 text-sm mt-2 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {errors.publisher}
                                </p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 hover:border-purple-300 resize-none"
                                    placeholder="Brief description of the book..."
                                />
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
                                <span>{book ? "Update Book" : "Add Book"}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookForm;
