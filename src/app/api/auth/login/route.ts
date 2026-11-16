import { NextRequest, NextResponse } from 'next/server';
import { loginRequestSchema } from '@/modules/auth/auth.dto';
import { POST as loginPOST } from '@/modules/auth/auth.controller';

/** Controller REST: POST /api/auth/login — delega ao controller do módulo auth. */
export async function POST(request: NextRequest) {
  return loginPOST(request);
}

// Reexporta o schema para documentar o contrato do endpoint.
export { loginRequestSchema };
