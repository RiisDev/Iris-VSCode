const vscode = require('vscode');

// Uses the real Find widget: "select all matches" honours its Aa / ab / .* toggles,
// then we keep/remove the lines holding those selections.
async function run(keep) {
  const ed = vscode.window.activeTextEditor;
  if (!ed) return;
  await vscode.commands.executeCommand('editor.action.selectAllMatches');
  const hit = new Set();
  for (const s of ed.selections) {
    if (s.isEmpty) continue;
    // a multi-line regex match covers every line it spans; a match ending at col 0 doesn't touch its last line
    const end = s.end.character === 0 ? s.end.line - 1 : s.end.line;
    for (let i = s.start.line; i <= Math.max(end, s.start.line); i++) hit.add(i);
  }
  if (!hit.size) return vscode.window.showInformationMessage('Line Filter: no matches. Open Find (Ctrl+F) and type a search first.');

  const doc = ed.document;
  const lines = doc.getText().split(/\r?\n/);
  const out = lines.filter((_, i) => hit.has(i) === keep);
  const all = new vscode.Range(0, 0, doc.lineCount - 1, doc.lineAt(doc.lineCount - 1).text.length);
  await ed.edit(b => b.replace(all, out.join(doc.eol === vscode.EndOfLine.CRLF ? '\r\n' : '\n')));
  ed.selection = new vscode.Selection(0, 0, 0, 0);
  vscode.window.setStatusBarMessage(`Line Filter: removed ${lines.length - out.length} of ${lines.length} lines`, 4000);
}

exports.activate = ctx => ctx.subscriptions.push(
  vscode.commands.registerCommand('lineFilter.keep', () => run(true)),
  vscode.commands.registerCommand('lineFilter.remove', () => run(false)),
);
