import { createTheme } from '@mui/material';
import React, { useMemo, useContext, useState, createContext, useLayoutEffect } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { getCookie, setCookie } from '../utils/cookies';

const ThemeContext = createContext({ toggleTheme: () => {} });

const ThemeContextProvider = props => {
    const preferTheme = systemPreferTheme();
    const [mode, setMode] = useState(preferTheme || 'dark');

    function toggleTheme() {
        setMode(prevMode => {
            const theme = prevMode === 'light' ? 'dark' : 'light';
            setCookie('P13N', theme);
            return theme;
        });
    }

    function systemPreferTheme() {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
        else if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
        else return 'dark';
    }

    useLayoutEffect(() => {
        console.log('useLayout');
        const theme = getCookie('P13N');
        if (theme) setMode(theme || preferTheme);
    }, [mode, preferTheme]);

    const light = useMemo(
        () => ({
            background: {
                paper: '#FFFFFF',
                default: '#F7F9FC',
            },
            divider: '#e7e3e3',
            custom: {
                search: {
                    main: '#edf2fc',
                    focus: 'white',
                },
                border: '#e7e3e3',
                hoverColor: '#45B5E8',
                common: 'white',
                color: 'rgba(0, 0, 0, 0.87)',
                appsHover: 'rgb(232, 240, 254)',
                menu: '#FFFFFF',
                cardHover: '#E1E5EA',
                trashCaption: '#E3E3E3',
                selectedCard: '#c2e7ff',
                selectedMove: '#c2e7ff',
                selectedPanel: '#f2f6fc',
                response: '#2f2e2e',
                selectedHover: '#B3D7EF',
                shareHover: 'rgb(140 140 140 / 15%)',
                uploadButton: '#FFF',
                uploadButtonHover: '#EDF2FA',
            },
        }),
        []
    );

    const dark = useMemo(
        () => ({
            background: {
                default: '#0f1012',
                paper: '#1d1e20',
            },
            text: {
                secondary: '#818991',
            },
            divider: '#424242',
            dividerHover: '#42424266',
            custom: {
                search: {
                    main: '#1A1A1A',
                    focus: '#2F2F2F',
                },
                border: '#616161',
                hoverColor: '#fff',
                common: 'black',
                appsHover: 'rgb(39, 46, 58)',
                menu: '#000000',
                cardHover: '#2F2F2F',
                trashCaption: '#2f2e2e',
                selectedCard: '#2f2e2e',
                selectedPanel: '#2f2e2e',
                selectedMove: '#44b5e899',
                response: 'white',
                selectedHover: 'rgba(255, 255, 255, 0.08)',
                shareHover: 'rgba(255, 255, 255, 0.08)',
                uploadButton: '#2F2F2F',
                uploadButtonHover: '#141414',
            },
        }),
        []
    );

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        main: '#1ad16d',
                    },

                    ...(mode === 'light' ? light : dark),
                },
                breakpoints: {
                    keys: ['xs', 'sm', 'md', 'xm', 'lg', 'xl', 'xxl'],
                    values: {
                        xs: 0,
                        sm: 576,
                        md: 768,
                        xm: 1024,
                        lg: 1280,
                        xl: 1516,
                        xxl: 1756,
                    },
                },
                components: {
                    MuiCssBaseline: {
                        styleOverrides: theme => ({
                            body: {
                                '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                                    backgroundColor: 'transparent',
                                    width: '6px',
                                },
                                '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                                    borderRadius: 8,
                                    backgroundColor: theme.palette.divider,
                                    // backgroundColor: 'red',
                                },
                                '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus':
                                    {
                                        backgroundColor: '#747775',
                                    },
                                '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active':
                                    {
                                        backgroundColor: '#747775',
                                    },
                                '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover':
                                    {
                                        backgroundColor: '#747775',
                                    },
                            },
                        }),
                    },

                    MuiDivider: {
                        styleOverrides: {
                            light: {
                                borderColor: '#424242',
                                width: '100%',
                            },
                        },
                    },
                    MuiListItemButton: {
                        variants: [
                            {
                                props: { variant: 'sidebarButton' },
                                style: ({ theme }) => ({
                                    padding: '2px 15px',
                                    cursor: 'pointer',
                                    color: theme.palette.text.secondary,

                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                    },

                                    '&.Mui-selected': {
                                        backgroundColor: 'transparent',

                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                        },

                                        '.MuiListItemIcon-root': {
                                            color: theme.palette.primary.main,
                                        },
                                        '.MuiListItemText-root': {
                                            color: theme.palette.primary.main,
                                        },
                                    },
                                }),
                            },
                        ],
                    },
                    MuiButton: {
                        variants: [
                            {
                                props: { variant: 'contained' },
                                style: ({ theme }) => ({ color: theme.palette.common.white }),
                            },
                        ],
                        styleOverrides: {
                            root: {
                                textTransform: 'none',
                            },
                        },
                    },
                    MuiTextField: {
                        styleOverrides: {
                            root: {
                                marginBottom: '16px',
                            },
                        },
                    },
                    MuiMenu: {
                        styleOverrides: {
                            root: {
                                // '.MuiPaper-root.MuiMenu-paper.MuiPopover-paper': {
                                //     minWidth: '180px',
                                // },
                                '.MuiMenu-list': {
                                    padding: '5px',
                                },
                                '.MuiButtonBase-root.MuiMenuItem-root': {
                                    fontSize: '14px',
                                },
                            },
                        },
                    },

                    MuiTab: {
                        styleOverrides: {
                            root: {
                                textTransform: 'capitalize',
                            },
                        },
                    },
                },
            }),
        [mode, dark, light]
    );

    return (
        <ThemeContext.Provider value={{ toggleTheme, mode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {props.children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

export default ThemeContextProvider;

const useTheme = () => {
    const toggleTheme = useContext(ThemeContext).toggleTheme;
    const mode = useContext(ThemeContext).mode;
    return { toggleTheme, mode };
};

export { useTheme };
