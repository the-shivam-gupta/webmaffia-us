import Script from "next/script";
import { Albert_Sans } from "next/font/google";
import "@/scss/main.scss";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeInit from "@/components/ThemeInit";
import ScrollToTop from "@/components/ScrollToTop";
import KlaviyoScript from "@/components/KlaviyoScript";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import ChatCTA from "@/components/ChatCTA";
import CallCTA from "@/components/CallCTA";
import AISummaryCTA from "@/components/AISummaryCTA";
import { getCampaigns, getFooter } from "@/lib/strapiPage";

const albertSans = Albert_Sans({
  variable: "--font-albert-sans",
  subsets: ["latin"],
});

export const siteMetadata = {
  title: "Webmaffia | Creative Digital Agency",
  description:
    "Webmaffia is a full-service creative and digital marketing agency in Mumbai.",
  verification: {
    google: "VX6Z1r6uKqRzCYCmofyP19bkg4LVX_AtUPEvDqNYM5M",
  },
  icons: {
    icon: "/assets/images/fav.jpg",
    shortcut: "/assets/images/fav.jpg",
    apple: "/assets/images/fav.jpg",
  },
};

export default async function RootShell({ lang = "en", dir = "ltr", children }) {
  const footerData = await getFooter();

  let campaignSlugs = [];
  try {
    const campaigns = await getCampaigns();
    campaignSlugs = campaigns.map((campaign) => campaign.slug);
  } catch (error) {
    console.error("Failed to fetch campaigns for footer:", error);
  }

  return (
    <html lang={lang} dir={dir} className={albertSans.variable} suppressHydrationWarning>
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TC56DRFT');`}
        </Script>
        {/* End Google Tag Manager */}
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TC56DRFT"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <ThemeInit />
        <ScrollToTop />
        <Header />
        {children}
        <Footer footerData={footerData} campaignSlugs={campaignSlugs} />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-T2G85GJLPP"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-T2G85GJLPP');
          `}
        </Script>
        <KlaviyoScript />
        {/* <WhatsAppCTA /> */}
        <ChatCTA />
        <CallCTA />
        <Script id="tawk-to" strategy="lazyOnload">
          {`
            var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
            // Hide Tawk's own bubble: ChatCTA is our custom button, and the
            // bubble stays hidden again whenever the chat window is minimised.
            // (ai-summary-cta.scss also hides it from the first paint, until a chat is open.)
            // Park Tawk's (invisible) bubble where ChatCTA sits, so clicks land on ours.
            Tawk_API.customStyle = {
              visibility: {
                desktop: { position: "br", xOffset: 40, yOffset: 112 },
                mobile: { position: "br", xOffset: 0, yOffset: 56 }
              }
            };
            var root = document.documentElement;
            Tawk_API.onLoad = function () { Tawk_API.hideWidget(); };
            Tawk_API.onStatusChange = function () { if (!root.hasAttribute("data-chat-open")) Tawk_API.hideWidget(); };
            Tawk_API.onChatMaximized = function () { root.setAttribute("data-chat-open", ""); };
            Tawk_API.onChatMinimized = function () { root.removeAttribute("data-chat-open"); Tawk_API.hideWidget(); };
            (function () {
              var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
              s1.async = true;
              s1.src = "https://embed.tawk.to/6ae0393695e150346e90af1a/1k5ttuvp8";
              s1.charset = "UTF-8";
              s1.setAttribute("crossorigin", "*");
              s0.parentNode.insertBefore(s1, s0);
            })();
          `}
        </Script>
        <AISummaryCTA />
      </body>
    </html>
  );
}
