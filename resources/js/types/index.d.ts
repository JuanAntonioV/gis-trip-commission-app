import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    phone?: string | null;
    address?: string | null;
    birth_date?: string | null; // ISO date string
    religion?: string | null;
    married?: boolean | null;
    joined_at?: string | null; // ISO date string
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export type Vehicle = {
    id: number;
    name: string;
    type: string;
    license_plate: string;
    capacity: number;
    available: boolean;
};

export type LocationType = {
    id: number;
    name: string;
    description?: string | null;
};

export type Location = {
    id: number;
    location_type_id: number;
    name: string;
    address: string;
    postal_code?: string | null;
    description?: string | null;
    latitude?: string | null; // Latitude for the location
    longitude?: string | null; // Longitude for the location
    created_at: Date;
    updated_at: Date;
    type?: LocationType; // Optional relationship to LocationType
};

interface TGeoLocation {
    loaded: boolean;
    coordinates?: {
        lat: number;
        lng: number;
    };
    error?: {
        code: number;
        message: string;
    } | null;
}

export type DeliveryStatus = {
    id: number;
    name: string;
};

export type DeliveryItem = {
    id: number;
    delivery_id: number;
    location_id: number;
    weight: number;
};

export type Delivery = {
    id: number;
    total_items: number;
    vehicle_id: number;
    driver_id: number;
    helper_id?: number | null;
    scheduled_at: string; // ISO date string
    started_at?: string | null; // ISO date string
    finished_at?: string | null; // ISO date string
    confirmed_at?: string | null; // ISO date string
    status: DeliveryStatus;
    created_by: number;
    cancelled_by?: number | null;
    cancelled_at?: string | null; // ISO date string
    cancel_reason?: string | null;
    items: DeliveryItem[];
    vehicle?: Vehicle; // Optional relationship to Vehicle
    driver?: User; // Optional relationship to User (driver)
    helper?: User | null; // Optional relationship to User (helper)
    created_by: User; // Relationship to User who created the delivery
};

export type Permission = {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
};

export type Role = {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    permissions?: Permission[]; // Optional relationship to Permissions
};
