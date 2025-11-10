import type { BabelFile, NodePath, PluginObj, PluginPass } from "@babel/core";
import * as t from "@babel/types";

interface State extends PluginPass {
  file: BabelFile & { opts: { filename: string } };
}

const GUARD_NAMES = new Set(["guardAsync", "guard"]);

const createWhereProp = (origin: string) =>
  t.objectProperty(t.identifier("where"), t.stringLiteral(origin));

const getKeyName = (key: t.Expression | t.PrivateName): string | undefined => {
  if (t.isIdentifier(key)) return key.name;
  if (t.isStringLiteral(key)) return key.value;
  return undefined;
};

const resolveBindingName = (path: NodePath): string | undefined => {
  let current: NodePath | null = path.parentPath;

  while (current) {
    if (current.isVariableDeclarator() && t.isIdentifier(current.node.id)) {
      return current.node.id.name;
    }

    if (current.isAssignmentExpression()) {
      const left = current.node.left;
      if (t.isIdentifier(left)) return left.name;
      if (t.isMemberExpression(left) && t.isIdentifier(left.property)) {
        return left.property.name;
      }
    }

    if (current.isObjectProperty() && !current.node.computed) {
      const name = getKeyName(current.node.key);
      if (name) return name;
    }

    if (current.isObjectMethod() && !current.node.computed) {
      const name = getKeyName(current.node.key);
      if (name) return name;
    }

    if (current.isClassProperty() && t.isIdentifier(current.node.key)) {
      return current.node.key.name;
    }

    if (current.isClassMethod() && !current.node.computed) {
      const name = getKeyName(current.node.key);
      if (name) return name;
    }

    if (current.isJSXAttribute() && t.isJSXIdentifier(current.node.name)) {
      return current.node.name.name;
    }

    if (current.isExportDefaultDeclaration()) {
      return "default";
    }

    current = current.parentPath;
  }

  return undefined;
};

const resolveComponentName = (path: NodePath): string | undefined => {
  let current: NodePath | null = path.parentPath;
  while (current) {
    if (current.isFunctionDeclaration() || current.isClassDeclaration()) {
      const id = (current.node as t.FunctionDeclaration | t.ClassDeclaration)
        .id;
      if (id && /^[A-Z]/.test(id.name)) return id.name;
    }
    current = current.parentPath;
  }
  return undefined;
};

const handlerArgName = (
  callPath: NodePath<t.CallExpression>
): string | undefined => {
  const [first] = callPath.node.arguments;
  if (!first || !t.isExpression(first)) return undefined;

  if (t.isIdentifier(first)) return first.name;

  if (t.isFunctionExpression(first) && first.id) {
    return first.id.name;
  }
  return undefined;
};

const ensureWhereOption = (
  callPath: NodePath<t.CallExpression>,
  origin: string
) => {
  const args = callPath.node.arguments;
  const secondArg = args[1];

  if (!secondArg) {
    args.push(t.objectExpression([createWhereProp(origin)]));
    return;
  }

  if (t.isObjectExpression(secondArg)) {
    const hasWhere = secondArg.properties.some(
      (prop) =>
        t.isObjectProperty(prop) &&
        !prop.computed &&
        t.isIdentifier(prop.key) &&
        prop.key.name === "where"
    );

    if (!hasWhere) {
      secondArg.properties.push(createWhereProp(origin));
    }
    return;
  }

  args[1] = t.objectExpression([
    t.spreadElement(secondArg as t.Expression),
    createWhereProp(origin),
  ]);
};

/**
 * Babel plugin that finds calls to `guard`/`guardAsync` and injects
 * a `where` option when it’s missing. The origin is derived from the
 * nearest binding or component name so heuristics stay consistent.
 */
export default function guardOriginPlugin(): PluginObj<State> {
  return {
    name: "guard-origin",
    visitor: {
      CallExpression(path, state) {
        if (
          !t.isIdentifier(path.node.callee) ||
          !GUARD_NAMES.has(path.node.callee.name)
        ) {
          return;
        }

        const bindingName = resolveBindingName(path);
        const handlerName = handlerArgName(path);
        const functionName = bindingName ?? handlerName ?? "anonymous";
        const componentName = resolveComponentName(path);

        const filename = state.file.opts.filename ?? "";
        const fileBase =
          filename
            .split(/[\\/]/)
            .pop()
            ?.replace(/\.[^.]+$/, "") || "unknown";

        let origin: string;
        if (componentName) {
          origin =
            functionName && functionName !== "anonymous"
              ? `${componentName}.${functionName}`
              : `${componentName}.anonymous`;
        } else {
          origin = `${fileBase}.${functionName}`;
        }

        if (functionName === "anonymous") {
          const loc = path.node.loc?.start;
          if (loc) origin += `@${loc.line}:${loc.column ?? 0}`;
        }

        ensureWhereOption(path, origin);
      },
    },
  };
}
