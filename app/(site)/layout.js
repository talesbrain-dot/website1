import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { AuthProvider } from '@/components/AuthProvider';

export default function SiteLayout({ children }) {
  return (
    <AuthProvider>
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppFloat />
    </AuthProvider>
  );
}
