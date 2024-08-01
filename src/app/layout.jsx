import { Inter } from "next/font/google";
import "./globals.css";
import NavMenu from "@/components-s/NavMenu";
import { cookies } from "next/headers";
import { checkLoginStatus } from "@/logic-s/loginStat";
import { customInitApp } from "@/lib/firebase-admin-config";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "my resources today",
  description: "How much time do I have left today?",
};
//
export default async function RootLayout({ children }) {

  return (
    <html>
      <body className={`${inter.className} h-screen w-screen`}>
        <NavMenu />
        <section className="h-[90%] max-w-[40rem] bg-gray-100 m-auto flex justify-center items-center">
          {children}
        </section>
      </body>
    </html>
  );
}
