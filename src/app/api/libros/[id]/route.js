import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../utils/firebase';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Book ID is required' }, { status: 400 });
    }

    const docRef = doc(db, 'gran_libros_catalog', id);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: snap.id,
        ...snap.data()
      }
    }, { status: 200 });

  } catch (error) {
    console.error(`Error fetching book detail:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
