import logo from './logo.svg';
import './App.css';
import { Container, Row, Col } from "react-bootstrap";
import './index.css'
import Header from './header.js';
import Event from './event.js';
import MapboxExample from './map.js' ;
import React, { useEffect, useState } from "react";
import { auth, db, storage } from "./FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";


function timestampToDateString(timestamp) {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString();
  }
  function Home() {
    const [data, setData] = useState([]);
   
      const fetchPost = async () => {
         
          await getDocs(collection(db, "events"))
              .then((querySnapshot)=>{               
                  const newData = querySnapshot.docs
                      .map((doc) => ({...doc.data(), id:doc.id }));
                  setData(newData);          
              })
         
      }
      useEffect(()=>{
          fetchPost();
      }, [])
    
      console.log(data);
    if (data.length === 0) {
      return <div className='loading'>Loading...</div>;
    }
    return (
      <div className="App">
        <MapboxExample className='map' events={data}/>
        <Row className='eventHolder'>
        {data.map((event, index) => (
            <Col md={4} key={index} className='Event'>
              <Event
                image={event.image}
                title={event.title}
                description={event.desc}
                date={timestampToDateString(event.date)}
                location={event.location}
              />
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  export default Home;