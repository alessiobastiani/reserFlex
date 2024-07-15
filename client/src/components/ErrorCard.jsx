import React from 'react';
import { Card } from 'react-bootstrap';

const ErrorCard = ({ message }) => (
  <Card style={{ width: '23rem', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.4)' }}>
    <Card.Body>
      <Card.Title className="text-center">Error en la Reserva</Card.Title>
      <Card.Text className="text-center">{message}</Card.Text>
    </Card.Body>
  </Card>
);

export default ErrorCard;
