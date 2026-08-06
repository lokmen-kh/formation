import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/middleware/withAuth';
import { withRole } from '@/lib/middleware/withRole';

async function rejectHandler(request, { params }) {
  try {
    const { id } = await params; // FIX : await params
    const updated = await db.enrollment.update({
      where: { id },
      data: { status: 'REJECTED' }
    });
    return NextResponse.json({ success: true, enrollment: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur interne.' }, { status: 500 });
  }
}

export const POST = withAuth(withRole(['ADMIN'], rejectHandler));