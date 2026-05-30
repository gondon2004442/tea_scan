import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap"
          rel="stylesheet"
        />
        <ScrollViewStyleReset />
        <style>{`
          html, body {
            height: 100%;
            width: 100%;
            margin: 0;
          }
          body {
            overflow: auto;
            background: #e8e8e8;
            font-family: 'Manrope', system-ui, sans-serif;
          }
          #root {
            display: flex;
            flex-direction: column;
            flex: 1;
            min-height: 100vh;
            width: 100%;
            font-family: 'Manrope', system-ui, sans-serif;
          }
          #root > div {
            display: flex;
            flex-direction: column;
            flex: 1;
            min-height: 100%;
            width: 100%;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
