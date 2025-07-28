import { Location, User, Vehicle } from '@/types';
import { Transition } from '@headlessui/react';
import { router, useForm, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';
import HeadingSmall from '../heading-small';
import SelectInput from '../SelectInput';
import { Button } from '../ui/button';
import DatePickerInput from '../ui/datepicker-input';
import NumberInput from '../ui/NumberInput';
import { Separator } from '../ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import TextInput from '../ui/TextInput';

type FormType = {
    vehicle_id: number;
    driver_id: number;
    helper_id: number;
    scheduled_at: Date | null;
    items: {
        location_id: number;
        invoice_number: string | null;
        weight: number;
    }[];
};

const CreateDeliveryForm = () => {
    const serverProps = usePage().props;
    const vehicles = serverProps?.vehicles as Vehicle[];
    const drivers = serverProps?.drivers as User[];
    const helpers = serverProps?.helpers as User[];
    const locations = serverProps?.locations as Location[];

    const { data, setData, post, errors, processing, recentlySuccessful, resetAndClearErrors } = useForm<Required<FormType>>({
        vehicle_id: 0,
        driver_id: 0,
        helper_id: 0,
        scheduled_at: dayjs().add(1, 'day').toDate() as Date | null,
        items: [
            {
                location_id: 0,
                invoice_number: '',
                weight: 0,
            },
        ],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('deliveries.store'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Pengiriman berhasil dibuat');
                resetAndClearErrors();
            },
            onError: () => {
                toast.error('Gagal menambahkan lokasi');
            },
        });
    };

    const handleCancel = () => {
        resetAndClearErrors();
        router.visit(route('deliveries.index'));
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <SelectInput
                value={data.vehicle_id ? String(data.vehicle_id) : ''}
                onChange={(value) => setData('vehicle_id', Number(value))}
                label="Tipe Kendaraan"
                placeholder="Pilih tipe kendaraan"
                errors={errors.vehicle_id}
                data={vehicles.map((vehicle) => ({ value: String(vehicle.id), label: `${vehicle.name} (${vehicle.license_plate})` }))}
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <SelectInput
                    value={data.driver_id ? String(data.driver_id) : ''}
                    onChange={(value) => setData('driver_id', Number(value))}
                    label="Pengemudi"
                    placeholder="Pilih pengemudi"
                    errors={errors.driver_id}
                    data={drivers.map((driver) => ({ value: String(driver.id), label: driver.name })) || []}
                />
                <SelectInput
                    value={data.helper_id ? String(data.helper_id) : ''}
                    onChange={(value) => setData('helper_id', Number(value))}
                    label="Helper"
                    placeholder="Pilih helper"
                    errors={errors.helper_id}
                    data={helpers.map((driver) => ({ value: String(driver.id), label: driver.name })) || []}
                />
            </div>

            <DatePickerInput
                label="Jadwal Pengiriman"
                value={data.scheduled_at ? dayjs(data.scheduled_at).toDate() : undefined}
                onChange={(date) => setData('scheduled_at', date ? dayjs(date).toDate() : null)}
                errors={errors.scheduled_at}
            />

            <Separator className="my-6" />

            <HeadingSmall title="Daftar Lokasi" description="Tambahkan lokasi pengiriman yang akan dikirimkan" />

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-16">Aksi</TableHead>
                        <TableHead>Lokasi</TableHead>
                        <TableHead>Invoice Number</TableHead>
                        <TableHead>Berat (kg)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.items.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size={'icon'}
                                    onClick={() => {
                                        const newItems = [...data.items];
                                        newItems.splice(index, 1);
                                        setData('items', newItems);
                                    }}
                                >
                                    <X className="size-4" />
                                </Button>
                            </TableCell>
                            <TableCell>
                                <SelectInput
                                    value={item.location_id ? String(item.location_id) : ''}
                                    onChange={(value) => {
                                        const newItems = [...data.items];
                                        newItems[index].location_id = Number(value);
                                        setData('items', newItems);
                                    }}
                                    placeholder="Pilih lokasi"
                                    errors={(errors.items as { location_id?: string[] })?.[index]?.location_id || ''}
                                    data={locations.map((location) => ({ value: String(location.id), label: location.name }))}
                                />
                            </TableCell>
                            <TableCell>
                                <TextInput
                                    value={item.invoice_number || ''}
                                    onChange={(value) => {
                                        const newItems = [...data.items];
                                        newItems[index].invoice_number = value as string;
                                        setData('items', newItems);
                                    }}
                                    placeholder="Masukkan nomor invoice"
                                    errors={(errors.items as { invoice_number?: string[] })?.[index]?.invoice_number || ''}
                                    autoComplete="invoice_number"
                                />
                            </TableCell>
                            <TableCell>
                                <NumberInput
                                    value={item.weight}
                                    onChange={(value) => {
                                        const newItems = [...data.items];
                                        newItems[index].weight = Number(value);
                                        setData('items', newItems);
                                    }}
                                    placeholder="Masukkan berat"
                                    errors={(errors.items as { weight?: string[] })?.[index]?.weight || ''}
                                    autoComplete="weight"
                                    min={0}
                                    step={0.1}
                                    className="w-full"
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="mt-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                        setData('items', [...data.items, { location_id: 0, invoice_number: '', weight: 0 }]);
                    }}
                >
                    Tambah Lokasi
                </Button>
            </div>

            <Separator className="my-6" />

            <div className="mt-6 flex w-full items-center justify-start gap-4">
                <Button type="button" variant="secondary" onClick={handleCancel}>
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
    );
};
export default CreateDeliveryForm;
