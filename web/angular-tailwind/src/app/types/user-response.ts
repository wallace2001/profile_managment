export type UserResponse = {
    user: User;
}

export type Role = {
    name: string;
    id: number;
};

export type User = {
    id: number | null;
    name: string;
    last_name: string;
    email: string;
    email_verified_at?: boolean;
    created_at?: string;
    updated_at?: string;
    roles: Role[]
}

export type UserRequest = {
    name: string;
    last_name: string;
    email: string;
    password: string;
    role: string;
}

export type UserFormatted = {
    id: number | null;
    name: string;
    lastName: string;
    email: string;
    emailVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;
    role: Role;
    password?: string;
}