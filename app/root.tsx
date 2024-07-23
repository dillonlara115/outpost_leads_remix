import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { Links, Meta, Scripts, ScrollRestoration } from "@remix-run/react";
import CustomAppShell from '~/components/CustomAppShell';

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <MantineProvider>
          <CustomAppShell />
        </MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
