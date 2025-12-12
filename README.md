# Z-Contas (PWA)

Aplicativo web mobile-first para controle financeiro pessoal e da pequena loja, focado em acessibilidade.

## Stack
- React 19.2.1 + TypeScript + Vite
- TailwindCSS
- Firebase Auth + Cloud Firestore (modular)
- PWA com `vite-plugin-pwa`

## Configuração
1. Copie `.env.example` para `.env` e preencha com as variáveis do Firebase.
2. Instale dependências: `npm ci`.
3. Dev: `npm run dev` (com `VITE_USE_EMULATOR=true` para usar emuladores).

## Emuladores Firebase
Inicie: `firebase emulators:start --only firestore,auth`.

Para criar o usuário no emulador, use Firebase CLI `auth:import` ou um script com Admin SDK. Em produção, utilize um script Admin fora do cliente para criar `zilma@app.com`.

## Deploy (GitHub Pages)
Configurar `Secrets` no repositório com as variáveis `VITE_FIREBASE_*`. O workflow publica em `gh-pages`. Acesse: `https://JonnathanRiquelmo.github.io/z-contas.app/`.

## Regras Firestore
Veja `firebase/firestore.rules`. Apenas o UID autenticado acessa seus dados, exigindo `ownerUid` igual ao `request.auth.uid`.

## Testes
- Unit e integração com `vitest`.
- E2E com `playwright`, incluindo cenários offline→online.

## Licença
MIT.
