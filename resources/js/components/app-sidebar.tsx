import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Auth, User, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Car, ChartNoAxesCombined, LayoutGrid, LocateFixed, Map, Truck, Users, Warehouse } from 'lucide-react';
import AppLogo from './app-logo';
import { useMemo } from 'react';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
        role: ['super admin', 'admin', 'driver','helper'],
    },
    {
        title: 'Kelola Kendaraan',
        href: '/kelola-kendaraan',
        icon: Car,
        role: ['super admin', 'admin'],
    },
    {
        title: 'Kelola Lokasi',
        href: '/kelola-lokasi',
        icon: Warehouse,
        role: ['super admin', 'admin'],
    },
    {
        title: 'Kelola Pengiriman',
        href: '/kelola-pengiriman',
        icon: Truck,
        role: ['super admin', 'admin'],
    },
    {
        title: 'Kelola Trip Pengiriman',
        href: '/kelola-trips',
        icon: Map,
        role: ['super admin', 'admin'],
    },
    {
        title: 'Kelola Tipe Lokasi',
        href: '/kelola-tipe-lokasi',
        icon: LocateFixed,
        role: ['super admin', 'admin'],
    },
    {
        title: 'Kelola Karyawan',
        href: '/kelola-karyawan',
        icon: Users,
        role: ['super admin', 'admin'],
    },
    {
        title: 'Laporan Komisi',
        href: '/laporan-komisi',
        icon: ChartNoAxesCombined,
        role: ['super admin', 'admin'],
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const serverProps = usePage().props;
    const user = (serverProps.auth as Auth)?.user;
    console.log('user', user);
    const roles = (user as User)?.roles?.map(role => role.name) || [];

    const filteredMainNavItems = useMemo(() => {
        return mainNavItems.filter(item => roles.some(role => item.role?.includes(role)));
    }, [roles]);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredMainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
