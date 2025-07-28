import { User } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';

const DeleteEmployeeButton = () => {
    const serverProps = usePage().props;
    const data = (serverProps.employee as User) || null;

    const { delete: deleteRecord, processing } = useForm();

    const handleDelete = () => {
        deleteRecord(route('employees.destroy', data.id), {
            preserveScroll: true,
            onSuccess: () => {
                // Handle success, e.g., show a toast notification
                toast.success('Data berhasil dihapus');
            },
            onError: () => {
                // Handle error, e.g., show a toast notification
                toast.error('Data gagal dihapus');
            },
        });
    };

    return (
        <Button variant="destructive" size={'lg'} className="w-full" onClick={handleDelete} loading={processing}>
            <Trash2 />
            Delete Employee
        </Button>
    );
};
export default DeleteEmployeeButton;
