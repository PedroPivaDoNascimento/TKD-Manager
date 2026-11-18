import { NextRequest } from 'next/server';
import { POST as loginPOST } from '@/modules/auth/auth.controller';

/** Controller REST: POST /api/auth/login — delega ao controller do módulo auth. */
export async function POST(request: NextRequest) {
  return loginPOST(request);
}
