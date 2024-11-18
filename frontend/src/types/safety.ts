export interface SafetyTask {
  id: number;
  title: string;
  description: string;
  inspector: {
    id: number;
    username: string;
    name: string;
  };
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
  scheduledAt: string;
  checkItems: SafetyCheckItem[];
}

export interface SafetyCheckItem {
  id: number;
  content: string;
  status: 'pass' | 'fail' | 'pending';
  remarks?: string;
}

export interface SafetyReport {
  id: number;
  taskId: number;
  title: string;
  inspector: string;
  inspectionDate: string;
  status: 'draft' | 'submitted' | 'approved';
  summary: string;
  checkResults: SafetyCheckItem[];
  createdAt: string;
}

export interface CreateSafetyTaskDto {
  title: string;
  description: string;
  inspector: string;
  scheduledAt: string;
} 