import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { data: pointage, error } = await supabase
      .from('pointages')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return new NextResponse('Not Found', { status: 404 });
      }
      throw error;
    }

    return NextResponse.json(pointage);
  } catch (error) {
    console.error('GET /api/pointages/[id] error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();

    const { data: pointage, error } = await supabase
      .from('pointages')
      .update(body)
      .eq('id', params.id)
      .eq('user_id', session.user.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return new NextResponse('Not Found', { status: 404 });
      }
      throw error;
    }

    return NextResponse.json(pointage);
  } catch (error) {
    console.error('PUT /api/pointages/[id] error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { error } = await supabase
      .from('pointages')
      .delete()
      .eq('id', params.id)
      .eq('user_id', session.user.id);

    if (error) throw error;

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('DELETE /api/pointages/[id] error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 