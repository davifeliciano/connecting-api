import sharp from "sharp";

export default async function editImage(buffer) {
  const imageSize = 1080;

  const backgroundPromise = sharp(buffer)
    .resize(imageSize, imageSize, {
      fit: "cover",
    })
    .blur(5)
    .modulate({ brightness: 0.5 })
    .png()
    .toBuffer();

  const imagePromise = sharp(buffer)
    .resize(imageSize, imageSize, { fit: "contain", background: "transparent" })
    .png()
    .toBuffer();

  const [background, image] = await Promise.all([
    backgroundPromise,
    imagePromise,
  ]);

  return sharp(background)
    .composite([{ input: image }])
    .withMetadata()
    .webp()
    .toBuffer();
}
