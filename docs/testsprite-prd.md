# PRD de Testes — Z-Contas

## Objetivo
Validar os fluxos críticos do app Z-Contas (web) com cobertura end-to-end e cenários offline, garantindo CRUD completo de transações e relatórios por período, no modo escuro moderno.

## Base URL
http://localhost:4173/z-contas.app/

## Requisitos Funcionais
1. Autenticação
   - Acessar `/login`, preencher e submeter credenciais.
   - Com `VITE_E2E_BYPASS_AUTH=true`, deve logar sem validação real.

2. Transações — Criar
   - Navegar até `/transactions`.
   - Criar transação de `entrada` e `saida` com valor decimal e data.
   - Validar status "Registrado" ou fallback offline (enfileirar).

3. Transações — Listar/Editar/Excluir
   - Navegar até `/transactions/list`.
   - Filtrar por `tipo` (entrada/saida/todas) e `categoria`.
   - Editar um item (valor, data, categoria, conta, responsável); salvar e validar persistência.
   - Excluir um item e validar remoção.
   - Paginação: botão "Carregar mais" utilizando cursor por `date` desc.

4. Offline Queue
   - Simular indisponibilidade de rede ao criar/editar/excluir.
   - Validar banner `Offline` e enfileiramento.
   - Reconectar e validar aplicação da fila (`processAll`).

5. Relatórios
   - Navegar até `/reports`.
   - Definir período e validar somatório de gastos e gráfico.
   - Exportar CSV e PDF.

## Restrições de UI
- Modo escuro por padrão: botões secundários `bg-neutral-800 text-neutral-100`, inputs `border-neutral-700 bg-neutral-900`.
- Colunas de listagem: Data, Categoria, Tipo, Valor, Ações.

## Dados e Contratos
- Transação inclui: `date` (timestamp), `amount` (negativo para `saida`), `type`, `category`, `accountId`, `responsible`, `ownerUid`.
- Listagem ordenada por `date desc`; paginação via cursor de `date`.

## Ambiente
- `VITE_E2E_BYPASS_AUTH=true` para fluxos de teste sem credenciais.
- Opcional: `VITE_USE_EMULATOR=true` para Firestore/Auth local.

## Critérios de Aceite
- Fluxos CRUD e relatórios executam sem erros.
- Offline queue enfileira e aplica operações após reconexão.
- UI renderiza corretamente em modo escuro.
