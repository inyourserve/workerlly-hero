// Constants file (e.g., lib/constants.ts)
export const AVAILABLE_RESOURCES = {
    dashboard: {
      label: 'Dashboard',
      actions: ['read'],
      path: '/dashboard'
    },
    categories: {
      label: 'Categories',
      actions: ['create', 'read', 'update', 'delete'],
      path: '/dashboard/categories'
    },
    users: {
      label: 'Users',
      actions: ['create', 'read', 'update', 'delete'],
      path: '/dashboard/users'
    },
    jobs: {
        label: 'Jobs',
        actions: ['create', 'read', 'update', 'delete'],
        path: '/dashboard/jobs'
      },
      workers: {
        label: 'Workers',
        actions: ['create', 'read', 'update', 'delete'],
        path: '/dashboard/workers'
      },
      providers: {
        label: 'Providers',
        actions: ['create', 'read', 'update', 'delete'],
        path: '/dashboard/providers'
      },
      cities: {
        label: 'Cities',
        actions: ['create', 'read', 'update', 'delete'],
        path: '/dashboard/cities'
      },
      rates: {
          label: 'Rates',
          actions: ['create', 'read', 'update', 'delete'],
          path: '/dashboard/rates'
        },
    admins: {
      label: 'Admins',
      actions: ['create', 'read', 'update', 'delete'],
      path: '/dashboard/admins'
    },
    faqs: {
      label: 'Faqs',
      actions: ['create', 'read', 'update', 'delete'],
      path: '/dashboard/faqs'
    },
    roles: {
        label: 'Roles',
        actions: ['create', 'read', 'update', 'delete'],
        path: '/dashboard/roles'
      },
 
    // ... add other resources
  } as const
  
  // Type for the resources
  export type ResourceKey = keyof typeof AVAILABLE_RESOURCES
  export type ActionType = 'create' | 'read' | 'update' | 'delete'