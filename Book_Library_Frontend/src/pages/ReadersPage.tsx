import {useEffect, useState} from 'react';
import { Search, Plus, Eye, Edit2, Trash2, Grid, List, Phone, Mail, Calendar, Users, User } from 'lucide-react';
import type {Reader} from "../types/Reader.ts";
import Dialog from "../components/Dialog.tsx";

import axios from "axios";
import toast from "react-hot-toast";
import {
    addReaders,
    deleteReaders,
    fetchAllReaders,
    updateReaders,
    viewReaderByName
} from "../services/readerService.ts";
import ReaderForm from "../components/forms/ReaderForm.tsx";
import Swal from "sweetalert2";

const ReadersPage = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedReader, setSelectedReader] = useState<Reader | null>(null);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [, setReaders] = useState<Reader[]>([]);
    const [, setIsLoading] = useState<boolean>(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [filteredReaders, setFilteredReaders] = useState<Reader[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddReader = () => {
        setSelectedReader(null);
        setIsAddDialogOpen(true)
    }

    const handleEditReader = (reader: Reader) => {
        setSelectedReader(reader);
        setIsEditDialogOpen(true)
    }

    const cancelDialog = () => {
        setIsAddDialogOpen(false)
        setIsEditDialogOpen(false)
        setIsDeleteDialogOpen(false)
        setSelectedReader(null)
    }

    const handleSubmit = async (readerData: Omit<Reader, "_id">) => {
        if (selectedReader) {
            try {
                const updatedReader = await updateReaders(selectedReader._id, readerData)
                setReaders((prev) =>
                    prev.map((reader) => (reader._id === selectedReader._id ? updatedReader : reader))
                )

                Swal.fire("Reader Updated Successfully!");

                setIsEditDialogOpen(false)
            } catch (error) {
                if (axios.isAxiosError(error)) {

                    Swal.fire("Reader Not Updated !");


                    toast.error(error.message)
                } else {
                    toast.error("Something went wrong")
                }
            }
        } else {
            try {
                const newReader = await addReaders(readerData)
                setReaders((prev) => [...prev, newReader])

                Swal.fire("Reader Added Successfully!");

                setIsAddDialogOpen(false)

            } catch (error) {
                if (axios.isAxiosError(error)) {

                    Swal.fire("Reader Not Added !");

                    toast.error(error.message)
                } else {
                    toast.error("Something went wrong")
                }
            }
        }
        setSelectedReader(null)
    };

    const displayReaders = async () => {
        try {
            setIsLoading(true);
            const result = await fetchAllReaders()
            setReaders(result)
            setFilteredReaders(result);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.message)
            } else {
                toast.error("Readers are not loaded!")
            }
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        displayReaders()
    }, [])

    useEffect(() => {
        const fetchFilteredReaders = async () => {
            try {
                if (searchTerm.trim() !== '') {
                    const result = await viewReaderByName(searchTerm);
                    setFilteredReaders(result);
                } else {
                    const allReaders = await fetchAllReaders();
                    setFilteredReaders(allReaders);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.message);
                } else {
                    toast.error("Failed to filter readers");
                }
            }
        };

        const delayDebounce = setTimeout(() => {
            fetchFilteredReaders();
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const deleteReaderDetail = async (_id:string) =>{
        await deleteReaders(_id);
    }

    const handleDelete = (reader: Reader) => {
        setSelectedReader(reader);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async() => {
        if (selectedReader) {
            try {
                await deleteReaderDetail(selectedReader._id)

                Swal.fire("Reader Deleted Successfully!");

                displayReaders();
            }catch (error){
                if (axios.isAxiosError(error)){

                    Swal.fire("Reader Not Deleted!");

                    toast.error(error.message)
                }else {
                    toast.error("Deleting Reader Failed!")
                }
            }
            finally {
                setIsDeleteDialogOpen(false)
                setSelectedReader(null)
            }
        }
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part.charAt(0))
            .join('')
            .toUpperCase();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-gradient-to-r from-green-100 to-green-200 text-green-700';
            case 'Inactive':
                return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700';
            case 'Suspended':
                return 'bg-gradient-to-r from-red-100 to-red-200 text-red-700';
            default:
                return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700';
        }
    };

    const ReaderCard = ({ reader, onView }: { reader: Reader; onView: (reader: Reader) => void }) => {
        return (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-indigo-600 font-bold text-sm">
                                {getInitials(reader.name)}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-lg truncate">{reader.name}</h3>
                            <p className="text-sm text-gray-500 font-medium">ID: {reader.readerId}</p>
                        </div>
                    </div>

                    <div className="space-y-3 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-4 h-4 mr-3 text-gray-400"/>
                            <span className="font-medium truncate">{reader.email}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-3 text-gray-400"/>
                            <span className="font-medium">{reader.phone}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-3 text-gray-400"/>
                            <span className="font-medium">Joined: {new Date(reader.membershipDate).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <span className={`px-3 py-1 text-xs rounded-full font-semibold shadow-sm ${getStatusColor(reader.status)}`}>
                            {reader.status}
                        </span>
                    </div>

                    <div className="flex space-x-2">
                        <button
                            onClick={() => onView(reader)}
                            className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-2 px-3 rounded-lg hover:from-gray-200 hover:to-gray-300 text-sm flex items-center justify-center space-x-2 font-medium transition-all duration-300"
                        >
                            <Eye className="h-4 w-4"/>
                            <span>View</span>
                        </button>
                        <button
                            onClick={() => handleEditReader(reader)}
                            className="flex-1 bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-700 py-2 px-3 rounded-lg hover:from-indigo-200 hover:to-indigo-300 text-sm flex items-center justify-center space-x-2 font-medium transition-all duration-300"
                        >
                            <Edit2 className="h-4 w-4"/>
                            <span>Edit</span>
                        </button>
                        <button
                            onClick={() => handleDelete(reader)}
                            className="bg-gradient-to-r from-red-100 to-red-200 text-red-700 py-2 px-3 rounded-lg hover:from-red-200 hover:to-red-300 text-sm transition-all duration-300"
                        >
                            <Trash2 className="h-4 w-4"/>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const ReaderRow = ({ reader, onView }: { reader: Reader; onView: (reader: Reader) => void }) => {
        return (
            <tr className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                            <span className="text-indigo-600 font-bold text-sm">
                                {getInitials(reader.name)}
                            </span>
                        </div>
                        <div>
                            <div className="text-sm font-bold text-gray-900">{reader.name}</div>
                            <div className="text-sm text-gray-600 font-medium">ID: {reader.readerId}</div>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{reader.email}</div>
                    <div className="text-sm text-gray-600 font-medium">{reader.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs rounded-full font-semibold shadow-sm ${getStatusColor(reader.status)}`}>
                        {reader.status}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                    {new Date(reader.membershipDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-3">
                        <button
                            onClick={() => onView(reader)}
                            className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-all duration-300"
                        >
                            <Eye className="h-4 w-4"/>
                        </button>
                        <button
                            onClick={() => handleEditReader(reader)}
                            className="text-indigo-600 hover:text-indigo-700 p-2 hover:bg-indigo-100 rounded-lg transition-all duration-300"
                        >
                            <Edit2 className="h-4 w-4"/>
                        </button>
                        <button
                            onClick={() => handleDelete(reader)}
                            className="text-red-600 hover:text-red-700 p-2 hover:bg-red-100 rounded-lg transition-all duration-300"
                        >
                            <Trash2 className="h-4 w-4"/>
                        </button>
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 shadow-2xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
                                <Users className="h-8 w-8 text-white"/>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-1">Readers Management</h1>
                                <p className="text-blue-100 text-lg">Manage library members and readers</p>
                            </div>
                        </div>
                        <button
                            onClick={handleAddReader}
                            className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            <Plus className="h-5 w-5"/>
                            <span className="font-semibold">Add New Reader</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Filters and Search */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100 -mt-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                            <div className="relative">
                                <Search className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                                <input
                                    type="text"
                                    placeholder="Search readers..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-80 text-gray-900 placeholder-gray-500 font-medium transition-all duration-300"
                                />
                            </div>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-gray-700 bg-white transition-all duration-300"
                            >
                                <option value="All">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-4">
                            <span className="text-gray-600 font-semibold bg-gray-100 px-4 py-2 rounded-xl">
                                {filteredReaders.length} readers
                            </span>
                            <div className="flex bg-gray-100 rounded-xl p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-3 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-white shadow-lg transform scale-105' : 'hover:bg-gray-200'}`}
                                >
                                    <Grid className="h-4 w-4"/>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-3 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-white shadow-lg transform scale-105' : 'hover:bg-gray-200'}`}
                                >
                                    <List className="h-4 w-4"/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Readers Display */}
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredReaders.map(reader => (
                            <ReaderCard key={reader._id} reader={reader} onView={(r) => {
                                setSelectedReader(r);
                                setIsViewDialogOpen(true);
                            }} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Reader</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Join Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredReaders.map(reader => (
                                <ReaderRow key={reader._id} reader={reader} onView={(r) => {
                                    setSelectedReader(r);
                                    setIsViewDialogOpen(true);
                                }} />
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {filteredReaders.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                            <Search className="w-10 h-10 text-gray-400"/>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No readers found</h3>
                        <p className="text-gray-500 text-lg">Try adjusting your search or filter criteria</p>
                    </div>
                )}

                {/* Dialogs */}
                <Dialog
                    isOpen={isAddDialogOpen}
                    onCancel={cancelDialog}
                    onConfirm={() => {
                        const form = document.querySelector("form") as HTMLFormElement
                        if (form) {
                            form.requestSubmit()
                        }
                    }}
                    title='Add New Reader'
                >
                    <ReaderForm onSubmit={handleSubmit} />
                </Dialog>

                <Dialog
                    isOpen={isViewDialogOpen}
                    onCancel={() => {
                        setIsViewDialogOpen(false);
                        setSelectedReader(null);
                    }}
                    onConfirm={() => setIsViewDialogOpen(false)}
                    title="Reader Details"
                >
                    {selectedReader && (
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4 border-b pb-4 mb-4">
                                <div className="bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 p-3 rounded-xl shadow-lg">
                                    <User className="w-6 h-6"/>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Reader Information</h2>
                                    <p className="text-sm text-gray-500">Details about the selected reader</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                                <div className="space-y-1">
                                    <p className="text-gray-500 font-medium">Name</p>
                                    <p className="text-gray-800 font-bold text-lg">{selectedReader.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-gray-500 font-medium">Reader ID</p>
                                    <p className="text-gray-800 font-semibold">{selectedReader.readerId}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-gray-500 font-medium">Email</p>
                                    <p className="text-gray-800 font-semibold">{selectedReader.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-gray-500 font-medium">Phone</p>
                                    <p className="text-gray-800 font-semibold">{selectedReader.phone}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-gray-500 font-medium">Status</p>
                                    <span className={`inline-block px-3 py-1 text-xs rounded-full font-semibold ${getStatusColor(selectedReader.status)}`}>
                                        {selectedReader.status}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-gray-500 font-medium">Joined</p>
                                    <p className="text-gray-800 font-semibold">
                                        {new Date(selectedReader.membershipDate).toLocaleDateString()}
                                    </p>
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
                    title='Edit Reader'
                >
                    <ReaderForm reader={selectedReader} onSubmit={handleSubmit} />
                </Dialog>

                <Dialog
                    isOpen={isDeleteDialogOpen}
                    onCancel={cancelDialog}
                    onConfirm={confirmDelete}
                    title="Confirm Delete"
                >
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-red-100 text-red-600 p-2 rounded-full">
                            <Trash2 className="w-5 h-5"/>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">Delete Reader</h3>
                            <p className="text-sm text-gray-500">This action cannot be undone</p>
                        </div>
                    </div>
                    <p className="text-gray-700">
                        Are you sure you want to delete <strong className="text-gray-900">{selectedReader?.name}</strong>?
                    </p>
                </Dialog>
            </div>
        </div>
    );
};

export default ReadersPage;