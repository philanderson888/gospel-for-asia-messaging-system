import { BridgeOfHopeCenter } from '../types/bridgeOfHopeCenter';

const STORAGE_KEY = 'bridge_of_hope_centers';

// Initialize with sample data if storage is empty
const initializeCenters = (): BridgeOfHopeCenter[] => {
  try {
    const existingCenters = localStorage.getItem(STORAGE_KEY);
    if (!existingCenters) {
      const sampleCenters: BridgeOfHopeCenter[] = [
        {
          id: '1',
          center_id: '57890123',
          name: 'Marasala, India',
          created_at: new Date().toISOString()
        }
      ];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleCenters));
      return sampleCenters;
    }

    return JSON.parse(existingCenters);
  } catch (error) {
    console.warn('Error initializing centers, returning empty array:', error);
    return [];
  }
};

// Get all centers
export const getAllCenters = (): BridgeOfHopeCenter[] => {
  try {
    return initializeCenters();
  } catch (error) {
    console.warn('Error getting centers:', error);
    return [];
  }
};

// Get center by ID
export const getCenterById = (centerId: string): BridgeOfHopeCenter | null => {
  try {
    const centers = initializeCenters();
    return centers.find(center => center.center_id === centerId) || null;
  } catch (error) {
    console.warn('Error getting center by ID:', error);
    return null;
  }
};

// Get center by missionary's bridge_of_hope_id
export const getCenterByMissionary = (bridgeOfHopeId: string): BridgeOfHopeCenter | null => {
  try {
    const centers = initializeCenters();
    return centers.find(center => center.center_id === bridgeOfHopeId) || null;
  } catch (error) {
    console.warn('Error getting center by missionary:', error);
    return null;
  }
};

// Log all centers to console
export const logCenters = () => {
  try {
    const centers = initializeCenters();
    console.log('\n=== Bridge of Hope Centers in Local Storage ===');
    if (centers.length === 0) {
      console.log('No centers found');
    } else {
      centers.forEach(center => {
        console.log(`\nCenter ID: ${center.center_id}`);
        console.log(`Name: ${center.name}`);
        console.log(`Created: ${new Date(center.created_at).toLocaleString()}`);
      });
    }
    console.log('\n');
  } catch (error) {
    console.warn('Error logging centers:', error);
  }
};