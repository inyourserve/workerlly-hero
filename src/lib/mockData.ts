// src/lib/mockData.ts

// Dashboard Statistics Interface
interface DashboardStats {
    total: number
    change: number
  }
  
  // Mock Dashboard Statistics
  export const mockDashboardStats = {
    workers: {
      total: 1234,
      change: 10,
      data: [
        { id: '1', name: 'John Doe', category: 'Plumber', status: 'Active' },
        { id: '2', name: 'Jane Smith', category: 'Electrician', status: 'Pending' }
      ]
    },
    jobs: {
      total: 567,
      change: 5,
      data: [
        { id: '1', title: 'Home Repair', category: 'Maintenance', status: 'Active' },
        { id: '2', title: 'Office Cleaning', category: 'Cleaning', status: 'Pending' }
      ]
    },
    cities: {
      total: 45,
      change: -2,
      data: [
        { id: '1', name: 'New York', status: 'Active' },
        { id: '2', name: 'Los Angeles', status: 'Active' }
      ]
    },
    categories: {
      total: 89,
      change: 12,
      data: [
        { 
          id: '1', 
          name: 'Home Services', 
          subcategories: ['Plumbing', 'Electrical', 'Cleaning'] 
        },
        { 
          id: '2', 
          name: 'Professional Services', 
          subcategories: ['Consulting', 'IT Support'] 
        }
      ]
    }
  }
  
  // Mock Services Data
  export const mockServicesData = {
    workers: {
      getDashboardStats: () => ({
        data: mockDashboardStats.workers
      }),
      getAll: () => mockDashboardStats.workers.data,
      create: (workerData: any) => ({ ...workerData, id: (Math.random() * 1000).toString() }),
      update: (id: string, workerData: any) => ({ ...workerData, id }),
      delete: (id: string) => true
    },
    jobs: {
      getDashboardStats: () => ({
        data: mockDashboardStats.jobs
      }),
      getAll: () => mockDashboardStats.jobs.data,
      create: (jobData: any) => ({ ...jobData, id: (Math.random() * 1000).toString() }),
      update: (id: string, jobData: any) => ({ ...jobData, id }),
      delete: (id: string) => true
    },
    cities: {
      getDashboardStats: () => ({
        data: mockDashboardStats.cities
      }),
      getAll: () => mockDashboardStats.cities.data,
      create: (cityData: any) => ({ ...cityData, id: (Math.random() * 1000).toString() }),
      update: (id: string, cityData: any) => ({ ...cityData, id }),
      delete: (id: string) => true
    },
    categories: {
      getDashboardStats: () => ({
        data: mockDashboardStats.categories
      }),
      getAll: () => mockDashboardStats.categories.data,
      create: (categoryData: any) => ({ ...categoryData, id: (Math.random() * 1000).toString() }),
      update: (id: string, categoryData: any) => ({ ...categoryData, id }),
      delete: (id: string) => true
    }
  }
  