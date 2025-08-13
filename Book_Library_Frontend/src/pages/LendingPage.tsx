import React, {useEffect, useState} from 'react';
import { Search, User, Book, Clock, CheckCircle, AlertCircle, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import type {Lending, LendingFormData} from "../types/Lending.ts";
import Dialog from "../components/Dialog.tsx";
import LendingForm from "../components/forms/LendingForm.tsx";
import {
    deleteLending,
    fetchAllLendings,
    lendingBooks,
    updateLendings,
    viewLendingByName
} from "../services/lendingService.ts";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const LendingPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectLending,setSelectLending] = useState<Lending | null>(null)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [, setLendings] = useState<Lending[]>([]);
    const [filteredLendings, setFilteredLendings] = useState<Lending[]>([]);
    const [, setIsLoading] = useState<boolean>(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);



    const handleAddLending = () => {
        setSelectLending(null);
        setIsAddDialogOpen(true)
    }

    const cancelDialog = () => {
        setIsAddDialogOpen(false)
        setIsEditDialogOpen(false)
        setSelectLending(null)
    }

    const handleEditLending = (lending: Lending) => {
        setSelectLending(lending);
        setIsEditDialogOpen(true)
    }

    const handleSubmit = async (lendingData: LendingFormData) => {

        const lendingPayload: Omit<Lending, "_id"> = {
            readerName: lendingData.readerName,
            books: lendingData.books.map(book => ({
                title: book.title,
                isbn: book.isbn
            })),
            borrowDate: lendingData.borrowDate,
            dueDate: lendingData.dueDate,
            returnDate: lendingData.returnDate,
            status: lendingData.status,
        };

        if (selectLending) {
            try {
                const updatedLending = await updateLendings(selectLending._id, lendingPayload);

                setLendings((prev) =>
                    prev.map((lending) => (lending._id === selectLending._id ? updatedLending : lending))
                );
                displayLendings();

               toast.success("Book Lending Updated Successfully!");

                setIsEditDialogOpen(false);

            } catch (error) {
                if (axios.isAxiosError(error)) {


                    toast.error("Book Lending Update Failed!");
                } else {
                    toast.error("Something went wrong");
                }
            }

        } else {

            try {
                const newLending = await lendingBooks(lendingPayload);
                setLendings((prev) => [...prev, newLending]);

                displayLendings();

                toast.success("Book Lending Successful!");

                setIsAddDialogOpen(false);

            } catch (error) {
                if (axios.isAxiosError(error)) {


                    toast.error("Book Lending Failed!");
                } else {
                    toast.error("Something went wrong");
                }
            }
        }

        setSelectLending(null);
    };



    const displayLendings = async () => {
        try {
            setIsLoading(true);
            const result = await fetchAllLendings()
            setLendings(result)
            setFilteredLendings(result);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.message)
            } else {
                toast.error("Lendings are not loaded!")
            }
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        displayLendings()

    }, [])


    const deleteLendingDetail = async (_id:string) =>{
        await deleteLending(_id);
    }


    const confirmDelete = async (lending: Lending) => {
        if (!lending) return;

        const result = await Swal.fire({
            title: "Delete this lending record?",
            text: "This action will permanently remove the lending record!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (!result.isConfirmed) return;

        try {
            await deleteLendingDetail(lending._id);

            await Swal.fire({
                title: "Deleted!",
                text: "Book lending deleted successfully.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });

            displayLendings();
        } catch (error) {
            await Swal.fire({
                title: "Error",
                text: axios.isAxiosError(error)
                    ? error.response?.data?.message || "Book lending not deleted!"
                    : "Deleting lending failed!",
                icon: "error",
            });
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800';
            case 'Overdue':
                return 'bg-red-100 text-red-800';
            case 'Returned':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Active':
                return <Clock className="w-4 h-4" />;
            case 'Overdue':
                return <AlertCircle className="w-4 h-4" />;
            case 'Returned':
                return <CheckCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    useEffect(() => {
        const fetchFilteredLendings = async () => {
            try {
                let result;

                if (searchTerm.trim() !== '') {
                    result = await viewLendingByName(searchTerm);
                } else {
                    result = await fetchAllLendings();
                }

                const filtered = result.filter(lending =>
                    statusFilter === 'All' ||
                    lending.status?.toLowerCase() === statusFilter.toLowerCase()
                );

                setFilteredLendings(filtered);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.message);
                } else {
                    toast.error("Failed to fetch lendings");
                }
            }
        };

        const delayDebounce = setTimeout(() => {
            fetchFilteredLendings();
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, statusFilter]);


    const formatDate = (date: Date | string) => {
        if (typeof date === 'string') {
            return new Date(date).toLocaleDateString();
        }
        return date.toLocaleDateString();
    };

    const isOverdue = (dueDate: Date | string, status: string) => {
        return status === 'Active' && new Date() > dueDate;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 shadow-2xl">
                <div className="px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
                                <Book className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-1">Lending Management</h1>
                                <p className="text-blue-100 text-lg">Track and manage book lendings</p>
                            </div>
                        </div>
                        <button
                            onClick={handleAddLending}
                            className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                            <Plus className="w-5 h-5" />
                            <span className="font-semibold">New Lending</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="px-6 py-6">
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 -mt-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search readers..."
                                    className="pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-80 text-gray-900 placeholder-gray-500 font-medium transition-all duration-300"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-gray-700 bg-white transition-all duration-300"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Overdue">Overdue</option>
                                <option value="Returned">Returned</option>
                            </select>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-600 font-semibold bg-gray-100 px-4 py-2 rounded-xl">{filteredLendings.length} lendings</span>
                            <div className="flex bg-gray-100 rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-3 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-white shadow-lg transform scale-105' : 'hover:bg-gray-200'}`}
                                >
                                    <div className="w-4 h-4 border-2 border-gray-400 rounded"></div>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-3 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-white shadow-lg transform scale-105' : 'hover:bg-gray-200'}`}
                                >
                                    <div className="space-y-1">
                                        <div className="w-4 h-0.5 bg-gray-400 rounded"></div>
                                        <div className="w-4 h-0.5 bg-gray-400 rounded"></div>
                                        <div className="w-4 h-0.5 bg-gray-400 rounded"></div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-8">
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredLendings.map(lending => (
                            <div key={lending._id} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-indigo-100 rounded-lg">
                                            <User className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <h3 className="font-bold text-gray-900 text-lg">{lending.readerName}</h3>
                                    </div>
                                    <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(lending.status)} shadow-sm`}>
                                        {getStatusIcon(lending.status)}
                                        <span>{lending.status}</span>
                                    </span>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200">
                                        <p className="text-sm font-bold text-gray-900 mb-2">{lending.books.map(book => book.title).join(', ')}</p>
                                        <p className="text-xs text-gray-600 font-medium">ISBN: {lending.books.map(book => book.isbn).join(', ')}</p>
                                    </div>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-600 font-medium">Borrowed:</span>
                                            <span className="font-semibold text-gray-900">{formatDate(lending.borrowDate)}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-600 font-medium">Due:</span>
                                            <span className={`font-semibold ${isOverdue(lending.dueDate, lending.status) ? 'text-red-600' : 'text-gray-900'}`}>
                                                {formatDate(lending.dueDate)}
                                            </span>
                                        </div>
                                        {lending.returnDate && (
                                            <div className="flex justify-between items-center py-2">
                                                <span className="text-gray-600 font-medium">Returned:</span>
                                                <span className="font-semibold text-green-600">{formatDate(lending.returnDate)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => {
                                            setSelectLending(lending);
                                            setIsViewDialogOpen(true);
                                        }}
                                        className="flex items-center justify-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 font-medium">
                                        <Eye className="w-4 h-4" />
                                        <span>View</span>
                                    </button>
                                    <button
                                        onClick={() => handleEditLending(lending)}
                                        className="flex items-center justify-center space-x-2 px-4 py-2 text-sm text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl border-2 border-indigo-200 hover:border-indigo-300 transition-all duration-300 font-medium">
                                        <Edit className="w-4 h-4" />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(lending)}
                                        className="flex items-center justify-center px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl border-2 border-red-200 hover:border-red-300 transition-all duration-300">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Reader</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Book</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Borrowed</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Due Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {filteredLendings.map(lending => (
                                    <tr key={lending._id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                                                    <User className="w-5 h-5 text-indigo-600" />
                                                </div>
                                                <span className="font-bold text-gray-900">{lending.readerName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-bold text-gray-900">{lending.books.map(book => book.title).join(', ')}</div>
                                                <div className="text-sm text-gray-600 font-medium">ISBN: {lending.books.map(book => book.isbn).join(', ')
                                                }</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                                            {formatDate(lending.borrowDate)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`font-semibold ${isOverdue(lending.dueDate, lending.status) ? 'text-red-600' : 'text-gray-700'}`}>
                                                {formatDate(lending.dueDate)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(lending.status)} shadow-sm`}>
                                                {getStatusIcon(lending.status)}
                                                <span>{lending.status}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-3">
                                                <button className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-all duration-300">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="text-indigo-600 hover:text-indigo-700 p-2 hover:bg-indigo-100 rounded-lg transition-all duration-300">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button className="text-red-600 hover:text-red-700 p-2 hover:bg-red-100 rounded-lg transition-all duration-300">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <Dialog
                    isOpen={isAddDialogOpen}
                    onCancel={cancelDialog}
                    onConfirm={() => {

                        const form = document.querySelector("form") as HTMLFormElement
                        if (form) {
                            form.requestSubmit()
                        }
                    }}
                    title='Add New Lending'
                >
                    <LendingForm
                        onSubmit={handleSubmit}
                        lending={selectLending || null}
                    />
                </Dialog>

                <Dialog
                    isOpen={isViewDialogOpen}
                    onCancel={() => {
                        setIsViewDialogOpen(false);
                        setSelectLending(null);
                    }}
                    onConfirm={() => setIsViewDialogOpen(false)}
                >
                    {isViewDialogOpen && selectLending && (
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 border-b pb-3 mb-2">
                                <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M8 7V3m8 4V3m-9 4h10M5 11h14M5 15h14M5 19h14" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800">Lending Information</h2>
                                    <p className="text-sm text-gray-500">Details about the selected lending</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Reader</p>
                                    <p className="text-gray-800 font-medium">
                                        {Array.isArray(selectLending.readerName)
                                            ? selectLending.readerName.join(" ")
                                            : selectLending.readerName}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500">Status</p>
                                    <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium
            ${selectLending.status === 'Returned'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'}`}
                                    >
            {selectLending.status}
          </span>
                                </div>
                                <div>
                                    <p className="text-gray-500">Lending Date</p>
                                    <p className="text-gray-800 font-medium">
                                        {new Date(selectLending.borrowDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Return Date</p>
                                    <p className="text-gray-800 font-medium">
                                        {selectLending.returnDate
                                            ? new Date(selectLending.returnDate).toLocaleDateString()
                                            : "Not returned yet"}
                                    </p>
                                </div>

                                <div className="sm:col-span-2">
                                    <p className="text-gray-500 mb-1">Books</p>
                                    <ul className="list-disc list-inside pl-4 text-gray-800 space-y-1">
                                        {selectLending.books?.map((book, index) => (
                                            <li key={index}>
                                                {book.title} <span className="text-gray-500">(ISBN: {book.isbn})</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </Dialog>

                <Dialog
                    isOpen={isEditDialogOpen}
                    onCancel={cancelDialog}
                    onConfirm={() => {
                        const form = document.querySelector("form") as HTMLFormElement
                        if (form) {
                            form.requestSubmit()
                        }
                    }}
                    title='Edit Lending'
                >
                    <LendingForm lending={selectLending} onSubmit={handleSubmit} />

                </Dialog>

            </div>
        </div>
    );
};

export default LendingPage;