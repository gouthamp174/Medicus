import React from 'react';
import { Username } from "./users";

export function useExtendClass(baseClass, extendClass) {
    return [baseClass, extendClass].join(" ").trim();
}


export function useCompareUsers(firstUser, lastUser) {
    const firstUsername = Username({user: firstUser});
    const lastUsername = Username({user: lastUser});
    
    return (firstUsername === lastUsername) ? true: false;
}