import NextAuth from 'next-auth/next';

// for raisins this needs to reside in a separate file, I think
import { config } from '@/src/auth';

const handler = NextAuth(config);

export { handler as GET, handler as POST };
