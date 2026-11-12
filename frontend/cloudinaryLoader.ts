// frontend/cloudinaryLoader.ts
interface ImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  if (src.includes("://cloudinary.com")) {
    const params = [
      "f_auto",
      "c_limit",
      `w_${width}`,
      `q_${quality || "auto"}`,
    ].join(",");

    if (src.includes("/upload/")) {
      return src.replace("/upload/", `/upload/${params}/`);
    }
  }

  return src;
}

export default cloudinaryLoader;
