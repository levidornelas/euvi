'use client';

import React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  Popup,
  useMapEvents,
} from "react-leaflet";

import { getImageForMediaType } from "@/utils/media-type";
import Link from "next/link";
import Image from "next/image";

const createIcon = (mediaType) => {
  return new L.Icon({
    iconUrl: getImageForMediaType(mediaType),
    iconSize: [30, 35],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

const createUserLocationIcon = () => {
  return new L.Icon({
    iconUrl: "/user.svg",
    iconSize: [25, 25],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

const MapEventHandler = ({ onZoomChange }) => {
  useMapEvents({
    zoomend: (e) => {
      if (onZoomChange) {
        onZoomChange(e.target.getZoom());
      }
    },
  });
  return null;
};

const LeafletMap = ({
  mediaItems,
  mapCenter,
  mapZoom,
  userLocation,
  onPinClick,
  onZoomChange,
}) => {
  // 🚫 Bloqueia render no lado do servidor
  if (typeof window === "undefined") return null;

  return (
    <div className="relative flex-1">
    <MapContainer
      key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`}
      center={mapCenter}
      zoom={mapZoom}
      className="h-full w-full z-0"
      attributionControl={true}
      style={{ height: "100%", width: "100%" }}
    >
      <MapEventHandler onZoomChange={onZoomChange} />

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {mediaItems.map((item) => (
        <Marker
          key={item.id}
          position={[item.latitude, item.longitude]}
          icon={createIcon(item.media_type)}
          eventHandlers={{
            click: () => onPinClick?.(item),
          }}
        >
          {mapZoom >= 14 && (
            <Tooltip
              permanent
              direction="right"
              offset={[15, -30]}
              className="!bg-transparent !p-0 !border-none !shadow-none"
            >
              <div className="text-black text-xs font-semibold">{item.title}</div>
            </Tooltip>
          )}
        </Marker>
      ))}
        
      {userLocation && (
        <Marker
          position={[userLocation.latitude, userLocation.longitude]}
          icon={createUserLocationIcon()}
        >
          <Popup>Você está aqui</Popup>
        </Marker>
      )}
    </MapContainer>
      <Link href="/about">
      <div className="absolute top-4 right-3 z-50">
        <Image 
          src="/logomapa.svg" 
          width={60} 
          height={50} 
          alt="Sobre o EUVI"
          className="cursor-pointer rounded-lg shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-xl animate-pulse"
        />
      </div>
    </Link>
</div>
);
};

export default LeafletMap;
