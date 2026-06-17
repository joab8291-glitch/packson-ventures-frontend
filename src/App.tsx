import { Header } from '@/sections/Header';
import { Main } from '@/sections/Main';
import { Footer } from '@/sections/Footer';
import { Toaster } from 'react-hot-toast';

export const App = () => {
  return (
    <div className="text-neutral-800 text-base font-normal font-poppins w-full overflow-x-hidden">
      <Header />
      <Main />
      <Footer />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '8px',
            padding: '16px',
          },
          success: {
            style: {
              background: '#22c55e',
              color: '#fff',
            },
          },
          error: {
            style: {
              background: '#ef4444',
              color: '#fff',
            },
          },
        }}
      />
    </div>
  );
};
