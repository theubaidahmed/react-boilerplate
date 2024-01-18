import React, { useCallback, useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Link, NavLink, useLocation } from 'react-router-dom';
import axios from 'axios';

//mui component
import {
    AppBar,
    Box,
    Stack,
    Drawer as MuiDrawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Avatar,
    Button,
    Grid,
    Toolbar,
    Typography,
    ListItemButton,
    Menu,
    Link as MuiLink,
    MenuItem,
    Modal,
    useTheme as useMuiTheme,
    Skeleton,
    LinearProgress,
    styled,
    useMediaQuery,
} from '@mui/material';

//mui icons
import AppsIcon from '@mui/icons-material/Apps';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';
import MicrophoneIcon from './MicrophoneIcon';
import ActionIcon from './ActionIcon';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';

//react component
import Image from './Image';
import SearchBar from './SearchBar';
import Feedback from './Feedback';

//services
// import sidebarLinks from './../../services/sidebarLinks';
import { useTheme } from '../theme';
import { useMenu } from '../hooks/useMenu';
import { useMessage } from './Header';
import { useUser } from '../hooks/Authorize';
import useModal from '../hooks/useModal';
import { clearCookie, getCookie, setCookie } from '../utilities/cookies';
import { env, handleAxiosError } from '../utilities/function';

const drawerWidth = 260;
const appsWidth = 54;
const miniDrawerWidth = 72;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    backgroundColor: theme.palette.background.default,
    borderRight: 'none',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: theme.palette.background.default,
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
    borderRight: 'none',
});

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,

    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
    }),
}));

