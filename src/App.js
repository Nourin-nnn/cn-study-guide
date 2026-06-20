import { useState } from "react";

// ─── Shared Helpers ───────────────────────────────────────────────
function Row({ label, value, color }) {
  return (
    <div style={{ display:"flex", gap:10, marginBottom:8 }}>
      <span style={{ color, fontWeight:600, minWidth:90, fontSize:13, flexShrink:0 }}>{label}:</span>
      <span style={{ color:"#94a3b8", fontSize:13 }}>{value}</span>
    </div>
  );
}
function Card({ children, style={} }) {
  return <div style={{ background:"#1e293b", borderRadius:14, padding:20, ...style }}>{children}</div>;
}
function ST({ children }) { // SectionTitle
  return <div style={{ color:"#64748b", fontWeight:700, fontSize:11, letterSpacing:1.2, marginBottom:12, marginTop:4 }}>{children}</div>;
}
function Tabs({ tabs, active, setActive, color="#0ea5e9" }) {
  return (
    <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:18 }}>
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>setActive(t.id)} style={{
          background:active===t.id?color:"#1e293b", color:active===t.id?"#fff":"#64748b",
          border:`1.5px solid ${active===t.id?color:"#334155"}`,
          borderRadius:8, padding:"5px 11px", cursor:"pointer", fontSize:11, fontWeight:600,
        }}>{t.label}</button>
      ))}
    </div>
  );
}
// ═══════════════════════════════════════════════════════
//  NETWORK LAYER  — Tanenbaum Ch. 5
// ═══════════════════════════════════════════════════════

