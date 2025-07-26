import AppLayout from '@/layouts/app-layout';
import { LocationType } from '@/types';

type Props = {
    location: Location;
    locationTypes: LocationType[];
};

const LocationDetailPage = ({ location, locationTypes }: Props) => {
    return (
        <AppLayout>
            <pre>{JSON.stringify(location, null, 2)}</pre>
        </AppLayout>
    );
};
export default LocationDetailPage;
