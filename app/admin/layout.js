export const metadata = {
  title: 'Staff Login | Kamboj Press',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <div className="min-h-screen bg-paper">{children}</div>;
}
