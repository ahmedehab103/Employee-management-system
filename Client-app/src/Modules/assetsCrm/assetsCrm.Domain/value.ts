export interface Value {
  id: string;
  assetId: string;
  evaluatedAt: Date;
  evaluatedBy: string;
  value: number;
  reportUrl: string;
  isFinal: boolean;
  isCurrent: boolean;
  detailed: boolean;
  isRental: boolean;
}
