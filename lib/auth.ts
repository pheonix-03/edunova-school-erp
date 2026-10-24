import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import prisma from './prisma';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'edunova-school-erp-secure-jwt-secret-key-2026'
);

export const COOKIE_NAME = 'edunova_school_session';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  name?: string;
  entityId?: string; // studentId or teacherId or parentId
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch (err) {
    return null;
  }
}

export async function getCurrentUserFromCookie(): Promise<{
  user: any;
  profile: any;
} | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload || !payload.userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        teacher: {
          include: {
            managedClass: true,
          },
        },
        parent: {
          include: {
            students: {
              include: {
                gradeClass: true,
              },
            },
          },
        },
        student: {
          include: {
            gradeClass: true,
            parent: true,
          },
        },
      },
    });

    if (!user) return null;

    const profile = user.teacher || user.parent || user.student || {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        avatar: user.avatar,
      },
      profile,
    };
  } catch (error) {
    console.error('Error verifying user session:', error);
    return null;
  }
}
