import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import NotFound from "../pages/errors/NotFound";
import NotAuthorized from "../pages/errors/NotAuthorized";
import RegisterUser from "../pages/RegisterUser";
import ResetPassword from "../pages/ResetPassword";
import SubItem01 from "../pages/items/SubItem01";
import SubItem02 from "../pages/items/SubItem02";
import SubItem03 from "../pages/items/SubItem03";
import SubItem04 from "../pages/items/SubItem04";
import NewPasswordReset from "../pages/NewPasswordReset";
import Profile from "../pages/Profile";
import Tuner from "../pages/Tuner";
import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                {/* Login público */}
                <Route path="/" element={<Tuner />} />
                <Route path="~/register" element={<RegisterUser />} />
                <Route path="~/reset-password" element={<ResetPassword />} />
                <Route path="~/reset-password/:token" element={<NewPasswordReset />} />

                {/* Rota de erro */}
                <Route path="/not-authorized" element={<NotAuthorized />} />
                <Route path="*" element={<NotFound />} />

                {/* Rota protegida */}
                <Route path="~/home" element={<Home />} />
                <Route path="~/profile" element={<Profile />} />
                <Route path="~/items01/subItem01" element={<PrivateRoute><SubItem01 /></PrivateRoute>} />
                <Route path="~/items01/subItem02" element={<PrivateRoute><SubItem02 /></PrivateRoute>} />
                <Route path="~/items02/subItem03" element={<PrivateRoute requiredRole="manager"><SubItem03 /></PrivateRoute>} />
                <Route path="~/items02/subItem04" element={<PrivateRoute requiredRole="manager"><SubItem04 /></PrivateRoute>} />
            </Routes>
        </Router>
    );
}
