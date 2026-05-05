import React, { createContext, ReactNode, useContext, useState } from "react";

export type Funcionario = {
  id: string;
  nome: string;
  cpf: string;
  cargo: string;
  setor: string;
  turno: string;
  cargaHoraria: string;
  telefone: string;
  matricula: string;
  status: string;
  observacoes: string;
  coren: string;
};

export type Escala = {
  id: string;
  funcionarioId: string;
  funcionario: string;
  setor: string;
  turno: string;
  data: string;
};

export type TrocaStatus =
  | "Aguardando aceite"
  | "Recusada pelo colega"
  | "Aceita pelo colega"
  | "Aprovada pela coordenação"
  | "Rejeitada pela coordenação";

export type Troca = {
  id: string;
  solicitanteId: string;
  solicitanteNome: string;
  destinatarioId: string;
  destinatarioNome: string;
  data: string;
  turno: string;
  motivo: string;
  status: TrocaStatus;
};

type AppDataContextType = {
  funcionarios: Funcionario[];
  adicionarFuncionario: (funcionario: Funcionario) => void;
  editarFuncionario: (funcionario: Funcionario) => void;
  removerFuncionario: (id: string) => void;
  escalas: Escala[];
  adicionarEscala: (escala: Escala) => { ok: boolean; mensagem?: string };
  editarEscala: (escala: Escala) => { ok: boolean; mensagem?: string };
  removerEscala: (id: string) => void;
  escalaEmEdicao: Escala | null;
  setEscalaEmEdicao: React.Dispatch<React.SetStateAction<Escala | null>>;
  trocas: Troca[];
  solicitarTroca: (troca: Omit<Troca, "id" | "status">) => { ok: boolean; mensagem?: string };
  aceitarTroca: (id: string) => void;
  recusarTroca: (id: string) => void;
  aprovarTroca: (id: string) => { ok: boolean; mensagem?: string };
  rejeitarTroca: (id: string) => void;
};

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

function normalizarTexto(valor: string) {
  return valor.trim().toLowerCase();
}

const cargosComCoren = ["enfermeiro", "técnico de enfermagem"];

