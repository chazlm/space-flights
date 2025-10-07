// src/components/AirportList.tsx
import * as React from "react";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Typography,
  Stack,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

type Props = {
  airports: Airport[];
  onSelect?: (airport: Airport) => void;
};

export default function AirportList({ airports, onSelect }: Props) {
  return (
    <Stack sx={{ display: "flex", overflow: "auto", maxHeight: "60vh" }}>
      <Typography>Where do you want to fly out of?</Typography>
      <List>
        {airports.map((a, idx) => (
          <React.Fragment key={a.id}>
            <ListItem disableGutters button onClick={() => onSelect?.(a)}>
              <ListItemText
                primary={`${a.name}`}
                secondary={a.iata}
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItem>
            {idx < airports.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Stack>
  );
}
