import React, { useState } from "react"
import { BarChart3, BookOpen, Users, Calendar, AlertTriangle, Activity } from "lucide-react"
import { useNavigate } from "react-router-dom"


interface SidebarItem {
    id: string
    label: string
    icon: React.ReactNode
}

const Sidebar: React.FC = () => {
    const [activeItem, setActiveItem] = useState<string>("dashboard")
    const navigate = useNavigate()

    const sidebarItems: SidebarItem[] = [
        { id: "dashboard", label: "Dashboard", icon: <BarChart3 className="w-5 h-5" /> },
        { id: "books", label: "Books", icon: <BookOpen className="w-5 h-5" /> },
        { id: "readers", label: "Readers", icon: <Users className="w-5 h-5" /> },
        { id: "lending", label: "Lending", icon: <Calendar className="w-5 h-5" /> },
        { id: "overdue", label: "Overdue", icon: <AlertTriangle className="w-5 h-5" /> },
        { id: "profile", label: "Profile", icon: <Activity className="w-5 h-5" /> },
    ]

    const handleItemClick = (itemId: string) => {
        setActiveItem(itemId)
        navigate(itemId === "dashboard" ? "/dashboard" : `/dashboard/${itemId}`)
    }

    return (
        <div className="w-64 min-h-screen bg-white shadow-md rounded-r-lg p-4">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Library Panel</h2>

            <ul className="space-y-2">
                {sidebarItems.map((item) => (
                    <li key={item.id}>
                        <button
                            onClick={() => handleItemClick(item.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200 text-left
                ${
                                activeItem === item.id
                                    ? "bg-indigo-100 text-indigo-700 font-semibold"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                            }`}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Sidebar

