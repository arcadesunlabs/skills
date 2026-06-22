# Personal Agent Skills

Repositorio para manter skills pessoais no formato `SKILL.md`, compatível com o ecossistema [skills.sh](https://www.skills.sh/) e com o CLI `npx skills`.

## Estrutura

```text
skills/
  nome-da-skill/
    SKILL.md
    scripts/       # opcional
    references/    # opcional
    assets/        # opcional
skills.config.json       # config local do usuario (gitignored)
skills.config.example.json
```

Cada skill fica em `skills/<nome-da-skill>/SKILL.md`.

## Configurar workflow (por usuario / por projeto)

Varias skills (`task-workflow`, `write-plan`, `mode-brainstorm`, etc.) leem **`skills.config.json`** na raiz do **projeto onde voce trabalha** — nao valores fixos de um repo especifico.

1. Copie o exemplo ou rode o assistente:

```bash
npm run configure
```

2. Informe: nome do projeto, pasta de docs, prefixo de card (ex. `REV`, `PM`), task tracker (Trello, GitHub, Linear ou `none`), regra de branch, e IDs do board Trello se aplicavel.

3. No projeto alvo (ex. monorepo Revelio), crie o mesmo `skills.config.json` na raiz ou rode `npm run configure` la.

A skill `workflow-config` e o ponto de entrada: o agente carrega o arquivo antes das demais skills de workflow.

Campos principais: `project`, `docs`, `taskTracker`, `code`. Veja [skills.config.example.json](./skills.config.example.json).

## Criar uma skill

```bash
npm run new -- minha-skill
```

Com recursos opcionais:

```bash
npm run new -- minha-skill --resources scripts,references,assets
```

Depois edite `skills/minha-skill/SKILL.md` e substitua o texto inicial por instrucoes reais e concisas.

O script tambem adiciona a skill ao grupo `Personal` em `skills.sh.json`.

## Validar

```bash
npm run validate
```

A validacao checa se cada `SKILL.md` tem frontmatter YAML com `name` e `description`, se o nome usa `lowercase-hyphen-case`, e se o nome bate com a pasta.

## Usar com `npx skills`

Listar skills deste repositorio localmente:

```bash
npm run skills:list
```

Instalar deste repositorio local:

```bash
npx skills add . --skill minha-skill -a codex
```

Depois de publicar no GitHub, use:

```bash
npx skills add owner/repo --skill minha-skill -a codex
```

Para instalar todas as skills:

```bash
npx skills add owner/repo --skill '*' -a codex
```

## Pagina no skills.sh

O arquivo `skills.sh.json` controla apenas a organizacao visual da pagina do repositorio no skills.sh. Quando adicionar novas skills, inclua seus nomes nos grupos desse arquivo.
