import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DemoLayout } from "./components/DemoLayout";
import { Home } from "./pages/Home";
import { Users } from "./pages/Users";
import { Status } from "./pages/Status";
import { NotFound } from "./pages/NotFound";
import { AppLayout } from "./app/layout/AppLayout";
import { Inicio } from "./app/pages/Inicio";
import { MeusMedicamentos } from "./app/pages/MeusMedicamentos";
import { CadastrarMedicacao } from "./app/pages/CadastrarMedicacao";
import { QuandoTomar } from "./app/pages/QuandoTomar";
import { Lembretes } from "./app/pages/Lembretes";
import { Configuracoes } from "./app/pages/Configuracoes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Demo original do template (mantida intacta) */}
        <Route element={<DemoLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/status" element={<Status />} />
        </Route>

        {/* App de medicamentos "sync." */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Inicio />} />
          <Route path="medicamentos" element={<MeusMedicamentos />} />
          <Route path="cadastrar" element={<CadastrarMedicacao />} />
          <Route path="cadastrar/quando-tomar" element={<QuandoTomar />} />
          <Route path="lembretes" element={<Lembretes />} />
          <Route path="configuracoes" element={<Configuracoes />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
