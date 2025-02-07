"use client"

import { MdHistory, MdOutlineDashboard, MdOutlineWorkOutline } from "react-icons/md";
import { useEffect, useState } from "react";
import { SideBarItem } from "./SideBarItem";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoPersonOutline, IoSettingsOutline } from "react-icons/io5";
import { PiSignOutBold } from "react-icons/pi";
import { GoGoal } from "react-icons/go";
import { CiBoxList } from "react-icons/ci";
import { StreakDisplay } from "./StreakDisplay";
import { useSession } from "next-auth/react";

export const SideBar = () => {
    const { data: session } = useSession();
    const userId = Number(session?.user?.id);
    const [open, setOpen] = useState(true);
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setOpen(false);
            } else {
                setOpen(true);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="p-6 ">
            <div className="relative bg-[#F7F7F7] h-full rounded-2xl flex flex-col ">

                <div className={`${open ? "px-3" : "scale-0 px-2"} pt-5 flex transition-all duration-300`}>
                    <div className="text-2xl font-semibold text-[#222222]">
                        Trackster
                    </div>
                    <div className={`${open ? "flex items-center pl-1" : "scale-0"}`}>
                        <StreakDisplay isOpen={open} userId={userId} />
                    </div>
                </div>

                <div className={`flex flex-col ${open ? "w-80 sm:[20rem]" : "w-20 sm:w-28"} sticky top-0 left-0 bottom-0 pl-7 pt-16 transition-all duration-500 flex-grow`}>

                    <div onClick={() => setOpen(!open)}
                        className={`bg-[#374151] flex justify-center items-center text-white w-10 h-10 rounded-lg 
                        ${open ? "right-3 -top-9" : "right-5 -top-9"} ${!open && "w-16 h-12"} absolute cursor-pointer`}>
                        <GiHamburgerMenu className={`text-2xl ${!open && "rotate-180"} transition-all duration-500`} />
                    </div>

                    <div className="flex-grow">
                        <div className={`${!open && "text-slate-950"} mb-3 text-md text-[#4b4b4b] font-semibold`}>
                            TRACKS
                        </div>
                        <div className={`${open ? "mr-2" : ""} text-lg -mt-10 sm:-mt-0`}>
                            <SideBarItem href="/dashboard" isOpen={open} title="Dashboard" icon={<MdOutlineDashboard />} />
                            <SideBarItem href="/goals" isOpen={open} title="Goals" icon={<GoGoal />} />
                            <SideBarItem href="/dailies" isOpen={open} title="Dailies" icon={<CiBoxList />} />
                        </div>

                        <hr className="my-4 border-[#E0E0E0] mr-5" />

                        <div className={`${!open && "text-slate-950"} mb-3 pl-2 text-md text-[#4b4b4b] font-semibold`}>
                            LISTS
                        </div>
                        <div className={`${open ? "mr-2" : ""} text-lg`}>
                            <SideBarItem href="/personal" isOpen={open} title="Personal" icon={<IoPersonOutline />} />
                            <SideBarItem href="/work" isOpen={open} title="Work" icon={<MdOutlineWorkOutline />} />
                            <SideBarItem href="/history" isOpen={open} title="History" icon={<MdHistory />} />
                        </div>
                    </div>

                    <div className="mb-5 ">
                        <SideBarItem href="/settings" isOpen={open} title="Settings" icon={<IoSettingsOutline />} />
                        <SideBarItem href="/signout" isOpen={open} title="Sign Out" icon={<PiSignOutBold />} />
                    </div>
                </div>
            </div>
        </div>
    );
};
