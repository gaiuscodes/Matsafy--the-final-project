// app/api/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

// Export handlers for all HTTP methods that NextAuth supports
export const GET = handler;
export const POST = handler;