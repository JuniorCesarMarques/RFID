export default  function getStatus (rssi: number | null) {

    if (rssi === null) return { label: "", color: "#64748B", level: 0 };

    const value = Number(rssi);

    if (value >= -30) {
      return { label: "Sinal muito forte 🔥", color: "#16A34A", level: 5 };
    }

    if (value >= -40) {
      return { label: "Sinal forte 🟢", color: "#22C55E", level: 4 };
    }

    if (value >= -50) {
      return { label: "Sinal médio 🟡", color: "#EAB308", level: 3 };
    }
      

    if (value >= -60) {
      return { label: "Sinal fraco 🟠", color: "#F97316", level: 2 };
    }
      

    return { label: "Sinal muito fraco 🔴", color: "#DC2626", level: 1 };
  };