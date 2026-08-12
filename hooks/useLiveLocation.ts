import * as Location from "expo-location";
import { useEffect, useState } from "react";

export function useLiveLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setError("Permissão de localização negada");
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (loc) => {
          setLocation(loc);
        },
      );
    })();

    return () => {
      subscription?.remove();
    };
  }, []);

  return { location, error };
}
