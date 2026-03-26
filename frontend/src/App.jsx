import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
//import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage          from "./pages/HomePage";
import LoginPage         from "./pages/LoginPage";
import SignupPage        from "./pages/SignupPage";
// import CataloguePage     from "./pages/CataloguePage";
// import TrendingPage      from "./pages/TrendingPage";
// import ProductDetailPage from "./pages/ProductDetailPage";
// import WishlistPage      from "./pages/WishlistPage";
import CartPage          from "./pages/CartPage";
// import CheckoutPage      from "./pages/CheckoutPage";
// import OrderSuccessPage  from "./pages/OrderSuccessPage";

import "./styles/variables.css";
import "./styles/global.css";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        
          <Routes>
            {/* Public */}
            <Route path="/"           element={<Layout><HomePage /></Layout>} />
            <Route path="/login"      element={<Layout><LoginPage /></Layout>} />
            <Route path="/signup"     element={<Layout><SignupPage /></Layout>} />
            {/* <Route path="/catalogue"  element={<Layout><CataloguePage /></Layout>} /> */}
            {/* <Route path="/trending"   element={<Layout><TrendingPage /></Layout>} /> */}
            {/* <Route path="/product/:id" element={<Layout><ProductDetailPage /></Layout>} /> */}

            {/* Protected */}
             {/* <Route path="/wishlist" element={<Layout><ProtectedRoute><WishlistPage /></ProtectedRoute></Layout>} /> */}
            <Route path="/cart"     element={<Layout><ProtectedRoute><CartPage /></ProtectedRoute></Layout>} />
            {/* <Route path="/checkout" element={<Layout><ProtectedRoute><CheckoutPage /></ProtectedRoute></Layout>} />
            <Route path="/order-success" element={<Layout><ProtectedRoute><OrderSuccessPage /></ProtectedRoute></Layout>} />  */}
          </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}



