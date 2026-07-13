import { NextResponse } from "next/server";
import catalog from "@/src/data/catalog.json";

export function GET() {
  return NextResponse.json(catalog);
}
