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
```

Cada skill fica em `skills/<nome-da-skill>/SKILL.md`.

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
