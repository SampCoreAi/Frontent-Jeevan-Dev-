const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);

export const resolveReportDownloadUrl = (value) => {
  if (typeof value !== "string" || !value.trim()) return "";

  const bucketUrl = (process.env.NEXT_PUBLIC_S3_BUCKET_URL || "").replace(
    /\/+$/,
    "",
  );

  try {
    const sourceUrl = new URL(value);
    if (!LOCAL_HOSTS.has(sourceUrl.hostname.toLowerCase()) || !bucketUrl) {
      return sourceUrl.toString();
    }

    return new URL(
      `${sourceUrl.pathname}${sourceUrl.search}${sourceUrl.hash}`,
      `${bucketUrl}/`,
    ).toString();
  } catch {
    if (!bucketUrl) return value;

    try {
      return new URL(value, `${bucketUrl}/`).toString();
    } catch {
      return value;
    }
  }
};
