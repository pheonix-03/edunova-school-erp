import { NextResponse } from 'next/server';
import { getCurrentUserFromCookie } from '@/lib/auth';
import { ROLE_PERMISSIONS, Role } from '@/lib/rbac';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getCurrentUserFromCookie();

    if (!session || !session.user) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 }
      );
    }

    const permissions = ROLE_PERMISSIONS[session.user.role as Role] || [];

    return NextResponse.json({
      authenticated: true,
      user: session.user,
      profile: session.profile,
      permissions,
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Session verification failed' },
      { status: 500 }
    );
  }
}
