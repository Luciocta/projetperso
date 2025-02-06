import math
import numpy as np
import pandas as pd


def black_scholes_price(S, K, t, r, sigma, flag='c'):

    d1 = 1/(sigma*math.sqrt(t))*(math.log(S/K)+(r+sigma**2/2)*t)
    d2 = d1 - sigma*math.sqrt(t)

    return S*norm.cdf(d1) - K*math.exp(-r*t)*norm.cdf(d2)


