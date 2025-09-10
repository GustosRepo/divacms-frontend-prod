import Image from "next/image";
import Link from "next/link";

interface AboutSectionProps {
  embedded?: boolean; // if true, skip outer spacing
}

export default function AboutSection({ embedded = true }: AboutSectionProps) {
  const content = (
    <div className="relative pt-24 rounded-3xl p-8 bg-white/55 backdrop-blur-xl border border-white/70 shadow-[0_6px_20px_-6px_rgba(0,0,0,0.25)] overflow-hidden">
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.85),transparent_60%)]" />
      <div className="relative flex flex-col items-center text-center">
        <h2 className="font-shuneva text-3xl font-extrabold tracking-wide drop-shadow-lg">
          About Us
        </h2>
        <p className="font-shuneva text-sm mt-3 max-w-2xl font-medium leading-relaxed">
          Diva Factory is your one stop Diva destination for luxury press-on nails,
          collectible toys, and kawaii boutique finds! We handcraft every nail
          set, curate the cutest toys, and source unique accessories so you can
          express your style and joy every day. 💅🧸🛍️
        </p>
        <div className="relative flex justify-center mt-8 w-full">
          <div className="relative rounded-2xl p-1 bg-gradient-to-br from-pink-200 via-fuchsia-200 to-violet-200 shadow-inner">
            <div className="rounded-xl overflow-hidden bg-white/70 backdrop-blur">
              <Image
                src="/uploads/frontpgabout.png"
                alt="About Diva Factory "
                width={600}
                height={380}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
        <Link href="/about" className="mt-8 inline-flex">
          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-600 hover:to-fuchsia-600 text-white px-7 py-3 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition border border-pink-400/40">
            Learn More <span className="text-xs">→</span>
          </span>
        </Link>
      </div>
    </div>
  );

  if (embedded) return content;

  return <section className="mt-24 px-4">{content}</section>;
}
