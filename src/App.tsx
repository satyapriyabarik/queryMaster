import Header from './components/header/Header';
import Home from './components/home/Home';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddInventoryForm from './components/inventory/AddInventoryForm';
import { NearExpiryList } from './components/dashboard/NearExpiryList';
import QueryBuilder from './components/queryBuilder/QueryBuilder';
import "./styles/navbar.css";
import "./styles/theme.css";
import "./styles/bootstrap-theme.css";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
         <Header />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/add-products" element={<AddInventoryForm />}></Route>
          <Route path="/near-expiry" element={<NearExpiryList />}></Route>
          <Route path="/query-builder" element={<QueryBuilder/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

