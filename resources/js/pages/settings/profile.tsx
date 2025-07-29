import { type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import DatePickerInput from '@/components/ui/datepicker-input';
import { Label } from '@/components/ui/label';
import NumberInput from '@/components/ui/NumberInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TextareaInput from '@/components/ui/TextareaInput';
import TextInput from '@/components/ui/TextInput';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import dayjs from 'dayjs';

type ProfileForm = {
    name: string;
    email: string;
    phone: string;
    address: string;
    birth_date: Date | null;
    religion: string | null;
    married: boolean | null;
    joined_at: Date | null;
};

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.name,
        email: auth.user.email,
        phone: auth.user.phone || '',
        address: auth.user.address || '',
        birth_date: auth.user.birth_date ? dayjs(auth.user.birth_date).toDate() : null,
        religion: auth.user.religion || null,
        married: auth.user.married || null,
        joined_at: auth.user.joined_at ? dayjs(auth.user.joined_at).toDate() : null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Pengaturan profil" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Informasi profil" description="Perbarui nama dan alamat email Anda" />

                    <form onSubmit={submit} className="space-y-6">
                        <TextInput
                            value={data.name}
                            onChange={(value) => setData('name', value as string)}
                            label="Nama Lengkap"
                            placeholder="Nama lengkap Anda"
                            errors={errors.name}
                            autoComplete="name"
                        />

                        <TextInput
                            value={data.email}
                            onChange={(value) => setData('email', value as string)}
                            label="Alamat Email"
                            placeholder="example@email.com"
                            errors={errors.email}
                            type="email"
                            autoComplete="email"
                        />

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <DatePickerInput
                                label="Tanggal Lahir"
                                value={data.birth_date ? dayjs(data.birth_date).toDate() : undefined}
                                onChange={(date) => setData('birth_date', date ? dayjs(date).toDate() : null)}
                                errors={errors.birth_date}
                            />
                            <NumberInput
                                value={data.phone}
                                onChange={(value) => setData('phone', value as string)}
                                label="Nomor Telepon"
                                placeholder="0812-3456-7890"
                                errors={errors.phone}
                                autoComplete="tel"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="religion">Agama</Label>
                                <Select
                                    value={data.religion || ''}
                                    onValueChange={(value) => setData('religion', value || null)}
                                    disabled={processing}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih agama" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'].map((religion) => (
                                            <SelectItem key={religion} value={religion}>
                                                {religion}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <InputError className="mt-2" message={errors.religion} />
                            </div>

                            <div className="mt-5 flex items-center space-x-3">
                                <Checkbox
                                    id="married"
                                    name="married"
                                    checked={data.married || false}
                                    onClick={() => setData('married', !data.married)}
                                    tabIndex={3}
                                    className="size-5"
                                />
                                <Label htmlFor="married" className="cursor-pointer">
                                    Sudah menikah
                                </Label>
                            </div>
                        </div>

                        <TextareaInput
                            value={data.address}
                            onChange={(value) => setData('address', value as string)}
                            label="Alamat Lengkap"
                            placeholder="Alamat lengkap Anda"
                            errors={errors.address}
                            rows={3}
                        />

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="-mt-4 text-sm text-muted-foreground">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Save</Button>

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
                </div>

                {/* <DeleteUser /> */}
            </SettingsLayout>
        </AppLayout>
    );
}