export function AppProvider({ children }: { children: ReactNode }) {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([
    {
      id: "1",
      nome: "Valentin Campos Fernandes",
      cpf: "854.155.982-78",
      cargo: "Motorista",
      setor: "Emergência/Ambulância",
      turno: "Diurno (07h às 19h)",
      cargaHoraria: "40h",
      telefone: "(91) 99999-1111",
      matricula: "UMS001",
      status: "Ativo",
      observacoes: "",
      coren: "",
    },
    {
      id: "2",
      nome: "Maria Souza",
      cpf: "123.456.789-10",
      cargo: "Técnico de Enfermagem",
      setor: "Emergência/Ambulância",
      turno: "Noturno (19h às 07h)",
      cargaHoraria: "36h",
      telefone: "(91) 99999-2222",
      matricula: "UMS002",
      status: "Ativo",
      observacoes: "",
      coren: "PA123456",
    },
  ]);

  const [escalas, setEscalas] = useState<Escala[]>([]);
  const [escalaEmEdicao, setEscalaEmEdicao] = useState<Escala | null>(null);
  const [trocas, setTrocas] = useState<Troca[]>([
    {
      id: "1",
      solicitanteId: "1",
      solicitanteNome: "Valentin Campos Fernandes",
      destinatarioId: "2",
      destinatarioNome: "Maria Souza",
      data: "20/04/2026",
      turno: "Noturno (19h às 07h)",
      motivo: "Compromisso familiar",
      status: "Aguardando aceite",
    },
  ]);

  const adicionarFuncionario = (funcionario: Funcionario) => {
    setFuncionarios((prev) => [funcionario, ...prev]);
  };

  const editarFuncionario = (funcionarioAtualizado: Funcionario) => {
    setFuncionarios((prev) =>
      prev.map((f) => (f.id === funcionarioAtualizado.id ? funcionarioAtualizado : f))
    );
  };

  const removerFuncionario = (id: string) => {
    setFuncionarios((prev) => prev.filter((f) => f.id !== id));
    setEscalas((prev) => prev.filter((e) => e.funcionarioId !== id));
    setTrocas((prev) =>
      prev.filter((t) => t.solicitanteId !== id && t.destinatarioId !== id)
    );
  };

  const existeDuplicidade = (novaEscala: Escala, ignorarId?: string) => {
    return escalas.some((e) => {
      if (ignorarId && e.id === ignorarId) return false;

      const mesmoFuncionario = e.funcionarioId === novaEscala.funcionarioId;
      const mesmaData = normalizarTexto(e.data) === normalizarTexto(novaEscala.data);
      const mesmoTurno = normalizarTexto(e.turno) === normalizarTexto(novaEscala.turno);

      return mesmoFuncionario && mesmaData && mesmoTurno;
    });
  };

  const adicionarEscala = (escala: Escala) => {
    if (existeDuplicidade(escala)) {
      return {
        ok: false,
        mensagem: "Já existe uma escala para esse funcionário nessa mesma data e turno.",
      };
    }

    setEscalas((prev) => [escala, ...prev]);
    return { ok: true };
  };

  const editarEscala = (escalaAtualizada: Escala) => {
    if (existeDuplicidade(escalaAtualizada, escalaAtualizada.id)) {
      return {
        ok: false,
        mensagem: "Já existe uma escala para esse funcionário nessa mesma data e turno.",
      };
    }

    setEscalas((prev) =>
      prev.map((e) => (e.id === escalaAtualizada.id ? escalaAtualizada : e))
    );
    return { ok: true };
  };

  const removerEscala = (id: string) => {
    setEscalas((prev) => prev.filter((escala) => escala.id !== id));
  };

  const solicitarTroca = (troca: Omit<Troca, "id" | "status">) => {
    if (
      !troca.solicitanteId ||
      !troca.destinatarioId ||
      !troca.data ||
      !troca.turno ||
      !troca.motivo
    ) {
      return { ok: false, mensagem: "Preencha todos os campos da solicitação." };
    }

    if (troca.solicitanteId === troca.destinatarioId) {
      return { ok: false, mensagem: "O solicitante não pode trocar com ele mesmo." };
    }

    const novaTroca: Troca = {
      id: Date.now().toString(),
      ...troca,
      status: "Aguardando aceite",
    };

    setTrocas((prev) => [novaTroca, ...prev]);
    return { ok: true };
  };

  const aceitarTroca = (id: string) => {
    setTrocas((prev) =>
      prev.map((troca) =>
        troca.id === id ? { ...troca, status: "Aceita pelo colega" } : troca
      )
    );
  };

  const recusarTroca = (id: string) => {
    setTrocas((prev) =>
      prev.map((troca) =>
        troca.id === id ? { ...troca, status: "Recusada pelo colega" } : troca
      )
    );
  };

  const aprovarTroca = (id: string) => {
    const troca = trocas.find((t) => t.id === id);

    if (!troca) {
      return { ok: false, mensagem: "Troca não encontrada." };
    }

    if (troca.status !== "Aceita pelo colega") {
      return { ok: false, mensagem: "A troca precisa ser aceita pelo colega primeiro." };
    }

    setTrocas((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Aprovada pela coordenação" } : item
      )
    );

    return { ok: true };
  };

  const rejeitarTroca = (id: string) => {
    setTrocas((prev) =>
      prev.map((troca) =>
        troca.id === id ? { ...troca, status: "Rejeitada pela coordenação" } : troca
      )
    );
  };

  return (
    <AppDataContext.Provider
      value={{
        funcionarios,
        adicionarFuncionario,
        editarFuncionario,
        removerFuncionario,
        escalas,
        adicionarEscala,
        editarEscala,
        removerEscala,
        escalaEmEdicao,
        setEscalaEmEdicao,
        trocas,
        solicitarTroca,
        aceitarTroca,
        recusarTroca,
        aprovarTroca,
        rejeitarTroca,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData deve ser usado dentro de AppProvider");
  }
  return context;
}

export function precisaDeCoren(cargo: string) {
  return cargosComCoren.includes(cargo.trim().toLowerCase());
}
