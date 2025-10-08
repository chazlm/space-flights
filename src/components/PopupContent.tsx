import { useRef } from "react";
import type { Airport } from "../types";
import { AIRPORTS, FLIGHTS } from "../data/flights"; // your lookup
import Draggable from "react-draggable";

type PopupContentProps = {
  airport: Airport;
  onSelectFlight: (
    from: Airport,
    to: { iata: string; lat: number; long: number }
  ) => void;
};

export default function PopupContent({
  airport,
  onSelectFlight,
}: PopupContentProps) {
  const ref = useRef(null);

  // ✅ Access flights by the airport IATA key
  const flights = FLIGHTS[airport.iata] || [];
  console.log("Flights for", airport.iata, flights);

  return (
    <Draggable nodeRef={ref} handle=".drag-handle">
      <div
        ref={ref}
        className="drag-handle"
        style={{
          background: "rgba(0, 0, 0, 0.76)",
          color: "white",
          padding: "12px",
          borderRadius: "8px",
          width: "300px",
          maxHeight: "200px",
          overflowY: "auto",
          cursor: "grab",
          marginTop: "5rem",
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: "8px" }}>
          Flights from {airport.iata}
        </h3>

        {flights.length === 0 ? (
          <p style={{ margin: 0, color: "#ccc" }}>
            No flights from this airport
          </p>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {flights.map((f, idx) => {
              const dest = AIRPORTS[f.to];
              console.log({ dest });
              return (
                <li
                  key={idx}
                  style={{
                    marginBottom: "6px",
                    padding: "6px",
                    borderRadius: "4px",
                    backgroundColor: "rgba(255,255,255,0.1)",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    dest &&
                    onSelectFlight(airport, {
                      iata: f.to,
                      lat: dest.lat,
                      long: dest.long,
                    })
                  }
                >
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>
                      <strong>To: </strong>
                      <b>{dest.name}</b>
                    </div>
                    <b>{f.to}</b>
                  </div>
                  <div>
                    <strong>Date:</strong>{" "}
                    {new Date(f.date).toLocaleDateString("en-US", {
                      timeZone: "UTC", // 👈 force UTC
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Draggable>
  );
}
