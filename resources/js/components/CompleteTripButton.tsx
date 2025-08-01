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
import TextareaInput from './ui/TextareaInput';

type Props = {
    id: number; // Assuming delivery ID is a number
    currentLocation: {
        latitude: string;
        longitude: string;
    };
};

type FormType = {
    trip_id: number;
    notes: string;
    ending_km: number;
    latitude: string;
    longitude: string;
};

const CompleteTripButton = ({ id, currentLocation }: Props) => {
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
        trip_id: id,
        notes: '',
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
        cancelDelivery(route('trips.complete'), {
            preserveScroll: true,
            onSuccess: () => {
                // Handle success, e.g., show a toast notification
                toast.success('Pengiriman berhasil diselesaikan');
                resetAndClearErrors(); // Reset form data and errors
                setOpen(false);
                router.visit(route('dashboard'));
            },
            onError: (err) => {
                console.log('🚀 ~ handleCompleteDelivery ~ err:', err);
                // Handle error, e.g., show a toast notification
                toast.error(err.message || 'Pengiriman gagal diselesaikan');
            },
        });
    };
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button className="w-full bg-green-500 py-4 transition-colors hover:bg-green-600">
                    <CheckCircle />
                    Selesai
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

                            <TextareaInput
                                label="Keterangan"
                                placeholder="Masukkan keterangan "
                                value={data.notes}
                                onChange={(value) => setData('notes', value)}
                                errors={formErrors.notes}
                                rows={3}
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
export default CompleteTripButton;
