import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Turner from "../pages/Turner";
import Metronomo from "../pages/Metronomo";
import Sheets from "../pages/Sheets";
import Music from "../pages/Music";

export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                {/* Login público */}
                <Route path="/" element={<Navigate to="/afinador" replace />} />
                <Route path="/afinador" element={<Turner />} />
                <Route path="/metronomo" element={<Metronomo />} />
                <Route path="/musicas" element={<Sheets />} />
                <Route path="/musicas/:id" element={<Music />} />
            </Routes>
        </Router>
    );
}
