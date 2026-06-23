# Agent Skills

Skills de agente para workflow de desenvolvimento — rastreamento de tarefas, specs, planos, handoff e documentação. Compatível com o ecossistema [skills.sh](https://www.skills.sh/) e o CLI [`npx skills`](https://github.com/vercel-labs/skills).

## Pré-requisitos

| Requisito                                             | Por quê                                               |
| ----------------------------------------------------- | ----------------------------------------------------- |
| [Node.js](https://nodejs.org/) 18+                    | O CLI `npx skills` roda via Node                      |
| Um agente compatível (ex. Cursor, Codex, Claude Code) | As skills são instaladas na pasta de skills do agente |

Você **não precisa clonar** este repositório só para usar as skills no seu projeto.

---

## Começar em 2 passos

Trabalhe sempre a partir da **raiz do projeto onde você codifica**, não deste repositório de skills.

### 1. Instale as skills

```bash
cd /caminho/do/seu-projeto

# Todas as skills (recomendado)
npx skills add arcadesunlabs/skills --skill '*' -a <agente> -y

# Ou uma skill específica
npx skills add arcadesunlabs/skills --skill build-feature -a <agente> -y
```

Substitua `<agente>` pelo nome do seu agente (ex.: `cursor`, `codex`, `claude-code`). Para instalar globalmente, adicione `-g`.

Ver o que está disponível sem instalar:

```bash
npx skills add arcadesunlabs/skills --list
```

### 2. Configure o workflow do seu projeto

As skills leem **`skills.config.json` na raiz do seu projeto**. O setup pergunta **como você implementa** (fases ordenadas) e, opcionalmente, qual tracker usar:

```bash
npx github:arcadesunlabs/skills skills-configure .
```

Na primeira pergunta, escolha um **preset de projeto**:

| Preset       | Para quem                                  |
| ------------ | ------------------------------------------ |
| `minimal`    | Qualquer projeto, fluxo enxuto             |
| `single-app` | App único na raiz                          |
| `monorepo`   | Monorepo com `.docs` e `apps/`             |
| `custom`     | Perguntas completas sobre paths e comandos |

Em seguida, o setup pergunta **como você implementa** — isso é independente do preset de projeto acima.

#### Presets de implementação (prontos)

| Preset              | Fases típicas                                             |
| ------------------- | --------------------------------------------------------- |
| `minimal`           | Implementação → testes (opcional) → finalizar docs        |
| `frontend-ui-first` | UI → orquestração → dados → rotas → testes → … → docs     |
| `api-first`         | Dados/API → orquestração → UI → rotas → testes → … → docs |

Escolha um desses se o fluxo já bater com o seu. As fases são gravadas em `implementation.phases` no `skills.config.json`.

#### Fases próprias (`custom`)

**Sim — para definir fases do zero (ou estender as atuais), escolha `custom` na pergunta de preset de implementação.**

O CLI guia fase a fase:

1. Opcionalmente parte das fases já salvas (útil ao reconfigurar).
2. Para cada fase: **nome**, nota curta, se é opcional, se deve rodar por último.
3. Enter em nome vazio encerra a lista.
4. Se não marcar nenhuma fase “sempre por último”, o setup oferece acrescentar **Finalize docs**.

Exemplo de resultado no config:

```json
"implementation": {
  "preset": "custom",
  "phases": [
    { "name": "Schema e migrations", "notes": "Antes de qualquer UI" },
    { "name": "Endpoints", "notes": "REST ou RPC" },
    { "name": "Testes de contrato", "optional": true },
    { "name": "Finalize docs", "alwaysLast": true }
  ]
}
```

Outras formas de ajustar sem o wizard completo:

- **Editar à mão** `skills.config.json` — altere o array `implementation.phases` (ordem = ordem de entrega).
- **Pelo agente** — peça algo como _"Configurar meu workflow de implementação"_; a skill `workflow` pode mapear o fluxo na conversa e atualizar o config.

Preset não-interativo (só preset de **projeto**; a parte de implementação ainda é interativa):

```bash
npx github:arcadesunlabs/skills skills-configure . --preset minimal
```

Para reconfigurar, rode o mesmo comando de novo.

Campos principais: `project`, `docs`, **`implementation.phases`**, `taskTracker` (opcional), `code`. Referência: [skills.config.example.json](./skills.config.example.json).

---

## Use no dia a dia

Peça ao agente em linguagem natural. Exemplos:

| Situação                     | O que pedir                                  | Skill            |
| ---------------------------- | -------------------------------------------- | ---------------- |
| Mapear fluxo de entrega      | _"Configurar meu workflow de implementação"_ | `workflow`       |
| Brainstorm de épico          | _"Brainstorm da feature X"_                  | `design-feature` |
| Escrever spec de produto     | _"Spec da feature login social"_             | `design-feature` |
| Plano técnico antes de codar | _"Plano técnico para esta feature"_          | `build-feature`  |
| Implementar com fases        | _"Implementar seguindo o plano"_             | `build-feature`  |
| Handoff entre sessões        | _"Handoff do que fizemos"_                   | `close-workflow` |
| Fechar docs após entrega     | _"Finalizar documentação da feature"_        | `close-workflow` |

A skill `workflow` carrega `skills.config.json` antes das demais.

### Snippet para o README do seu projeto

```markdown
## Agent workflow

\`\`\`bash
npx skills add arcadesunlabs/skills --skill '\*' -a <agente> -y
npx github:arcadesunlabs/skills skills-configure . --preset minimal
\`\`\`
```

---

## Skills incluídas

| Skill            | Função                                         |
| ---------------- | ---------------------------------------------- |
| `workflow`       | Carrega config e mapeia fases de implementação |
| `design-feature` | Brainstorm, grill, spec de produto             |
| `build-feature`  | Plano e implementação por fases (do config)    |
| `close-workflow` | Handoff e finalização de docs                  |
| `write-skill`    | Criar ou melhorar skills                       |

Tracker externo (Trello, Jira, Linear, GitHub Issues) é **opcional** — configure em `taskTracker` ou use `none`.

Organização no [skills.sh](https://skills.sh/): [skills.sh.json](./skills.sh.json).

---

## Desenvolver ou manter este repositório

```bash
git clone https://github.com/arcadesunlabs/skills.git
cd skills

npm run new -- minha-skill
npm run validate
npm run configure -- /caminho/do/projeto
npm run skills:list
```

### Estrutura

```text
skills/
  nome-da-skill/
    SKILL.md
    references/   # opcional
    scripts/      # opcional
skills.config.example.json
skills.config.example.jira.json
```

---

## Referência rápida — `npx skills`

```bash
npx skills add arcadesunlabs/skills --skill '*' -a <agente> -y
npx skills add arcadesunlabs/skills --skill '*' -a <agente> -g -y
npx github:arcadesunlabs/skills skills-configure . --preset single-app
```

Mais opções: [`vercel-labs/skills`](https://github.com/vercel-labs/skills).
