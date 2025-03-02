from fastapi import FastAPI, WebSocket
import uvicorn
import json
import math
from scipy.stats import norm

app = FastAPI()

def black_scholes_call(S, K, T, r, sigma):
    """ Calcule le prix du call européen avec Black-Scholes """
    if T <= 0 or sigma <= 0:
        return None
    
    d1 = (math.log(S / K) + (r + (sigma ** 2) / 2) * T) / (sigma * math.sqrt(T))
    d2 = d1 - sigma * math.sqrt(T)
    
    return round(S * norm.cdf(d1) - K * math.exp(-r * T) * norm.cdf(d2), 4)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        try:
            data = await websocket.receive_text()
            params = json.loads(data)  # Convertit le JSON en dictionnaire
            
            S = float(params["spot"])
            K_input = float(params["strike"])
            T = float(params["maturity"])
            r = float(params["rate"])
            sigma = float(params["volatility"])

            # Générer des valeurs de K autour de la valeur entrée (±50%)
            K_values = [round(K_input * (0.5 + i * 0.05), 2) for i in range(21)]
            prices = [black_scholes_call(S, K, T, r, sigma) for K in K_values]

            response = {
                "call_price": black_scholes_call(S, K_input, T, r, sigma),
                "K_values": K_values,
                "prices": prices
            }
            await websocket.send_text(json.dumps(response))

        except Exception as e:
            await websocket.send_text(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
