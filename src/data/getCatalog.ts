import "server-only";
import { cache } from "react";
import type { Catalog } from "./types";

const CATALOG_API_URL =
  process.env.CATALOG_API_URL ??
  `http://localhost:${process.env.PORT ?? 3000}/api/catalog`;

export const getCatalog = cache(async (): Promise<Catalog> => {
  const res = await fetch(CATALOG_API_URL, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to load catalog: ${res.status}`);
  }

  return res.json();
});
