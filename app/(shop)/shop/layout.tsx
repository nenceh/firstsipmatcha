import { CartProvider } from "@/app/contexts/CartContext";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (<CartProvider>
        <main>
            {children}
        </main>
    </CartProvider>);
}