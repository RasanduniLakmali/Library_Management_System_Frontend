import React, {useEffect, useState} from 'react';
import { Search, Plus, Edit3, Trash2, BookOpen,  Grid, List, Eye } from 'lucide-react';
import type {Book} from "../types/Book.ts";
import {
    addBooks,
    deleteBooks,
    fetchAllBooks,
    updateBooks,
    viewBookByName
} from "../services/bookService.ts";
import axios from "axios";
import Dialog from "../components/Dialog.tsx";
import BookForm from "../components/forms/BookForm.tsx";
import toast from "react-hot-toast";
import Swal from "sweetalert2";


const BooksPage: React.FC = () => {

    const [, setBooks] = useState<Book[]>([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);

    const [, setFormData] = useState<Partial<Book>>({
        title: '',
        author: '',
        isbn: '',
        category: 'Fiction',
        status: 'Available',
        publicationYear: '',
        publisher: '',
        description: '',

    });

    const categories = ['All', 'Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Mystery', 'Romance','Child'];
    const statuses = ['All', 'Available', 'Lent', 'Reserved'];


    const handleOpenModal = (mode: 'add' | 'edit' | 'view', book?: Book) => {
        setModalMode(mode);
        setSelectedBook(book || null);

        if (mode === 'add') {
            setFormData({
                title: '',
                author: '',
                isbn: '',
                category: 'Fiction',
                status: 'Available',
                publicationYear: "",
                publisher: '',
                description: '',
            });
            setIsAddDialogOpen(true);
        } else if (mode === 'edit' && book) {
            setFormData(book);
            setIsEditDialogOpen(true);
        } else if (mode === 'view' && book) {
            setShowModal(true);
        }
    };

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [, setSelectedCustomer] = useState<Book | null>(null)
    const [, setIsLoading] = useState<boolean>(false)

    const handleAddBook = () => {
        setSelectedBook(null);
        setIsAddDialogOpen(true)
    }

    const handleEditBook = (book:Book) => {
        setSelectedBook(book);
        setIsEditDialogOpen(true)
    }

    const handleSubmit = async (bookData: Omit<Book, "_id">) => {


        if (selectedBook) {

            try {
                const updatedBook = await updateBooks(selectedBook._id, bookData)

                setBooks((prev) =>
                    prev.map((book) => (book._id === selectedBook._id ? updatedBook : book))
                )

                Swal.fire("Book Updated Successfully!");

                setIsEditDialogOpen(false)
            } catch (error) {
                if (axios.isAxiosError(error)) {

                    Swal.fire("Book Not Updated !");

                    toast.error(error.message)
                } else {
                    toast.error("Something went wrong")
                }
            }
        } else {
            try {
                const newBook = await addBooks(bookData)
                setBooks((prev) => [...prev, newBook])

                Swal.fire("Book Added Successfully!");

                setIsAddDialogOpen(false)

            } catch (error) {
                if (axios.isAxiosError(error)) {

                    Swal.fire("Book Not Added !");

                    toast.error(error.message)
                } else {
                    toast.error("Something went wrong")
                }
            }

        }

        setSelectedBook(null)

    };

    const handleDelete = (book: Book) => {
        setSelectedBook(book);
        setIsDeleteDialogOpen(true);
    };


    const cancelDialog = () => {
        setIsAddDialogOpen(false)
        setIsEditDialogOpen(false)
        setIsDeleteDialogOpen(false)
        setSelectedCustomer(null)
    }

    const displayBooks = async () => {
        try {
            setIsLoading(true);
            const result = await fetchAllBooks()
            setBooks(result)
            setFilteredBooks(result);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.message)
            } else {
                toast.error("Books are not loaded!")
            }
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        displayBooks()
    }, [])


    const deleteBookDetail = async (_id: string) => {
        await deleteBooks(_id);
    }

    const confirmDelete = async () => {

        if (selectedBook) {

            try {
                await deleteBookDetail(selectedBook._id)

                Swal.fire("Book Deleted Successfully!");

                displayBooks();

            } catch (error) {
                if (axios.isAxiosError(error)) {

                    Swal.fire("Book Not Deleted !");

                    toast.error(error.message)
                } else {
                    toast.error("Deleting Book Failed!")
                }
            } finally {
                setIsDeleteDialogOpen(false)
                setSelectedCustomer(null)
            }
        }
    }

    useEffect(() => {
        const fetchFilteredBooks = async () => {
            try {
                if (searchTerm.trim() !== '') {
                    const result = await viewBookByName(searchTerm);
                    setFilteredBooks(result);
                } else {
                    const allBooks = await fetchAllBooks();
                    setFilteredBooks(allBooks);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.message);
                } else {
                    toast.error("Failed to filter books");
                }
            }
        };

        const delayDebounce = setTimeout(() => {
            fetchFilteredBooks();
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);


    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Available':
                return 'text-green-600 bg-green-100';
            case 'Lent':
                return 'text-blue-600 bg-blue-100';
            case 'Reserved':
                return 'text-orange-600 bg-orange-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 shadow-2xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div
                                className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
                                <BookOpen className="h-8 w-8 text-white"/>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-1">Books Management</h1>
                                <p className="text-blue-100 text-lg">Manage your library collection</p>
                            </div>
                        </div>
                        <button
                            onClick={handleAddBook}
                            className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            <Plus className="h-5 w-5"/>
                            <span className="font-semibold">Add New Book</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Filters and Search */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100 -mt-4">
                    <div
                        className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                            <div className="relative">
                                <Search
                                    className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                                <input
                                    type="text"
                                    placeholder="Search books..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-80 text-gray-900 placeholder-gray-500 font-medium transition-all duration-300"
                                />
                            </div>

                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-gray-700 bg-white transition-all duration-300"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>

                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-gray-700 bg-white transition-all duration-300"
                            >
                                {statuses.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center space-x-4">
                            <span
                                className="text-gray-600 font-semibold bg-gray-100 px-4 py-2 rounded-xl">{filteredBooks.length} books</span>
                            <div className="flex bg-gray-100 rounded-xl p-1">
                                <button
                                    onClick={() => {
                                        setViewMode('grid');
                                    }}
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

                {/* Books Display */}
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredBooks.map(book => (
                            <div key={book._id}
                                 className="bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="p-6">
                                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-lg">{book.title}</h3>
                                    <p className="text-gray-600 text-sm mb-3 font-medium">by {book.author}</p>
                                    <div className="flex items-center justify-between mb-4">
                                        <span
                                            className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">{book.category}</span>
                                        <span
                                            className={`px-3 py-1 text-xs rounded-full font-semibold shadow-sm ${getStatusColor(book.status)}`}>
                                            {book.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-6 line-clamp-2">{book.description}</p>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => {
                                                handleOpenModal('view', book);
                                            }}
                                            className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-2 px-3 rounded-lg hover:from-gray-200 hover:to-gray-300 text-sm flex items-center justify-center space-x-2 font-medium transition-all duration-300"
                                        >
                                            <Eye className="h-4 w-4"/>
                                            <span>View</span>
                                        </button>
                                        <button
                                            onClick={() => handleEditBook(book)}
                                            className="flex-1 bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-700 py-2 px-3 rounded-lg hover:from-indigo-200 hover:to-indigo-300 text-sm flex items-center justify-center space-x-2 font-medium transition-all duration-300"
                                        >
                                            <Edit3 className="h-4 w-4"/>
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(book)}
                                            className="bg-gradient-to-r from-red-100 to-red-200 text-red-700 py-2 px-3 rounded-lg hover:from-red-200 hover:to-red-300 text-sm transition-all duration-300"
                                        >
                                            <Trash2 className="h-4 w-4"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Book</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Author</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Year</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredBooks.map(book => (
                                <tr key={book._id}
                                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div>
                                                <div className="text-sm font-bold text-gray-900">{book.title}</div>
                                                <div className="text-sm text-gray-600 font-medium">{book.isbn}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{book.author}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{book.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-3 py-1 text-xs rounded-full font-semibold shadow-sm ${getStatusColor(book.status)}`}>
                                            {book.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{book.publicationYear}</td>
                                    <td className={"px-6 py-4 whitespace-nowrap text-right text-sm font-medium"}>
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => handleOpenModal('view', book)}
                                                className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-all duration-300"
                                            >
                                                <Eye className="h-4 w-4"/>
                                            </button>
                                            <button
                                                onClick={() => handleOpenModal('edit', book)}
                                                className="text-indigo-600 hover:text-indigo-700 p-2 hover:bg-indigo-100 rounded-lg transition-all duration-300"
                                            >
                                                <Edit3 className="h-4 w-4"/>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(book)}
                                                className="text-red-600 hover:text-red-700 p-2 hover:bg-red-100 rounded-lg transition-all duration-300"
                                            >
                                                <Trash2 className="h-4 w-4"/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <Dialog
                    isOpen={isAddDialogOpen}
                    onCancel={cancelDialog}
                    onConfirm={() => {
                        // This will be handled by the form submission
                        const form = document.querySelector("form") as HTMLFormElement
                        if (form) {
                            form.requestSubmit()
                        }
                    }}
                    title='Add New Book'
                >
                    <BookForm onSubmit={handleSubmit}/>
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
                    title='Edit Book'
                >
                    <BookForm book={selectedBook} onSubmit={handleSubmit}/>

                </Dialog>

                <Dialog
                    isOpen={modalMode === 'view' && showModal}
                    onCancel={() => setShowModal(false)}
                    onConfirm={() => setShowModal(false)}
                    title="Book Details"
                >
                    {selectedBook && (
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4 border-b pb-4 mb-4">
                                <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                                    <BookOpen className="w-6 h-6"/>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Book Information</h2>
                                    <p className="text-sm text-gray-500">Details about the selected book</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                                <div className="space-y-1">
                                    <p className="text-gray-500 font-medium">Title</p>
                                    <p className="text-gray-800 font-bold text-lg">{selectedBook.title}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-gray-500 font-medium">Author</p>
                                    <p className="text-gray-800 font-semibold">{selectedBook.author}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-gray-500 font-medium">ISBN</p>
                                    <p className="text-gray-800 font-semibold">{selectedBook.isbn}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-gray-500 font-medium">Category</p>
                                    <p className="text-gray-800 font-semibold">{selectedBook.category}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-gray-500 font-medium">Status</p>
                                    <span
                                        className={`inline-block px-3 py-1 text-xs rounded-full font-semibold ${getStatusColor(selectedBook.status)}`}>
                                        {selectedBook.status}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-gray-500 font-medium">Publication Year</p>
                                    <p className="text-gray-800 font-semibold">{selectedBook.publicationYear}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-gray-500 font-medium">Publisher</p>
                                    <p className="text-gray-800 font-semibold">{selectedBook.publisher}</p>
                                </div>
                                <div className="sm:col-span-2 space-y-1">
                                    <p className="text-gray-500 font-medium">Description</p>
                                    <p className="text-gray-800 leading-relaxed">{selectedBook.description}</p>
                                </div>
                            </div>
                        </div>
                    )}
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
                            <h3 className="font-semibold text-gray-900">Delete Book</h3>
                            <p className="text-sm text-gray-500">This action cannot be undone</p>
                        </div>
                    </div>
                    <p className="text-gray-700">
                        Are you sure you want to delete <strong className="text-gray-900">{selectedBook?.title}</strong>?
                    </p>
                </Dialog>

            </div>

        </div>
    );
};

export default BooksPage