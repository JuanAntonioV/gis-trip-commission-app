import { BreadcrumbItem } from '@/types';
import { Updater } from '@tanstack/react-table';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function valueUpdater<T extends Updater<any>>(updater: T, state: any, setState: (value: any) => void) {
    const newValue = updater instanceof Function ? updater(state) : updater;
    setState(newValue);
}

export function onlyNumber(e: React.ChangeEvent<HTMLInputElement>) {
    // Allow only digits and dashes
    e.target.value = e.target.value.replace(/\D/g, ''); // Hanya izinkan angka
}
export function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
    const cleanPathname = pathname.split('?')[0]; // Remove query parameters
    const parts = cleanPathname.split('/').filter((part) => part !== '');
    return parts.map((part, index) => ({
        title: part.replace(/[-_]/g, ' '), // Replace dashes or underscores with spaces
        href: '/' + parts.slice(0, index + 1).join('/'), // Construct the href for each breadcrumb
    }));
}

export function formatNumber(value: number, locale: string = 'id-ID'): string {
    return new Intl.NumberFormat(locale).format(value);
}
