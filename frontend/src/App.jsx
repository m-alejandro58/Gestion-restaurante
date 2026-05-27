import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Dashboard from "./Pages/Dashboard";
import Products from "./Pages/Products";
import Inventory from "./Pages/Inventory";
import Tables from "./Pages/Tables";
import Orders from "./Pages/Orders";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-orange-50">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
