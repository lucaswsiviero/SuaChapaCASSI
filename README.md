# SuaChapaCASSI

Ferramenta independente de auxílio à decisão para as **Eleições CASSI 2026** (votação de 13 a 23/03/2026).

> Esta ferramenta não possui vínculo com nenhuma das chapas candidatas, com o Banco do Brasil ou com a CASSI.

---

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **better-sqlite3** — banco de dados local (sem servidor)
- **NextAuth.js** — autenticação admin via Google OAuth
- **Recharts** — gráficos no painel admin

---

## Instalação

### 1. Pré-requisitos

- Node.js ≥ 18
- npm ≥ 9

### 2. Clonar e instalar

```bash
git clone https://github.com/seu-usuario/suachapacassi.git
cd suachapacassi
npm install
```

### 3. Variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` com os valores reais (veja a próxima seção).

### 4. Executar em desenvolvimento

```bash
npm run dev
```

Acesse http://localhost:3000

---

## Configurar o Google OAuth

1. Acesse o [Google Cloud Console](https://console.cloud.google.com)
2. Crie um projeto (ou selecione um existente)
3. Vá em **APIs e Serviços → Credenciais**
4. Clique em **Criar credenciais → ID do cliente OAuth 2.0**
5. Tipo de aplicativo: **Aplicativo da Web**
6. Adicione as origens autorizadas:
   - `http://localhost:3000` (desenvolvimento)
   - `https://suachapacassi.com.br` (produção)
7. Adicione os URIs de redirecionamento autorizados:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://suachapacassi.com.br/api/auth/callback/google`
8. Copie o **Client ID** e **Client Secret** para o `.env.local`

### Gerar o NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

### Definir admins

No `.env.local`, adicione os e-mails Gmail autorizados:

```
ADMIN_EMAILS=voce@gmail.com,colega@gmail.com
```

---

## Deploy em VPS (Ubuntu/Debian)

> **Porta 3001** — a porta 3000 está reservada para outro projeto no servidor.

### 1. Clone e configure

```bash
cd /var/www
git clone https://github.com/lucaswsiviero/SuaChapaCASSI.git
cd SuaChapaCASSI
cp .env.example .env.local
nano .env.local   # preenche GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET, ADMIN_EMAILS, NEXTAUTH_URL
```

### 2. Build

```bash
npm install && npm run build
```

### 3. PM2 via ecosystem.config.js

O projeto já inclui o arquivo `ecosystem.config.js` configurado para a porta 3001.

```bash
# Primeira vez
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # gera o comando systemd — execute o comando que ele imprimir

# Atualizações futuras
git pull origin main && npm install && npm run build && pm2 reload ecosystem.config.js
```

### 4. Nginx (proxy reverso)

```nginx
server {
    listen 80;
    server_name suachapacassi.com.br;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. SSL com Certbot

```bash
sudo certbot --nginx -d suachapacassi.com.br
```

### 6. Atualizar (git pull + rebuild)

```bash
cd /var/www/SuaChapaCASSI
git pull origin main && npm install && npm run build && pm2 reload ecosystem.config.js
```

---

## Primeiro login no admin

1. Acesse `/admin`
2. Clique em **Entrar com Google**
3. Faça login com um e-mail que esteja na lista `ADMIN_EMAILS`
4. Você será redirecionado para o painel com os gráficos e a tabela de resultados

---

## Estrutura de arquivos

```
/app
  /page.tsx                   landing page
  /quiz/page.tsx              questionário (20 perguntas)
  /resultado/page.tsx         tela de resultado
  /admin/page.tsx             painel admin
  /api/results/route.ts       POST salvar resultado anônimo
  /api/admin/stats/route.ts   GET métricas agregadas
  /api/admin/results/route.ts GET resultados paginados
  /api/admin/export/route.ts  GET exportar CSV
  /api/auth/[...nextauth]/    NextAuth.js handler

/components
  /quiz/QuizCard.tsx          card de pergunta
  /quiz/ProgressBar.tsx       barra de progresso
  /resultado/ScoreChart.tsx   gráfico de barras horizontais
  /resultado/ShareButtons.tsx botões WhatsApp
  /admin/StatsCards.tsx       cards de KPIs
  /admin/Charts.tsx           gráficos Recharts
  Countdown.tsx               contador regressivo
  DisclaimerBanner.tsx        aviso de independência
  Footer.tsx                  rodapé
  SessionProvider.tsx         wrapper do NextAuth

/lib
  questions.ts                20 perguntas com tags
  scoring.ts                  lógica de pontuação por chapa
  db.ts                       conexão SQLite + helpers

/data
  cassi.db                    banco SQLite (gerado automaticamente)
```

---

## Privacidade

- **Nenhum dado pessoal é coletado.** O session_id é um UUID aleatório gerado no navegador.
- Apenas respostas anônimas, tags e scores são persistidos.
- O banco de dados SQLite fica local no servidor, sem envio para terceiros.

---

## Licença

MIT
