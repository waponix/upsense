export const SideMenu = {
    'Dashboard': {
        link: '/dashboard',
        icon: 'fas fa-fw fa-tachometer-alt',
        role: ['admin', 'manager', 'user']
    },
    'Companies': {
        divider: 'Manage',
        link: '/company/list',
        icon: 'fas fa-fw fa-building',
        role: ['admin']
    },
    'Accounts': {
        id: 'accounts',
        icon: 'fas fa-fw fa-user-circle',
        role: ['admin', 'manager'],
        links: [
            '/accounts/admin/list',
            '/accounts/manager/list',
            '/accounts/staff/list'
        ],
        subMenu: {
            'Admins': {
                id: 'admins',
                link: '/accounts/admin/list',
                role: ['admin']
            },
            'Managers': {
                id: 'managers',
                link: '/accounts/manager/list',
                role: ['admin']
            },
            'Staffs': {
                id: 'staffs',
                link: '/accounts/staff/list',
                role: ['admin', 'manager']
            }
        }
    },
    'Devices': {
        id: 'devices',
        icon: 'fas fa-fw fa-microchip',
        role: ['admin', 'manager', 'user'],
        links: [
            '/devices/hub/list',
            '/devices/sensor/list'
        ],
        subMenu: {
            'Hubs': {
                id: 'hubs',
                link: '/devices/hub/list',
                role: ['admin']
            },
            'Sensors': {
                id: 'sensors',
                link: '/devices/sensor/list',
                role: ['admin', 'manager', 'user']
            }
        }
    },

    'Notification Settings': {
        divider: 'Configure',
        id: 'settings',
        role: ['manager', 'user'],
        link: '/settings'
    }
}