export default function Navbar(props) {
    const { children } = props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [sidebarApps, setSidebarApps] = useState(null);
    const [isOrderChanged, setIsOrderChanged] = useState(false);
    const [editable, setEditable] = useState(false);
    const [collapseDrawer, setCollapseDrawer] = useState(true);
    const [drawerHover, setDrawerHover] = useState(false);
    const {
        modalState: feedbackState,
        openModal: openFeedback,
        closeModal: closeFeedback,
    } = useModal();
    const { showError, showResponse } = useMessage();
    const location = useLocation();
    const user = useUser();
    const matches = useMediaQuery('(min-width:1024px)', { noSsr: true });

    const { toggleTheme, mode } = useTheme();
    const theme = useMuiTheme();

    // useMenu
    const {
        anchorEl: anchorElProfile,
        openMenu: openProfileMenu,
        closeMenu: closeProfileMenu,
    } = useMenu();

    const {
        anchorEl: anchorElSettings,
        openMenu: openSettingsMenu,
        closeMenu: closeSettingsMenu,
    } = useMenu();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleDrawerOpen = () => {
        setCollapseDrawer(!collapseDrawer);
    };

    const onDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) return;

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        )
            return;

        setIsOrderChanged(true);

        const draggingJob = sidebarApps[source.index];
        sidebarApps.splice(source.index, 1);

        sidebarApps.splice(destination.index, 0, draggingJob);
        setSidebarApps([...sidebarApps]);
    };

    const getPlatforms = useCallback(async () => {
        try {
            const response = await axios.get(
                '/platforms?sortBy=name&direction=1',
                {
                    baseURL: env('AUTHENTICATION_SERVER'),
                }
            );

            const { success, errors, platforms } = response.data;

            if (!success) return showError(errors);

            const SidebarApps = platforms?.filter(
                (platform) => platform.slug !== 'e-sign'
            ); // Platform to exclude from list

            SidebarApps.forEach((app, i) => (app.order = i + 1));

            const arrangedOrder = [];
            user?.personalize?.appsOrder.forEach((order) => {
                SidebarApps.forEach((app, i) => {
                    if (order === app.order) {
                        arrangedOrder.push(app);
                        SidebarApps.splice(i, 1);
                    }
                });
            });

            if (arrangedOrder.length)
                setSidebarApps([...arrangedOrder, ...SidebarApps]);
            else setSidebarApps(SidebarApps);
        } catch (e) {
            console.log(e);
        }
    }, [user, showError]);

    const saveOrder = async () => {
        const accessToken = getCookie('accessToken');
        const appsOrder = sidebarApps.map((app) => app.order);

        try {
            const response = await axios.patch(
                '/user/personalize',
                { appsOrder },
                {
                    baseURL: env('AUTHENTICATION_SERVER'),
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );

            const { success, errors } = response.data;

            if (!success) return showError(errors);

            setCookie('side_apps_order', appsOrder);
            showResponse('Setting updated');
        } catch (e) {
            handleAxiosError(e, showError);
        } finally {
            setIsOrderChanged(false);
        }
    };

    const signOut = () => {
        clearCookie('accessToken');
        clearCookie('role');
        clearCookie('setupCompleted');

        const redirectTo =
            env('AUTHENTICATION_CLIENT') +
            '/login?redirectto=' +
            encodeURIComponent(env('DOMAIN'));
        window.location.replace(redirectTo);
    };

    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname, location.hash]);

    useEffect(() => {
        user && getPlatforms();
    }, [user, getPlatforms]);

    const drawer = (
        <Box
            minHeight='100dvh'
            color='text.secondary'
            display='flex'
            flexDirection='column'
        >
            <Box
                display='flex'
                alignItems='center'
                justifyContent='center'
                position='relative'
                component={Link}
                to='/'
                sx={{ textDecoration: 'none', color: 'text.primary', py: 1 }}
            >
                <Image
                    alt='#logo'
                    cdn='clikkle/logo/2023/clikkle.png'
                    sx={{ height: '50px' }}
                />
                <Typography
                    variant='h5'
                    fontWeight={500}
                    sx={{ ml: 1, color: '#808282' }}
                >
                    Clikkle
                </Typography>
                <Typography
                    variant='h5'
                    fontWeight={400}
                    color='text.tertiary'
                    sx={{ ml: 1, color: '#949697' }}
                >
                    Account
                </Typography>

                <Typography
                    color='text.secondary'
                    variant='body2'
                    fontWeight='bold'
                    sx={{ position: 'absolute', bottom: 3, left: '27%' }}
                >
                    Beta
                </Typography>
            </Box>

            <Box
                sx={{
                    overflowY: 'auto',
                    height: 'calc(100dvh - 90px)',
                    flexGrow: 1,
                }}
            >
                <Typography
                    variant='body2'
                    pl={3}
                    mt={1.5}
                    fontSize='14px'
                    fontWeight={500}
                >
                    My account
                </Typography>
                <List sx={{ px: 3 }}>
                    {/* {sidebarLinks.map((link) => (
                        <NavLink
                            to={link.to}
                            key={link.name}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            {({ isActive }) => (
                                <ListItem disablePadding>
                                    <ListItemButton
                                        selected={isActive}
                                        disableRipple
                                        disableTouchRipple
                                        variant='sidebarButton'
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: '35px',
                                                color: 'text.secondary',
                                            }}
                                        >
                                            {link.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={link.name} />
                                    </ListItemButton>
                                </ListItem>
                            )}
                        </NavLink>
                    ))} */}
                </List>
            </Box>

            <Box>
                <Divider variant='middle' />
                <Typography
                    variant='body2'
                    pl={3}
                    mt={1.5}
                    fontSize='14px'
                    fontWeight={500}
                >
                    Storage
                </Typography>

                <Box px={3} pb={3}>
                    <LinearProgress
                        variant='determinate'
                        value={20}
                        color='primary'
                        sx={{ borderRadius: '2px', mt: 1 }}
                    />
                    <Typography
                        variant='caption'
                        component='div'
                        mt={1}
                        color='primary.main'
                    >
                        1 GB used of 5 GB
                    </Typography>
                    <Button
                        variant='contained'
                        color='primary'
                        startIcon={<CloudOutlinedIcon fontSize='small' />}
                        sx={{ mt: 1, color: 'white' }}
                        href={env('MY_ACCOUNT')}
                        fullWidth
                    >
                        Upgrade storage
                    </Button>
                </Box>
                <Divider
                    variant='middle'
                    sx={{ display: { xs: 'block', sm: 'none' } }}
                />
                <List sx={{ px: 1, display: { xs: 'block', sm: 'none' } }}>
                    <ListItem
                        disablePadding
                        onClick={openSettingsMenu}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'custom.cardHover',
                                borderRadius: '8px',
                            },
                        }}
                    >
                        <ListItemButton
                            disableRipple
                            disableTouchRipple
                            variant='sidebarButton'
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: '30px',
                                    color: 'text.secondary',
                                }}
                            >
                                <SettingsIcon fontSize='small' />
                            </ListItemIcon>
                            <ListItemText
                                primary='Settings'
                                primaryTypographyProps={{ fontSize: 14 }}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>

                <Stack
                    direction='row'
                    justifyContent='center'
                    my={1}
                    sx={{ display: { xs: 'none', sm: 'flex' } }}
                >
                    <MuiLink
                        display='inline-flex'
                        alignItems='center'
                        color='text.secondary'
                        sx={{ cursor: 'pointer' }}
                        onClick={openFeedback}
                    >
                        <MicrophoneIcon />
                        <Typography variant='caption' fontWeight='bold'>
                            Give feedback
                        </Typography>
                    </MuiLink>
                </Stack>
            </Box>
        </Box>
    );
    const miniDrawer = (
        <Box
            minHeight='100dvh'
            color='text.secondary'
            display='flex'
            flexDirection='column'
        >
            <Box
                display='flex'
                alignItems='center'
                justifyContent='center'
                component={Link}
                mb={1.5}
                to='/'
                sx={{ textDecoration: 'none', color: 'text.primary', py: 1 }}
            >
                <Image
                    alt='#logo'
                    cdn='clikkle/logo/2023/clikkle.png'
                    sx={{ height: '50px' }}
                />
            </Box>

            <Box
                sx={{
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    height: 'calc(100dvh - 90px)',
                    flexGrow: 1,
                }}
            >
                <List sx={{ px: 1, pb: 0 }}>
                    {/* {sidebarLinks.map((link) => (
                        <NavLink
                            to={link.to}
                            key={link.name}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            {({ isActive }) => (
                                <ListItem disablePadding>
                                    <ListItemButton
                                        selected={isActive}
                                        disableRipple
                                        disableTouchRipple
                                        variant='sidebarButton'
                                        sx={{ height: '45px', my: '2px' }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: '35px',
                                                color: 'text.secondary',
                                            }}
                                        >
                                            {link.icon}
                                        </ListItemIcon>
                                    </ListItemButton>
                                </ListItem>
                            )}
                        </NavLink>
                    ))} */}
                </List>
            </Box>
        </Box>
    );
    return (
        <Box
            sx={{
                bgcolor: 'background.default',
                px: { xs: 0.5, xm: 0 },
                height: '100dvh',
                position: 'relative',
            }}
        >
            <AppBar
                elevation={0}
                component={Box}
                position='sticky'
                sx={{
                    width: {
                        xs: '100%',
                        xm:
                            collapseDrawer && !drawerHover
                                ? `calc(100% - ${drawerWidth}px)`
                                : `calc(100% - ${miniDrawerWidth}px )`,
                    },
                    ml: {
                        xm:
                            collapseDrawer && !drawerHover
                                ? `${drawerWidth}px`
                                : `${miniDrawerWidth}px`,
                    },
                    backgroundColor: 'background.default',

                    borderBottom: '1px solid custom.border',
                    // borderBottomColor: 'custom.border',
                    color: 'text.primary',
                    transition: 'ease-in-out 225ms, background-color 0s',
                }}
            >
                <Toolbar
                    sx={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        position: 'relative',
                        '&': {
                            minHeight: '64px',
                            px: 1,
                        },
                    }}
                >
                    <Grid container alignItems='center' columnSpacing={1}>
                        <Grid item>
                            <IconButton
                                onClick={
                                    matches
                                        ? handleDrawerOpen
                                        : handleDrawerToggle
                                }
                                edge='start'
                                sx={{
                                    ml: 0.2,
                                    mr: 1,
                                }}
                            >
                                <MenuIcon sx={{ fontSize: '30px' }} />
                            </IconButton>
                        </Grid>

                        <Grid item xs md={5} alignItems='start'>
                            <SearchBar />
                        </Grid>
                        <Grid item xs display={{ xs: 'none', sm: 'block' }}>
                            <Stack
                                direction='row'
                                alignItems='center'
                                justifyContent='flex-end'
                                spacing={0}
                            >
                                <IconButton onClick={openSettingsMenu}>
                                    <SettingsIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorElSettings}
                                    open={Boolean(anchorElSettings)}
                                    onClose={closeSettingsMenu}
                                >
                                    <MenuItem onClick={toggleTheme}>
                                        <ListItemIcon>
                                            {mode === 'dark' ? (
                                                <LightModeIcon fontSize='small' />
                                            ) : (
                                                <DarkModeIcon fontSize='small' />
                                            )}
                                        </ListItemIcon>
                                        Appearance
                                    </MenuItem>
                                </Menu>

                                <Link to='http://apps.clikkle.com/'>
                                    <IconButton>
                                        <AppsIcon />
                                    </IconButton>
                                </Link>
                            </Stack>
                        </Grid>
                        <Grid item>
                            <IconButton
                                onClick={openProfileMenu}
                                sx={{
                                    borderWidth: '2px',
                                    borderStyle: 'solid',
                                    borderColor: 'primary.main',
                                    p: '3px',
                                }}
                            >
                                <Avatar
                                    alt='Remy Sharp'
                                    src='data:image/jpeg;base64,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'
                                    sx={{ width: 30, height: 30 }}
                                />
                            </IconButton>

                            <Menu
                                anchorEl={anchorElProfile}
                                open={Boolean(anchorElProfile)}
                                onClose={closeProfileMenu}
                                sx={{
                                    '.MuiPaper-root.MuiMenu-paper.MuiPopover-paper':
                                        {
                                            width: 'min(100%, 320px)',
                                            boxShadow:
                                                'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
                                            border: '1px solid #00000017',
                                            bgcolor: 'custom.menu',
                                            px: 0.5,
                                            pt: 1.5,
                                        },
                                }}
                            >
                                <Grid
                                    container
                                    spacing={2}
                                    alignItems='center'
                                    flexWrap='nowrap'
                                >
                                    <Grid item>
                                        <Avatar
                                            alt='Remy Sharp'
                                            src='https://shorturl.at/fjqz9'
                                            sx={{ width: 100, height: 100 }}
                                        />
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Typography
                                            variant='substitle1'
                                            component='div'
                                            fontWeight={600}
                                            sx={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                            }}
                                        >
                                            {user.firstName +
                                                ' ' +
                                                user.lastName}
                                        </Typography>
                                        <Typography
                                            variant='caption'
                                            component='div'
                                            sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {user.email}
                                        </Typography>
                                        <Typography
                                            variant='caption'
                                            component='a'
                                            href={env('MY_ACCOUNT')}
                                            color='primary.main'
                                            display='block'
                                        >
                                            My Clikkle account
                                        </Typography>
                                        <Typography
                                            variant='caption'
                                            component='a'
                                            href='#'
                                            color='primary.main'
                                            display='block'
                                        >
                                            My Profile
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Stack direction='row' mt={2}>
                                    <Button variant='text' fullWidth>
                                        Add account
                                    </Button>
                                    <Button
                                        variant='text'
                                        onClick={signOut}
                                        fullWidth
                                    >
                                        Sign out
                                    </Button>
                                </Stack>
                            </Menu>
                        </Grid>
                    </Grid>
                </Toolbar>

                <Box
                    sx={{
                        width: appsWidth,
                        display: { xs: 'none', xm: 'block' },
                        backgroundColor: 'background.default',
                        zIndex: '1200',
                        position: 'absolute',
                        right: 0,
                        top: 65,
                    }}
                >
                    <Stack
                        direction='column'
                        justifyContent='center'
                        alignItems='center'
                        spacing={1}
                        overflow='hidden'
                        px={0.8}
                    >
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable
                                droppableId='apps'
                                isDropDisabled={!editable}
                            >
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        {sidebarApps ? (
                                            sidebarApps.map((app, i) => (
                                                <Draggable
                                                    key={app.order}
                                                    draggableId={app.name}
                                                    index={i}
                                                    isDragDisabled={!editable}
                                                >
                                                    {(provided) => (
                                                        <div
                                                            ref={
                                                                provided.innerRef
                                                            }
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <ActionIcon
                                                                title={
                                                                    editable
                                                                        ? ''
                                                                        : app.name
                                                                }
                                                                href={app.url}
                                                                src={app.logo}
                                                                key={app.order}
                                                                sx={{
                                                                    mt: 0.8,
                                                                    width: 'auto',
                                                                }}
                                                                imageSx={{
                                                                    filter:
                                                                        editable &&
                                                                        `drop-shadow(0px 2px 2px ${theme.palette.primary.main})`,
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))
                                        ) : (
                                            <Box mt={2}>
                                                {Array(8)
                                                    .fill(0)
                                                    .map((_, i) => (
                                                        <Skeleton
                                                            variant='circular'
                                                            animation='wave'
                                                            key={i}
                                                            width={35}
                                                            height={35}
                                                            sx={{ mb: 2 }}
                                                        />
                                                    ))}
                                            </Box>
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                        <Divider
                            variant='middle'
                            sx={{ my: 2, width: '80%' }}
                        />
                        {editable ? (
                            <ActionIcon
                                title='Save'
                                icon={<DoneIcon fontSize='small' />}
                                onClick={() => {
                                    setEditable(false);
                                    if (isOrderChanged) saveOrder();
                                }}
                            />
                        ) : (
                            <ActionIcon
                                title='Edit'
                                icon={<EditIcon fontSize='small' />}
                                onClick={() => setEditable(true)}
                            />
                        )}
                    </Stack>
                </Box>
            </AppBar>

            <Box
                component='nav'
                sx={{
                    width: { xm: drawerWidth },
                    flexShrink: { sm: 0 },
                    bgcolor: 'custom.menu',
                }}
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <MuiDrawer
                    variant='temporary'
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', xm: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            bgcolor: 'custom.menu',
                        },
                    }}
                >
                    {drawer}
                </MuiDrawer>
                <Drawer
                    variant='permanent'
                    open={collapseDrawer}
                    hover={drawerHover}
                    onMouseOver={() => {
                        if (!collapseDrawer) {
                            setCollapseDrawer(true);
                            setDrawerHover(true);
                        }
                    }}
                    onMouseLeave={() => {
                        if (drawerHover) {
                            setCollapseDrawer(false);
                            setDrawerHover(false);
                        }
                    }}
                    sx={{
                        display: { xs: 'none', xm: 'block' },
                        p: 0,
                        '& .MuiDrawer-paper': {
                            boxShadow: drawerHover
                                ? 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
                                : 'none',
                        },
                    }}
                >
                    {collapseDrawer ? drawer : miniDrawer}
                </Drawer>
            </Box>

            <Box
                component='main'
                sx={{
                    width: {
                        xs: '100%',
                        xm:
                            collapseDrawer && !drawerHover
                                ? `calc(100% - ${drawerWidth + appsWidth}px)`
                                : `calc(100% - ${
                                      appsWidth + miniDrawerWidth
                                  }px )`,
                    },
                    ml: {
                        xm:
                            collapseDrawer && !drawerHover
                                ? `${drawerWidth}px`
                                : `${miniDrawerWidth}px`,
                    },
                    mt: 1,
                    height: { xs: 'calc(100dvh - 90px)' },
                    backgroundColor: 'background.paper',
                    borderRadius: '12px',
                }}
            >
                {children}
            </Box>

            <Modal
                open={feedbackState}
                onClose={closeFeedback}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                }}
            >
                <>
                    <Feedback closeModal={closeFeedback} />
                </>
            </Modal>
        </Box>
    );
}
