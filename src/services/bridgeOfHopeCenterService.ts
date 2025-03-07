import { BridgeOfHopeCenter } from '../types/bridgeOfHopeCenter';

const STORAGE_KEY = 'bridge_of_hope_centers';

// Initialize with sample data if storage is empty
const initializeCenters = () => {
  const existingCenters = localStorage.getItem(STORAGE_KEY);
  if (!existingCenters) {
    const sampleCenters: BridgeOfHopeCenter[] = [
      {
        id: '1',
        center_id: '57890123',
        name: 'Bridge of Hope Center 02',
        created_at: new Date().toISOString()
      }
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleCenters));
    return sampleCenters;
  }

  return JSON.parse(existingCenters);
};

// Get all centers
export const getAllCenters = (): BridgeOfHopeCenter[] => {
  return initializeCenters();
};

// Get center by ID
export const getCenterById = (centerId: string): BridgeOfHopeCenter | null => {
  const centers = initializeCenters();
  return centers.find(center => center.center_id === centerId) || null;
};

// Get center by missionary's bridge_of_hope_id
export const getCenterByMissionary = (bridgeOfHopeId: string): BridgeOfHopeCenter | null => {
  const centers = initializeCenters();
  return centers.find(center => center.center_id === bridgeOfHopeId) || null;
};

// Log all centers to console
export const logCenters = () => {
  const centers = initializeCenters();
  console.log('\n=== Bridge of Hope Centers in Local Storage ===');
  centers.forEach(center => {
    console.log(`\nCenter ID: ${center.center_id}`);
    console.log(`Name: ${center.name}`);
    console.log(`Created: ${new Date(center.created_at).toLocaleString()}`);
  });
  console.log('\n');
};