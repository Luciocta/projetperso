import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";

function App() {
  const [params, setParams] = useState({
    spot: "",
    strike: "",
    maturity: "",
    rate: "",
    volatility: "",
  });

  const [callPrice, setCallPrice] = useState(null);
  const [KValues, setKValues] = useState([]);
  const [prices, setPrices] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws");
    setSocket(ws);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.error) {
        setCallPrice("Erreur : " + data.error);
        setKValues([]);
        setPrices([]);
      } else {
        setCallPrice(data.call_price);
        setKValues(data.K_values);
        setPrices(data.prices);
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
        <input type="number" name="spot" placeholder="Spot initial (S)" onChange={handleChange} />
        <input type="number" name="strike" placeholder="Prix d'exercice (K)" onChange={handleChange} />
        <input type="number" step="0.01" name="maturity" placeholder="Maturité (T, en années)" onChange={handleChange} />
        <input type="number" step="0.01" name="rate" placeholder="Taux d'intérêt (r, en décimal)" onChange={handleChange} />
        <input type="number" step="0.01" name="volatility" placeholder="Volatilité (σ, en décimal)" onChange={handleChange} />
        <button onClick={sendMessage}>Calculer</button>
      </div>

      <h3>Prix du Call : {callPrice !== null ? `${callPrice} €` : "Entrez des valeurs et cliquez sur Calculer"}</h3>

      {KValues.length > 0 && (
        <Plot
          data={[
            {
              x: KValues,
              y: prices,
              type: "scatter",
              mode: "lines+markers",
              marker: { color: "blue" },
            },
          ]}
          layout={{
            title: "Prix du Call en fonction du Strike K",
            xaxis: { title: "Strike (K)" },
            yaxis: { title: "Prix du Call (€)" },
          }}
        />
      )}
    </div>
  );
}

export default App;
