import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function onlyNumber(e: React.ChangeEvent<HTMLInputElement>) {
    // Allow only digits and dashes
    e.target.value = e.target.value.replace(/\D/g, ''); // Hanya izinkan angka
}
