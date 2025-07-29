import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import TextareaInput from './ui/TextareaInput';
import TextInput from './ui/TextInput';

type FormType = {
    name: string;
    description?: string;
};

const AddLocationTypeFormModal = () => {
    const [open, setOpen] = useState(false);

    const { data, setData, post, errors, processing, recentlySuccessful, resetAndClearErrors } = useForm<Required<FormType>>({
        name: '',
        description: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('location-types.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                toast.success('Tipe lokasi berhasil ditambahkan');
                resetAndClearErrors();
            },
            onError: () => {
                toast.error('Gagal menambahkan tipe lokasi');
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={'secondary'}>
                    <Plus />
                    Buat baru
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Buat Tipe Lokasi</DialogTitle>
                    <DialogDescription>Isi form di bawah ini untuk menambahkan tipe lokasi baru.</DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4">
                    <TextInput
                        value={data.name}
                        onChange={(value) => setData('name', value as string)}
                        label="Nama Tipe Lokasi"
                        placeholder="Contoh: SPBU, Rest Area, dll."
                        errors={errors.name}
                        autoComplete="name"
                    />

                    <TextareaInput
                        value={data.description}
                        onChange={(value) => setData('description', value as string)}
                        label="Keterangan"
                        placeholder="Keterangan tipe lokasi"
                        errors={errors.description}
                        autoComplete="description"
                    />

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
export default AddLocationTypeFormModal;
