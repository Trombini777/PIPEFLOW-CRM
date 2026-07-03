export type Workspace = {
  id: string;
  name: string;
  slug: string;
  plan: "free" | "pro";
};

export const mockWorkspaces: Workspace[] = [
  { id: "1", name: "Acme Inc.", slug: "acme", plan: "pro" },
  { id: "2", name: "Estúdio Nova", slug: "estudio-nova", plan: "free" },
  { id: "3", name: "TechFlow Soluções", slug: "techflow", plan: "free" },
];

export type MockUser = {
  name: string;
  email: string;
  initials: string;
};

export const mockUser: MockUser = {
  name: "Eliezer Trombini",
  email: "eliezertrombini@gmail.com",
  initials: "ET",
};

export type LeadStatus =
  | "novo"
  | "contatado"
  | "qualificado"
  | "convertido"
  | "perdido";

export const leadStatusOptions: { value: LeadStatus; label: string }[] = [
  { value: "novo", label: "Novo" },
  { value: "contatado", label: "Contatado" },
  { value: "qualificado", label: "Qualificado" },
  { value: "convertido", label: "Convertido" },
  { value: "perdido", label: "Perdido" },
];

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  status: LeadStatus;
  owner: string;
  createdAt: string;
};

export const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Mariana Silva",
    email: "mariana.silva@grupoalfa.com.br",
    phone: "(11) 98765-4321",
    company: "Grupo Alfa Construções",
    role: "Gerente de Compras",
    status: "novo",
    owner: "Eliezer Trombini",
    createdAt: "2026-06-28",
  },
  {
    id: "2",
    name: "Carlos Eduardo Souza",
    email: "carlos.souza@technordeste.com.br",
    phone: "(81) 99123-4567",
    company: "TechNordeste Soluções",
    role: "Diretor de TI",
    status: "contatado",
    owner: "Ana Souza",
    createdAt: "2026-06-20",
  },
  {
    id: "3",
    name: "Fernanda Oliveira",
    email: "fernanda@paodourado.com.br",
    phone: "(21) 98877-6655",
    company: "Padaria Pão Dourado",
    role: "Proprietária",
    status: "qualificado",
    owner: "Pedro Lima",
    createdAt: "2026-06-15",
  },
  {
    id: "4",
    name: "Roberto Lima",
    email: "roberto.lima@autopecaslima.com.br",
    phone: "(31) 99456-7890",
    company: "Auto Peças Lima & Filhos",
    role: "Sócio-Diretor",
    status: "novo",
    owner: "Eliezer Trombini",
    createdAt: "2026-06-30",
  },
  {
    id: "5",
    name: "Juliana Costa",
    email: "juliana.costa@clinicavitalis.com.br",
    phone: "(11) 97788-2233",
    company: "Clínica Vitalis",
    role: "Administradora",
    status: "convertido",
    owner: "Ana Souza",
    createdAt: "2026-05-30",
  },
  {
    id: "6",
    name: "André Pereira",
    email: "andre.pereira@distsantafe.com.br",
    phone: "(51) 99321-6540",
    company: "Distribuidora Santa Fé",
    role: "Gerente Comercial",
    status: "perdido",
    owner: "Pedro Lima",
    createdAt: "2026-06-02",
  },
  {
    id: "7",
    name: "Camila Rodrigues",
    email: "camila@estudionuvem.com.br",
    phone: "(41) 98654-1237",
    company: "Estúdio Criativo Nuvem",
    role: "Fundadora",
    status: "contatado",
    owner: "Eliezer Trombini",
    createdAt: "2026-06-24",
  },
  {
    id: "8",
    name: "Bruno Almeida",
    email: "bruno.almeida@rotasul.com.br",
    phone: "(48) 99887-1122",
    company: "Transportadora Rota Sul",
    role: "Coordenador Logístico",
    status: "qualificado",
    owner: "Ana Souza",
    createdAt: "2026-06-10",
  },
  {
    id: "9",
    name: "Patrícia Fernandes",
    email: "patricia.fernandes@sabermais.edu.br",
    phone: "(85) 98123-4455",
    company: "Escola Saber Mais",
    role: "Diretora Pedagógica",
    status: "novo",
    owner: "Pedro Lima",
    createdAt: "2026-07-01",
  },
  {
    id: "10",
    name: "Lucas Martins",
    email: "lucas.martins@martinscont.com.br",
    phone: "(19) 99765-8899",
    company: "Martins Contabilidade",
    role: "Contador Responsável",
    status: "contatado",
    owner: "Eliezer Trombini",
    createdAt: "2026-06-18",
  },
  {
    id: "11",
    name: "Aline Barbosa",
    email: "aline.barbosa@modaencanto.com.br",
    phone: "(71) 98456-7723",
    company: "Loja Moda Encanto",
    role: "Gerente de Vendas",
    status: "qualificado",
    owner: "Ana Souza",
    createdAt: "2026-06-08",
  },
  {
    id: "12",
    name: "Diego Santos",
    email: "diego.santos@santosengenharia.com.br",
    phone: "(62) 99234-5566",
    company: "Santos Engenharia",
    role: "Engenheiro Civil Sênior",
    status: "novo",
    owner: "Pedro Lima",
    createdAt: "2026-06-29",
  },
  {
    id: "13",
    name: "Renata Alves",
    email: "renata.alves@vidasaudavel.com.br",
    phone: "(27) 98345-2299",
    company: "Farmácia Vida Saudável",
    role: "Farmacêutica Responsável",
    status: "convertido",
    owner: "Eliezer Trombini",
    createdAt: "2026-05-22",
  },
  {
    id: "14",
    name: "Gustavo Ribeiro",
    email: "gustavo.ribeiro@ribeiroimoveis.com.br",
    phone: "(11) 99678-3344",
    company: "Ribeiro Imóveis",
    role: "Corretor Sênior",
    status: "perdido",
    owner: "Ana Souza",
    createdAt: "2026-06-05",
  },
];

