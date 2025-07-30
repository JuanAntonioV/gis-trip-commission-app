import { Toaster } from '@/components/ui/sonner';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import GoogleMapsProvider from '@/providers/GoogleMapsProvider';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
}

export default ({ children, ...props }: AppLayoutProps) => (
    <GoogleMapsProvider>
        <AppLayoutTemplate {...props}>
            <Toaster />
            {children}
        </AppLayoutTemplate>
    </GoogleMapsProvider>
);
