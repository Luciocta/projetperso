"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";


function blackScholes(S, K, T, r, sigma, type) {
    const d1 = (Math.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);
    const N = (x) => 0.5 * (1 + Math.erf(x / Math.sqrt(2)));
    
    if (type === "call") {
        return S * N(d1) - K * Math.exp(-r * T) * N(d2);
    } else {
        return K * Math.exp(-r * T) * N(-d2) - S * N(-d1);
    }
}

export default function OptionPricer() {
    const [S, setS] = useState(100);
    const [K, setK] = useState(100);
    const [T, setT] = useState(1);
    const [r, setR] = useState(0.05);
    const [sigma, setSigma] = useState(0.2);
    const [type, setType] = useState("call");
    const [price, setPrice] = useState(null);

    const handleCalculate = () => {
        setPrice(blackScholes(S, K, T, r, sigma, type).toFixed(2));
    };

    return (
        <Card className="p-4 max-w-md mx-auto">
            <CardContent className="space-y-4">
                <Label>Prix du sous-jacent</Label>
                <Input type="number" value={S} onChange={(e) => setS(parseFloat(e.target.value))} />
                
                <Label>Prix d'exercice</Label>
                <Input type="number" value={K} onChange={(e) => setK(parseFloat(e.target.value))} />
                
                <Label>Durée jusqu'à l'échéance (en années)</Label>
                <Input type="number" step="0.01" value={T} onChange={(e) => setT(parseFloat(e.target.value))} />
                
                <Label>Taux d'intérêt</Label>
                <Input type="number" step="0.01" value={r} onChange={(e) => setR(parseFloat(e.target.value))} />
                
                <Label>Volatilité</Label>
                <Input type="number" step="0.01" value={sigma} onChange={(e) => setSigma(parseFloat(e.target.value))} />
                
                <Label>Type d'option</Label>
                <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="call">Call</SelectItem>
                        <SelectItem value="put">Put</SelectItem>
                    </SelectContent>
                </Select>
                
                <Button onClick={handleCalculate}>Calculer</Button>
                
                {price !== null && <p className="text-xl font-bold">Prix de l'option: {price} €</p>}
            </CardContent>
        </Card>
    );
}

