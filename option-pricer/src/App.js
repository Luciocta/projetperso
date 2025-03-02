import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";

function App() {
  const [params, setParams] = useState({
    spot: "100",      // Spot initial
    strike: "100",    // Strike
    maturity: "1",    // Maturité (en années)
    rate: "0.05",     // Taux d'intérêt (5%)
    volatility: "0.2" // Volatilité (20%)
  });
  

  const [callPrice, setCallPrice] = useState(null);
  const [delta, setDelta] = useState(null);
  const [SValues, setSValues] = useState([]);
  const [prices, setPrices] = useState([]);
  const [deltas, setDeltas] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws");
    setSocket(ws);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.error) {
        setCallPrice("Erreur : " + data.error);
        setDelta(null);
        setSValues([]);
        setPrices([]);
        setDeltas([]);
      } else {
        setCallPrice(data.call_price);
        setDelta(data.delta);
        setSValues(data.S_values);
        setPrices(data.prices);
        setDeltas(data.deltas);
      }
    };

    return () => ws.close();
  }, []);

  const handleChange = (e) => {
    setParams({ ...params, [e.target.name]: e.target.value });
  };

  const sendMessage = () => {
    if (socket) {
      socket.send(JSON.stringify(params));
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Pricer Black-Scholes (Call Européen)</h2>

      <div style={{ display: "grid", gap: "10px", maxWidth: "300px", margin: "auto" }}>
        <input type="number" name="spot" value={params.spot} placeholder="Spot initial (S)" onChange={handleChange} />
        <input type="number" name="strike" value={params.strike} placeholder="Prix d'exercice (K)" onChange={handleChange} />
        <input type="number" step="0.01" name="maturity" value={params.maturity} placeholder="Maturité (T, en années)" onChange={handleChange} />
        <input type="number" step="0.01" name="rate" value={params.rate} placeholder="Taux d'intérêt (r, en décimal)" onChange={handleChange} />
        <input type="number" step="0.01" name="volatility" value={params.volatility} placeholder="Volatilité (σ, en décimal)" onChange={handleChange} />
        <button onClick={sendMessage}>Calculer</button>
      </div>

      <h3>Prix du Call : {callPrice !== null ? `${callPrice} €` : "Entrez des valeurs et cliquez sur Calculer"}</h3>
      <h3>Delta : {delta !== null ? `${delta}` : "En attente de calcul..."}</h3>

      {SValues.length > 0 && (
        <>
          <Plot
            data={[
              {
                x: SValues,
                y: prices,
                type: "scatter",
                mode: "lines+markers",
                marker: { color: "blue" },
              },
            ]}
            layout={{
              title: { text: "Premium", font: { size: 18 } },
              xaxis: { title: { text: "Spot", font: { size: 14 } } },
              yaxis: { title: { text: "Prix du Call (€)", font: { size: 14 } } },
            }}
          />

          <Plot
            data={[
              {
                x: SValues,
                y: deltas,
                type: "scatter",
                mode: "lines+markers",
                marker: { color: "red" },
              },
            ]}
            layout={{
              title: { text: "Delta", font: { size: 18 } },
              xaxis: { title: { text: "Spot", font: { size: 14 } } },
              yaxis: { title: { text: "Delta", font: { size: 14 } } },
            }}
          />
        </>
      )}
    </div>
  );
}

export default App;
