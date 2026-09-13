import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {router} from './router'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { AuthContextProvider } from './context/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
    <RouterProvider router ={router} />
    </AuthContextProvider>
  </StrictMode>,
)
