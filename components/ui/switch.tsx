import React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import './switch.css';
import { cn } from "@/lib/utils"

export const Switch = React.forwardRef<
    React.ElementRef<typeof SwitchPrimitive.Root>,
    SwitchPrimitive.SwitchProps
>(({ className, ...props }, ref) => (
    <SwitchPrimitive.Root className={cn("ml-4 w-[42px] h-[25px] bg-blackA6 rounded-full relative focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-red-700 outline-none cursor-default", className)} ref={ref} {...props}>
        <SwitchPrimitive.Thumb className="block w-[21px] h-[21px] bg-white rounded-full shadow-[0_2px_2px] shadow-blackA4 transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
    </SwitchPrimitive.Root>
));
