import AppRoutes from "./routes/AppRoutes";
import { TunerProvider } from "./context/TurnerContext";

function App() {
  return (
    <TunerProvider>
      <AppRoutes />
    </TunerProvider>
  );
}

export default App;
