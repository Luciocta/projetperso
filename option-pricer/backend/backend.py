from fastapi import FastAPI, WebSocket
import uvicorn
import json
import math
from scipy.stats import norm

app = FastAPI()

def black_scholes_call(S, K, T, r, sigma):
    """ Calcule le prix du call et son Delta avec Black-Scholes """
    if T <= 0 or sigma <= 0:
        return None, None
    
    d1 = (math.log(S / K) + (r + (sigma ** 2) / 2) * T) / (sigma * math.sqrt(T))
    d2 = d1 - sigma * math.sqrt(T)

    price = S * norm.cdf(d1) - K * math.exp(-r * T) * norm.cdf(d2)
    delta = norm.cdf(d1)  # Delta du Call

    return round(price, 4), round(delta, 4)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        try:
            data = await websocket.receive_text()
            params = json.loads(data)  

            S = float(params["spot"])
            K_input = float(params["strike"])
            T = float(params["maturity"])
            r = float(params["rate"])
            sigma = float(params["volatility"])

            # Générer une plage de valeurs de K
            S_values = [round(S * (0.5 + i * 0.05), 2) for i in range(21)]
            prices, deltas = zip(*[black_scholes_call(S, K_input, T, r, sigma) for S in S_values])

            # Calcul du prix et Delta pour K_input
            call_price, delta_value = black_scholes_call(S, K_input, T, r, sigma)

            response = {
                "call_price": call_price,
                "delta": delta_value,
                "S_values": S_values,
                "prices": prices,
                "deltas": deltas
            }
            await websocket.send_text(json.dumps(response))

        except Exception as e:
            await websocket.send_text(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
