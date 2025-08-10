import { User } from "../models/user";

export interface Room {
    id: string;
    name: string;
    isPublic: boolean;
    creator: User;
}