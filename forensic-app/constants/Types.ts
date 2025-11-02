/**
 * TypeScript Type Definitions
 * All interfaces and types used throughout the app
 */

/**
 * User Interface
 * Represents an authenticated user
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}

/**
 * Message Interface
 * Represents a single chat message in the AI conversation
 */
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUri?: string;
  timestamp: Date;
}

/**
 * Report Interface
 * Represents a forensic analysis report
 */
export interface Report {
  id: string;
  caseId: string;
  userId: string;
  timestamp: Date;
  images: Array<{
    uri: string;
    uploadedAt: Date;
  }>;
  chatHistory: Message[];
  reportContent: string;
  evidenceTags: string[];
  summary: string;
  status: 'draft' | 'completed' | 'pending' | 'in_progress';
}

/**
 * Auth State Interface
 * Manages authentication state in the app
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Auth Context Interface
 * Provides authentication methods throughout the app
 */
export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

/**
 * App Context Interface
 * Manages global app state
 */
export interface AppContextType {
  reports: Report[];
  currentChatMessages: Message[];
  addMessage: (message: Message) => void;
  clearChat: () => void;
  saveReport: (report: Omit<Report, 'id' | 'timestamp'>) => Promise<Report>;
  deleteReport: (reportId: string) => Promise<void>;
  refreshReports: () => Promise<void>;
}

/**
 * Evidence Tag Type
 * Predefined evidence categories
 */
export type EvidenceTag = 
  | 'weapon' 
  | 'blood' 
  | 'fingerprint' 
  | 'vehicle' 
  | 'document' 
  | 'trace'
  | 'biological'
  | 'digital'
  | 'tool mark'
  | 'fibers';

/**
 * Button Variant Type
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

/**
 * Image Quality Type
 */
export type ImageQuality = 'high' | 'medium' | 'low';

/**
 * Filter Period Type
 */
export type FilterPeriod = 'all' | 'week' | 'month' | 'older';
