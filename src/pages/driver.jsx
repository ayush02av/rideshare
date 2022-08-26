import { useState, useEffect } from "react";

import axios from "axios";
import {
    BackendAccountApi,
    BackendRideApi,
    SELF_ROUTE
} from '../external/backend';

import {
    Box,
    Button,
    Typography,
    TextField,
} from '@mui/material/';

const Driver = (props) => {

    const [driver, setDriver] = useState()
    const [qrcodeState, setQrState] = useState(false)
    const [qrCodeLink, setQrCodeLink] = useState()

    useEffect(() => {
        if (
            (localStorage.getItem('token') === null)
            ||
            (localStorage.getItem('token_type') != 'driver')
        ) {
            window.location.href = '/login/driver';
        }

        axios({
            url: BackendAccountApi('driver/'),
            method: "GET",
            headers: props.headers
        })
            .then((res) => {
                console.log(res.data);
                setDriver(res.data.driver);

                var link = `${SELF_ROUTE}/ride/${res.data.driver.vehicle._id}`;
                setQrCodeLink(link);
                console.log(link);

                new QRCode(document.getElementById("qrcode"), `${link}`);
                setQrState(true);
            })
            .catch((err) => {
                console.log(err)
            })
    }, []);

    const startMyRide = () => {
        axios({
            url: BackendRideApi(`start/${driver.current_ride._id}/`),
            method: "POST",
            headers: props.headers
        })
            .then(res => {
                console.log(res.data)
                Swal.fire({
                    'title': "Ride Started",
                    'type': 'success'
                }).then((result) => {
                    location.reload()
                })
            })
            .catch(err => {
                console.log(err.response.data)
                Swal.fire({
                    'text': `Starting failed`,
                    'type': 'error'
                }).then((result) => {
                })
            })
    }

    const endMyRide = () => {
        axios({
            url: BackendRideApi(`end/${driver.current_ride._id}/`),
            method: "POST",
            headers: props.headers
        })
            .then(res => {
                console.log(res.data)
                Swal.fire({
                    'title': "Ride Ended",
                    'type': 'success'
                }).then((result) => {
                    location.reload()
                })
            })
            .catch(err => {
                console.log(err.response.data)
                Swal.fire({
                    'text': `Ending failed`,
                    'type': 'error'
                }).then((result) => {
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
                <Typography variant="h3">
                    Driver Portal
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

                    {driver && (
                        <>
                            <Typography variant="h5">
                                Welcome,&nbsp;
                                <i>
                                    {driver.driver_account.first_name}
                                    &nbsp;
                                    {driver.driver_account.last_name}
                                </i>
                            </Typography>

                            <br />
                            <Typography variant="h4">My Vehicle</Typography>

                            <Typography variant="h6">
                                Name: {driver.vehicle.vehicle_name}
                            </Typography>
                            <Typography variant="h6">
                                Type: {driver.vehicle.vehicle_type}
                            </Typography>
                            <Typography variant="h6">
                                Fare: ${driver.vehicle.vehicle_fare_per_km}/km
                            </Typography>
                        </>
                    )}
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
                    {
                        (driver && driver.current_ride && driver.current_rider) ? (
                            <>
                                <Typography variant="h5">Current Ride</Typography>

                                <br />
                                <Typography variant="h4">
                                    Rider Details
                                </Typography>

                                <Typography variant="h6">
                                    Name: {driver.current_rider.rider_account.first_name} {driver.current_rider.rider_account.last_name}
                                </Typography>

                                <Typography variant="h6">
                                    Pickup: {driver.current_ride.ride_pickup_location}
                                </Typography>
                                <Box sx={{
                                    width: `100%`,
                                    height: `300px`,
                                    '@media (max-width: 780px)': {
                                        height: `200px`
                                    }
                                }}>
                                    {
                                        (
                                            <iframe
                                                style={{
                                                    width: `100%`,
                                                    height: `100%`
                                                }}
                                                src={`https://www.openstreetmap.org/export/embed.html?bbox=${driver.current_ride.ride_pickup_coords.split(',')[1]}%2C${driver.current_ride.ride_pickup_coords.split(',')[0]}%2C${driver.current_ride.ride_pickup_coords.split(',')[1]}%2C${driver.current_ride.ride_pickup_coords.split(',')[0]}&amp;layer=mapnik&amp;marker=${driver.current_ride.ride_pickup_coords.split(',')[0]}%2C${driver.current_ride.ride_pickup_coords.split(',')[1]}`}
                                            />
                                        )
                                    }
                                </Box>

                                <br />
                                <Typography variant="h6">
                                    Destination: {driver.current_ride.ride_destination_location}
                                </Typography>
                                <Box sx={{
                                    width: `100%`,
                                    height: `300px`,
                                    '@media (max-width: 780px)': {
                                        height: `200px`
                                    }
                                }}>
                                    {
                                        (
                                            <iframe
                                                style={{
                                                    width: `100%`,
                                                    height: `100%`
                                                }}
                                                src={`https://www.openstreetmap.org/export/embed.html?bbox=${driver.current_ride.ride_destination_coords.split(',')[1]}%2C${driver.current_ride.ride_destination_coords.split(',')[0]}%2C${driver.current_ride.ride_destination_coords.split(',')[1]}%2C${driver.current_ride.ride_destination_coords.split(',')[0]}&amp;layer=mapnik&amp;marker=${driver.current_ride.ride_destination_coords.split(',')[0]}%2C${driver.current_ride.ride_destination_coords.split(',')[1]}`}
                                            />
                                        )
                                    }
                                </Box>

                                <br />
                                <Typography variant="h6">
                                    Ride Status: {driver.current_ride.ride_status}
                                </Typography>
                                <Typography variant="h6">
                                    Booked At: {driver.current_ride.ride_book_time}
                                </Typography>
                                {driver.current_ride.ride_status == "Booked" && (
                                    <Button variant='contained' onClick={startMyRide}>
                                        Start the Ride
                                    </Button>
                                )}
                                {driver.current_ride.ride_status == "Started" && (
                                    <>
                                        <Typography variant="h6">
                                            Started At: {driver.current_ride.ride_start_time}
                                        </Typography>
                                        <Button variant='contained' onClick={endMyRide}>
                                            End the Ride
                                        </Button>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <Typography variant="h4">My QR Code</Typography>
                                <br />
                                <Box id="qrcode"></Box>
                                <br />
                                <Typography variant="body1" component="a" sx={{
                                    color: `blue`,
                                    textDecoration: `unset`
                                }} href={qrCodeLink} target="_blank">Or Click On This Link</Typography>
                            </>
                        )
                    }
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

                    <Typography variant="h4">Previous Rides</Typography>

                    {(driver && driver.previous_rides) ? (
                        <>
                            {driver.previous_rides.map((previous_ride, index) => {
                                return (
                                    <Box key={index} sx={{
                                        backgroundColor: `primary.light`,
                                        padding: `20px`,
                                        margin: `20px 0`,
                                        borderRadius: `4px`
                                    }}>
                                        <Typography variant="h6">
                                            Start: {previous_ride.ride_start_time}
                                            <br />
                                            End: {previous_ride.ride_end_time}
                                        </Typography>
                                    </Box>
                                )
                            })}
                        </>
                    ) : (
                        <Typography variant="h6">
                            No previous Rides To show
                        </Typography>
                    )}

                </Box>
            </Box >
        </Box >
    )
}

export default Driver