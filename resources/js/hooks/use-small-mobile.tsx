import { useEffect, useState } from 'react';

const SMALL_MOBILE_BREAKPOINT = 480; // For very small mobile devices
const MOBILE_BREAKPOINT = 768;
const SMALL_MODE_KEY = 'siwarga-small-mode'; // LocalStorage key for small mode preference

export type DeviceType = 'small-mobile' | 'mobile' | 'desktop';

export function useIsSmallMobile() {
    const [isSmallMobile, setIsSmallMobile] = useState<boolean>();

    useEffect(() => {
        const mql = window.matchMedia(`(max-width: ${SMALL_MOBILE_BREAKPOINT - 1}px)`);

        const onChange = () => {
            setIsSmallMobile(window.innerWidth < SMALL_MOBILE_BREAKPOINT);
        };

        mql.addEventListener('change', onChange);
        setIsSmallMobile(window.innerWidth < SMALL_MOBILE_BREAKPOINT);

        return () => mql.removeEventListener('change', onChange);
    }, []);

    return !!isSmallMobile;
}

export function useSmallMode() {
    const [isSmallMode, setIsSmallMode] = useState<boolean>(false);

    useEffect(() => {
        // Load small mode preference from localStorage
        const savedSmallMode = localStorage.getItem(SMALL_MODE_KEY);
        setIsSmallMode(savedSmallMode === 'true');
    }, []);

    const toggleSmallMode = () => {
        const newSmallMode = !isSmallMode;
        setIsSmallMode(newSmallMode);
        localStorage.setItem(SMALL_MODE_KEY, newSmallMode.toString());
    };

    return { isSmallMode, toggleSmallMode };
}

export function useIsMobileVariant(): {
    isMobile: boolean;
    isSmallMobile: boolean;
    isSmallMode: boolean;
    deviceType: DeviceType;
    toggleSmallMode: () => void;
} {
    const [isMobile, setIsMobile] = useState<boolean>();
    const [isSmallMobile, setIsSmallMobile] = useState<boolean>();
    const { isSmallMode, toggleSmallMode } = useSmallMode();

    useEffect(() => {
        const mqlMobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
        const mqlSmallMobile = window.matchMedia(`(max-width: ${SMALL_MOBILE_BREAKPOINT - 1}px)`);

        const onChange = () => {
            const currentWidth = window.innerWidth;
            setIsMobile(currentWidth < MOBILE_BREAKPOINT);
            setIsSmallMobile(currentWidth < SMALL_MOBILE_BREAKPOINT);
        };

        mqlMobile.addEventListener('change', onChange);
        mqlSmallMobile.addEventListener('change', onChange);
        onChange();

        return () => {
            mqlMobile.removeEventListener('change', onChange);
            mqlSmallMobile.removeEventListener('change', onChange);
        };
    }, []);

    const deviceType: DeviceType = !!isSmallMobile ? 'small-mobile' : !!isMobile ? 'mobile' : 'desktop';

    return {
        isMobile: !!isMobile,
        isSmallMobile: !!isSmallMobile,
        isSmallMode,
        deviceType,
        toggleSmallMode
    };
}
