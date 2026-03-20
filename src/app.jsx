import { useState, useMemo, useEffect } from 'react'
import { buildZones } from './utils/zones.js'
import { calcStats } from './utils/stats.js'
import { storageGet, storageSet } from './utils/storage.js'
import { WORKOUTS } from './data/workouts.js'
import { WEEKS, DAYS, PHASE_COLORS, TYPE_COLORS } from './data/weeks.js'
import { usePolar } from './polar/usePolar.js'

// ─── INLINE HELPERS (kept here for chart rendering) ──────────────────────────
const seg = (z, m, lbl) => ({ z, m, lbl })
const STORAGE_KEY = 'disc-cycle-settings'

// ─── DAY HELPER ──────────────────────────────────────────────────────────────
function getDayWorkouts(weekIdx, dayIdx) {
  const slot = WEEKS[weekIdx].days[dayIdx]
  if (Array.isArray(slot)) return slot.map(k => ({ key:k, ...WORKOUTS[k] }))
  return [{ key:slot, ...WORKOUTS[slot] }]
}






// ─── ZONE CHART ───────────────────────────────────────────────────────────────
function ZoneChart({ segs, zones, ftp }) {
  if (!segs?.length) return null;
  const total = segs.reduce((a,s)=>a+s.m,0);
  const maxW = Math.round(ftp*1.3);
  const stats = calcStats(segs, zones);
  return (
    <div style={{margin:"12px 0 6px"}}>
      <div style={{display:"flex",height:44,borderRadius:8,overflow:"hidden",gap:1,background:"#0a0a0f"}}>
        {segs.map((s,i)=>{
          const z=zones[s.z-1], w=(s.m/total)*100, isTest=s.lbl.includes("ALL OUT");
          return (
            <div key={i} style={{flex:`0 0 ${w}%`,background:(isTest?"#e879f9":z.color)+"bb",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
              {w>5&&<span style={{fontSize:9,fontWeight:900,color:"#000"}}>{z.short}</span>}
              {w>11&&<span style={{fontSize:8,color:"rgba(0,0,0,0.7)"}}>{s.m<1?`${Math.round(s.m*60)}s`:`${Math.round(s.m)}m`}</span>}
            </div>
          );
        })}
      </div>
      <div style={{position:"relative",height:17,marginTop:3}}>
        {(()=>{
          const step=total<=60?10:total<=120?20:total<=180?30:60;
          return Array.from({length:Math.floor(total/step)+1},(_,i)=>i*step).map(t=>(
            <span key={t} style={{position:"absolute",left:`${(t/total)*100}%`,transform:"translateX(-50%)",fontSize:9,color:"#475569"}}>{t}m</span>
          ));
        })()}
      </div>
      <svg width="100%" height="86" viewBox="0 0 400 86" preserveAspectRatio="none" style={{display:"block",marginTop:3}}>
        {zones.map((z,i)=>{
          const yTop=70-((Math.min(z.hi===999?maxW:z.hi,maxW))/maxW)*64;
          const yBot=70-(z.lo/maxW)*64;
          return <rect key={i} x={0} y={Math.max(0,yTop)} width={400} height={Math.max(0,Math.min(70,yBot-yTop))} fill={z.color+"10"}/>;
        })}
        {zones.map((z,i)=>{
          const y=70-(z.target/maxW)*64;
          return <text key={i} x={3} y={y+3} fontSize={7} fill={z.color} opacity={0.85}>{z.short} {z.target}w</text>;
        })}
        {(()=>{
          let x=0; const pts=[];
          segs.forEach(s=>{
            const w=zones[s.z-1].target,y=70-(w/maxW)*64,x2=x+(s.m/total)*400;
            pts.push(`${x},${y}`,`${x2},${y}`); x=x2;
          });
          return (<>
            <polyline points={`0,70 ${pts.join(" ")} 400,70`} fill="rgba(241,245,249,0.06)" stroke="none"/>
            <polyline points={pts.join(" ")} fill="none" stroke="#f1f5f9" strokeWidth={2} strokeLinejoin="round"/>
          </>);
        })()}
        {stats&&(()=>{
          const y=70-(stats.avgW/maxW)*64;
          return (<>
            <line x1={0} x2={400} y1={y} y2={y} stroke="#60a5fa" strokeWidth={1} strokeDasharray="5,3"/>
            <text x={398} y={y-2} fontSize={8} fill="#60a5fa" textAnchor="end">avg {stats.avgW}w</text>
          </>);
        })()}
        <text x={398} y={84} fontSize={7} fill="#475569" textAnchor="end">watts</text>
      </svg>
    </div>
  );
}

// ─── SEGMENT TABLE ────────────────────────────────────────────────────────────
function SegTable({ segs, zones }) {
  if (!segs?.length) return null;
  let elapsed=0;
  return (
    <div style={{marginTop:8,borderRadius:8,overflow:"hidden",border:"1px solid #1e293b",fontSize:11}}>
      <div style={{display:"grid",gridTemplateColumns:"42px 34px 1fr 72px 78px",background:"#0f172a"}}>
        {["At","Z","Segment","Watts","HR"].map(h=>(
          <div key={h} style={{padding:"5px 6px",color:"#475569",fontWeight:700,fontSize:9,letterSpacing:1,textTransform:"uppercase",borderBottom:"1px solid #1e293b"}}>{h}</div>
        ))}
      </div>
      {segs.map((s,i)=>{
        const z=zones[s.z-1],start=elapsed; elapsed+=s.m;
        const mins=s.m<1?`${Math.round(s.m*60)}s`:`${Math.round(s.m)}m`;
        const isTest=s.lbl.includes("ALL OUT");
        const wLabel=s.z===1?`<${z.hi}w`:s.z===5?`>${z.lo}w`:`${z.lo}–${z.hi}w`;
        return (
          <div key={i} style={{display:"grid",gridTemplateColumns:"42px 34px 1fr 72px 78px",background:i%2===0?"#0a0a0f":"#0c111a",borderTop:i>0?"1px solid #1e293b22":"none"}}>
            <div style={{padding:"6px 6px",color:"#475569"}}>{Math.round(start)}m</div>
            <div style={{padding:"6px 6px"}}><span style={{color:isTest?"#e879f9":z.color,fontWeight:800}}>{isTest?"⚡":z.short}</span></div>
            <div style={{padding:"6px 6px",color:"#94a3b8"}}>{s.lbl} <span style={{color:"#2d3748"}}>({mins})</span></div>
            <div style={{padding:"6px 6px",color:isTest?"#e879f9":z.color,fontWeight:700}}>{isTest?"MAX":wLabel}</div>
            <div style={{padding:"6px 6px",color:"#475569"}}>{z.hrLo}–{z.hrHi}bpm</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── SESSION DETAIL ───────────────────────────────────────────────────────────
function SessionDetail({ wo, zones, ftp, tc }) {
  const stats = calcStats(wo.segs, zones);
  return (
    <div>
      {wo.ftpNote && (
        <div style={{background:"#e879f911",border:"1px solid #e879f944",borderRadius:8,padding:"9px 12px",marginBottom:10,fontSize:12,color:"#e879f9",lineHeight:1.6}}>
          <strong>After this test:</strong> new FTP = <strong>20min avg power × 0.95</strong>. Enter it above — all workouts update instantly.
        </div>
      )}
      {stats && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:5,marginBottom:10}}>
          {[{l:"Avg",v:`${stats.avgW}w`},{l:"Duration",v:`${Math.round(stats.totalMins)}m`},{l:"Aerobic",v:`${stats.easyPct}%`},{l:"~kJ",v:`${stats.kj}`}].map(({l,v})=>(
            <div key={l} style={{background:"#1e293b",borderRadius:7,padding:"7px 6px",textAlign:"center"}}>
              <div style={{fontSize:13,fontWeight:900,color:tc}}>{v}</div>
              <div style={{fontSize:9,color:"#475569",textTransform:"uppercase",letterSpacing:0.5}}>{l}</div>
            </div>
          ))}
        </div>
      )}
      {wo.segs?.length>0 && <ZoneChart segs={wo.segs} zones={zones} ftp={ftp}/>}
      {wo.coach && (
        <div style={{background:"#1e293b33",border:"1px solid #1e293b",borderRadius:8,padding:"9px 11px",margin:"8px 0",fontSize:12,color:"#94a3b8",lineHeight:1.6}}>
          <span style={{color:"#fbbf24",fontWeight:700}}>💬 Coach: </span>{wo.coach}
        </div>
      )}
      {wo.segs?.length>0 && <SegTable segs={wo.segs} zones={zones}/>}
    </div>
  );
}

// ─── DAY CARD ─────────────────────────────────────────────────────────────────
function DayCard({ dayLabel, weekIdx, dayIdx, zones, ftp, activeDay, setActiveDay }) {
  const wos = getDayWorkouts(weekIdx, dayIdx);
  const isCombined = wos.length > 1;
  const primary = wos[0];
  const secondary = wos[1];
  const isRest = primary.type==="REST" && !isCombined;
  const hasDetail = primary.segs?.length>0 || isCombined;
  const isOpen = activeDay===dayIdx;
  const tc = primary.type==="FTP" ? "#e879f9"
           : primary.type==="HARD" ? "#f87171"
           : TYPE_COLORS[primary.type]||"#60a5fa";
  const primaryStats = primary.segs?.length ? calcStats(primary.segs,zones) : null;

  return (
    <div>
      <div onClick={()=>hasDetail?setActiveDay(isOpen?null:dayIdx):null} style={{
        display:"flex",alignItems:"center",gap:10,
        background:isOpen?`${tc}22`:isRest?"rgba(55,65,81,0.12)":`${tc}0f`,
        border:`1px solid ${isOpen?tc:tc+"2e"}`,
        borderRadius:isOpen?"12px 12px 0 0":"12px",
        padding:"11px 13px",cursor:hasDetail?"pointer":"default",opacity:isRest?0.38:1,
      }}>
        <div style={{minWidth:32,fontSize:11,fontWeight:800,color:"#64748b",letterSpacing:1}}>{dayLabel}</div>
        <div style={{display:"flex",flexDirection:"column",gap:3,minWidth:72}}>
          <div style={{background:`${tc}22`,border:`1px solid ${tc}55`,borderRadius:5,padding:"2px 6px",fontSize:9,fontWeight:800,color:tc,textAlign:"center",letterSpacing:1}}>
            {primary.type==="FTP"?"FTP TEST":primary.type}
          </div>
          {isCombined && (
            <div style={{background:"#c084fc22",border:"1px solid #c084fc55",borderRadius:5,padding:"2px 6px",fontSize:9,fontWeight:800,color:"#c084fc",textAlign:"center",letterSpacing:1}}>S&C</div>
          )}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:700,color:isRest?"#374151":tc,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
            {isCombined ? `${primary.title} + ${secondary.title}` : primary.title}
          </div>
          {primaryStats && (
            <div style={{fontSize:10,color:"#475569",marginTop:1}}>
              avg {primaryStats.avgW}w · {primaryStats.easyPct}% aerobic · ~{primaryStats.kj}kJ
              {isCombined&&<span style={{color:"#c084fc"}}> + S&C after</span>}
            </div>
          )}
        </div>
        {hasDetail&&<div style={{fontSize:14,color:tc,opacity:0.5}}>{isOpen?"▲":"▼"}</div>}
      </div>

      {isOpen && (
        <div style={{background:"#0f172a",border:`1px solid ${tc}44`,borderTop:"none",borderRadius:"0 0 12px 12px",padding:14}}>
          {isCombined ? (
            <>
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:800,color:tc,letterSpacing:2,marginBottom:10,paddingBottom:6,borderBottom:`1px solid ${tc}33`}}>
                  SESSION 1 — {primary.title.toUpperCase()}
                </div>
                <SessionDetail wo={primary} zones={zones} ftp={ftp} tc={tc}/>
              </div>
              <div style={{paddingTop:4,borderTop:"1px solid #1e293b"}}>
                <div style={{fontSize:11,fontWeight:800,color:"#c084fc",letterSpacing:2,marginBottom:8,paddingTop:12}}>
                  SESSION 2 — {secondary.title.toUpperCase()}
                </div>
                <div style={{background:"#1e293b33",border:"1px solid #1e293b",borderRadius:8,padding:"9px 11px",fontSize:12,color:"#94a3b8",lineHeight:1.6}}>
                  <span style={{color:"#fbbf24",fontWeight:700}}>💬 Coach: </span>{secondary.coach}
                </div>
                <div style={{marginTop:8,padding:"10px 12px",background:"#c084fc11",border:"1px solid #c084fc33",borderRadius:8,fontSize:11,color:"#c084fc",lineHeight:1.6}}>
                  Allow <strong>30–60 mins rest</strong> between the ride and S&C. Eat and refuel first.
                </div>
              </div>
            </>
          ) : (
            <SessionDetail wo={primary} zones={zones} ftp={ftp} tc={tc}/>
          )}
        </div>
      )}
    </div>
  );
}

// ─── 80/20 BAR ───────────────────────────────────────────────────────────────
function EightyTwenty({ weekIdx, zones }) {
  let total=0,easy=0;
  WEEKS[weekIdx].days.forEach((_,di)=>{
    getDayWorkouts(weekIdx,di).forEach(wo=>{
      wo.segs?.forEach(s=>{ total+=s.m; if(s.z<=2) easy+=s.m; });
    });
  });
  if (!total) return null;
  const ep=Math.round(easy/total*100),hp=100-ep;
  const isRecovery=WEEKS[weekIdx].recoveryWeek;
  const ok=isRecovery?(ep>=85):(ep>=74&&ep<=88);
  const sc=ok?"#4ade80":ep>=68?"#fbbf24":"#f87171";
  return (
    <div style={{margin:"14px 16px 0",padding:13,background:"#0f172a",border:`1px solid ${sc}33`,borderRadius:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
        <span style={{fontSize:10,fontWeight:800,letterSpacing:2,color:"#64748b"}}>WEEKLY 80/20 BALANCE</span>
        <span style={{fontSize:11,fontWeight:700,color:sc}}>{ok?"✓ ON TARGET":isRecovery?"✓ RECOVERY":"⚠ CHECK"}</span>
      </div>
      <div style={{display:"flex",height:20,borderRadius:6,overflow:"hidden",gap:2}}>
        <div style={{flex:ep,background:"#4ade8099",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#000"}}>{ep}% Z1-Z2</div>
        <div style={{flex:hp,background:"#f8717199",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#000"}}>{hp}% Z3+</div>
      </div>
      <div style={{fontSize:10,color:"#475569",marginTop:5}}>
        {isRecovery?"Recovery week — intentionally lighter. Hard % will be lower than usual.":"Target: 80% aerobic / 20% hard"} · Total riding: {Math.round(total)}min
      </div>
    </div>
  );
}

// ─── FTP INPUT PANEL ─────────────────────────────────────────────────────────
function FTPPanel({ ftp, setFtp, maxHR, setMaxHR, zones }) {
  const [ftpVal,setFtpVal]=useState(String(ftp));
  const [hrVal, setHrVal] =useState(String(maxHR));
  const [saved, setSaved] =useState(false);

  // Keep input fields in sync if parent state changes (e.g. on load from storage)
  useEffect(()=>{ setFtpVal(String(ftp)); },[ftp]);
  useEffect(()=>{ setHrVal(String(maxHR)); },[maxHR]);

  const handleUpdate = () => {
    const nf=parseInt(ftpVal), nh=parseInt(hrVal);
    const newFtp   = !isNaN(nf) && nf>50  && nf<500 ? nf : ftp;
    const newMaxHR = !isNaN(nh) && nh>100 && nh<230 ? nh : maxHR;
    setFtp(newFtp);
    setMaxHR(newMaxHR);
    storageSet(STORAGE_KEY, { ftp: newFtp, maxHR: newMaxHR });
    setSaved(true); setTimeout(()=>setSaved(false), 2200);
  };
  return (
    <div style={{background:"#0f172a",borderBottom:"2px solid #1e293b",padding:"13px 16px"}}>
      <div style={{fontSize:10,letterSpacing:2,color:"#e879f9",fontWeight:800,marginBottom:9}}>⚡ UPDATE AFTER EACH FTP TEST — ALL WORKOUTS RECALCULATE INSTANTLY</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:8,alignItems:"end"}}>
        <div>
          <label style={{fontSize:10,color:"#64748b",display:"block",marginBottom:4,letterSpacing:1}}>FTP (watts)</label>
          <input type="number" value={ftpVal} onChange={e=>setFtpVal(e.target.value)}
            style={{width:"100%",background:"#1e293b",border:"1px solid #334155",borderRadius:8,padding:"10px 12px",color:"#f1f5f9",fontSize:20,fontWeight:900,outline:"none",fontFamily:"inherit"}}/>
        </div>
        <div>
          <label style={{fontSize:10,color:"#64748b",display:"block",marginBottom:4,letterSpacing:1}}>MAX HR (bpm)</label>
          <input type="number" value={hrVal} onChange={e=>setHrVal(e.target.value)}
            style={{width:"100%",background:"#1e293b",border:"1px solid #334155",borderRadius:8,padding:"10px 12px",color:"#f1f5f9",fontSize:20,fontWeight:900,outline:"none",fontFamily:"inherit"}}/>
        </div>
        <button onClick={handleUpdate} style={{background:saved?"#4ade8022":"#e879f922",border:`1px solid ${saved?"#4ade80":"#e879f9"}`,color:saved?"#4ade80":"#e879f9",borderRadius:8,padding:"10px 14px",fontSize:12,fontWeight:800,cursor:"pointer",whiteSpace:"nowrap",height:46,letterSpacing:1}}>
          {saved?"✓ SAVED":"UPDATE"}
        </button>
      </div>
      <div style={{display:"flex",gap:4,marginTop:9,flexWrap:"wrap"}}>
        {zones.map(z=>(
          <div key={z.z} style={{display:"flex",alignItems:"center",gap:4,background:`${z.color}18`,border:`1px solid ${z.color}44`,borderRadius:6,padding:"3px 8px",fontSize:10}}>
            <span style={{color:z.color,fontWeight:800}}>{z.short}</span>
            <span style={{color:"#64748b"}}>{z.lo}–{z.hi>900?"∞":z.hi}w</span>
          </div>
        ))}
      </div>
      <div style={{fontSize:10,color:"#475569",marginTop:6,padding:"7px 10px",background:"#1e293b33",borderRadius:7,lineHeight:1.6}}>
        💡 <strong style={{color:"#94a3b8"}}>New FTP formula:</strong> 20min avg power × 0.95. E.g. 158w avg → <span style={{color:"#e879f9",fontWeight:700}}>150w FTP</span>.
        <span style={{marginLeft:8,color:"#334155"}}>· Values remembered between sessions.</span>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function PowerZones() {
  const [ftp,       setFtp]      = useState(165);
  const [maxHR,     setMaxHR]    = useState(183);
  const [weekIdx,   setWeekIdx]  = useState(0);
  const [activeDay, setActiveDay]= useState(null);
  const [showRef,   setShowRef]  = useState(false);
  const [loaded,    setLoaded]   = useState(false);

  // Load saved FTP + maxHR from localStorage on first render
  useEffect(()=>{
    const saved = storageGet(STORAGE_KEY);
    if (saved?.ftp   && saved.ftp   > 50  && saved.ftp   < 500) setFtp(saved.ftp);
    if (saved?.maxHR && saved.maxHR > 100 && saved.maxHR < 230) setMaxHR(saved.maxHR);
    setLoaded(true);
  },[]);

  // Don't render until storage has been checked — avoids flicker from default→saved values
  if (!loaded) return (
    <div style={{background:"#0a0a0f",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{color:"#475569",fontSize:13,fontFamily:"'Trebuchet MS',sans-serif"}}>Loading your plan...</div>
    </div>
  );

  const zones = useMemo(()=>buildZones(ftp,maxHR),[ftp,maxHR]);
  const week  = WEEKS[weekIdx];
  const pc    = PHASE_COLORS[week.phase]||"#60a5fa";

  return (
    <div style={{background:"#0a0a0f",minHeight:"100vh",color:"#f1f5f9",fontFamily:"'Trebuchet MS',sans-serif",maxWidth:480,margin:"0 auto"}}>

      <div style={{background:"linear-gradient(135deg,#1a1a2e,#0f3460)",padding:"15px 20px 13px",borderBottom:"2px solid #1e3a5f"}}>
        <div style={{fontSize:10,letterSpacing:3,color:"#60a5fa",marginBottom:2}}>POWER ZONE WORKOUTS</div>
        <div style={{fontSize:19,fontWeight:900}}>London → Brighton</div>
        <div style={{fontSize:12,color:"#94a3b8",marginTop:2}}>80/20 Polarised · Dynamic FTP · 15 weeks</div>
      </div>

      <FTPPanel ftp={ftp} setFtp={setFtp} maxHR={maxHR} setMaxHR={setMaxHR} zones={zones}/>

      <button onClick={()=>setShowRef(v=>!v)} style={{width:"100%",background:"#111827",border:"none",borderBottom:"1px solid #1e293b",padding:"9px 20px",color:"#475569",fontSize:11,fontWeight:700,letterSpacing:1,cursor:"pointer",textAlign:"left"}}>
        {showRef?"▲":"▼"} FULL ZONE REFERENCE
      </button>
      {showRef && (
        <div style={{background:"#0f172a",padding:"12px 20px",borderBottom:"1px solid #1e293b"}}>
          {zones.map(z=>(
            <div key={z.z} style={{display:"flex",gap:10,alignItems:"center",padding:"5px 0",borderBottom:"1px solid #1e293b22"}}>
              <div style={{width:30,height:30,borderRadius:7,background:`${z.color}22`,border:`1px solid ${z.color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:11,color:z.color}}>{z.short}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:700,color:z.color}}>{z.name}</div>
                <div style={{fontSize:11,color:"#475569"}}>{z.lo}–{z.hi>900?"max":z.hi}w · {z.hrLo}–{z.hrHi}bpm · {z.pct} FTP</div>
              </div>
              <div style={{fontSize:16,fontWeight:900,color:z.color}}>{z.target}w</div>
            </div>
          ))}
          <div style={{marginTop:9,fontSize:10,color:"#475569",background:"#1e293b33",borderRadius:7,padding:"8px 10px",lineHeight:1.7}}>
            <strong style={{color:"#94a3b8"}}>Segment watts = your TARGET during that segment only.</strong> The ride average will always be lower because warm-up/cool-down drag it down. Follow each segment's range — never try to ride to an overall average.
          </div>
        </div>
      )}

      {/* Week nav */}
      <div style={{padding:"12px 16px 10px",background:"#0f172a",borderBottom:"1px solid #1e293b"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div>
            <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:3,flexWrap:"wrap"}}>
              <div style={{background:`${pc}22`,border:`1px solid ${pc}55`,color:pc,borderRadius:5,padding:"2px 8px",fontSize:9,fontWeight:800,letterSpacing:2}}>{week.phase}</div>
              {week.ftpWeek&&<div style={{background:"#e879f922",border:"1px solid #e879f955",color:"#e879f9",borderRadius:5,padding:"2px 8px",fontSize:9,fontWeight:800}}>📊 FTP TEST FRI</div>}
              {week.recoveryWeek&&<div style={{background:"#6b728022",border:"1px solid #6b728055",color:"#94a3b8",borderRadius:5,padding:"2px 8px",fontSize:9,fontWeight:800}}>😴 RECOVERY</div>}
            </div>
            <div style={{fontSize:20,fontWeight:900}}>Week {week.n}</div>
            <div style={{fontSize:12,color:"#64748b"}}>{week.dates}</div>
            {week.recoveryWeek&&(
              <div style={{fontSize:10,color:"#6b7280",marginTop:3}}>
                PDF layout: S&C Tue · Hard bursts Thu · Easy/Long Sat
              </div>
            )}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>{setWeekIdx(v=>Math.max(0,v-1));setActiveDay(null);}} disabled={weekIdx===0}
              style={{background:weekIdx===0?"#1e293b":"#1e3a5f",color:weekIdx===0?"#374151":"#60a5fa",border:"none",borderRadius:8,padding:"8px 14px",fontSize:16,cursor:weekIdx===0?"default":"pointer"}}>←</button>
            <button onClick={()=>{setWeekIdx(v=>Math.min(14,v+1));setActiveDay(null);}} disabled={weekIdx===14}
              style={{background:weekIdx===14?"#1e293b":"#1e3a5f",color:weekIdx===14?"#374151":"#60a5fa",border:"none",borderRadius:8,padding:"8px 14px",fontSize:16,cursor:weekIdx===14?"default":"pointer"}}>→</button>
          </div>
        </div>

        {/* Week dots */}
        <div style={{display:"flex",gap:3,overflowX:"auto",paddingBottom:2,scrollbarWidth:"none"}}>
          {WEEKS.map((w,i)=>{
            const ipc=PHASE_COLORS[w.phase]||"#60a5fa";
            return (
              <button key={i} onClick={()=>{setWeekIdx(i);setActiveDay(null);}} style={{
                flex:"0 0 auto",width:26,height:26,borderRadius:5,
                border:i===weekIdx?`2px solid ${ipc}`:"2px solid transparent",
                background:i===weekIdx?`${ipc}33`:i<weekIdx?"#1e293b":"#111827",
                color:i===weekIdx?ipc:i<weekIdx?"#4ade80":"#374151",
                fontSize:9,fontWeight:700,cursor:"pointer",
                outline:w.ftpWeek?"1px solid #e879f966":w.recoveryWeek?"1px solid #6b728066":"none",
              }}>{i<weekIdx?"✓":w.n}</button>
            );
          })}
        </div>
        <div style={{fontSize:9,color:"#374151",marginTop:4}}>
          Pink outline = FTP test week · Grey outline = Recovery week
        </div>
      </div>

      {/* Layout legend */}
      <div style={{padding:"7px 16px",background:"#0a0a0f",borderBottom:"1px solid #1e293b",display:"flex",gap:14,fontSize:10,color:"#475569",flexWrap:"wrap"}}>
        <span>💪 <strong style={{color:"#94a3b8"}}>Normal Fri:</strong> Intervals + S&C</span>
        <span>📊 <strong style={{color:"#94a3b8"}}>Test Fri:</strong> FTP test + S&C</span>
        <span>😴 <strong style={{color:"#94a3b8"}}>Recovery Fri:</strong> Rest</span>
      </div>

      {/* Day cards */}
      <div style={{padding:"12px 16px",display:"flex",flexDirection:"column",gap:6}}>
        {DAYS.map((day,di)=>(
          <DayCard key={day} dayLabel={day} weekIdx={weekIdx} dayIdx={di}
            zones={zones} ftp={ftp} activeDay={activeDay} setActiveDay={setActiveDay}/>
        ))}
      </div>

      <EightyTwenty weekIdx={weekIdx} zones={zones}/>

      <div style={{margin:"14px 16px 28px",padding:12,background:"#0f172a",border:"1px solid #1e293b",borderRadius:10,fontSize:11,color:"#475569",lineHeight:1.9}}>
        <div style={{color:"#e879f9",fontWeight:800,marginBottom:4,letterSpacing:1}}>📊 FTP TESTS (Fridays)</div>
        W1 Fri 13 Mar · W5 Fri 10 Apr · W9 Fri 8 May · W13 Fri 5 Jun
        <div style={{color:"#6b7280",fontWeight:800,marginTop:8,marginBottom:4,letterSpacing:1}}>😴 RECOVERY WEEKS (before each test)</div>
        W4 (30 Mar–5 Apr) · W8 (27 Apr–3 May) · W12 (25–31 May)<br/>
        Recovery weeks follow the original BHF PDF layout exactly: S&C on Tuesday, hard bursts on Thursday, easy/long ride on Saturday. Friday is rest.
      </div>
    </div>
  );
}
