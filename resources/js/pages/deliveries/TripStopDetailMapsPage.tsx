import CancelTripStopButton from '@/components/CancelTripStopButton';
import CompleteTripStopButton from '@/components/CompleteTripStopButton';
import Heading from '@/components/heading';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useAppearance } from '@/hooks/use-appearance';
import useGeoLocation from '@/hooks/useGeoLocation';
import { Delivery, TripStop } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useMemo } from 'react';

const TripStopDetailMapsPage = () => {
    const serverProps = usePage().props;
    const delivery = serverProps.delivery as Delivery;
    const tripStop = serverProps.tripStop as TripStop;
    // const isAdmin = serverProps.isAdmin as boolean;

    const { updateAppearance } = useAppearance();

    useEffect(() => {
        updateAppearance('light');
    }, []);

    const currentLocation = useGeoLocation({
        onError: (error) => {
            console.error(error);
        },
    });

    const defaultLocation = useMemo<{ lat: number; lng: number }>(() => {
        if (currentLocation.loaded) {
            return { lat: currentLocation.coordinates?.lat as number, lng: currentLocation.coordinates?.lng as number };
        }

        return { lat: 3.595226750097991, lng: 98.67200113297093 };
    }, [currentLocation]);

    return (
        <main className="mx-auto w-full max-w-xl px-4 pt-10">
            <Heading title="Detail Pemberhentian Trip" />
            <Separator className="mb-6" />

            <div className="mb-6 grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-2">
                <div className="grid gap-2">
                    <p className="text-xs text-muted-foreground">ID Pemberhentian</p>
                    <span className="text-sm font-semibold">{tripStop.id}</span>
                </div>

                <div className="grid gap-2">
                    <p className="text-xs text-muted-foreground">Nama Tujuan</p>
                    <span className="text-sm font-semibold">{tripStop.destination_name}</span>
                </div>

                <div className="grid gap-2">
                    <p className="text-xs text-muted-foreground">Keterangan</p>
                    <span className="text-sm font-semibold">{tripStop.notes || '-'}</span>
                </div>
            </div>

            <footer className="fixed right-0 bottom-0 left-0 z-10 mx-auto w-full max-w-xl bg-white px-4 py-2 pb-8">
                <Alert variant={'destructive'}>
                    <AlertDescription className="text-xs">
                        Silahkan selesaikan pemberhentian ini untuk melanjutkan trip. Pastikan semua barang telah diantar ke tujuan yang dituju.
                    </AlertDescription>
                </Alert>

                <div className="mt-6 flex items-center justify-between gap-4">
                    <CancelTripStopButton tripStopId={tripStop.id} deliveryId={delivery.id} />
                    <CompleteTripStopButton
                        tripStopId={tripStop.id}
                        deliveryId={delivery.id}
                        currentLocation={
                            currentLocation.loaded
                                ? { latitude: currentLocation.coordinates!.lat.toString(), longitude: currentLocation.coordinates!.lng.toString() }
                                : { latitude: defaultLocation.lat.toString(), longitude: defaultLocation.lng.toString() }
                        }
                    />
                </div>
            </footer>
        </main>
    );
};
export default TripStopDetailMapsPage;
