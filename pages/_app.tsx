import "bootstrap/dist/css/bootstrap.min.css";
import * as React from "react";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";
import { DefaultSeo } from "next-seo";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <>
      <DefaultSeo
        title="Blacklist Wedding Service in Indonesia"
        description="Kumpulan list para penipu Wedding Organizer beserta service pernikahan lainnya di Indonesia"
        openGraph={{
          type: "website",
          locale: "id_ID",
          url: "https://www.blacklist-wedding-service.com/",
          site_name: "Blacklist Wedding Service",
        }}
        twitter={{
          handle: "@irhmptra",
          site: "@irhmptra",
          cardType: "summary_large_image",
        }}
      />
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
