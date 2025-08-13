import React, {useEffect, useState} from 'react';
import {AlertTriangle, Mail, User, Book, Calendar, Clock, Search} from 'lucide-react';
import {getOverdueReadersWithEmail, type OverdueReaderInfo, viewAllOverDues} from "../services/overDueService.ts";
import type {Lending} from "../types/Lending.ts";
import { toast } from "react-toastify";

const OverdueManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [notificationStatus, ] = useState<{[key: string]: 'sending' | 'sent' | 'error'}>({});
    const [overdueReader,setOverdueReader] =useState<OverdueReaderInfo[]>([])
    const [overdueData,setOverdueData] = useState<Lending[]>([])


    const formatDate = (date: Date) => {
        return date.toLocaleDateString();
    };


    const getTotalOverdueBooks = () => {
        return overdueData.reduce((total, reader) => total + reader.books.length, 0);
    };

    const handleSendNotification = async (reader: OverdueReaderInfo) => {
        const booksForReader = overdueData
            .filter(overdue => overdue.readerName === reader.name)
            .flatMap(overdue =>
                overdue.books.map(book => ({
                    title: book.title,
                    dueDate: formatDate(new Date(overdue.dueDate))
                }))
            );

        try {
            await fetch("http://localhost:3002/api/notification/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: reader.email,
                    name: reader.name,
                    books: booksForReader
                })
            });

            toast.success("Email sent Successfully!");

            // ✅ Remove the reader from overdueReader list
            setOverdueReader(prev => prev.filter(r => r.email !== reader.email));

            // ✅ Remove their lending records from overdueData
            setOverdueData(prev => prev.filter(o => o.readerName !== reader.name));

        } catch (error) {
            toast.error("Failed to send email!");
            console.error("Failed to send email:", error);
        }
    };


    useEffect(() => {
        const fetchOverdueReader = async () => {
            const data = await getOverdueReadersWithEmail();
            setOverdueReader(data);
        };

        fetchOverdueReader();
    }, []);

    useEffect(() => {
        const fetchOverdueData = async () => {
            const overdues = await viewAllOverDues()
            setOverdueData(overdues)
        }

        fetchOverdueData();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-700 shadow-2xl">
                <div className="px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
                                <AlertTriangle className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-1">Overdue Management</h1>
                                <p className="text-blue-100 text-lg">Manage overdue books and send notifications</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-4">
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-red-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center">
                            <div className="p-3 bg-red-100 rounded-xl mr-4">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-red-600 font-semibold uppercase tracking-wide">Overdue Readers</p>
                                <p className="text-3xl font-bold text-red-700 mt-1">{overdueReader.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-orange-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center">
                            <div className="p-3 bg-orange-100 rounded-xl mr-4">
                                <Book className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-orange-600 font-semibold uppercase tracking-wide">Overdue Books</p>
                                <p className="text-3xl font-bold text-orange-700 mt-1">{getTotalOverdueBooks()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-xl mr-4">
                                <Mail className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-blue-600 font-semibold uppercase tracking-wide">Notifications Sent Today</p>
                                <p className="text-3xl font-bold text-blue-700 mt-1">
                                    {Object.values(notificationStatus).filter(status => status === 'sent').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="px-6 pb-6">
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search readers or books..."
                            className="pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full text-gray-900 placeholder-gray-500 font-medium transition-all duration-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Overdue Readers List */}
            <div className="px-6 pb-8">
                <div className="space-y-6">
                    {overdueReader.map(reader => (
                        <div key={reader.email} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                            {/* Reader Header */}
                            <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-indigo-100 rounded-xl">
                                            <User className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{reader.name}</h3>
                                            <p className="text-gray-600 font-medium">{reader.email}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleSendNotification(reader)}
                                        className="flex items-center space-x-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                    >
                                        <Mail className="w-5 h-5" />
                                        <span className="font-semibold">Send Notification</span>
                                    </button>
                                </div>
                            </div>

                            {/* Overdue Books */}
                            <div className="px-8 py-6">
                                <div className="space-y-4">
                                    {overdueData
                                        .filter(overdue => overdue.readerName === reader.name)
                                        .map(overdue => (
                                            overdue.books.map(book => (
                                        <div key={overdue._id} className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                                            <div className="flex items-center space-x-4">
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <Book className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-lg">{book.title}</h4>
                                                    <p className="text-gray-600 font-medium">ISBN: {book.isbn}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-6">
                                                <div className="text-right">
                                                    <div className="flex items-center space-x-2 text-red-600 font-semibold mb-2">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>Due: {formatDate(new Date(overdue.dueDate))}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-gray-600 font-medium">
                                                        <Clock className="w-4 h-4" />
                                                        <span>Borrowed: {formatDate(new Date(overdue.borrowDate))}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {overdueData.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-xl border border-gray-100">
                        <div className="p-4 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                            <AlertTriangle className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">No overdue books found</h3>
                        <p className="text-gray-600 text-lg">
                            {searchTerm ? 'Try adjusting your search terms.' : 'All books are returned on time!'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OverdueManagement;