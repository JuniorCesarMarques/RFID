import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, Linking, View } from 'react-native';
import * as Location from 'expo-location';
import { LocationObjectCoords } from 'expo-location';

export default function LocationWatcher() {
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);

  // Função para abrir Google Maps com as coordenadas atuais
  const handleOpenMap = () => {
    if (!location) {
      return;
    }

    const { latitude, longitude } = location;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permissão negada');
        return;
      }

      // Obter a localização atual
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);

      // Começar a escutar mudanças de posição
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // tempo mínimo entre updates (ms)
          distanceInterval: 0, // em metros
        },
        (loc) => {
          setLocation(loc.coords);
        }
      );

      // Limpar listener quando componente desmontar
      return () => subscription.remove();
    })();
  }, []);


  return (
    <View style={{ padding: 20 }}>
      <TouchableOpacity
        onPress={handleOpenMap}
        style={{
          marginTop: 20,
          backgroundColor: '#2196F3',
          padding: 10,
          borderRadius: 5,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Abrir no Google Maps
        </Text>
      </TouchableOpacity>
    </View>
  );
}
