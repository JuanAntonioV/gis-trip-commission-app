import { DataTable } from '@/components/DataTable';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { columns } from './columns';

type Props = {
    employees: User[];
};

const ManageEmployeePage = ({ employees }: Props) => {
    return (
        <AppLayout>
            <Head title="Kelola Karyawan" />

            <main className="p-6">
                <Heading title="Kelola Karyawan" description="Halaman ini digunakan untuk mengelola data karyawan." />
                <section className="section">
                    <DataTable
                        data={employees}
                        columns={columns}
                        leftHeaderSection={
                            <Button variant={'secondary'} asChild>
                                <Link href={route('employees.create')} className="flex items-center gap-2">
                                    <Plus />
                                    Buat baru
                                </Link>
                            </Button>
                        }
                    />
                </section>
            </main>
        </AppLayout>
    );
};
export default ManageEmployeePage;
