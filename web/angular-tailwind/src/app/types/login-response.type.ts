export type LoginResponse = {
    access_token: string,
    user: {
        id: number;
        name: string;
        last_name: string;
        email: string;
        role: {
            id: number;
            name: string;
        };
    }
}