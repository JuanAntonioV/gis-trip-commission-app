import { TRIP_STATUSES } from '@/constants';
import useGeoLocation from '@/hooks/useGeoLocation';
import { Delivery, DeliveryItemWithMapInfo, Trip } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { AdvancedMarker, ControlPosition, Map, useMap } from '@vis.gl/react-google-maps';
import dayjs from 'dayjs';
import { ChevronLeft, MapPlus } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import CancelTripButton from '../CancelTripButton';
import CompleteTripButton from '../CompleteTripButton';
import HeadingSmall from '../heading-small';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';

const TripDeliveryDetailMap = () => {
    const serverProps = usePage().props;
    const delivery = serverProps.delivery as Delivery;
    console.log('🚀 ~ TripDeliveryDetailMap ~ delivery:', delivery);
    const trip = serverProps.trip as Trip;
    console.log('🚀 ~ TripDeliveryDetailMap ~ trip:', trip);

    const map = useMap('ongoing-trip-map');

    const [mapLoaded, setMapLoaded] = useState(false);
    console.log('🚀 ~ TripDeliveryDetailMap ~ mapLoaded:', mapLoaded);

    useEffect(() => {
        if (map) {
            console.log('map', map);
            setMapLoaded(true);
            router.reload();
        }
    }, [map]);

    const currentLocation = useGeoLocation({
        onError: (error) => {
            console.error(error);
        },
    });

    const defaultLocation = useMemo<{ lat: number; lng: number }>(() => {
        if (currentLocation.loaded && currentLocation.coordinates) {
            return { lat: currentLocation.coordinates?.lat as number, lng: currentLocation.coordinates?.lng as number };
        }

        return { lat: 3.595226750097991, lng: 98.67200113297093 };
    }, [currentLocation]);

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
            let marker = new google.maps.Marker({
                position: {
                    lat: currentLocation.coordinates.lat,
                    lng: currentLocation.coordinates.lng,
                },
                map,
                title: 'Lokasi Saat Ini',
            });

            if (trip.status.id !== TRIP_STATUSES.IN_PROGRESS) {
                marker = new google.maps.Marker({
                    position: {
                        lat: Number(trip.origin_latitude),
                        lng: Number(trip.origin_longitude),
                    },
                    map,
                    title: 'Lokasi Awal Trip',
                });
            }

            setCurrentLocationMarker(marker);
            renderRef.current = 1; // Prevent re-rendering
        } else if (currentLocationMarker) {
            currentLocationMarker.setMap(null);
            setCurrentLocationMarker(null);
            renderRef.current = 0;
        }

        // Center map on current location
        if (trip.status.id === TRIP_STATUSES.IN_PROGRESS) {
            map.setCenter({
                lat: currentLocation.coordinates?.lat || defaultLocation.lat,
                lng: currentLocation.coordinates?.lng || defaultLocation.lng,
            });
        } else {
            map.setCenter({
                lat: Number(trip.origin_latitude),
                lng: Number(trip.origin_longitude),
            });
        }
        map.setZoom(15);
    }, [currentLocation, currentLocationMarker, map, defaultLocation, trip]);

    useEffect(() => {
        if (!map || !delivery || !defaultLocation || !delivery) return;

        const deliveryItems = delivery.items || [];

        if (deliveryItems.length > 0) {
            const service = new google.maps.DistanceMatrixService();

            const origins: google.maps.LatLngLiteral[] = [];

            if (trip.status.id === TRIP_STATUSES.IN_PROGRESS) {
                origins.push(defaultLocation);
            } else {
                origins.push({
                    lat: Number(trip.origin_latitude),
                    lng: Number(trip.origin_longitude),
                });
            }

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
    }, [map, defaultLocation, delivery, trip]);

    const [selectedTrip, setSelectedTrip] = useState<DeliveryItemWithMapInfo | null>(null);

    useEffect(() => {
        if (deliveryItems.length > 0 && trip) {
            const tripItem = deliveryItems.find((item) => item.location_id === trip.destination_location_id);
            if (tripItem) {
                setSelectedTrip(tripItem);
            } else {
                setSelectedTrip(null);
            }
        }
    }, [deliveryItems, trip]);

    useEffect(() => {
        if (!map || !defaultLocation || !selectedTrip || !selectedTrip.location.latitude || !selectedTrip.location.longitude) return;

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

        let origins: google.maps.LatLngLiteral = {
            lat: Number(defaultLocation.lat),
            lng: Number(defaultLocation.lng),
        };

        if (trip.status.id !== TRIP_STATUSES.IN_PROGRESS) {
            origins = {
                lat: Number(trip.origin_latitude),
                lng: Number(trip.origin_longitude),
            };
        }

        directionsService.route(
            {
                origin: origins,
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
    }, [map, selectedTrip, defaultLocation, trip, currentLocationMarker]);

    const handleRedirectGoogleMaps = () => {
        if (selectedTrip) {
            const { latitude, longitude } = selectedTrip.location;
            const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
            window.open(url, '_blank');
        }
    };

    return (
        <div className="relative h-full w-full">
            <div className="absolute top-4 left-4 z-10 flex items-center gap-4">
                <Button variant={'default'} onClick={() => router.visit('/dashboard')} className="bg-white text-black hover:bg-gray-100">
                    <ChevronLeft />
                </Button>
            </div>

            <div className="flex h-screen flex-col items-center justify-center">
                <Map
                    id="ongoing-trip-map"
                    mapId={'ongoing-trip-map'}
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
                <HeadingSmall title="Pengiriman Berlangsung" />

                <Separator className="mt-2 mb-4" />

                <form className="space-y-6">
                    {selectedTrip && (
                        <div className="mt-4">
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                <div>
                                    <Label>Estimasi</Label>
                                    <p className="text-sm text-gray-500">
                                        {selectedTrip.duration.text} ({selectedTrip.range.text})
                                    </p>
                                </div>
                                <div>
                                    <Label>Estimasi Tiba</Label>
                                    <p className="text-sm text-gray-500">{dayjs().add(selectedTrip.duration.value, 'seconds').format('HH:mm')}</p>
                                </div>
                                <div>
                                    <Label>Estimasi Terlama</Label>
                                    <p className="text-sm text-gray-500">
                                        {dayjs()
                                            .add(selectedTrip.duration.value * 1.1 + 300, 'seconds')
                                            .format('HH:mm')}
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

                    {trip.status.id !== TRIP_STATUSES.COMPLETED && trip.status.id !== TRIP_STATUSES.CANCELLED ? (
                        <footer className="mt-8 grid max-h-[200px] w-full grid-cols-2 gap-4 overflow-y-auto">
                            <CompleteTripButton
                                id={trip.id}
                                currentLocation={{
                                    latitude: currentLocation.coordinates?.lat.toString() || defaultLocation.lat.toString(),
                                    longitude: currentLocation.coordinates?.lng.toString() || defaultLocation.lng.toString(),
                                }}
                            />
                            <CancelTripButton id={trip.id} deliveryId={trip.delivery_id} />

                            {selectedTrip && (
                                <Button variant={'ghost'} className="col-span-2 w-full py-4" type="button" onClick={handleRedirectGoogleMaps}>
                                    <MapPlus />
                                    Tautan Lokasi
                                </Button>
                            )}
                        </footer>
                    ) : (
                        <footer className="mt-8 grid max-h-[200px] w-full grid-cols-2 gap-4 overflow-y-auto">
                            <Alert className="col-span-2 w-full" variant={'destructive'}>
                                <AlertTitle>Perhatian!</AlertTitle>
                                <AlertDescription>
                                    Trip ini sudah selesai atau dibatalkan. Anda tidak dapat melakukan tindakan lebih lanjut.
                                </AlertDescription>
                            </Alert>
                        </footer>
                    )}
                </form>
            </div>
        </div>
    );
};
export default TripDeliveryDetailMap;
