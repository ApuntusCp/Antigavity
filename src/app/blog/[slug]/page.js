import Image from "next/image";
import Link from "next/link";

// This is a placeholder. In the real app, this would fetch from Firebase or MDX
const POST = {
  title: 'El CBD como Aliado Natural contra el Estrés y la Ansiedad',
  date: '10 de Julio, 2026',
  author: 'Dra. María Aponte',
  image: 'https://images.unsplash.com/photo-1611078731519-2166a4bc2c8e?q=80&w=1000&auto=format&fit=crop',
  content: `
    El ritmo de vida moderno nos empuja constantemente hacia límites físicos y mentales. En esta búsqueda por el equilibrio, los extractos puros de la naturaleza se presentan no como una cura mágica, sino como herramientas para recuperar nuestra homeostasis.

    Nuestro sistema endocannabinoide juega un papel fundamental en la regulación del estrés. Al introducir CBD (Cannabidiol) de alta pureza, sin trazas de THC, estamos proporcionando al cuerpo moléculas que interactúan suavemente con nuestros propios receptores para promover un estado de calma sin alterar la consciencia.

    ## ¿Cómo integrarlo en la rutina?
    
    1. **Mañanas con propósito:** Unas gotas bajo la lengua antes del café pueden ayudar a mitigar los picos de cortisol.
    2. **Tardes de enfoque:** Cuando la mente se satura, el CBD actúa como un "reset" sutil.
    3. **Noches profundas:** Combinado con una buena higiene del sueño, facilita la transición hacia el descanso reparador.

    En GranColinos, nuestro compromiso es entregar la esencia pura de este milagro botánico, con certificaciones que garantizan que cada frasco contiene exactamente lo que promete, ni más ni menos.
  `
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: `${slug.replace(/-/g, ' ').toUpperCase()} | GranColinos Journal`,
  };
}

export default async function BlogPost({ params }) {
  // Await the params as required by Next.js 15+ 
  const { slug } = await params;
  
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
          {POST.date} &bull; Por {POST.author}
        </span>
        <h1 className="font-playfair text-4xl md:text-6xl text-brand-dark dark:text-white leading-tight mb-12">
          {POST.title}
        </h1>
        
        <div className="relative aspect-[21/9] w-full overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-sm">
          <Image 
            src={POST.image} 
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
