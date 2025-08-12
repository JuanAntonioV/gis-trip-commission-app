import { LocationType } from '@/types';
import { Transition } from '@headlessui/react';
import { router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import SelectInput from '../SelectInput';
import HeadingSmall from '../heading-small';
import TextInput from '../ui/TextInput';
import TextareaInput from '../ui/TextareaInput';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

import { AdvancedMarker, ControlPosition, Map, MapControl, Pin, useMap } from '@vis.gl/react-google-maps';
import MapPlaceAutocomplete from '../MapPlaceAutocomplete';

type FormType = {
    location_type_id: number;
    name: string;
    address: string;
    postal_code: string;
    description: string;
    latitude: number;
    longitude: number;
};

const CreateLocationForm = () => {
    const serverProps = usePage().props;
    const locationTypes: LocationType[] = (serverProps.locationTypes as LocationType[]) || [];

    const { data, setData, post, errors, processing, recentlySuccessful, resetAndClearErrors } = useForm<Required<FormType>>({
        name: '',
        address: '',
        postal_code: '',
        description: '',
        latitude: 0,
        longitude: 0,
        location_type_id: -1,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('locations.store'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Lokasi berhasil ditambahkan');
                resetAndClearErrors();
            },
            onError: () => {
                toast.error('Gagal menambahkan lokasi');
            },
        });
    };

    const handleCancel = () => {
        resetAndClearErrors();
        router.visit(route('locations.index'));
    };

    const defaultLocation = useMemo<{ lat: number; lng: number }>(() => {
        return { lat: 3.595226750097991, lng: 98.67200113297093 };
    }, []);

    const map = useMap('map-container');

    type Poi = { key: string; location: google.maps.LatLngLiteral };
    const [location, setLocation] = useState<Poi | null>(null);

    const addMarker = () => {
        if (!map) return;

        const center = map.getCenter();
        if (!center) return;

        const newPoi: Poi = {
            key: `${center.lat()},${center.lng()}`,
            location: { lat: center.lat(), lng: center.lng() },
        };

        setLocation(newPoi);
        setData('latitude', newPoi.location.lat);
        setData('longitude', newPoi.location.lng);
    };
    const searchInputRef = useRef<HTMLInputElement | null>(null);

    const resetMarker = () => {
        setLocation(null);
        setData('latitude', 0);
        setData('longitude', 0);
        if (searchInputRef.current) {
            searchInputRef.current.focus();
            searchInputRef.current.value = '';
        }
    };

    const setSelectedPlace = (place: google.maps.places.PlaceResult | null) => {
        if (place) {
            setData('latitude', place.geometry?.location?.lat() || 0);
            setData('longitude', place.geometry?.location?.lng() || 0);

            if (place.geometry?.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();

                const newPoi: Poi = {
                    key: `${lat},${lng}`,
                    location: { lat, lng },
                };

                setLocation(newPoi);

                map?.setCenter(newPoi.location);
                map?.setZoom(15);
            }
        }
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <TextInput
                value={data.name}
                onChange={(value) => setData('name', value as string)}
                label="Nama Lokasi"
                placeholder="Contoh: Kantor Pusat"
                errors={errors.name}
                autoComplete="name"
            />

            <SelectInput
                value={String(data.location_type_id)}
                onChange={(value) => setData('location_type_id', Number(value))}
                label="Tipe Lokasi"
                placeholder="Pilih tipe lokasi"
                errors={errors.location_type_id}
                data={locationTypes.map((type) => ({ value: String(type.id), label: type.name }))}
            />

            <TextInput
                value={data.postal_code}
                onChange={(value) => setData('postal_code', value as string)}
                label="Kode Pos"
                placeholder="Contoh: 12345"
                errors={errors.postal_code}
                autoComplete="postal-code"
            />

            <TextareaInput
                value={data.address}
                onChange={(value) => setData('address', value as string)}
                label="Alamat"
                placeholder="Contoh: Jl. Raya No. 123"
                errors={errors.address}
                autoComplete="address"
            />
            <TextareaInput
                value={data.description}
                onChange={(value) => setData('description', value as string)}
                label="Keterangan"
                placeholder="Contoh: Depan kantor pusat"
                errors={errors.description}
                autoComplete="description"
            />

            <Separator className="my-8" />

            <HeadingSmall title="Koordinat Lokasi" description="Masukkan koordinat lokasi jika tersedia." />

            <Separator className="my-4" />

            <Map
                id="map-container"
                mapId={'map-container'}
                style={{
                    width: '100%',
                    height: '500px',
                    position: 'relative',
                    animationDuration: '0.5s',
                }}
                clickableIcons={false}
                mapTypeId="terrain"
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                defaultCenter={defaultLocation}
                defaultZoom={15}
                cameraControl
                fullscreenControl
                controlSize={30}
                onClick={(e) => {
                    const lat = e.detail.latLng?.lat;
                    const lng = e.detail.latLng?.lng;

                    if (lat && lng) {
                        const newPoi: Poi = {
                            key: `${lat},${lng}`,
                            location: { lat, lng },
                        };
                        setLocation(newPoi);
                        setData('latitude', lat);
                        setData('longitude', lng);
                    }
                }}
            >
                {location && (
                    <AdvancedMarker key={location.key} position={location.location}>
                        <Pin />
                    </AdvancedMarker>
                )}
                <MapControl position={ControlPosition.TOP_LEFT}>
                    <MapPlaceAutocomplete onPlaceSelect={setSelectedPlace} inputRef={searchInputRef} />
                </MapControl>
            </Map>

            <Separator className="my-8" />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <TextInput
                    value={String(data.latitude)}
                    onChange={(value) => setData('latitude', Number(value))}
                    label="Latitude"
                    placeholder="Contoh: 3.595226750097991"
                    errors={errors.latitude}
                    autoComplete="latitude"
                />

                <TextInput
                    value={String(data.longitude)}
                    onChange={(value) => setData('longitude', Number(value))}
                    label="Longitude"
                    placeholder="Contoh: 98.67200113297093"
                    errors={errors.longitude}
                    autoComplete="longitude"
                />
            </div>

            <div className="mt-4 flex items-center gap-4">
                <Button type="button" variant="secondary" onClick={addMarker}>
                    Tambah Marker
                </Button>
                <Button type="button" variant="secondary" onClick={resetMarker}>
                    Reset Marker
                </Button>
            </div>

            <div className="mt-6 flex w-full items-center justify-end gap-4">
                <Button type="button" variant="secondary" onClick={handleCancel}>
                    Batal
                </Button>
                <Button loading={processing}>Simpan</Button>
                <Transition
                    show={recentlySuccessful}
                    enter="transition ease-in-out"
                    enterFrom="opacity-0"
                    leave="transition ease-in-out"
                    leaveTo="opacity-0"
                >
                    <p className="text-sm text-neutral-600">Saved</p>
                </Transition>
            </div>
        </form>
    );
};
export default CreateLocationForm;
