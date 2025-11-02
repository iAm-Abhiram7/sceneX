/**
 * App Context
 * Manages global app state including reports and chat messages
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Report, Message, AppContextType } from '../constants/Types';
import * as storageService from '../services/storage.service';
import { generateId } from '../utils/helpers';
import { formatCaseId } from '../utils/formatters';

// Create context with undefined default
const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * AppProvider Component
 * Wraps the app and provides global app state
 */
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [currentChatMessages, setCurrentChatMessages] = useState<Message[]>([]);

  /**
   * Load reports from storage on mount
   */
  useEffect(() => {
    loadReports();
  }, []);

  /**
   * Load reports from AsyncStorage
   */
  const loadReports = async (): Promise<void> => {
    try {
      const storedReports = await storageService.getReports();
      setReports(storedReports);
    } catch (error) {
      console.error('Error loading reports:', error);
    }
  };

  /**
   * Refresh reports from storage
   */
  const refreshReports = async (): Promise<void> => {
    await loadReports();
  };

  /**
   * Add message to current chat
   * @param message - Message to add
   */
  const addMessage = (message: Message): void => {
    setCurrentChatMessages(prev => [...prev, message]);
  };

  /**
   * Clear current chat messages
   */
  const clearChat = (): void => {
    setCurrentChatMessages([]);
  };

  /**
   * Save report to storage
   * @param report - Report data without id and timestamp
   */
  const saveReport = async (
    report: Omit<Report, 'id' | 'timestamp'>
  ): Promise<Report> => {
    try {
      // Create complete report object
      const newReport: Report = {
        ...report,
        id: `report-${generateId()}`,
        timestamp: new Date(),
      };

      // Save to storage
      await storageService.saveReport(newReport);

      // Update local state
      setReports(prev => [newReport, ...prev]);

      return newReport;
    } catch (error) {
      console.error('Error saving report:', error);
      throw error;
    }
  };

  /**
   * Delete report
   * @param reportId - ID of report to delete
   */
  const deleteReport = async (reportId: string): Promise<void> => {
    try {
      await storageService.deleteReport(reportId);
      setReports(prev => prev.filter(r => r.id !== reportId));
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  };

  const value: AppContextType = {
    reports,
    currentChatMessages,
    addMessage,
    clearChat,
    saveReport,
    deleteReport,
    refreshReports,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * Custom hook to use app context
 * @returns App context value
 * @throws Error if used outside AppProvider
 */
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  
  return context;
};
