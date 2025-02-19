import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/app/lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const valideur = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!valideur || !['ADMIN', 'MANAGER', 'RH'].includes(valideur.role)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const data = await req.json();
    const validation = await prisma.validation.create({
      data: {
        pointageId: data.pointageId,
        valideurId: valideur.id,
        status: data.status,
        commentaire: data.commentaire,
        motif: data.motif
      },
      include: {
        pointage: true
      }
    });

    // Mettre à jour le statut du pointage
    await prisma.pointage.update({
      where: { id: data.pointageId },
      data: { status: data.status }
    });

    return NextResponse.json(validation);
  } catch (error) {
    console.error('Erreur validation pointage:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 