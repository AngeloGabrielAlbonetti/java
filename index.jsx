const { useState, useEffect, useRef } = React;

/* ---------- Reveal on scroll ---------- */
function useReveal(){
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if(!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if(e.isIntersecting) setShown(true); });
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, shown];
}

/* ---------- Terminal hero ---------- */
const SCAN_LINES = [
  { text: "$ scan --target=mercado.dev --profile=full", cls: "" },
  { text: "[OK] host ativo, respondendo em 12ms", cls: "ok" },
  { text: "[SCAN] mapeando superfície de ataque...", cls: "" },
  { text: "[SCAN] enumerando stacks e serviços expostos...", cls: "" },
  { text: "[FOUND] 4 competências classificadas por severidade", cls: "warn" },
  { text: "[CRIT] pentest & red team ativo em produção", cls: "crit" },
  { text: "> pronto para novo engajamento_", cls: "ok" },
];

function Terminal(){
  const [lines, setLines] = useState([]);
  const [typing, setTyping] = useState("");
  const lineIdx = useRef(0);
  const charIdx = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if(lineIdx.current >= SCAN_LINES.length){
        clearInterval(interval);
        return;
      }
      const current = SCAN_LINES[lineIdx.current];
      if(charIdx.current <= current.text.length){
        setTyping(current.text.slice(0, charIdx.current));
        charIdx.current += 1;
      } else {
        setLines(prev => [...prev, current]);
        setTyping("");
        charIdx.current = 0;
        lineIdx.current += 1;
      }
    }, 18);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="term">
      <div className="term-bar">
        <span className="dot r"></span><span className="dot y"></span><span className="dot g"></span>
        <span className="term-title">root@angelo — zsh — 82x14</span>
      </div>
      <div className="term-body">
        {lines.map((l, i) => (
          <div key={i} className={"term-line " + l.cls}>{l.text}</div>
        ))}
        {typing !== "" || lines.length < SCAN_LINES.length ? (
          <div className="term-line">{typing}<span className="term-cursor"></span></div>
        ) : null}
      </div>
    </div>
  );
}

/* ---------- Data ---------- */
const FINDINGS = [
  {
    sev: "critical", sevLabel: "CRÍTICO", id: "SVC-001",
    title: "Pentest & Segurança Ofensiva",
    desc: "Testes de intrusão em aplicações web, APIs e infraestrutura. Mapeamento de superfície de ataque, exploração controlada e cadeia completa de evidências para correção priorizada.",
    tags: ["OWASP Top 10", "Burp Suite", "Recon", "Exploit Chains"]
  },
  {
    sev: "high", sevLabel: "ALTO", id: "SVC-002",
    title: "Desenvolvimento Full Stack Seguro",
    desc: "Construção de aplicações web do zero — front-end em React, back-end em Node — com segurança tratada como parte do design, não como camada extra no final.",
    tags: ["React", "Node.js", "APIs REST", "Auth & Sessões"]
  },
  {
    sev: "medium", sevLabel: "MÉDIO", id: "SVC-003",
    title: "Auditoria de Código & Hardening",
    desc: "Revisão de código-fonte em busca de falhas de lógica e configuração insegura, com hardening de servidores e ambientes de produção.",
    tags: ["Code Review", "Hardening", "CI/CD", "C / Baixo Nível"]
  },
  {
    sev: "info", sevLabel: "INFO", id: "SVC-004",
    title: "Consultoria & Treinamento",
    desc: "Orientação técnica para times e founders sobre práticas seguras de desenvolvimento, do primeiro commit ao deploy em produção.",
    tags: ["Secure Coding", "Mentoria", "Documentação"]
  },
];

const METHOD = [
  { n: "01", t: "RECONHECIMENTO", d: "Mapeamento da superfície de ataque: domínios, serviços expostos, versões de software e pontos de entrada possíveis." },
  { n: "02", t: "EXPLORAÇÃO", d: "Testes de intrusão controlados, sempre dentro do escopo combinado, documentando cada passo com evidência reproduzível." },
  { n: "03", t: "RELATÓRIO", d: "Entrega de relatório técnico e executivo, com achados classificados por severidade e impacto real no negócio." },
  { n: "04", t: "REMEDIAÇÃO", d: "Suporte na correção das vulnerabilidades encontradas e reteste para validar que o problema foi realmente fechado." },
];

