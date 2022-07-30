import { useState, useEffect } from "react"
import { useParams } from 'react-router-dom'

import axios from "axios"
import {
    BackendVehicleApi,
    BackendRideApi
} from '../external/backend'

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
        <div className="body">
            <div className="pt-5">
                <div className="section_head">
                    <h2 className="section_title"><span>Confirm Your Ride</span></h2>
                    <p>
                        Make sure to re-check your Pickup &amp; Destination Location.
                    </p>
                </div>
            </div>
            <div className="section">
                <div className="inner-section">
                    <div className="inner-div bg-light rounded border">
                        <div className="heading text-center">Location</div>
                        <div className="text">
                            <span className="heading">Pickup</span>
                            Location: {pickupLocation && pickupLocation}
                            <br />
                            Co-Ordinates: {pickupCoords && pickupCoords}
                        </div>
                        <div className="text mt-3">
                            <span className="heading">Destination</span>
                            Location: {destinationLocation && destinationLocation}
                            <br />
                            Co-Ordinates: {destinationCoords && destinationCoords}
                        </div>
                    </div>
                </div>
            </div >
            {vehicle && (
                <div className="section">
                    <div className="inner-section">
                        <div className="inner-div bg-light rounded border">
                            <div className="heading text-center">My Ride</div>
                            <div className="text">
                                <span className="heading">Vehicle</span>
                                {vehicle.vehicle_name} | {vehicle.vehicle_type}
                                <br />
                                INR {vehicle.vehicle_fare_per_km}/km
                            </div>
                            <div className="text mt-3">
                                <span className="heading">Driver</span>
                                {vehicle.vehicle_driver.driver_account.first_name}
                                &nbsp;
                                {vehicle.vehicle_driver.driver_account.last_name}
                                <br />
                            </div>
                        </div>
                    </div>
                </div >
            )}
            <div className="inner-section mb-5">
                <button className="btn bg-success text-light p-2" onClick={bookMyRide}>Book My Ride!</button>
            </div>
        </div>
    )
}

export default Ride
