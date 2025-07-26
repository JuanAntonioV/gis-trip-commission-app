import { TGeoLocation } from '@/types';
import { useEffect, useState } from 'react';

type Props = {
    onError?: () => void;
};

const useGeoLocation = ({ onError }: Props = {}) => {
    const [location, setLocation] = useState<TGeoLocation>({
        loaded: false,
        coordinates: { lat: 0, lng: 0 },
        error: null,
    });

    const onSuccess = (location) => {
        setLocation({
            loaded: true,
            coordinates: {
                lat: location.coords.latitude,
                lng: location.coords.longitude,
            },
        });
    };

    const onErrorHandler = (error) => {
        if (onError) {
            onError();
        }
        setLocation({
            loaded: true,
            error: {
                code: error.code,
                message: error.message,
            },
        });
    };

    useEffect(() => {
        if (!('geolocation' in navigator)) {
            onErrorHandler({
                code: 0,
                message: 'Geolocation not supported',
            });
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onErrorHandler);
    }, []);

    return location;
};

export default useGeoLocation;
