import { useState, useEffect } from "react";

import axios from "axios";
import {
    BackendVehicleApi
} from '../external/backend';

import {
    Box,
    Button,
    Typography,
    TextField,
} from '@mui/material/';

const Rider = (props) => {

    const [vehicles, setVehicles] = useState()

    const [pickupLocation, setPickupLocation] = useState(localStorage.getItem('pickupLocation') || '')
    const [pickupCoords, setPickupCoords] = useState(localStorage.getItem('pickupCoords') || null)

    const [pickupLocationFound, setPickupLocationFound] = useState((localStorage.getItem('pickupLocation') ? true : false))

    const [destinationLocation, setDestinationLocation] = useState(localStorage.getItem('destinationLocation') || '')
    const [destinationCoords, setDestinationCoords] = useState(localStorage.getItem('destinationCoords') || null)

    const updateLocalstorageValues = (pl, pc, dl, dc) => {
        localStorage.setItem('pickupLocation', pl)
        localStorage.setItem('pickupCoords', pc)

        localStorage.setItem('destinationLocation', dl)
        localStorage.setItem('destinationCoords', dc)
    }

    useEffect(() => {
        if (
            (localStorage.getItem('token') === null)
            ||
            (localStorage.getItem('token_type') != 'rider')
        ) {
            window.location.href = '/login/rider';
        }

        (!pickupLocationFound) && navigator.geolocation.getCurrentPosition(
            (data) => {
                console.log(data)
                setPickupCoords(`${data.coords.latitude},${data.coords.longitude}`)

                axios({
                    url: `https://api.opencagedata.com/geocode/v1/json?key=195b1555711d428f8c35e9d5ee9da5a0&q=${encodeURIComponent(data.coords.latitude + "," + data.coords.longitude)}&pretty=1&no_annotations=1`,
                    method: "GET"
                })
                    .then((res) => {
                        console.log(res)
                        setPickupLocation(res.data.results[0].formatted)
                        updateLocalstorageValues(
                            res.data.results[0].formatted,
                            `${data.coords.latitude},${data.coords.longitude}`,
                            destinationLocation,
                            destinationCoords
                        )
                        setPickupLocationFound(true)
                        Swal.fire({
                            'title': `Pickup Location Found`,
                            'type': `info`
                        })
                    })
                    .catch((err) => {
                        console.log(err)
                    })

            },
            (error) => {
                console.error(error)
            }
        )

    }, []);

    const findVehicles = () => {
        if (!destinationCoords) {
            Swal.fire({
                'title': `Destination Not Chosen`,
                'text': `Finding Rides failed`,
                'type': 'error'
            })
            return
        }
        axios({
            url: BackendVehicleApi('available/'),
            method: "GET",
            headers: props.headers
        })
            .then((res) => {
                console.log(res)
                setVehicles(res.data);
                Swal.fire({
                    'title': `${res.data.length} Rides Found`,
                    'type': `info`
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const getDestinationDetails = () => {
        if (destinationLocation == '') {
            setDestinationCoords(null)
            updateLocalstorageValues(
                pickupLocation,
                pickupCoords,
                '',
                null
            )
            Swal.fire({
                'title': `Empty Destination Saved`,
                'type': `warning`
            })
            return
        } else if (destinationLocation == localStorage.getItem('destinationLocation')) {
            Swal.fire({
                'title': `Destination Already Saved`,
                'type': `info`
            })
        } else {
            axios({
                url: `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(destinationLocation)}&key=195b1555711d428f8c35e9d5ee9da5a0`,
                method: "GET"
            })
                .then((res) => {
                    console.log(res)
                    setDestinationLocation(res.data.results[0].formatted)
                    setDestinationCoords(`${res.data.results[0].geometry.lat},${res.data.results[0].geometry.lng}`)
                    updateLocalstorageValues(
                        pickupLocation,
                        pickupCoords,
                        res.data.results[0].formatted,
                        `${res.data.results[0].geometry.lat},${res.data.results[0].geometry.lng}`
                    )
                    Swal.fire({
                        'title': `Destination Saved`,
                        'type': `success`
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
        }
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
                <Typography variant="h3">
                    Rider Portal
                </Typography>
                <Typography variant="body1">
                    Enter your destination to find the nearest rides
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

                </Box>

                <Box sx={{
                    backgroundColor: `secondary.dark`,
                    color: `secondary.light`,
                    padding: `20px`,
                    margin: `10px 0`,
                    borderRadius: `3px`
                }}>
                    <Typography variant="h4">Destination</Typography>
                    <br />

                    <TextField label="Destination Address" variant="standard"
                        value={destinationLocation}
                        onChange={(e) => {
                            setDestinationLocation(e.target.value)
                        }}
                    />
                    <br />
                    <br />
                    <Button onClick={getDestinationDetails} variant="outlined">Save My Destination</Button>
                    <br />
                    <br />
                    <Typography sx={{ display: `inline` }} variant="h6">Location: </Typography>
                    <Typography sx={{ display: `inline` }} variant="body1">{destinationLocation && destinationLocation}</Typography>
                    <br />
                    <Typography sx={{ display: `inline` }} variant="h6">Coordinates: </Typography>
                    <Typography sx={{ display: `inline` }} variant="body1">{destinationCoords && destinationCoords}</Typography>
                    <br />
                    <br />
                    <Button onClick={findVehicles} variant="outlined"
                        sx={{
                            backgroundColor: `primary.dark`,
                            color: `primary.light`,
                            '&:hover': {
                                backgroundColor: `primary.light`,
                                color: `primary.dark`,
                            }
                        }}
                    >
                        Find Rides!
                    </Button>

                </Box>
            </Box >
            <Box sx={{
                display: `flex`,
                flexWrap: `wrap`,
                margin: `50px 10%`,
                justifyContent: `center`
            }}>
                {vehicles && (
                    <Typography variant="h4" sx={{
                        flex: `1 1 100%`,
                        fontWeight: `bold`,
                        textAlign: `center`
                    }}>
                        Available Rides
                    </Typography>
                )}
                {
                    vehicles && vehicles.map((vehicle, index) => {
                        return (
                            <Box key={index} sx={{
                                backgroundColor: `secondary.dark`,
                                color: `secondary.main`,
                                cursor: `pointer`,
                                flex: `0 1 300px`,
                                margin: `30px`,
                                padding: `20px`,
                                '&:hover': {
                                    backgroundColor: `secondary.main`,
                                    color: `secondary.dark`,
                                    transition: `0.3s`
                                }
                            }} onClick={
                                () => { window.location = `/ride/${vehicle._id}` }
                            }>
                                <Box>
                                    <Typography variant="h5">{index + 1}. {vehicle.vehicle_type}</Typography>
                                    <Typography variant="h6">{vehicle.vehicle_driver.driver_account.username}</Typography>
                                    <Typography variant="h6">{vehicle.vehicle_name}</Typography>
                                    <Typography variant="h6">INR {vehicle.vehicle_fare_per_km}/km</Typography>
                                </Box>
                            </Box>
                        )
                    })
                }
            </Box>
        </Box >
    )
}

export default Rider;