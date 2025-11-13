import { Carter_One, Josefin_Sans } from "next/font/google";
import { Viewport } from "next";
import "./styles/styles.css";
import { BASE } from "@/database/constants";
import NavHeader from "./components/NavHeader";
import dynamic from "next/dynamic";
import Skeleton from "./components/Skeleton";
const Footer = dynamic(() => import('@/app/components/Footer'), {
    loading: () => <Skeleton classes="width-100 height-lg" />,
});

const carterOne = Carter_One({
    weight: "400",
    subsets: ["latin"],
});

const josefinSans = Josefin_Sans({
    subsets: ["latin"],
});

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <head>
                <link // fontawesome
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.0/css/all.min.css"
                />
                <link // <link rel="icon" type="image/x-icon" href="%PUBLIC_URL%/logo-bowl.svg">
                    rel="icon"
                    href={`${BASE}/images/logo-bowl.svg`}
                    type="image/x-icon"
                />
            </head>
            <body
                className={`
                    ${carterOne} 
                    ${josefinSans} 
                    antialiased
                `}
            >
                <NavHeader />
                {children}
                <Footer />
            </body>
        </html>
    );
}