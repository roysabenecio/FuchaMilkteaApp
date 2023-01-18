import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import WarehouseRoundedIcon from '@mui/icons-material/WarehouseRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import WatchLaterRoundedIcon from '@mui/icons-material/WatchLaterRounded';
import PointOfSaleRoundedIcon from '@mui/icons-material/PointOfSaleRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';

export const reportSubItems = [
    {
        id: 7,
        label: 'Sales',
        route: 'sales-report'
    },
    {
        id: 8,
        label: 'Inventory',
        route: 'inventory-report'
    },
];

export const userNavItems = {
    'Admin': [
        {
            id: 0,
            icon: <DashboardRoundedIcon />,
            label: 'Dashboard',
            route: 'dashboard'
        },
        {
            id: 1,
            icon: <WarehouseRoundedIcon />,
            label: 'Inventory',
            route: 'inventory'
        },
        {
            id: 2,
            icon: <PeopleRoundedIcon />,
            label: 'Users',
            route: 'users'
        },
        {
            id: 3,
            icon: <LocalShippingRoundedIcon />,
            label: 'Suppliers',
            route: 'suppliers'
        },
        {
            id: 4,
            icon: <InventoryRoundedIcon />,
            label: 'Reports',

        },
        {
            id: 5,
            icon: <WatchLaterRoundedIcon />,
            label: 'History',
            route: 'history'
        },
        {
            id: 6,
            icon: <PointOfSaleRoundedIcon />,
            label: 'POS',
            route: 'pos'
        }
    ],
    'Inventory Clerk': [
        {
            id: 0,
            icon: <DashboardRoundedIcon />,
            label: 'Dashboard',
            route: 'dashboard'
        },
        {
            id: 1,
            icon: <WarehouseRoundedIcon />,
            label: 'Inventory',
            route: 'inventory'
        },
        {
            id: 3,
            icon: <LocalShippingRoundedIcon />,
            label: 'Suppliers',
            route: 'suppliers'
        },
    ],
    'Cashier': [
        {
            id: 0,
            icon: <DashboardRoundedIcon />,
            label: 'Dashboard',
            route: 'dashboard'
        },
        {
            id: 1,
            icon: <PointOfSaleRoundedIcon />,
            label: 'POS',
            route: 'pos'
        },
    ]
};





