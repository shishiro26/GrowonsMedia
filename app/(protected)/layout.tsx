import { SessionProvider } from "next-auth/react";
import Sidebar from "./_components/sidebar";
import { auth } from "@/auth";
import { Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});
interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <div className="overflow-hidden h-full">
        <div className={`${font.className} md:flex md:flex-row`}>
          <Sidebar />
          <div className="md:flex-1 m-1 w-full overflow-scroll">
            <Toaster />
            {children}
          </div>
        </div>
      </div>
    </SessionProvider>
  );
};

export default ProtectedLayout;
