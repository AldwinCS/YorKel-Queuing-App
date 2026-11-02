import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import UserRegister from "./pages/user_register";
import WebLogin from "./pages/web_LogIn";
import Dashboard from "./pages/dashboard";
import AuthConfirm from "./pages/auth_confirm";
import UserProfile from "./pages/user_profile";
import Settings from "./pages/settings";
import BackupRestore from "./pages/backup_restore";

export const router = createBrowserRouter([
    {path: "/", element: <App/>},
    {path: "/login", element: <WebLogin/>},
    {path: "/register", element: <UserRegister/>},
    {path: "/auth/confirm", element: <AuthConfirm/>},
    {path: "/dashboard", element: <Dashboard/>},
    {path: "/profile", element: <UserProfile/>},
    {path: "/settings", element: <Settings/>},
    {path: "/settings/backup", element: <BackupRestore/>}
    
]);