const CASES = [
  {
    id: "CASE-001", title: "Ponto do Construtor",
    desc: "Plataforma da NyTech que conecta profissionais da construção civil a clientes. Landing page em React via CDN, sem build tool, com foco total em performance mobile.",
    stack: ["React", "CSS custom", "Babel Standalone"]
  },
  {
    id: "CASE-002", title: "Nexus",
    desc: "Protótipo de rede social com estética glassmorphism futurista, explorando interações e microanimações como parte central da identidade visual.",
    stack: ["React", "UI/UX", "Glassmorphism"]
  },
  {
    id: "CASE-003", title: "Jarvis",
    desc: "Assistente de voz que evoluiu de um script de terminal em Python para um app desktop com Electron, React e reconhecimento de voz via Web Speech API.",
    stack: ["Electron", "React", "Python", "Web Speech API"]
  },
];

const STACK = [
  { k: "Ofensivo", v: "Burp Suite, Nmap, Metasploit, OWASP" },
  { k: "Front-end", v: "React, JavaScript, HTML, CSS" },
  { k: "Back-end", v: "Node.js, APIs REST" },
  { k: "Baixo nível", v: "C, ponteiros, alocação de memória" },
  { k: "Mobile", v: "Kotlin, Jetpack Compose" },
  { k: "Fundamentos", v: "UML, OOP, estrutura de dados" },
];

/* ---------- Components ---------- */
function Finding({ f }){
  const [ref, shown] = useReveal();
  return (
    <div ref={ref} className={"finding" + (shown ? " show" : "")}>
      <div>
        <span className={"sev sev-" + f.sev}>{f.sevLabel}</span>
        <span className="finding-id">{f.id}</span>
      </div>
      <div>
        <h3>{f.title}</h3>
        <p>{f.desc}</p>
        <div className="tags">
          {f.tags.map((t,i) => <span key={i} className="tag">{t}</span>)}
        </div>
      </div>
    </div>
  );
}

function MethodItem({ m }){
  const [ref, shown] = useReveal();
  return (
    <div ref={ref} className={"method-item" + (shown ? " show" : "")}>
      <div className="method-num">{m.n}</div>
      <div>
        <h4>{m.t}</h4>
        <p>{m.d}</p>
      </div>
    </div>
  );
}

function CaseCard({ c }){
  const [ref, shown] = useReveal();
  return (
    <div ref={ref} className={"case" + (shown ? " show" : "")}>
      <span className="case-id">{c.id}</span>
      <h3>{c.title}</h3>
      <p>{c.desc}</p>
      <div className="stack">
        {c.stack.map((s,i) => <span key={i}>{s}</span>)}
      </div>
    </div>
  );
}

function ContactForm(){
  const [status, setStatus] = useState("");
  const submit = (e) => {
    e.preventDefault();
    setStatus("[OK] mensagem registrada — respondo em breve por e-mail.");
  };
  return (
    <form onSubmit={submit}>
      <div className="form-field">
        <label>Nome</label>
        <input type="text" required placeholder="Seu nome" />
      </div>
      <div className="form-field">
        <label>E-mail</label>
        <input type="email" required placeholder="voce@empresa.com" />
      </div>
      <div className="form-field">
        <label>Tipo de engajamento</label>
        <select>
          <option>Pentest / Segurança Ofensiva</option>
          <option>Desenvolvimento Full Stack</option>
          <option>Auditoria de Código</option>
          <option>Consultoria</option>
        </select>
      </div>
      <div className="form-field">
        <label>Escopo do projeto</label>
        <textarea placeholder="Conte um pouco sobre o que você precisa..."></textarea>
      </div>
      <button className="btn btn-primary" type="submit" style={{width:"100%"}}>Enviar solicitação</button>
      <div className="form-status">{status}</div>
    </form>
  );
}

