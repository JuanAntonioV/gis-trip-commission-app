import { router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
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

type Props = {
    tripStopId: number;
    deliveryId: string; // Optional delivery ID for context
};

type FormType = {
    trip_stop_id: number;
};

const CancelTripStopButton = ({ tripStopId, deliveryId }: Props) => {
    const errors = usePage().props.errors; // Get errors from the form
    console.log('🚀 ~ CancelTripStopButton ~ errors:', errors);

    const {
        post: cancelTripStop,
        processing,
        resetAndClearErrors,
    } = useForm<Required<FormType>>({
        trip_stop_id: tripStopId,
    });
    const [open, setOpen] = useState(false);

    const handleCancelTripStop = () => {
        cancelTripStop(route('trip-stops.cancel'), {
            preserveScroll: true,
            onSuccess: () => {
                // Handle success, e.g., show a toast notification
                toast.success('Pengiriman berhasil dibatalkan');
                if (deliveryId) {
                    router.visit(route('deliveries.showMaps', deliveryId));
                } else {
                    router.visit(route('dashboard'));
                }
                resetAndClearErrors(); // Reset form data and errors
                setOpen(false);
            },
            onError: (err) => {
                console.log('🚀 ~ handleCancelDelivery ~ err:', err);
                // Handle error, e.g., show a toast notification
                toast.error(err.message || 'Pengiriman gagal dibatalkan');
            },
        });
    };
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant={'outline'} className="w-full">
                    Batalkan
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[420px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Batalkan Pengiriman?</AlertDialogTitle>
                    <AlertDescription className="text-xs">
                        Apakah Anda yakin ingin membatalkan pemberhentian trip ini? Tindakan ini tidak dapat dibatalkan.
                    </AlertDescription>

                    {(errors as any)?.message && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription className="text-xs">{(errors as any).message}</AlertDescription>
                        </Alert>
                    )}
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4">
                    <AlertDialogCancel>Kembali</AlertDialogCancel>
                    <Button variant={'destructive'} onClick={handleCancelTripStop} loading={processing}>
                        Batalkan
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
export default CancelTripStopButton;
