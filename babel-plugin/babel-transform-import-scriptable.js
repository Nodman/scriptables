// transform ESModule imports to scriptable 'importModule' api call

const syntaxErrorMessage =
  "Unsupported syntax error. Don't mix default and named imports";

function transform({ types }) {
  return {
    visitor: {
      ImportDeclaration(path) {
        let variableDeclarator;

        const { specifiers, source } = path.node;
        const callExpression = types.callExpression(
          types.identifier("importModule"),
          [types.stringLiteral(source.value)]
        );

        if (specifiers[0].type === "ImportSpecifier") {
          const objectProperties = specifiers.map((item) => {
            if (item.type === "ImportDefaultSpecifier") {
              throw path.buildCodeFrameError(syntaxErrorMessage);
            }

            const identifier = types.identifier(item.local.name);
            return types.objectProperty(identifier, identifier, false, true);
          });

          variableDeclarator = types.variableDeclarator(
            types.objectPattern(objectProperties),
            callExpression
          );
        } else {
          if (specifiers.length > 1) {
            throw path.buildCodeFrameError(syntaxErrorMessage);
          }
          variableDeclarator = types.variableDeclarator(
            types.identifier(specifiers[0].local.name),
            callExpression
          );
        }

        path.replaceWith(
          types.variableDeclaration("const", [variableDeclarator])
        );
      },
    },
  };
}

module.exports = transform;
