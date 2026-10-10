const ABSOLUTE_URL_PATTERN = /^(?:[a-z][a-z\d+.-]*:)?\/\//i;

export const resolvePrescriptionImageUrl = (imageUrl) => {
  if (typeof imageUrl !== "string" || !imageUrl.trim()) return "";

  const value = imageUrl.trim();

  if (ABSOLUTE_URL_PATTERN.test(value) || /^(?:data|blob):/i.test(value)) {
    return value;
  }

  const s3BaseUrl = process.env.NEXT_PUBLIC_S3_BUCKET_URL;
  const fallbackBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const baseUrl = s3BaseUrl || fallbackBaseUrl;

  if (!baseUrl) return value;

  try {
    const relativeValue = s3BaseUrl
      ? value.replace(/^\/+/, "")
      : value;
    const normalizedBaseUrl = `${baseUrl.replace(/\/+$/, "")}/`;

    return new URL(relativeValue, normalizedBaseUrl).toString();
  } catch {
    return value;
  }
};

export const waitForPrescriptionImages = async (element) => {
  if (!element) return;

  const images = [...element.querySelectorAll("img")];

  await Promise.all(
    images.map((image) => {
      if (image.complete) return Promise.resolve();

      return new Promise((resolve) => {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
      });
    })
  );
};