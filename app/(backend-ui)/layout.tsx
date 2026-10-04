import { LanguageProvider } from '@/context/LanguageContext';
import { TitleProvider } from '@/context/TitleContext';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import Footer from '@/components/dashboard/Footer';
import AuthSessionProvider from '@/components/providers/SessionProvider';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthSessionProvider>
      <LanguageProvider>
        <TitleProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 bg-white">
              <Header />
              <main className="flex-grow p-8">{children}</main>
              <Footer />
            </div>
          </div>
        </TitleProvider>
      </LanguageProvider>
    </AuthSessionProvider>
  );
}
