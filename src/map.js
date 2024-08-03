import React, { useEffect, useRef, useState } from 'react';
import { auth, db, storage } from "./FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { icon } from 'leaflet';

const MapboxExample = (props) => {
  const mapContainerRef = useRef();
  const mapRef = useRef();
 
  let dataArray = props.events;
  const features = dataArray.map(item => ({
    type: 'Feature',
    properties: {
      description: `<strong>${item.title}</strong><p>${item.desc}</p>`,
      icon: 'embassy'
    },
    geometry: {
      type: 'Point',
      coordinates: Object.values(item.geo).reverse()
    }
  }));
  features.push({
    type: 'Feature',
    properties: {
      description: '<strong>Make it Mount Pleasant</strong><p><a href="http://www.mtpleasantdc.com/makeitmtpleasant" target="_blank" title="Opens in a new window">Make it Mount Pleasant</a> is a handmade and vintage market and afternoon of live entertainment and kids activities. 12:00-6:00 p.m.</p>',
      icon: 'embassy'
    },
    geometry: {
      type: 'Point',
      coordinates: [-79.36, 43.69]
    }
  })

  console.log(features);

  useEffect(() => {




    mapboxgl.accessToken = 'pk.eyJ1IjoiaHNodWtsYTUiLCJhIjoiY2x6ZTVpZjhzMHRsMTJpb20yM3hjYW5jNCJ9.Gt2J_52RU6tyreG5E2F-pQ';
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-79.36, 43.69], // long, lat
      zoom: 11.15
    });
    
    mapRef.current.on('load', () => {
      mapRef.current.addSource('places', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: features
        }
      });

      mapRef.current.addLayer({
        id: 'places',
        type: 'symbol',
        source: 'places',
        layout: {
          'icon-image': ['get', 'icon'],
          'icon-allow-overlap': true,
          'icon-size': 3
        }
      });

      mapRef.current.on('click', 'places', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(mapRef.current);
      });

      mapRef.current.on('mouseenter', 'places', () => {
        mapRef.current.getCanvas().style.cursor = 'pointer';
      });

      mapRef.current.on('mouseleave', 'places', () => {
        mapRef.current.getCanvas().style.cursor = '';
      });
    });

    return () => mapRef.current.remove();
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{
        position: 'fixed',
        top: '20vh',
        right: '2vw',
        width: '40%',
        height: '70%',
        borderRadius: '20%',
        zIndex: 1 // Ensure it is above other content if necessary
      }}
    />
  );
};

export default MapboxExample;
