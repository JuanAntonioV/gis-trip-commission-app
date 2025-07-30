import { APIProvider } from '@vis.gl/react-google-maps';

type Props = {
    children: React.ReactNode;
};
const GoogleMapsProvider = ({ children }: Props) => {
    return (
        <APIProvider
            apiKey={import.meta.env.VITE_GOOGLE_API_KEY}
            onLoad={() => {
                console.log('Google Maps API loaded');
            }}
        >
            {children}
        </APIProvider>
    );
};
export default GoogleMapsProvider;
