import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET() {
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { data: pointages, error } = await supabase
      .from('pointages')
      .select('*')
      .eq('user_id', session.user.id)
      .order('timestamp', { ascending: false });

    if (error) throw error;

    return NextResponse.json(pointages);
  } catch (error) {
    console.error('GET /api/pointages error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { type, timestamp, location, commentaire } = body;

    // Validation des données
    if (!type || !timestamp || !location) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Vérification des horaires autorisés
    const pointageDate = new Date(timestamp);
    if (!isWorkingDay(pointageDate)) {
      return new NextResponse('Pointage non autorisé les weekends', { status: 403 });
    }

    const { data: pointage, error } = await supabase
      .from('pointages')
      .insert([{
        user_id: userId,
        type,
        timestamp: new Date(timestamp).toISOString(),
        location,
        commentaire,
        status: 'EN_ATTENTE'
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(pointage);
  } catch (error) {
    console.error('POST /api/pointages error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}