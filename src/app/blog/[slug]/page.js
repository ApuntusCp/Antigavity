import Image from "next/image";
import Link from "next/link";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../utils/firebase';
import BlogComments from '../../../components/BlogComments';
import MedicalDisclaimer from '../../../components/MedicalDisclaimer';
import { UserCheck, Calendar, ShieldCheck } from 'lucide-react';

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
      date: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Fecha reciente'
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const title = post?.title || slug.replace(/-/g, ' ').toUpperCase();
  const description = post?.excerpt || 'Investigación, ciencia y bienestar botánico en Colombia por GranColinos.';

  return {
    title: `${title} | GranColinos Journal`,
    description,
    openGraph: {
      title: `${title} - GranColinos Journal`,
      description,
      type: 'article',
      publishedTime: post?.createdAt ? new Date(post.createdAt.seconds * 1000).toISOString() : undefined,
      authors: [post?.author || 'GranColinos'],
      images: post?.image ? [{ url: post.image, alt: title }] : []
    }
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
  
  // ── JSON-LD: Schema.org Article (Google E-E-A-T & News/Blog) ───────────────
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": POST.title,
    "description": POST.excerpt || POST.title,
    "image": POST.image || 'https://grancolinos.com/Logos/GranColinos.Com.png',
    "datePublished": POST.createdAt ? new Date(POST.createdAt.seconds * 1000).toISOString() : new Date().toISOString(),
    "dateModified": POST.updatedAt ? new Date(POST.updatedAt.seconds * 1000).toISOString() : new Date().toISOString(),
    "author": {
      "@type": "Person",
      "name": POST.author || "Comité Científico GranColinos",
      "jobTitle": POST.authorRole || "Investigación en Fitoterapia y Bienestar Botánico",
      "worksFor": {
        "@type": "Organization",
        "name": "GranColinos",
        "legalName": "APONTE S.A.S."
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "GranColinos",
      "legalName": "APONTE S.A.S.",
      "logo": {
        "@type": "ImageObject",
        "url": "https://grancolinos.com/Logos/GranColinos.Com.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://grancolinos.com/blog/${slug}`
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-20 bg-brand-light dark:bg-brand-dark fade-in">
      {/* JSON-LD Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      
      {/* Back to Blog */}
      <div className="mb-12">
        <Link href="/blog" className="text-xs font-bold tracking-[0.2em] uppercase text-brand-gold hover:text-brand-green transition-colors duration-300 flex items-center gap-2">
          ← Volver al Journal
        </Link>
      </div>

      <header className="mb-16 text-center">
        <div className="flex flex-wrap items-center justify-center gap-3 text-brand-gold text-[11px] font-mono font-bold tracking-[0.2em] uppercase mb-6">
          <span className="flex items-center gap-1"><Calendar size={13} /> {POST.date}</span>
          <span>&bull;</span>
          <span className="flex items-center gap-1 text-white/90"><UserCheck size={13} className="text-brand-gold" /> Por {POST.author || 'Comité Científico GranColinos'}</span>
        </div>
        <h1 className="font-playfair text-3xl md:text-6xl text-brand-dark dark:text-white leading-tight mb-12">
          {POST.title}
        </h1>
        
        <div className="relative aspect-[21/9] w-full overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-2xl border border-white/10 shadow-xl">
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

      {/* Tarjeta de Autoría y Pericia Editorial E-E-A-T */}
      <div className="my-14 p-6 sm:p-8 rounded-3xl bg-black/40 border border-[#D4AF37]/35 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D4AF37] to-emerald-800 flex items-center justify-center text-black font-bold font-serif text-2xl shrink-0 shadow-lg border border-white/20">
          {(POST.author || 'G')[0]}
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <h4 className="font-serif text-white font-bold text-lg">{POST.author || 'Comité Editorial & Científico GranColinos'}</h4>
            <span className="px-2.5 py-0.5 bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-mono font-bold uppercase tracking-wider rounded-md border border-[#D4AF37]/40 flex items-center gap-1">
              <ShieldCheck size={12} /> {POST.authorRole || 'Investigación Botánica & Salud Natural'}
            </span>
          </div>
          <p className="text-gray-300 text-xs sm:text-sm font-light leading-relaxed">
            {POST.authorBio || 'Equipo multidisciplinario especializado en etnobotánica, apiterapia y extractos botánicos puros en Colombia. Este contenido ha sido curado y revisado bajo principios de evidencia científica y divulgación de salud responsable.'}
          </p>
        </div>
      </div>

      {/* Descargo Médico YMYL para Artículos de Bienestar */}
      <MedicalDisclaimer variant="card" className="my-10" />

      <BlogComments postId={POST.id} />
    </article>
  );
}
