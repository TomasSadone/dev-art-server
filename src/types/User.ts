export type UserRole = 'client' | 'admin';

export type User = {
    username: string;
    id: number;
    password: string;
    role: UserRole;
};
