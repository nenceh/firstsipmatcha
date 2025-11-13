import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Home | First Sip Matcha Bar",
    description: "First Sip Matcha Bar",
};

export default function MarketLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (<main>{children}</main>);
}