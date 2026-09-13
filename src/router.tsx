import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import UserRegister from "./pages/user_register";
import WebLogin from "./pages/web_LogIn";
import Dashboard from "./pages/dashboard";

export const router = createBrowserRouter([
    {path: "/", element: <App/>},
    {path: "/login", element: <WebLogin/>},
    {path: "/register", element: <UserRegister/>},
    {path: "/dashboard", element: <Dashboard/>}
    
]);