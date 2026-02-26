import type { User } from "../../../entities/accounts/User";

export type LoginResponse = {
    accessToken: string;
    refreshToken: string;
    user: User;
}