import React from 'react';
import Sidebar from '../components/Sidebar'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GameDiv from '../components/GameDiv';

const GamePage = () =>
{
    return(
        <>
            <Container id="cont1">
                <Col xs={2}><Sidebar/></Col>
                <Col>
                    <Row xs={0} id="title">Game</Row>
                    <Row id="newRow2"><Col><p id="startDiv"><b>StartPage: </b>Penicillium</p></Col><Col><p id="endDiv"><b>EndPage:</b> Silver Cascade</p></Col></Row>
                    <Row id="table"><GameDiv/></Row>
                </Col>
            </Container>
        </>
    );
};
export default GamePage;