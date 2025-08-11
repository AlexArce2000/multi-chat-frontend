import { User } from "../models/user";

export interface Room {
    id: string;
    name: string;
    public: boolean;
    creator: User;
}