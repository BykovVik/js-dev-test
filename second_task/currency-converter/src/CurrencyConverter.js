import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const CurrencyConverter = () => {
    const [currencies, setCurrencies] = useState([]);
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('EUR');
    const [amount, setAmount] = useState(1);
    const [convertedAmount, setConvertedAmount] = useState(null);
    const [error, setError] = useState(null);

    // Получаем API ключ из переменных окружения
    const apiKey = process.env.REACT_APP_EXCHANGE_RATE_API_KEY;

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const response = await axios.get(`https://api.exchangeratesapi.io/v1/latest?access_key=${apiKey}`);
                setCurrencies([response.data.base, ...Object.keys(response.data.rates)]);
            } catch (error) {
                setError('Failed to fetch currency data.');
            }
        };
        fetchCurrencies();
    }, [apiKey]);

    const convertCurrency = async () => {
        try {
            const response = await axios.get(`https://api.exchangeratesapi.io/v1/latest?access_key=${apiKey}&base=${fromCurrency}&symbols=${toCurrency}`);
            const rate = response.data.rates[toCurrency];
            setConvertedAmount((amount * rate).toFixed(2));
            setError(null);
        } catch (error) {
            setError('Failed to convert currency.');
        }
    };

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    const handleFromCurrencyChange = (e) => {
        setFromCurrency(e.target.value);
    };

    const handleToCurrencyChange = (e) => {
        setToCurrency(e.target.value);
    };

    return (
        <div className="converter-container">
            <h2>Currency Converter</h2>
            {error && <p className="error-message">{error}</p>}
            <div className="input-group">
                <input type="number" value={amount} onChange={handleAmountChange} />
                <select value={fromCurrency} onChange={handleFromCurrencyChange}>
                    {currencies.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                    ))}
                </select>
                <span>to</span>
                <select value={toCurrency} onChange={handleToCurrencyChange}>
                    {currencies.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                    ))}
                </select>
            </div>
            <button onClick={convertCurrency}>Convert</button>
            {convertedAmount && (
                <p>{amount} {fromCurrency} = {convertedAmount} {toCurrency}</p>
            )}
        </div>
    );
};

export default CurrencyConverter;