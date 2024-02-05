"use client";
import React, { createContext } from "react";

type StatusContextType = {
    is_serving_time: boolean;
};

export const StatusContext = createContext<StatusContextType | undefined>(undefined);