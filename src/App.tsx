import { useState } from "react";
import AirportList from "./components/AirportList";
import FlightTable from "./components/FlightTable";
import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import { airports, type Airport } from "./types";

const month = new Date().toLocaleString("default", { month: "long" });

export default function App() {
  const [airport, setAirport] = useState<Airport>(airports[0]);
  const isMobile = useMediaQuery("(max-width: 900px)"); // ✅ slightly wider breakpoint

  return (
    <Box
      sx={{
        width: "90vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box",
        margin: "auto",
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: "center", mt: 1 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mt: 1,
            mb: 0.5,
          }}
        >
          Space A Flights
        </Typography>

        <Typography variant="h6" sx={{ mb: 1 }}>
          AMC CONUS ONLY ({month})
        </Typography>
      </Box>

      {/* Main content */}
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={isMobile ? 1 : 3}
        sx={{
          flex: 1,
          width: "100%",
          height: "80vh",
          alignItems: "stretch",
          overflow: "hidden",
        }}
      >
        {/* Airport List */}
        <Box
          sx={{
            flex: isMobile ? "0 0 auto" : "0 0 30%",
            height: isMobile ? "25vh" : "90%", // ✅ small on mobile
            overflowY: "auto", // ✅ scroll internally
            overflowX: "hidden",
            borderRadius: 1,
            boxShadow: 2,
            background: "white",
            margin: "1rem",
          }}
        >
          <AirportList airports={airports} onSelect={setAirport} />
        </Box>

        {/* Map */}
        <Box
          sx={{
            flex: 1,
            height: isMobile ? "55vh" : "90%", // ✅ bigger on mobile
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <FlightTable airport={airport} />
        </Box>
      </Stack>
    </Box>
  );
}
