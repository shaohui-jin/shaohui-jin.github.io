export interface ApiRow {
  name: string;
  type: string;
  default: string;
  required: boolean;
  desc: string;
  note?: string;
}

export interface EventRow {
  name: string;
  payload: string;
  desc: string;
}

export interface SlotRow {
  name: string;
  desc: string;
}

export interface ComponentApi {
  props: ApiRow[];
  events?: EventRow[];
  slots?: SlotRow[];
  notes?: string[];
}
