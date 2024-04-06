import React from "react";
import { Container, Row } from "reactstrap";
import { Route, Routes } from "react-router-dom";
import Header from "../components/Header";
import {routes} from "../routes";

const Layout = () => {
    return (
        <>
            <Header />
            <Container>
                <Row>
                    <Routes>
                        {routes.map((r, i) => r.Component ? <Route key={i} path={r.path} element={<r.Component />} /> : null)}
                    </Routes>
                </Row>
            </Container>
        </>
    );
};

export default Layout;
