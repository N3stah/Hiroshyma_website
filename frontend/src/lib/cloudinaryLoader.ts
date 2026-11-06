export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // Local dev images and anything not on Cloudinary pass through untouched
  if (!src.includes("res.cloudinary.com") || !src.includes("/image/upload/")) {
    return src;
  }
  // f_auto = WebP/AVIF per browser, c_limit = never upscale, w_ = requested width
  const params = ["f_auto", "c_limit", `w_${width}`, `q_${quality || "auto"}`].join(",");
  return src.replace("/image/upload/", `/image/upload/${params}/`);
}
