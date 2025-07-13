import React from 'react';
import Image from 'next/image';
import logo from "@/assets/easylogo.png"
import { cn } from "@/lib/utils"

export const Logo = ({ className = "" }) => {
    return (
        <div>
            <Image
                className={cn("max-w-[200px]", className)}
                src={logo}
                alt="Logo"
            />
        </div>
    );
};