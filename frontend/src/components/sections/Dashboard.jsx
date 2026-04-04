import { useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import gsap from 'gsap';
import { forecastData, transactions } from '../../data/demoData';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function Dashboard() {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(".dash-element",
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1,
          stagger: 0.1, duration: 0.8, ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border p-3 rounded-lg shadow-xl">
          <p className="text-muted text-xs mb-1">{label}</p>
          <p className="text-white font-bold text-lg">₹{payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <section id="dashboard" className="py-16 relative" ref={sectionRef}>
      <div className="section-container relative z-10 w-full mb-12">
        <h2 className="section-headline mb-4">Your Financial Twin</h2>
        <p className="body-text text-lg">Real time prediction engine that sees into your future.</p>
      </div>

      <div className="section-container relative z-10">
        <div className="skeuo-card dash-element p-8 overflow-hidden relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Col - Summary & Chart */}
            <div className="lg:col-span-2 flex flex-col">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <p className="text-muted text-sm font-medium uppercase tracking-wider mb-2">30-Day Forecast</p>
                  <h3 className="text-4xl sm:text-5xl font-black text-white">₹32,450 <span className="text-xl text-muted font-medium ml-2">remaining</span></h3>
                </div>
                <div className="text-right hidden sm:block">
                  <div className="badge-safe mb-2">
                    <ArrowUpRight size={14} /> +12% vs Last Month
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="w-full h-[240px] mt-auto relative">
                <div className="absolute top-[45%] left-0 right-0 border-t border-dashed border-danger/40 z-0">
                  <span className="absolute -top-6 right-0 text-xs text-danger uppercase tracking-wider font-bold">Goal Critical Zone</span>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={forecastData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#7070A0', fontSize: 12}} dy={10} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(108, 99, 255, 0.5)', strokeWidth: 2, strokeDasharray: '4 4' }} />
                    <Area type="monotone" dataKey="balance" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right Col - Feed & Score */}
            <div className="flex flex-col gap-6">
              <div className="bg-surface2/50 rounded-2xl p-6 border border-border flex items-center justify-between">
                <div>
                  <p className="text-muted text-sm font-medium mb-1">Health Score</p>
                  <p className="text-3xl font-bold text-accent2 flex items-center gap-2">78 <span className="text-sm font-normal text-muted">/ 100</span></p>
                </div>
                <div className="w-16 h-16 relative">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle cx="32" cy="32" r="28" className="ring-track" />
                    <circle cx="32" cy="32" r="28" stroke="#00D4AA" strokeWidth="8" fill="none" strokeDasharray="175" strokeDashoffset={175 - (175 * 0.78)} strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              <div>
                <p className="text-muted text-sm font-medium mb-4 flex justify-between">Recent Activity <span className="text-accent cursor-pointer">View All</span></p>
                <div className="flex flex-col gap-3 h-[180px] overflow-hidden relative">
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface to-transparent z-10 pointers-events-none" />
                  
                  {transactions.slice(0, 4).map(tx => (
                    <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-surface2 border border-border/50 hover:border-accent/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-border flex items-center justify-center text-lg">{tx.icon}</div>
                        <div>
                          <p className="text-white font-medium text-sm">{tx.merchant}</p>
                          <p className="text-muted text-xs capitalize">{tx.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold text-sm">₹{tx.amount}</p>
                        {tx.aiStatus === 'safe' && <div className="w-2 h-2 rounded-full bg-accent2 ml-auto mt-1" title="Safe"></div>}
                        {tx.aiStatus === 'warning' && <div className="w-2 h-2 rounded-full bg-warn ml-auto mt-1" title="Warning"></div>}
                        {tx.aiStatus === 'blocked' && <div className="w-2 h-2 rounded-full bg-danger ml-auto mt-1" title="Blocked"></div>}
                      </div>
                    </div>
                  ))}

                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
