import { useState, useEffect } from "react";

import axios from "axios";
import {
    BackendAccountApi,
    BackendRideApi,
    SELF_ROUTE
} from '../external/backend';

function Driver(props) {

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

                if (qrcodeState === false) {
                    var link = `${SELF_ROUTE}/ride/${res.data.driver.vehicle._id}`;
                    document.getElementById("qrcode").innerHTML = "";
                    new QRCode(document.getElementById("qrcode"), `${SELF_ROUTE}/ride/${res.data.driver.vehicle._id}`);
                    setQrCodeLink(link);
                    setQrState(true);
                }

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
        <div className="body">
            <div className="section">
                <div className="inner-section">
                    <div className="inner-div bg-primary text-light">
                        <div className="heading text-center">Driver Portal</div>
                        <div className="text">
                            Welcome,&nbsp;
                            <i>
                                {driver && driver.driver_account.first_name}
                                &nbsp;
                                {driver && driver.driver_account.last_name}
                            </i>
                        </div>
                        <div className="text">
                            {driver && driver.vehicle && (
                                <>
                                    Vehicle: {driver.vehicle.vehicle_name}
                                    <br />
                                    Type: {driver.vehicle.vehicle_type}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {
                (driver && driver.current_ride && driver.current_rider) ? (
                    <div className="section">
                        <div className="inner-section">
                            <div className="inner-div bg-success text-light">
                                <div className="heading text-center">Current Ride</div>
                                <div className="text">
                                    Rider:&nbsp;
                                    {driver.current_rider.rider_account.first_name}
                                    &nbsp;
                                    {driver.current_rider.rider_account.last_name}

                                    <br />

                                    Booked at:&nbsp;
                                    {driver.current_ride.ride_book_time}

                                    <br />

                                    {driver.current_ride.ride_status == "Booked" && (
                                        <div className="text-center">
                                            <button className="btn btn-warning" onClick={startMyRide}>
                                                Start the Ride
                                            </button>
                                        </div>
                                    )}
                                    {driver.current_ride.ride_status == "Started" && (
                                        <div className="text-center">
                                            <button className="btn btn-warning" onClick={endMyRide}>
                                                End the Ride
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="section">
                            <div className="inner-section">
                                <div className="inner-div bg-success text-light">
                                    <div className="heading text-center">Scan this QR Code to Book Ride</div>
                                    <br />
                                    <span id="qrcode" className="text-center" style={{
                                        backgroundColor: `red`,
                                        padding: `0`
                                    }}></span>
                                    <br />
                                    <span><a className="text-light" href={qrCodeLink} target="_blank">Or Click On This Link</a></span>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
            <div className="section">
                <div className="inner-section">
                    {
                        (driver && driver.previous_rides && driver.previous_rides.length > 0) ? (
                            <div className="inner-div bg-success text-light">
                                <div className="heading text-center">Previous Rides</div>
                                {
                                    driver.previous_rides.map((previous_ride, index) => {
                                        return (
                                            <div key={index} className="inner-fixed-div bg-light text-dark rounded mb-3 p-3">
                                                Start: <span className="">{previous_ride.ride_start_time}</span>
                                                <br />
                                                End: <span className="">{previous_ride.ride_end_time}</span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        ) : (
                            <div className="p-3 rounded bg-danger text-light">
                                <div className="heading text-center">No Previous Rides</div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div >
    )
}

export default Driver