import { router, useForm } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from './ui/alert';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import NumberInput from './ui/NumberInput';

type Props = {
    tripStopId: number; // Assuming trip stop ID is a number
    deliveryId: string; // Assuming delivery ID is a string
    currentLocation: {
        latitude: string;
        longitude: string;
    };
};

type FormType = {
    trip_stop_id: number;
    ending_km: number;

    latitude: string;
    longitude: string;
};

const CompleteTripStopButton = ({ tripStopId, deliveryId, currentLocation }: Props) => {
    const errors = useForm().errors; // Get errors from the form
    console.log('🚀 ~ CompleteTripButton ~ errors:', errors);

    const {
        data,
        setData,
        post: cancelDelivery,
        processing,
        resetAndClearErrors,
        errors: formErrors,
    } = useForm<Required<FormType>>({
        trip_stop_id: tripStopId,
        ending_km: 0,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
    });

    useEffect(() => {
        if (currentLocation.latitude && currentLocation.longitude) {
            setData('latitude', currentLocation.latitude);
            setData('longitude', currentLocation.longitude);
        }
    }, [currentLocation]);

    const [open, setOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        cancelDelivery(route('trip-stops.complete'), {
            preserveScroll: true,
            onSuccess: () => {
                // Handle success, e.g., show a toast notification
                toast.success('Pemberhentian trip berhasil diselesaikan');
                resetAndClearErrors(); // Reset form data and errors
                setOpen(false);
                if (deliveryId) {
                    router.visit(route('deliveries.showMaps', deliveryId));
                } else {
                    router.visit(route('dashboard'));
                }
            },
            onError: (err) => {
                console.log('🚀 ~ handleCompleteDelivery ~ err:', err);
                // Handle error, e.g., show a toast notification
                toast.error(err.message || 'Pemberhentian trip gagal diselesaikan');
            },
        });
    };
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button className="w-full bg-green-500 hover:bg-green-600">
                    <CheckCircle />
                    Selesaikan
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[420px]">
                <form onSubmit={handleSubmit}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Selesaikan Pengiriman?</AlertDialogTitle>

                        {(errors as any)?.message && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription className="text-xs">{(errors as any).message}</AlertDescription>
                            </Alert>
                        )}

                        <div className="mt-5 space-y-4">
                            <NumberInput
                                label="Kilometer kendaraan"
                                value={data.ending_km}
                                onChange={(value) => setData('ending_km', value)}
                                errors={formErrors.ending_km}
                                placeholder="Masukkan kilometer kendaraan"
                                min={0}
                                required
                            />
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel>Kembali</AlertDialogCancel>
                        <Button type="submit" loading={processing} className="bg-green-500 hover:bg-green-600">
                            <CheckCircle />
                            Selesaikan
                        </Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
};
export default CompleteTripStopButton;
