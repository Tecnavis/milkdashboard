import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { URL } from '../../Helper/handle-api';

const ChangePlanModal = ({ show, onHide, orderId }) => {
  const [planType, setPlanType] = useState('');
  const [customDates, setCustomDates] = useState(['', '']);
  const [weeklyDays, setWeeklyDays] = useState([]);
  const [alternativeStart, setAlternativeStart] = useState('');
  const [alternativeInterval, setAlternativeInterval] = useState(2);
  const [startDate, setStartDate] = useState('');

  const handlePlanChange = async () => {
    let payload = { orderId, newPlanType: planType };

    switch (planType) {
      case 'daily':
      case 'monthly':
      case 'introductory':  // Added Introductory Plan
        payload.startDate = startDate;
        break;
      case 'custom':
        payload.customDates = customDates.filter(date => date);
        break;
      case 'weekly':
        payload.weeklyDays = weeklyDays;
        break;
      case 'alternative':
        payload.startDate = alternativeStart;
        payload.interval = alternativeInterval;
        break;
    }

    try {
      await axios.put(`${URL}/orderdetails/changeplan`, payload);
      onHide();
    } catch (error) {
      console.error('Plan change failed:', error);
    }
  };

  const renderPlanSpecificFields = () => {
    switch (planType) {
      case 'daily':
      case 'monthly':
      case 'introductory':  // Added Start Date for Introductory Plan
        return (
          <Form.Group>
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Form.Group>
        );
      case 'custom':
        return (
          <Form.Group>
            <Form.Label>Custom Dates</Form.Label>
            {customDates.map((date, index) => (
              <Form.Control
                key={index}
                type="date"
                value={date}
                onChange={(e) => {
                  const newDates = [...customDates];
                  newDates[index] = e.target.value;
                  setCustomDates(newDates);
                }}
              />
            ))}
            <Button variant="link" onClick={() => setCustomDates([...customDates, ''])}>
              Add Date
            </Button>
          </Form.Group>
        );
      case 'weekly':
        return (
          <Form.Group>
            <Form.Label>Select Weekly Days</Form.Label>
            {[0, 1, 2, 3, 4, 5, 6].map(day => (
              <Form.Check
                key={day}
                type="checkbox"
                label={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]}
                checked={weeklyDays.includes(day)}
                onChange={(e) => {
                  const newDays = e.target.checked 
                    ? [...weeklyDays, day]
                    : weeklyDays.filter(d => d !== day);
                  setWeeklyDays(newDays);
                }}
              />
            ))}
          </Form.Group>
        );
      case 'alternative':
        return (
          <>
            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={alternativeStart}
                onChange={(e) => setAlternativeStart(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Interval (Days)</Form.Label>
              <Form.Control
                type="number"
                value={alternativeInterval}
                onChange={(e) => setAlternativeInterval(Number(e.target.value))}
                min={1}
              />
            </Form.Group>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Change Plan</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Select Plan Type</Form.Label>
            <Form.Control
              as="select"
              value={planType}
              onChange={(e) => setPlanType(e.target.value)}
            >
              <option value="">Select Plan</option>
              <option value="daily">Daily Plan</option>
              <option value="monthly">Monthly Plan</option>
              <option value="introductory">Introductory Plan</option> {/* New Plan */}
              <option value="custom">Custom Plan</option>
              <option value="weekly">Weekly Plan</option>
              <option value="alternative">Alternative Plan</option>
            </Form.Control>
          </Form.Group>
          {renderPlanSpecificFields()}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button 
          variant="primary" 
          onClick={handlePlanChange}
          disabled={!planType}
        >
          Change Plan
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangePlanModal;
