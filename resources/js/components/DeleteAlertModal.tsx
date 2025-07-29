import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

type Props = {
    id: string | number;
    routeKey: string;
    title?: string;
    description?: string;
    onSuccess?: () => void;
    onError?: () => void;
};

const DeleteAlertModal = ({ id, routeKey, title, description, onSuccess, onError }: Props) => {
    const [open, setOpen] = useState(false);
    const { delete: deleteRecord, processing } = useForm();

    const handleDelete = () => {
        deleteRecord(route(routeKey, id), {
            preserveScroll: true,
            onSuccess: () => {
                // Handle success, e.g., show a toast notification
                toast.success('Data berhasil dihapus');
                onSuccess?.();
            },
            onError: () => {
                // Handle error, e.g., show a toast notification
                toast.error('Data gagal dihapus');
                onError?.();
                setOpen(false);
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="secondary" size="icon" className="ml-2" onClick={() => setOpen(true)}>
                    <Trash2 className="text-red-500" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[420px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>{title || 'Hapus Data Ini?'}</AlertDialogTitle>
                    <AlertDialogDescription>{description || 'Apakah Anda yakin ingin menghapus data ini?'}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4">
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} loading={processing}>
                        {' '}
                        Hapus{' '}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
export default DeleteAlertModal;
