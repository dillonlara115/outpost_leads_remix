import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { Links, Meta, Scripts, ScrollRestoration, Outlet } from "@remix-run/react";
import CustomAppShell from '~/components/CustomAppShell';
import { AuthProvider, useAuth } from '~/context/AuthContext';

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" type="image/x-icon" />
        <Meta />
        <Links />
      </head>
      <body>
        <MantineProvider>
          <AuthProvider>
            <MainApp />
          </AuthProvider>
        </MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function MainApp() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <CustomAppShell /> : <AuthPages />;
}

function AuthPages() {
  return (
    <div>
      <Outlet />
    </div>
  );
}