import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FetchProvider } from "./context/FetchContext";

const App = () => {
  return (
    <FetchProvider>
      <AppRoutes />
      <ToastContainer />
    </FetchProvider>
  );
};

export default App;
