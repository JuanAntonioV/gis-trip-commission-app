import { Toaster } from '@/components/ui/sonner';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { APIProvider } from '@vis.gl/react-google-maps';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
}

export default ({ children, ...props }: AppLayoutProps) => (
    <APIProvider
        apiKey={import.meta.env.VITE_GOOGLE_API_KEY}
        onLoad={() => {
            console.log('Google Maps API loaded');
        }}
    >
        <AppLayoutTemplate {...props}>
            <Toaster />
            {children}
        </AppLayoutTemplate>
    </APIProvider>
);
