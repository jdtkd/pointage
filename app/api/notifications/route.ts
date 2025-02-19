import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(req: Request) {
  try {
    const userId = ''; // TODO: Implémenter votre logique d'authentification
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const notifications = await prisma.notification.findMany({
      where: { 
        userId: user.id,
        lu: false 
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Erreur récupération notifications:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const data = await req.json();
    const notification = await prisma.notification.update({
      where: { id: data.notificationId },
      data: { lu: true }
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Erreur mise à jour notification:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 