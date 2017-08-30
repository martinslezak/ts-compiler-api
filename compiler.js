"use strict";
/// <reference path="include/node.d.ts" />
/// <reference path="node_modules/typescript/lib/typescript.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const ts = require("typescript");
function delint(sourceFile) {
    delintNode(sourceFile);
    function delintNode(node) {
        let importNode;
        let msg = [];
        switch (node.kind) {
            case ts.SyntaxKind.ExternalModuleReference:
                importNode = node;
                // importNode.name
                msg.push("ExternalModuleReference");
                break;
            case ts.SyntaxKind.ImportSpecifier:
                importNode = node;
                // importNode.name
                msg.push("ImportSpecifier");
                break;
            /** THIS IS IT */
            case ts.SyntaxKind.ImportDeclaration:
                importNode = node;
                msg.push("ImportDeclaration");
                const importClause = node.importClause;
                let moduleSpecifier = importNode.moduleSpecifier;
                if (moduleSpecifier) {
                    let file = moduleSpecifier.text;
                    msg.push("importing file: " + file);
                }
                break;
            case ts.SyntaxKind.NamedImports:
                importNode = node;
                msg.push("NamedImports");
                break;
            case ts.SyntaxKind.ImportClause:
                importNode = node;
                msg.push("ImportClause");
                break;
        }
        if (msg.length > 0) {
            report(node, msg.join("\n"));
            let i = 0;
        }
        ts.forEachChild(node, delintNode);
    }
    function report(node, message) {
        let { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        console.log(`${sourceFile.fileName} (${line + 1},${character + 1}): ${message}`);
    }
}
exports.delint = delint;
const fileNames = process.argv.slice(2);
fileNames.forEach(fileName => {
    // Parse a file
    let sourceFile = ts.createSourceFile(fileName, fs_1.readFileSync(fileName).toString(), ts.ScriptTarget.ES2015, /*setParentNodes */ true);
    // delint it
    delint(sourceFile);
});
console.log("END");
process.exit(0);
//# sourceMappingURL=compiler.js.map