export type ActivityType = "ligacao" | "email" | "reuniao" | "nota";

export const activityTypeLabels: Record<ActivityType, string> = {
  ligacao: "Ligação",
  email: "E-mail",
  reuniao: "Reunião",
  nota: "Nota",
};

export type Activity = {
  id: string;
  leadId: string;
  type: ActivityType;
  author: string;
  description: string;
  date: string;
};

export const mockActivities: Activity[] = [
  {
    id: "a1",
    leadId: "1",
    type: "nota",
    author: "Eliezer Trombini",
    description: "Lead veio de indicação de um cliente atual. Ainda não contatado.",
    date: "2026-06-28T14:00:00",
  },
  {
    id: "a2",
    leadId: "2",
    type: "ligacao",
    author: "Ana Souza",
    description: "Primeira ligação de apresentação. Demonstrou interesse em conhecer o produto.",
    date: "2026-06-20T09:30:00",
  },
  {
    id: "a3",
    leadId: "2",
    type: "email",
    author: "Ana Souza",
    description: "Envio de material institucional e proposta comercial inicial.",
    date: "2026-06-22T11:15:00",
  },
  {
    id: "a4",
    leadId: "3",
    type: "ligacao",
    author: "Pedro Lima",
    description: "Conversa sobre volume de vendas e necessidade de controle de clientes.",
    date: "2026-06-15T10:00:00",
  },
  {
    id: "a5",
    leadId: "3",
    type: "reuniao",
    author: "Pedro Lima",
    description: "Demonstração do produto via videochamada. Lead qualificado para proposta.",
    date: "2026-06-18T15:30:00",
  },
  {
    id: "a6",
    leadId: "3",
    type: "nota",
    author: "Pedro Lima",
    description: "Aguardando aprovação do orçamento com o sócio antes de fechar.",
    date: "2026-06-19T16:45:00",
  },
  {
    id: "a7",
    leadId: "4",
    type: "nota",
    author: "Eliezer Trombini",
    description: "Cadastro criado a partir de formulário da landing page.",
    date: "2026-06-30T08:20:00",
  },
  {
    id: "a8",
    leadId: "5",
    type: "ligacao",
    author: "Ana Souza",
    description: "Primeiro contato para entender processo atual de agendamento.",
    date: "2026-05-30T13:00:00",
  },
  {
    id: "a9",
    leadId: "5",
    type: "reuniao",
    author: "Ana Souza",
    description: "Apresentação completa do CRM para a equipe administrativa da clínica.",
    date: "2026-06-05T14:00:00",
  },
  {
    id: "a10",
    leadId: "5",
    type: "email",
    author: "Ana Souza",
    description: "Envio do contrato de assinatura do plano Pro.",
    date: "2026-06-10T09:00:00",
  },
  {
    id: "a11",
    leadId: "5",
    type: "nota",
    author: "Ana Souza",
    description: "Contrato assinado. Cliente convertido com sucesso.",
    date: "2026-06-12T17:00:00",
  },
  {
    id: "a12",
    leadId: "6",
    type: "ligacao",
    author: "Pedro Lima",
    description: "Contato inicial. Empresa já utiliza outra ferramenta e não demonstrou interesse.",
    date: "2026-06-02T11:00:00",
  },
  {
    id: "a13",
    leadId: "6",
    type: "nota",
    author: "Pedro Lima",
    description: "Lead perdido: optaram por renovar contrato com concorrente.",
    date: "2026-06-04T10:30:00",
  },
  {
    id: "a14",
    leadId: "7",
    type: "email",
    author: "Eliezer Trombini",
    description: "Contato via formulário do site. Envio de e-mail de boas-vindas.",
    date: "2026-06-24T09:00:00",
  },
  {
    id: "a15",
    leadId: "7",
    type: "ligacao",
    author: "Eliezer Trombini",
    description: "Ligação de follow-up para agendar demonstração.",
    date: "2026-06-26T15:00:00",
  },
  {
    id: "a16",
    leadId: "8",
    type: "reuniao",
    author: "Ana Souza",
    description: "Reunião para entender fluxo logístico e pontos de dor da operação.",
    date: "2026-06-10T10:00:00",
  },
  {
    id: "a17",
    leadId: "8",
    type: "nota",
    author: "Ana Souza",
    description: "Boa aderência ao produto. Preparando proposta comercial.",
    date: "2026-06-11T16:00:00",
  },
  {
    id: "a18",
    leadId: "9",
    type: "nota",
    author: "Pedro Lima",
    description: "Lead cadastrado manualmente após contato em evento do setor educacional.",
    date: "2026-07-01T12:00:00",
  },
  {
    id: "a19",
    leadId: "10",
    type: "ligacao",
    author: "Eliezer Trombini",
    description: "Primeiro contato. Escritório de contabilidade busca organizar carteira de clientes.",
    date: "2026-06-18T09:45:00",
  },
  {
    id: "a20",
    leadId: "10",
    type: "email",
    author: "Eliezer Trombini",
    description: "Envio de comparativo de planos Free e Pro.",
    date: "2026-06-19T14:20:00",
  },
  {
    id: "a21",
    leadId: "11",
    type: "ligacao",
    author: "Ana Souza",
    description: "Contato inicial sobre gestão de clientes da loja.",
    date: "2026-06-08T11:30:00",
  },
  {
    id: "a22",
    leadId: "11",
    type: "reuniao",
    author: "Ana Souza",
    description: "Demonstração do pipeline Kanban. Lead qualificado como oportunidade.",
    date: "2026-06-13T15:00:00",
  },
  {
    id: "a23",
    leadId: "12",
    type: "nota",
    author: "Pedro Lima",
    description: "Lead veio de indicação de outro cliente da construtora.",
    date: "2026-06-29T17:10:00",
  },
  {
    id: "a24",
    leadId: "13",
    type: "ligacao",
    author: "Eliezer Trombini",
    description: "Primeiro contato para entender rotina de atendimento da farmácia.",
    date: "2026-05-22T09:00:00",
  },
  {
    id: "a25",
    leadId: "13",
    type: "reuniao",
    author: "Eliezer Trombini",
    description: "Demonstração completa. Farmácia decidiu contratar o plano Free.",
    date: "2026-05-27T14:00:00",
  },
  {
    id: "a26",
    leadId: "13",
    type: "email",
    author: "Eliezer Trombini",
    description: "Confirmação de cadastro do workspace e envio de material de onboarding.",
    date: "2026-05-29T10:00:00",
  },
  {
    id: "a27",
    leadId: "14",
    type: "ligacao",
    author: "Ana Souza",
    description: "Contato inicial. Corretor avaliando outras opções de CRM imobiliário.",
    date: "2026-06-05T13:00:00",
  },
  {
    id: "a28",
    leadId: "14",
    type: "nota",
    author: "Ana Souza",
    description: "Lead perdido: optou por ferramenta especializada em imóveis.",
    date: "2026-06-09T11:00:00",
  },
];
