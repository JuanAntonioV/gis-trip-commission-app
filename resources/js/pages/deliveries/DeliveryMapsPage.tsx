import { Button } from '@/components/ui/button';
import useGeoLocation from '@/hooks/useGeoLocation';
import GoogleMapsProvider from '@/providers/GoogleMapsProvider';
import { Delivery } from '@/types';
import { usePage } from '@inertiajs/react';
import { Map } from '@vis.gl/react-google-maps';
import { useMemo } from 'react';

const DeliveryMapsPage = () => {
    const serverProps = usePage().props;
    const delivery = serverProps.delivery as Delivery;
    console.log('🚀 ~ DeliveryMapsPage ~ delivery:', delivery);

    const currentLocation = useGeoLocation({
        onError: () => {
            console.error('Failed to get current location');
        },
    });
    const defaultLocation = useMemo<{ lat: number; lng: number }>(() => {
        if (currentLocation.loaded) {
            return { lat: currentLocation.coordinates?.lat as number, lng: currentLocation.coordinates?.lng as number };
        }

        return { lat: 3.595226750097991, lng: 98.67200113297093 };
    }, [currentLocation]);

    return (
        <GoogleMapsProvider>
            <div className="relative mx-auto h-full w-full max-w-2xl">
                <div className="flex h-screen flex-col items-center justify-center">
                    <Map
                        style={{
                            width: '100%',
                            height: '100%',
                            position: 'relative',
                            animationDuration: '0.5s',
                        }}
                        defaultCenter={defaultLocation}
                        clickableIcons={false}
                        mapTypeId="terrain"
                        gestureHandling={'greedy'}
                        disableDefaultUI={true}
                        defaultZoom={15}
                        cameraControl
                        fullscreenControl
                        controlSize={30}
                    />
                </div>

                <div className="absolute right-0 bottom-0 left-0 rounded-t-xl bg-white px-4 pt-6 pb-10 shadow-lg">
                    <Button className="w-full bg-blue-500 py-6 font-semibold text-white hover:bg-blue-600" onClick={() => alert('Mulai Trip')}>
                        Mulai Trip
                    </Button>

                    <div className="mt-4 flex items-center justify-between">
                        <Button
                            variant="secondary"
                            className="w-full bg-green-500 py-6 font-semibold text-white hover:bg-green-600"
                            onClick={() => alert('Selesai Trip')}
                        >
                            Selesai Trip
                        </Button>
                        <Button
                            variant="destructive"
                            className="ml-2 w-full bg-red-600 py-6 font-semibold text-white hover:bg-red-700"
                            onClick={() => alert('Batalkan Trip')}
                        >
                            Batalkan Trip
                        </Button>
                    </div>
                </div>
            </div>
        </GoogleMapsProvider>
    );
};
export default DeliveryMapsPage;
