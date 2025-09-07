import { useSidebar } from '@/components/ui/sidebar';
import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    const { isSmallMobile, isMobile, deviceType } = useSidebar();
    
    return (
        <>
            <div className={`
                flex aspect-square items-center justify-center rounded-md overflow-hidden bg-white dark:bg-gray-800 shadow-sm border border-gray-200/50 dark:border-gray-700/50
                ${isSmallMobile && isMobile ? 'size-6' : 'size-8'}
            `}>
                <img 
                    src="/android-chrome-512x512.png" 
                    alt="SIWarga Logo" 
                    className={`
                        w-full h-full object-contain p-0.5
                        ${isSmallMobile && isMobile ? 'size-6' : 'size-8'}
                    `}
                    onError={(e) => {
                        // Fallback ke SVG icon jika gambar gagal load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                    }}
                />
                <AppLogoIcon className={`
                    hidden fill-current text-blue-600 dark:text-blue-400
                    ${isSmallMobile && isMobile ? 'size-4' : 'size-5'}
                `} />
            </div>
            <div className={`
                ml-1 grid flex-1 text-left
                ${isSmallMobile && isMobile ? 'text-xs' : 'text-sm'}
            `}>
                <span className={`
                    mb-0.5 truncate leading-tight font-semibold
                    ${isSmallMobile && isMobile ? 'mb-0' : ''}
                `}>
                    SIWarga
                </span>
            </div>
        </>
    );
}
