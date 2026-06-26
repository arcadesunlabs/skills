# Personal Agent Skills

Skills de agente para workflow de desenvolvimento — specs, planos, handoff e documentação. Compatível com o ecossistema [skills.sh](https://www.skills.sh/) e o CLI [`npx skills`](https://github.com/vercel-labs/skills).

## Pré-requisitos

| Requisito                                                                   | Por quê                                               |
| --------------------------------------------------------------------------- | ----------------------------------------------------- |
| [Node.js](https://nodejs.org/) 18+                                          | O CLI `npx skills` roda via Node                      |
| Um agente compatível (ex. [Cursor](https://cursor.com), Codex, Claude Code) | As skills são instaladas na pasta de skills do agente |

Você **não precisa clonar** este repositório só para usar as skills no seu projeto.

---

## Começar em 3 passos

Trabalhe sempre a partir da **raiz do projeto onde você codifica** (ex. seu monorepo ou app), não deste repositório de skills.

### 1. Instale as skills

```bash
cd /caminho/do/seu-projeto

# Todas as skills (recomendado)
npx skills add reveliotec/skills --skill '*' -a cursor -y

# Ou uma skill específica
npx skills add reveliotec/skills --skill write-plan -a cursor -y
```

Troque `cursor` pelo seu agente (`codex`, `claude-code`, etc.). Para instalar globalmente em vez de no projeto, adicione `-g`.

Ver o que está disponível sem instalar:

```bash
npx skills add reveliotec/skills --list
```

### 2. Configure o workflow do seu projeto

As skills de workflow leem **`skills.config.json` na raiz do seu projeto**. **Não precisa clonar** este repositório — rode o assistente interativo via `npx`:

```bash
npx github:reveliotec/skills skills-configure /caminho/do/seu-projeto
```

Responda às perguntas (Enter aceita o valor padrão). O arquivo é criado em `/caminho/do/seu-projeto/skills.config.json`.

Para reconfigurar depois, rode o mesmo comando de novo.

Se você já clonou este repo:

```bash
npm --prefix skills run configure -- /caminho/do/seu-projeto
```

Campos principais: `project`, `docs`, `code`. Referência: [skills.config.example.json](./skills.config.example.json).

Recomendado: criar `{docs.root}/codebase/architecture.md` com visão de stack, camadas e decisões arquiteturais — as skills `mode-brainstorm` e `write-plan` leem esse arquivo quando existir.

### 3. Use no dia a dia

Peça ao agente em linguagem natural. Ele escolhe a skill pelo `description` do `SKILL.md`. Exemplos:

| Situação                     | O que pedir                                                   |
| ---------------------------- | ------------------------------------------------------------- |
| Brainstorm de épico          | _"Brainstorm da feature X"_ → `mode-brainstorm`               |
| Escrever spec de produto     | _"Spec da feature login social"_ → `write-feature-spec`       |
| Plano técnico antes de codar | _"Plano técnico para login social"_ → `write-plan`            |
| Handoff entre sessões        | _"Handoff do que fizemos"_ → `write-handoff`                  |

A skill `workflow-config` é o ponto de entrada: o agente deve carregar `skills.config.json` antes das demais skills de workflow.

---

## Skills incluídas

| Skill                 | Função                                     |
| --------------------- | ------------------------------------------ |
| `workflow-config`     | Carrega ou cria `skills.config.json`       |
| `mode-brainstorm`     | Brainstorm, spec e breakdown de tarefas (04-tasks opcional) |
| `mode-grill`          | Modo de revisão crítica                    |
| `write-feature-spec`  | Spec de produto (01-spec)                  |
| `write-plan`          | Plano técnico e implementação (03-plan)    |
| `write-handoff`       | Handoff entre sessões                      |
| `write-skill`         | Criar ou melhorar skills                   |

Organização visual no [skills.sh](https://skills.sh/): [skills.sh.json](./skills.sh.json).

---

## Desenvolver ou manter este repositório

Use esta seção se você **clonou ou faz fork** deste repo para criar ou editar skills.

### Estrutura

```text
skills/
  nome-da-skill/
    SKILL.md          # obrigatório
    scripts/          # opcional
    references/       # opcional
    assets/           # opcional
skills.config.json       # config local (gitignored)
skills.config.example.json
```

### Comandos

```bash
git clone https://github.com/reveliotec/skills.git
cd skills

npm run new -- minha-skill                        # criar skill
npm run new -- minha-skill --resources scripts,references,assets
npm run validate                                # validar SKILL.md
npm run configure -- /caminho/do/projeto        # gerar skills.config.json no projeto alvo
npm run skills:list                             # listar skills deste repo
```

Depois de editar uma skill, rode `npm run validate`. O script `new` também adiciona a skill ao grupo em `skills.sh.json`.

### Testar instalação local

```bash
npx skills add . --skill minha-skill -a cursor -y
```

---

## Referência rápida — `npx skills`

```bash
# Do GitHub (uso normal)
npx skills add reveliotec/skills --skill '*' -a cursor -y

# Deste clone local
npx skills add . --skill minha-skill -a cursor -y

# Global (todas as pastas)
npx skills add reveliotec/skills --skill '*' -a cursor -g -y
```

Mais opções: [`vercel-labs/skills`](https://github.com/vercel-labs/skills).
