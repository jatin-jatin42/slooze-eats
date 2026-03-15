import type { Metadata } from 'next';
import './globals.css';
import { ApolloWrapper } from '../lib/apollo-wrapper';
import { AuthProvider } from '../lib/auth-context';

export const metadata: Metadata = {
  title: 'Slooze Eats — Food Ordering Platform',
  description: 'Role-based food ordering platform for Slooze teams',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ApolloWrapper>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
