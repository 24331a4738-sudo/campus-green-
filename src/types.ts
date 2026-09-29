export type Role = 'STUDENT' | 'FACULTY' | 'STAFF' | 'ADMIN';

export type ReportStatus = 'SUBMITTED' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
export type ReportPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type EventStatus = 'PUBLISHED' | 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
export type ResourceType = 'PDF' | 'VIDEO' | 'ARTICLE' | 'GUIDE';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  departmentCode: string;
  points: number;
  lifetimePoints: number;
  streak: number;
  level: {
    id: number;
    title: string;
    minPoints: number;
    nextLevelPoints: number;
  };
  avatarUrl?: string;
  badges: Badge[];
}

export interface Badge {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  currentParticipants: number;
  pointsValue: number;
  status: EventStatus;
  sdgGoals: string[];
  coverImage?: string;
  isRegistered?: boolean;
}

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  category: string;
  author: string;
  durationMin?: number;
  fileSizeMb?: number;
  url: string;
  completed?: boolean;
  bookmarked?: boolean;
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  pointCost: number;
  stock: number;
  imageUrl?: string;
  category: string;
}

export interface RedeemedVoucher {
  id: string;
  rewardId: string;
  rewardTitle: string;
  claimCode: string;
  pointsPaid: number;
  redeemedAt: string;
  isClaimed: boolean;
}

export interface MaintenanceReport {
  id: string;
  location: string;
  category: string;
  description: string;
  priority: ReportPriority;
  status: ReportStatus;
  reportedBy: string;
  reportedAt: string;
  assigneeName?: string;
  voiceMemoTranscript?: string;
}

export interface PointTransaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  timestamp: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sdgTag: string;
}
