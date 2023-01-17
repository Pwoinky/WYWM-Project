import * as mongodb from "mongodb";

export interface Users {
    _id?: mongodb.ObjectId;
    name: string;
    email: string;
    password: string;
    role: string;
}