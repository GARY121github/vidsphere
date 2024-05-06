import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface User{
        _id? : string;
        username ?: string;
    }

    interface Session{
        user : {
            _id ?: string;
            username ?: string;
        }
    }
}

declare module 'next-auth/jwt' {
    interface JWT{
        user : {
            _id ?: string;
            username ?: string;
        }
    }
}