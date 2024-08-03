import React from 'react';
import './index.css'

const Event = (props) => {
    return (
        <div className="event">
            <img className="event-image" src={props.image} alt={props.title} />
            <h2 className="event-title">{props.title}</h2>
            <p className="event-description">{props.description}</p>
            <p className="event-date">Date: {props.date}</p>
            <p className="event-location">Location: {props.location}</p>
        </div>
    );
};

export default Event;