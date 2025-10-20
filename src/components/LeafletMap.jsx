"use client";
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
  const imageUrl = getImageForMediaType(mediaType);

  const iconHtml = `
    <div class="relative w-12 h-12 flex items-center justify-center animate-bounce-slow">
      <div class="absolute inset-0 border-2 border-primary/40 rounded-full animate-ping shadow-lg"></div>
      <div class="absolute inset-0 border-2 border-white/30 rounded-full animate-ping-delay"></div>
      
      <div class="absolute w-14 h-14 bg-white/30 rounded-full blur-xl animate-pulse"></div>
      
      <div class="marker-icon-wrapper relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-125 hover:rotate-6 z-10">
        <div class="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40 rounded-full blur-md"></div>
        
        <!-- Brilho sutil -->
        <div class="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent rounded-full pointer-events-none"></div>
        
        <img 
          src="${imageUrl}" 
          class="w-10 h-10 object-contain relative z-10 drop-shadow-2xl brightness-110 contrast-110 filter"
          alt="marker"
          style="filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4)) drop-shadow(0 0 12px rgba(255,255,255,0.6));"
        />
      </div>
      
      <div class="absolute -bottom-2 w-8 h-2 bg-black/40 rounded-full blur-sm animate-shadow-float"></div>
    </div>
    
    <style>
      @keyframes bounce-slow {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      @keyframes ping-delay {
        75%, 100% {
          transform: scale(1.8);
          opacity: 0;
        }
      }
      @keyframes shadow-float {
        0%, 100% { transform: scale(1); opacity: 0.4; }
        50% { transform: scale(0.7); opacity: 0.2; }
      }
      .animate-bounce-slow {
        animation: bounce-slow 3s ease-in-out infinite;
      }
      .animate-ping-delay {
        animation: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        animation-delay: 0.6s;
      }
      .animate-shadow-float {
        animation: shadow-float 3s ease-in-out infinite;
      }
    </style>
  `;

  return new L.DivIcon({
    html: iconHtml,
    className: "custom-animated-marker",
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
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
  if (typeof window === "undefined") return null;

  const tileUrl =
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
  const attribution =
    '&copy; <a href="https://carto.com/attributions">CARTO</a>';

  return (
    <div className="relative flex-1">
      <style jsx global>{`
        .custom-animated-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>

      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="h-full w-full z-0"
        attributionControl={true}
        style={{ height: "100%", width: "100%" }}
      >
        <MapEventHandler onZoomChange={onZoomChange} />
        <TileLayer url={tileUrl} attribution={attribution} />
        {mediaItems.map((item) => (
          <Marker
            key={item.id}
            position={[item.latitude, item.longitude]}
            icon={createIcon(item.media_type)}
            eventHandlers={{
              click: () => onPinClick?.(item),
            }}
          >
            {mapZoom >= 16 && (
              <Tooltip
                permanent
                direction="right"
                offset={[15, -30]}
                className="!bg-white/90 !backdrop-blur-sm !px-3 !py-1 !border-2 !border-primary/20 !rounded-full !shadow-lg"
              >
                <div className="text-gray-900 text-xs font-bold drop-shadow-sm">
                  {item.title}
                </div>
              </Tooltip>
            )}
          </Marker>
        ))}
        {userLocation && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={createUserLocationIcon()}
          >
            <Popup className="font-semibold">Você está aqui 📍</Popup>
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
            className="cursor-pointer rounded-lg shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:rotate-3 animate-pulse backdrop-blur-sm bg-white/10 p-2"
          />
        </div>
      </Link>

      {/* Gradiente artístico nas bordas */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent"></div>
      </div>
    </div>
  );
};

export default LeafletMap;
