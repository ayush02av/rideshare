import { useEffect } from "react"
import axios from "axios"
import {
    BackendAccountApi
} from '../external/backend';

import {
    Box,
    Typography
} from '@mui/material/'

import home from "../assets/images/home.jpg"
import Banner from '../components/home/banner'

const Home = (props) => {

    useEffect(() => {

        if (localStorage.getItem('token_type') != 'rider') {
            localStorage.removeItem('token')
            localStorage.removeItem('token_type')

            localStorage.removeItem('pickupLocation')
            localStorage.removeItem('pickupCoords')
            localStorage.removeItem('destinationLocation')
            localStorage.removeItem('destinationCoords')

            const data = {
                username: `rider1`,
                password: `rider`
            };

            axios.post(BackendAccountApi('login/'), data)
                .then(res => {
                    console.log(res.data)
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('token_type', 'rider');
                })
                .catch(err => {
                    Swal.fire({
                        'title': `Server Error`,
                        'type': 'error'
                    }).then((result) => {
                    })
                })
        }

    }, []);

    return (
        <Box>
            <Banner redirectTo={props.redirectTo} />
            <Typography variant='h5' sx={{
                margin: `40px`,
                textAlign: `center`,
                fontWeight: `bolder`
            }}>
                My Share Ride helps you easily book share-cabs in under 3 clicks
            </Typography>
            <Box component="img" src={home} sx={{
                width: `80%`,
                margin: `0 10%`
            }} alt="rider" />
        </Box>
    )
}

export default Home;