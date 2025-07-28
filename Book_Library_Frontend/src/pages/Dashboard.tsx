
import {
    BookOpen,
    Users,
    Calendar,
    AlertTriangle,

} from 'lucide-react';
import {useEffect, useState} from "react";
import {getTotalBooks} from "../services/bookService.ts";
import {getTotalReaders} from "../services/readerService.ts";
import {getTotalLendingBooks} from "../services/lendingService.ts";
import {getOverdueBooksCount} from "../services/dashboardService.ts";
import {Link} from "react-router-dom";



const Dashboard = () => {

    const [totalBooks, setTotalBooks] = useState(0);
    const [totalReaders, setTotalReaders] = useState(0);
    const [booksLent, setBooksLent] = useState(0);
    const [overdueCount, setOverdueCount] = useState(0);

    useEffect(() => {
        const fetchTotalBooks = async () => {
            try {
                const total = await getTotalBooks();
                setTotalBooks(total);
            } catch (err) {
                console.error("Failed to load total books");
                console.error(err);
            }
        };

        fetchTotalBooks();
    }, []);


    useEffect(() => {
        const fetchTotalReaders = async () => {
            try {
                const total = await getTotalReaders();
                setTotalReaders(total);
            } catch (err) {
                console.error("Failed to load total readers");
                console.error(err);
            }
        };

        fetchTotalReaders();

    }, [])


    useEffect(() => {
        getTotalLendingBooks().then(setBooksLent).catch(console.error);
    }, []);


    useEffect(() => {
        getOverdueBooksCount()
            .then(setOverdueCount)
            .catch(err => console.error("Failed to fetch overdue count", err));
    }, []);


    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
            {/* Header */}

            <div className="flex">
                {/* Main Content */}
                <main className="flex-1 p-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Total Books</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{totalBooks}</p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <BookOpen className="w-7 h-7 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Total Readers</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{totalReaders}</p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Users className="w-7 h-7 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Books Lent</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{booksLent}</p>
                                    <p className="text-sm text-purple-600 flex items-center mt-2 font-medium">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        This month
                                    </p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Calendar className="w-7 h-7 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Overdue Books</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{overdueCount}</p>
                                    <p className="text-sm text-red-600 flex items-center mt-2 font-medium">
                                        <AlertTriangle className="w-4 h-4 mr-1" />
                                        Needs attention
                                    </p>
                                </div>
                                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <AlertTriangle className="w-7 h-7 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                        {/* Book Categories */}
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center mb-6">
                                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg mr-3">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Book Categories</h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-sm text-gray-700 font-medium">Fiction</div>
                                <div className="text-sm text-gray-700 font-medium">Non-Fiction</div>
                                <div className="text-sm text-gray-700 font-medium">Science</div>
                                <div className="text-sm text-gray-700 font-medium">History</div>
                                <div className="text-sm text-gray-700 font-medium">Romance</div>
                                <div className="text-sm text-gray-700 font-medium">Child</div>
                            </div>
                        </div>

                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8">
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center mb-6">
                                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg mr-3">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <Link to="/dashboard/books" className="group flex flex-col items-center space-y-3 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                                        <BookOpen className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-sm font-bold text-blue-900">Add Book</span>
                                </Link>
                                <Link to="/dashboard/readers" className="group flex flex-col items-center space-y-3 p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-sm font-bold text-green-900">Add Reader</span>
                                </Link>
                                <Link to="/dashboard/lending" className="group flex flex-col items-center space-y-3 p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                                        <Calendar className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-sm font-bold text-purple-900">Lend Book</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Dashboard;