import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Tuner from "../pages/Tuner";
import Metronomo from "../pages/Metronomo";
import Sheets from "../pages/Sheets";

export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                {/* Login público */}
                <Route path="/" element={<Navigate to="/afinador" replace />} />
                <Route path="/afinador" element={<Tuner />} />
                <Route path="/metronomo" element={<Metronomo />} />
                <Route path="/musicas" element={<Sheets />} />
            </Routes>
        </Router>
    );
}
