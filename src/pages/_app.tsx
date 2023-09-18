import '@/styles/globals.css';
import RootLayout from '@/layouts/RootLayout';

function MyApp({ Component, pageProps }) {
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  );
}

export default MyApp;