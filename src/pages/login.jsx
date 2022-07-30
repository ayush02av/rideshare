import { useState, useEffect } from "react"
import { useParams } from 'react-router-dom'
import axios from "axios"
import {
    BackendAccountApi
} from '../external/backend';
import {
    Box,
    Button,
    TextField,
    Typography,
} from '@mui/material/'

const Login = (props) => {
    const { account_type } = useParams()

    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)

    useEffect(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('token_type')

        localStorage.removeItem('pickupLocation')
        localStorage.removeItem('pickupCoords')
        localStorage.removeItem('destinationLocation')
        localStorage.removeItem('destinationCoords')

        if (!['driver', 'rider'].includes(account_type)) {
            window.location = '/'
        }
    }, []);

    const submitLoginForm = () => {
        const data = {
            username,
            password
        };

        console.log(data);

        axios.post(BackendAccountApi('login/'), data)
            .then(res => {
                console.log(res.data)
                var account = res.data.account

                if (
                    (account.rider_account === null && account.driver_account === null)
                    ||
                    (account_type === "driver" && account.driver_account === null)
                    ||
                    (account_type === "rider" && account.rider_account === null)
                ) {
                    Swal.fire({
                        'title': `Not Allowed`,
                        'text': `Authentication failed`,
                        'type': 'warning'
                    }).then((result) => {
                        setUsername('')
                        setPassword('')
                    })
                } else {
                    Swal.fire({
                        'title': `Welcome ${account_type}: ${res.data.account.username}`,
                        'text': `Authentication successful`,
                        'type': 'success'
                    }).then((result) => {
                        localStorage.setItem('token', res.data.token);
                        localStorage.setItem('token_type', account_type);
                        props.redirectTo(`/${account_type}`);
                    })
                }
            })
            .catch(err => {
                Swal.fire({
                    'title': `Wrong Credentials`,
                    'text': `Authentication failed`,
                    'type': 'error'
                }).then((result) => {
                })
            })
    }

    return (
        <Box sx={{
            width: `40%`,
            margin: `50px calc(30% - 20px)`,
            padding: `20px`,
            borderRadius: `5px`,
            // backgroundColor: `primary.dark`,
            // color: `primary.light`,
            '@media (max-width: 780px)': {
                margin: `50px calc(10% - 20px)`,
                width: `80%`
            },
            textAlign: `center`
        }}>
            <Typography variant="h3">
                Login {account_type}
            </Typography>
            <br />

            <TextField label="Username" variant="outlined"
                value={username}
                onChange={(e) => {
                    setUsername(e.target.value)
                }}
            />

            <br /><br />

            <TextField label="Password" variant="outlined" type="password"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value)
                }}
            />

            <br /><br />

            <Button
                sx={{
                    color: `primary.main`,
                    backgroundColor: `primary.dark`,
                    color: `primary.light`,
                    '&:hover': {
                        backgroundColor: `primary.light`,
                        color: `primary.dark`,
                    }
                }}
                onClick={submitLoginForm}
            >
                Login
            </Button>
        </Box>
    )
}

export default Login