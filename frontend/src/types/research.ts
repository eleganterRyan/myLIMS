export interface ResearchGroup {
  id: number;
  name: string;
  leader: {
    id: number;
    name: string;
    username: string;
  };
  direction: string;
  members: {
    id: number;
    name: string;
    username: string;
  }[];
  laboratories: Laboratory[];
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive';
}

export interface Laboratory {
  id: number;
  name: string;
  roomId: string;
  safetyLevel: number;
  safetyCategory: string;
  hazardSources: string[];
  safetyFacilities: string[];
}

export interface CreateResearchGroupDto {
  name: string;
  leaderId: number;
  direction: string;
  memberIds: number[];
  laboratoryIds: number[];
} 