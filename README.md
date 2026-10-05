# SYNC — Frontend

**Projeto de Segurança na Medicação do Idoso.**
Interface web do SYNC, um MVP para ajudar idosos a controlar e acompanhar medicamentos de uso contínuo, com apoio de familiares e cuidadores.

> Backend: [sync-api](https://github.com/SamGarciaPereira/sync-api)

---

## Sobre o projeto

Idosos que usam medicamentos diariamente podem ter dificuldades de memória, visão, organização da rotina ou uso de tecnologias complexas. O SYNC busca organizar essa rotina de forma simples:

- Cada medicamento é associado a horários e dosagens específicos.
- No horário programado, o sistema emite um alerta visual e/ou sonoro.
- O idoso registra a dose (check-in), gerando um histórico consultável.
- Familiares e cuidadores acompanham a rotina sem precisar ligar para confirmar.
- O controle básico de estoque avisa quando um medicamento está próximo de acabar.

### Objetivos

- Reduzir esquecimentos de horários e dúvidas sobre doses já tomadas.
- Facilitar a identificação do medicamento correto.
- Aumentar a autonomia do idoso na rotina de medicação.
- Facilitar o acompanhamento por familiares e cuidadores e a comunicação entre responsáveis.
- Auxiliar no controle de estoque.
- Oferecer uma solução simples, acessível e fácil de usar.

### Limites do escopo

- Não é um sistema médico: **não diagnostica, não prescreve e não altera dosagens**.
- O sistema registra a **confirmação ou retirada da dose**; isso não comprova que o medicamento foi ingerido.
- O botão de SOS não substitui serviços públicos de emergência.

---

## Funcionalidades planejadas

As funcionalidades abaixo vêm das 30 user stories do documento da equipe. Hoje o repositório contém apenas a base da aplicação (veja [Estado atual](#estado-atual)).

| Área | User stories |
| --- | --- |
| Perfis e acesso | Cadastro do idoso (US08) e de cuidadores (US01), login (US22), controle de acesso por perfil (US23) |
| Medicamentos | Cadastro (US02), horários (US03), dosagem (US04), alertas (US05), medicação condicional/"se necessário" (US18) |
| Estoque | Configuração de estoque (US07), alertas de estoque baixo (US30), integração com API de compra (US29) |
| Acompanhamento | Dashboard de medicamentos (US06), check-in diário (US11), histórico (US09), relatório semanal (US10), exportação em PDF (US24) |
| Saúde | Glicose (US12), pressão arterial (US13), temperatura (US14), oxigenação (US15), frequência respiratória (US16), alergias (US17), dashboard de saúde (US19) |
| IA | Consulta e resumo de registros (US20), entrada por voz (US21) |
| Emergência | Botão de SOS (US25), contatos de emergência (US26) |
| Integrações | E-mail (US27), WhatsApp (US28) |

### Requisitos não funcionais

- **Usabilidade:** interface do idoso simples, com poucos passos.
- **Acessibilidade visual:** textos e botões grandes, bom contraste.
- **Confiabilidade:** horários e registros preservados após reinicialização.
- **Segurança:** apenas usuários autorizados acessam os dados do idoso.
- **Disponibilidade:** lembretes e identificação da medicação funcionam mesmo sem acompanhamento remoto.

---

## Estado atual

Base do frontend integrada ao backend:

| Rota | Página | Descrição |
| --- | --- | --- |
| `/` | Home | Página inicial com atalhos |
| `/users` | Users | Lista (`GET /users`) e cadastra (`POST /users`) usuários |
| `/status` | Status | Health check do backend (`GET /status`) |
| `*` | NotFound | Página 404 |

---

## Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- [lucide-react](https://lucide.dev/) (ícones)
- ESLint

## Estrutura do projeto

```
sync-frontend/
├── public/               # favicon e ícones estáticos
├── src/
│   ├── components/       # Header, Footer
│   ├── pages/            # Home, Users, Status, NotFound
│   ├── services/api.ts   # instância do Axios (baseURL via VITE_API_URL)
│   ├── App.tsx           # roteamento
│   └── main.tsx          # ponto de entrada
├── .env.example          # variáveis de ambiente de exemplo
├── vite.config.ts
└── package.json
```

---

## Como rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS recente) e npm
- Backend [sync-api](https://github.com/SamGarciaPereira/sync-api) em execução (por padrão em `http://localhost:3001`)

### Passos

```bash
# 1. instalar dependências
npm install

# 2. configurar variáveis de ambiente
cp .env.example .env

# 3. iniciar em modo desenvolvimento
npm run dev
```

### Variáveis de ambiente

| Variável | Descrição | Padrão |
| --- | --- | --- |
| `VITE_API_URL` | URL base da API do backend | `http://localhost:3001/api` |

### Scripts

| Comando | Ação |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento (Vite) |
| `npm run build` | Checagem de tipos (`tsc -b`) e build de produção |
| `npm run preview` | Serve localmente o build de produção |
| `npm run lint` | Executa o ESLint |

---

## Links do projeto

- Frontend: <https://github.com/SamGarciaPereira/sync-frontend>
- Backend: <https://github.com/SamGarciaPereira/sync-api>
- Prototipação de baixa fidelidade: <https://github.com/PedroVol/Prototipacao_Baixa_Fidelidade>
- Requisitos funcionais (protótipos): <https://github.com/PedroVol/Requisitos_Funcionais_SYNC>
- Trello: quadro compartilhado da equipe (acesso por convite)

## Equipe

- Abilio Pedro
- Beatriz Cunha
- Enzo Ceron
- Pedro Muller
- Samuel Garcia
