import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
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
    id: string; // Assuming delivery ID is a string
};

type FormType = {
    delivery_id: string;
    cancel_reason: string;
};

const CancelDeliveryButton = ({ id }: Props) => {
    const {
        data,
        setData,
        post: cancelDelivery,
        processing,
        resetAndClearErrors,
    } = useForm<Required<FormType>>({
        delivery_id: id,
        cancel_reason: '',
    });
    const [open, setOpen] = useState(false);

    const handleCancelDelivery = () => {
        cancelDelivery(route('deliveries.cancel'), {
            preserveScroll: true,
            onSuccess: () => {
                // Handle success, e.g., show a toast notification
                toast.success('Pengiriman berhasil dibatalkan');
                router.reload({ only: ['delivery'] });
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
                <Button variant="destructive" className="mt-6" loading={processing}>
                    Batalkan Pengiriman
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[420px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Batalkan Pengiriman?</AlertDialogTitle>

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
export default CancelDeliveryButton;
