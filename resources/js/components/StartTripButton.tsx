import { useForm } from '@inertiajs/react';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from './ui/alert-dialog';
import { Button } from './ui/button';

type Props = {
    id: string; // Assuming trip ID is a string
};

const StartTripButton = ({ id }: Props) => {
    const { post: startTrip, processing } = useForm();
    const [open, setOpen] = useState(false);

    const handleStartDelivery = () => {
        startTrip(route('trips.start', id), {
            preserveScroll: true,
            onSuccess: () => {
                // Handle success, e.g., show a toast notification
                toast.success('Pengiriman berhasil dimulai');
            },
            onError: () => {
                // Handle error, e.g., show a toast notification
                toast.error('Pengiriman gagal dimulai');
                setOpen(false);
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button className="mt-12" loading={processing}>
                    <Send />
                    Mulai Pengiriman
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[420px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Mulai Pengiriman?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4">
                    <AlertDialogCancel>Kembali</AlertDialogCancel>
                    <AlertDialogAction onClick={handleStartDelivery} loading={processing}>
                        Mulai
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
export default StartTripButton;
