import "./globals.css";
import Header from "@/components/header";
import FooterNav from "@/components/footer-nav";

export const metadata = {
  title: "PayMeBack",
  description: "Справедливое приложение для закрытия долгов",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" data-theme="light">
      <body className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 p-4 pb-20">{children}</main>

        <FooterNav />
      </body>
    </html>
  );
}
