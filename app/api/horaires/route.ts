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

    const horaires = await prisma.horaireTravail.findMany({
      where: { userId: user.id }
    });

    return NextResponse.json(horaires);
  } catch (error) {
    console.error('Erreur récupération horaires:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: Request) {
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

    const data = await req.json();
    const horaire = await prisma.horaireTravail.create({
      data: {
        userId: user.id,
        jourSemaine: data.jourSemaine,
        heureDebut: data.heureDebut,
        heureFin: data.heureFin,
        pauseDebut: data.pauseDebut,
        pauseFin: data.pauseFin
      }
    });

    return NextResponse.json(horaire);
  } catch (error) {
    console.error('Erreur création horaire:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 