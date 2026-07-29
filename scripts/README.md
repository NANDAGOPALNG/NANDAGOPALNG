# Regenerating assets

`profile/tech-stack.svg` is generated, not hand-authored — chip widths and
row positions are computed from `config.json` so the stack list can grow
without anyone touching SVG coordinates again.

```bash
node scripts/generate-tech-stack.js
```

To add a technology: add it to the relevant category array in `config.json`
and re-run the script. To add a whole new category, add a new
`{ "label": ..., "items": [...] }` entry — row layout shifts automatically.

## Why `hero.svg`, `currently.svg`, and `footer.svg` aren't generated

They're structurally one-off (a boot log, a status list, a closing rule) —
scripting their layout would add indirection without adding flexibility.
They're plain hand-edited SVG; open them directly to change copy or timing.

## Why there's no `/fonts` folder

GitHub's README sanitizer strips external `@font-face` sources on rendered
SVGs, so custom fonts would silently fail. Every SVG here uses a system
monospace stack (`ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, Consolas,
monospace`) instead — it renders identically everywhere GitHub shows it.