function NL_Intro() {
  return (
    <div>
      <ST>NETWORK LAYER DESIGN ISSUES (Tanenbaum §5.1)</ST>
      <p style={{color:"#94a3b8",marginBottom:16,fontSize:13,lineHeight:1.7}}>
        The network layer moves packets from source host to destination host across many routers and heterogeneous networks. It handles <strong style={{color:"#e2e8f0"}}>logical addressing, routing, forwarding, and congestion</strong>. Key protocol: IP.
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <Card>
          <div style={{color:"#10b981",fontWeight:700,marginBottom:8}}>Store-and-Forward Switching</div>
          <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7}}>Routers receive a complete packet, buffer it, check for errors, then forward. Enables error detection at each hop and absorbs bursts.</p>
          <div style={{background:"#0f172a",borderRadius:8,padding:10,fontFamily:"monospace",fontSize:11,color:"#64748b",marginTop:8}}>
            Host A → R1 → R2 → R3 → Host B<br/><span style={{color:"#10b981"}}>each hop: store → check → forward</span>
          </div>
        </Card>
        <Card>
          <div style={{color:"#10b981",fontWeight:700,marginBottom:8}}>Datagram vs Virtual Circuit</div>
          {[["Datagram (IP)","Each packet routed independently. No setup. Different paths. Robust. Internet uses this.","#0ea5e9"],
            ["Virtual Circuit (ATM/MPLS)","Path pre-established. All packets follow same route. Resources reserved. Guaranteed QoS.","#f59e0b"]
          ].map(([n,d,c])=>(
            <div key={n} style={{marginBottom:10}}>
              <div style={{color:c,fontWeight:700,fontSize:12,marginBottom:3}}>{n}</div>
              <div style={{color:"#64748b",fontSize:12}}>{d}</div>
            </div>
          ))}
        </Card>
      </div>
      <Card>
        <ST>ROUTING vs FORWARDING</ST>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div>
            <div style={{color:"#6366f1",fontWeight:700,marginBottom:6}}>Routing (Control Plane)</div>
            <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7}}>Computing best paths using routing algorithms. Fills the routing/forwarding table. Runs periodically or on topology changes. Slow path.</p>
          </div>
          <div>
            <div style={{color:"#0ea5e9",fontWeight:700,marginBottom:6}}>Forwarding (Data Plane)</div>
            <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7}}>Looking up destination in forwarding table, moving packet from input to output port. Per-packet, in hardware, at line speed. Fast path.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function NL_IPv6() {
  const [view, setView] = useState("repr");
  return (
    <div>
      <ST>IPv6 — INTRODUCTION (Tanenbaum §5.7.4)</ST>
      <p style={{color:"#94a3b8",marginBottom:16,fontSize:13,lineHeight:1.7}}>
        IPv4's 32-bit address space (~4.3B addresses) is exhausted. IPv6 uses <strong style={{color:"#e2e8f0"}}>128-bit addresses</strong> providing 3.4×10³⁸ addresses. Standardized in RFC 2460 / RFC 8200.
      </p>
      <Tabs color="#6366f1"
        tabs={[{id:"repr",label:"Representation"},{id:"space",label:"Address Space"},{id:"alloc",label:"Allocation"},{id:"eui",label:"EUI-64"},{id:"adv",label:"Advantages"}]}
        active={view} setActive={setView}/>

      {view==="repr" && (
        <div>
          <Card style={{marginBottom:14}}>
            <div style={{color:"#6366f1",fontWeight:700,marginBottom:10}}>IPv6 Address Representation</div>
            <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:12}}>
              128 bits written as <strong style={{color:"#e2e8f0"}}>8 groups of 4 hex digits</strong> separated by colons. Two compression rules apply.
            </p>
            <div style={{background:"#0f172a",borderRadius:10,padding:14,fontFamily:"monospace",fontSize:13,marginBottom:12}}>
              <div style={{color:"#64748b",marginBottom:4}}>Full:</div>
              <div style={{color:"#6366f1"}}>2001:0DB8:0000:0000:0000:FF00:0042:8329</div>
            </div>
            <div style={{color:"#e2e8f0",fontWeight:700,marginBottom:10}}>Compression Rules</div>
            {[
              {rule:"Rule 1 — Leading zeros in each group can be omitted",before:"2001:0DB8:0000:0000:0000:FF00:0042:8329",after:"2001:DB8:0:0:0:FF00:42:8329",color:"#0ea5e9"},
              {rule:"Rule 2 — One run of consecutive all-zero groups → :: (only once)",before:"2001:DB8:0:0:0:FF00:42:8329",after:"2001:DB8::FF00:42:8329",color:"#10b981"},
            ].map(r=>(
              <div key={r.rule} style={{background:"#0f172a",borderRadius:8,padding:12,marginBottom:10}}>
                <div style={{color:r.color,fontWeight:700,fontSize:12,marginBottom:6}}>{r.rule}</div>
                <div style={{fontFamily:"monospace",fontSize:12}}>
                  <span style={{color:"#64748b"}}>Before: </span><span style={{color:"#94a3b8"}}>{r.before}</span><br/>
                  <span style={{color:"#64748b"}}>After:  </span><span style={{color:r.color}}>{r.after}</span>
                </div>
              </div>
            ))}
            <div style={{background:"#0f172a",borderRadius:8,padding:12,marginTop:8}}>
              <div style={{color:"#f59e0b",fontWeight:700,fontSize:12,marginBottom:8}}>Special Addresses</div>
              {[["::1","Loopback (IPv6 localhost)"],["::","Unspecified address"],["fe80::/10","Link-local (auto-configured)"],["ff00::/8","Multicast"],["2000::/3","Global unicast (public internet)"],["fc00::/7","Unique local (like private IPv4 10.x.x.x)"]].map(([a,d])=>(
                <div key={a} style={{display:"flex",gap:10,marginBottom:5}}>
                  <code style={{color:"#f59e0b",fontSize:11,minWidth:120,flexShrink:0}}>{a}</code>
                  <span style={{color:"#64748b",fontSize:12}}>{d}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
      {view==="space" && (
        <Card>
          <div style={{color:"#6366f1",fontWeight:700,marginBottom:10}}>IPv6 Address Space</div>
          <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:14}}>
            IPv6 has <strong style={{color:"#e2e8f0"}}>2¹²⁸ ≈ 3.4 × 10³⁸ addresses</strong>. That's roughly 667 quadrillion addresses per square millimeter of Earth's surface. IPv4 had only 2³² ≈ 4.3 billion.
          </p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
            {[{label:"IPv4 total",val:"~4.3 billion",sub:"2³² addresses",color:"#ef4444"},{label:"IPv6 total",val:"3.4 × 10³⁸",sub:"2¹²⁸ addresses",color:"#6366f1"}].map(c=>(
              <div key={c.label} style={{background:"#0f172a",borderRadius:10,padding:16,textAlign:"center"}}>
                <div style={{color:c.color,fontWeight:800,fontSize:18,marginBottom:4}}>{c.val}</div>
                <div style={{color:"#64748b",fontSize:12}}>{c.label}</div>
                <div style={{color:"#475569",fontSize:11}}>{c.sub}</div>
              </div>
            ))}
          </div>
          <ST>ADDRESS TYPES IN IPv6</ST>
          {[["Unicast","One-to-one. Packet delivered to exactly one interface.","#0ea5e9"],
            ["Multicast","One-to-many. Packet delivered to all interfaces in multicast group. Replaces broadcast.","#10b981"],
            ["Anycast","One-to-nearest. Packet delivered to nearest (topologically) interface with that address.","#f59e0b"],
          ].map(([t,d,c])=>(
            <div key={t} style={{background:"#0f172a",borderRadius:8,padding:12,marginBottom:8}}>
              <div style={{color:c,fontWeight:700,fontSize:13,marginBottom:3}}>{t}</div>
              <div style={{color:"#64748b",fontSize:12}}>{d}</div>
            </div>
          ))}
          <div style={{color:"#f59e0b",fontSize:12,marginTop:10}}>⚠ IPv6 has NO broadcast — multicast replaces it entirely.</div>
        </Card>
      )}
      {view==="alloc" && (
        <Card>
          <div style={{color:"#6366f1",fontWeight:700,marginBottom:10}}>IPv6 Address Space Allocation (IANA)</div>
          <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:14}}>IANA allocates /23 or larger blocks to Regional Internet Registries (RIRs: ARIN, RIPE, APNIC, LACNIC, AFRINIC), which sub-allocate to ISPs and end users.</p>
          <div style={{display:"grid",gap:8}}>
            {[
              {prefix:"::/128",color:"#64748b",use:"Unspecified address (not assigned to any node)"},
              {prefix:"::1/128",color:"#0ea5e9",use:"Loopback address (like 127.0.0.1 in IPv4)"},
              {prefix:"fc00::/7",color:"#8b5cf6",use:"Unique Local Addresses (ULA) — private use, not routed globally"},
              {prefix:"fe80::/10",color:"#f59e0b",use:"Link-Local — auto-configured, valid only on local link segment"},
              {prefix:"ff00::/8",color:"#10b981",use:"Multicast — replaces IPv4 broadcast"},
              {prefix:"2000::/3",color:"#6366f1",use:"Global Unicast — publicly routable internet addresses"},
              {prefix:"2001:db8::/32",color:"#ec4899",use:"Documentation and examples (like 192.0.2.0/24 in IPv4)"},
              {prefix:"2002::/16",color:"#14b8a6",use:"6to4 tunneling — embed IPv4 in IPv6 for transition"},
            ].map(r=>(
              <div key={r.prefix} style={{display:"flex",gap:12,alignItems:"center",background:"#0f172a",borderRadius:8,padding:"8px 12px"}}>
                <code style={{color:r.color,fontWeight:700,fontSize:11,minWidth:140,flexShrink:0}}>{r.prefix}</code>
                <span style={{color:"#64748b",fontSize:12}}>{r.use}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
      {view==="eui" && (
        <Card>
          <div style={{color:"#6366f1",fontWeight:700,marginBottom:10}}>EUI-64 — Modified Extended Unique Identifier</div>
          <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:14}}>
            IPv6 stateless address autoconfiguration (SLAAC) can generate the 64-bit interface identifier from the MAC address using the <strong style={{color:"#e2e8f0"}}>EUI-64 method</strong>. This allows devices to self-configure without DHCP.
          </p>
          <div style={{color:"#e2e8f0",fontWeight:700,marginBottom:12}}>EUI-64 Conversion Steps</div>
          {[
            {step:"1. Take the 48-bit MAC address",ex:"00:1A:2B:3C:4D:5E",color:"#0ea5e9"},
            {step:"2. Split in half and insert FF:FE in the middle",ex:"00:1A:2B:FF:FE:3C:4D:5E",color:"#6366f1"},
            {step:"3. Flip the 7th bit (U/L bit) of the first byte",ex:"02:1A:2B:FF:FE:3C:4D:5E (00→02: bit 6 flipped)",color:"#10b981"},
            {step:"4. Convert to IPv6 notation (group into 16-bit pairs)",ex:"021A:2BFF:FE3C:4D5E",color:"#f59e0b"},
            {step:"5. Combine with /64 network prefix",ex:"fe80::021A:2BFF:FE3C:4D5E (link-local)",color:"#ec4899"},
          ].map(r=>(
            <div key={r.step} style={{background:"#0f172a",borderRadius:8,padding:12,marginBottom:8}}>
              <div style={{color:r.color,fontWeight:700,fontSize:12,marginBottom:4}}>{r.step}</div>
              <code style={{color:"#94a3b8",fontSize:12}}>{r.ex}</code>
            </div>
          ))}
          <div style={{marginTop:12,background:"#0f172a",borderRadius:8,padding:12}}>
            <div style={{color:"#f59e0b",fontWeight:700,fontSize:12,marginBottom:6}}>Privacy Note</div>
            <div style={{color:"#64748b",fontSize:12}}>EUI-64 embeds the MAC address in the IPv6 address, enabling tracking. RFC 4941 introduces <em>privacy extensions</em> — random temporary addresses that change periodically to prevent tracking.</div>
          </div>
        </Card>
      )}
      {view==="adv" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {[
            {title:"Vastly Larger Address Space",color:"#6366f1",icon:"📦",desc:"2¹²⁸ vs 2³² addresses. Every device on Earth (and in space) can have multiple public addresses. Eliminates need for NAT."},
            {title:"No Broadcast — Multicast",color:"#10b981",icon:"📡",desc:"IPv6 has no broadcast traffic. Uses multicast (ff00::/8) and anycast instead. Reduces network noise significantly."},
            {title:"Simplified Header",color:"#0ea5e9",icon:"⚡",desc:"IPv6 header is fixed 40 bytes. Removed checksum (handled by L2/L4), fragmentation fields, and options. Faster router processing."},
            {title:"Stateless Address Autoconfiguration (SLAAC)",color:"#f59e0b",icon:"🤖",desc:"Devices auto-configure IPv6 address using network prefix + EUI-64 or random. No DHCP server needed for basic connectivity."},
            {title:"Built-in IPSec",color:"#ef4444",icon:"🔒",desc:"IPSec (AH + ESP) is mandatory in IPv6 specification (though not always enforced). Better security architecture than IPv4."},
            {title:"Better QoS with Flow Labels",color:"#8b5cf6",icon:"🏷️",desc:"20-bit Flow Label field identifies packet flows. Routers can give consistent treatment to all packets of a flow without inspecting upper-layer headers."},
            {title:"Improved Mobility",color:"#ec4899",icon:"📱",desc:"Mobile IPv6 (MIPv6) is more efficient than MIPv4. Route optimization allows direct communication without triangle routing through home agent."},
            {title:"No More NAT",color:"#14b8a6",icon:"🔓",desc:"With enough public addresses for every device, NAT is unnecessary. Restores end-to-end connectivity principle — every device directly reachable."},
          ].map(a=>(
            <Card key={a.title}>
              <div style={{fontSize:20,marginBottom:6}}>{a.icon}</div>
              <div style={{color:a.color,fontWeight:700,marginBottom:6}}>{a.title}</div>
              <div style={{color:"#64748b",fontSize:13,lineHeight:1.7}}>{a.desc}</div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function NL_Routing() {
  const [algo, setAlgo] = useState("ls");
  return (
    <div>
      <ST>ROUTING ALGORITHMS (Tanenbaum §5.2)</ST>
      <Tabs color="#10b981"
        tabs={[{id:"ls",label:"Link State"},{id:"dv",label:"Distance Vector"},{id:"cmp",label:"Comparison"},{id:"protos",label:"RIP / OSPF / BGP"}]}
        active={algo} setActive={setAlgo}/>
      {algo==="ls" && (
        <div>
          <Card style={{marginBottom:14}}>
            <div style={{color:"#10b981",fontWeight:700,fontSize:15,marginBottom:8}}>Link State Routing (Dijkstra)</div>
            <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:12}}>
              Every router <strong style={{color:"#e2e8f0"}}>floods its local link information</strong> to all other routers. Each router builds a complete topology map (LSDB), then runs Dijkstra's SPF algorithm locally to find shortest paths. Used by OSPF and IS-IS.
            </p>
            <ST>LINK STATE ALGORITHM STEPS</ST>
            {["Each router discovers its neighbors and measures link costs (via Hello packets)",
              "Each router creates a Link State Packet (LSP) containing: router ID, neighbor list, link costs",
              "LSPs are flooded to ALL routers in the network (reliable flooding with sequence numbers)",
              "Each router builds identical Link State Database (LSDB) = complete network topology",
              "Each router independently runs Dijkstra's SPF to compute shortest path tree",
              "Routing table populated from SPF tree; updated when topology changes"
            ].map((s,i)=>(
              <div key={i} style={{display:"flex",gap:10,marginBottom:8}}>
                <span style={{background:"#10b98122",color:"#10b981",borderRadius:4,padding:"1px 6px",fontSize:11,fontWeight:700,flexShrink:0}}>{i+1}</span>
                <span style={{color:"#94a3b8",fontSize:13}}>{s}</span>
              </div>
            ))}
          </Card>
          <Card>
            <div style={{color:"#e2e8f0",fontWeight:700,marginBottom:10}}>Dijkstra's Algorithm — Worked Example</div>
            <svg width="100%" viewBox="0 0 440 200" style={{maxWidth:440}}>
              {[["A","B",4],["A","D",2],["B","C",5],["B","D",1],["C","E",3],["D","C",8],["D","E",10]].map(([f,t,w],i)=>{
                const pos={A:{x:60,y:100},B:{x:180,y:40},C:{x:300,y:100},D:{x:180,y:160},E:{x:390,y:160}};
                const p1=pos[f],p2=pos[t],mx=(p1.x+p2.x)/2,my=(p1.y+p2.y)/2;
                return <g key={i}>
                  <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#334155" strokeWidth={2}/>
                  <rect x={mx-10} y={my-8} width={20} height={16} fill="#0f172a" rx={3}/>
                  <text x={mx} y={my+4} textAnchor="middle" fill="#f59e0b" fontSize={11} fontWeight="700">{w}</text>
                </g>;
              })}
              {[{id:"A",x:60,y:100,d:0},{id:"B",x:180,y:40,d:3},{id:"C",x:300,y:100,d:8},{id:"D",x:180,y:160,d:2},{id:"E",x:390,y:160,d:11}].map(n=>(
                <g key={n.id}>
                  <circle cx={n.x} cy={n.y} r={20} fill="#1e293b" stroke="#10b981" strokeWidth={2}/>
                  <text x={n.x} y={n.y+2} textAnchor="middle" fill="#e2e8f0" fontSize={13} fontWeight="700">{n.id}</text>
                  <text x={n.x} y={n.y+14} textAnchor="middle" fill="#10b981" fontSize={9}>{n.d}</text>
                </g>
              ))}
            </svg>
            <div style={{color:"#475569",fontSize:12,marginTop:4}}>Numbers below nodes = shortest distance from A. A→D(2)→B(2+1=3)→C(3+5=8)→E(8+3=11)</div>
          </Card>
        </div>
      )}
      {algo==="dv" && (
        <div>
          <Card style={{marginBottom:14}}>
            <div style={{color:"#0ea5e9",fontWeight:700,fontSize:15,marginBottom:8}}>Distance Vector Routing (Bellman-Ford)</div>
            <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:12}}>
              Each router only knows distances to its <strong style={{color:"#e2e8f0"}}>direct neighbors</strong>. Routers exchange their distance vectors (routing tables) with neighbors periodically. Routes converge over time. Used by RIP.
            </p>
            <ST>BELLMAN-FORD EQUATION</ST>
            <div style={{background:"#0f172a",borderRadius:8,padding:14,fontFamily:"monospace",fontSize:13,color:"#94a3b8",marginBottom:14}}>
              D<sub style={{fontSize:10}}>x</sub>(y) = min<sub style={{fontSize:10}}>v</sub> {"{"} c(x,v) + D<sub style={{fontSize:10}}>v</sub>(y) {"}"}<br/>
              <span style={{color:"#64748b",fontSize:11}}>x's cost to y = min over neighbors v of (cost to v + v's cost to y)</span>
            </div>
            <ST>DISTANCE VECTOR ALGORITHM STEPS</ST>
            {["Each router initializes table: cost to self=0, neighbors=link cost, others=∞",
              "Periodically (e.g. every 30s for RIP), send distance vector to all neighbors",
              "On receiving neighbor's vector: apply Bellman-Ford equation to each destination",
              "If new cost < current cost → update table, send updated vector to neighbors",
              "Repeat until no more updates (convergence)",
              "On link failure: update to ∞, propagate — can cause count-to-infinity problem"
            ].map((s,i)=>(
              <div key={i} style={{display:"flex",gap:10,marginBottom:8}}>
                <span style={{background:"#0ea5e922",color:"#0ea5e9",borderRadius:4,padding:"1px 6px",fontSize:11,fontWeight:700,flexShrink:0}}>{i+1}</span>
                <span style={{color:"#94a3b8",fontSize:13}}>{s}</span>
              </div>
            ))}
          </Card>
          <Card>
            <div style={{color:"#ef4444",fontWeight:700,marginBottom:10}}>⚠ Count-to-Infinity Problem</div>
            <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:10}}>
              When a link fails, DV routers may believe they can still reach the destination through each other, causing metrics to increment endlessly until infinity (max hop count).
            </p>
            {[["Scenario","A-B link fails. A sets dist[B]=∞. But C thinks it can reach B via A (old info)."],
              ["Round 1","C advertises dist[B]=2. A thinks: C+C→B = 1+2=3. Updates to 3."],
              ["Round 2","A advertises 3. C updates to 4. A updates to 5... grows forever."],
              ["Solution 1","Split Horizon: never advertise a route back to the neighbor you learned it from."],
              ["Solution 2","Poison Reverse: advertise routes back with metric ∞."],
              ["Solution 3","Hold-down timers: ignore updates for a period after route goes down."],
            ].map(([l,d])=>(
              <div key={l} style={{display:"flex",gap:10,marginBottom:6}}>
                <span style={{color:"#ef4444",fontWeight:700,fontSize:12,minWidth:90,flexShrink:0}}>{l}:</span>
                <span style={{color:"#64748b",fontSize:12}}>{d}</span>
              </div>
            ))}
          </Card>
        </div>
      )}
      {algo==="cmp" && (
        <Card>
          <ST>LINK STATE vs DISTANCE VECTOR — COMPARISON</ST>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead><tr style={{background:"#0f172a"}}>
                {["Feature","Link State","Distance Vector"].map(h=><th key={h} style={{padding:"8px 12px",color:"#64748b",textAlign:"left"}}>{h}</th>)}
              </tr></thead>
              <tbody>
                {[["Algorithm","Dijkstra (SPF)","Bellman-Ford"],
                  ["Info shared","Own links only (LSPs)","Entire routing table"],
                  ["Shared with","ALL routers (flooding)","Direct neighbors only"],
                  ["Network view","Complete topology","Local neighborhood"],
                  ["Convergence","Fast","Slow (may count to ∞)"],
                  ["Memory usage","High (stores full topology)","Low (only routing table)"],
                  ["CPU usage","High (run Dijkstra)","Low"],
                  ["Bandwidth","High at startup (flooding)","Steady (periodic updates)"],
                  ["Count-to-∞","No","Yes (needs fix)"],
                  ["Scalability","Good (hierarchical areas)","Poor for large nets"],
                  ["Protocols","OSPF, IS-IS","RIP, IGRP"],
                ].map(([f,ls,dv])=>(
                  <tr key={f} style={{borderTop:"1px solid #1e293b"}}>
                    <td style={{padding:"7px 12px",color:"#94a3b8",fontWeight:600}}>{f}</td>
                    <td style={{padding:"7px 12px",color:"#10b981"}}>{ls}</td>
                    <td style={{padding:"7px 12px",color:"#0ea5e9"}}>{dv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      {algo==="protos" && (
        <div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <Card>
              <div style={{color:"#f59e0b",fontWeight:700,fontSize:14,marginBottom:6}}>RIP — Routing Information Protocol</div>
              <div style={{color:"#64748b",fontSize:11,marginBottom:10}}>Distance Vector · RFC 1058 (v1), RFC 2453 (v2)</div>
              {[["Type","Distance Vector (Bellman-Ford)"],["Metric","Hop count (max 15; 16=∞=unreachable)"],["Updates","Broadcast/multicast every 30 seconds"],["Timers","Update:30s, Invalid:180s, Flush:240s"],["Versions","RIPv1: classful | RIPv2: CIDR, auth | RIPng: IPv6"],["Use","Small networks, simple setups"],["Limitation","Max 15 hops; slow convergence; count-to-∞"]].map(([k,v])=>(
                <div key={k} style={{display:"flex",gap:8,marginBottom:5}}>
                  <span style={{color:"#f59e0b",fontWeight:600,fontSize:12,minWidth:70,flexShrink:0}}>{k}:</span>
                  <span style={{color:"#64748b",fontSize:12}}>{v}</span>
                </div>
              ))}
            </Card>
            <Card>
              <div style={{color:"#8b5cf6",fontWeight:700,fontSize:14,marginBottom:6}}>OSPF — Open Shortest Path First</div>
              <div style={{color:"#64748b",fontSize:11,marginBottom:10}}>Link State · RFC 2328 (v2), RFC 5340 (v3/IPv6)</div>
              {[["Type","Link State (Dijkstra)"],["Metric","Cost (typically 10⁸/bandwidth)"],["Updates","Triggered on change; LSA flooding"],["Areas","Area 0 (backbone) + stub/NSSA areas"],["Adjacency","Hello packets → DR/BDR election"],["Auth","MD5/SHA authentication supported"],["Features","ECMP, VLSM, fast convergence, hierarchical"]].map(([k,v])=>(
                <div key={k} style={{display:"flex",gap:8,marginBottom:5}}>
                  <span style={{color:"#8b5cf6",fontWeight:600,fontSize:12,minWidth:70,flexShrink:0}}>{k}:</span>
                  <span style={{color:"#64748b",fontSize:12}}>{v}</span>
                </div>
              ))}
            </Card>
          </div>
          <Card>
            <div style={{color:"#ef4444",fontWeight:700,fontSize:14,marginBottom:6}}>BGP — Border Gateway Protocol</div>
            <div style={{color:"#64748b",fontSize:11,marginBottom:10}}>Path Vector · RFC 4271 · The routing protocol of the Internet</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div>
                {[["Type","Path Vector (stores AS paths)"],["Transport","TCP port 179 (reliable delivery)"],["Scope","Between Autonomous Systems (eBGP) or within (iBGP)"],["Metric","Not shortest path — policy-driven"],["Path Attributes","AS_PATH, NEXT_HOP, LOCAL_PREF, MED, COMMUNITY"]].map(([k,v])=>(
                  <div key={k} style={{display:"flex",gap:8,marginBottom:6}}>
                    <span style={{color:"#ef4444",fontWeight:600,fontSize:12,minWidth:90,flexShrink:0}}>{k}:</span>
                    <span style={{color:"#64748b",fontSize:12}}>{v}</span>
                  </div>
                ))}
              </div>
              <div>
                <div style={{color:"#e2e8f0",fontWeight:700,fontSize:12,marginBottom:8}}>BGP Route Selection Order</div>
                {["1. Highest LOCAL_PREF (local policy)","2. Shortest AS_PATH","3. Lowest ORIGIN (IGP > EGP > incomplete)","4. Lowest MED (from same AS)","5. eBGP over iBGP routes","6. Lowest IGP cost to next hop","7. Oldest eBGP route","8. Lowest router ID (tiebreak)"].map((s,i)=>(
                  <div key={i} style={{color:"#64748b",fontSize:11,marginBottom:3}}>{s}</div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function NL_Congestion() {
  return (
    <div>
      <ST>CONGESTION CONTROL AT THE NETWORK LAYER (Tanenbaum §5.3)</ST>
      <p style={{color:"#94a3b8",marginBottom:16,fontSize:13,lineHeight:1.7}}>
        Congestion occurs when offered load exceeds network capacity. Unlike transport-layer congestion control (per-flow), network-layer approaches operate on aggregate traffic.
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <Card>
          <div style={{color:"#ef4444",fontWeight:700,marginBottom:8}}>Leaky Bucket Algorithm</div>
          <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:10}}>Packets enter a bucket (queue) at any rate; leave at a fixed constant rate r bytes/sec. Smooths bursty traffic. Excess packets overflow (dropped). Guarantees constant output rate.</p>
          <svg viewBox="0 0 200 140" width="100%">
            <rect x={70} y={10} width={60} height={80} rx={4} fill="#ef444422" stroke="#ef4444" strokeWidth={2}/>
            <text x={100} y={35} textAnchor="middle" fill="#ef4444" fontSize={10} fontWeight="700">BUCKET</text>
            {[30,50,70].map((y,i)=><rect key={i} x={75} y={y} width={50} height={10} rx={3} fill="#ef444455"/>)}
            <text x={100} y={80} textAnchor="middle" fill="#64748b" fontSize={9}>packets queue</text>
            <line x1={100} y1={90} x2={100} y2={115} stroke="#ef4444" strokeWidth={2}/>
            <text x={100} y={130} textAnchor="middle" fill="#ef4444" fontSize={10} fontWeight="700">→ r bytes/sec (constant)</text>
            {[30,55].map((x,i)=><text key={i} x={x} y={40+i*20} fill="#94a3b8" fontSize={9} textAnchor="middle">→</text>)}
          </svg>
        </Card>
        <Card>
          <div style={{color:"#f59e0b",fontWeight:700,marginBottom:8}}>Token Bucket Algorithm</div>
          <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:10}}>Tokens accumulate at rate r (up to capacity b). One token consumed per packet. Allows bursts up to b packets when tokens available. More flexible than leaky bucket.</p>
          {[["Token rate (r)","r tokens/sec generated"],["Bucket size (b)","Max burst = b packets"],["No tokens","Packet waits or is dropped"],["Max output","b + r×T over T seconds"],["Vs Leaky Bucket","Allows controlled bursts; leaky does not"]].map(([k,v])=>(
            <div key={k} style={{display:"flex",gap:8,marginBottom:5}}>
              <span style={{color:"#f59e0b",fontWeight:600,fontSize:11,minWidth:100,flexShrink:0}}>{k}:</span>
              <span style={{color:"#64748b",fontSize:12}}>{v}</span>
            </div>
          ))}
        </Card>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Card>
          <div style={{color:"#10b981",fontWeight:700,marginBottom:8}}>Other Congestion Control Methods</div>
          {[{n:"Admission Control",d:"Reject new flows if network already congested. Common in ATM/IntServ."},
            {n:"Traffic Shaping",d:"Rate-limit flows entering the network (leaky/token bucket at ingress)."},
            {n:"Load Shedding",d:"Deliberately drop packets before buffer overflows — Random Early Detection (RED)."},
            {n:"Choke Packets",d:"Router sends congestion warning back to source to reduce rate (explicit feedback)."},
            {n:"ECN (Explicit Congestion Notification)",d:"IP header bits set by routers when congested; TCP reacts without loss."},
          ].map(({n,d})=>(
            <div key={n} style={{marginBottom:10}}>
              <div style={{color:"#10b981",fontWeight:700,fontSize:12}}>{n}</div>
              <div style={{color:"#64748b",fontSize:12}}>{d}</div>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{color:"#6366f1",fontWeight:700,marginBottom:8}}>RED — Random Early Detection</div>
          <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:10}}>Drop packets probabilistically as queue grows, before it fills completely. This signals TCP senders to slow down before catastrophic loss.</p>
          {[["min_th","Below this: never drop"],["max_th","Above this: always drop"],["Between","Drop probability increases linearly from 0→1"],["Benefit","Avoids global synchronization of TCP flows"],["WRED","Weighted RED: different thresholds per traffic class"]].map(([k,v])=>(
            <div key={k} style={{display:"flex",gap:8,marginBottom:5}}>
              <span style={{color:"#6366f1",fontWeight:600,fontSize:11,minWidth:75,flexShrink:0}}>{k}:</span>
              <span style={{color:"#64748b",fontSize:12}}>{v}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function NL_QoS() {
  return (
    <div>
      <ST>QUALITY OF SERVICE (Tanenbaum §5.4)</ST>
      <p style={{color:"#94a3b8",marginBottom:16,fontSize:13,lineHeight:1.7}}>
        QoS provides guarantees (or differentiated treatment) for network flows based on their needs. Key metrics: <strong style={{color:"#e2e8f0"}}>bandwidth, delay, jitter, packet loss</strong>.
      </p>
      <Card style={{marginBottom:14}}>
        <ST>QoS REQUIREMENTS BY APPLICATION</ST>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{background:"#0f172a"}}>
              {["Application","Bandwidth","Latency","Jitter","Loss OK?"].map(h=><th key={h} style={{padding:"8px 10px",color:"#64748b",textAlign:"left"}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {[["Email","Low","High","High","Low (retransmit)","#64748b"],
                ["File Transfer","High","Medium","High","Low","#64748b"],
                ["Web Browsing","Medium","Medium","Medium","Low","#0ea5e9"],
                ["VoIP","8–64 kbps","<150ms","<30ms","<1%","#10b981"],
                ["Video Conference","1–25 Mbps","<150ms","<30ms","<2%","#f59e0b"],
                ["Live Streaming","Very High","Medium","Low","Low","#ef4444"],
                ["Online Gaming","Medium","<50ms","<20ms","<1%","#8b5cf6"],
              ].map(([app,bw,lat,jit,loss,c])=>(
                <tr key={app} style={{borderTop:"1px solid #1e293b"}}>
                  <td style={{padding:"7px 10px",color:c,fontWeight:600}}>{app}</td>
                  <td style={{padding:"7px 10px",color:"#94a3b8"}}>{bw}</td>
                  <td style={{padding:"7px 10px",color:"#94a3b8"}}>{lat}</td>
                  <td style={{padding:"7px 10px",color:"#94a3b8"}}>{jit}</td>
                  <td style={{padding:"7px 10px",color:"#94a3b8"}}>{loss}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Card>
          <div style={{color:"#6366f1",fontWeight:700,marginBottom:8}}>IntServ — Integrated Services</div>
          <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:8}}>Per-flow resource reservation using RSVP. Each flow explicitly reserves bandwidth and delay. Strong guarantees but doesn't scale to internet size.</p>
          {[["Protocol","RSVP (Resource Reservation)"],["Guarantee","Hard QoS per flow"],["Scale","Poor — per-flow state in every router"],["Use","Controlled enterprise networks"]].map(([k,v])=>(
            <div key={k} style={{display:"flex",gap:8,marginBottom:5}}>
              <span style={{color:"#6366f1",fontSize:12,fontWeight:600,minWidth:75,flexShrink:0}}>{k}:</span>
              <span style={{color:"#64748b",fontSize:12}}>{v}</span>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{color:"#0ea5e9",fontWeight:700,marginBottom:8}}>DiffServ — Differentiated Services</div>
          <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:8}}>Mark packets with DSCP field (6 bits in IP ToS byte). Routers treat packets differently by class. No per-flow state — scales to the internet.</p>
          {[["Field","DSCP — 6 bits in IP header"],["Classes","EF (Expedited Forwarding), AF (Assured), BE (Best Effort)"],["Scale","Excellent — aggregate treatment"],["Use","ISPs, enterprise WAN, VoIP QoS"]].map(([k,v])=>(
            <div key={k} style={{display:"flex",gap:8,marginBottom:5}}>
              <span style={{color:"#0ea5e9",fontSize:12,fontWeight:600,minWidth:75,flexShrink:0}}>{k}:</span>
              <span style={{color:"#64748b",fontSize:12}}>{v}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function NL_Casting() {
  const [type, setType] = useState("unicast");
  const types = {
    unicast:{label:"Unicast",color:"#0ea5e9",desc:"One sender, one receiver. Standard point-to-point communication. Each packet has one specific destination IP.",
      uses:["Web browsing (HTTP)","File download (FTP/HTTPS)","SSH / Telnet remote access","Email delivery (SMTP)"],
      visual:(
        <svg viewBox="0 0 300 120" width="100%">
          <circle cx={50} cy={60} r={18} fill="#1e293b" stroke="#0ea5e9" strokeWidth={2}/>
          <text x={50} y={64} textAnchor="middle" fill="#0ea5e9" fontSize={9}>SRC</text>
          <line x1={70} y1={60} x2={230} y2={60} stroke="#0ea5e9" strokeWidth={2} markerEnd="url(#arrow)"/>
          <defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#0ea5e9"/></marker></defs>
          <circle cx={250} cy={60} r={18} fill="#1e293b" stroke="#0ea5e9" strokeWidth={2}/>
          <text x={250} y={64} textAnchor="middle" fill="#0ea5e9" fontSize={9}>DST</text>
          <text x={150} y={48} textAnchor="middle" fill="#64748b" fontSize={9}>one packet → one destination</text>
        </svg>
      )},
    broadcast:{label:"Broadcast",color:"#ef4444",desc:"One sender, ALL receivers in the network/subnet. IPv4 uses 255.255.255.255 (limited) or x.x.x.255 (directed). IPv6 has NO broadcast — replaced by multicast.",
      uses:["ARP requests (who has IP X?)","DHCP Discover","RIP routing updates","Network discovery"],
      visual:(
        <svg viewBox="0 0 300 150" width="100%">
          <circle cx={50} cy={75} r={18} fill="#1e293b" stroke="#ef4444" strokeWidth={2}/>
          <text x={50} y={79} textAnchor="middle" fill="#ef4444" fontSize={9}>SRC</text>
          {[[200,30],[250,75],[200,120]].map(([x,y],i)=>(
            <g key={i}>
              <line x1={68} y1={75} x2={x-18} y2={y} stroke="#ef4444" strokeWidth={1.5}/>
              <circle cx={x} cy={y} r={16} fill="#1e293b" stroke="#ef4444" strokeWidth={1.5}/>
              <text x={x} y={y+4} textAnchor="middle" fill="#ef4444" fontSize={8}>PC</text>
            </g>
          ))}
          <text x={150} y={145} textAnchor="middle" fill="#64748b" fontSize={9}>ALL nodes receive</text>
        </svg>
      )},
    multicast:{label:"Multicast",color:"#10b981",desc:"One sender, multiple specific receivers (subscribed group). IP range 224.0.0.0/4 (Class D in IPv4), ff00::/8 in IPv6. Routers use IGMP/PIM to manage group membership.",
      uses:["Live video/audio streaming","IPTV","Online gaming server state","OSPF routing (224.0.0.5/6)","Stock ticker / financial feeds"],
      visual:(
        <svg viewBox="0 0 300 150" width="100%">
          <circle cx={40} cy={75} r={18} fill="#1e293b" stroke="#10b981" strokeWidth={2}/>
          <text x={40} y={79} textAnchor="middle" fill="#10b981" fontSize={9}>SRC</text>
          {[[180,25],[230,75],[180,125]].map(([x,y],i)=>(
            <g key={i}>
              <line x1={58} y1={75} x2={x-16} y2={y} stroke="#10b981" strokeWidth={1.5}/>
              <circle cx={x} cy={y} r={16} fill="#1e293b" stroke="#10b981" strokeWidth={2}/>
              <text x={x} y={y+4} textAnchor="middle" fill="#10b981" fontSize={8}>✓</text>
            </g>
          ))}
          <circle cx={265} cy={40} r={14} fill="#1e293b" stroke="#334155" strokeWidth={1.5}/>
          <text x={265} y={44} textAnchor="middle" fill="#475569" fontSize={8}>✗</text>
          <text x={150} y={145} textAnchor="middle" fill="#64748b" fontSize={9}>Only subscribed members receive</text>
        </svg>
      )},
    anycast:{label:"Anycast",color:"#f59e0b",desc:"One sender, NEAREST receiver (topologically). Multiple servers share the same IP address; BGP routes packet to the nearest one. Used for low-latency global services.",
      uses:["DNS root servers (all share same IP)","CDN edge servers","DDoS mitigation","IPv6 routers (all-routers anycast)"],
      visual:(
        <svg viewBox="0 0 300 150" width="100%">
          <circle cx={40} cy={75} r={18} fill="#1e293b" stroke="#f59e0b" strokeWidth={2}/>
          <text x={40} y={79} textAnchor="middle" fill="#f59e0b" fontSize={9}>SRC</text>
          {[[190,25,"far"],[220,75,"near"],[190,125,"far"]].map(([x,y,dist],i)=>(
            <g key={i}>
              <line x1={58} y1={75} x2={x-16} y2={y} stroke={dist==="near"?"#f59e0b":"#334155"} strokeWidth={dist==="near"?2:1} strokeDasharray={dist==="near"?"":"4,3"}/>
              <circle cx={x} cy={y} r={16} fill="#1e293b" stroke={dist==="near"?"#f59e0b":"#334155"} strokeWidth={dist==="near"?2:1}/>
              <text x={x} y={y+4} textAnchor="middle" fill={dist==="near"?"#f59e0b":"#475569"} fontSize={8}>{dist==="near"?"✓":"✗"}</text>
            </g>
          ))}
          <text x={150} y={145} textAnchor="middle" fill="#64748b" fontSize={9}>Only nearest server responds</text>
        </svg>
      )},
  };
  const t = types[type];
  return (
    <div>
      <ST>UNICAST / BROADCAST / MULTICAST / ANYCAST ROUTING (Tanenbaum §5.2.6)</ST>
      <Tabs color="#10b981"
        tabs={Object.entries(types).map(([id,v])=>({id,label:v.label}))}
        active={type} setActive={setType}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <Card style={{display:"flex",alignItems:"center",justifyContent:"center"}}>{t.visual}</Card>
        <Card>
          <div style={{color:t.color,fontWeight:700,fontSize:16,marginBottom:8}}>{t.label} Routing</div>
          <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:12}}>{t.desc}</p>
          <div style={{color:"#e2e8f0",fontWeight:700,fontSize:12,marginBottom:8}}>Use Cases</div>
          {t.uses.map((u,i)=><div key={i} style={{color:"#64748b",fontSize:13,marginBottom:4,paddingLeft:8}}>• {u}</div>)}
        </Card>
      </div>
    </div>
  );
}

function NL_ICMP_ARP() {
  const [view, setView] = useState("icmp");
  return (
    <div>
      <ST>ICMP, ARP, RARP (Tanenbaum §5.7.3)</ST>
      <Tabs color="#10b981"
        tabs={[{id:"icmp",label:"ICMP"},{id:"arp",label:"ARP"},{id:"rarp",label:"RARP"}]}
        active={view} setActive={setView}/>
      {view==="icmp" && (
        <div>
          <p style={{color:"#94a3b8",marginBottom:14,fontSize:13,lineHeight:1.7}}>
            <strong style={{color:"#e2e8f0"}}>ICMP — Internet Control Message Protocol</strong> (RFC 792). Works alongside IP for error reporting and network diagnostics. Not used for data transfer.
          </p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <Card>
              <div style={{color:"#10b981",fontWeight:700,marginBottom:10}}>ICMP Message Types</div>
              {[{type:"0",name:"Echo Reply",use:"ping response"},
                {type:"3",name:"Destination Unreachable",use:"host/port/net unreachable"},
                {type:"4",name:"Source Quench",use:"congestion signal (deprecated)"},
                {type:"5",name:"Redirect",use:"better route available"},
                {type:"8",name:"Echo Request",use:"ping — test reachability"},
                {type:"11",name:"Time Exceeded",use:"TTL expired — used by traceroute"},
                {type:"12",name:"Parameter Problem",use:"bad IP header"},
              ].map(r=>(
                <div key={r.type} style={{display:"flex",gap:8,marginBottom:5,alignItems:"flex-start"}}>
                  <span style={{background:"#10b98122",color:"#10b981",borderRadius:4,padding:"1px 6px",fontSize:10,fontWeight:700,flexShrink:0}}>Type {r.type}</span>
                  <div><span style={{color:"#e2e8f0",fontSize:12,fontWeight:600}}>{r.name}: </span><span style={{color:"#64748b",fontSize:12}}>{r.use}</span></div>
                </div>
              ))}
            </Card>
            <Card>
              <div style={{color:"#10b981",fontWeight:700,marginBottom:10}}>ping & traceroute explained</div>
              <div style={{color:"#e2e8f0",fontWeight:600,marginBottom:6,fontSize:13}}>ping</div>
              <p style={{color:"#94a3b8",fontSize:12,lineHeight:1.7,marginBottom:10}}>Sends ICMP Echo Request (Type 8) to target. Target replies with Echo Reply (Type 0). Measures round-trip time (RTT) and packet loss.</p>
              <div style={{color:"#e2e8f0",fontWeight:600,marginBottom:6,fontSize:13}}>traceroute</div>
              <p style={{color:"#94a3b8",fontSize:12,lineHeight:1.7,marginBottom:8}}>Sends packets with TTL=1, 2, 3... Each router decrements TTL; when it reaches 0, router sends ICMP Time Exceeded (Type 11) back. Reveals the path hop-by-hop.</p>
              <div style={{background:"#0f172a",borderRadius:8,padding:10,fontFamily:"monospace",fontSize:11,color:"#64748b"}}>
                TTL=1 → R1 replies (Time Exceeded)<br/>
                TTL=2 → R2 replies<br/>
                TTL=3 → R3 replies<br/>
                <span style={{color:"#10b981"}}>TTL=n → Destination (Echo Reply)</span>
              </div>
            </Card>
          </div>
        </div>
      )}
      {view==="arp" && (
        <div>
          <p style={{color:"#94a3b8",marginBottom:14,fontSize:13,lineHeight:1.7}}>
            <strong style={{color:"#e2e8f0"}}>ARP — Address Resolution Protocol</strong> (RFC 826). Maps a known <strong style={{color:"#e2e8f0"}}>IP address → MAC address</strong> on the same local network segment. Works at the boundary of Layer 2 and Layer 3.
          </p>
          <Card style={{marginBottom:14}}>
            <div style={{color:"#f59e0b",fontWeight:700,marginBottom:12}}>ARP Process — Step by Step</div>
            {["Host A wants to send to IP 192.168.1.20 (same subnet)",
              "A checks ARP cache — not found",
              "A broadcasts ARP Request: \"Who has 192.168.1.20? Tell 192.168.1.10\"",
              "ALL hosts receive the broadcast",
              "Only host with IP 192.168.1.20 (Host B) replies: unicast ARP Reply with its MAC",
              "Host A caches IP→MAC mapping (ARP cache), then sends the frame",
              "ARP cache entries expire (typically 20 minutes)"
            ].map((s,i)=>(
              <div key={i} style={{display:"flex",gap:10,marginBottom:7}}>
                <span style={{background:"#f59e0b22",color:"#f59e0b",borderRadius:4,padding:"1px 6px",fontSize:11,fontWeight:700,flexShrink:0}}>{i+1}</span>
                <span style={{color:"#94a3b8",fontSize:13}}>{s}</span>
              </div>
            ))}
          </Card>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <Card>
              <div style={{color:"#f59e0b",fontWeight:700,marginBottom:8}}>ARP Packet Format</div>
              {[["Hardware Type","1 = Ethernet"],["Protocol Type","0x0800 = IPv4"],["Hardware Addr Len","6 bytes (MAC)"],["Protocol Addr Len","4 bytes (IPv4)"],["Operation","1=Request, 2=Reply"],["Sender MAC/IP","Requester's addresses"],["Target MAC","FF:FF:FF:FF:FF:FF (request) or specific (reply)"],["Target IP","The IP being resolved"]].map(([f,v])=>(
                <div key={f} style={{display:"flex",gap:8,marginBottom:4}}>
                  <span style={{color:"#f59e0b",fontSize:11,fontWeight:600,minWidth:120,flexShrink:0}}>{f}:</span>
                  <span style={{color:"#64748b",fontSize:11}}>{v}</span>
                </div>
              ))}
            </Card>
            <Card>
              <div style={{color:"#ef4444",fontWeight:700,marginBottom:8}}>ARP Security Issues</div>
              <div style={{marginBottom:10}}>
                <div style={{color:"#ef4444",fontWeight:700,fontSize:12,marginBottom:4}}>ARP Spoofing / Poisoning</div>
                <p style={{color:"#64748b",fontSize:12,lineHeight:1.7}}>Attacker sends fake ARP Replies associating their MAC with a legitimate IP (e.g., default gateway). All traffic to that IP goes to attacker = Man-in-the-Middle attack.</p>
              </div>
              <div style={{color:"#10b981",fontWeight:700,fontSize:12,marginBottom:4}}>Defenses</div>
              {["Dynamic ARP Inspection (DAI) on switches","Static ARP entries for critical hosts","802.1X port authentication","VPN / encryption"].map((d,i)=><div key={i} style={{color:"#64748b",fontSize:12,marginBottom:3}}>• {d}</div>)}
            </Card>
          </div>
        </div>
      )}
      {view==="rarp" && (
        <div>
          <p style={{color:"#94a3b8",marginBottom:14,fontSize:13,lineHeight:1.7}}>
            <strong style={{color:"#e2e8f0"}}>RARP — Reverse Address Resolution Protocol</strong> (RFC 903). The opposite of ARP: maps a known <strong style={{color:"#e2e8f0"}}>MAC address → IP address</strong>. Used by diskless workstations that know their MAC but not their IP.
          </p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <Card>
              <div style={{color:"#14b8a6",fontWeight:700,marginBottom:8}}>RARP Process</div>
              {["Diskless client boots, knows only its MAC address",
                "Broadcasts RARP Request: \"I am MAC AA:BB:CC:DD:EE:FF, what is my IP?\"",
                "RARP server (must be on same segment) replies with assigned IP",
                "Client configures its network interface with the IP",
                "Limitation: RARP server must be on same LAN segment"
              ].map((s,i)=>(
                <div key={i} style={{display:"flex",gap:8,marginBottom:7}}>
                  <span style={{background:"#14b8a622",color:"#14b8a6",borderRadius:4,padding:"1px 6px",fontSize:11,fontWeight:700,flexShrink:0}}>{i+1}</span>
                  <span style={{color:"#94a3b8",fontSize:13}}>{s}</span>
                </div>
              ))}
            </Card>
            <Card>
              <div style={{color:"#14b8a6",fontWeight:700,marginBottom:8}}>RARP vs Modern Alternatives</div>
              <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:10}}>RARP is obsolete. It was replaced by BOOTP, then DHCP, which are more flexible (work across routers, provide more config info).</p>
              {[["RARP","MAC→IP only, same subnet only, no options"],["BOOTP","MAC→IP, can cross routers, some options"],["DHCP","Dynamic assignment, full config, lease time, scales"],
              ].map(([p,d])=>(
                <div key={p} style={{marginBottom:8}}>
                  <div style={{color:"#14b8a6",fontWeight:700,fontSize:12}}>{p}</div>
                  <div style={{color:"#64748b",fontSize:12}}>{d}</div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function NL_SDN() {
  return (
    <div>
      <ST>SOFTWARE DEFINED NETWORKING — SDN (Tanenbaum §5.6)</ST>
      <p style={{color:"#94a3b8",marginBottom:16,fontSize:13,lineHeight:1.7}}>
        SDN separates the <strong style={{color:"#e2e8f0"}}>control plane</strong> (routing logic) from the <strong style={{color:"#e2e8f0"}}>data plane</strong> (forwarding). A centralized controller programs all switches via APIs like OpenFlow. Enables programmable, vendor-agnostic networks.
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <Card>
          <div style={{color:"#8b5cf6",fontWeight:700,marginBottom:8}}>Traditional vs SDN</div>
          {[["Traditional","Control+data plane coupled in each router. Config device-by-device (CLI). Hard to automate. Proprietary."],["SDN","Centralized controller computes paths. Switches just forward. Programmable via APIs. Any hardware."]].map(([n,d])=>(
            <div key={n} style={{marginBottom:10,background:"#0f172a",borderRadius:8,padding:10}}>
              <div style={{color:"#8b5cf6",fontWeight:700,fontSize:12,marginBottom:3}}>{n}</div>
              <div style={{color:"#64748b",fontSize:12}}>{d}</div>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{color:"#8b5cf6",fontWeight:700,marginBottom:8}}>SDN Architecture</div>
          <svg viewBox="0 0 300 200" width="100%">
            {[{l:"Application Layer",y:10,c:"#6366f1",d:"Apps: LB, Firewall, TE"},
              {l:"Control Layer",y:80,c:"#8b5cf6",d:"SDN Controller (ONOS, ODL)"},
              {l:"Infrastructure Layer",y:150,c:"#10b981",d:"OpenFlow Switches"},
            ].map((layer,i)=>(
              <g key={i}>
                <rect x={10} y={layer.y} width={280} height={50} rx={6} fill={layer.c+"22"} stroke={layer.c} strokeWidth={1.5}/>
                <text x={24} y={layer.y+20} fill={layer.c} fontSize={11} fontWeight="700">{layer.l}</text>
                <text x={24} y={layer.y+36} fill="#64748b" fontSize={9}>{layer.d}</text>
                {i<2&&<text x={150} y={layer.y+70} textAnchor="middle" fill="#475569" fontSize={9}>↕ API (OpenFlow)</text>}
              </g>
            ))}
          </svg>
        </Card>
      </div>
    </div>
  );
}

function NetworkLayer() {
  const [sub, setSub] = useState("intro");
  const subs=[
    {id:"intro",label:"Design Issues"},
    {id:"ipv6",label:"IPv6"},
    {id:"routing",label:"Routing Algorithms"},
    {id:"congestion",label:"Congestion Control"},
    {id:"qos",label:"QoS"},
    {id:"casting",label:"Unicast/Multi/Broad/Anycast"},
    {id:"icmp_arp",label:"ICMP / ARP / RARP"},
    {id:"sdn",label:"SDN"},
  ];
  return (
    <div>
      <p style={{color:"#94a3b8",marginBottom:14,lineHeight:1.7}}>
        <strong style={{color:"#10b981"}}>Tanenbaum Ch. 5 — The Network Layer.</strong> Routing packets across networks. Key topics: IP, IPv6, routing algorithms, congestion, QoS, ARP, ICMP, SDN.
      </p>
      <Tabs color="#10b981" tabs={subs} active={sub} setActive={setSub}/>
      {sub==="intro"     && <NL_Intro />}
      {sub==="ipv6"      && <NL_IPv6 />}
      {sub==="routing"   && <NL_Routing />}
      {sub==="congestion"&& <NL_Congestion />}
      {sub==="qos"       && <NL_QoS />}
      {sub==="casting"   && <NL_Casting />}
      {sub==="icmp_arp"  && <NL_ICMP_ARP />}
      {sub==="sdn"       && <NL_SDN />}
    </div>
  );
}
// ═══════════════════════════════════════════════════════
//  TRANSPORT LAYER  — Tanenbaum Ch. 6
// ═══════════════════════════════════════════════════════

function TL_DesignIssues() {
  return (
    <div>
      <ST>DESIGN ISSUES & TRANSPORT SERVICE (Tanenbaum §6.1)</ST>
      <p style={{color:"#94a3b8",marginBottom:14,fontSize:13,lineHeight:1.7}}>
        The transport layer provides end-to-end <strong style={{color:"#e2e8f0"}}>process-to-process</strong> communication. It sits above the network layer (host-to-host) and below the application layer. Key task: isolate applications from network complexity.
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <Card>
          <div style={{color:"#0ea5e9",fontWeight:700,marginBottom:10}}>Transport Layer Services</div>
          {[{s:"Connection-oriented service",d:"TCP — establish, transfer, release. Reliable, ordered."},
            {s:"Connectionless service",d:"UDP — send and forget. Fast, no setup overhead."},
            {s:"Addressing",d:"Port numbers (TSAPs) identify processes within a host."},
            {s:"Error control",d:"Detect and recover from transmission errors (CRC, ACK, retransmit)."},
            {s:"Flow control",d:"Stop sender overwhelming receiver (sliding window)."},
            {s:"Congestion control",d:"Prevent overloading the network (TCP CWND / AIMD)."},
            {s:"Multiplexing",d:"Multiple applications share one IP address via different ports."},
          ].map(({s,d})=>(
            <div key={s} style={{marginBottom:9}}>
              <div style={{color:"#0ea5e9",fontWeight:700,fontSize:12}}>{s}</div>
              <div style={{color:"#64748b",fontSize:12}}>{d}</div>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{color:"#0ea5e9",fontWeight:700,marginBottom:10}}>Transport Service Primitives</div>
          <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:10}}>
            Primitives are the operations (system calls) the transport layer exposes to applications. Different for connection-oriented and connectionless services.
          </p>
          <div style={{color:"#e2e8f0",fontWeight:700,fontSize:12,marginBottom:6}}>Connection-oriented (TCP-like)</div>
          {[["LISTEN","Server waits for incoming connections"],["CONNECT","Client initiates connection to server"],["SEND","Transmit data over connection"],["RECEIVE","Block waiting for incoming data"],["DISCONNECT","Gracefully terminate connection"]].map(([p,d])=>(
            <div key={p} style={{display:"flex",gap:8,marginBottom:5}}>
              <code style={{color:"#0ea5e9",fontSize:11,fontWeight:700,minWidth:90,flexShrink:0}}>{p}</code>
              <span style={{color:"#64748b",fontSize:12}}>{d}</span>
            </div>
          ))}
          <div style={{color:"#f59e0b",fontWeight:700,fontSize:12,marginTop:10,marginBottom:6}}>Connectionless (UDP-like)</div>
          {[["SENDTO","Send datagram to specified address"],["RECVFROM","Receive datagram + sender address"]].map(([p,d])=>(
            <div key={p} style={{display:"flex",gap:8,marginBottom:5}}>
              <code style={{color:"#f59e0b",fontSize:11,fontWeight:700,minWidth:90,flexShrink:0}}>{p}</code>
              <span style={{color:"#64748b",fontSize:12}}>{d}</span>
            </div>
          ))}
        </Card>
      </div>
      <Card>
        <div style={{color:"#0ea5e9",fontWeight:700,marginBottom:10}}>Connectionless vs Connection-Oriented</div>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead><tr style={{background:"#0f172a"}}>
            {["Feature","Connectionless (UDP)","Connection-Oriented (TCP)"].map(h=><th key={h} style={{padding:"7px 12px",color:"#64748b",textAlign:"left"}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {[["Setup","None — send immediately","3-way handshake required"],
              ["State","Stateless","State maintained at both ends"],
              ["Reliability","None","Guaranteed (ACK + retransmit)"],
              ["Ordering","Not guaranteed","Guaranteed in-order delivery"],
              ["Header overhead","8 bytes","20–60 bytes"],
              ["Flow control","None","Sliding window (RWND)"],
              ["Congestion","None","CWND / AIMD"],
              ["Suitable for","DNS, VoIP, streaming","HTTP, email, file transfer"],
            ].map(([f,u,c])=>(
              <tr key={f} style={{borderTop:"1px solid #1e293b"}}>
                <td style={{padding:"6px 12px",color:"#94a3b8",fontWeight:600}}>{f}</td>
                <td style={{padding:"6px 12px",color:"#f59e0b"}}>{u}</td>
                <td style={{padding:"6px 12px",color:"#0ea5e9"}}>{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function TL_Elements() {
  const [view, setView] = useState("ports");
  return (
    <div>
      <ST>ELEMENTS OF TRANSPORT PROTOCOLS (Tanenbaum §6.2)</ST>
      <Tabs color="#0ea5e9"
        tabs={[{id:"ports",label:"Port Addressing"},{id:"est",label:"Connection Setup"},{id:"rel",label:"Connection Release"}]}
        active={view} setActive={setView}/>
      {view==="ports" && (
        <div>
          <Card style={{marginBottom:14}}>
            <div style={{color:"#0ea5e9",fontWeight:700,marginBottom:10}}>Port Addressing — TSAP</div>
            <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:12}}>
              A <strong style={{color:"#e2e8f0"}}>TSAP (Transport Service Access Point)</strong> = port number in TCP/IP. The combination of IP address + port = <strong style={{color:"#e2e8f0"}}>socket</strong>. Ports range 0–65535 (16-bit).
            </p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
              {[{range:"0–1023",name:"Well-Known",color:"#ef4444",ex:"HTTP:80, SSH:22, DNS:53"},
                {range:"1024–49151",name:"Registered",color:"#f59e0b",ex:"MySQL:3306, RDP:3389"},
                {range:"49152–65535",name:"Ephemeral",color:"#10b981",ex:"OS-assigned to clients"},
              ].map(r=>(
                <div key={r.range} style={{background:"#0f172a",borderRadius:10,padding:12,textAlign:"center"}}>
                  <div style={{color:r.color,fontWeight:800,fontSize:13,marginBottom:4}}>{r.range}</div>
                  <div style={{color:"#e2e8f0",fontWeight:600,fontSize:12}}>{r.name}</div>
                  <div style={{color:"#475569",fontSize:11,marginTop:4}}>{r.ex}</div>
                </div>
              ))}
            </div>
            <ST>WELL-KNOWN PORTS</ST>
            <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
              {[[20,"FTP Data"],[21,"FTP Ctrl"],[22,"SSH"],[23,"Telnet"],[25,"SMTP"],[53,"DNS"],[67,"DHCP-S"],[68,"DHCP-C"],[80,"HTTP"],[110,"POP3"],[143,"IMAP"],[161,"SNMP"],[443,"HTTPS"],[3389,"RDP"]].map(([p,n])=>(
                <div key={p} style={{background:"#0f172a",border:"1px solid #334155",borderRadius:7,padding:"5px 10px",display:"flex",gap:7}}>
                  <span style={{color:"#0ea5e9",fontWeight:700,fontSize:12}}>{p}</span>
                  <span style={{color:"#64748b",fontSize:12}}>{n}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
      {view==="est" && (
        <div>
          <TL_Connection />
        </div>
      )}
      {view==="rel" && (
        <Card>
          <div style={{color:"#f59e0b",fontWeight:700,marginBottom:10}}>Connection Release — Symmetric vs Asymmetric</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:12}}>
            <div style={{background:"#0f172a",borderRadius:8,padding:12}}>
              <div style={{color:"#f59e0b",fontWeight:700,marginBottom:6}}>Asymmetric Release</div>
              <p style={{color:"#64748b",fontSize:12,lineHeight:1.7}}>Either side disconnects by sending DISCONNECT primitive. Immediate close — other side may lose data that was in transit. Simple but risky.</p>
            </div>
            <div style={{background:"#0f172a",borderRadius:8,padding:12}}>
              <div style={{color:"#10b981",fontWeight:700,marginBottom:6}}>Symmetric Release (TCP)</div>
              <p style={{color:"#64748b",fontSize:12,lineHeight:1.7}}>Each direction closed independently. 4-way FIN handshake. Each side sends FIN (I'm done sending), gets ACK. Half-close allows one side to still receive.</p>
            </div>
          </div>
          <div style={{color:"#e2e8f0",fontWeight:700,marginBottom:10}}>TCP 4-Way Termination</div>
          {[{f:"CLIENT",t:"SERVER",m:"FIN",c:"#f59e0b",d:"I'm done sending. Half-close initiated."},
            {f:"SERVER",t:"CLIENT",m:"ACK",c:"#0ea5e9",d:"Acknowledged. Server may still send data."},
            {f:"SERVER",t:"CLIENT",m:"FIN",c:"#f59e0b",d:"Server also done sending."},
            {f:"CLIENT",t:"SERVER",m:"ACK",c:"#10b981",d:"Client ACKs. Waits 2×MSL (TIME_WAIT) before final close."},
          ].map((s,i)=>(
            <div key={i} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
              <div style={{background:s.c,color:"#fff",borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0,marginTop:2}}>{i+1}</div>
              <div style={{background:"#0f172a",borderRadius:8,padding:"7px 10px",flex:1}}>
                <div style={{color:s.c,fontWeight:700,fontSize:11}}>{s.f} → {s.t}: <code>{s.m}</code></div>
                <div style={{color:"#64748b",fontSize:11,marginTop:2}}>{s.d}</div>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

function TL_Connection() {
  const [step, setStep] = useState(0);
  const [relStep, setRelStep] = useState(0);
  const estSteps=[
    {from:"CLIENT",to:"SERVER",msg:"SYN (seq=x)",color:"#6366f1",desc:"Client picks random ISN x. SYN flag set. Client enters SYN_SENT state."},
    {from:"SERVER",to:"CLIENT",msg:"SYN-ACK (seq=y, ack=x+1)",color:"#0ea5e9",desc:"Server picks ISN y, acknowledges client (ack=x+1). Both SYN+ACK flags set."},
    {from:"CLIENT",to:"SERVER",msg:"ACK (ack=y+1)",color:"#10b981",desc:"Client ACKs server's SYN. Connection ESTABLISHED. Both sides can now send data."},
  ];
  const relSteps=[
    {from:"CLIENT",to:"SERVER",msg:"FIN",color:"#f59e0b",desc:"Client done sending. FIN_WAIT_1 state."},
    {from:"SERVER",to:"CLIENT",msg:"ACK",color:"#0ea5e9",desc:"Server ACKs. Client enters FIN_WAIT_2. Server in CLOSE_WAIT."},
    {from:"SERVER",to:"CLIENT",msg:"FIN",color:"#f59e0b",desc:"Server done sending. LAST_ACK state."},
    {from:"CLIENT",to:"SERVER",msg:"ACK",color:"#10b981",desc:"Client ACKs. Waits 2×MSL (TIME_WAIT) then CLOSED."},
  ];
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
      <Card>
        <div style={{color:"#0ea5e9",fontWeight:700,fontSize:14,marginBottom:4}}>3-Way Handshake (Establishment)</div>
        <div style={{color:"#64748b",fontSize:11,marginBottom:12}}>Tanenbaum §6.4.4</div>
        {estSteps.map((s,i)=>(
          <div key={i} style={{display:"flex",gap:8,marginBottom:9,opacity:i>step?0.2:1,transition:"opacity 0.3s"}}>
            <div style={{background:s.color,color:"#fff",borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0,marginTop:2}}>{i+1}</div>
            <div style={{background:"#0f172a",borderRadius:7,padding:"7px 10px",flex:1}}>
              <div style={{color:s.color,fontWeight:700,fontSize:11}}>{s.from}→{s.to}: <code>{s.msg}</code></div>
              <div style={{color:"#64748b",fontSize:11,marginTop:2}}>{s.desc}</div>
            </div>
          </div>
        ))}
        <div style={{display:"flex",gap:7,marginTop:6}}>
          <button onClick={()=>setStep(Math.min(2,step+1))} style={{background:"#0ea5e9",color:"#fff",border:"none",borderRadius:7,padding:"4px 12px",cursor:"pointer",fontSize:11}}>Next ▶</button>
          <button onClick={()=>setStep(0)} style={{background:"#1e293b",color:"#64748b",border:"1px solid #334155",borderRadius:7,padding:"4px 12px",cursor:"pointer",fontSize:11}}>Reset</button>
        </div>
      </Card>
      <Card>
        <div style={{color:"#f59e0b",fontWeight:700,fontSize:14,marginBottom:4}}>4-Way Handshake (Release)</div>
        <div style={{color:"#64748b",fontSize:11,marginBottom:12}}>Asymmetric close — each direction independent</div>
        {relSteps.map((s,i)=>(
          <div key={i} style={{display:"flex",gap:8,marginBottom:9,opacity:i>relStep?0.2:1,transition:"opacity 0.3s"}}>
            <div style={{background:s.color,color:"#fff",borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0,marginTop:2}}>{i+1}</div>
            <div style={{background:"#0f172a",borderRadius:7,padding:"7px 10px",flex:1}}>
              <div style={{color:s.color,fontWeight:700,fontSize:11}}>{s.from}→{s.to}: <code>{s.msg}</code></div>
              <div style={{color:"#64748b",fontSize:11,marginTop:2}}>{s.desc}</div>
            </div>
          </div>
        ))}
        <div style={{display:"flex",gap:7,marginTop:6}}>
          <button onClick={()=>setRelStep(Math.min(3,relStep+1))} style={{background:"#f59e0b",color:"#fff",border:"none",borderRadius:7,padding:"4px 12px",cursor:"pointer",fontSize:11}}>Next ▶</button>
          <button onClick={()=>setRelStep(0)} style={{background:"#1e293b",color:"#64748b",border:"1px solid #334155",borderRadius:7,padding:"4px 12px",cursor:"pointer",fontSize:11}}>Reset</button>
        </div>
      </Card>
    </div>
  );
}

function TL_Mux() {
  return (
    <div>
      <ST>MULTIPLEXING & DEMULTIPLEXING (Tanenbaum §6.2.5)</ST>
      <p style={{color:"#94a3b8",marginBottom:14,fontSize:13,lineHeight:1.7}}>
        <strong style={{color:"#e2e8f0"}}>Multiplexing</strong>: multiple app sockets share one IP link — transport combines them. <strong style={{color:"#e2e8f0"}}>Demultiplexing</strong>: received segments dispatched to correct socket using port numbers.
      </p>
      <Card style={{marginBottom:14}}>
        <svg width="100%" viewBox="0 0 500 180">
          {["Browser:54321","Game:54322","Email:54323"].map((app,i)=>(
            <g key={i}>
              <rect x={10} y={15+i*55} width={130} height={36} rx={7} fill="#1e293b" stroke="#6366f1" strokeWidth={1.5}/>
              <text x={75} y={37+i*55} textAnchor="middle" fill="#94a3b8" fontSize={11}>{app}</text>
              <line x1={140} y1={33+i*55} x2={195} y2={90} stroke="#6366f166" strokeWidth={1.5}/>
            </g>
          ))}
          <rect x={195} y={68} width={110} height={44} rx={7} fill="#0ea5e922" stroke="#0ea5e9" strokeWidth={2}/>
          <text x={250} y={88} textAnchor="middle" fill="#0ea5e9" fontSize={11} fontWeight="700">Transport</text>
          <text x={250} y={102} textAnchor="middle" fill="#64748b" fontSize={10}>MUX / DEMUX</text>
          <line x1={305} y1={90} x2={360} y2={90} stroke="#10b981" strokeWidth={2}/>
          <rect x={360} y={68} width={125} height={44} rx={7} fill="#10b98122" stroke="#10b981" strokeWidth={2}/>
          <text x={422} y={88} textAnchor="middle" fill="#10b981" fontSize={11} fontWeight="700">Network / IP</text>
          <text x={422} y={102} textAnchor="middle" fill="#64748b" fontSize={10}>single IP address</text>
          <text x={250} y={155} textAnchor="middle" fill="#475569" fontSize={10}>Port numbers identify which socket gets each segment</text>
        </svg>
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Card>
          <div style={{color:"#f59e0b",fontWeight:700,marginBottom:8}}>Connectionless (UDP) Demux</div>
          <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7}}>Socket identified by <strong style={{color:"#e2e8f0"}}>(dst IP, dst port)</strong>. All datagrams to same (IP, port) go to same socket regardless of source. DNS port 53 receives from many clients.</p>
        </Card>
        <Card>
          <div style={{color:"#0ea5e9",fontWeight:700,marginBottom:8}}>Connection-Oriented (TCP) Demux</div>
          <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7}}>Socket identified by <strong style={{color:"#e2e8f0"}}>4-tuple: (src IP, src port, dst IP, dst port)</strong>. Same dst port → different sockets per connection. One server handles thousands simultaneously.</p>
        </Card>
      </div>
    </div>
  );
}

function TL_FlowControl() {
  const [winSize, setWinSize] = useState(5);
  return (
    <div>
      <ST>FLOW CONTROL — SLIDING WINDOW (Tanenbaum §6.2.4)</ST>
      <p style={{color:"#94a3b8",marginBottom:14,fontSize:13,lineHeight:1.7}}>
        Flow control prevents a fast sender from overwhelming a slow receiver's buffer. TCP uses a <strong style={{color:"#e2e8f0"}}>receive window (RWND)</strong> advertised in every ACK. The sender must not have more unACK'd bytes in flight than RWND.
      </p>
      <Card style={{marginBottom:14}}>
        <div style={{color:"#e2e8f0",fontWeight:700,marginBottom:12}}>Interactive Sliding Window</div>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
          <span style={{color:"#94a3b8",fontSize:13}}>RWND:</span>
          <input type="range" min={1} max={10} value={winSize} onChange={e=>setWinSize(Number(e.target.value))} style={{accentColor:"#0ea5e9",width:140}}/>
          <span style={{color:"#0ea5e9",fontWeight:700,fontSize:18}}>{winSize}</span>
        </div>
        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>
          {Array.from({length:10},(_,i)=>(
            <div key={i} style={{width:42,height:42,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,background:i<3?"#10b98122":i<winSize?"#0ea5e922":"#0f172a",border:`2px solid ${i<3?"#10b981":i<winSize?"#0ea5e9":"#334155"}`,color:i<3?"#10b981":i<winSize?"#0ea5e9":"#475569"}}>
              {i<3?"✓":i<winSize?`S${i}`:"—"}
            </div>
          ))}
        </div>
        <div style={{color:"#64748b",fontSize:12}}>
          <span style={{color:"#10b981"}}>✓</span> ACK'd (3) &nbsp;|&nbsp; <span style={{color:"#0ea5e9"}}>■</span> In window — can send &nbsp;|&nbsp; <span style={{color:"#475569"}}>—</span> Blocked
        </div>
        <div style={{marginTop:10,background:"#0f172a",borderRadius:8,padding:10,fontFamily:"monospace",fontSize:12,color:"#64748b"}}>
          Bytes in flight ≤ RWND({winSize}) &nbsp;|&nbsp; Can send {Math.max(0,winSize-3)} more before waiting for ACK
        </div>
      </Card>
      <Card>
        <ST>WINDOW SCALE OPTION (RFC 1323)</ST>
        <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:8}}>Standard RWND = 16 bits → max 65535 bytes. Too small for high-speed links. Window Scale multiplies RWND by 2^scale (up to 2^30 ≈ 1 GB).</p>
        <div style={{background:"#0f172a",borderRadius:8,padding:10,fontFamily:"monospace",fontSize:12,color:"#64748b"}}>
          Normal max: 65,535 B &nbsp;|&nbsp; <span style={{color:"#10b981"}}>With scale×2¹⁴: ~1 GB</span>
        </div>
      </Card>
    </div>
  );
}

function TL_Congestion() {
  const [phase, setPhase] = useState(0);
  const cwndData=[1,2,4,8,16,17,18,19,20,21,22,8,9,10,11,12];
  const ssthresh=[64,64,64,64,64,64,64,64,64,64,64,11,11,11,11,11];
  const w=340,h=160,maxY=25,rounds=cwndData.length;
  const phases=[
    {name:"Slow Start",color:"#10b981",range:[0,4],desc:"cwnd starts at 1 MSS. Doubles every RTT (exponential growth). Continues until cwnd ≥ ssthresh or loss detected. Fast ramp-up phase."},
    {name:"Congestion Avoidance",color:"#0ea5e9",range:[4,10],desc:"After ssthresh: cwnd += 1 MSS per RTT (additive/linear). Gentle probing. This is the AI part of AIMD."},
    {name:"Loss Detected",color:"#ef4444",range:[10,11],desc:"Packet loss: ssthresh = cwnd/2. TCP Tahoe: cwnd→1. TCP Reno: Fast Recovery (cwnd→ssthresh). This is the MD part of AIMD."},
    {name:"Recovery",color:"#f59e0b",range:[11,15],desc:"After loss: restart from new ssthresh. Tahoe: slow start again. Reno: Fast Recovery skips slow start on 3 dup ACKs."},
  ];
  return (
    <div>
      <ST>CONGESTION CONTROL IN TCP — AIMD (Tanenbaum §6.4.6)</ST>
      <p style={{color:"#94a3b8",marginBottom:14,fontSize:13,lineHeight:1.7}}>
        TCP uses <strong style={{color:"#e2e8f0"}}>AIMD — Additive Increase Multiplicative Decrease</strong>. Sender maintains a <strong style={{color:"#e2e8f0"}}>congestion window (CWND)</strong>. Effective window = min(CWND, RWND).
      </p>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
        {phases.map((p,i)=>(
          <button key={i} onClick={()=>setPhase(i)} style={{background:phase===i?p.color:"#1e293b",color:phase===i?"#fff":"#64748b",border:`1.5px solid ${phase===i?p.color:"#334155"}`,borderRadius:7,padding:"5px 11px",cursor:"pointer",fontSize:11,fontWeight:600}}>{p.name}</button>
        ))}
      </div>
      <Card style={{marginBottom:14}}>
        <div style={{color:phases[phase].color,fontWeight:700,marginBottom:6}}>{phases[phase].name}</div>
        <div style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:14}}>{phases[phase].desc}</div>
        <svg width="100%" viewBox={`0 0 ${w} ${h+30}`} style={{maxWidth:w}}>
          {[0,5,10,15,20,25].map(v=>{const y=h-(v/maxY)*h;return <g key={v}><line x1={30} y1={y} x2={w} y2={y} stroke="#1e293b" strokeWidth={1}/><text x={24} y={y+4} textAnchor="end" fill="#475569" fontSize={9}>{v}</text></g>;})}
          {ssthresh.map((v,i)=>i<rounds-1?<line key={i} x1={30+(i/(rounds-1))*(w-30)} y1={h-(v/maxY)*h} x2={30+((i+1)/(rounds-1))*(w-30)} y2={h-(ssthresh[i+1]/maxY)*h} stroke="#ef444466" strokeWidth={1.5} strokeDasharray="5,3"/>:null)}
          {cwndData.map((v,i)=>{if(i>=rounds-1)return null;const isA=i>=phases[phase].range[0]&&i<phases[phase].range[1];return <line key={i} x1={30+(i/(rounds-1))*(w-30)} y1={h-(v/maxY)*h} x2={30+((i+1)/(rounds-1))*(w-30)} y2={h-(cwndData[i+1]/maxY)*h} stroke={isA?phases[phase].color:"#334155"} strokeWidth={isA?2.5:1.5}/>;} )}
          {cwndData.map((v,i)=>{const isA=i>=phases[phase].range[0]&&i<phases[phase].range[1];return <circle key={i} cx={30+(i/(rounds-1))*(w-30)} cy={h-(v/maxY)*h} r={isA?4:2.5} fill={isA?phases[phase].color:"#475569"}/>;} )}
          <line x1={30} y1={0} x2={30} y2={h} stroke="#475569" strokeWidth={1.5}/>
          <line x1={30} y1={h} x2={w} y2={h} stroke="#475569" strokeWidth={1.5}/>
          <text x={8} y={h/2} fill="#64748b" fontSize={9} transform={`rotate(-90,8,${h/2})`}>cwnd(MSS)</text>
          <text x={w/2} y={h+20} fill="#64748b" fontSize={9} textAnchor="middle">RTT rounds</text>
          <line x1={150} y1={h+24} x2={168} y2={h+24} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4,2"/>
          <text x={172} y={h+28} fill="#64748b" fontSize={9}>ssthresh</text>
        </svg>
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Card>
          <div style={{color:"#e2e8f0",fontWeight:700,marginBottom:8}}>Desirable Bandwidth Allocation</div>
          <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:8}}>Ideal: each flow gets fair share of bottleneck bandwidth. AIMD converges to fair allocation — flows oscillate around equal share (max-min fairness). Efficient when sum of rates = link capacity.</p>
          <div style={{color:"#e2e8f0",fontWeight:600,fontSize:12,marginBottom:4}}>Properties of ideal allocation</div>
          {["Efficiency: fully utilize network capacity","Fairness: each flow gets equal share (max-min)","Fast reaction to changes in topology or demand","Stability: converge without oscillation"].map((p,i)=><div key={i} style={{color:"#64748b",fontSize:12,marginBottom:3}}>• {p}</div>)}
        </Card>
        <Card>
          <div style={{color:"#e2e8f0",fontWeight:700,marginBottom:8}}>Wireless Issues in Transport Layer</div>
          <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:8}}>TCP was designed for wired networks where loss = congestion. In wireless, loss is often due to <strong style={{color:"#e2e8f0"}}>bit errors and fading</strong>, not congestion. TCP incorrectly reduces cwnd.</p>
          {[{p:"Spurious retransmit",d:"TCP reduces cwnd on wireless loss (not congestion) → throughput drop"},
            {p:"Indirect TCP",d:"Split connection at base station: wired TCP + wireless link protocol"},
            {p:"Snoop protocol",d:"Base station caches TCP segments, handles local retransmission"},
            {p:"TCP-Aware ARQ",d:"Link layer retransmits transparently so TCP doesn't see losses"},
          ].map(({p,d})=>(
            <div key={p} style={{marginBottom:7}}>
              <div style={{color:"#f59e0b",fontWeight:700,fontSize:12}}>{p}</div>
              <div style={{color:"#64748b",fontSize:12}}>{d}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function TL_TCPFull() {
  const [view, setView] = useState("services");
  return (
    <div>
      <ST>TCP — TRANSMISSION CONTROL PROTOCOL (Tanenbaum §6.5)</ST>
      <Tabs color="#0ea5e9"
        tabs={[{id:"services",label:"Services & Features"},{id:"segment",label:"TCP Segment"},{id:"transfer",label:"Data Transfer"},{id:"flowErr",label:"Flow/Error/Congestion"}]}
        active={view} setActive={setView}/>
      {view==="services" && (
        <div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
            <Card>
              <div style={{color:"#0ea5e9",fontWeight:700,marginBottom:10}}>TCP Services</div>
              {[{s:"Full-duplex communication",d:"Data flows simultaneously in both directions over one connection."},
                {s:"Connection-oriented",d:"Explicit connection setup (3-way handshake) and teardown (4-way FIN)."},
                {s:"Reliable byte stream",d:"Every byte guaranteed to arrive, once, in order. No message boundaries."},
                {s:"Flow control",d:"Receiver advertises RWND; sender must not exceed it."},
                {s:"Congestion control",d:"Slow Start, CA, Fast Retransmit, Fast Recovery."},
                {s:"Piggybacking",d:"ACKs can be piggyback on data segments going the other way."},
              ].map(({s,d})=>(
                <div key={s} style={{marginBottom:8}}>
                  <div style={{color:"#0ea5e9",fontWeight:700,fontSize:12}}>{s}</div>
                  <div style={{color:"#64748b",fontSize:12}}>{d}</div>
                </div>
              ))}
            </Card>
            <Card>
              <div style={{color:"#0ea5e9",fontWeight:700,marginBottom:10}}>TCP Buffers</div>
              <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:10}}>TCP maintains send and receive buffers at each endpoint to decouple application speed from network speed.</p>
              <svg viewBox="0 0 280 180" width="100%">
                {[{label:"Send Buffer",y:20,color:"#6366f1",desc:"App writes here; TCP sends from here"},
                  {label:"Receive Buffer",y:100,color:"#10b981",desc:"TCP stores received data; app reads from here"}].map((b,i)=>(
                  <g key={i}>
                    <rect x={20} y={b.y} width={240} height={40} rx={6} fill={b.color+"22"} stroke={b.color} strokeWidth={1.5}/>
                    <text x={30} y={b.y+16} fill={b.color} fontSize={11} fontWeight="700">{b.label}</text>
                    <text x={30} y={b.y+30} fill="#64748b" fontSize={9}>{b.desc}</text>
                    <rect x={20} y={b.y} width={80} height={40} rx={6} fill={b.color+"55"}/>
                    <text x={60} y={b.y+24} textAnchor="middle" fill="#fff" fontSize={9}>used</text>
                    <text x={180} y={b.y+24} textAnchor="middle" fill={b.color} fontSize={9}>free (RWND)</text>
                  </g>
                ))}
                <text x={140} y={168} textAnchor="middle" fill="#475569" fontSize={9}>Buffers allow asynchronous read/write</text>
              </svg>
            </Card>
          </div>
          <Card>
            <div style={{color:"#0ea5e9",fontWeight:700,marginBottom:10}}>TCP Key Features</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              {[["Sequence Numbers","32-bit byte counter. Identifies position of data in stream.","#6366f1"],
                ["Acknowledgments","Cumulative ACK: ack# = next expected byte.","#0ea5e9"],
                ["Retransmission","Retransmit on timeout (RTO) or 3 duplicate ACKs.","#10b981"],
                ["MSS","Max Segment Size negotiated in SYN. Typically 1460 bytes (1500 MTU - 40 headers).","#f59e0b"],
                ["Nagle's Algorithm","Delay small segments: buffer until ACK or MSS accumulated. Reduces tiny packets.","#ef4444"],
                ["Silly Window Syndrome","Prevent tiny window advertisements. Clark's algorithm: don't advertise tiny RWND.","#8b5cf6"],
              ].map(([t,d,c])=>(
                <div key={t} style={{background:"#0f172a",borderRadius:8,padding:10}}>
                  <div style={{color:c,fontWeight:700,fontSize:12,marginBottom:4}}>{t}</div>
                  <div style={{color:"#64748b",fontSize:11,lineHeight:1.6}}>{d}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
      {view==="segment" && (
        <div>
          <Card style={{marginBottom:14}}>
            <ST>TCP SEGMENT HEADER — 20 BYTES MINIMUM</ST>
            <div style={{display:"grid",gap:6}}>
              {[{f:"Source Port",b:"16",c:"#6366f1",d:"Sender's port number (0–65535)."},
                {f:"Destination Port",b:"16",c:"#6366f1",d:"Receiver's port. With IPs = 4-tuple socket."},
                {f:"Sequence Number",b:"32",c:"#0ea5e9",d:"Byte offset of first byte in this segment."},
                {f:"Acknowledgment #",b:"32",c:"#0ea5e9",d:"Next expected byte from other side."},
                {f:"Header Length",b:"4",c:"#10b981",d:"Header size in 32-bit words. Min 5 = 20 bytes."},
                {f:"Flags (URG/ACK/PSH/RST/SYN/FIN)",b:"6",c:"#f59e0b",d:"Control bits."},
                {f:"Window Size (RWND)",b:"16",c:"#ef4444",d:"Receiver buffer space. Flow control."},
                {f:"Checksum",b:"16",c:"#8b5cf6",d:"Error detection over header + data."},
                {f:"Urgent Pointer",b:"16",c:"#ec4899",d:"Last urgent byte offset. Only when URG set."},
                {f:"Options",b:"0–320",c:"#14b8a6",d:"MSS, Window Scale, SACK, Timestamps."},
              ].map(({f,b,c,d})=>(
                <div key={f} style={{display:"flex",gap:10,alignItems:"center",background:"#0f172a",border:`1px solid #1e293b`,borderRadius:7,padding:"7px 10px"}}>
                  <span style={{background:c+"33",color:c,borderRadius:4,padding:"2px 6px",fontSize:10,fontWeight:700,whiteSpace:"nowrap"}}>{b}b</span>
                  <span style={{color:"#e2e8f0",fontWeight:600,fontSize:12,minWidth:200,flexShrink:0}}>{f}</span>
                  <span style={{color:"#64748b",fontSize:12}}>{d}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <ST>TCP FLAGS</ST>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
              {[["URG","#ec4899","Urgent data pointer valid"],["ACK","#10b981","Ack field valid"],["PSH","#f59e0b","Push to app immediately"],["RST","#ef4444","Reset / abort connection"],["SYN","#6366f1","Sync sequence numbers"],["FIN","#0ea5e9","No more data to send"]].map(([n,c,d])=>(
                <div key={n} style={{background:"#0f172a",border:`1.5px solid ${c}44`,borderRadius:7,padding:10}}>
                  <div style={{color:c,fontWeight:800,fontSize:15,marginBottom:3}}>{n}</div>
                  <div style={{color:"#64748b",fontSize:11}}>{d}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
      {view==="transfer" && (
        <div>
          <TL_Connection/>
          <Card style={{marginTop:14}}>
            <ST>TCP STATE MACHINE</ST>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {[{s:"CLOSED",d:"No connection",c:"#ef4444"},{s:"LISTEN",d:"Server awaiting SYN",c:"#f59e0b"},
                {s:"SYN_SENT",d:"Sent SYN, awaiting SYN-ACK",c:"#6366f1"},{s:"SYN_RCVD",d:"Got SYN, sent SYN-ACK",c:"#8b5cf6"},
                {s:"ESTABLISHED",d:"Active connection",c:"#10b981"},{s:"FIN_WAIT_1",d:"Sent FIN",c:"#0ea5e9"},
                {s:"FIN_WAIT_2",d:"Got ACK of FIN",c:"#0ea5e9"},{s:"TIME_WAIT",d:"Wait 2×MSL before close",c:"#94a3b8"},
                {s:"CLOSE_WAIT",d:"Got peer FIN",c:"#f59e0b"},{s:"LAST_ACK",d:"Sent FIN, awaiting ACK",c:"#ef4444"}
              ].map(s=>(
                <div key={s.s} style={{background:"#0f172a",border:`1.5px solid ${s.c}44`,borderRadius:7,padding:"7px 10px",minWidth:140}}>
                  <div style={{color:s.c,fontWeight:700,fontSize:11}}>{s.s}</div>
                  <div style={{color:"#64748b",fontSize:10,marginTop:2}}>{s.d}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
      {view==="flowErr" && (
        <div>
          <TL_FlowControl/>
          <Card style={{marginTop:14}}>
            <div style={{color:"#0ea5e9",fontWeight:700,marginBottom:8}}>Error Control in TCP</div>
            {[{t:"Checksum",d:"16-bit checksum over TCP header + data + pseudo-header (IP addresses). Receiver discards corrupted segments."},
              {t:"Sequence Numbers",d:"Each byte numbered. Receiver detects duplicates, reorders out-of-order segments, detects gaps."},
              {t:"ACKs",d:"Cumulative ACK confirms all bytes up to ack#−1 received. Missing ACK triggers retransmission."},
              {t:"Retransmission Timeout (RTO)",d:"RTO = RTT estimate + 4×RTT variance. Exponential backoff on repeated timeouts."},
              {t:"Fast Retransmit",d:"3 duplicate ACKs = likely loss. Retransmit without waiting for RTO. Faster than timeout."},
              {t:"SACK (Selective ACK)",d:"RFC 2018: receiver specifies which blocks received. Sender retransmits only missing segments."},
            ].map(({t,d})=>(
              <div key={t} style={{marginBottom:9}}>
                <div style={{color:"#0ea5e9",fontWeight:700,fontSize:12}}>{t}</div>
                <div style={{color:"#64748b",fontSize:12}}>{d}</div>
              </div>
            ))}
          </Card>
          <Card style={{marginTop:14}}>
            <div style={{color:"#10b981",fontWeight:700,marginBottom:8}}>Applications of TCP</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:8}}>
              {[["HTTP / HTTPS","Web browsing, REST APIs"],["SMTP / POP3 / IMAP","Email sending and retrieval"],["FTP / SFTP","File transfer"],["SSH / Telnet","Remote terminal access"],["Database","MySQL (3306), PostgreSQL (5432)"],["IRC / XMPP","Chat protocols"]].map(([proto,desc])=>(
                <div key={proto} style={{background:"#0f172a",borderRadius:8,padding:10}}>
                  <div style={{color:"#10b981",fontWeight:700,fontSize:12,marginBottom:3}}>{proto}</div>
                  <div style={{color:"#64748b",fontSize:11}}>{desc}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function TL_UDP_Full() {
  return (
    <div>
      <ST>UDP, SCTP, RTP, RTCP, MPLS (Tanenbaum §6.4–6.5)</ST>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <Card>
          <div style={{color:"#f59e0b",fontWeight:700,marginBottom:8}}>UDP — User Datagram Protocol</div>
          <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:8}}>Connectionless, unreliable, 8-byte header. Fast — no handshake, no ACKs.</p>
          <ST>UDP HEADER (8 bytes)</ST>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>
            {[["Src Port","16b","#f59e0b"],["Dst Port","16b","#f59e0b"],["Length","16b","#0ea5e9"],["Checksum","16b","#10b981"]].map(([n,b,c])=>(
              <div key={n} style={{flex:1,minWidth:80,background:c+"22",border:`1.5px solid ${c}`,borderRadius:7,padding:"8px 6px",textAlign:"center"}}>
                <div style={{color:c,fontWeight:700,fontSize:11}}>{n}</div>
                <div style={{color:"#475569",fontSize:10}}>{b}</div>
              </div>
            ))}
          </div>
          <ST>UDP APPLICATIONS</ST>
          {[["DNS","Short query/reply — latency critical"],["VoIP","Real-time; late = useless"],["Video streaming","Loss tolerable; late is not"],["DHCP","Broadcast before IP assigned"],["SNMP","Small monitoring messages"],["TFTP","Simple file transfer on LAN"]].map(([a,d])=>(
            <div key={a} style={{display:"flex",gap:8,marginBottom:4}}>
              <span style={{color:"#f59e0b",fontWeight:700,fontSize:11,minWidth:80,flexShrink:0}}>{a}:</span>
              <span style={{color:"#64748b",fontSize:11}}>{d}</span>
            </div>
          ))}
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Card>
            <div style={{color:"#8b5cf6",fontWeight:700,marginBottom:8}}>SCTP — Stream Control Transmission Protocol</div>
            <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:8}}>Combines TCP reliability with UDP message orientation. Supports <strong style={{color:"#e2e8f0"}}>multi-streaming</strong> (no HOL blocking) and <strong style={{color:"#e2e8f0"}}>multi-homing</strong> (multiple IPs per endpoint).</p>
            {[["HOL blocking","None — independent streams"],["Multihoming","Multiple IPs; failover automatic"],["Messages","Preserves message boundaries"],["4-way handshake","INIT / INIT-ACK / COOKIE-ECHO / COOKIE-ACK"],["Port","Separate from TCP/UDP ports"],["Use","Telecom signaling (SS7/IP), WebRTC"]].map(([k,v])=>(
              <div key={k} style={{display:"flex",gap:8,marginBottom:4}}>
                <span style={{color:"#8b5cf6",fontSize:11,fontWeight:600,minWidth:90,flexShrink:0}}>{k}:</span>
                <span style={{color:"#64748b",fontSize:11}}>{v}</span>
              </div>
            ))}
          </Card>
          <Card>
            <div style={{color:"#ec4899",fontWeight:700,marginBottom:8}}>RTP & RTCP</div>
            {[{n:"RTP",c:"#ec4899",pts:["Real-time Transport Protocol","Runs over UDP","Adds: seq#, timestamp, SSRC","Payload type field (codec ID)","No delivery guarantee — just ordering info"]},
              {n:"RTCP",c:"#14b8a6",pts:["RTP Control Protocol","~5% of session bandwidth","Reports: loss %, jitter, RTT","Enables adaptive codec/bitrate","Sender / Receiver Reports (SR/RR)"]},
            ].map(p=>(
              <div key={p.n} style={{marginBottom:10}}>
                <div style={{color:p.c,fontWeight:700,fontSize:12,marginBottom:4}}>{p.n}</div>
                {p.pts.map((pt,i)=><div key={i} style={{color:"#64748b",fontSize:11,marginBottom:2}}>• {pt}</div>)}
              </div>
            ))}
          </Card>
          <Card>
            <div style={{color:"#10b981",fontWeight:700,marginBottom:8}}>MPLS — Multiprotocol Label Switching</div>
            <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:6}}>Not strictly transport layer — sits between L2 and L3. Adds a 32-bit label to packets. Routers forward by label lookup (fast) rather than IP lookup (slow). Enables traffic engineering and VPNs.</p>
            {[["Label","20-bit forwarding identifier"],["EXP","3-bit QoS class"],["S (bottom-of-stack)","1 = last label in stack"],["TTL","8-bit time-to-live"],["Use","ISP backbones, VPNs, L3 VPN"],].map(([k,v])=>(
              <div key={k} style={{display:"flex",gap:8,marginBottom:3}}>
                <span style={{color:"#10b981",fontSize:11,fontWeight:600,minWidth:80,flexShrink:0}}>{k}:</span>
                <span style={{color:"#64748b",fontSize:11}}>{v}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

function TL_QUIC() {
  return (
    <div>
      <ST>THE FUTURE OF TCP: QUIC & BBR (Tanenbaum §6.5)</ST>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <Card>
          <div style={{color:"#0ea5e9",fontWeight:700,marginBottom:8}}>Why TCP Needed a Successor</div>
          {["HOL blocking: one lost packet stalls all HTTP/2 streams on same TCP connection",
            "2-3 RTT connection setup (TCP handshake + TLS handshake) before data",
            "Hard to update TCP — middleboxes (NAT, firewalls) block new options",
            "IP address change kills TCP connection (mobile handoff problem)",
            "Congestion control evolution limited by OS kernel update cycle"
          ].map((p,i)=><div key={i} style={{color:"#94a3b8",fontSize:13,marginBottom:5,paddingLeft:8}}>• {p}</div>)}
        </Card>
        <Card>
          <div style={{color:"#10b981",fontWeight:700,marginBottom:8}}>QUIC Features (RFC 9000)</div>
          {["Runs over UDP — userspace, deployable without kernel changes",
            "0-RTT or 1-RTT setup with TLS 1.3 built-in (combined handshake)",
            "Multiplexed streams — each stream's loss is independent",
            "Connection ID survives IP changes (mobile WiFi ↔ 4G seamless)",
            "Stream-level flow control AND connection-level flow control",
            "Pluggable congestion control (CUBIC, BBR, etc.)",
            "Powers HTTP/3 (RFC 9114) — ~25% of global web traffic (2024)"
          ].map((p,i)=><div key={i} style={{color:"#94a3b8",fontSize:13,marginBottom:5,paddingLeft:8}}>• {p}</div>)}
        </Card>
      </div>
      <Card style={{marginBottom:14}}>
        <ST>BBR — BOTTLENECK BANDWIDTH AND RTT CONGESTION CONTROL</ST>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <div>
            <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:10}}>
              BBR (Google, 2016) models the network rather than reacting to loss. It measures <strong style={{color:"#e2e8f0"}}>BtlBw</strong> (bottleneck bandwidth) and <strong style={{color:"#e2e8f0"}}>RTprop</strong> (min RTT), then sends at BtlBw rate without filling buffers.
            </p>
            {[["CUBIC/Reno","Fill buffers until loss. Causes bufferbloat. High RTT."],["BBR","Probe BW and RTT. Operate at optimal point. Low latency."]].map(([n,d])=>(
              <div key={n} style={{background:"#0f172a",borderRadius:7,padding:10,marginBottom:8}}>
                <div style={{color:n.includes("BBR")?"#10b981":"#ef4444",fontWeight:700,fontSize:12,marginBottom:3}}>{n}</div>
                <div style={{color:"#64748b",fontSize:12}}>{d}</div>
              </div>
            ))}
          </div>
          <div>
            <div style={{color:"#e2e8f0",fontWeight:700,marginBottom:8}}>BBR Phases</div>
            {[{p:"STARTUP",c:"#10b981",d:"Double rate until BW stops growing (like slow start)"},
              {p:"DRAIN",c:"#0ea5e9",d:"Drain queues built during startup"},
              {p:"PROBE_BW",c:"#f59e0b",d:"Cycle through rates to track available BW"},
              {p:"PROBE_RTT",c:"#8b5cf6",d:"Reduce cwnd to measure min RTT accurately"},
            ].map(({p,c,d})=>(
              <div key={p} style={{marginBottom:8}}>
                <div style={{color:c,fontWeight:700,fontSize:12}}>{p}</div>
                <div style={{color:"#64748b",fontSize:12}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function TL_Performance() {
  return (
    <div>
      <ST>PERFORMANCE ISSUES & DELAY-TOLERANT NETWORKING (Tanenbaum §6.6-6.7)</ST>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
        <Card>
          <div style={{color:"#14b8a6",fontWeight:700,marginBottom:8}}>Performance Problems</div>
          {[{p:"Throughput < bandwidth",d:"Due to RTT, window size, retransmissions, protocol overhead."},
            {p:"Bufferbloat",d:"Large router buffers cause high latency — TCP fills them before backing off."},
            {p:"Short connections",d:"TCP slow start wastes bandwidth on short web transfers (<10 packets)."},
            {p:"Heterogeneous links",d:"Bottleneck link limits end-to-end throughput regardless of others."},
            {p:"Wireless loss",d:"TCP interprets wireless errors as congestion → incorrectly reduces rate."},
          ].map(({p,d})=>(
            <div key={p} style={{marginBottom:9}}>
              <div style={{color:"#14b8a6",fontWeight:700,fontSize:12}}>{p}</div>
              <div style={{color:"#64748b",fontSize:12}}>{d}</div>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{color:"#14b8a6",fontWeight:700,marginBottom:8}}>Protocol for Long Fat Networks (LFN)</div>
          <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:8}}>
            A "Long Fat Network" (LFN, "elephant") has high bandwidth × high delay = large bandwidth-delay product (BDP). Standard TCP window (64 KB) can't fill a satellite link.
          </p>
          {[{t:"Window Scaling",d:"RFC 1323: scale factor extends RWND to 2^30 bytes"},
            {t:"SACK",d:"RFC 2018: retransmit only missing segments, not everything after gap"},
            {t:"Timestamps",d:"RFC 1323: measure RTT accurately, protect from old duplicate segments"},
            {t:"Header Compression",d:"RFC 2507: compress repetitive TCP/IP headers (useful on slow links)"},
            {t:"Fast Open (TFO)",d:"RFC 7413: send data in SYN packet — saves 1 RTT on repeat connections"},
          ].map(({t,d})=>(
            <div key={t} style={{marginBottom:7}}>
              <div style={{color:"#14b8a6",fontWeight:700,fontSize:12}}>{t}</div>
              <div style={{color:"#64748b",fontSize:12}}>{d}</div>
            </div>
          ))}
        </Card>
      </div>
      <Card style={{marginBottom:14}}>
        <div style={{color:"#8b5cf6",fontWeight:700,marginBottom:8}}>Bandwidth-Delay Product (BDP)</div>
        <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:10}}>BDP = Bandwidth × RTT = data "in flight" at any instant. TCP window must be ≥ BDP for full link utilization.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          {[{l:"1 Gbps LAN",r:"1ms",b:"125 KB"},{l:"100 Mbps WAN",r:"100ms",b:"1.25 MB"},{l:"10 Gbps satellite",r:"600ms",b:"750 MB"}].map(c=>(
            <div key={c.l} style={{background:"#0f172a",borderRadius:8,padding:12,textAlign:"center"}}>
              <div style={{color:"#8b5cf6",fontWeight:700,fontSize:12}}>{c.l}</div>
              <div style={{color:"#64748b",fontSize:11}}>RTT: {c.r}</div>
              <div style={{color:"#e2e8f0",fontWeight:800,fontSize:16,margin:"5px 0"}}>{c.b}</div>
              <div style={{color:"#475569",fontSize:10}}>needed window</div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <div style={{color:"#8b5cf6",fontWeight:700,marginBottom:8}}>Delay-Tolerant Networking (DTN) — Tanenbaum §6.7</div>
        <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:10}}>TCP assumes continuous end-to-end path. DTN handles intermittent connectivity: deep space, disaster zones, rural sensors, wildlife tracking.</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div>
            <div style={{color:"#8b5cf6",fontWeight:700,fontSize:12,marginBottom:6}}>DTN Principles</div>
            {["Store-carry-forward: nodes carry data until contact","Custody transfer: each node takes full responsibility","Bundle protocol (BP) above transport layer","Works with delays of hours or days (Mars: 20 min one-way)"].map((p,i)=><div key={i} style={{color:"#64748b",fontSize:12,marginBottom:4}}>• {p}</div>)}
          </div>
          <div>
            <div style={{color:"#8b5cf6",fontWeight:700,fontSize:12,marginBottom:6}}>DTN Use Cases</div>
            {["Interplanetary Internet (IPN)","Disaster relief communication","Remote rural areas with no continuous link","Wildlife animal tracking collars","Disconnected military units","Underwater sensor networks"].map((p,i)=><div key={i} style={{color:"#64748b",fontSize:12,marginBottom:4}}>• {p}</div>)}
          </div>
        </div>
      </Card>
    </div>
  );
}

function TransportLayer() {
  const [sub, setSub] = useState("design");
  const subs=[
    {id:"design",   label:"Design Issues"},
    {id:"elements", label:"Port/Conn Setup/Release"},
    {id:"mux",      label:"Multiplexing"},
    {id:"flow",     label:"Flow Control"},
    {id:"congestion",label:"Congestion Control"},
    {id:"tcp",      label:"TCP Full"},
    {id:"udp",      label:"UDP/SCTP/RTP/MPLS"},
    {id:"quic",     label:"QUIC & BBR"},
    {id:"perf",     label:"Performance & DTN"},
  ];
  return (
    <div>
      <p style={{color:"#94a3b8",marginBottom:14,lineHeight:1.7}}>
        <strong style={{color:"#0ea5e9"}}>Tanenbaum Ch. 6 — The Transport Layer.</strong> End-to-end communication between processes. TCP, UDP, QUIC, SCTP, RTP, MPLS.
      </p>
      <Tabs color="#0ea5e9" tabs={subs} active={sub} setActive={setSub}/>
      {sub==="design"    && <TL_DesignIssues />}
      {sub==="elements"  && <TL_Elements />}
      {sub==="mux"       && <TL_Mux />}
      {sub==="flow"      && <TL_FlowControl />}
      {sub==="congestion"&& <TL_Congestion />}
      {sub==="tcp"       && <TL_TCPFull />}
      {sub==="udp"       && <TL_UDP_Full />}
      {sub==="quic"      && <TL_QUIC />}
      {sub==="perf"      && <TL_Performance />}
    </div>
  );
}
// ═══════════════════════════════════════════════════════
//  APPLICATION LAYER  — Tanenbaum Ch. 7
// ═══════════════════════════════════════════════════════

function AL_Intro() {
  return (
    <div>
      <ST>INTRODUCTION TO THE APPLICATION LAYER (Tanenbaum §7.1)</ST>
      <p style={{color:"#94a3b8",marginBottom:14,fontSize:13,lineHeight:1.7}}>
        The application layer is where users interact with the network. It defines protocols that applications use to communicate — HTTP for the web, SMTP for email, DNS for name resolution, etc.
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:14}}>
        {[{t:"Client-Server Paradigm",c:"#6366f1",icon:"🖥️",
          desc:"Dedicated server waits for requests from clients. Server has well-known address (port). Examples: Web, Email, DNS, FTP.",
          pts:["Server: always on, fixed IP/port","Client: initiates contact, dynamic IP","Many clients, one server","Scalable with server farms / CDN"]},
          {t:"Peer-to-Peer Paradigm",c:"#10b981",icon:"🔗",
          desc:"Every node acts as both client and server. No central server needed. Highly scalable and fault-tolerant.",
          pts:["No central server","Peers contribute resources","Self-organizing","Examples: BitTorrent, Gnutella, Skype (old)"]},
          {t:"Hybrid Paradigm",c:"#f59e0b",icon:"⚡",
          desc:"Mix of C/S and P2P. Central server used for discovery; peers communicate directly. Used by modern VoIP, games.",
          pts:["Central server for directory","Direct peer communication","Balance scalability + reliability","Examples: Skype (modern), WhatsApp"]},
        ].map(p=>(
          <Card key={p.t}>
            <div style={{fontSize:24,marginBottom:6}}>{p.icon}</div>
            <div style={{color:p.c,fontWeight:700,marginBottom:6}}>{p.t}</div>
            <p style={{color:"#94a3b8",fontSize:12,lineHeight:1.7,marginBottom:10}}>{p.desc}</p>
            {p.pts.map((pt,i)=><div key={i} style={{color:"#64748b",fontSize:12,marginBottom:3}}>• {pt}</div>)}
          </Card>
        ))}
      </div>
      <Card>
        <ST>APPLICATION LAYER PROTOCOLS OVERVIEW</ST>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:9}}>
          {[{n:"DNS",p:"53 UDP/TCP",c:"#6366f1",d:"Domain name → IP resolution"},
            {n:"HTTP/HTTPS",p:"80/443 TCP",c:"#0ea5e9",d:"Web browsing"},
            {n:"SMTP",p:"25/587 TCP",c:"#10b981",d:"Sending email"},
            {n:"POP3",p:"110/995 TCP",c:"#f59e0b",d:"Download email"},
            {n:"IMAP",p:"143/993 TCP",c:"#ef4444",d:"Sync email"},
            {n:"FTP",p:"20/21 TCP",c:"#8b5cf6",d:"File transfer"},
            {n:"DHCP",p:"67/68 UDP",c:"#ec4899",d:"Auto IP config"},
            {n:"SNMP",p:"161/162 UDP",c:"#14b8a6",d:"Network management"},
            {n:"SSH",p:"22 TCP",c:"#64748b",d:"Secure remote login"},
            {n:"Telnet",p:"23 TCP",c:"#475569",d:"Remote terminal (insecure)"},
          ].map(p=>(
            <div key={p.n} style={{background:"#0f172a",borderRadius:9,padding:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{color:p.c,fontWeight:800,fontSize:14}}>{p.n}</span>
                <span style={{color:"#475569",fontSize:10}}>:{p.p}</span>
              </div>
              <div style={{color:"#64748b",fontSize:12}}>{p.d}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AL_DNS() {
  const [view, setView] = useState("how");
  return (
    <div>
      <ST>DNS — DOMAIN NAME SYSTEM (Tanenbaum §7.1)</ST>
      <Tabs color="#6366f1"
        tabs={[{id:"how",label:"How DNS Works"},{id:"hierarchy",label:"Hierarchy"},{id:"records",label:"Record Types"},{id:"security",label:"Security"}]}
        active={view} setActive={setView}/>
      {view==="how" && (
        <div>
          <p style={{color:"#94a3b8",marginBottom:14,fontSize:13,lineHeight:1.7}}>
            DNS is a <strong style={{color:"#e2e8f0"}}>distributed, hierarchical database</strong> mapping domain names → IP addresses. Runs over <strong style={{color:"#e2e8f0"}}>UDP port 53</strong> (TCP for zone transfers and responses &gt;512 bytes).
          </p>
          <Card style={{marginBottom:14}}>
            <div style={{color:"#6366f1",fontWeight:700,marginBottom:10}}>DNS Resolution Steps (Recursive Query)</div>
            {["Browser checks local cache / hosts file — if TTL valid, done",
              "OS asks recursive resolver (configured via DHCP, e.g. 8.8.8.8)",
              "Resolver asks a Root Server: 'Who handles .com?'",
              "Root returns address of .com TLD server",
              "Resolver asks TLD: 'Who handles example.com?'",
              "TLD returns address of example.com authoritative nameserver",
              "Resolver asks authoritative NS: 'What is www.example.com?'",
              "Auth NS returns A record: 93.184.216.34 (with TTL)",
              "Resolver caches result and returns IP to browser",
              "Browser connects to web server at that IP"
            ].map((s,i)=>(
              <div key={i} style={{display:"flex",gap:10,marginBottom:7}}>
                <span style={{background:"#6366f122",color:"#6366f1",borderRadius:4,padding:"1px 6px",fontSize:11,fontWeight:700,flexShrink:0}}>{i+1}</span>
                <span style={{color:"#94a3b8",fontSize:13}}>{s}</span>
              </div>
            ))}
          </Card>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Card>
              <div style={{color:"#6366f1",fontWeight:700,marginBottom:8}}>Recursive vs Iterative Queries</div>
              {[{n:"Recursive",d:"Resolver does all the work. Client asks once, gets final answer. Most client queries are recursive."},
                {n:"Iterative",d:"Resolver gets referral to next server. Client/resolver follows referrals. Used between DNS servers."}
              ].map(({n,d})=>(
                <div key={n} style={{marginBottom:10}}>
                  <div style={{color:"#6366f1",fontWeight:700,fontSize:12}}>{n}</div>
                  <div style={{color:"#64748b",fontSize:12}}>{d}</div>
                </div>
              ))}
            </Card>
            <Card>
              <div style={{color:"#6366f1",fontWeight:700,marginBottom:8}}>DNS Caching & TTL</div>
              <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7}}>Each DNS record has a TTL (Time To Live). Resolvers cache results for TTL seconds — reduces load on authoritative servers. Low TTL = frequent lookup, high TTL = stale risk.</p>
              <div style={{background:"#0f172a",borderRadius:7,padding:9,marginTop:8,fontFamily:"monospace",fontSize:11,color:"#64748b"}}>
                google.com A 142.250.80.46 TTL=300<br/>
                <span style={{color:"#6366f1"}}>Cache for 5 minutes, then re-query</span>
              </div>
            </Card>
          </div>
        </div>
      )}
      {view==="hierarchy" && (
        <Card>
          <div style={{color:"#6366f1",fontWeight:700,marginBottom:10}}>DNS Namespace Hierarchy</div>
          <svg width="100%" viewBox="0 0 500 170">
            <rect x={210} y={8} width={80} height={28} rx={6} fill="#6366f122" stroke="#6366f1" strokeWidth={1.5}/>
            <text x={250} y={26} textAnchor="middle" fill="#6366f1" fontSize={12} fontWeight="700">Root (.)</text>
            {[".com",".org",".net",".bd",".uk"].map((tld,i)=>{
              const x=30+i*90;
              return <g key={tld}>
                <line x1={250} y1={36} x2={x+35} y2={72} stroke="#334155" strokeWidth={1}/>
                <rect x={x} y={72} width={70} height={26} rx={6} fill="#0ea5e922" stroke="#0ea5e9" strokeWidth={1.5}/>
                <text x={x+35} y={89} textAnchor="middle" fill="#0ea5e9" fontSize={11} fontWeight="700">{tld}</text>
              </g>;
            })}
            {[["google",25],["example",115],["github",205]].map(([name,x])=>(
              <g key={name}>
                <line x1={65} y1={98} x2={x+40} y2={130} stroke="#334155" strokeWidth={1}/>
                <rect x={x} y={130} width={80} height={26} rx={6} fill="#10b98122" stroke="#10b981" strokeWidth={1.5}/>
                <text x={x+40} y={147} textAnchor="middle" fill="#10b981" fontSize={10}>{name}.com</text>
              </g>
            ))}
            <text x={430} y={90} fill="#64748b" fontSize={9}>13 root server clusters</text>
            <text x={430} y={102} fill="#64748b" fontSize={9}>worldwide (A–M)</text>
          </svg>
          <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginTop:8}}>
            <strong style={{color:"#e2e8f0"}}>Root servers</strong>: 13 logical servers (A–M), actually hundreds of physical servers via anycast. Know addresses of all TLD servers.<br/>
            <strong style={{color:"#e2e8f0"}}>TLD servers</strong>: handle .com, .org, .net, country codes (.bd, .uk).<br/>
            <strong style={{color:"#e2e8f0"}}>Authoritative NS</strong>: hold actual records for a zone.
          </p>
        </Card>
      )}
      {view==="records" && (
        <Card>
          <ST>DNS RESOURCE RECORD TYPES</ST>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:9}}>
            {[{t:"A",c:"#6366f1",d:"Hostname → IPv4 address",ex:"www → 93.184.216.34"},
              {t:"AAAA",c:"#0ea5e9",d:"Hostname → IPv6 address",ex:"www → 2606:2800::1"},
              {t:"MX",c:"#10b981",d:"Mail exchange server",ex:"example.com → mail.ex.com (pri 10)"},
              {t:"CNAME",c:"#f59e0b",d:"Alias → canonical name",ex:"blog.ex.com → example.com"},
              {t:"NS",c:"#ef4444",d:"Authoritative name server",ex:"example.com → ns1.example.com"},
              {t:"TXT",c:"#8b5cf6",d:"Arbitrary text (SPF, DKIM)",ex:"v=spf1 include:google.com ~all"},
              {t:"PTR",c:"#ec4899",d:"Reverse DNS (IP → name)",ex:"34.216.184.93.in-addr.arpa → www"},
              {t:"SOA",c:"#14b8a6",d:"Start of Authority — zone metadata",ex:"serial, refresh, retry, expiry, TTL"},
              {t:"SRV",c:"#64748b",d:"Service location (host + port)",ex:"_sip._tcp → sip.example.com:5060"},
            ].map(r=>(
              <div key={r.t} style={{background:"#0f172a",borderRadius:9,padding:11}}>
                <div style={{color:r.c,fontWeight:800,fontSize:16,marginBottom:4}}>{r.t}</div>
                <div style={{color:"#94a3b8",fontSize:12,marginBottom:5}}>{r.d}</div>
                <div style={{color:"#475569",fontSize:11,fontFamily:"monospace"}}>{r.ex}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
      {view==="security" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Card>
            <div style={{color:"#ef4444",fontWeight:700,marginBottom:8}}>DNS Security Threats</div>
            {[{n:"DNS Spoofing/Cache Poisoning",d:"Attacker injects false DNS records into resolver cache. Victims go to attacker's server."},
              {n:"DNS Amplification DDoS",d:"Small DNS query → large response. Attacker spoofs victim's IP as source. Victim flooded."},
              {n:"DNS Hijacking",d:"ISP or attacker redirects DNS queries to their own server (surveillance, censorship, ads)."},
              {n:"NXDOMAIN Hijacking",d:"Return fake results for non-existent domains instead of NXDOMAIN error."},
            ].map(({n,d})=>(
              <div key={n} style={{marginBottom:10}}>
                <div style={{color:"#ef4444",fontWeight:700,fontSize:12}}>{n}</div>
                <div style={{color:"#64748b",fontSize:12}}>{d}</div>
              </div>
            ))}
          </Card>
          <Card>
            <div style={{color:"#10b981",fontWeight:700,marginBottom:8}}>DNS Security Solutions</div>
            {[{n:"DNSSEC",d:"Digitally sign DNS records. Resolvers verify signatures. Prevents cache poisoning."},
              {n:"DoH (DNS over HTTPS)",d:"Send DNS queries over HTTPS (port 443). Prevents eavesdropping, censorship."},
              {n:"DoT (DNS over TLS)",d:"Encrypt DNS queries with TLS on port 853. Prevents interception."},
              {n:"Response Rate Limiting",d:"Limit responses to same IP — mitigates amplification attacks."},
            ].map(({n,d})=>(
              <div key={n} style={{marginBottom:10}}>
                <div style={{color:"#10b981",fontWeight:700,fontSize:12}}>{n}</div>
                <div style={{color:"#64748b",fontSize:12}}>{d}</div>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}

function AL_HTTP() {
  const [method, setMethod] = useState("GET");
  const methods={GET:{c:"#10b981",d:"Retrieve resource. Safe, idempotent. Params in URL."},POST:{c:"#0ea5e9",d:"Submit data. Not idempotent. Body carries payload."},PUT:{c:"#f59e0b",d:"Replace resource entirely. Idempotent."},PATCH:{c:"#8b5cf6",d:"Partial update. Not necessarily idempotent."},DELETE:{c:"#ef4444",d:"Delete resource. Idempotent."},HEAD:{c:"#64748b",d:"Like GET but headers only — no body."},OPTIONS:{c:"#14b8a6",d:"What methods does server support? (CORS preflight)"}};
  const m=methods[method];
  return (
    <div>
      <ST>WWW AND HTTP (Tanenbaum §7.2)</ST>
      <p style={{color:"#94a3b8",marginBottom:14,fontSize:13,lineHeight:1.7}}>
        HTTP is <strong style={{color:"#e2e8f0"}}>stateless</strong> and follows <strong style={{color:"#e2e8f0"}}>request-response</strong> model. Client sends request; server returns response. Runs over TCP (HTTP/1.x, HTTP/2) or QUIC (HTTP/3).
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
        <Card>
          <ST>HTTP REQUEST FORMAT</ST>
          <div style={{background:"#0f172a",borderRadius:9,padding:12,fontFamily:"monospace",fontSize:12,color:"#94a3b8",lineHeight:2}}>
            <span style={{color:"#0ea5e9"}}>GET</span> /index.html <span style={{color:"#10b981"}}>HTTP/1.1</span><br/>
            <span style={{color:"#6366f1"}}>Host:</span> www.example.com<br/>
            <span style={{color:"#6366f1"}}>User-Agent:</span> Mozilla/5.0<br/>
            <span style={{color:"#6366f1"}}>Accept:</span> text/html,application/json<br/>
            <span style={{color:"#6366f1"}}>Accept-Encoding:</span> gzip<br/>
            <span style={{color:"#6366f1"}}>Connection:</span> keep-alive<br/>
            <span style={{color:"#475569"}}>(blank line)<br/>[optional body]</span>
          </div>
        </Card>
        <Card>
          <ST>HTTP RESPONSE FORMAT</ST>
          <div style={{background:"#0f172a",borderRadius:9,padding:12,fontFamily:"monospace",fontSize:12,color:"#94a3b8",lineHeight:2}}>
            <span style={{color:"#10b981"}}>HTTP/1.1 200 OK</span><br/>
            <span style={{color:"#6366f1"}}>Content-Type:</span> text/html; charset=UTF-8<br/>
            <span style={{color:"#6366f1"}}>Content-Length:</span> 1234<br/>
            <span style={{color:"#6366f1"}}>Cache-Control:</span> max-age=3600<br/>
            <span style={{color:"#6366f1"}}>Date:</span> Sat, 20 Jun 2026<br/>
            <span style={{color:"#475569"}}>(blank line)<br/></span>
            <span style={{color:"#94a3b8"}}>&lt;html&gt;...&lt;/html&gt;</span>
          </div>
        </Card>
      </div>
      <Card style={{marginBottom:12}}>
        <ST>HTTP METHODS</ST>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
          {Object.keys(methods).map(k=>(
            <button key={k} onClick={()=>setMethod(k)} style={{background:method===k?methods[k].c:"#0f172a",color:method===k?"#fff":"#64748b",border:`1.5px solid ${method===k?methods[k].c:"#334155"}`,borderRadius:7,padding:"4px 12px",cursor:"pointer",fontSize:12,fontWeight:700}}>{k}</button>
          ))}
        </div>
        <div style={{background:"#0f172a",borderRadius:9,padding:12}}>
          <span style={{color:m.c,fontWeight:700,fontSize:14}}>{method}: </span>
          <span style={{color:"#94a3b8",fontSize:13}}>{m.d}</span>
        </div>
      </Card>
      <Card style={{marginBottom:12}}>
        <ST>HTTP STATUS CODES</ST>
        {[{code:"1xx",label:"Informational",c:"#64748b",ex:"100 Continue, 101 Switching Protocols"},
          {code:"2xx",label:"Success",c:"#10b981",ex:"200 OK, 201 Created, 204 No Content"},
          {code:"3xx",label:"Redirection",c:"#f59e0b",ex:"301 Moved Permanently, 302 Found, 304 Not Modified"},
          {code:"4xx",label:"Client Error",c:"#ef4444",ex:"400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found"},
          {code:"5xx",label:"Server Error",c:"#8b5cf6",ex:"500 Internal Server Error, 502 Bad Gateway, 503 Unavailable"},
        ].map(s=>(
          <div key={s.code} style={{display:"flex",gap:12,marginBottom:9,alignItems:"flex-start"}}>
            <span style={{background:s.c+"22",color:s.c,borderRadius:6,padding:"2px 10px",fontWeight:700,fontSize:13,flexShrink:0}}>{s.code}</span>
            <div>
              <div style={{color:"#e2e8f0",fontWeight:600,fontSize:13}}>{s.label}</div>
              <div style={{color:"#64748b",fontSize:12}}>{s.ex}</div>
            </div>
          </div>
        ))}
      </Card>
      <Card>
        <ST>HTTP VERSIONS</ST>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
          {[{v:"HTTP/1.0",c:"#64748b",pts:["1 req/connection","No persist","Text format","Simple"]},
            {v:"HTTP/1.1",c:"#0ea5e9",pts:["Persistent (keep-alive)","Pipelining (limited)","Host header req.","Chunked transfer"]},
            {v:"HTTP/2",c:"#6366f1",pts:["Multiplexed streams","Binary framing","HPACK compression","Server Push"]},
            {v:"HTTP/3",c:"#10b981",pts:["QUIC/UDP transport","0-RTT setup","No HOL blocking","TLS 1.3 built-in"]},
          ].map(v=>(
            <div key={v.v} style={{background:"#0f172a",borderRadius:9,padding:11}}>
              <div style={{color:v.c,fontWeight:800,marginBottom:7}}>{v.v}</div>
              {v.pts.map((p,i)=><div key={i} style={{color:"#64748b",fontSize:11,marginBottom:3}}>• {p}</div>)}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function AL_Email() {
  const [step, setStep] = useState(0);
  const journey=[
    {actor:"Alice's MUA",msg:"Compose + submit via SMTP port 587",c:"#6366f1",d:"Alice writes in Outlook/Thunderbird. Submits to her Mail Submission Agent with authentication."},
    {actor:"Alice's MTA",msg:"DNS MX lookup for bob.com",c:"#0ea5e9",d:"Alice's mail server looks up MX record: who receives mail for bob.com?"},
    {actor:"Alice's MTA → Bob's MTA",msg:"SMTP on port 25: EHLO/MAIL FROM/RCPT TO/DATA",c:"#10b981",d:"SMTP conversation delivers the email. Both MTAs communicate directly."},
    {actor:"Bob's MTA → Mailbox",msg:"Store in Bob's mailbox",c:"#f59e0b",d:"Bob's MTA stores email on server until retrieval."},
    {actor:"Bob's MUA",msg:"Retrieve via POP3 (port 110) or IMAP (port 143)",c:"#ef4444",d:"Bob's client fetches email. POP3=download+delete; IMAP=sync on server."},
  ];
  return (
    <div>
      <ST>EMAIL — SMTP, POP3, IMAP (Tanenbaum §7.3)</ST>
      <Card style={{marginBottom:12}}>
        <div style={{color:"#10b981",fontWeight:700,marginBottom:10}}>Email Journey: Alice → Bob</div>
        {journey.map((s,i)=>(
          <div key={i} style={{display:"flex",gap:9,marginBottom:8,opacity:i>step?0.2:1,transition:"opacity 0.3s"}}>
            <div style={{background:s.c,color:"#fff",borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0,marginTop:2}}>{i+1}</div>
            <div style={{background:"#0f172a",borderRadius:7,padding:"7px 10px",flex:1}}>
              <div style={{color:s.c,fontWeight:700,fontSize:12}}>{s.actor}: {s.msg}</div>
              <div style={{color:"#64748b",fontSize:11,marginTop:2}}>{s.d}</div>
            </div>
          </div>
        ))}
        <div style={{display:"flex",gap:7,marginTop:8}}>
          <button onClick={()=>setStep(Math.min(4,step+1))} style={{background:"#10b981",color:"#fff",border:"none",borderRadius:7,padding:"4px 12px",cursor:"pointer",fontSize:11}}>Next ▶</button>
          <button onClick={()=>setStep(0)} style={{background:"#1e293b",color:"#64748b",border:"1px solid #334155",borderRadius:7,padding:"4px 12px",cursor:"pointer",fontSize:11}}>Reset</button>
        </div>
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:11,marginBottom:12}}>
        {[{p:"SMTP",port:"25,587,465",c:"#10b981",cmds:["EHLO — greet server","MAIL FROM: <alice@ex.com>","RCPT TO: <bob@bob.com>","DATA — start message body",". (dot) — end message","QUIT — disconnect"],note:"25=server↔server, 587=auth submission, 465=SMTPS"},
          {p:"POP3",port:"110,995",c:"#f59e0b",cmds:["USER alice","PASS secret","STAT — mailbox info","LIST — list messages","RETR n — get message n","DELE n — delete","QUIT"],note:"Downloads & deletes from server. Simple. Single device."},
          {p:"IMAP",port:"143,993",c:"#0ea5e9",cmds:["LOGIN alice pass","SELECT INBOX","FETCH 1 FULL","SEARCH UNSEEN","STORE 1 +FLAGS \\Seen","LOGOUT"],note:"Keeps mail on server. Multi-device sync. Server-side folders."},
        ].map(p=>(
          <Card key={p.p}>
            <div style={{color:p.c,fontWeight:800,fontSize:16,marginBottom:2}}>{p.p}</div>
            <div style={{color:"#64748b",fontSize:11,marginBottom:9}}>Port {p.port}</div>
            {p.cmds.map((c,i)=><div key={i} style={{color:"#94a3b8",fontSize:11,marginBottom:3,fontFamily:"monospace"}}>• {c}</div>)}
            <div style={{color:"#475569",fontSize:11,marginTop:8,borderTop:"1px solid #334155",paddingTop:6}}>{p.note}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AL_ServerFarms() {
  return (
    <div>
      <ST>SERVER FARMS, WEB PROXIES & CDN (Tanenbaum §7.4)</ST>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
        <Card>
          <div style={{color:"#0ea5e9",fontWeight:700,marginBottom:8}}>Server Farms</div>
          <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:8}}>Large collection of servers in a data center handling millions of requests. Traffic distributed via load balancers.</p>
          {[{t:"Load Balancing",d:"Distribute requests across servers: round-robin, least connections, IP hash"},
            {t:"DNS Load Balancing",d:"Return different IPs for same hostname. Geographic routing."},
            {t:"L4 Load Balancer",d:"Routes based on IP/TCP header (fast, stateless)"},
            {t:"L7 Load Balancer",d:"Routes based on HTTP content, cookies, URL (smart, expensive)"},
            {t:"Session Persistence",d:"Same client always → same server (sticky sessions)"},
          ].map(({t,d})=>(
            <div key={t} style={{marginBottom:8}}>
              <div style={{color:"#0ea5e9",fontWeight:700,fontSize:12}}>{t}</div>
              <div style={{color:"#64748b",fontSize:12}}>{d}</div>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{color:"#f59e0b",fontWeight:700,marginBottom:8}}>Web Proxies</div>
          {[{t:"Forward Proxy",d:"Sits between clients and internet. Client sends all requests to proxy. Used for caching, filtering, anonymity, access control."},
            {t:"Reverse Proxy",d:"Sits in front of web servers. Clients think they're talking to origin server. Handles SSL, caching, load balancing, compression."},
            {t:"Transparent Proxy",d:"Intercepts traffic without client configuration. Common in ISPs and corporate networks."},
            {t:"Caching Proxy",d:"Stores responses locally. Subsequent requests served from cache. Reduces bandwidth and origin load."},
          ].map(({t,d})=>(
            <div key={t} style={{marginBottom:9}}>
              <div style={{color:"#f59e0b",fontWeight:700,fontSize:12}}>{t}</div>
              <div style={{color:"#64748b",fontSize:12}}>{d}</div>
            </div>
          ))}
        </Card>
      </div>
      <Card>
        <div style={{color:"#ec4899",fontWeight:700,marginBottom:8}}>CDN — Content Delivery Networks</div>
        <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:10}}>
          A CDN is a geographically distributed network of servers that serves content from the location nearest to the user. Reduces latency, absorbs traffic spikes, protects origin.
        </p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:10}}>
          <div>
            <div style={{color:"#e2e8f0",fontWeight:700,marginBottom:7}}>How CDN Works</div>
            {["User requests video.example.com/clip.mp4",
              "DNS returns IP of nearest CDN PoP (via GeoDNS or Anycast)",
              "User connects to edge server (50ms vs 300ms to origin)",
              "Cache hit → serve immediately from edge",
              "Cache miss → edge fetches from origin, caches for future",
              "CDN handles SSL termination, compression, DDoS mitigation"
            ].map((s,i)=>(
              <div key={i} style={{display:"flex",gap:8,marginBottom:5}}>
                <span style={{background:"#ec4899"+"22",color:"#ec4899",borderRadius:4,padding:"1px 5px",fontSize:10,fontWeight:700,flexShrink:0}}>{i+1}</span>
                <span style={{color:"#94a3b8",fontSize:12}}>{s}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{color:"#e2e8f0",fontWeight:700,marginBottom:7}}>CDN Techniques</div>
            {[{t:"Anycast",d:"Multiple PoPs share same IP; BGP routes to nearest"},
              {t:"GeoDNS",d:"DNS returns different IPs based on client location"},
              {t:"Origin Pull",d:"Edge fetches from origin on miss, caches locally"},
              {t:"Pre-seeding",d:"CDN proactively distributes popular content to edges"},
              {t:"HLS/DASH",d:"Adaptive video: segments cached at edge, quality adapts"},
              {t:"HTTP/2 Push",d:"Edge pushes CSS/JS client will need before requested"},
            ].map(({t,d})=>(
              <div key={t} style={{marginBottom:7}}>
                <div style={{color:"#ec4899",fontWeight:700,fontSize:12}}>{t}</div>
                <div style={{color:"#64748b",fontSize:12}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function AL_P2P() {
  return (
    <div>
      <ST>PEER-TO-PEER NETWORKS (Tanenbaum §7.5)</ST>
      <p style={{color:"#94a3b8",marginBottom:14,fontSize:13,lineHeight:1.7}}>
        In P2P, every node acts as both client and server. No central infrastructure required. Highly scalable — adding peers adds both demand AND capacity.
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
        <Card>
          <div style={{color:"#14b8a6",fontWeight:700,marginBottom:8}}>Unstructured P2P</div>
          <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:8}}>Peers connect randomly. No guaranteed path to find content — use flooding or random walk search.</p>
          {[{n:"Gnutella",d:"Flood-based search. Every peer asks all neighbors. O(n) messages — doesn't scale."},
            {n:"Napster (hybrid)",d:"Central index server (what's available + where). Peers transfer directly. Central server was legal target."},
          ].map(({n,d})=>(
            <div key={n} style={{marginBottom:8}}>
              <div style={{color:"#14b8a6",fontWeight:700,fontSize:12}}>{n}</div>
              <div style={{color:"#64748b",fontSize:12}}>{d}</div>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{color:"#8b5cf6",fontWeight:700,marginBottom:8}}>Structured P2P — DHT</div>
          <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:8}}>
            <strong style={{color:"#e2e8f0"}}>Distributed Hash Table (DHT)</strong>: keys are hashed to node IDs. Each node responsible for a range. O(log n) lookup. Chord, Kademlia, Pastry.
          </p>
          {[{n:"Chord",d:"Ring of node IDs. Each node has finger table pointing to 2^k nodes ahead. O(log n) hops."},
            {n:"Kademlia",d:"XOR metric for distance. Used by BitTorrent (tracker-less), eMule, IPFS."},
          ].map(({n,d})=>(
            <div key={n} style={{marginBottom:8}}>
              <div style={{color:"#8b5cf6",fontWeight:700,fontSize:12}}>{n}</div>
              <div style={{color:"#64748b",fontSize:12}}>{d}</div>
            </div>
          ))}
        </Card>
      </div>
      <Card>
        <div style={{color:"#f59e0b",fontWeight:700,marginBottom:8}}>BitTorrent — Most Successful P2P Protocol</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div>
            <div style={{color:"#e2e8f0",fontWeight:700,marginBottom:7}}>How BitTorrent Works</div>
            {["Torrent file / magnet link describes the content + tracker URL",
              "Tracker maintains list of peers (seeders + leechers)",
              "Client connects to peers, exchanges which pieces they have",
              "Download rarest pieces first (rarest-first algorithm)",
              "Tit-for-tat: upload to peers who upload to you (choke/unchoke)",
              "Once complete: become seeder, upload to others"
            ].map((s,i)=>(
              <div key={i} style={{display:"flex",gap:8,marginBottom:5}}>
                <span style={{background:"#f59e0b22",color:"#f59e0b",borderRadius:4,padding:"1px 5px",fontSize:10,fontWeight:700,flexShrink:0}}>{i+1}</span>
                <span style={{color:"#94a3b8",fontSize:12}}>{s}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{color:"#e2e8f0",fontWeight:700,marginBottom:7}}>BitTorrent Key Concepts</div>
            {[{t:"Pieces",d:"File split into equal pieces (256KB–4MB). Each verified with SHA-1 hash."},
              {t:"Swarm",d:"All peers sharing the same torrent — seeders + leechers."},
              {t:"Seeder",d:"Peer with complete file, uploading only."},
              {t:"Leecher",d:"Peer downloading (and uploading partial content)."},
              {t:"Tit-for-Tat",d:"Only upload to those who upload to you. Prevents free riding."},
              {t:"Optimistic Unchoke",d:"Randomly unchoke one peer to discover faster peers / help new peers."},
            ].map(({t,d})=>(
              <div key={t} style={{marginBottom:7}}>
                <div style={{color:"#f59e0b",fontWeight:700,fontSize:12}}>{t}</div>
                <div style={{color:"#64748b",fontSize:12}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function ApplicationLayer() {
  const [sub, setSub] = useState("intro");
  const subs=[
    {id:"intro",  label:"Introduction"},
    {id:"dns",    label:"DNS"},
    {id:"http",   label:"HTTP & WWW"},
    {id:"email",  label:"Email"},
    {id:"cdn",    label:"Server Farms & CDN"},
    {id:"p2p",    label:"P2P Networks"},
  ];
  return (
    <div>
      <p style={{color:"#94a3b8",marginBottom:14,lineHeight:1.7}}>
        <strong style={{color:"#8b5cf6"}}>Tanenbaum Ch. 7 — The Application Layer.</strong> User-facing protocols. Client-server, P2P, DNS, HTTP, Email, CDN.
      </p>
      <Tabs color="#8b5cf6" tabs={subs} active={sub} setActive={setSub}/>
      {sub==="intro" && <AL_Intro />}
      {sub==="dns"   && <AL_DNS />}
      {sub==="http"  && <AL_HTTP />}
      {sub==="email" && <AL_Email />}
      {sub==="cdn"   && <AL_ServerFarms />}
      {sub==="p2p"   && <AL_P2P />}
    </div>
  );
}
// ═══════════════════════════════════════════════════════
//  OTHER TOPICS
// ═══════════════════════════════════════════════════════

function OSIModel() {
  const [active, setActive] = useState(null);
  const layers=[
    {n:7,name:"Application",color:"#6366f1",ex:"HTTP, FTP, SMTP, DNS",role:"Interface between user applications and the network.",pdu:"Data",dev:"Gateway"},
    {n:6,name:"Presentation",color:"#818cf8",ex:"SSL/TLS, JPEG, ASCII",role:"Data translation, encryption, compression.",pdu:"Data",dev:"—"},
    {n:5,name:"Session",color:"#a5b4fc",ex:"NetBIOS, RPC",role:"Session setup, maintenance, teardown.",pdu:"Data",dev:"—"},
    {n:4,name:"Transport",color:"#0ea5e9",ex:"TCP, UDP",role:"End-to-end communication, flow control, error detection.",pdu:"Segment",dev:"Firewall"},
    {n:3,name:"Network",color:"#10b981",ex:"IP, ICMP, OSPF",role:"Logical addressing (IP), routing across networks.",pdu:"Packet",dev:"Router"},
    {n:2,name:"Data Link",color:"#f59e0b",ex:"Ethernet, Wi-Fi",role:"Physical addressing (MAC), error detection in frames.",pdu:"Frame",dev:"Switch"},
    {n:1,name:"Physical",color:"#ef4444",ex:"Cables, Radio",role:"Transmit raw bits over physical medium.",pdu:"Bits",dev:"Hub"},
  ];
  return (
    <div>
      <p style={{color:"#94a3b8",marginBottom:18,lineHeight:1.7}}>The OSI model has <strong style={{color:"#e2e8f0"}}>7 layers</strong>. Click any to expand. Tanenbaum uses a 5-layer TCP/IP model but teaches OSI for conceptual clarity.</p>
      <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
        <div style={{flex:"1 1 260px"}}>
          {layers.map(l=>(
            <div key={l.n} onClick={()=>setActive(active?.n===l.n?null:l)}
              style={{background:active?.n===l.n?l.color+"33":"#1e293b",border:`2px solid ${active?.n===l.n?l.color:"#334155"}`,borderRadius:9,padding:"11px 14px",marginBottom:5,cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"all 0.2s"}}>
              <div style={{background:l.color,color:"#fff",borderRadius:5,width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,flexShrink:0}}>{l.n}</div>
              <div><div style={{color:"#e2e8f0",fontWeight:600}}>{l.name}</div><div style={{color:"#64748b",fontSize:12}}>{l.ex}</div></div>
              <div style={{marginLeft:"auto",color:l.color,fontSize:12,fontWeight:600}}>{l.pdu}</div>
            </div>
          ))}
        </div>
        {active && (
          <div style={{flex:"1 1 240px",background:"#1e293b",border:`2px solid ${active.color}`,borderRadius:12,padding:20,height:"fit-content"}}>
            <div style={{color:active.color,fontWeight:700,fontSize:17,marginBottom:7}}>Layer {active.n}: {active.name}</div>
            <p style={{color:"#cbd5e1",lineHeight:1.7,marginBottom:14}}>{active.role}</p>
            <Row label="PDU" value={active.pdu} color={active.color}/>
            <Row label="Examples" value={active.ex} color={active.color}/>
            <Row label="Device" value={active.dev} color={active.color}/>
          </div>
        )}
      </div>
    </div>
  );
}

function IPAddressing() {
  const [ip, setIp] = useState("192.168.1.100");
  const parts=ip.split(".").map(Number);
  const valid=parts.length===4&&parts.every(p=>!isNaN(p)&&p>=0&&p<=255);
  const classes=[
    {range:"0–127",cls:"A",hosts:"16M+",mask:"/8",ex:"10.x.x.x",color:"#6366f1"},
    {range:"128–191",cls:"B",hosts:"65K+",mask:"/16",ex:"172.16.x.x",color:"#0ea5e9"},
    {range:"192–223",cls:"C",hosts:"254",mask:"/24",ex:"192.168.x.x",color:"#10b981"},
    {range:"224–239",cls:"D",hosts:"Multicast",mask:"—",ex:"224.0.0.1",color:"#f59e0b"},
    {range:"240–255",cls:"E",hosts:"Reserved",mask:"—",ex:"—",color:"#ef4444"},
  ];
  const detected=valid?(parts[0]<=127?"A":parts[0]<=191?"B":parts[0]<=223?"C":parts[0]<=239?"D":"E"):null;
  const toBin=n=>(n>>>0).toString(2).padStart(8,"0");
  return (
    <div>
      <Card style={{marginBottom:14}}>
        <div style={{color:"#e2e8f0",fontWeight:700,marginBottom:12}}>IP Address Analyzer</div>
        <input value={ip} onChange={e=>setIp(e.target.value)} style={{background:"#0f172a",border:`1.5px solid ${valid?"#10b981":"#ef4444"}`,borderRadius:7,padding:"7px 12px",color:"#e2e8f0",fontSize:14,width:"100%",outline:"none",boxSizing:"border-box",marginBottom:12}}/>
        {valid&&(<>
          <div style={{display:"flex",gap:4,marginBottom:8}}>
            {parts.map((p,i)=><div key={i} style={{flex:1,textAlign:"center"}}>
              <div style={{background:"#0f172a",borderRadius:6,padding:"5px 3px",color:"#10b981",fontWeight:700,fontSize:14,marginBottom:3}}>{p}</div>
              <div style={{color:"#475569",fontSize:9,fontFamily:"monospace"}}>{toBin(p)}</div>
            </div>)}
          </div>
          <div style={{color:"#94a3b8",fontSize:13}}>Class: <strong style={{color:classes.find(c=>c.cls===detected)?.color}}>{detected}</strong></div>
        </>)}
      </Card>
      <Card style={{overflow:"hidden",padding:0}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:"#0f172a"}}>{["Class","1st Octet","Hosts","Mask","Example"].map(h=><th key={h} style={{padding:"8px 12px",color:"#64748b",textAlign:"left",fontSize:11}}>{h}</th>)}</tr></thead>
          <tbody>{classes.map(c=><tr key={c.cls} style={{borderTop:"1px solid #1e293b",background:detected===c.cls?c.color+"22":"transparent"}}>
            <td style={{padding:"7px 12px",color:c.color,fontWeight:700}}>{c.cls}</td>
            <td style={{padding:"7px 12px",color:"#94a3b8",fontSize:13}}>{c.range}</td>
            <td style={{padding:"7px 12px",color:"#cbd5e1",fontSize:13}}>{c.hosts}</td>
            <td style={{padding:"7px 12px",color:"#94a3b8"}}>{c.mask}</td>
            <td style={{padding:"7px 12px",color:"#64748b",fontSize:12}}>{c.ex}</td>
          </tr>)}</tbody>
        </table>
      </Card>
    </div>
  );
}

function Subnetting() {
  const [prefix, setPrefix] = useState(24);
  const hosts=Math.pow(2,32-prefix)-2;
  const m=[];let r=prefix;
  for(let i=0;i<4;i++){if(r>=8){m.push(255);r-=8;}else if(r>0){m.push(256-Math.pow(2,8-r));r=0;}else m.push(0);}
  return (
    <div>
      <Card style={{marginBottom:14}}>
        <div style={{color:"#e2e8f0",fontWeight:700,marginBottom:14}}>Subnet Calculator</div>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <span style={{color:"#94a3b8"}}>192.168.1.0 /</span>
          <input type="number" min={8} max={30} value={prefix} onChange={e=>setPrefix(Number(e.target.value))} style={{background:"#0f172a",border:"1.5px solid #334155",borderRadius:7,padding:"5px 10px",color:"#10b981",fontSize:17,fontWeight:700,width:65,outline:"none"}}/>
        </div>
        <div style={{display:"flex",gap:2,marginBottom:8}}>
          {Array.from({length:32},(_,i)=><div key={i} style={{flex:1,height:16,background:i<prefix?"#10b981":"#334155",borderRadius:2,minWidth:4}}/>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9,marginTop:12}}>
          {[{l:"Subnet Mask",v:m.join("."),c:"#10b981"},{l:"Usable Hosts",v:hosts>0?hosts.toLocaleString():"—",c:"#0ea5e9"},{l:"CIDR",v:`/${prefix}`,c:"#6366f1"}].map(c=>(
            <div key={c.l} style={{background:"#0f172a",borderRadius:9,padding:12,textAlign:"center"}}>
              <div style={{color:c.c,fontWeight:700,fontSize:15}}>{c.v}</div>
              <div style={{color:"#64748b",fontSize:12,marginTop:3}}>{c.l}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ErrorDetection() {
  const [data, setData] = useState("1011001");
  const parity=data.split("").filter(b=>b==="1").length%2===0?"0":"1";
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11,marginBottom:14}}>
        {[{n:"Parity Check",c:"#6366f1",d:"Adds 1 bit so total 1s is even/odd. Detects single-bit errors."},
          {n:"CRC",c:"#0ea5e9",d:"Polynomial division. Very powerful. Used in Ethernet, USB."},
          {n:"Checksum",c:"#10b981",d:"Sum of data segments. Used in TCP/IP headers."},
          {n:"Hamming Code",c:"#f59e0b",d:"Redundant bits at power-of-2 positions. Corrects 1-bit errors."},
        ].map(t=><Card key={t.n}><div style={{color:t.c,fontWeight:700,marginBottom:5}}>{t.n}</div><div style={{color:"#64748b",fontSize:13}}>{t.d}</div></Card>)}
      </div>
      <Card>
        <div style={{color:"#e2e8f0",fontWeight:700,marginBottom:10}}>Parity Bit Calculator</div>
        <input value={data} onChange={e=>setData(e.target.value.replace(/[^01]/g,"").slice(0,12))} style={{background:"#0f172a",border:"1.5px solid #334155",borderRadius:7,padding:"5px 10px",color:"#10b981",fontSize:14,fontFamily:"monospace",width:140,outline:"none",marginBottom:10}}/>
        <div style={{display:"flex",gap:4}}>
          {data.split("").map((b,i)=><div key={i} style={{background:"#0f172a",border:`2px solid ${b==="1"?"#6366f1":"#334155"}`,borderRadius:5,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",color:b==="1"?"#6366f1":"#475569",fontWeight:700,fontFamily:"monospace",fontSize:14}}>{b}</div>)}
          <div style={{background:"#10b98122",border:"2px solid #10b981",borderRadius:5,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",color:"#10b981",fontWeight:700,fontFamily:"monospace",fontSize:14}}>{parity}</div>
        </div>
        <div style={{color:"#64748b",fontSize:12,marginTop:7}}>Even parity bit = <strong style={{color:"#10b981"}}>{parity}</strong></div>
      </Card>
    </div>
  );
}

function BusSVG(){return(<svg viewBox="0 0 300 110" width="100%"><line x1={20} y1={55} x2={280} y2={55} stroke="#f59e0b" strokeWidth={3}/>{[60,120,180,240].map((x,i)=><g key={i}><line x1={x} y1={55} x2={x} y2={28} stroke="#64748b" strokeWidth={1.5} strokeDasharray="4"/><circle cx={x} cy={16} r={13} fill="#1e293b" stroke="#f59e0b" strokeWidth={2}/><text x={x} y={20} textAnchor="middle" fill="#e2e8f0" fontSize={9}>PC</text></g>)}<rect x={10} y={50} width={10} height={10} fill="#f59e0b" rx={2}/><rect x={280} y={50} width={10} height={10} fill="#f59e0b" rx={2}/></svg>);}
function StarSVG(){const nodes=[[140,22],[215,58],[242,142],[140,178],[38,142],[62,58]];return(<svg viewBox="0 0 280 200" width="100%">{nodes.map(([x,y],i)=><line key={i} x1={140} y1={100} x2={x} y2={y} stroke="#334155" strokeWidth={1.5}/>)}<circle cx={140} cy={100} r={22} fill="#1e293b" stroke="#0ea5e9" strokeWidth={2.5}/><text x={140} y={97} textAnchor="middle" fill="#0ea5e9" fontSize={10} fontWeight="700">SW</text><text x={140} y={109} textAnchor="middle" fill="#0ea5e9" fontSize={8}>hub</text>{nodes.map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r={14} fill="#1e293b" stroke="#64748b" strokeWidth={1.5}/><text x={x} y={y+4} textAnchor="middle" fill="#94a3b8" fontSize={9}>PC</text></g>)}</svg>);}
function RingSVG(){const pts=Array.from({length:6},(_,i)=>{const a=(i*60-90)*Math.PI/180;return[130+78*Math.cos(a),100+78*Math.sin(a)];});return(<svg viewBox="0 0 260 200" width="100%">{pts.map(([x,y],i)=>{const[nx,ny]=pts[(i+1)%6];return<line key={i} x1={x} y1={y} x2={nx} y2={ny} stroke="#10b981" strokeWidth={2}/>;})}{pts.map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r={16} fill="#1e293b" stroke="#10b981" strokeWidth={2}/><text x={x} y={y+4} textAnchor="middle" fill="#e2e8f0" fontSize={9}>PC</text></g>)}</svg>);}
function MeshSVG(){const pts=[[70,35],[190,35],[232,112],[130,168],[28,112]];return(<svg viewBox="0 0 260 185" width="100%">{pts.map(([x1,y1],i)=>pts.map(([x2,y2],j)=>j>i?<line key={`${i}-${j}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#6366f155" strokeWidth={1.5}/>:null))}{pts.map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r={16} fill="#1e293b" stroke="#6366f1" strokeWidth={2}/><text x={x} y={y+4} textAnchor="middle" fill="#e2e8f0" fontSize={9}>PC</text></g>)}</svg>);}

function Topologies() {
  const [sel, setSel] = useState("star");
  const topos={
    bus:{label:"Bus",color:"#f59e0b",desc:"All nodes share one backbone cable.",pros:["Simple, low cost"],cons:["Single point of failure","Collisions"],SVG:BusSVG},
    star:{label:"Star",color:"#0ea5e9",desc:"All nodes connect to central switch. Most common in LANs.",pros:["Easy to manage","Failure isolated"],cons:["Switch = SPOF"],SVG:StarSVG},
    ring:{label:"Ring",color:"#10b981",desc:"Each node connects to two others. Token passing.",pros:["Orderly transfer"],cons:["One break = whole ring down"],SVG:RingSVG},
    mesh:{label:"Mesh",color:"#6366f1",desc:"Every node connected to every other.",pros:["Highly redundant"],cons:["Expensive: n(n-1)/2 links"],SVG:MeshSVG},
  };
  const t=topos[sel];const SvgComp=t.SVG;
  return (
    <div>
      <div style={{display:"flex",gap:7,marginBottom:16,flexWrap:"wrap"}}>
        {Object.entries(topos).map(([k,v])=><button key={k} onClick={()=>setSel(k)} style={{background:sel===k?v.color:"#1e293b",color:sel===k?"#fff":"#64748b",border:`1.5px solid ${sel===k?v.color:"#334155"}`,borderRadius:7,padding:"6px 16px",cursor:"pointer",fontSize:12,fontWeight:600}}>{v.label}</button>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Card style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:180}}><SvgComp/></Card>
        <Card>
          <div style={{color:t.color,fontWeight:700,fontSize:16,marginBottom:7}}>{t.label} Topology</div>
          <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,marginBottom:11}}>{t.desc}</p>
          <div style={{color:"#10b981",fontWeight:700,fontSize:12,marginBottom:5}}>✓ Advantages</div>
          {t.pros.map((p,i)=><div key={i} style={{color:"#94a3b8",fontSize:13,paddingLeft:8,marginBottom:3}}>• {p}</div>)}
          <div style={{color:"#ef4444",fontWeight:700,fontSize:12,marginTop:10,marginBottom:5}}>✗ Disadvantages</div>
          {t.cons.map((c,i)=><div key={i} style={{color:"#94a3b8",fontSize:13,paddingLeft:8,marginBottom:3}}>• {c}</div>)}
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════ TOPIC REGISTRY & MAIN APP ═════════════════════
const TOPICS=[
  {id:"osi",      title:"OSI Model",         icon:"🧱",color:"#6366f1",tag:"Ch.1"},
  {id:"network",  title:"Network Layer",      icon:"🗺️",color:"#10b981",tag:"Ch.5"},
  {id:"transport",title:"Transport Layer",    icon:"🚀",color:"#0ea5e9",tag:"Ch.6"},
  {id:"app",      title:"Application Layer",  icon:"🌐",color:"#8b5cf6",tag:"Ch.7"},
  {id:"ip",       title:"IP Addressing",      icon:"📍",color:"#10b981",tag:"Ch.5"},
  {id:"subnet",   title:"Subnetting",         icon:"✂️",color:"#ef4444",tag:"Ch.5"},
  {id:"topo",     title:"Topologies",         icon:"🔷",color:"#ec4899",tag:"Ch.1"},
  {id:"error",    title:"Error Detection",    icon:"🛡️",color:"#14b8a6",tag:"Ch.3"},
];

function getContent(id){
  if(id==="osi")       return <OSIModel/>;
  if(id==="network")   return <NetworkLayer/>;
  if(id==="transport") return <TransportLayer/>;
  if(id==="app")       return <ApplicationLayer/>;
  if(id==="ip")        return <IPAddressing/>;
  if(id==="subnet")    return <Subnetting/>;
  if(id==="topo")      return <Topologies/>;
  if(id==="error")     return <ErrorDetection/>;
  return null;
}

export default function App(){
  const [active,setActive]=useState("network");
  const cur=TOPICS.find(t=>t.id===active);
  return(
    <div style={{minHeight:"100vh",background:"#0f172a",color:"#e2e8f0",fontFamily:"'Inter','Segoe UI',sans-serif"}}>
      <div style={{background:"linear-gradient(135deg,#1e293b 0%,#0f172a 100%)",borderBottom:"1px solid #1e293b",padding:"14px 18px 0"}}>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:5}}>
            <div style={{background:"linear-gradient(135deg,#6366f1,#0ea5e9)",borderRadius:9,width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>🌐</div>
            <div>
              <div style={{fontWeight:800,fontSize:17,color:"#f1f5f9"}}>Computer Networks — Tanenbaum 6th Edition</div>
              <div style={{color:"#475569",fontSize:11}}>Undergraduate CSE · Complete Interactive Study Guide</div>
            </div>
          </div>
          <div style={{display:"flex",gap:1,overflowX:"auto",marginTop:12}}>
            {TOPICS.map(t=>(
              <button key={t.id} onClick={()=>setActive(t.id)} style={{
                background:active===t.id?"#0f172a":"transparent",
                color:active===t.id?t.color:"#64748b",
                border:"none",
                borderTop:active===t.id?`2px solid ${t.color}`:"2px solid transparent",
                borderRadius:"7px 7px 0 0",
                padding:"6px 11px",cursor:"pointer",fontSize:11,fontWeight:600,
                whiteSpace:"nowrap",transition:"all 0.2s",display:"flex",alignItems:"center",gap:4,
              }}>
                <span>{t.icon}</span><span>{t.title}</span>
                <span style={{background:t.color+"22",color:t.color,borderRadius:3,padding:"0 4px",fontSize:9}}>{t.tag}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{maxWidth:1000,margin:"0 auto",padding:18}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,paddingBottom:12,borderBottom:"1px solid #1e293b"}}>
          <div style={{background:cur.color+"22",color:cur.color,borderRadius:7,padding:"3px 11px",fontSize:12,fontWeight:700}}>{cur.icon} {cur.title}</div>
          <div style={{background:"#1e293b",color:"#475569",borderRadius:5,padding:"3px 8px",fontSize:10}}>Tanenbaum {cur.tag}</div>
        </div>
        {getContent(active)}
      </div>
    </div>
  );
}
