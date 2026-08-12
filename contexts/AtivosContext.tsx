import { Ativo } from "@/types";
import React, { useContext, createContext, useState, Dispatch } from "react";

interface AtivosContextProps {
  ativos: Ativo[];
  setAtivos: Dispatch<React.SetStateAction<Ativo[]>>

}

const AtivosContext = createContext<AtivosContextProps | null>(null);

export default function AtivosProvider({ children }: { children: React.ReactNode }){

    const [ativos, setAtivos] = useState<Ativo[]>([]);

    return(
        <AtivosContext.Provider value={{ativos, setAtivos}}>
            {children}
        </AtivosContext.Provider>
    )
}

export const useAtivo = () => {
    const context = useContext(AtivosContext);

    if(!context) {
        throw new Error("useAtivo deve ser usado dentro de um AtivosProvider");
    }
    return context;
}