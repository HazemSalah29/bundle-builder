import type { QtyMap, ActiveVariantMap } from "./derive";

const STORAGE_KEY = "bundle-builder:v1";

export type PersistedState = {
  qtyMap: QtyMap;
  activeVariantMap: ActiveVariantMap;
  expandedStepIds: Record<string, boolean>;
};

function isPersistedState(value: unknown): value is PersistedState {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.qtyMap === "object" &&
    candidate.qtyMap !== null &&
    typeof candidate.activeVariantMap === "object" &&
    candidate.activeVariantMap !== null &&
    typeof candidate.expandedStepIds === "object" &&
    candidate.expandedStepIds !== null
  );
}

export function saveToLocalStorage(state: PersistedState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {

  }
}

export function loadFromLocalStorage(): PersistedState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    return isPersistedState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
