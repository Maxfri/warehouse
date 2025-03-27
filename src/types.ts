export type Position = {
  x: number;
  y: number;
};

export interface Warehouse {
  floors: {
    floorNumber: number;
    places: Place[];
  }[];
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
  pallet: null;
  shuttle: Shuttle | null;
}

export interface Shuttle {
  currentPosition: Position;
  state: string;
  batteryLevel: number;
}
