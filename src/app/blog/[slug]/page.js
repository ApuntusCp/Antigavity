import Image from "next/image";
import Link from "next/link";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../utils/firebase';

export const dynamic = 'force-dynamic';

async function getPostBySlug(slug) {
  try {
    const q = query(collection(db, 'blog_posts'), where('slug', '==', decodeURIComponent(slug)));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      date: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Fecha desconocida'
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: `${slug.replace(/-/g, ' ').toUpperCase()} | GranColinos Journal`,
  };
}

export default async function BlogPost({ params }) {
  // Await the params as required by Next.js 15+ 
  const { slug } = await params;
  const POST = await getPostBySlug(slug);

  if (!POST) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-32 text-center text-white">
        <h1 className="text-4xl mb-4 font-playfair">Artículo no encontrado</h1>
        <Link href="/blog" className="text-brand-gold hover:underline">Volver al Journal</Link>
      </div>
    );
  }
  
  return (
    <article className="max-w-4xl mx-auto px-6 py-20 bg-brand-light dark:bg-brand-dark fade-in">
      
      {/* Back to Blog */}
      <div className="mb-12">
        <Link href="/blog" className="text-xs font-bold tracking-[0.2em] uppercase text-brand-gold hover:text-brand-green transition-colors duration-300 flex items-center gap-2">
          ← Volver al Journal
        </Link>
      </div>

      <header className="mb-16 text-center">
        <span className="text-brand-gold text-[10px] font-bold tracking-[0.2em] uppercase mb-6 block">
          {POST.date} &bull; Por {POST.author || 'Gran Colinos'}
        </span>
        <h1 className="font-playfair text-4xl md:text-6xl text-brand-dark dark:text-white leading-tight mb-12">
          {POST.title}
        </h1>
        
        <div className="relative aspect-[21/9] w-full overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-sm">
          <Image 
            src={POST.image || 'https://images.unsplash.com/photo-1611078731519-2166a4bc2c8e?q=80&w=1000&auto=format&fit=crop'} 
            alt={POST.title} 
            fill 
            className="object-cover object-center" 
            priority
          />
        </div>
      </header>

      {/* Content Rendering (Basic Markdown simulation) */}
      <div className="prose prose-lg dark:prose-invert prose-p:font-light prose-p:leading-relaxed prose-headings:font-playfair prose-headings:font-normal prose-a:text-brand-gold max-w-none">
        {POST.content.split('\n\n').map((paragraph, idx) => {
          if (paragraph.trim().startsWith('##')) {
            return <h2 key={idx} className="text-3xl text-brand-green dark:text-brand-gold mt-12 mb-6">{paragraph.replace('##', '').trim()}</h2>;
          }
          if (paragraph.trim().startsWith('1.')) {
            const items = paragraph.split('\n').filter(i => i.trim());
            return (
              <ul key={idx} className="space-y-4 my-8 pl-6 border-l border-brand-gold/30">
                {items.map((item, i) => (
                  <li key={i} className="text-gray-700 dark:text-gray-300">{item.replace(/^\d+\.\s/, '')}</li>
                ))}
              </ul>
            );
          }
          return <p key={idx} className="mb-6 text-gray-600 dark:text-gray-400">{paragraph.trim()}</p>;
        })}
      </div>
    </article>
  );
}
