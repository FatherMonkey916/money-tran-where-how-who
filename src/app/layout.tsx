import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider } from '@/components/theme-provider';
import dbConnect from "@/lib/mongodb";

import "./globals.css";

// Connect to MongoDB when the app starts
dbConnect().catch(err => console.error('Failed to connect to MongoDB', err));

export const metadata = {
  title: "FOCO.chat your money",
  description: "The Future of Money Transfer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}