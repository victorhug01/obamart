import { Leaf, Users } from "lucide-react";

export function Sidebar() {
  return (
    <>
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">
            <Leaf size={23} />
          </span>
          <div>
            <strong>
              obamart<span>.</span>
            </strong>
            <small>GESTÃO DE CLIENTES</small>
          </div>
        </div>
        <div className="side-label">ESPAÇO DE TRABALHO</div>
        <div className="nav-active">
          <Users size={19} /> Clientes <span>01</span>
        </div>
        <div className="side-bottom">
          <div className="side-art">
            <Leaf size={28} />
            <p>Boas relações começam com uma boa organização.</p>
            <span>Feito para o dia a dia.</span>
          </div>
          <div className="side-footer">
            <span className="online" /> Seu espaço de gestão
          </div>
        </div>
      </aside>
    </>
  );
}
