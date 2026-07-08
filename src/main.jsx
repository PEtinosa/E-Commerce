import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            style: {
              background: '#46114b',
              color: '#fff',
            },
          }}
        />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>
);
