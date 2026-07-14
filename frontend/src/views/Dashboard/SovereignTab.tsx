import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Coins, Flame, Gem, Shield, TrendingUp, Cpu, Server, CheckCircle } from 'lucide-react';

interface SovereignBlock {
  blockNumber: number;
  validator: string;
  txCount: number;
  timeSec: string;
  sizeKb: number;
  mintedAt: string;
}

export default function SovereignTab() {
  const { balances, stakedVRDN, accumulatedYield, stakeVRDN, unstakeVRDN, claimYield } = useApp();

  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  
  // Blockchain blocks simulation state
  const [blocks, setBlocks] = useState<SovereignBlock[]>([]);
  const [activeTab, setActiveTab] = useState<'stake' | 'explorer'>('stake');

  // Initialize blocks
  useEffect(() => {
    const initialBlocks: SovereignBlock[] = [];
    let startBlock = 782410;
    for (let i = 0; i < 5; i++) {
      initialBlocks.push({
        blockNumber: startBlock - i,
        validator: `Gov-Node-0${(i % 3) + 1}-Primary`,
        txCount: Math.floor(Math.random() * 8) + 1,
        timeSec: (0.001 + Math.random() * 0.002).toFixed(4),
        sizeKb: parseFloat((0.5 + Math.random() * 1.5).toFixed(2)),
        mintedAt: new Date(Date.now() - i * 6000).toLocaleTimeString(),
      });
    }
    setBlocks(initialBlocks);
  }, []);

  // Tick blocks every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBlocks((prev) => {
        const nextBlockNum = prev.length > 0 ? prev[0].blockNumber + 1 : 782411;
        const newBlock: SovereignBlock = {
          blockNumber: nextBlockNum,
          validator: `Gov-Node-0${Math.floor(Math.random() * 3) + 1}-Primary`,
          txCount: Math.floor(Math.random() * 6) + 1,
          timeSec: (0.001 + Math.random() * 0.002).toFixed(4),
          sizeKb: parseFloat((0.5 + Math.random() * 1.5).toFixed(2)),
          mintedAt: new Date().toLocaleTimeString(),
        };
        return [newBlock, ...prev.slice(0, 9)]; // Keep last 10 blocks
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleStake = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(stakeAmount);
    if (stakeVRDN(amount)) {
      setStakeAmount('');
    }
  };

  const handleUnstake = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(unstakeAmount);
    if (unstakeVRDN(amount)) {
      setUnstakeAmount('');
    }
  };

  return (
    <div className="space-y-8">
      {/* Upper overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#121214] border border-zinc-800/80 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Liquid VRDN Balance</span>
            <Coins className="w-4 h-4 text-[#c29943]" />
          </div>
          <div className="mt-4">
            <p className="text-2xl font-black text-white">{balances.VRDN.toFixed(4)} VRDN</p>
            <p className="text-[10px] text-zinc-500 mt-1 font-mono">Available for staking or trade swap</p>
          </div>
        </div>

        <div className="bg-[#121214] border border-[#c29943]/20 p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 h-16 w-16 bg-[#c29943]/5 rounded-bl-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#c29943]/40" />
          </div>
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Locked Sovereign Stake</span>
            <Gem className="w-4 h-4 text-[#c29943]" />
          </div>
          <div className="mt-4">
            <p className="text-2xl font-black text-[#c29943]">{stakedVRDN.toFixed(2)} VRDN</p>
            <p className="text-[10px] text-zinc-400 mt-1 flex items-center gap-1 font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Earning 8.50% guaranteed APY
            </p>
          </div>
        </div>

        <div className="bg-[#121214] border border-zinc-800/80 p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Accumulated Sovereign Yield</span>
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
          </div>
          <div className="mt-4 flex justify-between items-end">
            <div>
              <p className="text-2xl font-black text-white font-mono">{accumulatedYield.toFixed(8)}</p>
              <p className="text-[9px] text-[#c29943] font-bold tracking-widest uppercase mt-0.5">Ticking interest...</p>
            </div>
            <button 
              onClick={claimYield}
              disabled={accumulatedYield <= 0}
              className="bg-[#c29943] hover:bg-[#aa8032] disabled:opacity-40 disabled:hover:bg-[#c29943] text-black font-extrabold text-[10px] px-3 py-1.5 rounded-xl uppercase tracking-wider transition-all"
            >
              Claim Yield
            </button>
          </div>
        </div>
      </div>

      {/* Tab controls */}
      <div className="flex border-b border-zinc-850 gap-4">
        <button
          onClick={() => setActiveTab('stake')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'stake' ? 'border-[#c29943] text-[#c29943]' : 'border-transparent text-zinc-450 hover:text-white'
          }`}
        >
          Yield Generation & Staking
        </button>
        <button
          onClick={() => setActiveTab('explorer')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'explorer' ? 'border-[#c29943] text-[#c29943]' : 'border-transparent text-zinc-450 hover:text-white'
          }`}
        >
          Sovereign Block Explorer
        </button>
      </div>

      {activeTab === 'stake' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Staking Form */}
          <div className="lg:col-span-2 bg-[#121214] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider text-[#c29943] flex items-center gap-2">
                <Shield className="w-5 h-5" /> Veridion Government Ledger Locks
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Lock your liquid VRDN into sovereign treasury vaults to secure the blockchain and earn high-yield state dividends.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {/* Stake input */}
              <form onSubmit={handleStake} className="space-y-4 bg-zinc-950 p-6 rounded-2xl border border-zinc-900">
                <h4 className="text-xs font-bold text-white uppercase tracking-wide">Stake Liquid VRDN</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                    <span className="text-zinc-500">Amount to Stake</span>
                    <button 
                      type="button" 
                      onClick={() => setStakeAmount(balances.VRDN.toString())} 
                      className="text-[#c29943] hover:underline"
                    >
                      MAX
                    </button>
                  </div>
                  <input
                    type="number"
                    step="any"
                    required
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-xl bg-[#0a0a0c] border border-zinc-800 px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
                  />
                </div>
                <button type="submit" className="w-full bg-[#c29943] hover:bg-[#aa8032] text-black font-extrabold py-2 px-4 rounded-xl text-[10px] uppercase tracking-wider transition-all">
                  Confirm Staking Lock
                </button>
              </form>

              {/* Unstake input */}
              <form onSubmit={handleUnstake} className="space-y-4 bg-zinc-950 p-6 rounded-2xl border border-zinc-900">
                <h4 className="text-xs font-bold text-white uppercase tracking-wide">Unstake Locked VRDN</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                    <span className="text-zinc-500">Amount to Unlock</span>
                    <button 
                      type="button" 
                      onClick={() => setUnstakeAmount(stakedVRDN.toString())} 
                      className="text-[#c29943] hover:underline"
                    >
                      MAX
                    </button>
                  </div>
                  <input
                    type="number"
                    step="any"
                    required
                    value={unstakeAmount}
                    onChange={(e) => setUnstakeAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-xl bg-[#0a0a0c] border border-zinc-800 px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#c29943]"
                  />
                </div>
                <button type="submit" className="w-full bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-850 font-extrabold py-2 px-4 rounded-xl text-[10px] uppercase tracking-wider transition-all">
                  Release Staked Assets
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#121214] border border-zinc-800 p-6 rounded-3xl space-y-4">
              <h4 className="font-bold text-white text-xs uppercase tracking-widest text-[#c29943] flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Staking Telemetry
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-850">
                  <span className="text-zinc-400">Yield Standard APY</span>
                  <span className="font-bold text-emerald-400">8.50%</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-zinc-850">
                  <span className="text-zinc-400">Government Guarantee</span>
                  <span className="font-bold text-white uppercase font-mono text-[9px] bg-emerald-950/40 text-emerald-400 px-2 py-0.5 rounded border border-emerald-900/50">SECURE-LEVEL-4</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Staking Lock Period</span>
                  <span className="font-bold text-zinc-300">Instant Release (Sandbox)</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl space-y-3 text-xs leading-relaxed text-zinc-400">
              <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Staking Ledger Operations</h4>
              <p>
                Locks are compiled as sovereign smart contract parameters on the Veridion chain. Yield is calculated programmatically at runtime on each second boundary tick, allowing live inspection of compounding money.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#121214] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-zinc-850 flex items-center justify-between">
            <h3 className="font-bold text-white text-xs uppercase tracking-widest flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#c29943]" /> Veridion Government Sovereign Ledger Explorer
            </h3>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-emerald-500 rounded-full animate-ping"></span>
              <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Node Consensus Active</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left border-collapse text-xs text-zinc-400">
              <thead className="bg-zinc-950/60 font-mono tracking-wider text-zinc-500 uppercase border-b border-zinc-850">
                <tr>
                  <th className="px-6 py-3.5 font-bold">Block Number</th>
                  <th className="px-6 py-3.5 font-bold">Consensus Validator</th>
                  <th className="px-6 py-3.5 font-bold">Transaction Volume</th>
                  <th className="px-6 py-3.5 font-bold">Settlement Speed</th>
                  <th className="px-6 py-3.5 font-bold">Block Payload Size</th>
                  <th className="px-6 py-3.5 font-bold">Consensus Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850 font-mono">
                {blocks.map((block, idx) => (
                  <tr key={idx} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#c29943]">#{block.blockNumber}</td>
                    <td className="px-6 py-4 text-white flex items-center gap-2">
                      <Server className="w-3.5 h-3.5 text-zinc-500" /> {block.validator}
                    </td>
                    <td className="px-6 py-4 text-zinc-350">{block.txCount} txs</td>
                    <td className="px-6 py-4 text-zinc-400">{block.timeSec}s</td>
                    <td className="px-6 py-4 text-zinc-400">{block.sizeKb} KB</td>
                    <td className="px-6 py-4">
                      <span className="bg-emerald-950/20 text-emerald-400 border border-emerald-900/50 px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1.5 w-max uppercase">
                        <CheckCircle className="w-3 h-3 text-emerald-400" /> {idx === 0 ? 'MINTED (Just now)' : 'CONFIRMED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
