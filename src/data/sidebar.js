import KeyIcon from '@mui/icons-material/KeyOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCardOutlined';
import WorkspacesIcon from '@mui/icons-material/WorkspacesOutlined';
import PeopleIcon from '@mui/icons-material/PeopleOutlined';
import PersonIcon from '@mui/icons-material/PersonOutlined';
import DataUsageIcon from '@mui/icons-material/DataUsageOutlined';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import LayersIcon from '@mui/icons-material/LayersOutlined';
import DeviceHubIcon from '@mui/icons-material/DeviceHubOutlined';
import DiamondIcon from '@mui/icons-material/DiamondOutlined';
import FavoriteIcon from '@mui/icons-material/FavoriteBorderOutlined';

const Dashboard = [
    {
        name: 'Overview',
        icon: <DataUsageIcon fontSize='small' />,
        to: '/',
    },
    {
        name: 'Secret Keys',
        icon: <KeyIcon fontSize='small' />,
        to: '/secret-keys',
    },
    {
        name: 'Cards',
        icon: <CreditCardIcon fontSize='small' />,
        to: '/cards',
    },
    {
        name: 'Marketplace',
        icon: <WorkspacesIcon fontSize='small' />,
        to: '/marketplace',
    },
];

const Account = [
    {
        name: 'History',
        icon: <PeopleIcon fontSize='small' />,
        to: '/history',
    },
    {
        name: 'Messeges',
        icon: <PersonIcon fontSize='small' />,
        to: '/messeges',
    },
];

const Links = [
    {
        name: 'Marked',
        icon: <LayersIcon fontSize='small' />,
        to: '/history',
    },
    {
        name: 'New',
        icon: <DeviceHubIcon fontSize='small' />,
        to: '/messeges',
    },
    {
        name: 'Trends',
        icon: <DiamondIcon fontSize='small' />,
        to: '/messeges',
    },
    {
        name: 'Favorite',
        icon: <FavoriteIcon fontSize='small' />,
        to: '/messeges',
    },
    {
        name: 'Settings',
        icon: <SettingsIcon fontSize='small' />,
        to: '/settings',
    },
];

export { Dashboard, Account, Links };
