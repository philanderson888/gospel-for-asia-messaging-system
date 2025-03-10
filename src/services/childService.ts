import { Child } from '../types/child';

const STORAGE_KEY = 'children';

// Initialize with sample data if storage is empty
const initializeChildren = (): Child[] => {
  try {
    const existingChildren = localStorage.getItem(STORAGE_KEY);
    if (!existingChildren) {
      const sampleChildren: Child[] = [
        {
          id: '1',
          child_id: '1234567891',
          name: 'John Smith',
          date_of_birth: '2015-06-15',
          bridge_of_hope_center_id: '57890123',
          sponsor_id: '12345678',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          child_id: '2345678901',
          name: 'Mary Johnson',
          date_of_birth: '2016-03-22',
          bridge_of_hope_center_id: '57890123',
          sponsor_id: '23456789',
          created_at: new Date().toISOString()
        }
      ];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleChildren));
      return sampleChildren;
    }

    return JSON.parse(existingChildren);
  } catch (error) {
    console.warn('Error initializing children, returning empty array:', error);
    return [];
  }
};

// Get all children
export const getAllChildren = (): Child[] => {
  try {
    return initializeChildren();
  } catch (error) {
    console.warn('Error getting children:', error);
    return [];
  }
};

// Get child by ID
export const getChildById = (childId: string): Child | null => {
  try {
    const children = initializeChildren();
    return children.find(child => child.child_id === childId) || null;
  } catch (error) {
    console.warn('Error getting child by ID:', error);
    return null;
  }
};

// Get child by sponsor ID
export const getChildBySponsorId = (sponsorId: string): Child | null => {
  try {
    const children = initializeChildren();
    return children.find(child => child.sponsor_id === sponsorId) || null;
  } catch (error) {
    console.warn('Error getting child by sponsor ID:', error);
    return null;
  }
};

// Get children by center ID
export const getChildrenByCenter = (centerId: string): Child[] => {
  try {
    const children = initializeChildren();
    return children.filter(child => child.bridge_of_hope_center_id === centerId);
  } catch (error) {
    console.warn('Error getting children by center:', error);
    return [];
  }
};

// Log all children to console
export const logChildren = () => {
  try {
    const children = initializeChildren();
    console.log('\n=== Children in Local Storage ===');
    if (children.length === 0) {
      console.log('No children found');
    } else {
      children.forEach(child => {
        console.log(`\nChild ID: ${child.child_id}`);
        console.log(`Name: ${child.name}`);
        console.log(`Date of Birth: ${child.date_of_birth}`);
        console.log(`Bridge of Hope Center: ${child.bridge_of_hope_center_id}`);
        console.log(`Sponsor ID: ${child.sponsor_id || 'None'}`);
        console.log(`Created: ${new Date(child.created_at).toLocaleString()}`);
      });
    }
    console.log('\n');
  } catch (error) {
    console.warn('Error logging children:', error);
  }
};