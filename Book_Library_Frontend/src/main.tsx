import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css"

import {AuthProvider} from "./context/AuthProvider.tsx";
import {RouterProvider} from "react-router-dom";
import router from "./router.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <AuthProvider>
          <RouterProvider router={router}/>
          <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>

  </StrictMode>
)
