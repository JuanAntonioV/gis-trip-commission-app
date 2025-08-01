import TripDeliveryMap from '@/components/maps/TripDeliveryMap';
import { useAppearance } from '@/hooks/use-appearance';
import GoogleMapsProvider from '@/providers/GoogleMapsProvider';
import { useEffect } from 'react';
import { Toaster } from 'sonner';

const DeliveryMapsPage = () => {
    const { updateAppearance } = useAppearance();

    useEffect(() => {
        updateAppearance('light');
    }, []);

    return (
        <GoogleMapsProvider>
            <Toaster />
            <TripDeliveryMap />
        </GoogleMapsProvider>
    );
};
export default DeliveryMapsPage;
