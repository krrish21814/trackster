import { SideBar } from "../components/SideBar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col ">
      <div className="flex flex-1">
      <SideBar/>
        <div className="flex-1  px-4 pt-8">
          {children}
        </div>
      </div>
    </div>
  );
}