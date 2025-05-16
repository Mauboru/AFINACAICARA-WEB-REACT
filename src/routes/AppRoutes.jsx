import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Tuner from "../pages/Tuner";

export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                {/* Login público */}
                <Route path="/" element={<Tuner />} />
                {/* <Route path="~/register" element={<RegisterUser />} />
                <Route path="~/reset-password" element={<ResetPassword />} />
                <Route path="~/reset-password/:token" element={<NewPasswordReset />} />

                <Route path="/not-authorized" element={<NotAuthorized />} />
                <Route path="*" element={<NotFound />} />

                <Route path="~/home" element={<Home />} />
                <Route path="~/profile" element={<Profile />} />
                <Route path="~/items01/subItem01" element={<PrivateRoute><SubItem01 /></PrivateRoute>} />
                <Route path="~/items01/subItem02" element={<PrivateRoute><SubItem02 /></PrivateRoute>} />
                <Route path="~/items02/subItem03" element={<PrivateRoute requiredRole="manager"><SubItem03 /></PrivateRoute>} />
                <Route path="~/items02/subItem04" element={<PrivateRoute requiredRole="manager"><SubItem04 /></PrivateRoute>} /> */}
            </Routes>
        </Router>
    );
}
