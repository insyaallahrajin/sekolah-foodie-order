
export interface Child {
  id: string;
  name: string;
  class: string;
  parent_id?: string;
  allergies?: string[];
  created_at?: string;
  updated_at?: string;
}
