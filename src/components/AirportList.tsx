import * as React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  Stack,
} from "@mui/material";
import type { Airport } from "../types";

type Props = {
  airports: Airport[];
  onSelect?: (airport: Airport) => void;
};

export default function AirportList({ airports, onSelect }: Props) {
  return (
    <Stack
      sx={{
        height: "100%", // ✅ matches map
      }}
    >
      <Typography sx={{ textAlign: "center", pb: 2 }}>
        Where do you want to fly out of?
      </Typography>

      <Stack
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: 2,
        }}
      >
        <List disablePadding>
          {airports.map((a, idx) => {
            const isEven = idx % 2 === 0;
            const bgColor = isEven ? "#f0f0f0" : null;
            return (
              <React.Fragment key={a.id}>
                <ListItem
                  disableGutters
                  onClick={() => onSelect?.(a)}
                  sx={{
                    cursor: "pointer",
                    backgroundColor: bgColor,
                    borderRadius: 1,
                    px: 2,
                    "&:hover": {
                      backgroundColor: "#81c784",
                    },
                  }}
                >
                  <ListItemText
                    primary={a.name}
                    secondary={a.iata}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItem>
                {idx < airports.length - 1 && <Divider component="li" />}
              </React.Fragment>
            );
          })}
        </List>
      </Stack>
    </Stack>
  );
}
