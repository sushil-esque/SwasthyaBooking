import { useMap } from "react-leaflet";
import { useEffect } from "react";

function UpdateMapCenter({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.setView([location.lat, location.lng], map.getZoom());
    }
  }, [location, map]);

  return null;
}

export default UpdateMapCenter;