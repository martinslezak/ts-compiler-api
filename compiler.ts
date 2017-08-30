/// <reference path="include/node.d.ts" />
/// <reference path="node_modules/typescript/lib/typescript.d.ts" />

import {readFileSync} from "fs";
import * as ts from "typescript";

export function delint(sourceFile: ts.SourceFile) {
    delintNode(sourceFile);

    function delintNode(node: ts.Node) {
        let importNode;
        let msg: string[] = [];

        switch (node.kind) {
            
            case ts.SyntaxKind.ExternalModuleReference:
                importNode = <ts.ExternalModuleReference>node;
                // importNode.name
                msg.push("ExternalModuleReference");
                break;

            case ts.SyntaxKind.ImportSpecifier:
                importNode = <ts.ImportSpecifier>node;
                // importNode.name
                msg.push("ImportSpecifier");
                break;

            /** THIS IS IT */
            case ts.SyntaxKind.ImportDeclaration:
                importNode = <ts.ImportDeclaration>node;
                msg.push("ImportDeclaration");
                const importClause = (<ts.ImportDeclaration>node).importClause;
                let moduleSpecifier = importNode.moduleSpecifier;
                if (moduleSpecifier) {
                    let file = moduleSpecifier.text;
                    msg.push("importing file: " + file);
                }
                break;

            case ts.SyntaxKind.NamedImports:
                importNode = <ts.NamedImports>node;
                msg.push("NamedImports");
                break;

            case ts.SyntaxKind.ImportClause:
                importNode = <ts.NamedImports>node;
                msg.push("ImportClause");
                break;
        }

        if (msg.length > 0) {
            report(node, msg.join("\n"));
            let i = 0;
        }

        ts.forEachChild(node, delintNode);
    }

    function report(node: ts.Node, message: string) {
        let { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        console.log(`${sourceFile.fileName} (${line + 1},${character + 1}): ${message}`);
    }
}

const fileNames = process.argv.slice(2);
fileNames.forEach(fileName => {
    // Parse a file
    let sourceFile = ts.createSourceFile(fileName, readFileSync(fileName).toString(), ts.ScriptTarget.ES2015, /*setParentNodes */ true);

    // delint it
    delint(sourceFile);
});

console.log("END");
process.exit(0);