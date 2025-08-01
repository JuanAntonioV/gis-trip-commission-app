import { router, useForm } from '@inertiajs/react';
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
import TextareaInput from './ui/TextareaInput';

type Props = {
    id: number; // Assuming delivery ID is a number
    deliveryId?: string; // Optional delivery ID for context
};

type FormType = {
    trip_id: number;
    cancel_reason: string;
};

const CancelTripButton = ({ id, deliveryId }: Props) => {
    const errors = useForm().errors; // Get errors from the form
    console.log('🚀 ~ CancelTripButton ~ errors:', errors);

    const {
        data,
        setData,
        post: cancelDelivery,
        processing,
        resetAndClearErrors,
    } = useForm<Required<FormType>>({
        trip_id: id,
        cancel_reason: '',
    });
    const [open, setOpen] = useState(false);

    const handleCancelDelivery = () => {
        cancelDelivery(route('trips.cancel'), {
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
                <Button variant={'destructive'} className="w-full" type="button" loading={processing}>
                    Batalkan
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[420px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Batalkan Pengiriman?</AlertDialogTitle>

                    {(errors as any)?.message && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription className="text-xs">{(errors as any).message}</AlertDescription>
                        </Alert>
                    )}

                    <div className="mt-5">
                        <TextareaInput
                            label="Alasan Pembatalan"
                            placeholder="Masukkan alasan pembatalan pengiriman"
                            value={data.cancel_reason}
                            onChange={(value) => setData('cancel_reason', value)}
                            required
                        />
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4">
                    <AlertDialogCancel>Kembali</AlertDialogCancel>
                    <Button onClick={handleCancelDelivery} loading={processing}>
                        Lanjutkan
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
export default CancelTripButton;
