export type EmploymentStatus = 'Employed (PAYE)' | 'Self-employed' | 'Retired' | 'Student' | 'Unemployed';
export type PropertyType = 'First-time buyer' | 'Home mover' | 'Remortgage' | 'Buy-to-let';
export type ClientStatus = 'Approved' | 'Under review' | 'Rejected';

export interface ClientDataI {
  id: string;
  name: string;
  loanAmount: number;
  depositAmount: number;
  employmentStatus: EmploymentStatus;
  currentRole: string;
  company: string;
  propertyType: PropertyType;
  status: ClientStatus;
}