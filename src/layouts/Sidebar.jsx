import {
    Box,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
    Link as MuiLink,
    Modal,
} from '@mui/material';
import React from 'react';
import Image from '../components/Image';
import { NavLink, Link } from 'react-router-dom';
import { Dashboard, Account } from '../data/sidebar';
import MicrophoneIcon from '../components/MicrophoneIcon';
import useModal from '../hooks/useModal';
import Feedback from './Feedback';

const Sidebar = () => {
    const {
        modalState: feedbackState,
        openModal: openFeedback,
        closeModal: closeFeedback,
    } = useModal();

    return (
        <>
            <Box minHeight='100dvh' color='text.secondary' display='flex' flexDirection='column'>
                <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='center'
                    component={Link}
                    to='/'
                    sx={{ textDecoration: 'none', color: 'text.primary', py: 3 }}>
                    <Image alt='#logo' name='logo.png' sx={{ height: '30px' }} />
                    {/* <Typography variant='h5' fontWeight={500} sx={{ ml: 1, color: '#808282' }}>
                        React
                    </Typography>
                    <Typography
                        variant='h5'
                        fontWeight={400}
                        color='text.tertiary'
                        sx={{ ml: 1, color: '#949697' }}>
                        Dashboard
                    </Typography> */}
                </Box>

                <Divider variant='middle' />
                <Box
                    sx={{
                        // overflowY: 'auto',
                        // height: 'calc(100dvh - 90px)',
                        flexGrow: 1,
                        mt: 2,
                    }}>
                    <Typography variant='body2' pl={3} mt={1.5} fontSize='14px' fontWeight={500}>
                        Dashboard
                    </Typography>
                    <List sx={{ px: 3 }}>
                        {Dashboard.map(link => (
                            <NavLink
                                to={link.to}
                                key={link.name}
                                style={{ textDecoration: 'none', color: 'inherit' }}>
                                {({ isActive }) => (
                                    <ListItem disablePadding>
                                        <ListItemButton
                                            selected={isActive}
                                            disableRipple
                                            disableTouchRipple
                                            variant='sidebarButton'>
                                            <ListItemIcon
                                                sx={{
                                                    minWidth: '35px',
                                                    color: 'text.secondary',
                                                }}>
                                                {link.icon}
                                            </ListItemIcon>
                                            <ListItemText primary={link.name} />
                                        </ListItemButton>
                                    </ListItem>
                                )}
                            </NavLink>
                        ))}
                    </List>
                    <Typography variant='body2' pl={3} mt={1.5} fontSize='14px' fontWeight={500}>
                        Account
                    </Typography>
                    <List sx={{ px: 3 }}>
                        {Account.map(link => (
                            <NavLink
                                to={link.to}
                                key={link.name}
                                style={{ textDecoration: 'none', color: 'inherit' }}>
                                {({ isActive }) => (
                                    <ListItem disablePadding>
                                        <ListItemButton
                                            selected={isActive}
                                            disableRipple
                                            disableTouchRipple
                                            variant='sidebarButton'>
                                            <ListItemIcon
                                                sx={{
                                                    minWidth: '35px',
                                                    color: 'text.secondary',
                                                }}>
                                                {link.icon}
                                            </ListItemIcon>
                                            <ListItemText primary={link.name} />
                                        </ListItemButton>
                                    </ListItem>
                                )}
                            </NavLink>
                        ))}
                    </List>
                </Box>

                <Box>
                    <Divider variant='middle' />

                    <Stack
                        direction='row'
                        justifyContent='center'
                        my={1}
                        sx={{ display: { xs: 'none', sm: 'flex' } }}>
                        <MuiLink
                            display='inline-flex'
                            alignItems='center'
                            color='text.secondary'
                            sx={{ cursor: 'pointer' }}
                            onClick={openFeedback}>
                            <MicrophoneIcon />
                            <Typography variant='caption' fontWeight='bold'>
                                Give feedback
                            </Typography>
                        </MuiLink>
                    </Stack>
                </Box>
            </Box>
            <Modal
                open={feedbackState}
                onClose={closeFeedback}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                }}>
                <>
                    <Feedback closeModal={closeFeedback} />
                </>
            </Modal>
        </>
    );
};

export default Sidebar;
