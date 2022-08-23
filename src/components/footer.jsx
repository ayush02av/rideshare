import {
    Box,
    Typography
} from '@mui/material/'

const Footer = (props) => {

    return (
        <Box sx={{
            textAlign: `center`,
            fontWeight: `bolder`,
            marginTop: `100px`,
            background: `#eee`,
            padding: `20px 0`
        }}>
            <Typography>
                My Share Ride | Copyright 2022
            </Typography>
        </Box>
    )
}

export default Footer;