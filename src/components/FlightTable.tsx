import * as React from "react";
import { Box } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import Map, {
  Layer,
  Marker,
  Popup,
  Source,
  type MapRef,
} from "react-map-gl/mapbox";
import type { Airport } from "../types";
import PopupContent from "./PopupContent";
import { greatCircle } from "@turf/turf";
import "mapbox-gl/dist/mapbox-gl.css";

type FlightListProps = {
  airport: Airport;
};

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// --- Helpers ---
function haversineDistance(
  from: { lat: number; long: number },
  to: { lat: number; long: number }
) {
  const R = 6371;
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLon = ((to.long - from.long) * Math.PI) / 180;
  const lat1 = (from.lat * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function estimateFlightTime(distanceKm: number) {
  const avgSpeed = 800;
  const hours = distanceKm / avgSpeed;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
}

export default function FlightTable({ airport }: FlightListProps) {
  const mapRef = useRef<MapRef | null>(null);
  const [viewState, setViewState] = useState({
    longitude: airport.long,
    latitude: airport.lat,
    zoom: 10,
    bearing: 0,
    pitch: 0,
  });

  const [popupOpen, setPopupOpen] = useState(true);
  const [destination, setDestination] = useState<{
    iata: string;
    lat: number;
    long: number;
  } | null>(null);
  const [route, setRoute] = useState<GeoJSON.Feature | null>(null);
  const [hoverInfo, setHoverInfo] = useState<{
    longitude: number;
    latitude: number;
    text: string;
  } | null>(null);
  const [interactiveLayerIds, setInteractiveLayerIds] = useState<string[]>([
    "nonexist",
  ]);

  // 🛫 Handle selecting a route
  const handleSelectFlight = (
    from: { iata: string; lat: number; long: number },
    to: { iata: string; lat: number; long: number }
  ) => {
    const line = greatCircle([from.long, from.lat], [to.long, to.lat], {
      npoints: 100,
    });

    const distanceKm = haversineDistance(from, to);
    const duration = estimateFlightTime(distanceKm);

    setRoute({
      ...line,
      properties: { tooltip: `${from.iata} → ${to.iata} (${duration})` },
    });
    setInteractiveLayerIds(["flight-route"]);
    setDestination(to);

    const coords = line.geometry.coordinates;
    const [centerLon, centerLat] = coords[Math.floor(coords.length / 2)];
    const lonDiff = Math.abs(from.long - to.long);
    const latDiff = Math.abs(from.lat - to.lat);
    const isVertical = latDiff > lonDiff * 2;

    const visibleKm = distanceKm * 1.4;
    const zoomRange = { min: 1.3, max: 8 };
    let targetZoom = Math.log2(40000 / visibleKm);

    if (isVertical) targetZoom -= 1.4;
    targetZoom = Math.max(zoomRange.min, Math.min(targetZoom, zoomRange.max));

    const flyOptions = {
      center: [centerLon, centerLat] as [number, number],
      zoom: targetZoom,
      speed: 0.8,
      curve: 1.4,
      duration: 2200,
      essential: true,
    };

    if (mapRef.current) {
      mapRef.current.stop(); // 🚨 cancel any ongoing motion first
      mapRef.current.flyTo(flyOptions);
    } else {
      setViewState((prev) => ({
        ...prev,
        longitude: flyOptions.center[0],
        latitude: flyOptions.center[1],
        zoom: flyOptions.zoom,
      }));
    }
  };

  // 🧭 Reset view when airport changes (stop any animation first)
  useEffect(() => {
    if (!airport.name) return;

    if (mapRef.current) {
      mapRef.current.stop(); // 🚨 stop ongoing flyTo before resetting
    }

    setViewState((prev) => ({
      ...prev,
      longitude: airport.long,
      latitude: airport.lat,
      zoom: 10,
    }));

    setPopupOpen(true);
    setRoute(null);
    setDestination(null);
  }, [airport]);

  return (
    <Box
      sx={{
        width: "80vw",
        height: "60vh",
        position: "relative",
        overflow: "hidden",
        borderRadius: 2,
      }}
    >
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/scalperr/cmg31yi05008n01rj2uoa25s7"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: "100%", height: "100%" }}
        doubleClickZoom={false}
        ref={mapRef}
        interactiveLayerIds={interactiveLayerIds}
        onMouseLeave={() => setHoverInfo(null)}
        onMouseMove={(e) => {
          if (e.features?.length) {
            const f = e.features[0];
            setHoverInfo({
              longitude: e.lngLat.lng,
              latitude: e.lngLat.lat,
              text: f.properties?.tooltip || "",
            });
          }
        }}
      >
        {/* Airport marker */}
        {airport.name && (
          <Marker
            longitude={airport.long}
            latitude={airport.lat}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setPopupOpen((prev) => !prev);
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "red",
                border: "2px solid white",
              }}
            />
          </Marker>
        )}

        {/* Popup for available flights */}
        {popupOpen && (
          <PopupContent airport={airport} onSelectFlight={handleSelectFlight} />
        )}

        {/* Route line */}
        {route && (
          <Source id="route" type="geojson" data={route}>
            <Layer
              id="flight-route"
              type="line"
              paint={{
                "line-color": "black",
                "line-width": 2,
                "line-opacity": 1,
              }}
            />
          </Source>
        )}

        {/* Destination marker */}
        {destination && (
          <Marker longitude={destination.long} latitude={destination.lat}>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "green",
                border: "2px solid white",
              }}
            />
          </Marker>
        )}

        {/* Tooltip popup */}
        {/* {hoverInfo && (
          <Popup
            longitude={hoverInfo.longitude}
            latitude={hoverInfo.latitude}
            closeButton={false}
            closeOnClick={false}
            anchor="bottom"
          >
            {hoverInfo.text}
          </Popup>
        )} */}
      </Map>
    </Box>
  );
}
