import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Obamart | Clientes e contas", description: "Gestão simples de clientes e contas." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR" data-theme="dark" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('obamart-theme');document.documentElement.dataset.theme=(t==='dark'||t==='light')?t:'dark'}catch(e){}` }} /></head><body>{children}</body></html>; }
