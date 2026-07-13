"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { Catalog } from "../data/types";
import { makeQtyKey, type ActiveVariantMap, type QtyMap } from "./derive";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
  type PersistedState,
} from "./persistence";

type SelectionState = {
  qtyMap: QtyMap;
  activeVariantMap: ActiveVariantMap;
  expandedStepIds: Record<string, boolean>;
};

type Action =
  | { type: "SET_QTY"; productId: string; variantId?: string; qty: number }
  | { type: "SET_ACTIVE_VARIANT"; productId: string; variantId: string }
  | { type: "SET_STEP_EXPANDED"; stepId: string; expanded: boolean }
  | { type: "TOGGLE_STEP"; stepId: string }
  | { type: "HYDRATE"; state: SelectionState };

function buildSeedState(catalog: Catalog): SelectionState {
  const { steps, seedSelections } = catalog;
  const qtyMap: QtyMap = {};
  const activeVariantMap: ActiveVariantMap = {};

  for (const step of steps) {
    for (const product of step.products) {
      if (product.variants && product.variants.length > 0) {
        const seeded = seedSelections.find(
          (selection) => selection.productId === product.id && selection.variantId
        );
        activeVariantMap[product.id] = seeded?.variantId ?? product.variants[0].id;
      }
    }
  }

  for (const selection of seedSelections) {
    qtyMap[makeQtyKey(selection.productId, selection.variantId)] = selection.qty;
  }

  const firstStep = [...steps].sort((a, b) => a.order - b.order)[0];
  const expandedStepIds: Record<string, boolean> = firstStep
    ? { [firstStep.id]: true }
    : {};

  return { qtyMap, activeVariantMap, expandedStepIds };
}

function reducer(state: SelectionState, action: Action): SelectionState {
  switch (action.type) {
    case "SET_QTY": {
      const key = makeQtyKey(action.productId, action.variantId);
      const qty = Math.max(0, Math.round(action.qty));
      return { ...state, qtyMap: { ...state.qtyMap, [key]: qty } };
    }
    case "SET_ACTIVE_VARIANT":
      return {
        ...state,
        activeVariantMap: {
          ...state.activeVariantMap,
          [action.productId]: action.variantId,
        },
      };
    case "SET_STEP_EXPANDED":
      return {
        ...state,
        expandedStepIds: {
          ...state.expandedStepIds,
          [action.stepId]: action.expanded,
        },
      };
    case "TOGGLE_STEP":
      return {
        ...state,
        expandedStepIds: {
          ...state.expandedStepIds,
          [action.stepId]: !state.expandedStepIds[action.stepId],
        },
      };
    case "HYDRATE":
      return action.state;
    default:
      return state;
  }
}

type SelectionContextValue = {
  catalog: Catalog;
  qtyMap: QtyMap;
  getQty: (productId: string, variantId?: string) => number;
  setQty: (productId: string, variantId: string | undefined, qty: number) => void;
  getActiveVariantId: (productId: string) => string | undefined;
  setActiveVariantId: (productId: string, variantId: string) => void;
  isStepExpanded: (stepId: string) => boolean;
  toggleStep: (stepId: string) => void;
  setStepExpanded: (stepId: string, expanded: boolean) => void;
  save: () => void;
};

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({
  catalog,
  children,
}: {
  catalog: Catalog;
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, catalog, buildSeedState);

  useEffect(() => {
    const persisted = loadFromLocalStorage();
    if (persisted) {
      dispatch({
        type: "HYDRATE",
        state: {
          qtyMap: persisted.qtyMap,
          activeVariantMap: persisted.activeVariantMap,
          expandedStepIds: persisted.expandedStepIds,
        },
      });
    }
  }, []);

  const getQty = useCallback(
    (productId: string, variantId?: string) =>
      state.qtyMap[makeQtyKey(productId, variantId)] ?? 0,
    [state.qtyMap]
  );

  const setQty = useCallback(
    (productId: string, variantId: string | undefined, qty: number) =>
      dispatch({ type: "SET_QTY", productId, variantId, qty }),
    []
  );

  const getActiveVariantId = useCallback(
    (productId: string) => state.activeVariantMap[productId],
    [state.activeVariantMap]
  );

  const setActiveVariantId = useCallback(
    (productId: string, variantId: string) =>
      dispatch({ type: "SET_ACTIVE_VARIANT", productId, variantId }),
    []
  );

  const isStepExpanded = useCallback(
    (stepId: string) => Boolean(state.expandedStepIds[stepId]),
    [state.expandedStepIds]
  );

  const toggleStep = useCallback(
    (stepId: string) => dispatch({ type: "TOGGLE_STEP", stepId }),
    []
  );

  const setStepExpanded = useCallback(
    (stepId: string, expanded: boolean) =>
      dispatch({ type: "SET_STEP_EXPANDED", stepId, expanded }),
    []
  );

  const save = useCallback(() => {
    const persisted: PersistedState = {
      qtyMap: state.qtyMap,
      activeVariantMap: state.activeVariantMap,
      expandedStepIds: state.expandedStepIds,
    };
    saveToLocalStorage(persisted);
  }, [state.qtyMap, state.activeVariantMap, state.expandedStepIds]);

  const value = useMemo<SelectionContextValue>(
    () => ({
      catalog,
      qtyMap: state.qtyMap,
      getQty,
      setQty,
      getActiveVariantId,
      setActiveVariantId,
      isStepExpanded,
      toggleStep,
      setStepExpanded,
      save,
    }),
    [
      catalog,
      state.qtyMap,
      getQty,
      setQty,
      getActiveVariantId,
      setActiveVariantId,
      isStepExpanded,
      toggleStep,
      setStepExpanded,
      save,
    ]
  );

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection(): SelectionContextValue {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return context;
}
