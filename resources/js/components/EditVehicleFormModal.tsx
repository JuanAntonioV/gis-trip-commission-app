import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Vehicle } from '@/types';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';
import NumberInput from './ui/NumberInput';
import TextInput from './ui/TextInput';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

type Props = {
    initialData: Vehicle;
};

type VehicleForm = {
    name: string;
    type: string;
    license_plate: string;
    capacity: number;
    available: boolean;
};

const EditVehicleFormModal = ({ initialData }: Props) => {
    const [open, setOpen] = useState(false);

    const { data, setData, put, errors, processing, recentlySuccessful } = useForm<Required<VehicleForm>>({
        name: initialData.name,
        type: initialData.type,
        license_plate: initialData.license_plate,
        capacity: initialData.capacity,
        available: initialData.available,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('vehicles.update', initialData.id), {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                toast.success('Kendaraan berhasil diperbarui');
            },
            onError: () => {
                toast.error('Gagal memperbarui kendaraan');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" size={'icon'}>
                    <Pencil />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ubah kendaraan</DialogTitle>
                    <DialogDescription>Isi form di bawah ini untuk memperbarui kendaraan.</DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4">
                    <TextInput
                        value={data.name}
                        onChange={(value) => setData('name', value as string)}
                        label="Nama Kendaraan"
                        placeholder="Contoh: Toyota Avanza"
                        errors={errors.name}
                        autoComplete="name"
                    />

                    <TextInput
                        value={data.type}
                        onChange={(value) => setData('type', value as string)}
                        label="Tipe Kendaraan"
                        placeholder="Contoh: SUV, Sedan, dll"
                        errors={errors.type}
                    />
                    <TextInput
                        value={data.license_plate}
                        onChange={(value) => setData('license_plate', value as string)}
                        label="Plat Nomor"
                        placeholder="Contoh: B 1234 CD"
                        errors={errors.license_plate}
                    />

                    <NumberInput
                        value={data.capacity}
                        onChange={(value) => setData('capacity', value as number)}
                        label="Kapasitas"
                        placeholder="Kapasitas kendaraan"
                        errors={errors.capacity}
                    />

                    <div className="mt-5 flex items-center space-x-3">
                        <Checkbox
                            id="available"
                            name="available"
                            checked={data.available || false}
                            onClick={() => setData('available', !data.available)}
                            tabIndex={3}
                            className="size-5"
                        />
                        <Label htmlFor="available" className="cursor-pointer">
                            Tersedia
                        </Label>
                    </div>

                    <div className="mt-6 flex w-full items-center justify-end gap-4">
                        <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                            Batal
                        </Button>
                        <Button loading={processing}>Simpan</Button>
                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-neutral-600">Saved</p>
                        </Transition>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
export default EditVehicleFormModal;
