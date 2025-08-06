import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen'>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
