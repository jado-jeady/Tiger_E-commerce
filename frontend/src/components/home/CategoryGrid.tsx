import Link from "next/link";
import type { Category } from "@/types/database";
import Image from "next/image";
import { resolveProductImage } from "@/lib/images";

type KindCard = {
  id: string;
  name: string;
  code: string;
  image_url: string | null;
};

function kindsFromCategories(categories: Category[]): KindCard[] {
  const kinds = new Map<string, KindCard>();
  const sorted = [...categories].sort((a, b) => a.sort_order - b.sort_order);

  for (const category of sorted) {
    const kind = category.attribute_set;
    if (!kind?.code) continue;
    const existing = kinds.get(kind.id);
    if (!existing) {
      kinds.set(kind.id, {
        id: kind.id,
        name: kind.name,
        code: kind.code,
        image_url: category.image_url,
      });
    } else if (!existing.image_url && category.image_url) {
      existing.image_url = category.image_url;
    }
  }

  return [...kinds.values()];
}

export default function CategoryGrid({
  categories,
  title,
}: {
  categories: Category[];
  title: string;
}) {
  const kinds = kindsFromCategories(categories);
  if (kinds.length === 0) return null;

  return (
    <section className="container-custom py-14">
      <h2 className="section-title mb-8">{title}</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {kinds.map((kind) => {
          const image = resolveProductImage(kind.image_url);
          return (
            <Link
              key={kind.id}
              href={`/shop?kind=${encodeURIComponent(kind.code)}`}
              className="group relative overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-soft)]"
            >
              <div className="relative aspect-square bg-gray-1">
                <Image
                  src={image}
                  alt={kind.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/20 to-transparent" />
                <span className="absolute bottom-4 left-4 right-4 text-lg font-semibold text-white">
                  {kind.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
