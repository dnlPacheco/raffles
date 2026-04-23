# Plano de Melhorias — Raffles App

## Contexto

O Raffles App é uma ferramenta para sortear equipes aleatórias. O código funciona, mas tem bugs críticos (validação ausente do select de equipes e de participantes insuficientes), alerts obsoletos, output sem estilo e o título inserido pelo usuário nunca é exibido. Este plano corrige todos esses problemas mantendo a stack HTML + CSS + JS puro.

---

## Arquivos críticos

- `index.html`
- `script.js`
- `style.css`

---

## Mudanças por arquivo

### index.html
1. Corrigir `<input ... id="title"></input>` → `<input ... id="title">` (void element válido)
2. Adicionar `<span class="field-error" id="error-title"></span>` após o input de título
3. Adicionar `<span class="field-error" id="error-participants"></span>` após o textarea
4. Adicionar `<span class="field-error" id="error-quantity"></span>` após o select

### script.js
1. **Remover** todos os `console.log` (linhas 36, 41, 49, 55)
2. **Mover** a função `shuffle` para fora do handler de submit (escopo de módulo)
3. **Adicionar** seletores dos spans de erro no topo:
   ```js
   const errorTitle = document.querySelector("#error-title");
   const errorParticipants = document.querySelector("#error-participants");
   const errorQuantity = document.querySelector("#error-quantity");
   ```
4. **Adicionar** funções utilitárias de erro:
   ```js
   function setFieldError(span, input, msg) { ... }
   function clearFieldError(span, input) { ... }
   function clearAllErrors() { ... }
   ```
5. **Substituir** os `alert()` por validações inline no handler, incluindo:
   - Validar título vazio
   - Validar participantes vazio
   - **Validar select vazio** (bug crítico — causa NaN)
   - **Validar participantes < número de equipes** (TODO existente no código)
   - Usar `parseInt(quantity.value, 10)` em vez de string direta
   - Remover optional chaining desnecessário (`teams[teamIndex]?.players`)
6. **Adicionar** listener de `reset` para limpar `#raffles-output` e erros inline
7. **Refatorar** `displayRafflesOutput(gameTitle, teams)`:
   - Receber e exibir o título do jogo como `<h2 class="output-title">`
   - Exibir contagem de jogadores por time: `"N jogador(es)"`
   - Estrutura: `teams-grid > .team > .team-header (.team-name + .team-count) + .team-players > li`
8. **Adicionar** `rafflesOutput.scrollIntoView({ behavior: "smooth" })` após renderizar
9. **Remover** bloco de comentário com nomes de teste (linhas 90–99)

### style.css
1. **Adicionar** estilos de erro inline:
   ```css
   .field-error { display: block; color: #d32f2f; font-size: 0.8rem; margin-top: 0.25rem; min-height: 1rem; }
   .input-error { border-color: #d32f2f !important; }
   ```
2. **Adicionar** estilo do output:
   ```css
   #raffles-output { margin-top: 2rem; padding-bottom: 1.5rem; }
   .output-title { text-align: center; color: #7a5cfa; border-bottom: 2px solid #e3d9ff; ... }
   ```
3. **Adicionar** grid responsivo de times:
   ```css
   .teams-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr)); gap: 1rem; }
   ```
4. **Adicionar** card de time (`.team`, `.team-header`, `.team-name`, `.team-count`, `.team-players li`)

---

## Verificação

Após implementar, testar manualmente:

| Cenário | Resultado esperado |
|---|---|
| Submeter sem título | Erro inline no campo título |
| Submeter sem participantes | Erro inline no textarea |
| Submeter sem selecionar equipes | Erro inline no select |
| 2 participantes, 4 equipes | Erro inline no textarea |
| Corrigir erro e resubmeter | Erros anteriores somem |
| Sortear com dados válidos | Output com título, times em grid, contagem por time |
| Clicar Limpar | Form e output limpos |
| Scroll automático | Página rola até os resultados |
