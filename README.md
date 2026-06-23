# Agent Skills

Skills de agente para workflow de desenvolvimento — rastreamento de tarefas, specs, planos, handoff e documentação. Compatível com o ecossistema [skills.sh](https://www.skills.sh/) e o CLI [`npx skills`](https://github.com/vercel-labs/skills).

## Pré-requisitos

| Requisito                                                                   | Por quê                                               |
| --------------------------------------------------------------------------- | ----------------------------------------------------- |
| [Node.js](https://nodejs.org/) 18+                                          | O CLI `npx skills` roda via Node                      |
| Um agente compatível (ex. [Cursor](https://cursor.com), Codex, Claude Code) | As skills são instaladas na pasta de skills do agente |

Você **não precisa clonar** este repositório só para usar as skills no seu projeto.

---

## Começar em 2 passos

Trabalhe sempre a partir da **raiz do projeto onde você codifica**, não deste repositório de skills.

### 1. Instale as skills

```bash
cd /caminho/do/seu-projeto

# Todas as skills (recomendado)
npx skills add arcadesunlabs/skills --skill '*' -a cursor -y

# Ou uma skill específica
npx skills add arcadesunlabs/skills --skill build-feature -a cursor -y
```

Troque `cursor` pelo seu agente (`codex`, `claude-code`, etc.). Para instalar globalmente, adicione `-g`.

Ver o que está disponível sem instalar:

```bash
npx skills add arcadesunlabs/skills --list
```

### 2. Configure o workflow do seu projeto

As skills leem **`skills.config.json` na raiz do seu projeto**:

```bash
npx github:arcadesunlabs/skills skills-configure .
```

Na primeira pergunta, escolha um **preset**:

| Preset        | Para quem                          |
| ------------- | ---------------------------------- |
| `minimal`     | Qualquer projeto, sem tracker      |
| `single-app`  | App único na raiz                  |
| `monorepo`    | Monorepo com `.docs` e `apps/`     |
| `custom`      | Perguntas completas                |

Preset não-interativo:

```bash
npx github:arcadesunlabs/skills skills-configure . --preset minimal
```

Para reconfigurar, rode o mesmo comando de novo.

Campos principais: `project`, `docs`, `taskTracker`, `code`. Referência: [skills.config.example.json](./skills.config.example.json).

---

## Use no dia a dia

Peça ao agente em linguagem natural. Exemplos:

| Situação                     | O que pedir                          | Skill            |
| ---------------------------- | ------------------------------------ | ---------------- |
| Pegar um card e abrir branch | _"Iniciar tarefa REV-42"_            | `build-feature`  |
| Brainstorm de épico          | _"Brainstorm da feature X"_          | `design-feature` |
| Escrever spec de produto     | _"Spec da feature login social"_     | `design-feature` |
| Plano técnico antes de codar | _"Plano técnico para REV-42"_        | `build-feature`  |
| Handoff entre sessões        | _"Handoff do que fizemos"_           | `close-workflow` |
| Fechar docs após entrega     | _"Finalizar documentação da feature"_ | `close-workflow` |

A skill `workflow` carrega `skills.config.json` antes das demais.

### Snippet para o README do seu projeto

```markdown
## Agent workflow

\`\`\`bash
npx skills add arcadesunlabs/skills --skill '*' -a cursor -y
npx github:arcadesunlabs/skills skills-configure . --preset minimal
\`\`\`
```

---

## Skills incluídas

| Skill            | Função                                      |
| ---------------- | ------------------------------------------- |
| `workflow`       | Carrega ou cria `skills.config.json`        |
| `design-feature` | Brainstorm, grill, spec de produto          |
| `build-feature`  | Card/issue, branch, plano e implementação   |
| `close-workflow` | Handoff e finalização de docs               |
| `write-skill`    | Criar ou melhorar skills                    |

Trackers suportados: **Trello**, **Jira**, Linear, GitHub Issues, ou `none`.

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
npx skills add arcadesunlabs/skills --skill '*' -a cursor -y
npx skills add arcadesunlabs/skills --skill '*' -a cursor -g -y
npx github:arcadesunlabs/skills skills-configure . --preset single-app
```

Mais opções: [`vercel-labs/skills`](https://github.com/vercel-labs/skills).
