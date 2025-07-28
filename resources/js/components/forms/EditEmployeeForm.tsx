import { onlyNumber } from '@/lib/utils';
import { Role, User } from '@/types';
import { Transition } from '@headlessui/react';
import { router, useForm, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';
import SelectInput from '../SelectInput';
import TextInput from '../ui/TextInput';
import TextareaInput from '../ui/TextareaInput';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import DatePickerInput from '../ui/datepicker-input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';

type FormType = {
    name: string;
    email: string;
    phone: string;
    address: string;
    married: boolean;
    joined_at: Date | null;
    birth_date: Date | null;
    role_id: number | string;
};

const EditEmployeeForm = () => {
    const serverProps = usePage().props;
    const roles = serverProps?.roles as Role[];
    const employee = serverProps?.employee as User;

    const { data, setData, put, errors, processing, recentlySuccessful, resetAndClearErrors } = useForm<Required<FormType>>({
        name: employee.name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        married: employee.married || false,
        joined_at: employee.joined_at ? dayjs(employee.joined_at).toDate() : null,
        birth_date: employee.birth_date ? dayjs(employee.birth_date).toDate() : null,
        address: employee.address || '',
        role_id: employee.roles ? employee.roles[0].id : 0,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('employees.update', employee.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Karyawan berhasil diperbarui');
                resetAndClearErrors();
            },
            onError: () => {
                toast.error('Gagal memperbarui karyawan');
            },
        });
    };

    const handleCancel = () => {
        resetAndClearErrors();
        router.visit(route('employees.index'));
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <TextInput
                label="Nama Karyawan"
                placeholder="Masukkan nama karyawan"
                value={data.name}
                onChange={(value) => setData('name', value)}
                errors={errors.name}
                required
            />
            <TextInput
                label="Alamat Email"
                type="email"
                placeholder="example@mail.com"
                value={data.email}
                onChange={(value) => setData('email', value)}
                errors={errors.email}
                required
            />
            <TextInput
                label="No. Telepon"
                placeholder="Masukkan nomor telepon"
                onInput={onlyNumber}
                value={data.phone}
                onChange={(value) => setData('phone', value)}
                errors={errors.phone}
                autoComplete="tel"
                required
            />
            <TextareaInput
                label="Alamat Lengkap"
                placeholder="Masukkan alamat karyawan"
                value={data.address}
                onChange={(value) => setData('address', value)}
                errors={errors.address}
                rows={3}
            />
            <DatePickerInput
                label="Tanggal Lahir"
                value={data.birth_date ? dayjs(data.birth_date).toDate() : undefined}
                onChange={(date) => setData('birth_date', date ? dayjs(date).toDate() : null)}
                errors={errors.birth_date}
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <SelectInput
                    label="Role Karyawan"
                    placeholder="Pilih role karyawan"
                    value={data.role_id ? String(data.role_id) : ''}
                    onChange={(value) => setData('role_id', Number(value))}
                    data={roles.map((role) => ({ value: role.id?.toString(), label: role.name }))}
                    errors={errors.role_id}
                    required
                />
                <DatePickerInput
                    label="Tanggal Bergabung"
                    value={data.joined_at ? dayjs(data.joined_at).toDate() : undefined}
                    onChange={(date) => setData('joined_at', date ? dayjs(date).toDate() : null)}
                    errors={errors.joined_at}
                />
            </div>
            <div className="grid gap-2">
                <Label>Sudah Menikah?</Label>
                <div className="mt-2 flex items-center space-x-3">
                    <Checkbox
                        id="married"
                        name="married"
                        checked={data.married || false}
                        onClick={() => setData('married', !data.married)}
                        tabIndex={3}
                        className="size-5"
                    />
                    <Label htmlFor="married">Menikah</Label>
                </div>
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
export default EditEmployeeForm;
