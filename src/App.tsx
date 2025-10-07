import { useState } from "react";
import AirportList from "./components/AirportList";
import FlightTable from "./components/FlightTable";
import { Box, Typography, Paper, Stack } from "@mui/material";
import { airports, type Airport } from "./types";

const month = new Date().toLocaleString("default", { month: "long" });

function App() {
  const [airport, setAirport] = useState<Airport>(airports[0]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>Space A Flights</h1>
      <h1>AMC CONUS ONLY ({month})</h1>

      <Stack direction={"row"}>
        <AirportList airports={airports} onSelect={setAirport} />
        <FlightTable airport={airport} />
      </Stack>
    </Box>
  );
}

export default App;
