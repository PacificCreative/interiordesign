import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

export function successResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(error: string, status = 400): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, error }, { status });
}

export async function getAuthUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

export async function requireAuth(): Promise<string> {
  const clerkId = await getAuthUserId();
  if (!clerkId) {
    throw new Error('Unauthorized');
  }

  // Find or create the user in our database
  let user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) {
    // This would normally be handled by a webhook, but as fallback:
    const session = await auth();
    user = await prisma.user.create({
      data: {
        clerkId,
        email: session.sessionClaims?.email as string || 'unknown@spatial.app',
      },
    });
  }

  return user.id;
}

export async function getCurrentUser() {
  const clerkId = await getAuthUserId();
  if (!clerkId) return null;

  return prisma.user.findUnique({ where: { clerkId } });
}