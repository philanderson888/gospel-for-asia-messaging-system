import { Child } from '../types/child';

const STORAGE_KEY = 'children';

// Initialize with sample data if storage is empty
const initializeChildren = () => {
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
      }
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleChildren));
    return sampleChildren;
  }

  return JSON.parse(existingChildren);
};

// Get all children
export const getAllChildren = (): Child[] => {
  return initializeChildren();
};

// Get child by ID
export const getChildById = (childId: string): Child | null => {
  const children = initializeChildren();
  return children.find(child => child.child_id === childId) || null;
};

// Get child by sponsor ID
export const getChildBySponsorId = (sponsorId: string): Child | null => {
  const children = initializeChildren();
  return children.find(child => child.sponsor_id === sponsorId) || null;
};

// Get children by center ID
export const getChildrenByCenter = (centerId: string): Child[] => {
  const children = initializeChildren();
  return children.filter(child => child.bridge_of_hope_center_id === centerId);
};

// Log all children to console
export const logChildren = () => {
  const children = initializeChildren();
  console.log('\n=== Children in Local Storage ===');
  children.forEach(child => {
    console.log(`\nChild ID: ${child.child_id}`);
    console.log(`Name: ${child.name}`);
    console.log(`Date of Birth: ${child.date_of_birth}`);
    console.log(`Bridge of Hope Center: ${child.bridge_of_hope_center_id}`);
    console.log(`Sponsor ID: ${child.sponsor_id || 'None'}`);
    console.log(`Created: ${new Date(child.created_at).toLocaleString()}`);
  });
  console.log('\n');
};