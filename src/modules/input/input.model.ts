import { User } from "../user/user.model";

export interface MessageSentEventPayload {
    date: Date;
    message: string;
    file?: File;
}