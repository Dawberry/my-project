import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate, Link } from "react-router-dom";
import useLogout from "../hooks/uselogout";

const Landing = () => {

  const navigate = useNavigate();
    const logout = useLogout();

    const signOut = async () => {
        await logout();
        navigate('/')
    }

    const { auth } = useAuth(); // access user, roles, accessToken

    const [btcPrice, setBtcPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [btcBalance, setBtcBalance] = useState(0.0425);
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [transactions, setTransactions] = useState([]);

  const fetchBitcoinPrice = async () => {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
    const data = await res.json();
    setBtcPrice(data.bitcoin.usd);
    setPriceChange(parseFloat(data.bitcoin.usd_24h_change.toFixed(2)));
  };

  useEffect(() => {
    fetchBitcoinPrice();
    const interval = setInterval(fetchBitcoinPrice, 5000);
    loadTransactions();
    return () => clearInterval(interval);
  }, []);

  const loadTransactions = () => {
    setTransactions([
      { type: 'buy', amount: 0.02, price: 29548.32, value: 590.97, date: '2025-05-15', status: 'completed' },
      { type: 'buy', amount: 0.0125, price: 28765.43, value: 359.57, date: '2025-05-10', status: 'completed' },
      { type: 'sell', amount: 0.01, price: 30214.76, value: 302.15, date: '2025-05-05', status: 'completed' },
      { type: 'buy', amount: 0.005, price: 28432.12, value: 142.16, date: '2025-05-01', status: 'completed' }
    ]);
  };

  const btcValue = btcBalance * btcPrice;
  const btcAllocation = (btcValue / (btcValue + 10000)) * 100;

  const handleBuy = () => {
    const amount = parseFloat(buyAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    alert(`Purchase order placed for $${amount} of BTC.`);
    setBuyAmount('');
  };

  const handleSell = () => {
    const amount = parseFloat(sellAmount);
    if (isNaN(amount) || amount <= 0 || amount > btcBalance) {
      alert('Please enter a valid amount within your balance');
      return;
    }
    alert(`Sell order placed for ${amount} BTC.`);
    setSellAmount('');
  };
  return (
        <div className="gradient-bg text-gray-100 min-h-screen max-w-screen">
      {/* Header */}
      <header className="py-6 px-4 md:px-8 border-b border-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/aacc5ac0-4771-4860-9ed9-77b9d81c4dd8.png" className="w-10 h-10" alt="Logo" />
            <h1 className="text-2xl font-bold">BitInvest</h1>
            <h2>Welcome, {auth?.user || "Guest"}!</h2>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="#" className="hover:text-blue-400 transition">Dashboard</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Invest</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Portfolio</a></li>
              <li><a href="#" className="hover:text-blue-400 transition">Transactions</a></li>
            </ul>
          </nav>
          {auth?.user ? (
  <button onClick={signOut} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition">Sign Out</button>
) : (
  <Link to="/login">
    <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition">Sign In</button>
  </Link>
)}


        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto py-8 px-4 md:px-8">
        <section className="mb-12 card rounded-xl p-6 shadow-lg border border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <div className="flex items-center space-x-4 mb-2">
                <img src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/cc0489f6-d27d-4382-a2c7-a0abba836d39.png" className="w-12 h-12" alt="BTC icon" />
                <h2 className="text-3xl font-bold">Bitcoin (BTC)</h2>
              </div>
              <p className="text-gray-400">Current Market</p>
            </div>
            <div>
              <p className="text-4xl font-bold">${btcPrice.toLocaleString()}</p>
              <p className={`text-right ${priceChange >= 0 ? 'price-up' : 'price-down'}`}>
                {priceChange >= 0 ? `+${priceChange}%` : `${priceChange}%`} <i className={`fas ${priceChange >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
              </p>
            </div>
          </div>
          <div className="mt-6">
            <div
  style={{
    height: 300,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: '0.5rem',
  }}
>
            <img src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b5d0d25f-30a5-4128-81a0-45af23166ad4.png" className="w-full h-full object-cover rounded" alt="Chart" />
          </div>
          </div>
        </section>

        {/* Investment Actions */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Buy BTC */}
          <div className="card rounded-xl p-6 border border-gray-800">
            <h3 className="text-xl font-bold mb-4">Buy Bitcoin</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Amount (USD)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">$</span>
                  <input
                    type="number"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(e.target.value)}
                    className="w-full bg-gray-900 bg-opacity-50 border border-gray-700 rounded-lg py-2 pl-8 pr-4"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="text-sm text-gray-400">You'll get ≈ <span className="text-white">{((parseFloat(buyAmount) || 0) / btcPrice).toFixed(8)} BTC</span></div>
              <button onClick={handleBuy} className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-medium transition">Buy Bitcoin</button>
            </div>
          </div>

          {/* Sell BTC */}
          <div className="card rounded-xl p-6 border border-gray-800">
            <h3 className="text-xl font-bold mb-4">Sell Bitcoin</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Amount (BTC)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3"><i className="fab fa-btc text-yellow-500"></i></span>
                  <input
                    type="number"
                    value={sellAmount}
                    onChange={(e) => setSellAmount(e.target.value)}
                    className="w-full bg-gray-900 bg-opacity-50 border border-gray-700 rounded-lg py-2 pl-8 pr-4"
                    placeholder="0.00000000"
                  />
                </div>
              </div>
              <div className="text-sm text-gray-400">You'll get ≈ <span className="text-white">${(parseFloat(sellAmount) * btcPrice || 0).toFixed(2)}</span></div>
              <button onClick={handleSell} className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-medium transition">Sell Bitcoin</button>
            </div>
          </div>

          {/* Portfolio */}
          <div className="card rounded-xl p-6 border border-gray-800">
            <h3 className="text-xl font-bold mb-4">Your Portfolio</h3>
            <div className="space-y-6">
              <div className="flex justify-between">
                <span className="text-gray-400">Bitcoin Holdings</span>
                <span className="font-medium">{btcBalance.toFixed(8)} BTC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Current Value</span>
                <span className="font-medium">${btcValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">24h Change</span>
                <span className="font-medium text-green-500">+{(Math.random() * 5).toFixed(2)}%</span>
              </div>
              <div className="pt-4 border-t border-gray-800">
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-gray-400">Allocation</span>
                  <span>{btcAllocation.toFixed(1)}% Bitcoin</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${btcAllocation}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Transactions */}
        <section>
          <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
          <div className="card rounded-xl p-4 border border-gray-800 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-800">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Value</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {transactions.map((tx, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3">
                      <span className={tx.type === 'buy' ? 'text-green-500' : 'text-red-500'}>
                        {tx.type === 'buy' ? 'Buy' : 'Sell'}
                      </span>
                    </td>
                    <td className="px-4 py-3">{tx.amount} BTC</td>
                    <td className="px-4 py-3">${tx.price.toLocaleString()}</td>
                    <td className="px-4 py-3">${tx.value.toLocaleString()}</td>
                    <td className="px-4 py-3">{tx.date}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${tx.status === 'completed' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>{tx.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 md:px-8 border-t border-gray-800 mt-12">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <img src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/7e704a4f-f5f0-4889-b723-dcc0a2047554.png" className="w-8 h-8" alt="Logo" />
            <span className="font-medium">BitInvest</span>
          </div>
          <p className="text-sm text-gray-400">© 2023 BitInvest. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-twitter"></i></a>
            <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-telegram"></i></a>
            <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-github"></i></a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
