# Iris-VSCode

Monorepo for my VSCode extensions. One folder per extension under `extensions/`.

## Layout

```
extensions/
  <name>/          one self-contained extension
    package.json   manifest (publisher, engines.vscode, contributes)
    src/extension.ts
    README.md      shown on the Marketplace
    CHANGELOG.md
```

## New extension

```sh
cd extensions
npx --package yo --package generator-code -- yo code
```

Pick TypeScript, no bundler for simple ones (add esbuild when startup time matters).

## Develop

1. Open the extension folder in VSCode.
2. `npm install`
3. `F5` launches an Extension Development Host.

## Package & publish

```sh
npm i -g @vscode/vsce
vsce package        # produces <name>-<version>.vsix, install locally to test
vsce login <publisher>
vsce publish        # or: vsce publish patch|minor|major
```

Before first publish: create a publisher at https://marketplace.visualstudio.com/manage, set `publisher`, `repository`, `icon` and `license` in the extension's `package.json`.

## License

MIT, see [LICENSE](LICENSE).
