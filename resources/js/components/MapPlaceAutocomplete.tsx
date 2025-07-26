import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { Input } from './ui/input';

interface Props {
    onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
    inputRef?: React.RefObject<HTMLInputElement | null>;
}

const MapPlaceAutocomplete = ({ onPlaceSelect, inputRef }: Props) => {
    const [placeAutocomplete, setPlaceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const places = useMapsLibrary('places');

    useEffect(() => {
        if (!places || !inputRef?.current) return;

        const options = {
            fields: ['geometry', 'name', 'formatted_address'],
        };

        setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
    }, [places]);

    useEffect(() => {
        if (!placeAutocomplete) return;

        placeAutocomplete.addListener('place_changed', () => {
            onPlaceSelect(placeAutocomplete.getPlace());
        });
    }, [onPlaceSelect, placeAutocomplete]);

    return (
        <div className="mt-4 ml-4 w-full">
            <Input
                placeholder="Cari lokasi..."
                ref={inputRef}
                className="w-full max-w-96 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400"
                type="text"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                inputMode="search"
                aria-label="Cari lokasi"
                aria-autocomplete="list"
                aria-haspopup="true"
                aria-expanded="false"
                aria-controls="autocomplete-list"
                aria-activedescendant="autocomplete-active"
                role="combobox"
                onFocus={() => {
                    if (placeAutocomplete) {
                        placeAutocomplete.setFields(['geometry', 'name', 'formatted_address']);
                    }
                }}
            />
        </div>
    );
};

export default MapPlaceAutocomplete;
