import { useForm } from '@inertiajs/react';
import { CheckCircle, LocateFixed } from 'lucide-react';
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
import TextInput from './ui/TextInput';

type Props = {
    deliveryId: string;
    currentLocation: {
        latitude: string;
        longitude: string;
    };
};

type FormType = {
    delivery_id: string;
    notes: string;
    destination_name: string;
    starting_km: number;
    latitude: string;
    longitude: string;
};

const CreateTripStopButton = ({ deliveryId, currentLocation }: Props) => {
    const errors = useForm().errors; // Get errors from the form
    console.log('🚀 ~ CompleteTripButton ~ errors:', errors);

    const {
        data,
        setData,
        post: startDelivery,
        processing,
        resetAndClearErrors,
        errors: formErrors,
    } = useForm<Required<FormType>>({
        delivery_id: deliveryId,
        destination_name: '',
        notes: '',
        starting_km: 0,
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
        startDelivery(route('trip-stops.start'), {
            preserveScroll: true,
            onSuccess: () => {
                // Handle success, e.g., show a toast notification
                toast.success('Pengiriman berhasil diselesaikan');
                resetAndClearErrors(); // Reset form data and errors
                setOpen(false);
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
                <Button className="w-full bg-emerald-500 py-4 transition-colors hover:bg-emerald-600" type="button">
                    <LocateFixed />
                    Tujuan Lain
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[420px]">
                <form onSubmit={handleSubmit}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Tambah Tujuan?</AlertDialogTitle>

                        {(errors as any)?.message && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription className="text-xs">{(errors as any).message}</AlertDescription>
                            </Alert>
                        )}

                        <div className="mt-5 space-y-4">
                            <TextInput
                                label="Nama Tujuan"
                                value={data.destination_name}
                                onChange={(value) => setData('destination_name', value)}
                                errors={formErrors.destination_name}
                                placeholder="Masukkan nama tujuan"
                                required
                            />

                            <NumberInput
                                label="Kilometer kendaraan"
                                value={data.starting_km}
                                onChange={(value) => setData('starting_km', value)}
                                errors={formErrors.starting_km}
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
                            Simpan
                        </Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
};
export default CreateTripStopButton;
