"use client";

import { create } from "zustand";

type ExploreState = {
  selectedSlug: string | null;
  hoveredSlug: string | null;
  setSelectedSlug: (selectedSlug: string | null) => void;
  setHoveredSlug: (hoveredSlug: string | null) => void;
};

export const useExploreStore = create<ExploreState>((set) => ({
  selectedSlug: null,
  hoveredSlug: null,
  setSelectedSlug: (selectedSlug) => set({ selectedSlug }),
  setHoveredSlug: (hoveredSlug) => set({ hoveredSlug }),
}));
