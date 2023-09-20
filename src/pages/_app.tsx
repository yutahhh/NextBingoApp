import '@/styles/globals.css';
import { BingoProvider } from '@/contexts/BingoContext';
import RootLayout from '@/layouts/RootLayout';
import { UserSessionProvider } from '@/contexts/UserSessionContext';
import { initFirebase } from '@/plugins/firebase';

initFirebase();

function MyApp({ Component, pageProps }) {
  return (
    <UserSessionProvider>
      <BingoProvider>
        <RootLayout>
          <Component {...pageProps} />
        </RootLayout>
      </BingoProvider>
    </UserSessionProvider>
  );
}

export default MyApp;





