import { DataTable } from '@/components/DataTable';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Location, LocationType } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { columns } from './columns';

type Props = {
    locations: Location[];
    locationTypes: LocationType[];
};
const ManageLocationPage = ({ locations }: Props) => {
    console.log('🚀 ~ ManageLocationPage ~ locations:', locations);
    return (
        <AppLayout>
            <Head title="Kelola Lokasi" />

            <main className="p-6">
                <Heading title="Kelola Lokasi" description="Kelola lokasi yang tersedia untuk perjalanan." />
                <section className="section">
                    <DataTable
                        data={locations}
                        columns={columns}
                        leftHeaderSection={
                            <Button variant={'secondary'} asChild>
                                <Link href={route('locations.create')} className="flex items-center gap-2">
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
export default ManageLocationPage;
