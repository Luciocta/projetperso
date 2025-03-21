import math
import numpy as np
import pandas as pd
from scipy.stats import norm


def black_scholes(S0, K, T, r, vol, q=0, opt_type="c"):
    """
    S0 : spot price at time t=0
    K : strike price
    T : maturity (in years)
    r : risk-free rate
    vol : implied volatility
    opt_type : "C" for a call option and "P" for a put option

    Return the price of a vanilla option (for either a call option or a put option) with Black-Scholes formula
    """

    d1=(np.log(S0/K) + (r-q+vol**2/2)*T)/(vol*np.sqrt(T))
    d2=d1-vol*np.sqrt(T)
    
    try:
        if opt_type=="c":
            price=S0*np.exp(-q*T)*norm.cdf(d1, 0, 1)-K*np.exp(-r*T)*norm.cdf(d2, 0, 1)
        elif opt_type=="c":
            price=K*np.exp(-r*T)*norm.cdf(-d2, 0, 1)-S0*norm.cdf(-d1, 0, 1)
        return price
    except:
        raise ValueError("Please confirm option type, either 'C' for Call or 'P' for Put")


def monte_carlo(S0, T, r, vol, M, antithetic=False):
    """
    S0 : spot price at time t=0
    T : maturity (in years)
    r : risk-free rate
    vol : implied volatility
    M : number of simulations
    antithetic : Boolean type (True to improve precision of results)

    Return a matrix with M columns for each simulation where a simulation represents a path for the asset price
    """

    # Fix random seed for reproductibility
    np.random.seed(123)

    if T > 0:
        N=int(round(T*252))   ## 252 times for each trading day in a year
        dt=T/N
    elif T == 0:
        return pd.DataFrame(np.full((1, M), S0), columns=[f"{i+1}" for i in range(M)])
    else:
        raise ValueError("T should be positive")
    
    nudt=(r-0.5*vol**2)*dt
    volsdt=vol*np.sqrt(dt)

    if antithetic:
        M=int(round(M/2))

    epsilon=np.random.normal(0, 1, (N, M))
    growth_factors=np.exp(nudt + volsdt * epsilon)
    prices=S0*pd.DataFrame(growth_factors).cumprod(axis=0)

    if antithetic:
        growth_factors_ant=np.exp(nudt - volsdt * epsilon)
        prices_ant=S0*pd.DataFrame(growth_factors_ant).cumprod(axis=0)
        prices=pd.concat([prices, prices_ant], axis=1, ignore_index=True)

    S=pd.concat([pd.DataFrame([S0] * prices.shape[1]).T, prices], ignore_index=True)
    S.columns=[f"{i+1}" for i in range(prices.shape[1])]

    return S


def delta(S0, K, T, r, vol, q=0, opt_type='c'):
    """
    S0 : spot price at time t=0
    K : strike price
    T : maturity (in years)
    r : risk-free rate
    vol : implied volatility
    opt_type : "C" for a call option and "P" for a put option

    Return the delta of a vanilla option (for either a call option or a put option) with Black-Scholes formula
    """
    d1=(np.log(S0/K) + (r-q+vol**2/2)*T)/(vol*np.sqrt(T))

    if opt_type=="c":
        delta = norm.cdf(d1, 0, 1)
    elif opt_type=="p":
        delta = norm.cdf(d1, 0, 1) - 1
    return delta

def gamma(S0, K, T, r, vol):

    d1=(np.log(S0/K) + (r+vol**2/2)*T)/(vol*np.sqrt(T))
    Nprime = lambda x: np.exp(-x**2/2)/np.sqrt(2*np.pi)

    return Nprime(d1)/(S0*vol*np.sqrt(T))


def vega(S0, K, T, r , sigma):
    d1=(np.log(S0/K) + (r+sigma**2/2)*T)/(sigma*np.sqrt(T))
    Nprime = lambda x: np.exp(-x**2/2)/np.sqrt(2*np.pi)

    return S0*np.sqrt(T)*Nprime(d1)