import Image from "next/image";
import { fetchBlogPosts } from "../../utils/firebase";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Journal de Bienestar | GranColinos",
  description: "Artículos, noticias y consejos sobre bienestar, CBD y salud natural.",
};

export default async function BlogIndex() {
  const posts = await fetchBlogPosts();
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-24 fade-in">
        <h1 className="font-playfair text-5xl md:text-7xl text-brand-dark dark:text-white mb-6">
          Journal de Bienestar
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto font-light">
          Conocimiento, ciencia y naturaleza para elevar tu estilo de vida.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {posts.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <p className="text-gray-500 font-sans tracking-widest uppercase text-sm">No hay publicaciones disponibles.</p>
          </div>
        ) : (
          posts.map((post, i) => (
            <a key={post.slug} href={`/blog/${post.slug}`} className={`group fade-in delay-${(i % 4 + 1) * 100} block`}>
              <div className="relative aspect-[4/3] w-full mb-8 overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image 
                  src={post.image || 'https://images.unsplash.com/photo-1611078731519-2166a4bc2c8e?q=80&w=1000&auto=format&fit=crop'} 
                  alt={post.title} 
                  fill 
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-brand-green/10 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              
              <div className="flex flex-col">
                <span className="text-brand-gold text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
                  {post.date}
                </span>
                <h2 className="font-playfair text-2xl md:text-3xl text-brand-dark dark:text-white mb-4 group-hover:text-brand-green dark:group-hover:text-brand-gold transition-colors duration-300">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
