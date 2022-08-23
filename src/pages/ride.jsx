import { useState, useEffect } from "react"
import { useParams } from 'react-router-dom'

import axios from "axios"
import {
    BackendVehicleApi,
    BackendRideApi
} from '../external/backend'

import {
    Box,
    Button,
    Typography,
} from '@mui/material/';

function Ride(props) {

    const [vehicle, setVehicle] = useState()
    const { id } = useParams()

    const [pickupLocation, setPickupLocation] = useState('Red Fort, Ring Road, Chandni Chowk, Delhi - 110003, Delhi, India')
    const [pickupCoords, setPickupCoords] = useState(`${28.6542},${77.2373}`)

    const [destinationLocation, setDestinationLocation] = useState(localStorage.getItem('destinationLocation') || '')
    const [destinationCoords, setDestinationCoords] = useState(localStorage.getItem('destinationCoords') || null)

    useEffect(() => {
        if (
            (localStorage.getItem('token') === null)
            ||
            (localStorage.getItem('token_type') != 'rider')
        ) {
            window.location.href = '/login/rider';
        }

        axios({
            url: BackendVehicleApi(`available/${id}/`),
            method: "GET",
            headers: props.headers
        })
            .then((res) => {
                console.log(res)
                setVehicle(res.data);
            })
            .catch((err) => {
                console.log(err)
                window.location = '/'
            })
    }, []);

    const bookMyRide = () => {
        axios({
            url: BackendRideApi(`book/${id}/`),
            method: "POST",
            data: {
                pickupLocation,
                pickupCoords,
                destinationLocation,
                destinationCoords
            },
            headers: props.headers
        })
            .then(res => {
                console.log(res.data)
                Swal.fire({
                    'title': "Booked",
                    'type': 'success'
                }).then((result) => {
                    setUsername('')
                    setPassword('')
                })
            })
            .catch(err => {
                console.log(err.response.data)
                Swal.fire({
                    'title': err.response.data,
                    'text': `Booking failed`,
                    'type': 'error'
                })
            })
    }

    return (
        <Box>
            <Box sx={{
                margin: `30px 25%`,
                padding: `20px`,
                textAlign: `center`,
                backgroundColor: `primary.dark`,
                color: `primary.light`,
                '@media (max-width: 780px)': {
                    margin: `30px 5%`,
                }
            }}>
                <Typography variant="h3" >Confirm Your Ride</Typography>
                <Typography variant="body1">
                    Make sure to re-check your Pickup &amp; Destination Location.
                </Typography>
            </Box>

            <Box sx={{
                margin: `0 10%`
            }}>
                <Box sx={{
                    backgroundColor: `secondary.dark`,
                    color: `secondary.light`,
                    padding: `20px`,
                    margin: `10px 0`,
                    borderRadius: `3px`
                }}>
                    <Typography variant="h4">Pickup</Typography>
                    <br />
                    <Typography sx={{ display: `inline` }} variant="h6">Location: </Typography>
                    <Typography sx={{ display: `inline` }} variant="body1">{pickupLocation && pickupLocation}</Typography>
                    <br />
                    <Typography sx={{ display: `inline` }} variant="h6">Coordinates: </Typography>
                    <Typography sx={{ display: `inline` }} variant="body1">{pickupCoords && pickupCoords}</Typography>
                    <br />
                    <Box sx={{
                        width: `100%`,
                        height: `500px`,
                        '@media (max-width: 780px)': {
                            height: `200px`
                        }
                    }}>
                        {
                            pickupCoords && (
                                <iframe
                                    style={{
                                        width: `100%`,
                                        height: `100%`
                                    }}
                                    frameborder="0" scrolling="no" marginheight="0" marginwidth="0"
                                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${pickupCoords.split(',')[1]}%2C${pickupCoords.split(',')[0]}%2C${pickupCoords.split(',')[1]}%2C${pickupCoords.split(',')[0]}&amp;layer=mapnik&amp;marker=${pickupCoords.split(',')[0]}%2C${pickupCoords.split(',')[1]}`}
                                />
                            )
                        }
                    </Box>
                </Box>
            </Box >

            <Box sx={{
                margin: `0 10%`
            }}>
                <Box sx={{
                    backgroundColor: `secondary.dark`,
                    color: `secondary.light`,
                    padding: `20px`,
                    margin: `10px 0`,
                    borderRadius: `3px`
                }}>
                    <Typography variant="h4">Destination</Typography>
                    <br />
                    <Typography sx={{ display: `inline` }} variant="h6">Location: </Typography>
                    <Typography sx={{ display: `inline` }} variant="body1">{destinationLocation && destinationLocation}</Typography>
                    <br />
                    <Typography sx={{ display: `inline` }} variant="h6">Coordinates: </Typography>
                    <Typography sx={{ display: `inline` }} variant="body1">{destinationCoords && destinationCoords}</Typography>
                    <br />
                    <Box sx={{
                        width: `100%`,
                        height: `500px`,
                        '@media (max-width: 780px)': {
                            height: `200px`
                        }
                    }}>
                        {
                            destinationCoords && (
                                <iframe
                                    style={{
                                        width: `100%`,
                                        height: `100%`
                                    }}
                                    frameborder="0" scrolling="no" marginheight="0" marginwidth="0"
                                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${destinationCoords.split(',')[1]}%2C${destinationCoords.split(',')[0]}%2C${destinationCoords.split(',')[1]}%2C${destinationCoords.split(',')[0]}&amp;layer=mapnik&amp;marker=${destinationCoords.split(',')[0]}%2C${destinationCoords.split(',')[1]}`}
                                />
                            )
                        }
                    </Box>
                </Box>
            </Box >

            {
                vehicle && (
                    <Box sx={{
                        margin: `0 10%`
                    }}>
                        <Box sx={{
                            backgroundColor: `secondary.dark`,
                            color: `secondary.light`,
                            padding: `20px`,
                            margin: `10px 0`,
                            borderRadius: `3px`
                        }}>
                            <Typography variant="h4">My Ride</Typography>
                            <br />
                            <Typography variant="h6">{vehicle.vehicle_name} | {vehicle.vehicle_type}</Typography>
                            <Typography variant="body1">INR {vehicle.vehicle_fare_per_km}/km</Typography>
                            <br />
                            <Typography variant="body1">
                                Driver :&nbsp;
                                {vehicle.vehicle_driver.driver_account.first_name} {vehicle.vehicle_driver.driver_account.last_name}
                            </Typography>
                            <br />
                            <Button onClick={bookMyRide} variant="outlined"
                                sx={{
                                    backgroundColor: `primary.dark`,
                                    color: `primary.light`,
                                    '&:hover': {
                                        backgroundColor: `primary.light`,
                                        color: `primary.dark`,
                                    }
                                }}
                            >
                                Book My Ride!
                            </Button>
                        </Box>
                    </Box >
                )
            }
        </Box >
    )
}

export default Ride
