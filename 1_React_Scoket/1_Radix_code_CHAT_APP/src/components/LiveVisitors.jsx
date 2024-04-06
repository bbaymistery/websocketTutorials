import axios from "axios";
import React, { Component } from "react";
import { Table } from "reactstrap";
import openSocket from "socket.io-client";
const socket = openSocket("http://localhost:6600");
class LiveVisitors extends Component {
    state = {
        visitors: [
            {
                ip: "geoplugin_request",
                countryCode: "geoplugin_countryCode",
                city: "geoplugin_city",
                state: "geoplugin_region",
                country: "geoplugin_countryName"
            }
        ]
    };
    componentWillMount() {
        axios.get("http://geoplugin.net/json.gp").then(res => {
            const { geoplugin_request, geoplugin_countryCode, geoplugin_city, geoplugin_region, geoplugin_countryName } = res.data;

            const user = {
                ip: geoplugin_request,
                countryCode: geoplugin_countryCode,
                city: geoplugin_city,
                state: geoplugin_region,
                country: geoplugin_countryName
            };
            //client tarafdan emit edende   =>serverde socket on ile aliriq
            //here we pass emit and take on the server by =>  //!   socket.on("new_visitor", (user) => {... 
            socket.emit("new_visitor", user);


            //serverterefde yazdigim emitVisitors ()    ile server terefden butun userleri alrdm 
            //onu ise burda Call edirem
            //!server terefden io.emit olunanda ise clienbt tarfdan socket on ile alrg 
            socket.on("visitors", visitors => {
                console.log(visitors)
                this.setState({
                    visitors: visitors
                });
            });
        });
    }
    renderTableBody = () => {
        const { visitors } = this.state;
        return visitors?.map((v, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{v?.ip}</td>
                    <td> {v.countryCode} </td>
                    <td>{v?.city}</td>
                    <td>{v?.state}</td>
                    <td>{v?.country}</td>
                </tr>
            );
        });
    };
    render() {
        console.log(this.renderTableBody());
        return (
            <>
                <h2>Live Visitors</h2>
                <Table bordered>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>IP</th>
                            <th>Symbol</th>
                            <th>City</th>
                            <th>State</th>
                            <th>Country</th>
                        </tr>
                    </thead>
                    <tbody>{this.renderTableBody()}</tbody>
                </Table>
            </>
        );
    }
}

export default LiveVisitors;