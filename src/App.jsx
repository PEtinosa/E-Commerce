import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Defaulting Home to Shop for now */}
        <Route index element={<Shop />} /> 
        <Route path="shop" element={<Shop />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
      </Route>
    </Routes>
  );
}

export default App;
