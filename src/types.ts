export type Position = {
  x: number;
  y: number;
  z?: number;
};

export interface Warehouse {
  floors: {
    floorNumber: number;
    rows: Row[];
  }[];
}

export interface Row {
  places: Place[];
}

export const placeType = {
  STORAGE: "STORAGE",
  PASSAGE: "PASSAGE",
  CHARGING: "CHARGING",
} as const;

export type PlaceType = (typeof placeType)[keyof typeof placeType];

export interface Place {
  name: string;
  location: string;
  coordinates: Position;
  type: PlaceType | string;
  pallet: {
    barcode: string;
  } | null;
  shuttle: Shuttle | null;
}

export interface Shuttle {
  name?: string;
  currentPosition: Position | null;
  state: string | null;
  batteryLevel: number;
  pallet: {
    barcode: string;
  } | null;
}
