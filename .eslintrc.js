module.exports = {
  'parser': 'babel-eslint',
  'extends': [ 'airbnb' ],
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module',
    'ecmaFeatures': {
      'jsx': true,
      'es6': true,
    },
  },
  'env': {
    'browser': true,
    'es6': true,
  },
  'globals': {},
  'plugins': [ 'react', 'jsx-a11y', 'import' ],
  'rules': {
    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
    'import/no-unresolved': 'off',
    'no-static-element-interactions': 'off',
    'react/button-has-type': 'off',
    
    /* Possible Errors */
    // disallow unnecessary parentheses
    'no-extra-parens': [
      'error',
      'all',
      {
        'conditionalAssign': true,
        'nestedBinaryExpressions': false,
        'returnAssign': false,
        'ignoreJSX': 'all', // delegate to eslint-plugin-react
        'enforceForArrowConditionals': false,
      },
    ],

    /* Best Practices */
    // enforce that class methods use 'this'
    'class-methods-use-this': 'off',

    // specify curly brace conventions for all control statements
    'curly': [ 'warn', 'all' ],

    // disallow comparisons to null without a type-checking operator
    'no-eq-null': 'error',

    // disallow use of multiple spaces
    'no-multi-spaces': [
      'error',
      {
        'ignoreEOLComments': false,
        'exceptions': {
          'Property': true,
          'ImportDeclaration': true,
          'VariableDeclarator': true,
        },
      },
    ],

    // disallow reassignment of function parameters
    'no-param-reassign': [ 'error', { 'props': false } ],

    // disallow declaring the same variable more then once
    'no-redeclare': [ 'error', { 'builtinGlobals': true } ],

    // disallow use of assignment in return statement
    'no-return-assign': [ 'error', 'except-parens' ],

    // disallow usage of expressions in statement position
    'no-unused-expressions': [ 'error', {
      'allowShortCircuit': true,
      'allowTernary': true,
      'allowTaggedTemplates': false,
    } ],

    // disallow usage of configurable warning terms in comments: e.g. todo
    'no-warning-comments': [
      'warn',
      {
        'terms': [ 'todo', 'fixme', 'xxx' ],
        'location': 'anywhere',
      },
    ],

    // require immediate function invocation to be wrapped in parentheses
    'wrap-iife': [ 'error', 'inside', { 'functionPrototypeMethods': true } ],

    /* Variables */
    // disallow declaration of variables that are not used in the code
    'no-unused-vars': 'error',

    /* Stylistic Issues */
    // enforce line breaks after opening and before closing array brackets
    'array-bracket-newline': [ 'error', 'consistent' ],

    // enforce spacing inside array brackets
    'array-bracket-spacing': [ 'error', 'always' ],

    // enforce line breaks between array elements
    'array-element-newline': [ 'error', 'consistent' ],

    // enforce one true brace style
    'brace-style': [ 'warn', 'stroustrup', { 'allowSingleLine': false } ],

    // require trailing commas in multiline object literals
    'comma-dangle': [
      'error',
      {
        'arrays': 'always-multiline',
        'objects': 'always-multiline',
        'imports': 'always-multiline',
        'exports': 'always-multiline',
        'functions': 'never',
      },
    ],

    // template string sometimes will make eslint broken
    'template-curly-spacing': [ 'off' ],

    // this option sets a specific tab width for your code
    'indent': [
      'error',
      2,
      {
        'SwitchCase': 1,
        'VariableDeclarator': { 'var': 2, 'let': 2, 'const': 3 },
        'outerIIFEBody': 1,
        'MemberExpression': 1,
        'FunctionDeclaration': {
          'parameters': 'first',
          'body': 1,
        },
        'FunctionExpression': {
          'parameters': 'first',
          'body': 1,
        },
        'CallExpression': { 'arguments': 'first' },
        'ArrayExpression': 1,
        'ObjectExpression': 'first',
        'ImportDeclaration': 'first',
        'flatTernaryExpressions': false,
        'ignoredNodes': [
          'JSXElement',
          'JSXElement > *',
          'JSXAttribute',
          'JSXIdentifier',
          'JSXNamespacedName',
          'JSXMemberExpression',
          'JSXSpreadAttribute',
          'JSXExpressionContainer',
          'JSXOpeningElement',
          'JSXClosingElement',
          'JSXText',
          'JSXEmptyExpression',
          'JSXSpreadChild',
          'TemplateLiteral', // template string sometimes will make eslint broken
        ],
        'ignoreComments': true,
      },
    ],

    // Specify whether double or single quotes should be used in JSX attributes
    'jsx-quotes': [ 'error', 'prefer-single' ],

    // specify the maximum length of a line in your program
    'max-len': 'off',

    // disallow use of unary operators, ++ and --
    'no-plusplus': [ 'error', { 'allowForLoopAfterthoughts': true } ],

    // disallow dangling underscores in identifiers
    'no-underscore-dangle': 'off', // todo

    // enforce line breaks between braces
    'object-curly-newline': [
      'warn',
      {
        'ObjectExpression': {
          'minProperties': 0,
          'multiline': true,
          'consistent': true,
        },
        'ObjectPattern': { 'minProperties': 0, 'multiline': true, 'consistent': true },
        'ImportDeclaration': {
          'minProperties': 0,
          'multiline': true,
          'consistent': true,
        },
        'ExportDeclaration': {
          'minProperties': 0,
          'multiline': true,
          'consistent': true,
        },
      },
    ],

    // require padding inside curly braces
    'object-curly-spacing': [ 'error', 'always' ],

    // allow just one var statement per function
    'one-var': [
      'error',
      {
        'initialized': 'never',
        'uninitialized': 'always',
      },
    ],

    // require a newline around variable declaration
    'one-var-declaration-per-line': [ 'warn', 'initializations' ],

    // require quotes around object literal property names
    'quote-props': [ 'warn', 'always' ],

    // Require or disallow padding lines between statements
    'padding-line-between-statements': [
      'error',
      { 'blankLine': 'always', 'prev': '*', 'next': 'return' }, // newline-before-return
      {
        'blankLine': 'any',
        'prev': [ 'const', 'let', 'var' ],
        'next': [ 'const', 'let', 'var' ],
      }, // newline-after-var
      { 'blankLine': 'always', 'prev': 'directive', 'next': '*' }, // lines-around-directive
    ],

    // require regex literals to be wrapped in parentheses
    'wrap-regex': 'error',

    /* ECMAScript 6 */
    // require method and property shorthand syntax for object literals
    'object-shorthand': [ 'error', 'methods' ],

    // suggest using template literals instead of string concatenation
    'prefer-template': 'off',

    /* import */

    /* react */
    // Validate closing bracket location in JSX
    'react/jsx-closing-bracket-location': [
      'error',
      {
        'nonEmpty': 'tag-aligned',
        'selfClosing': 'tag-aligned',
      },
    ],

    // only .jsx and .js files may have JSX
    'react/jsx-filename-extension': [ 'error', { 'extensions': [ '.jsx', '.js' ] } ],

    // Enforce props alphabetical sorting
    // 'react/jsx-sort-props': 'error',
    // some problem in eslint-plugin-react

    // Prevent unused state values
    'react/no-unused-state': 'error',

    // Enforce propTypes declarations alphabetical sorting
    'react/sort-prop-types': [
      'error',
      {
        'callbacksLast': false,
        'ignoreCase': true,
        'requiredFirst': true,
        'sortShapeProp': true,
      },
    ],

    /* jsx */
    // require onClick be accompanied by onKeyUp/onKeyDown/onKeyPress
    'jsx-a11y/click-events-have-key-events': 'off',

    'jsx-a11y/label-has-associated-control': 'off',

    // require that JSX labels use "htmlFor"
    // This rule was deprecated in v6.1.0. It will no longer be maintained.
    // Please use label-has-associated-control instead.
    'jsx-a11y/label-has-for': 'off',

    'jsx-a11y/no-static-element-interactions': 'off'
  },
};
