import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import "./leaflet-fix.css";
import { Icon } from "leaflet";
import customMarkerIcon from "./red-dot.png";

const googleMapsMarkerIcon = new Icon({
    iconUrl: customMarkerIcon,
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
    popupAnchor: [0, -41],
  });

const GeoMedicalAssistance = () => {
  const [userPosition, setUserPosition] = useState(null);
  const [medicalAssistanceLocations, setMedicalAssistanceLocations] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

  useEffect(() => {
    if (userPosition) {
      axios
        .get(`http://localhost:5000/api/medical_assistance?lat=${userPosition.lat}&lng=${userPosition.lng}`)
        .then((response) => {
          setMedicalAssistanceLocations(response.data.locations);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [userPosition]);

  if (!userPosition) {
    return <div>Loading...</div>;
  }

  const defaultCenter = {
    lat: 48.4184303,
    lng: 12.9714895,
  };

  const defaultZoom = 14;

  if (!userPosition) {
    return <div>Loading...</div>;
  }

  return (
    <MapContainer center={userPosition || defaultCenter} zoom={defaultZoom} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {medicalAssistanceLocations.map((location) => (
        <Marker key={location.id} position={location.coordinates} icon={googleMapsMarkerIcon}>
          <Popup>
            {location.name}
            <br />
            {location.address}
          </Popup>
        </Marker>
      ))}
      <Marker position={userPosition} icon={googleMapsMarkerIcon}>
        <Popup>You are here</Popup>
      </Marker>
    </MapContainer>
  );
};

export default GeoMedicalAssistance;