function App(){
  return (
    <React.Fragment>
      <nav>
        <div className="nav-inner">
          <div className="logo">root@angelo<span className="caret">_</span></div>
          <div className="nav-links">
            <a href="#findings">achados</a>
            <a href="#method">metodologia</a>
            <a href="#cases">casos</a>
            <a href="#about">stack</a>
            <a href="#contact">contato</a>
          </div>
        </div>
      </nav>

      <header className="hero wrap">
        <div className="hero-grid">
          <Terminal />
          <div className="hero-headline">
            <div className="eyebrow">Relatório de engajamento — disponível para novos projetos</div>
            <h1 className="title">Pentest e desenvolvimento,<br/>com <span className="grad">a mesma rigidez</span> de um relatório de segurança.</h1>
            <p className="subtitle">
              Estudante de Ciência da Computação, focado em segurança ofensiva e engenharia de software.
              Cada projeto é tratado como um engajamento: escopo claro, execução técnica e entrega documentada.
            </p>
            <div className="cta-row">
              <a href="#contact" className="btn btn-primary">Iniciar engajamento</a>
              <a href="#cases" className="btn btn-ghost">Ver casos anteriores</a>
            </div>
          </div>
        </div>
      </header>

      <section className="section" id="findings">
        <div className="wrap">
          <div className="sec-head">
            <span className="sec-tag">// achados</span>
            <span className="sec-title">Serviços, classificados por severidade</span>
          </div>
          <p className="sec-desc">Assim como num relatório real de pentest, cada serviço carrega uma prioridade — o que reflete o impacto direto que ele costuma ter no seu produto.</p>
          <div className="findings">
            {FINDINGS.map((f,i) => <Finding key={i} f={f} />)}
          </div>
        </div>
      </section>

      <section className="section" id="method">
        <div className="wrap">
          <div className="sec-head">
            <span className="sec-tag">// metodologia</span>
            <span className="sec-title">Como um engajamento acontece</span>
          </div>
          <div className="method-list">
            {METHOD.map((m,i) => <MethodItem key={i} m={m} />)}
          </div>
        </div>
      </section>

      <section className="section" id="cases">
        <div className="wrap">
          <div className="sec-head">
            <span className="sec-tag">// casos</span>
            <span className="sec-title">Engajamentos anteriores</span>
          </div>
          <div className="cases">
            {CASES.map((c,i) => <CaseCard key={i} c={c} />)}
          </div>
        </div>
      </section>

      <section className="section" id="about">
        <div className="wrap">
          <div className="sec-head">
            <span className="sec-tag">// perfil</span>
            <span className="sec-title">Sobre e stack técnica</span>
          </div>
          <div className="about-grid">
            <div className="about-text">
              <p><strong>Ciência da Computação</strong>, com foco em segurança ofensiva e desenvolvimento full stack. Trabalho tanto no ataque — mapeando e explorando falhas — quanto na construção, criando aplicações React do zero.</p>
              <p>Parte do time da <strong>NyTech</strong>, onde ajudo a construir o <strong>Ponto do Construtor</strong>, uma plataforma que conecta profissionais da construção civil a clientes.</p>
              <p>Também estudo fundamentos de baixo nível em <strong>C</strong> — ponteiros, alocação de memória — porque entender como a memória quebra é parte do trabalho de saber como protegê-la.</p>
            </div>
            <div className="stack-grid">
              {STACK.map((s,i) => (
                <div className="stack-cell" key={i}>
                  <b>{s.k}</b>{s.v}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="contact">
        <div className="wrap">
          <div className="sec-head">
            <span className="sec-tag">// contato</span>
            <span className="sec-title">Iniciar engajamento</span>
          </div>
          <div className="contact-box">
            <div>
              <h3>Vamos conversar sobre o seu projeto</h3>
              <p>Descreva o escopo — pentest, desenvolvimento ou auditoria — e eu retorno com os próximos passos, como num briefing técnico.</p>
              <div className="contact-links">
                <a href="mailto:seu.email@dominio.com">✉ seu.email@dominio.com</a>
                <a href="https://github.com/seu-usuario" target="_blank" rel="noopener noreferrer">↳ github.com/seu-usuario</a>
                <a href="https://linkedin.com/in/seu-usuario" target="_blank" rel="noopener noreferrer">↳ linkedin.com/in/seu-usuario</a>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap footer-inner">
          <span>© {new Date().getFullYear()} Angelo — todos os sistemas testados com permissão.</span>
          <span>build via React CDN + Babel Standalone</span>
        </div>
      </footer>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);