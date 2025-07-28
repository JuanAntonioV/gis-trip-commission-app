import { User } from '@/types';
import { Transition } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';
import TextInput from '../ui/TextInput';
import { Button } from '../ui/button';

type FormType = {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
};

const ChangeEmployeePasswordForm = () => {
    const serverProps = usePage().props;
    const employee = (serverProps.employee as User) || null;

    const { data, setData, put, errors, processing, recentlySuccessful, resetAndClearErrors } = useForm<Required<FormType>>({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('employees.change-password', employee.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Kata sandi berhasil diubah');
                resetAndClearErrors();
            },
            onError: () => {
                toast.error('Gagal mengubah kata sandi');
            },
        });
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <TextInput
                label="Kata Sandi Saat Ini"
                type="password"
                placeholder="Masukkan kata sandi saat ini"
                value={data.current_password}
                onChange={(value) => setData('current_password', value)}
                errors={errors.current_password}
            />
            <TextInput
                label="Kata Sandi Baru"
                type="password"
                placeholder="Masukkan kata sandi baru"
                value={data.new_password}
                onChange={(value) => setData('new_password', value)}
                errors={errors.new_password}
            />
            <TextInput
                label="Konfirmasi Kata Sandi Baru"
                type="password"
                placeholder="Konfirmasi kata sandi baru"
                value={data.new_password_confirmation}
                onChange={(value) => setData('new_password_confirmation', value)}
                errors={errors.new_password_confirmation}
            />

            <div className="mt-6 flex w-full items-center justify-start gap-4">
                <Button loading={processing}>Ubah Kata Sandi</Button>
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
export default ChangeEmployeePasswordForm;
