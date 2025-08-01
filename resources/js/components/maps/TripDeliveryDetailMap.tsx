import useGeoLocation from '@/hooks/useGeoLocation';
import { Delivery, DeliveryItem, Trip } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { Separator } from '@radix-ui/react-select';
import { AdvancedMarker, ControlPosition, Map, useMap } from '@vis.gl/react-google-maps';
import { CheckCircle, ChevronLeft, Loader2, MapPlus } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import HeadingSmall from '../heading-small';
import { Button } from '../ui/button';

const TripDeliveryDetailMap = () => {
    const serverProps = usePage().props;
    const delivery = serverProps.delivery as Delivery;
    const trip = serverProps.trip as Trip;

    const map = useMap('delivery-map');

    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        if (map) {
            setMapLoaded(true);
        }
    }, [map]);

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

    type DeliveryItemWithRange = DeliveryItem & { range: number };
    const [deliveryItems, setDeliveryItems] = useState<DeliveryItemWithRange[]>(
        delivery.items.map((item) => ({
            ...item,
            range: 0,
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
                                range: (element.distance?.value || Infinity) / 1000,
                            };
                        });

                        updatedDeliveryItems.sort((a, b) => a.range - b.range);
                        setDeliveryItems(updatedDeliveryItems);
                    } else {
                        console.error('Distance Matrix request failed:', status);
                    }
                },
            );
        }
    }, [map, defaultLocation, delivery]);

    const [selectedTrip, setSelectedTrip] = useState<DeliveryItemWithRange | null>(null);

    useEffect(() => {
        if (deliveryItems.length > 0 && trip) {
            const tripItem = deliveryItems.find((item) => item.location_id === trip.destination_location_id);
            if (tripItem) {
                setSelectedTrip(tripItem);
            } else {
                setSelectedTrip(null);
            }
        }
    }, [deliveryItems]);

    useEffect(() => {
        if (!map || !selectedTrip || !selectedTrip.location.latitude || !selectedTrip.location.longitude) return;

        // remove current location marker
        if (currentLocationMarker) {
            currentLocationMarker.setMap(null);
            setCurrentLocationMarker(null);
        }

        // remove existing directions if any
        const existingDirectionsRenderer = map.get('directionsRenderer');
        if (existingDirectionsRenderer) {
            existingDirectionsRenderer.setMap(null);
        }

        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer();

        directionsRenderer.setMap(map);

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

    const handleRedirectGoogleMaps = () => {
        if (selectedTrip) {
            const { latitude, longitude } = selectedTrip.location;
            const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
            window.open(url, '_blank');
        }
    };

    if (mapLoaded) {
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

                <form className="space-y-6">
                    {selectedTrip && (
                        <div className="mt-4">
                            <h4 className="text-sm font-medium">
                                List Barang ({deliveryItems.filter((item) => item.location_id === selectedTrip.location_id).length})
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
                        <Button className="w-full bg-blue-500 py-4 transition-colors hover:bg-blue-600" type="submit">
                            <CheckCircle />
                            Selesai
                        </Button>
                        <Button
                            className="w-full bg-emerald-500 py-4 transition-colors hover:bg-emerald-600"
                            type="button"
                            onClick={() => {
                                alert('Fitur ini belum tersedia.');
                            }}
                        >
                            Batalkan
                        </Button>

                        {selectedTrip && (
                            <Button variant={'ghost'} className="col-span-2 w-full py-4" type="button" onClick={handleRedirectGoogleMaps}>
                                <MapPlus />
                                Tautan Lokasi
                            </Button>
                        )}
                    </footer>
                </form>
            </div>
        </div>
    );
};
export default TripDeliveryDetailMap;
