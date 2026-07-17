import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import  Home  from './pages/Home';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Defaulting Home to Shop for now */}
        <Route index element={<Home />} /> 
        <Route path="shop" element={<Shop />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
      </Route>
    </Routes>
  );
}

export default App;
