import { createContext, useContext, useEffect, useState } from "react";
import { initDb } from "./db";
import { SQLiteDatabase } from "expo-sqlite";
import { View, Text, Button } from "react-native";

const DatabaseContext = createContext<SQLiteDatabase | null>(null);

export default function DatabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [count, setCount] = useState<number>(0);


useEffect(() => {
  (async () => {
    try {
      const db = await initDb();
      setDb(db);
    } catch (e) {
      console.error("Erro no initDb:", e);
    }
  })();
}, []);


if (!db) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text >Inicializando banco de dados…{count}</Text>
      <Button title="Continuar" onPress={() => setCount(prev => prev + 1)} />
    </View>
  );
}


  return (
    <DatabaseContext.Provider value={db}>
      {children}
    </DatabaseContext.Provider>
  );
}



export const useDataBase = () => {
    const context = useContext(DatabaseContext);
    if(!context) {
        throw new Error("useDataBase deve ser usado dentro de um <DatabaseProvider>");
    }
    return context;
}