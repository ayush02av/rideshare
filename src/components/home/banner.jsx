import { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    List,
    ListItem,
    ListItemText,
} from '@mui/material/'

import rider from "../../assets/images/rider.webp"
import driver from "../../assets/images/driver.jpg"

const Banner = (props) => {
    const [bannerState, setBannerState] = useState('rider');

    return (
        <Box sx={{
            display: `grid`,
            placeItems: `left`,
            backgroundImage: `url(${bannerState == "rider" ? rider : driver})`,
            backgroundSize: `100% 100%`,
            backgroundRepeat: `no-repeat`,
            backgroundAttachment: `fixed`,
        }}>
            <Box sx={{
                background: `white`,
                height: `300px`,
                width: `40%`,
                margin: `80px 0`,
                marginLeft: `6%`,
                padding: `20px`,
                borderRadius: `1px`,
                '@media (max-width: 780px)': {
                    margin: `0`,
                    width: `calc(100% - 40px)`
                }
            }}>
                <Box>
                    <Button
                        sx={{
                            ...(
                                bannerState == 'rider' ? {
                                    backgroundColor: `primary.dark`,
                                    color: `primary.light`
                                } : {
                                    backgroundColor: `primary.light`,
                                    color: `primary.dark`
                                }
                            ),
                            '&:hover': {
                                ...(
                                    bannerState == 'rider' ? {
                                        backgroundColor: `primary.dark`,
                                        color: `primary.light`
                                    } : {
                                        backgroundColor: `primary.light`,
                                        color: `primary.dark`
                                    }
                                )
                            }
                        }}
                        onClick={() => {
                            setBannerState('rider')
                        }}>
                        Rider
                    </Button>

                    <Button
                        sx={{
                            ...(
                                bannerState == 'driver' ? {
                                    backgroundColor: `primary.dark`,
                                    color: `primary.light`
                                } : {
                                    backgroundColor: `primary.light`,
                                    color: `primary.dark`
                                }
                            ),
                            '&:hover': {
                                ...(
                                    bannerState == 'driver' ? {
                                        backgroundColor: `primary.dark`,
                                        color: `primary.light`
                                    } : {
                                        backgroundColor: `primary.light`,
                                        color: `primary.dark`
                                    }
                                )
                            }
                        }}
                        onClick={() => {
                            setBannerState('driver')
                        }}>
                        Driver
                    </Button>
                </Box>

                <Box sx={{
                    marginTop: `10px`
                }}>
                    {
                        bannerState == 'rider' && (
                            <Box>
                                <Typography variant='body1' sx={{
                                    fontWeight: `550`,
                                    fontSize: `30px`,
                                }}>
                                    Request a Ride Now
                                </Typography>
                                <List>
                                    <ListItem>
                                        <ListItemText primary="Scan &amp; Select Your Ride" secondary="Pick Destination &amp; Book Your Ride" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary="Get Several Options to Select From" secondary="Mini, Sedan, SUV, Luxury" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary={
                                            <Button sx={{
                                                backgroundColor: `primary.dark`,
                                                color: `primary.light`,
                                                '&:hover': {
                                                    backgroundColor: `primary.light`,
                                                    color: `primary.dark`,
                                                }
                                            }}
                                                onClick={() => {
                                                    props.redirectTo('rider')
                                                }}
                                            >
                                                Start Booking!
                                            </Button>
                                        } />
                                    </ListItem>
                                </List>
                            </Box>
                        )
                    }
                    {
                        bannerState == 'driver' && (
                            <Box>
                                <Typography variant='h4' sx={{
                                    fontWeight: `550`,
                                    fontSize: `30px`,
                                }}>
                                    Become a Driver Partner Today!
                                </Typography>
                                <List>
                                    <ListItem>
                                        <ListItemText primary="Earn Money By Driving" secondary="Register your Vehicle Today" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary="Accept / Start / End Rides from your Driver Dashboard" secondary="Get Personal QR For Passengers to Scan" />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary={
                                            <Button sx={{
                                                backgroundColor: `primary.dark`,
                                                color: `primary.light`,
                                                '&:hover': {
                                                    backgroundColor: `primary.light`,
                                                    color: `primary.dark`,
                                                }
                                            }}
                                                onClick={() => {
                                                    props.redirectTo('driver')
                                                }}
                                            >
                                                Driver Portal
                                            </Button>
                                        } />
                                    </ListItem>
                                </List>
                            </Box>
                        )
                    }
                </Box>
            </Box>
            <Box component="img" src={bannerState == "rider" ? rider : driver} sx={{
                display: `none`,
                '@media (max-width: 780px)': {
                    display: `unset`
                }
            }} alt="rider" />
        </Box >
    )
}

export default Banner;