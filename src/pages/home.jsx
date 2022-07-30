import {
    Box,
} from '@mui/material/'

import Banner from '../components/home/banner'

const Home = (props) => {

    return (
        <Box>
            <Banner redirectTo={props.redirectTo} />
        </Box>
    )
}

export default Home;