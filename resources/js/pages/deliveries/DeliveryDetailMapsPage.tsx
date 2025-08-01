import TripDeliveryDetailMap from '@/components/maps/TripDeliveryDetailMap';
import { useAppearance } from '@/hooks/use-appearance';
import GoogleMapsProvider from '@/providers/GoogleMapsProvider';
import { useEffect } from 'react';
import { Toaster } from 'sonner';

const DeliveryDetailMapsPage = () => {
    const { updateAppearance } = useAppearance();

    useEffect(() => {
        updateAppearance('light');
    }, []);

    return (
        <GoogleMapsProvider>
            <Toaster />
            <TripDeliveryDetailMap />
        </GoogleMapsProvider>
    );
};
export default DeliveryDetailMapsPage;
