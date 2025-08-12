import useGeoLocation from '@/hooks/useGeoLocation';
import { Delivery, DeliveryItemWithMapInfo } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';
import { AdvancedMarker, ControlPosition, Map, useMap } from '@vis.gl/react-google-maps';
import { ChevronLeft, Loader2, Send } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import CreateTripStopButton from '../CreateTripStopButton';
import HeadingSmall from '../heading-small';
import SelectInput from '../SelectInput';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import NumberInput from '../ui/NumberInput';
import { Separator } from '../ui/separator';

const TripDeliveryMap = () => {
    const serverProps = usePage().props;
    const delivery = serverProps.delivery as Delivery;

    const currentLocation = useGeoLocation({
        onError: (error) => {
            console.error(error);
            toast.error('Gagal mendapatkan lokasi saat ini. Pastikan izin lokasi telah diberikan.', {
                onAutoClose: () => {
                    router.visit(route('dashboard'));
                },
            });
        },
    });
    const defaultLocation = useMemo<{ lat: number; lng: number }>(() => {
        if (currentLocation.loaded && currentLocation.coordinates) {
            return { lat: currentLocation.coordinates.lat, lng: currentLocation.coordinates.lng };
        }

        return { lat: 3.595226750097991, lng: 98.67200113297093 };
    }, [currentLocation]);

    const map = useMap('delivery-map');

    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        if (map) {
            setMapLoaded(true);
        }
    }, [map]);

    const [deliveryItems, setDeliveryItems] = useState<DeliveryItemWithMapInfo[]>(
        delivery.items.map((item) => ({
            ...item,
            range: { text: '0 km', value: 0 },
            duration: { text: '0 menit', value: 0 },
        })),
    );

    const [currentLocationMarker, setCurrentLocationMarker] = useState<google.maps.Marker | null>(null);

    const renderRef = useRef(0);

    useEffect(() => {
        if (!map || !currentLocation.loaded || renderRef.current) return;
        // Set current location marker
        if (currentLocation.loaded && currentLocation.coordinates) {
            const marker = new google.maps.Marker({
                position: {
                    lat: currentLocation.coordinates.lat,
                    lng: currentLocation.coordinates.lng,
                },
                map,
                title: 'Lokasi Saat Ini',
            });
            setCurrentLocationMarker(marker);
            renderRef.current = 1; // Prevent re-rendering
        } else if (currentLocationMarker) {
            currentLocationMarker.setMap(null);
            setCurrentLocationMarker(null);
            renderRef.current = 0;
        }

        // Center map on current location
        map.setCenter({
            lat: currentLocation.coordinates?.lat || defaultLocation.lat,
            lng: currentLocation.coordinates?.lng || defaultLocation.lng,
        });
        map.setZoom(15);
    }, [currentLocation, currentLocationMarker, map]);

    useEffect(() => {
        if (!map) return;

        const deliveryItems = delivery.items || [];

        if (deliveryItems.length > 0) {
            const service = new google.maps.DistanceMatrixService();

            const origins = [defaultLocation];
            const destinations = deliveryItems.map((item) => ({
                lat: Number(item.location.latitude),
                lng: Number(item.location.longitude),
            }));

            service.getDistanceMatrix(
                {
                    origins,
                    destinations,
                    travelMode: google.maps.TravelMode.DRIVING,
                },
                (response, status) => {
                    if (status === google.maps.DistanceMatrixStatus.OK && response) {
                        const updatedDeliveryItems = deliveryItems.map((item, index) => {
                            const element = response.rows[0].elements[index];
                            return {
                                ...item,
                                range: element.distance
                                    ? { text: element.distance.text, value: element.distance.value / 1000 } // in kilometers
                                    : { text: '0 km', value: 0 },
                                duration: element.duration
                                    ? { text: element.duration.text, value: element.duration.value } // in seconds
                                    : { text: '0 menit', value: 0 },
                            };
                        });

                        updatedDeliveryItems.sort((a, b) => a.range.value - b.range.value);
                        setDeliveryItems(updatedDeliveryItems);
                    } else {
                        console.error('Distance Matrix request failed:', status);
                    }
                },
            );
        }
    }, [map, defaultLocation, delivery]);

    const [selectedTrip, setSelectedTrip] = useState<DeliveryItemWithMapInfo | null>(null);

    useEffect(() => {
        if (!map || !selectedTrip || !selectedTrip.location.latitude || !selectedTrip.location.longitude) return;

        // remove current location marker
        if (currentLocationMarker) {
            currentLocationMarker.setMap(null);
            setCurrentLocationMarker(null);
        }

        // remove existing directions if any
        const existingDirectionsRenderer = (map as any).directionsRenderer;
        if (existingDirectionsRenderer) {
            existingDirectionsRenderer.setMap(null);
            (map as any).directionsRenderer = null;
        }

        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer();

        directionsRenderer.setMap(map);
        (map as any).directionsRenderer = directionsRenderer;

        directionsService.route(
            {
                origin: defaultLocation,
                destination: {
                    lat: Number(selectedTrip.location.latitude),
                    lng: Number(selectedTrip.location.longitude),
                },
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsRenderer.setDirections(result);
                } else {
                    console.error('Directions request failed due to ' + status);
                }
            },
        );
    }, [map, selectedTrip, defaultLocation]);

    const { post, processing, errors, setData, data } = useForm({
        delivery_id: delivery.id,
        location_id: selectedTrip?.location_id || null,
        latitude: '',
        longitude: '',
        starting_km: 0,
    });

    useEffect(() => {
        if (currentLocation.loaded && currentLocation.coordinates) {
            setData('latitude', currentLocation.coordinates!.lat.toString());
            setData('longitude', currentLocation.coordinates!.lng.toString());
        }
    }, [currentLocation]);

    const handleStartTrip = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedTrip) {
            toast.error('Silakan pilih tujuan pengiriman terlebih dahulu.');
            return;
        }
        post(route('trips.start'), {
            onSuccess: () => {
                // Handle success
                toast.success('Pengiriman berhasil dimulai.');
            },
            onError: () => {
                // Handle error
                toast.error('Gagal memulai pengiriman. Silakan coba lagi.');
            },
        });
    };

    if (mapLoaded && !currentLocation.loaded) {
        return (
            <div className="flex h-screen flex-col items-center justify-center space-y-4">
                <Loader2 className="mr-2 animate-spin" />
                <div className="text-center">
                    <h4 className="text-base font-semibold">Memuat peta...</h4>
                    <div className="mt-1 text-sm text-gray-500">Pastikan koneksi internet Anda stabil.</div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-full w-full">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
                <Button variant={'default'} onClick={() => router.visit('/dashboard')} className="bg-white text-black hover:bg-gray-100">
                    <ChevronLeft />
                </Button>
            </div>

            <div className="flex h-screen flex-col items-center justify-center">
                <Map
                    id="delivery-map"
                    mapId={'delivery-map'}
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
                    cameraControlOptions={{
                        position: ControlPosition.TOP_RIGHT,
                    }}
                    controlSize={30}
                >
                    {currentLocationMarker && (
                        <AdvancedMarker
                            position={{
                                lat: currentLocation.coordinates?.lat || defaultLocation.lat,
                                lng: currentLocation.coordinates?.lng || defaultLocation.lng,
                            }}
                        />
                    )}
                </Map>
            </div>

            <div className="absolute right-0 bottom-0 left-0 mx-auto w-full max-w-xl rounded-t-3xl bg-white px-4 pt-6 pb-10 text-black shadow-2xl">
                <HeadingSmall title="Daftar Pengiriman" />

                <Separator className="mt-2 mb-4" />

                <form className="space-y-6" onSubmit={handleStartTrip}>
                    {(errors as any)?.message && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription className="text-xs">{(errors as any).message}</AlertDescription>
                        </Alert>
                    )}
                    <SelectInput
                        label="Tujuan Pengiriman"
                        value={selectedTrip?.location_id?.toString() || ''}
                        errors={errors.location_id}
                        onChange={(value) => {
                            const trip = deliveryItems.find((item) => item.location_id?.toString() === value);
                            setSelectedTrip(trip || null);
                            setData('location_id', trip?.location_id || null);
                        }}
                        data={deliveryItems.map((item) => ({
                            value: item.location_id?.toString(),
                            label: item.location.name,
                        }))}
                        placeholder="Pilih tujuan pengiriman"
                    />

                    <NumberInput
                        label="Kilometer kendaraan"
                        value={data.starting_km}
                        onChange={(value) => setData('starting_km', value)}
                        errors={errors.starting_km}
                        placeholder="Masukkan kilometer kendaraan"
                        min={0}
                    />

                    {selectedTrip && (
                        <div className="mt-4">
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                <div>
                                    <Label>Estimasi Tiba:</Label>
                                    <p className="text-sm text-gray-500">
                                        {selectedTrip.duration.text} ({selectedTrip.range.text})
                                    </p>
                                </div>
                            </div>
                            <Separator className="my-4" />
                            <h4 className="text-sm font-medium">
                                Barang ({deliveryItems.filter((item) => item.location_id === selectedTrip.location_id).length})
                            </h4>

                            <ul className="mt-2 max-h-60 space-y-2 overflow-y-auto">
                                {deliveryItems
                                    .filter((item) => item.location_id === selectedTrip.location_id)
                                    .map((item, i) => (
                                        <li key={item.id} className="flex items-center justify-between">
                                            <p className="text-sm">
                                                {i + 1}. <span className="text-sm font-semibold">{item.invoice_number}</span>
                                            </p>
                                            <span className="text-sm text-gray-500">{item.weight} kg</span>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    )}

                    <footer className="mt-8 grid w-full grid-cols-2 gap-4">
                        <Button className="w-full bg-blue-500 py-4 transition-colors hover:bg-blue-600" type="submit" loading={processing}>
                            <Send />
                            Mulai
                        </Button>
                        <CreateTripStopButton
                            deliveryId={delivery.id}
                            currentLocation={{
                                latitude: defaultLocation.lat.toString(),
                                longitude: defaultLocation.lng.toString(),
                            }}
                        />
                    </footer>
                </form>
            </div>
        </div>
    );
};
export default TripDeliveryMap;
