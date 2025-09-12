import { projects } from "../data/projects";

export default function Home() {
  return (
    <main style={{maxWidth:980,margin:"48px auto",padding:"0 20px"}}>
      <h1 style={{fontSize:"2rem",fontWeight:800,marginBottom:8}}>Portofolio Erick</h1>
      <p style={{opacity:.72,marginBottom:24}}>
          I’m a finance & accounting analyst with a brain wired for logic and automation. From reporting pipelines to data processing, 
          I turn manual chaos into streamlined systems. I adapt fast, learn faster, and keep my curiosity on infinite respawn. 
          Also: big classical-fantasy reader — the discipline of ancient epics meets the clarity of clean spreadsheets.
      </p>

      <ul style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:16}}>
        {projects.map((p,i)=>(
          <li key={i} style={{border:"1px solid #e5e7eb",borderRadius:16,padding:16}}>
            <div style={{fontWeight:700,marginBottom:6}}>{p.name}</div>
            <p style={{opacity:.75,marginBottom:8}}>{p.description}</p>
            {p.tags?.length>0 && (
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {p.tags.map(t=>(
                  <span key={t} 
                  style={{fontSize:12,border:"1px solid #e5e7eb",borderRadius:999,padding:"4px 8px"}}>{t}</span>
                ))}
              </div>
            )}
            {p.url && <a href={p.url} target="_blank" 
              style={{fontSize:12,border:"1px solid #e5e7eb",borderRadius:999,padding:"4px 8px"}}>
              View</a>}
          </li>
        ))}
      </ul>
    </main>
  );
}
