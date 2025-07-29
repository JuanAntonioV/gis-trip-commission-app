import { DataTable } from '@/components/DataTable';
import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { columns as deliveryColumns } from './deliveries/columns';
import { columns as tripColumns } from './trips/columns';

export default function Dashboard() {
    return (
        <AppLayout>
            <Head title="Dashboard" />

            <main className="space-y-6 p-6">
                <header>
                    <Heading
                        title="Selamat datang di PT. Kencana Abadi Sukses"
                        description="Aplikasi ini digunakan untuk mengelola data perjalanan dan komisi driver."
                    />
                    {/* <Heading
                        title="Selamat datang di PT. Kencana Abadi Sukses"
                        description="Dashboard ini memberikan ringkasan informasi penting terkait pengiriman dan trip."
                    /> */}
                </header>

                <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <Card className="p-4">
                        <CardContent className="space-y-2 px-0">
                            <p className="text-xs text-gray-400">Total Pengiriman</p>
                            <div className="text-2xl font-bold">0</div>
                        </CardContent>
                    </Card>
                    <Card className="p-4">
                        <CardContent className="space-y-2 px-0">
                            <p className="text-xs text-gray-400">Total Kendaraan Aktif</p>
                            <div className="text-2xl font-bold">0</div>
                        </CardContent>
                    </Card>
                    <Card className="p-4">
                        <CardContent className="space-y-2 px-0">
                            <p className="text-xs text-gray-400">Total Trip Belum Selesai</p>
                            <div className="text-2xl font-bold">0</div>
                        </CardContent>
                    </Card>
                    <Card className="p-4">
                        <CardContent className="space-y-2 px-0">
                            <p className="text-xs text-gray-400">Total Trip Selesai</p>
                            <div className="text-2xl font-bold">0</div>
                        </CardContent>
                    </Card>
                </section>

                <section className="section">
                    <HeadingSmall title="Pengiriman Terakhir" description="Daftar pengiriman terakhir yang telah dibuat." />
                    <Separator className="my-4" />
                    <DataTable data={[]} columns={deliveryColumns} />
                </section>
                <section className="section">
                    <HeadingSmall title="Trip Terakhir" description="Daftar trip terakhir yang telah dibuat." />
                    <Separator className="my-4" />
                    <DataTable data={[]} columns={tripColumns} />
                </section>
                {/* <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <Card className="p-4">
                        <CardContent className="space-y-2 px-0">
                            <p className="text-xs text-gray-400">Total Pengiriman Hari Ini</p>
                            <div className="text-2xl font-bold">0</div>
                        </CardContent>
                    </Card>
                    <Card className="p-4">
                        <CardContent className="space-y-2 px-0">
                            <p className="text-xs text-gray-400">Total Waktu Tercepat</p>
                            <div className="text-2xl font-bold">
                                0 <span className="text-sm font-normal text-gray-400">Jam</span> 0{' '}
                                <span className="text-sm font-normal text-gray-400">Menit</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="p-4">
                        <CardContent className="space-y-2 px-0">
                            <p className="text-xs text-gray-400">Total Trip Belum Selesai</p>
                            <div className="text-2xl font-bold">0</div>
                        </CardContent>
                    </Card>
                    <Card className="p-4">
                        <CardContent className="space-y-2 px-0">
                            <p className="text-xs text-gray-400">Total Trip Selesai</p>
                            <div className="text-2xl font-bold">0</div>
                        </CardContent>
                    </Card>
                </section> */}

                {/* <section className="section">
                    <HeadingSmall title="Pengiriman Saat Ini" description="Daftar pengiriman saat ini yang sedang berlangsung." />
                    <Separator className="my-4" />
                    <DataTable data={[]} columns={deliveryColumns} />
                </section>
                <section className="section">
                    <HeadingSmall title="Trip Terakhir" description="Daftar trip terakhir yang telah dibuat." />
                    <Separator className="my-4" />
                    <DataTable data={[]} columns={tripColumns} />
                </section> */}
            </main>
        </AppLayout>
    );
}
