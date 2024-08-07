export type LoginResponse = {
    access_token: string,
    user: {
        name: string;
        role: {
            id: number;
            name: string;
        };
    }
}