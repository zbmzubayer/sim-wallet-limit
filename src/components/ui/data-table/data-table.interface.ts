export interface FilterField {
  column: string;
  title: string;
  options: {
    label: React.ReactNode;
    value: string | number;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}
