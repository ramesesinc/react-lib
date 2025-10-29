'use server';

import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { AES } from '../common/utils';

const SESSION_KEY = "MDQyNjZiZGY2NmRjNjcwNGMzYTQ5YjJkMDM1YTA3MGQvM2Y3OTJmMjRiZGQyOTlmMWMxNjNmMjM1OGZiMTMwZjk="; 

export type TokenData = {
  SESSIONID: string, 
  USERID: string; 
  USERNAME: string; 
  FULLNAME: string;
};

export async function createSessionToken( data: TokenData ): Promise<string> {
  return jwt.sign( data, SESSION_KEY, { expiresIn: '1d' }); 
}

export async function verifySessionToken( token: string ): Promise<TokenData | null> {
  try {
    const decoded = jwt.verify(token, SESSION_KEY);
    return decoded as TokenData;
  } 
  catch (err) {
    console.error('Failed to verify session token: ', err);
    return null;
  }
}

export async function fetchSessionId(): Promise<string | null> {
  const sessionId = (await cookies()).get('session')?.value ?? null;
  return sessionId;
}

export async function saveSessionId( sessionid: string ): Promise<void> {
  (await cookies()).set("session", sessionid, {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearSessionId(): Promise<void> {
  (await cookies()).set('session', '', {
    path: '/',
    httpOnly: true,
    maxAge: 0, // expires immediately
    secure: process.env.NODE_ENV === 'production',
  });
}

export async function buildSessionHeader(): Promise<Record<string, any>> {
  const key = 'x-session-token';
  const headers = { [key]: '' };
  try {
    const token = await fetchSessionId();
    if (token == null || token.trim() === "") {
      return headers;
    }

    const data = await verifySessionToken(token);
    if (data == null) return headers;

    headers[key] = AES.encrypt(data);
    return headers;
  }
  catch (err) {
    return headers;
  }
}
