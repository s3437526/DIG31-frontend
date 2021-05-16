// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/lit-html/lib/directive.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDirective = exports.directive = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const directives = new WeakMap();
/**
 * Brands a function as a directive factory function so that lit-html will call
 * the function during template rendering, rather than passing as a value.
 *
 * A _directive_ is a function that takes a Part as an argument. It has the
 * signature: `(part: Part) => void`.
 *
 * A directive _factory_ is a function that takes arguments for data and
 * configuration and returns a directive. Users of directive usually refer to
 * the directive factory as the directive. For example, "The repeat directive".
 *
 * Usually a template author will invoke a directive factory in their template
 * with relevant arguments, which will then return a directive function.
 *
 * Here's an example of using the `repeat()` directive factory that takes an
 * array and a function to render an item:
 *
 * ```js
 * html`<ul><${repeat(items, (item) => html`<li>${item}</li>`)}</ul>`
 * ```
 *
 * When `repeat` is invoked, it returns a directive function that closes over
 * `items` and the template function. When the outer template is rendered, the
 * return directive function is called with the Part for the expression.
 * `repeat` then performs it's custom logic to render multiple items.
 *
 * @param f The directive factory function. Must be a function that returns a
 * function of the signature `(part: Part) => void`. The returned function will
 * be called with the part object.
 *
 * @example
 *
 * import {directive, html} from 'lit-html';
 *
 * const immutable = directive((v) => (part) => {
 *   if (part.value !== v) {
 *     part.setValue(v)
 *   }
 * });
 */

const directive = f => (...args) => {
  const d = f(...args);
  directives.set(d, true);
  return d;
};

exports.directive = directive;

const isDirective = o => {
  return typeof o === 'function' && directives.has(o);
};

exports.isDirective = isDirective;
},{}],"../node_modules/lit-html/lib/dom.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeNodes = exports.reparentNodes = exports.isCEPolyfill = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * True if the custom elements polyfill is in use.
 */
const isCEPolyfill = typeof window !== 'undefined' && window.customElements != null && window.customElements.polyfillWrapFlushCallback !== undefined;
/**
 * Reparents nodes, starting from `start` (inclusive) to `end` (exclusive),
 * into another container (could be the same container), before `before`. If
 * `before` is null, it appends the nodes to the container.
 */

exports.isCEPolyfill = isCEPolyfill;

const reparentNodes = (container, start, end = null, before = null) => {
  while (start !== end) {
    const n = start.nextSibling;
    container.insertBefore(start, before);
    start = n;
  }
};
/**
 * Removes nodes, starting from `start` (inclusive) to `end` (exclusive), from
 * `container`.
 */


exports.reparentNodes = reparentNodes;

const removeNodes = (container, start, end = null) => {
  while (start !== end) {
    const n = start.nextSibling;
    container.removeChild(start);
    start = n;
  }
};

exports.removeNodes = removeNodes;
},{}],"../node_modules/lit-html/lib/part.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nothing = exports.noChange = void 0;

/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const noChange = {};
/**
 * A sentinel value that signals a NodePart to fully clear its content.
 */

exports.noChange = noChange;
const nothing = {};
exports.nothing = nothing;
},{}],"../node_modules/lit-html/lib/template.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lastAttributeNameRegex = exports.createMarker = exports.isTemplatePartActive = exports.Template = exports.boundAttributeSuffix = exports.markerRegex = exports.nodeMarker = exports.marker = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * An expression marker with embedded unique key to avoid collision with
 * possible text in templates.
 */
const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
/**
 * An expression marker used text-positions, multi-binding attributes, and
 * attributes with markup-like text values.
 */

exports.marker = marker;
const nodeMarker = `<!--${marker}-->`;
exports.nodeMarker = nodeMarker;
const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
/**
 * Suffix appended to all bound attribute names.
 */

exports.markerRegex = markerRegex;
const boundAttributeSuffix = '$lit$';
/**
 * An updatable Template that tracks the location of dynamic parts.
 */

exports.boundAttributeSuffix = boundAttributeSuffix;

class Template {
  constructor(result, element) {
    this.parts = [];
    this.element = element;
    const nodesToRemove = [];
    const stack = []; // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null

    const walker = document.createTreeWalker(element.content, 133
    /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
    , null, false); // Keeps track of the last index associated with a part. We try to delete
    // unnecessary nodes, but we never want to associate two different parts
    // to the same index. They must have a constant node between.

    let lastPartIndex = 0;
    let index = -1;
    let partIndex = 0;
    const {
      strings,
      values: {
        length
      }
    } = result;

    while (partIndex < length) {
      const node = walker.nextNode();

      if (node === null) {
        // We've exhausted the content inside a nested template element.
        // Because we still have parts (the outer for-loop), we know:
        // - There is a template in the stack
        // - The walker will find a nextNode outside the template
        walker.currentNode = stack.pop();
        continue;
      }

      index++;

      if (node.nodeType === 1
      /* Node.ELEMENT_NODE */
      ) {
          if (node.hasAttributes()) {
            const attributes = node.attributes;
            const {
              length
            } = attributes; // Per
            // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
            // attributes are not guaranteed to be returned in document order.
            // In particular, Edge/IE can return them out of order, so we cannot
            // assume a correspondence between part index and attribute index.

            let count = 0;

            for (let i = 0; i < length; i++) {
              if (endsWith(attributes[i].name, boundAttributeSuffix)) {
                count++;
              }
            }

            while (count-- > 0) {
              // Get the template literal section leading up to the first
              // expression in this attribute
              const stringForPart = strings[partIndex]; // Find the attribute name

              const name = lastAttributeNameRegex.exec(stringForPart)[2]; // Find the corresponding attribute
              // All bound attributes have had a suffix added in
              // TemplateResult#getHTML to opt out of special attribute
              // handling. To look up the attribute value we also need to add
              // the suffix.

              const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
              const attributeValue = node.getAttribute(attributeLookupName);
              node.removeAttribute(attributeLookupName);
              const statics = attributeValue.split(markerRegex);
              this.parts.push({
                type: 'attribute',
                index,
                name,
                strings: statics
              });
              partIndex += statics.length - 1;
            }
          }

          if (node.tagName === 'TEMPLATE') {
            stack.push(node);
            walker.currentNode = node.content;
          }
        } else if (node.nodeType === 3
      /* Node.TEXT_NODE */
      ) {
          const data = node.data;

          if (data.indexOf(marker) >= 0) {
            const parent = node.parentNode;
            const strings = data.split(markerRegex);
            const lastIndex = strings.length - 1; // Generate a new text node for each literal section
            // These nodes are also used as the markers for node parts

            for (let i = 0; i < lastIndex; i++) {
              let insert;
              let s = strings[i];

              if (s === '') {
                insert = createMarker();
              } else {
                const match = lastAttributeNameRegex.exec(s);

                if (match !== null && endsWith(match[2], boundAttributeSuffix)) {
                  s = s.slice(0, match.index) + match[1] + match[2].slice(0, -boundAttributeSuffix.length) + match[3];
                }

                insert = document.createTextNode(s);
              }

              parent.insertBefore(insert, node);
              this.parts.push({
                type: 'node',
                index: ++index
              });
            } // If there's no text, we must insert a comment to mark our place.
            // Else, we can trust it will stick around after cloning.


            if (strings[lastIndex] === '') {
              parent.insertBefore(createMarker(), node);
              nodesToRemove.push(node);
            } else {
              node.data = strings[lastIndex];
            } // We have a part for each match found


            partIndex += lastIndex;
          }
        } else if (node.nodeType === 8
      /* Node.COMMENT_NODE */
      ) {
          if (node.data === marker) {
            const parent = node.parentNode; // Add a new marker node to be the startNode of the Part if any of
            // the following are true:
            //  * We don't have a previousSibling
            //  * The previousSibling is already the start of a previous part

            if (node.previousSibling === null || index === lastPartIndex) {
              index++;
              parent.insertBefore(createMarker(), node);
            }

            lastPartIndex = index;
            this.parts.push({
              type: 'node',
              index
            }); // If we don't have a nextSibling, keep this node so we have an end.
            // Else, we can remove it to save future costs.

            if (node.nextSibling === null) {
              node.data = '';
            } else {
              nodesToRemove.push(node);
              index--;
            }

            partIndex++;
          } else {
            let i = -1;

            while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
              // Comment node has a binding marker inside, make an inactive part
              // The binding won't work, but subsequent bindings will
              // TODO (justinfagnani): consider whether it's even worth it to
              // make bindings in comments work
              this.parts.push({
                type: 'node',
                index: -1
              });
              partIndex++;
            }
          }
        }
    } // Remove text binding nodes after the walk to not disturb the TreeWalker


    for (const n of nodesToRemove) {
      n.parentNode.removeChild(n);
    }
  }

}

exports.Template = Template;

const endsWith = (str, suffix) => {
  const index = str.length - suffix.length;
  return index >= 0 && str.slice(index) === suffix;
};

const isTemplatePartActive = part => part.index !== -1; // Allows `document.createComment('')` to be renamed for a
// small manual size-savings.


exports.isTemplatePartActive = isTemplatePartActive;

const createMarker = () => document.createComment('');
/**
 * This regex extracts the attribute name preceding an attribute-position
 * expression. It does this by matching the syntax allowed for attributes
 * against the string literal directly preceding the expression, assuming that
 * the expression is in an attribute-value position.
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#elements-attributes
 *
 * " \x09\x0a\x0c\x0d" are HTML space characters:
 * https://www.w3.org/TR/html5/infrastructure.html#space-characters
 *
 * "\0-\x1F\x7F-\x9F" are Unicode control characters, which includes every
 * space character except " ".
 *
 * So an attribute is:
 *  * The name: any character except a control character, space character, ('),
 *    ("), ">", "=", or "/"
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */


exports.createMarker = createMarker;
const lastAttributeNameRegex = // eslint-disable-next-line no-control-regex
/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
exports.lastAttributeNameRegex = lastAttributeNameRegex;
},{}],"../node_modules/lit-html/lib/template-instance.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TemplateInstance = void 0;

var _dom = require("./dom.js");

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * An instance of a `Template` that can be attached to the DOM and updated
 * with new values.
 */
class TemplateInstance {
  constructor(template, processor, options) {
    this.__parts = [];
    this.template = template;
    this.processor = processor;
    this.options = options;
  }

  update(values) {
    let i = 0;

    for (const part of this.__parts) {
      if (part !== undefined) {
        part.setValue(values[i]);
      }

      i++;
    }

    for (const part of this.__parts) {
      if (part !== undefined) {
        part.commit();
      }
    }
  }

  _clone() {
    // There are a number of steps in the lifecycle of a template instance's
    // DOM fragment:
    //  1. Clone - create the instance fragment
    //  2. Adopt - adopt into the main document
    //  3. Process - find part markers and create parts
    //  4. Upgrade - upgrade custom elements
    //  5. Update - set node, attribute, property, etc., values
    //  6. Connect - connect to the document. Optional and outside of this
    //     method.
    //
    // We have a few constraints on the ordering of these steps:
    //  * We need to upgrade before updating, so that property values will pass
    //    through any property setters.
    //  * We would like to process before upgrading so that we're sure that the
    //    cloned fragment is inert and not disturbed by self-modifying DOM.
    //  * We want custom elements to upgrade even in disconnected fragments.
    //
    // Given these constraints, with full custom elements support we would
    // prefer the order: Clone, Process, Adopt, Upgrade, Update, Connect
    //
    // But Safari does not implement CustomElementRegistry#upgrade, so we
    // can not implement that order and still have upgrade-before-update and
    // upgrade disconnected fragments. So we instead sacrifice the
    // process-before-upgrade constraint, since in Custom Elements v1 elements
    // must not modify their light DOM in the constructor. We still have issues
    // when co-existing with CEv0 elements like Polymer 1, and with polyfills
    // that don't strictly adhere to the no-modification rule because shadow
    // DOM, which may be created in the constructor, is emulated by being placed
    // in the light DOM.
    //
    // The resulting order is on native is: Clone, Adopt, Upgrade, Process,
    // Update, Connect. document.importNode() performs Clone, Adopt, and Upgrade
    // in one step.
    //
    // The Custom Elements v1 polyfill supports upgrade(), so the order when
    // polyfilled is the more ideal: Clone, Process, Adopt, Upgrade, Update,
    // Connect.
    const fragment = _dom.isCEPolyfill ? this.template.element.content.cloneNode(true) : document.importNode(this.template.element.content, true);
    const stack = [];
    const parts = this.template.parts; // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null

    const walker = document.createTreeWalker(fragment, 133
    /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
    , null, false);
    let partIndex = 0;
    let nodeIndex = 0;
    let part;
    let node = walker.nextNode(); // Loop through all the nodes and parts of a template

    while (partIndex < parts.length) {
      part = parts[partIndex];

      if (!(0, _template.isTemplatePartActive)(part)) {
        this.__parts.push(undefined);

        partIndex++;
        continue;
      } // Progress the tree walker until we find our next part's node.
      // Note that multiple parts may share the same node (attribute parts
      // on a single element), so this loop may not run at all.


      while (nodeIndex < part.index) {
        nodeIndex++;

        if (node.nodeName === 'TEMPLATE') {
          stack.push(node);
          walker.currentNode = node.content;
        }

        if ((node = walker.nextNode()) === null) {
          // We've exhausted the content inside a nested template element.
          // Because we still have parts (the outer for-loop), we know:
          // - There is a template in the stack
          // - The walker will find a nextNode outside the template
          walker.currentNode = stack.pop();
          node = walker.nextNode();
        }
      } // We've arrived at our part's node.


      if (part.type === 'node') {
        const part = this.processor.handleTextExpression(this.options);
        part.insertAfterNode(node.previousSibling);

        this.__parts.push(part);
      } else {
        this.__parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
      }

      partIndex++;
    }

    if (_dom.isCEPolyfill) {
      document.adoptNode(fragment);
      customElements.upgrade(fragment);
    }

    return fragment;
  }

}

exports.TemplateInstance = TemplateInstance;
},{"./dom.js":"../node_modules/lit-html/lib/dom.js","./template.js":"../node_modules/lit-html/lib/template.js"}],"../node_modules/lit-html/lib/template-result.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SVGTemplateResult = exports.TemplateResult = void 0;

var _dom = require("./dom.js");

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * @module lit-html
 */

/**
 * Our TrustedTypePolicy for HTML which is declared using the html template
 * tag function.
 *
 * That HTML is a developer-authored constant, and is parsed with innerHTML
 * before any untrusted expressions have been mixed in. Therefor it is
 * considered safe by construction.
 */
const policy = window.trustedTypes && trustedTypes.createPolicy('lit-html', {
  createHTML: s => s
});
const commentMarker = ` ${_template.marker} `;
/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */

class TemplateResult {
  constructor(strings, values, type, processor) {
    this.strings = strings;
    this.values = values;
    this.type = type;
    this.processor = processor;
  }
  /**
   * Returns a string of HTML used to create a `<template>` element.
   */


  getHTML() {
    const l = this.strings.length - 1;
    let html = '';
    let isCommentBinding = false;

    for (let i = 0; i < l; i++) {
      const s = this.strings[i]; // For each binding we want to determine the kind of marker to insert
      // into the template source before it's parsed by the browser's HTML
      // parser. The marker type is based on whether the expression is in an
      // attribute, text, or comment position.
      //   * For node-position bindings we insert a comment with the marker
      //     sentinel as its text content, like <!--{{lit-guid}}-->.
      //   * For attribute bindings we insert just the marker sentinel for the
      //     first binding, so that we support unquoted attribute bindings.
      //     Subsequent bindings can use a comment marker because multi-binding
      //     attributes must be quoted.
      //   * For comment bindings we insert just the marker sentinel so we don't
      //     close the comment.
      //
      // The following code scans the template source, but is *not* an HTML
      // parser. We don't need to track the tree structure of the HTML, only
      // whether a binding is inside a comment, and if not, if it appears to be
      // the first binding in an attribute.

      const commentOpen = s.lastIndexOf('<!--'); // We're in comment position if we have a comment open with no following
      // comment close. Because <-- can appear in an attribute value there can
      // be false positives.

      isCommentBinding = (commentOpen > -1 || isCommentBinding) && s.indexOf('-->', commentOpen + 1) === -1; // Check to see if we have an attribute-like sequence preceding the
      // expression. This can match "name=value" like structures in text,
      // comments, and attribute values, so there can be false-positives.

      const attributeMatch = _template.lastAttributeNameRegex.exec(s);

      if (attributeMatch === null) {
        // We're only in this branch if we don't have a attribute-like
        // preceding sequence. For comments, this guards against unusual
        // attribute values like <div foo="<!--${'bar'}">. Cases like
        // <!-- foo=${'bar'}--> are handled correctly in the attribute branch
        // below.
        html += s + (isCommentBinding ? commentMarker : _template.nodeMarker);
      } else {
        // For attributes we use just a marker sentinel, and also append a
        // $lit$ suffix to the name to opt-out of attribute-specific parsing
        // that IE and Edge do for style and certain SVG attributes.
        html += s.substr(0, attributeMatch.index) + attributeMatch[1] + attributeMatch[2] + _template.boundAttributeSuffix + attributeMatch[3] + _template.marker;
      }
    }

    html += this.strings[l];
    return html;
  }

  getTemplateElement() {
    const template = document.createElement('template');
    let value = this.getHTML();

    if (policy !== undefined) {
      // this is secure because `this.strings` is a TemplateStringsArray.
      // TODO: validate this when
      // https://github.com/tc39/proposal-array-is-template-object is
      // implemented.
      value = policy.createHTML(value);
    }

    template.innerHTML = value;
    return template;
  }

}
/**
 * A TemplateResult for SVG fragments.
 *
 * This class wraps HTML in an `<svg>` tag in order to parse its contents in the
 * SVG namespace, then modifies the template to remove the `<svg>` tag so that
 * clones only container the original fragment.
 */


exports.TemplateResult = TemplateResult;

class SVGTemplateResult extends TemplateResult {
  getHTML() {
    return `<svg>${super.getHTML()}</svg>`;
  }

  getTemplateElement() {
    const template = super.getTemplateElement();
    const content = template.content;
    const svgElement = content.firstChild;
    content.removeChild(svgElement);
    (0, _dom.reparentNodes)(content, svgElement.firstChild);
    return template;
  }

}

exports.SVGTemplateResult = SVGTemplateResult;
},{"./dom.js":"../node_modules/lit-html/lib/dom.js","./template.js":"../node_modules/lit-html/lib/template.js"}],"../node_modules/lit-html/lib/parts.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventPart = exports.PropertyPart = exports.PropertyCommitter = exports.BooleanAttributePart = exports.NodePart = exports.AttributePart = exports.AttributeCommitter = exports.isIterable = exports.isPrimitive = void 0;

var _directive = require("./directive.js");

var _dom = require("./dom.js");

var _part = require("./part.js");

var _templateInstance = require("./template-instance.js");

var _templateResult = require("./template-result.js");

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const isPrimitive = value => {
  return value === null || !(typeof value === 'object' || typeof value === 'function');
};

exports.isPrimitive = isPrimitive;

const isIterable = value => {
  return Array.isArray(value) || // eslint-disable-next-line @typescript-eslint/no-explicit-any
  !!(value && value[Symbol.iterator]);
};
/**
 * Writes attribute values to the DOM for a group of AttributeParts bound to a
 * single attribute. The value is only set once even if there are multiple parts
 * for an attribute.
 */


exports.isIterable = isIterable;

class AttributeCommitter {
  constructor(element, name, strings) {
    this.dirty = true;
    this.element = element;
    this.name = name;
    this.strings = strings;
    this.parts = [];

    for (let i = 0; i < strings.length - 1; i++) {
      this.parts[i] = this._createPart();
    }
  }
  /**
   * Creates a single part. Override this to create a differnt type of part.
   */


  _createPart() {
    return new AttributePart(this);
  }

  _getValue() {
    const strings = this.strings;
    const l = strings.length - 1;
    const parts = this.parts; // If we're assigning an attribute via syntax like:
    //    attr="${foo}"  or  attr=${foo}
    // but not
    //    attr="${foo} ${bar}" or attr="${foo} baz"
    // then we don't want to coerce the attribute value into one long
    // string. Instead we want to just return the value itself directly,
    // so that sanitizeDOMValue can get the actual value rather than
    // String(value)
    // The exception is if v is an array, in which case we do want to smash
    // it together into a string without calling String() on the array.
    //
    // This also allows trusted values (when using TrustedTypes) being
    // assigned to DOM sinks without being stringified in the process.

    if (l === 1 && strings[0] === '' && strings[1] === '') {
      const v = parts[0].value;

      if (typeof v === 'symbol') {
        return String(v);
      }

      if (typeof v === 'string' || !isIterable(v)) {
        return v;
      }
    }

    let text = '';

    for (let i = 0; i < l; i++) {
      text += strings[i];
      const part = parts[i];

      if (part !== undefined) {
        const v = part.value;

        if (isPrimitive(v) || !isIterable(v)) {
          text += typeof v === 'string' ? v : String(v);
        } else {
          for (const t of v) {
            text += typeof t === 'string' ? t : String(t);
          }
        }
      }
    }

    text += strings[l];
    return text;
  }

  commit() {
    if (this.dirty) {
      this.dirty = false;
      this.element.setAttribute(this.name, this._getValue());
    }
  }

}
/**
 * A Part that controls all or part of an attribute value.
 */


exports.AttributeCommitter = AttributeCommitter;

class AttributePart {
  constructor(committer) {
    this.value = undefined;
    this.committer = committer;
  }

  setValue(value) {
    if (value !== _part.noChange && (!isPrimitive(value) || value !== this.value)) {
      this.value = value; // If the value is a not a directive, dirty the committer so that it'll
      // call setAttribute. If the value is a directive, it'll dirty the
      // committer if it calls setValue().

      if (!(0, _directive.isDirective)(value)) {
        this.committer.dirty = true;
      }
    }
  }

  commit() {
    while ((0, _directive.isDirective)(this.value)) {
      const directive = this.value;
      this.value = _part.noChange;
      directive(this);
    }

    if (this.value === _part.noChange) {
      return;
    }

    this.committer.commit();
  }

}
/**
 * A Part that controls a location within a Node tree. Like a Range, NodePart
 * has start and end locations and can set and update the Nodes between those
 * locations.
 *
 * NodeParts support several value types: primitives, Nodes, TemplateResults,
 * as well as arrays and iterables of those types.
 */


exports.AttributePart = AttributePart;

class NodePart {
  constructor(options) {
    this.value = undefined;
    this.__pendingValue = undefined;
    this.options = options;
  }
  /**
   * Appends this part into a container.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  appendInto(container) {
    this.startNode = container.appendChild((0, _template.createMarker)());
    this.endNode = container.appendChild((0, _template.createMarker)());
  }
  /**
   * Inserts this part after the `ref` node (between `ref` and `ref`'s next
   * sibling). Both `ref` and its next sibling must be static, unchanging nodes
   * such as those that appear in a literal section of a template.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  insertAfterNode(ref) {
    this.startNode = ref;
    this.endNode = ref.nextSibling;
  }
  /**
   * Appends this part into a parent part.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  appendIntoPart(part) {
    part.__insert(this.startNode = (0, _template.createMarker)());

    part.__insert(this.endNode = (0, _template.createMarker)());
  }
  /**
   * Inserts this part after the `ref` part.
   *
   * This part must be empty, as its contents are not automatically moved.
   */


  insertAfterPart(ref) {
    ref.__insert(this.startNode = (0, _template.createMarker)());

    this.endNode = ref.endNode;
    ref.endNode = this.startNode;
  }

  setValue(value) {
    this.__pendingValue = value;
  }

  commit() {
    if (this.startNode.parentNode === null) {
      return;
    }

    while ((0, _directive.isDirective)(this.__pendingValue)) {
      const directive = this.__pendingValue;
      this.__pendingValue = _part.noChange;
      directive(this);
    }

    const value = this.__pendingValue;

    if (value === _part.noChange) {
      return;
    }

    if (isPrimitive(value)) {
      if (value !== this.value) {
        this.__commitText(value);
      }
    } else if (value instanceof _templateResult.TemplateResult) {
      this.__commitTemplateResult(value);
    } else if (value instanceof Node) {
      this.__commitNode(value);
    } else if (isIterable(value)) {
      this.__commitIterable(value);
    } else if (value === _part.nothing) {
      this.value = _part.nothing;
      this.clear();
    } else {
      // Fallback, will render the string representation
      this.__commitText(value);
    }
  }

  __insert(node) {
    this.endNode.parentNode.insertBefore(node, this.endNode);
  }

  __commitNode(value) {
    if (this.value === value) {
      return;
    }

    this.clear();

    this.__insert(value);

    this.value = value;
  }

  __commitText(value) {
    const node = this.startNode.nextSibling;
    value = value == null ? '' : value; // If `value` isn't already a string, we explicitly convert it here in case
    // it can't be implicitly converted - i.e. it's a symbol.

    const valueAsString = typeof value === 'string' ? value : String(value);

    if (node === this.endNode.previousSibling && node.nodeType === 3
    /* Node.TEXT_NODE */
    ) {
        // If we only have a single text node between the markers, we can just
        // set its value, rather than replacing it.
        // TODO(justinfagnani): Can we just check if this.value is primitive?
        node.data = valueAsString;
      } else {
      this.__commitNode(document.createTextNode(valueAsString));
    }

    this.value = value;
  }

  __commitTemplateResult(value) {
    const template = this.options.templateFactory(value);

    if (this.value instanceof _templateInstance.TemplateInstance && this.value.template === template) {
      this.value.update(value.values);
    } else {
      // Make sure we propagate the template processor from the TemplateResult
      // so that we use its syntax extension, etc. The template factory comes
      // from the render function options so that it can control template
      // caching and preprocessing.
      const instance = new _templateInstance.TemplateInstance(template, value.processor, this.options);

      const fragment = instance._clone();

      instance.update(value.values);

      this.__commitNode(fragment);

      this.value = instance;
    }
  }

  __commitIterable(value) {
    // For an Iterable, we create a new InstancePart per item, then set its
    // value to the item. This is a little bit of overhead for every item in
    // an Iterable, but it lets us recurse easily and efficiently update Arrays
    // of TemplateResults that will be commonly returned from expressions like:
    // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
    // If _value is an array, then the previous render was of an
    // iterable and _value will contain the NodeParts from the previous
    // render. If _value is not an array, clear this part and make a new
    // array for NodeParts.
    if (!Array.isArray(this.value)) {
      this.value = [];
      this.clear();
    } // Lets us keep track of how many items we stamped so we can clear leftover
    // items from a previous render


    const itemParts = this.value;
    let partIndex = 0;
    let itemPart;

    for (const item of value) {
      // Try to reuse an existing part
      itemPart = itemParts[partIndex]; // If no existing part, create a new one

      if (itemPart === undefined) {
        itemPart = new NodePart(this.options);
        itemParts.push(itemPart);

        if (partIndex === 0) {
          itemPart.appendIntoPart(this);
        } else {
          itemPart.insertAfterPart(itemParts[partIndex - 1]);
        }
      }

      itemPart.setValue(item);
      itemPart.commit();
      partIndex++;
    }

    if (partIndex < itemParts.length) {
      // Truncate the parts array so _value reflects the current state
      itemParts.length = partIndex;
      this.clear(itemPart && itemPart.endNode);
    }
  }

  clear(startNode = this.startNode) {
    (0, _dom.removeNodes)(this.startNode.parentNode, startNode.nextSibling, this.endNode);
  }

}
/**
 * Implements a boolean attribute, roughly as defined in the HTML
 * specification.
 *
 * If the value is truthy, then the attribute is present with a value of
 * ''. If the value is falsey, the attribute is removed.
 */


exports.NodePart = NodePart;

class BooleanAttributePart {
  constructor(element, name, strings) {
    this.value = undefined;
    this.__pendingValue = undefined;

    if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
      throw new Error('Boolean attributes can only contain a single expression');
    }

    this.element = element;
    this.name = name;
    this.strings = strings;
  }

  setValue(value) {
    this.__pendingValue = value;
  }

  commit() {
    while ((0, _directive.isDirective)(this.__pendingValue)) {
      const directive = this.__pendingValue;
      this.__pendingValue = _part.noChange;
      directive(this);
    }

    if (this.__pendingValue === _part.noChange) {
      return;
    }

    const value = !!this.__pendingValue;

    if (this.value !== value) {
      if (value) {
        this.element.setAttribute(this.name, '');
      } else {
        this.element.removeAttribute(this.name);
      }

      this.value = value;
    }

    this.__pendingValue = _part.noChange;
  }

}
/**
 * Sets attribute values for PropertyParts, so that the value is only set once
 * even if there are multiple parts for a property.
 *
 * If an expression controls the whole property value, then the value is simply
 * assigned to the property under control. If there are string literals or
 * multiple expressions, then the strings are expressions are interpolated into
 * a string first.
 */


exports.BooleanAttributePart = BooleanAttributePart;

class PropertyCommitter extends AttributeCommitter {
  constructor(element, name, strings) {
    super(element, name, strings);
    this.single = strings.length === 2 && strings[0] === '' && strings[1] === '';
  }

  _createPart() {
    return new PropertyPart(this);
  }

  _getValue() {
    if (this.single) {
      return this.parts[0].value;
    }

    return super._getValue();
  }

  commit() {
    if (this.dirty) {
      this.dirty = false; // eslint-disable-next-line @typescript-eslint/no-explicit-any

      this.element[this.name] = this._getValue();
    }
  }

}

exports.PropertyCommitter = PropertyCommitter;

class PropertyPart extends AttributePart {} // Detect event listener options support. If the `capture` property is read
// from the options object, then options are supported. If not, then the third
// argument to add/removeEventListener is interpreted as the boolean capture
// value so we should only pass the `capture` property.


exports.PropertyPart = PropertyPart;
let eventOptionsSupported = false; // Wrap into an IIFE because MS Edge <= v41 does not support having try/catch
// blocks right into the body of a module

(() => {
  try {
    const options = {
      get capture() {
        eventOptionsSupported = true;
        return false;
      }

    }; // eslint-disable-next-line @typescript-eslint/no-explicit-any

    window.addEventListener('test', options, options); // eslint-disable-next-line @typescript-eslint/no-explicit-any

    window.removeEventListener('test', options, options);
  } catch (_e) {// event options not supported
  }
})();

class EventPart {
  constructor(element, eventName, eventContext) {
    this.value = undefined;
    this.__pendingValue = undefined;
    this.element = element;
    this.eventName = eventName;
    this.eventContext = eventContext;

    this.__boundHandleEvent = e => this.handleEvent(e);
  }

  setValue(value) {
    this.__pendingValue = value;
  }

  commit() {
    while ((0, _directive.isDirective)(this.__pendingValue)) {
      const directive = this.__pendingValue;
      this.__pendingValue = _part.noChange;
      directive(this);
    }

    if (this.__pendingValue === _part.noChange) {
      return;
    }

    const newListener = this.__pendingValue;
    const oldListener = this.value;
    const shouldRemoveListener = newListener == null || oldListener != null && (newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive);
    const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);

    if (shouldRemoveListener) {
      this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options);
    }

    if (shouldAddListener) {
      this.__options = getOptions(newListener);
      this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options);
    }

    this.value = newListener;
    this.__pendingValue = _part.noChange;
  }

  handleEvent(event) {
    if (typeof this.value === 'function') {
      this.value.call(this.eventContext || this.element, event);
    } else {
      this.value.handleEvent(event);
    }
  }

} // We copy options because of the inconsistent behavior of browsers when reading
// the third argument of add/removeEventListener. IE11 doesn't support options
// at all. Chrome 41 only reads `capture` if the argument is an object.


exports.EventPart = EventPart;

const getOptions = o => o && (eventOptionsSupported ? {
  capture: o.capture,
  passive: o.passive,
  once: o.once
} : o.capture);
},{"./directive.js":"../node_modules/lit-html/lib/directive.js","./dom.js":"../node_modules/lit-html/lib/dom.js","./part.js":"../node_modules/lit-html/lib/part.js","./template-instance.js":"../node_modules/lit-html/lib/template-instance.js","./template-result.js":"../node_modules/lit-html/lib/template-result.js","./template.js":"../node_modules/lit-html/lib/template.js"}],"../node_modules/lit-html/lib/default-template-processor.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultTemplateProcessor = exports.DefaultTemplateProcessor = void 0;

var _parts = require("./parts.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * Creates Parts when a template is instantiated.
 */
class DefaultTemplateProcessor {
  /**
   * Create parts for an attribute-position binding, given the event, attribute
   * name, and string literals.
   *
   * @param element The element containing the binding
   * @param name  The attribute name
   * @param strings The string literals. There are always at least two strings,
   *   event for fully-controlled bindings with a single expression.
   */
  handleAttributeExpressions(element, name, strings, options) {
    const prefix = name[0];

    if (prefix === '.') {
      const committer = new _parts.PropertyCommitter(element, name.slice(1), strings);
      return committer.parts;
    }

    if (prefix === '@') {
      return [new _parts.EventPart(element, name.slice(1), options.eventContext)];
    }

    if (prefix === '?') {
      return [new _parts.BooleanAttributePart(element, name.slice(1), strings)];
    }

    const committer = new _parts.AttributeCommitter(element, name, strings);
    return committer.parts;
  }
  /**
   * Create parts for a text-position binding.
   * @param templateFactory
   */


  handleTextExpression(options) {
    return new _parts.NodePart(options);
  }

}

exports.DefaultTemplateProcessor = DefaultTemplateProcessor;
const defaultTemplateProcessor = new DefaultTemplateProcessor();
exports.defaultTemplateProcessor = defaultTemplateProcessor;
},{"./parts.js":"../node_modules/lit-html/lib/parts.js"}],"../node_modules/lit-html/lib/template-factory.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templateFactory = templateFactory;
exports.templateCaches = void 0;

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * The default TemplateFactory which caches Templates keyed on
 * result.type and result.strings.
 */
function templateFactory(result) {
  let templateCache = templateCaches.get(result.type);

  if (templateCache === undefined) {
    templateCache = {
      stringsArray: new WeakMap(),
      keyString: new Map()
    };
    templateCaches.set(result.type, templateCache);
  }

  let template = templateCache.stringsArray.get(result.strings);

  if (template !== undefined) {
    return template;
  } // If the TemplateStringsArray is new, generate a key from the strings
  // This key is shared between all templates with identical content


  const key = result.strings.join(_template.marker); // Check if we already have a Template for this key

  template = templateCache.keyString.get(key);

  if (template === undefined) {
    // If we have not seen this key before, create a new Template
    template = new _template.Template(result, result.getTemplateElement()); // Cache the Template for this key

    templateCache.keyString.set(key, template);
  } // Cache all future queries for this TemplateStringsArray


  templateCache.stringsArray.set(result.strings, template);
  return template;
}

const templateCaches = new Map();
exports.templateCaches = templateCaches;
},{"./template.js":"../node_modules/lit-html/lib/template.js"}],"../node_modules/lit-html/lib/render.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = exports.parts = void 0;

var _dom = require("./dom.js");

var _parts = require("./parts.js");

var _templateFactory = require("./template-factory.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const parts = new WeakMap();
/**
 * Renders a template result or other value to a container.
 *
 * To update a container with new values, reevaluate the template literal and
 * call `render` with the new result.
 *
 * @param result Any value renderable by NodePart - typically a TemplateResult
 *     created by evaluating a template tag like `html` or `svg`.
 * @param container A DOM parent to render to. The entire contents are either
 *     replaced, or efficiently updated if the same result type was previous
 *     rendered there.
 * @param options RenderOptions for the entire render tree rendered to this
 *     container. Render options must *not* change between renders to the same
 *     container, as those changes will not effect previously rendered DOM.
 */

exports.parts = parts;

const render = (result, container, options) => {
  let part = parts.get(container);

  if (part === undefined) {
    (0, _dom.removeNodes)(container, container.firstChild);
    parts.set(container, part = new _parts.NodePart(Object.assign({
      templateFactory: _templateFactory.templateFactory
    }, options)));
    part.appendInto(container);
  }

  part.setValue(result);
  part.commit();
};

exports.render = render;
},{"./dom.js":"../node_modules/lit-html/lib/dom.js","./parts.js":"../node_modules/lit-html/lib/parts.js","./template-factory.js":"../node_modules/lit-html/lib/template-factory.js"}],"../node_modules/lit-html/lit-html.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "DefaultTemplateProcessor", {
  enumerable: true,
  get: function () {
    return _defaultTemplateProcessor.DefaultTemplateProcessor;
  }
});
Object.defineProperty(exports, "defaultTemplateProcessor", {
  enumerable: true,
  get: function () {
    return _defaultTemplateProcessor.defaultTemplateProcessor;
  }
});
Object.defineProperty(exports, "SVGTemplateResult", {
  enumerable: true,
  get: function () {
    return _templateResult.SVGTemplateResult;
  }
});
Object.defineProperty(exports, "TemplateResult", {
  enumerable: true,
  get: function () {
    return _templateResult.TemplateResult;
  }
});
Object.defineProperty(exports, "directive", {
  enumerable: true,
  get: function () {
    return _directive.directive;
  }
});
Object.defineProperty(exports, "isDirective", {
  enumerable: true,
  get: function () {
    return _directive.isDirective;
  }
});
Object.defineProperty(exports, "removeNodes", {
  enumerable: true,
  get: function () {
    return _dom.removeNodes;
  }
});
Object.defineProperty(exports, "reparentNodes", {
  enumerable: true,
  get: function () {
    return _dom.reparentNodes;
  }
});
Object.defineProperty(exports, "noChange", {
  enumerable: true,
  get: function () {
    return _part.noChange;
  }
});
Object.defineProperty(exports, "nothing", {
  enumerable: true,
  get: function () {
    return _part.nothing;
  }
});
Object.defineProperty(exports, "AttributeCommitter", {
  enumerable: true,
  get: function () {
    return _parts.AttributeCommitter;
  }
});
Object.defineProperty(exports, "AttributePart", {
  enumerable: true,
  get: function () {
    return _parts.AttributePart;
  }
});
Object.defineProperty(exports, "BooleanAttributePart", {
  enumerable: true,
  get: function () {
    return _parts.BooleanAttributePart;
  }
});
Object.defineProperty(exports, "EventPart", {
  enumerable: true,
  get: function () {
    return _parts.EventPart;
  }
});
Object.defineProperty(exports, "isIterable", {
  enumerable: true,
  get: function () {
    return _parts.isIterable;
  }
});
Object.defineProperty(exports, "isPrimitive", {
  enumerable: true,
  get: function () {
    return _parts.isPrimitive;
  }
});
Object.defineProperty(exports, "NodePart", {
  enumerable: true,
  get: function () {
    return _parts.NodePart;
  }
});
Object.defineProperty(exports, "PropertyCommitter", {
  enumerable: true,
  get: function () {
    return _parts.PropertyCommitter;
  }
});
Object.defineProperty(exports, "PropertyPart", {
  enumerable: true,
  get: function () {
    return _parts.PropertyPart;
  }
});
Object.defineProperty(exports, "parts", {
  enumerable: true,
  get: function () {
    return _render.parts;
  }
});
Object.defineProperty(exports, "render", {
  enumerable: true,
  get: function () {
    return _render.render;
  }
});
Object.defineProperty(exports, "templateCaches", {
  enumerable: true,
  get: function () {
    return _templateFactory.templateCaches;
  }
});
Object.defineProperty(exports, "templateFactory", {
  enumerable: true,
  get: function () {
    return _templateFactory.templateFactory;
  }
});
Object.defineProperty(exports, "TemplateInstance", {
  enumerable: true,
  get: function () {
    return _templateInstance.TemplateInstance;
  }
});
Object.defineProperty(exports, "createMarker", {
  enumerable: true,
  get: function () {
    return _template.createMarker;
  }
});
Object.defineProperty(exports, "isTemplatePartActive", {
  enumerable: true,
  get: function () {
    return _template.isTemplatePartActive;
  }
});
Object.defineProperty(exports, "Template", {
  enumerable: true,
  get: function () {
    return _template.Template;
  }
});
exports.svg = exports.html = void 0;

var _defaultTemplateProcessor = require("./lib/default-template-processor.js");

var _templateResult = require("./lib/template-result.js");

var _directive = require("./lib/directive.js");

var _dom = require("./lib/dom.js");

var _part = require("./lib/part.js");

var _parts = require("./lib/parts.js");

var _render = require("./lib/render.js");

var _templateFactory = require("./lib/template-factory.js");

var _templateInstance = require("./lib/template-instance.js");

var _template = require("./lib/template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 *
 * Main lit-html module.
 *
 * Main exports:
 *
 * -  [[html]]
 * -  [[svg]]
 * -  [[render]]
 *
 * @packageDocumentation
 */

/**
 * Do not remove this comment; it keeps typedoc from misplacing the module
 * docs.
 */
// TODO(justinfagnani): remove line when we get NodePart moving methods
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for lit-html usage.
// TODO(justinfagnani): inject version number at build time
if (typeof window !== 'undefined') {
  (window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.3.0');
}
/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 */


const html = (strings, ...values) => new _templateResult.TemplateResult(strings, values, 'html', _defaultTemplateProcessor.defaultTemplateProcessor);
/**
 * Interprets a template literal as an SVG template that can efficiently
 * render to and update a container.
 */


exports.html = html;

const svg = (strings, ...values) => new _templateResult.SVGTemplateResult(strings, values, 'svg', _defaultTemplateProcessor.defaultTemplateProcessor);

exports.svg = svg;
},{"./lib/default-template-processor.js":"../node_modules/lit-html/lib/default-template-processor.js","./lib/template-result.js":"../node_modules/lit-html/lib/template-result.js","./lib/directive.js":"../node_modules/lit-html/lib/directive.js","./lib/dom.js":"../node_modules/lit-html/lib/dom.js","./lib/part.js":"../node_modules/lit-html/lib/part.js","./lib/parts.js":"../node_modules/lit-html/lib/parts.js","./lib/render.js":"../node_modules/lit-html/lib/render.js","./lib/template-factory.js":"../node_modules/lit-html/lib/template-factory.js","./lib/template-instance.js":"../node_modules/lit-html/lib/template-instance.js","./lib/template.js":"../node_modules/lit-html/lib/template.js"}],"views/partials/splash.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _litHtml = require("lit-html");

function _templateObject() {
  const data = _taggedTemplateLiteral(["\n\n  <div class=\"app-splash\">\n    <div class=\"inner\">\n      <img class=\"app-logo\" src=\"/images/logo.svg\" />\n      <sl-spinner style=\"font-size: 2em;\"></sl-spinner>\n    </div>\n  </div>\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

const splash = (0, _litHtml.html)(_templateObject());
var _default = splash;
exports.default = _default;
},{"lit-html":"../node_modules/lit-html/lit-html.js"}],"../node_modules/gsap/gsap-core.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._getCache = exports._getSetter = exports._missingPlugin = exports._round = exports._roundModifier = exports._config = exports._ticker = exports._plugins = exports._checkPlugin = exports._replaceRandom = exports._colorStringFilter = exports._sortPropTweensByPriority = exports._forEachName = exports._removeLinkedListItem = exports._setDefaults = exports._relExp = exports._renderComplexString = exports._isUndefined = exports._isString = exports._numWithUnitExp = exports._numExp = exports._getProperty = exports.shuffle = exports.interpolate = exports.unitize = exports.pipe = exports.mapRange = exports.toArray = exports.splitColor = exports.clamp = exports.getUnit = exports.normalize = exports.snap = exports.random = exports.distribute = exports.wrapYoyo = exports.wrap = exports.Circ = exports.Expo = exports.Sine = exports.Bounce = exports.SteppedEase = exports.Back = exports.Elastic = exports.Strong = exports.Quint = exports.Quart = exports.Cubic = exports.Quad = exports.Linear = exports.Power4 = exports.Power3 = exports.Power2 = exports.Power1 = exports.Power0 = exports.default = exports.gsap = exports.PropTween = exports.TweenLite = exports.TweenMax = exports.Tween = exports.TimelineLite = exports.TimelineMax = exports.Timeline = exports.Animation = exports.GSCache = void 0;

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}
/*!
 * GSAP 3.6.0
 * https://greensock.com
 *
 * @license Copyright 2008-2021, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/

/* eslint-disable */


var _config = {
  autoSleep: 120,
  force3D: "auto",
  nullTargetWarn: 1,
  units: {
    lineHeight: ""
  }
},
    _defaults = {
  duration: .5,
  overwrite: false,
  delay: 0
},
    _suppressOverwrites,
    _bigNum = 1e8,
    _tinyNum = 1 / _bigNum,
    _2PI = Math.PI * 2,
    _HALF_PI = _2PI / 4,
    _gsID = 0,
    _sqrt = Math.sqrt,
    _cos = Math.cos,
    _sin = Math.sin,
    _isString = function _isString(value) {
  return typeof value === "string";
},
    _isFunction = function _isFunction(value) {
  return typeof value === "function";
},
    _isNumber = function _isNumber(value) {
  return typeof value === "number";
},
    _isUndefined = function _isUndefined(value) {
  return typeof value === "undefined";
},
    _isObject = function _isObject(value) {
  return typeof value === "object";
},
    _isNotFalse = function _isNotFalse(value) {
  return value !== false;
},
    _windowExists = function _windowExists() {
  return typeof window !== "undefined";
},
    _isFuncOrString = function _isFuncOrString(value) {
  return _isFunction(value) || _isString(value);
},
    _isTypedArray = typeof ArrayBuffer === "function" && ArrayBuffer.isView || function () {},
    // note: IE10 has ArrayBuffer, but NOT ArrayBuffer.isView().
_isArray = Array.isArray,
    _strictNumExp = /(?:-?\.?\d|\.)+/gi,
    //only numbers (including negatives and decimals) but NOT relative values.
_numExp = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,
    //finds any numbers, including ones that start with += or -=, negative numbers, and ones in scientific notation like 1e-8.
_numWithUnitExp = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g,
    _complexStringNumExp = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,
    //duplicate so that while we're looping through matches from exec(), it doesn't contaminate the lastIndex of _numExp which we use to search for colors too.
_relExp = /[+-]=-?[.\d]+/,
    _delimitedValueExp = /[#\-+.]*\b[a-z\d-=+%.]+/gi,
    _unitExp = /[\d.+\-=]+(?:e[-+]\d*)*/i,
    _globalTimeline,
    _win,
    _coreInitted,
    _doc,
    _globals = {},
    _installScope = {},
    _coreReady,
    _install = function _install(scope) {
  return (_installScope = _merge(scope, _globals)) && gsap;
},
    _missingPlugin = function _missingPlugin(property, value) {
  return console.warn("Invalid property", property, "set to", value, "Missing plugin? gsap.registerPlugin()");
},
    _warn = function _warn(message, suppress) {
  return !suppress && console.warn(message);
},
    _addGlobal = function _addGlobal(name, obj) {
  return name && (_globals[name] = obj) && _installScope && (_installScope[name] = obj) || _globals;
},
    _emptyFunc = function _emptyFunc() {
  return 0;
},
    _reservedProps = {},
    _lazyTweens = [],
    _lazyLookup = {},
    _lastRenderedFrame,
    _plugins = {},
    _effects = {},
    _nextGCFrame = 30,
    _harnessPlugins = [],
    _callbackNames = "",
    _harness = function _harness(targets) {
  var target = targets[0],
      harnessPlugin,
      i;
  _isObject(target) || _isFunction(target) || (targets = [targets]);

  if (!(harnessPlugin = (target._gsap || {}).harness)) {
    // find the first target with a harness. We assume targets passed into an animation will be of similar type, meaning the same kind of harness can be used for them all (performance optimization)
    i = _harnessPlugins.length;

    while (i-- && !_harnessPlugins[i].targetTest(target)) {}

    harnessPlugin = _harnessPlugins[i];
  }

  i = targets.length;

  while (i--) {
    targets[i] && (targets[i]._gsap || (targets[i]._gsap = new GSCache(targets[i], harnessPlugin))) || targets.splice(i, 1);
  }

  return targets;
},
    _getCache = function _getCache(target) {
  return target._gsap || _harness(toArray(target))[0]._gsap;
},
    _getProperty = function _getProperty(target, property, v) {
  return (v = target[property]) && _isFunction(v) ? target[property]() : _isUndefined(v) && target.getAttribute && target.getAttribute(property) || v;
},
    _forEachName = function _forEachName(names, func) {
  return (names = names.split(",")).forEach(func) || names;
},
    //split a comma-delimited list of names into an array, then run a forEach() function and return the split array (this is just a way to consolidate/shorten some code).
_round = function _round(value) {
  return Math.round(value * 100000) / 100000 || 0;
},
    _arrayContainsAny = function _arrayContainsAny(toSearch, toFind) {
  //searches one array to find matches for any of the items in the toFind array. As soon as one is found, it returns true. It does NOT return all the matches; it's simply a boolean search.
  var l = toFind.length,
      i = 0;

  for (; toSearch.indexOf(toFind[i]) < 0 && ++i < l;) {}

  return i < l;
},
    _parseVars = function _parseVars(params, type, parent) {
  //reads the arguments passed to one of the key methods and figures out if the user is defining things with the OLD/legacy syntax where the duration is the 2nd parameter, and then it adjusts things accordingly and spits back the corrected vars object (with the duration added if necessary, as well as runBackwards or startAt or immediateRender). type 0 = to()/staggerTo(), 1 = from()/staggerFrom(), 2 = fromTo()/staggerFromTo()
  var isLegacy = _isNumber(params[1]),
      varsIndex = (isLegacy ? 2 : 1) + (type < 2 ? 0 : 1),
      vars = params[varsIndex],
      irVars;

  isLegacy && (vars.duration = params[1]);
  vars.parent = parent;

  if (type) {
    irVars = vars;

    while (parent && !("immediateRender" in irVars)) {
      // inheritance hasn't happened yet, but someone may have set a default in an ancestor timeline. We could do vars.immediateRender = _isNotFalse(_inheritDefaults(vars).immediateRender) but that'd exact a slight performance penalty because _inheritDefaults() also runs in the Tween constructor. We're paying a small kb price here to gain speed.
      irVars = parent.vars.defaults || {};
      parent = _isNotFalse(parent.vars.inherit) && parent.parent;
    }

    vars.immediateRender = _isNotFalse(irVars.immediateRender);
    type < 2 ? vars.runBackwards = 1 : vars.startAt = params[varsIndex - 1]; // "from" vars
  }

  return vars;
},
    _lazyRender = function _lazyRender() {
  var l = _lazyTweens.length,
      a = _lazyTweens.slice(0),
      i,
      tween;

  _lazyLookup = {};
  _lazyTweens.length = 0;

  for (i = 0; i < l; i++) {
    tween = a[i];
    tween && tween._lazy && (tween.render(tween._lazy[0], tween._lazy[1], true)._lazy = 0);
  }
},
    _lazySafeRender = function _lazySafeRender(animation, time, suppressEvents, force) {
  _lazyTweens.length && _lazyRender();
  animation.render(time, suppressEvents, force);
  _lazyTweens.length && _lazyRender(); //in case rendering caused any tweens to lazy-init, we should render them because typically when someone calls seek() or time() or progress(), they expect an immediate render.
},
    _numericIfPossible = function _numericIfPossible(value) {
  var n = parseFloat(value);
  return (n || n === 0) && (value + "").match(_delimitedValueExp).length < 2 ? n : _isString(value) ? value.trim() : value;
},
    _passThrough = function _passThrough(p) {
  return p;
},
    _setDefaults = function _setDefaults(obj, defaults) {
  for (var p in defaults) {
    p in obj || (obj[p] = defaults[p]);
  }

  return obj;
},
    _setKeyframeDefaults = function _setKeyframeDefaults(obj, defaults) {
  for (var p in defaults) {
    p in obj || p === "duration" || p === "ease" || (obj[p] = defaults[p]);
  }
},
    _merge = function _merge(base, toMerge) {
  for (var p in toMerge) {
    base[p] = toMerge[p];
  }

  return base;
},
    _mergeDeep = function _mergeDeep(base, toMerge) {
  for (var p in toMerge) {
    p !== "__proto__" && p !== "constructor" && p !== "prototype" && (base[p] = _isObject(toMerge[p]) ? _mergeDeep(base[p] || (base[p] = {}), toMerge[p]) : toMerge[p]);
  }

  return base;
},
    _copyExcluding = function _copyExcluding(obj, excluding) {
  var copy = {},
      p;

  for (p in obj) {
    p in excluding || (copy[p] = obj[p]);
  }

  return copy;
},
    _inheritDefaults = function _inheritDefaults(vars) {
  var parent = vars.parent || _globalTimeline,
      func = vars.keyframes ? _setKeyframeDefaults : _setDefaults;

  if (_isNotFalse(vars.inherit)) {
    while (parent) {
      func(vars, parent.vars.defaults);
      parent = parent.parent || parent._dp;
    }
  }

  return vars;
},
    _arraysMatch = function _arraysMatch(a1, a2) {
  var i = a1.length,
      match = i === a2.length;

  while (match && i-- && a1[i] === a2[i]) {}

  return i < 0;
},
    _addLinkedListItem = function _addLinkedListItem(parent, child, firstProp, lastProp, sortBy) {
  if (firstProp === void 0) {
    firstProp = "_first";
  }

  if (lastProp === void 0) {
    lastProp = "_last";
  }

  var prev = parent[lastProp],
      t;

  if (sortBy) {
    t = child[sortBy];

    while (prev && prev[sortBy] > t) {
      prev = prev._prev;
    }
  }

  if (prev) {
    child._next = prev._next;
    prev._next = child;
  } else {
    child._next = parent[firstProp];
    parent[firstProp] = child;
  }

  if (child._next) {
    child._next._prev = child;
  } else {
    parent[lastProp] = child;
  }

  child._prev = prev;
  child.parent = child._dp = parent;
  return child;
},
    _removeLinkedListItem = function _removeLinkedListItem(parent, child, firstProp, lastProp) {
  if (firstProp === void 0) {
    firstProp = "_first";
  }

  if (lastProp === void 0) {
    lastProp = "_last";
  }

  var prev = child._prev,
      next = child._next;

  if (prev) {
    prev._next = next;
  } else if (parent[firstProp] === child) {
    parent[firstProp] = next;
  }

  if (next) {
    next._prev = prev;
  } else if (parent[lastProp] === child) {
    parent[lastProp] = prev;
  }

  child._next = child._prev = child.parent = null; // don't delete the _dp just so we can revert if necessary. But parent should be null to indicate the item isn't in a linked list.
},
    _removeFromParent = function _removeFromParent(child, onlyIfParentHasAutoRemove) {
  child.parent && (!onlyIfParentHasAutoRemove || child.parent.autoRemoveChildren) && child.parent.remove(child);
  child._act = 0;
},
    _uncache = function _uncache(animation, child) {
  if (animation && (!child || child._end > animation._dur || child._start < 0)) {
    // performance optimization: if a child animation is passed in we should only uncache if that child EXTENDS the animation (its end time is beyond the end)
    var a = animation;

    while (a) {
      a._dirty = 1;
      a = a.parent;
    }
  }

  return animation;
},
    _recacheAncestors = function _recacheAncestors(animation) {
  var parent = animation.parent;

  while (parent && parent.parent) {
    //sometimes we must force a re-sort of all children and update the duration/totalDuration of all ancestor timelines immediately in case, for example, in the middle of a render loop, one tween alters another tween's timeScale which shoves its startTime before 0, forcing the parent timeline to shift around and shiftChildren() which could affect that next tween's render (startTime). Doesn't matter for the root timeline though.
    parent._dirty = 1;
    parent.totalDuration();
    parent = parent.parent;
  }

  return animation;
},
    _hasNoPausedAncestors = function _hasNoPausedAncestors(animation) {
  return !animation || animation._ts && _hasNoPausedAncestors(animation.parent);
},
    _elapsedCycleDuration = function _elapsedCycleDuration(animation) {
  return animation._repeat ? _animationCycle(animation._tTime, animation = animation.duration() + animation._rDelay) * animation : 0;
},
    // feed in the totalTime and cycleDuration and it'll return the cycle (iteration minus 1) and if the playhead is exactly at the very END, it will NOT bump up to the next cycle.
_animationCycle = function _animationCycle(tTime, cycleDuration) {
  var whole = Math.floor(tTime /= cycleDuration);
  return tTime && whole === tTime ? whole - 1 : whole;
},
    _parentToChildTotalTime = function _parentToChildTotalTime(parentTime, child) {
  return (parentTime - child._start) * child._ts + (child._ts >= 0 ? 0 : child._dirty ? child.totalDuration() : child._tDur);
},
    _setEnd = function _setEnd(animation) {
  return animation._end = _round(animation._start + (animation._tDur / Math.abs(animation._ts || animation._rts || _tinyNum) || 0));
},
    _alignPlayhead = function _alignPlayhead(animation, totalTime) {
  // adjusts the animation's _start and _end according to the provided totalTime (only if the parent's smoothChildTiming is true and the animation isn't paused). It doesn't do any rendering or forcing things back into parent timelines, etc. - that's what totalTime() is for.
  var parent = animation._dp;

  if (parent && parent.smoothChildTiming && animation._ts) {
    animation._start = _round(parent._time - (animation._ts > 0 ? totalTime / animation._ts : ((animation._dirty ? animation.totalDuration() : animation._tDur) - totalTime) / -animation._ts));

    _setEnd(animation);

    parent._dirty || _uncache(parent, animation); //for performance improvement. If the parent's cache is already dirty, it already took care of marking the ancestors as dirty too, so skip the function call here.
  }

  return animation;
},

/*
_totalTimeToTime = (clampedTotalTime, duration, repeat, repeatDelay, yoyo) => {
	let cycleDuration = duration + repeatDelay,
		time = _round(clampedTotalTime % cycleDuration);
	if (time > duration) {
		time = duration;
	}
	return (yoyo && (~~(clampedTotalTime / cycleDuration) & 1)) ? duration - time : time;
},
*/
_postAddChecks = function _postAddChecks(timeline, child) {
  var t;

  if (child._time || child._initted && !child._dur) {
    //in case, for example, the _start is moved on a tween that has already rendered. Imagine it's at its end state, then the startTime is moved WAY later (after the end of this timeline), it should render at its beginning.
    t = _parentToChildTotalTime(timeline.rawTime(), child);

    if (!child._dur || _clamp(0, child.totalDuration(), t) - child._tTime > _tinyNum) {
      child.render(t, true);
    }
  } //if the timeline has already ended but the inserted tween/timeline extends the duration, we should enable this timeline again so that it renders properly. We should also align the playhead with the parent timeline's when appropriate.


  if (_uncache(timeline, child)._dp && timeline._initted && timeline._time >= timeline._dur && timeline._ts) {
    //in case any of the ancestors had completed but should now be enabled...
    if (timeline._dur < timeline.duration()) {
      t = timeline;

      while (t._dp) {
        t.rawTime() >= 0 && t.totalTime(t._tTime); //moves the timeline (shifts its startTime) if necessary, and also enables it. If it's currently zero, though, it may not be scheduled to render until later so there's no need to force it to align with the current playhead position. Only move to catch up with the playhead.

        t = t._dp;
      }
    }

    timeline._zTime = -_tinyNum; // helps ensure that the next render() will be forced (crossingStart = true in render()), even if the duration hasn't changed (we're adding a child which would need to get rendered). Definitely an edge case. Note: we MUST do this AFTER the loop above where the totalTime() might trigger a render() because this _addToTimeline() method gets called from the Animation constructor, BEFORE tweens even record their targets, etc. so we wouldn't want things to get triggered in the wrong order.
  }
},
    _addToTimeline = function _addToTimeline(timeline, child, position, skipChecks) {
  child.parent && _removeFromParent(child);
  child._start = _round(position + child._delay);
  child._end = _round(child._start + (child.totalDuration() / Math.abs(child.timeScale()) || 0));

  _addLinkedListItem(timeline, child, "_first", "_last", timeline._sort ? "_start" : 0);

  timeline._recent = child;
  skipChecks || _postAddChecks(timeline, child);
  return timeline;
},
    _scrollTrigger = function _scrollTrigger(animation, trigger) {
  return (_globals.ScrollTrigger || _missingPlugin("scrollTrigger", trigger)) && _globals.ScrollTrigger.create(trigger, animation);
},
    _attemptInitTween = function _attemptInitTween(tween, totalTime, force, suppressEvents) {
  _initTween(tween, totalTime);

  if (!tween._initted) {
    return 1;
  }

  if (!force && tween._pt && (tween._dur && tween.vars.lazy !== false || !tween._dur && tween.vars.lazy) && _lastRenderedFrame !== _ticker.frame) {
    _lazyTweens.push(tween);

    tween._lazy = [totalTime, suppressEvents];
    return 1;
  }
},
    _parentPlayheadIsBeforeStart = function _parentPlayheadIsBeforeStart(_ref) {
  var parent = _ref.parent;
  return parent && parent._ts && parent._initted && !parent._lock && (parent.rawTime() < 0 || _parentPlayheadIsBeforeStart(parent));
},
    // check parent's _lock because when a timeline repeats/yoyos and does its artificial wrapping, we shouldn't force the ratio back to 0
_renderZeroDurationTween = function _renderZeroDurationTween(tween, totalTime, suppressEvents, force) {
  var prevRatio = tween.ratio,
      ratio = totalTime < 0 || !totalTime && (!tween._start && _parentPlayheadIsBeforeStart(tween) || (tween._ts < 0 || tween._dp._ts < 0) && tween.data !== "isFromStart" && tween.data !== "isStart") ? 0 : 1,
      // if the tween or its parent is reversed and the totalTime is 0, we should go to a ratio of 0.
  repeatDelay = tween._rDelay,
      tTime = 0,
      pt,
      iteration,
      prevIteration;

  if (repeatDelay && tween._repeat) {
    // in case there's a zero-duration tween that has a repeat with a repeatDelay
    tTime = _clamp(0, tween._tDur, totalTime);
    iteration = _animationCycle(tTime, repeatDelay);
    prevIteration = _animationCycle(tween._tTime, repeatDelay);
    tween._yoyo && iteration & 1 && (ratio = 1 - ratio);

    if (iteration !== prevIteration) {
      prevRatio = 1 - ratio;
      tween.vars.repeatRefresh && tween._initted && tween.invalidate();
    }
  }

  if (ratio !== prevRatio || force || tween._zTime === _tinyNum || !totalTime && tween._zTime) {
    if (!tween._initted && _attemptInitTween(tween, totalTime, force, suppressEvents)) {
      // if we render the very beginning (time == 0) of a fromTo(), we must force the render (normal tweens wouldn't need to render at a time of 0 when the prevTime was also 0). This is also mandatory to make sure overwriting kicks in immediately.
      return;
    }

    prevIteration = tween._zTime;
    tween._zTime = totalTime || (suppressEvents ? _tinyNum : 0); // when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect.

    suppressEvents || (suppressEvents = totalTime && !prevIteration); // if it was rendered previously at exactly 0 (_zTime) and now the playhead is moving away, DON'T fire callbacks otherwise they'll seem like duplicates.

    tween.ratio = ratio;
    tween._from && (ratio = 1 - ratio);
    tween._time = 0;
    tween._tTime = tTime;
    suppressEvents || _callback(tween, "onStart");
    pt = tween._pt;

    while (pt) {
      pt.r(ratio, pt.d);
      pt = pt._next;
    }

    tween._startAt && totalTime < 0 && tween._startAt.render(totalTime, true, true);
    tween._onUpdate && !suppressEvents && _callback(tween, "onUpdate");
    tTime && tween._repeat && !suppressEvents && tween.parent && _callback(tween, "onRepeat");

    if ((totalTime >= tween._tDur || totalTime < 0) && tween.ratio === ratio) {
      ratio && _removeFromParent(tween, 1);

      if (!suppressEvents) {
        _callback(tween, ratio ? "onComplete" : "onReverseComplete", true);

        tween._prom && tween._prom();
      }
    }
  } else if (!tween._zTime) {
    tween._zTime = totalTime;
  }
},
    _findNextPauseTween = function _findNextPauseTween(animation, prevTime, time) {
  var child;

  if (time > prevTime) {
    child = animation._first;

    while (child && child._start <= time) {
      if (!child._dur && child.data === "isPause" && child._start > prevTime) {
        return child;
      }

      child = child._next;
    }
  } else {
    child = animation._last;

    while (child && child._start >= time) {
      if (!child._dur && child.data === "isPause" && child._start < prevTime) {
        return child;
      }

      child = child._prev;
    }
  }
},
    _setDuration = function _setDuration(animation, duration, skipUncache, leavePlayhead) {
  var repeat = animation._repeat,
      dur = _round(duration) || 0,
      totalProgress = animation._tTime / animation._tDur;
  totalProgress && !leavePlayhead && (animation._time *= dur / animation._dur);
  animation._dur = dur;
  animation._tDur = !repeat ? dur : repeat < 0 ? 1e10 : _round(dur * (repeat + 1) + animation._rDelay * repeat);
  totalProgress && !leavePlayhead ? _alignPlayhead(animation, animation._tTime = animation._tDur * totalProgress) : animation.parent && _setEnd(animation);
  skipUncache || _uncache(animation.parent, animation);
  return animation;
},
    _onUpdateTotalDuration = function _onUpdateTotalDuration(animation) {
  return animation instanceof Timeline ? _uncache(animation) : _setDuration(animation, animation._dur);
},
    _zeroPosition = {
  _start: 0,
  endTime: _emptyFunc
},
    _parsePosition = function _parsePosition(animation, position) {
  var labels = animation.labels,
      recent = animation._recent || _zeroPosition,
      clippedDuration = animation.duration() >= _bigNum ? recent.endTime(false) : animation._dur,
      //in case there's a child that infinitely repeats, users almost never intend for the insertion point of a new child to be based on a SUPER long value like that so we clip it and assume the most recently-added child's endTime should be used instead.
  i,
      offset;

  if (_isString(position) && (isNaN(position) || position in labels)) {
    //if the string is a number like "1", check to see if there's a label with that name, otherwise interpret it as a number (absolute value).
    i = position.charAt(0);

    if (i === "<" || i === ">") {
      return (i === "<" ? recent._start : recent.endTime(recent._repeat >= 0)) + (parseFloat(position.substr(1)) || 0);
    }

    i = position.indexOf("=");

    if (i < 0) {
      position in labels || (labels[position] = clippedDuration);
      return labels[position];
    }

    offset = +(position.charAt(i - 1) + position.substr(i + 1));
    return i > 1 ? _parsePosition(animation, position.substr(0, i - 1)) + offset : clippedDuration + offset;
  }

  return position == null ? clippedDuration : +position;
},
    _conditionalReturn = function _conditionalReturn(value, func) {
  return value || value === 0 ? func(value) : func;
},
    _clamp = function _clamp(min, max, value) {
  return value < min ? min : value > max ? max : value;
},
    getUnit = function getUnit(value) {
  if (typeof value !== "string") {
    return "";
  }

  var v = _unitExp.exec(value);

  return v ? value.substr(v.index + v[0].length) : "";
},
    // note: protect against padded numbers as strings, like "100.100". That shouldn't return "00" as the unit. If it's numeric, return no unit.
clamp = function clamp(min, max, value) {
  return _conditionalReturn(value, function (v) {
    return _clamp(min, max, v);
  });
},
    _slice = [].slice,
    _isArrayLike = function _isArrayLike(value, nonEmpty) {
  return value && _isObject(value) && "length" in value && (!nonEmpty && !value.length || value.length - 1 in value && _isObject(value[0])) && !value.nodeType && value !== _win;
},
    _flatten = function _flatten(ar, leaveStrings, accumulator) {
  if (accumulator === void 0) {
    accumulator = [];
  }

  return ar.forEach(function (value) {
    var _accumulator;

    return _isString(value) && !leaveStrings || _isArrayLike(value, 1) ? (_accumulator = accumulator).push.apply(_accumulator, toArray(value)) : accumulator.push(value);
  }) || accumulator;
},
    //takes any value and returns an array. If it's a string (and leaveStrings isn't true), it'll use document.querySelectorAll() and convert that to an array. It'll also accept iterables like jQuery objects.
toArray = function toArray(value, leaveStrings) {
  return _isString(value) && !leaveStrings && (_coreInitted || !_wake()) ? _slice.call(_doc.querySelectorAll(value), 0) : _isArray(value) ? _flatten(value, leaveStrings) : _isArrayLike(value) ? _slice.call(value, 0) : value ? [value] : [];
},
    shuffle = function shuffle(a) {
  return a.sort(function () {
    return .5 - Math.random();
  });
},
    // alternative that's a bit faster and more reliably diverse but bigger:   for (let j, v, i = a.length; i; j = Math.floor(Math.random() * i), v = a[--i], a[i] = a[j], a[j] = v); return a;
//for distributing values across an array. Can accept a number, a function or (most commonly) a function which can contain the following properties: {base, amount, from, ease, grid, axis, length, each}. Returns a function that expects the following parameters: index, target, array. Recognizes the following
distribute = function distribute(v) {
  if (_isFunction(v)) {
    return v;
  }

  var vars = _isObject(v) ? v : {
    each: v
  },
      //n:1 is just to indicate v was a number; we leverage that later to set v according to the length we get. If a number is passed in, we treat it like the old stagger value where 0.1, for example, would mean that things would be distributed with 0.1 between each element in the array rather than a total "amount" that's chunked out among them all.
  ease = _parseEase(vars.ease),
      from = vars.from || 0,
      base = parseFloat(vars.base) || 0,
      cache = {},
      isDecimal = from > 0 && from < 1,
      ratios = isNaN(from) || isDecimal,
      axis = vars.axis,
      ratioX = from,
      ratioY = from;

  if (_isString(from)) {
    ratioX = ratioY = {
      center: .5,
      edges: .5,
      end: 1
    }[from] || 0;
  } else if (!isDecimal && ratios) {
    ratioX = from[0];
    ratioY = from[1];
  }

  return function (i, target, a) {
    var l = (a || vars).length,
        distances = cache[l],
        originX,
        originY,
        x,
        y,
        d,
        j,
        max,
        min,
        wrapAt;

    if (!distances) {
      wrapAt = vars.grid === "auto" ? 0 : (vars.grid || [1, _bigNum])[1];

      if (!wrapAt) {
        max = -_bigNum;

        while (max < (max = a[wrapAt++].getBoundingClientRect().left) && wrapAt < l) {}

        wrapAt--;
      }

      distances = cache[l] = [];
      originX = ratios ? Math.min(wrapAt, l) * ratioX - .5 : from % wrapAt;
      originY = ratios ? l * ratioY / wrapAt - .5 : from / wrapAt | 0;
      max = 0;
      min = _bigNum;

      for (j = 0; j < l; j++) {
        x = j % wrapAt - originX;
        y = originY - (j / wrapAt | 0);
        distances[j] = d = !axis ? _sqrt(x * x + y * y) : Math.abs(axis === "y" ? y : x);
        d > max && (max = d);
        d < min && (min = d);
      }

      from === "random" && shuffle(distances);
      distances.max = max - min;
      distances.min = min;
      distances.v = l = (parseFloat(vars.amount) || parseFloat(vars.each) * (wrapAt > l ? l - 1 : !axis ? Math.max(wrapAt, l / wrapAt) : axis === "y" ? l / wrapAt : wrapAt) || 0) * (from === "edges" ? -1 : 1);
      distances.b = l < 0 ? base - l : base;
      distances.u = getUnit(vars.amount || vars.each) || 0; //unit

      ease = ease && l < 0 ? _invertEase(ease) : ease;
    }

    l = (distances[i] - distances.min) / distances.max || 0;
    return _round(distances.b + (ease ? ease(l) : l) * distances.v) + distances.u; //round in order to work around floating point errors
  };
},
    _roundModifier = function _roundModifier(v) {
  //pass in 0.1 get a function that'll round to the nearest tenth, or 5 to round to the closest 5, or 0.001 to the closest 1000th, etc.
  var p = v < 1 ? Math.pow(10, (v + "").length - 2) : 1; //to avoid floating point math errors (like 24 * 0.1 == 2.4000000000000004), we chop off at a specific number of decimal places (much faster than toFixed()

  return function (raw) {
    var n = Math.round(parseFloat(raw) / v) * v * p;
    return (n - n % 1) / p + (_isNumber(raw) ? 0 : getUnit(raw)); // n - n % 1 replaces Math.floor() in order to handle negative values properly. For example, Math.floor(-150.00000000000003) is 151!
  };
},
    snap = function snap(snapTo, value) {
  var isArray = _isArray(snapTo),
      radius,
      is2D;

  if (!isArray && _isObject(snapTo)) {
    radius = isArray = snapTo.radius || _bigNum;

    if (snapTo.values) {
      snapTo = toArray(snapTo.values);

      if (is2D = !_isNumber(snapTo[0])) {
        radius *= radius; //performance optimization so we don't have to Math.sqrt() in the loop.
      }
    } else {
      snapTo = _roundModifier(snapTo.increment);
    }
  }

  return _conditionalReturn(value, !isArray ? _roundModifier(snapTo) : _isFunction(snapTo) ? function (raw) {
    is2D = snapTo(raw);
    return Math.abs(is2D - raw) <= radius ? is2D : raw;
  } : function (raw) {
    var x = parseFloat(is2D ? raw.x : raw),
        y = parseFloat(is2D ? raw.y : 0),
        min = _bigNum,
        closest = 0,
        i = snapTo.length,
        dx,
        dy;

    while (i--) {
      if (is2D) {
        dx = snapTo[i].x - x;
        dy = snapTo[i].y - y;
        dx = dx * dx + dy * dy;
      } else {
        dx = Math.abs(snapTo[i] - x);
      }

      if (dx < min) {
        min = dx;
        closest = i;
      }
    }

    closest = !radius || min <= radius ? snapTo[closest] : raw;
    return is2D || closest === raw || _isNumber(raw) ? closest : closest + getUnit(raw);
  });
},
    random = function random(min, max, roundingIncrement, returnFunction) {
  return _conditionalReturn(_isArray(min) ? !max : roundingIncrement === true ? !!(roundingIncrement = 0) : !returnFunction, function () {
    return _isArray(min) ? min[~~(Math.random() * min.length)] : (roundingIncrement = roundingIncrement || 1e-5) && (returnFunction = roundingIncrement < 1 ? Math.pow(10, (roundingIncrement + "").length - 2) : 1) && Math.floor(Math.round((min - roundingIncrement / 2 + Math.random() * (max - min + roundingIncrement * .99)) / roundingIncrement) * roundingIncrement * returnFunction) / returnFunction;
  });
},
    pipe = function pipe() {
  for (var _len = arguments.length, functions = new Array(_len), _key = 0; _key < _len; _key++) {
    functions[_key] = arguments[_key];
  }

  return function (value) {
    return functions.reduce(function (v, f) {
      return f(v);
    }, value);
  };
},
    unitize = function unitize(func, unit) {
  return function (value) {
    return func(parseFloat(value)) + (unit || getUnit(value));
  };
},
    normalize = function normalize(min, max, value) {
  return mapRange(min, max, 0, 1, value);
},
    _wrapArray = function _wrapArray(a, wrapper, value) {
  return _conditionalReturn(value, function (index) {
    return a[~~wrapper(index)];
  });
},
    wrap = function wrap(min, max, value) {
  // NOTE: wrap() CANNOT be an arrow function! A very odd compiling bug causes problems (unrelated to GSAP).
  var range = max - min;
  return _isArray(min) ? _wrapArray(min, wrap(0, min.length), max) : _conditionalReturn(value, function (value) {
    return (range + (value - min) % range) % range + min;
  });
},
    wrapYoyo = function wrapYoyo(min, max, value) {
  var range = max - min,
      total = range * 2;
  return _isArray(min) ? _wrapArray(min, wrapYoyo(0, min.length - 1), max) : _conditionalReturn(value, function (value) {
    value = (total + (value - min) % total) % total || 0;
    return min + (value > range ? total - value : value);
  });
},
    _replaceRandom = function _replaceRandom(value) {
  //replaces all occurrences of random(...) in a string with the calculated random value. can be a range like random(-100, 100, 5) or an array like random([0, 100, 500])
  var prev = 0,
      s = "",
      i,
      nums,
      end,
      isArray;

  while (~(i = value.indexOf("random(", prev))) {
    end = value.indexOf(")", i);
    isArray = value.charAt(i + 7) === "[";
    nums = value.substr(i + 7, end - i - 7).match(isArray ? _delimitedValueExp : _strictNumExp);
    s += value.substr(prev, i - prev) + random(isArray ? nums : +nums[0], isArray ? 0 : +nums[1], +nums[2] || 1e-5);
    prev = end + 1;
  }

  return s + value.substr(prev, value.length - prev);
},
    mapRange = function mapRange(inMin, inMax, outMin, outMax, value) {
  var inRange = inMax - inMin,
      outRange = outMax - outMin;
  return _conditionalReturn(value, function (value) {
    return outMin + ((value - inMin) / inRange * outRange || 0);
  });
},
    interpolate = function interpolate(start, end, progress, mutate) {
  var func = isNaN(start + end) ? 0 : function (p) {
    return (1 - p) * start + p * end;
  };

  if (!func) {
    var isString = _isString(start),
        master = {},
        p,
        i,
        interpolators,
        l,
        il;

    progress === true && (mutate = 1) && (progress = null);

    if (isString) {
      start = {
        p: start
      };
      end = {
        p: end
      };
    } else if (_isArray(start) && !_isArray(end)) {
      interpolators = [];
      l = start.length;
      il = l - 2;

      for (i = 1; i < l; i++) {
        interpolators.push(interpolate(start[i - 1], start[i])); //build the interpolators up front as a performance optimization so that when the function is called many times, it can just reuse them.
      }

      l--;

      func = function func(p) {
        p *= l;
        var i = Math.min(il, ~~p);
        return interpolators[i](p - i);
      };

      progress = end;
    } else if (!mutate) {
      start = _merge(_isArray(start) ? [] : {}, start);
    }

    if (!interpolators) {
      for (p in end) {
        _addPropTween.call(master, start, p, "get", end[p]);
      }

      func = function func(p) {
        return _renderPropTweens(p, master) || (isString ? start.p : start);
      };
    }
  }

  return _conditionalReturn(progress, func);
},
    _getLabelInDirection = function _getLabelInDirection(timeline, fromTime, backward) {
  //used for nextLabel() and previousLabel()
  var labels = timeline.labels,
      min = _bigNum,
      p,
      distance,
      label;

  for (p in labels) {
    distance = labels[p] - fromTime;

    if (distance < 0 === !!backward && distance && min > (distance = Math.abs(distance))) {
      label = p;
      min = distance;
    }
  }

  return label;
},
    _callback = function _callback(animation, type, executeLazyFirst) {
  var v = animation.vars,
      callback = v[type],
      params,
      scope;

  if (!callback) {
    return;
  }

  params = v[type + "Params"];
  scope = v.callbackScope || animation;
  executeLazyFirst && _lazyTweens.length && _lazyRender(); //in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onUpdate on a timeline that reports/checks tweened values.

  return params ? callback.apply(scope, params) : callback.call(scope);
},
    _interrupt = function _interrupt(animation) {
  _removeFromParent(animation);

  animation.progress() < 1 && _callback(animation, "onInterrupt");
  return animation;
},
    _quickTween,
    _createPlugin = function _createPlugin(config) {
  config = !config.name && config["default"] || config; //UMD packaging wraps things oddly, so for example MotionPathHelper becomes {MotionPathHelper:MotionPathHelper, default:MotionPathHelper}.

  var name = config.name,
      isFunc = _isFunction(config),
      Plugin = name && !isFunc && config.init ? function () {
    this._props = [];
  } : config,
      //in case someone passes in an object that's not a plugin, like CustomEase
  instanceDefaults = {
    init: _emptyFunc,
    render: _renderPropTweens,
    add: _addPropTween,
    kill: _killPropTweensOf,
    modifier: _addPluginModifier,
    rawVars: 0
  },
      statics = {
    targetTest: 0,
    get: 0,
    getSetter: _getSetter,
    aliases: {},
    register: 0
  };

  _wake();

  if (config !== Plugin) {
    if (_plugins[name]) {
      return;
    }

    _setDefaults(Plugin, _setDefaults(_copyExcluding(config, instanceDefaults), statics)); //static methods


    _merge(Plugin.prototype, _merge(instanceDefaults, _copyExcluding(config, statics))); //instance methods


    _plugins[Plugin.prop = name] = Plugin;

    if (config.targetTest) {
      _harnessPlugins.push(Plugin);

      _reservedProps[name] = 1;
    }

    name = (name === "css" ? "CSS" : name.charAt(0).toUpperCase() + name.substr(1)) + "Plugin"; //for the global name. "motionPath" should become MotionPathPlugin
  }

  _addGlobal(name, Plugin);

  config.register && config.register(gsap, Plugin, PropTween);
},

/*
 * --------------------------------------------------------------------------------------
 * COLORS
 * --------------------------------------------------------------------------------------
 */
_255 = 255,
    _colorLookup = {
  aqua: [0, _255, _255],
  lime: [0, _255, 0],
  silver: [192, 192, 192],
  black: [0, 0, 0],
  maroon: [128, 0, 0],
  teal: [0, 128, 128],
  blue: [0, 0, _255],
  navy: [0, 0, 128],
  white: [_255, _255, _255],
  olive: [128, 128, 0],
  yellow: [_255, _255, 0],
  orange: [_255, 165, 0],
  gray: [128, 128, 128],
  purple: [128, 0, 128],
  green: [0, 128, 0],
  red: [_255, 0, 0],
  pink: [_255, 192, 203],
  cyan: [0, _255, _255],
  transparent: [_255, _255, _255, 0]
},
    _hue = function _hue(h, m1, m2) {
  h = h < 0 ? h + 1 : h > 1 ? h - 1 : h;
  return (h * 6 < 1 ? m1 + (m2 - m1) * h * 6 : h < .5 ? m2 : h * 3 < 2 ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * _255 + .5 | 0;
},
    splitColor = function splitColor(v, toHSL, forceAlpha) {
  var a = !v ? _colorLookup.black : _isNumber(v) ? [v >> 16, v >> 8 & _255, v & _255] : 0,
      r,
      g,
      b,
      h,
      s,
      l,
      max,
      min,
      d,
      wasHSL;

  if (!a) {
    if (v.substr(-1) === ",") {
      //sometimes a trailing comma is included and we should chop it off (typically from a comma-delimited list of values like a textShadow:"2px 2px 2px blue, 5px 5px 5px rgb(255,0,0)" - in this example "blue," has a trailing comma. We could strip it out inside parseComplex() but we'd need to do it to the beginning and ending values plus it wouldn't provide protection from other potential scenarios like if the user passes in a similar value.
      v = v.substr(0, v.length - 1);
    }

    if (_colorLookup[v]) {
      a = _colorLookup[v];
    } else if (v.charAt(0) === "#") {
      if (v.length < 6) {
        //for shorthand like #9F0 or #9F0F (could have alpha)
        r = v.charAt(1);
        g = v.charAt(2);
        b = v.charAt(3);
        v = "#" + r + r + g + g + b + b + (v.length === 5 ? v.charAt(4) + v.charAt(4) : "");
      }

      if (v.length === 9) {
        // hex with alpha, like #fd5e53ff
        a = parseInt(v.substr(1, 6), 16);
        return [a >> 16, a >> 8 & _255, a & _255, parseInt(v.substr(7), 16) / 255];
      }

      v = parseInt(v.substr(1), 16);
      a = [v >> 16, v >> 8 & _255, v & _255];
    } else if (v.substr(0, 3) === "hsl") {
      a = wasHSL = v.match(_strictNumExp);

      if (!toHSL) {
        h = +a[0] % 360 / 360;
        s = +a[1] / 100;
        l = +a[2] / 100;
        g = l <= .5 ? l * (s + 1) : l + s - l * s;
        r = l * 2 - g;
        a.length > 3 && (a[3] *= 1); //cast as number

        a[0] = _hue(h + 1 / 3, r, g);
        a[1] = _hue(h, r, g);
        a[2] = _hue(h - 1 / 3, r, g);
      } else if (~v.indexOf("=")) {
        //if relative values are found, just return the raw strings with the relative prefixes in place.
        a = v.match(_numExp);
        forceAlpha && a.length < 4 && (a[3] = 1);
        return a;
      }
    } else {
      a = v.match(_strictNumExp) || _colorLookup.transparent;
    }

    a = a.map(Number);
  }

  if (toHSL && !wasHSL) {
    r = a[0] / _255;
    g = a[1] / _255;
    b = a[2] / _255;
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
      h *= 60;
    }

    a[0] = ~~(h + .5);
    a[1] = ~~(s * 100 + .5);
    a[2] = ~~(l * 100 + .5);
  }

  forceAlpha && a.length < 4 && (a[3] = 1);
  return a;
},
    _colorOrderData = function _colorOrderData(v) {
  // strips out the colors from the string, finds all the numeric slots (with units) and returns an array of those. The Array also has a "c" property which is an Array of the index values where the colors belong. This is to help work around issues where there's a mis-matched order of color/numeric data like drop-shadow(#f00 0px 1px 2px) and drop-shadow(0x 1px 2px #f00). This is basically a helper function used in _formatColors()
  var values = [],
      c = [],
      i = -1;
  v.split(_colorExp).forEach(function (v) {
    var a = v.match(_numWithUnitExp) || [];
    values.push.apply(values, a);
    c.push(i += a.length + 1);
  });
  values.c = c;
  return values;
},
    _formatColors = function _formatColors(s, toHSL, orderMatchData) {
  var result = "",
      colors = (s + result).match(_colorExp),
      type = toHSL ? "hsla(" : "rgba(",
      i = 0,
      c,
      shell,
      d,
      l;

  if (!colors) {
    return s;
  }

  colors = colors.map(function (color) {
    return (color = splitColor(color, toHSL, 1)) && type + (toHSL ? color[0] + "," + color[1] + "%," + color[2] + "%," + color[3] : color.join(",")) + ")";
  });

  if (orderMatchData) {
    d = _colorOrderData(s);
    c = orderMatchData.c;

    if (c.join(result) !== d.c.join(result)) {
      shell = s.replace(_colorExp, "1").split(_numWithUnitExp);
      l = shell.length - 1;

      for (; i < l; i++) {
        result += shell[i] + (~c.indexOf(i) ? colors.shift() || type + "0,0,0,0)" : (d.length ? d : colors.length ? colors : orderMatchData).shift());
      }
    }
  }

  if (!shell) {
    shell = s.split(_colorExp);
    l = shell.length - 1;

    for (; i < l; i++) {
      result += shell[i] + colors[i];
    }
  }

  return result + shell[l];
},
    _colorExp = function () {
  var s = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",
      //we'll dynamically build this Regular Expression to conserve file size. After building it, it will be able to find rgb(), rgba(), # (hexadecimal), and named color values like red, blue, purple, etc.,
  p;

  for (p in _colorLookup) {
    s += "|" + p + "\\b";
  }

  return new RegExp(s + ")", "gi");
}(),
    _hslExp = /hsl[a]?\(/,
    _colorStringFilter = function _colorStringFilter(a) {
  var combined = a.join(" "),
      toHSL;
  _colorExp.lastIndex = 0;

  if (_colorExp.test(combined)) {
    toHSL = _hslExp.test(combined);
    a[1] = _formatColors(a[1], toHSL);
    a[0] = _formatColors(a[0], toHSL, _colorOrderData(a[1])); // make sure the order of numbers/colors match with the END value.

    return true;
  }
},

/*
 * --------------------------------------------------------------------------------------
 * TICKER
 * --------------------------------------------------------------------------------------
 */
_tickerActive,
    _ticker = function () {
  var _getTime = Date.now,
      _lagThreshold = 500,
      _adjustedLag = 33,
      _startTime = _getTime(),
      _lastUpdate = _startTime,
      _gap = 1000 / 240,
      _nextTime = _gap,
      _listeners = [],
      _id,
      _req,
      _raf,
      _self,
      _delta,
      _i,
      _tick = function _tick(v) {
    var elapsed = _getTime() - _lastUpdate,
        manual = v === true,
        overlap,
        dispatch,
        time,
        frame;

    elapsed > _lagThreshold && (_startTime += elapsed - _adjustedLag);
    _lastUpdate += elapsed;
    time = _lastUpdate - _startTime;
    overlap = time - _nextTime;

    if (overlap > 0 || manual) {
      frame = ++_self.frame;
      _delta = time - _self.time * 1000;
      _self.time = time = time / 1000;
      _nextTime += overlap + (overlap >= _gap ? 4 : _gap - overlap);
      dispatch = 1;
    }

    manual || (_id = _req(_tick)); //make sure the request is made before we dispatch the "tick" event so that timing is maintained. Otherwise, if processing the "tick" requires a bunch of time (like 15ms) and we're using a setTimeout() that's based on 16.7ms, it'd technically take 31.7ms between frames otherwise.

    if (dispatch) {
      for (_i = 0; _i < _listeners.length; _i++) {
        // use _i and check _listeners.length instead of a variable because a listener could get removed during the loop, and if that happens to an element less than the current index, it'd throw things off in the loop.
        _listeners[_i](time, _delta, frame, v);
      }
    }
  };

  _self = {
    time: 0,
    frame: 0,
    tick: function tick() {
      _tick(true);
    },
    deltaRatio: function deltaRatio(fps) {
      return _delta / (1000 / (fps || 60));
    },
    wake: function wake() {
      if (_coreReady) {
        if (!_coreInitted && _windowExists()) {
          _win = _coreInitted = window;
          _doc = _win.document || {};
          _globals.gsap = gsap;
          (_win.gsapVersions || (_win.gsapVersions = [])).push(gsap.version);

          _install(_installScope || _win.GreenSockGlobals || !_win.gsap && _win || {});

          _raf = _win.requestAnimationFrame;
        }

        _id && _self.sleep();

        _req = _raf || function (f) {
          return setTimeout(f, _nextTime - _self.time * 1000 + 1 | 0);
        };

        _tickerActive = 1;

        _tick(2);
      }
    },
    sleep: function sleep() {
      (_raf ? _win.cancelAnimationFrame : clearTimeout)(_id);
      _tickerActive = 0;
      _req = _emptyFunc;
    },
    lagSmoothing: function lagSmoothing(threshold, adjustedLag) {
      _lagThreshold = threshold || 1 / _tinyNum; //zero should be interpreted as basically unlimited

      _adjustedLag = Math.min(adjustedLag, _lagThreshold, 0);
    },
    fps: function fps(_fps) {
      _gap = 1000 / (_fps || 240);
      _nextTime = _self.time * 1000 + _gap;
    },
    add: function add(callback) {
      _listeners.indexOf(callback) < 0 && _listeners.push(callback);

      _wake();
    },
    remove: function remove(callback) {
      var i;
      ~(i = _listeners.indexOf(callback)) && _listeners.splice(i, 1) && _i >= i && _i--;
    },
    _listeners: _listeners
  };
  return _self;
}(),
    _wake = function _wake() {
  return !_tickerActive && _ticker.wake();
},
    //also ensures the core classes are initialized.

/*
* -------------------------------------------------
* EASING
* -------------------------------------------------
*/
_easeMap = {},
    _customEaseExp = /^[\d.\-M][\d.\-,\s]/,
    _quotesExp = /["']/g,
    _parseObjectInString = function _parseObjectInString(value) {
  //takes a string like "{wiggles:10, type:anticipate})" and turns it into a real object. Notice it ends in ")" and includes the {} wrappers. This is because we only use this function for parsing ease configs and prioritized optimization rather than reusability.
  var obj = {},
      split = value.substr(1, value.length - 3).split(":"),
      key = split[0],
      i = 1,
      l = split.length,
      index,
      val,
      parsedVal;

  for (; i < l; i++) {
    val = split[i];
    index = i !== l - 1 ? val.lastIndexOf(",") : val.length;
    parsedVal = val.substr(0, index);
    obj[key] = isNaN(parsedVal) ? parsedVal.replace(_quotesExp, "").trim() : +parsedVal;
    key = val.substr(index + 1).trim();
  }

  return obj;
},
    _valueInParentheses = function _valueInParentheses(value) {
  var open = value.indexOf("(") + 1,
      close = value.indexOf(")"),
      nested = value.indexOf("(", open);
  return value.substring(open, ~nested && nested < close ? value.indexOf(")", close + 1) : close);
},
    _configEaseFromString = function _configEaseFromString(name) {
  //name can be a string like "elastic.out(1,0.5)", and pass in _easeMap as obj and it'll parse it out and call the actual function like _easeMap.Elastic.easeOut.config(1,0.5). It will also parse custom ease strings as long as CustomEase is loaded and registered (internally as _easeMap._CE).
  var split = (name + "").split("("),
      ease = _easeMap[split[0]];
  return ease && split.length > 1 && ease.config ? ease.config.apply(null, ~name.indexOf("{") ? [_parseObjectInString(split[1])] : _valueInParentheses(name).split(",").map(_numericIfPossible)) : _easeMap._CE && _customEaseExp.test(name) ? _easeMap._CE("", name) : ease;
},
    _invertEase = function _invertEase(ease) {
  return function (p) {
    return 1 - ease(1 - p);
  };
},
    // allow yoyoEase to be set in children and have those affected when the parent/ancestor timeline yoyos.
_propagateYoyoEase = function _propagateYoyoEase(timeline, isYoyo) {
  var child = timeline._first,
      ease;

  while (child) {
    if (child instanceof Timeline) {
      _propagateYoyoEase(child, isYoyo);
    } else if (child.vars.yoyoEase && (!child._yoyo || !child._repeat) && child._yoyo !== isYoyo) {
      if (child.timeline) {
        _propagateYoyoEase(child.timeline, isYoyo);
      } else {
        ease = child._ease;
        child._ease = child._yEase;
        child._yEase = ease;
        child._yoyo = isYoyo;
      }
    }

    child = child._next;
  }
},
    _parseEase = function _parseEase(ease, defaultEase) {
  return !ease ? defaultEase : (_isFunction(ease) ? ease : _easeMap[ease] || _configEaseFromString(ease)) || defaultEase;
},
    _insertEase = function _insertEase(names, easeIn, easeOut, easeInOut) {
  if (easeOut === void 0) {
    easeOut = function easeOut(p) {
      return 1 - easeIn(1 - p);
    };
  }

  if (easeInOut === void 0) {
    easeInOut = function easeInOut(p) {
      return p < .5 ? easeIn(p * 2) / 2 : 1 - easeIn((1 - p) * 2) / 2;
    };
  }

  var ease = {
    easeIn: easeIn,
    easeOut: easeOut,
    easeInOut: easeInOut
  },
      lowercaseName;

  _forEachName(names, function (name) {
    _easeMap[name] = _globals[name] = ease;
    _easeMap[lowercaseName = name.toLowerCase()] = easeOut;

    for (var p in ease) {
      _easeMap[lowercaseName + (p === "easeIn" ? ".in" : p === "easeOut" ? ".out" : ".inOut")] = _easeMap[name + "." + p] = ease[p];
    }
  });

  return ease;
},
    _easeInOutFromOut = function _easeInOutFromOut(easeOut) {
  return function (p) {
    return p < .5 ? (1 - easeOut(1 - p * 2)) / 2 : .5 + easeOut((p - .5) * 2) / 2;
  };
},
    _configElastic = function _configElastic(type, amplitude, period) {
  var p1 = amplitude >= 1 ? amplitude : 1,
      //note: if amplitude is < 1, we simply adjust the period for a more natural feel. Otherwise the math doesn't work right and the curve starts at 1.
  p2 = (period || (type ? .3 : .45)) / (amplitude < 1 ? amplitude : 1),
      p3 = p2 / _2PI * (Math.asin(1 / p1) || 0),
      easeOut = function easeOut(p) {
    return p === 1 ? 1 : p1 * Math.pow(2, -10 * p) * _sin((p - p3) * p2) + 1;
  },
      ease = type === "out" ? easeOut : type === "in" ? function (p) {
    return 1 - easeOut(1 - p);
  } : _easeInOutFromOut(easeOut);

  p2 = _2PI / p2; //precalculate to optimize

  ease.config = function (amplitude, period) {
    return _configElastic(type, amplitude, period);
  };

  return ease;
},
    _configBack = function _configBack(type, overshoot) {
  if (overshoot === void 0) {
    overshoot = 1.70158;
  }

  var easeOut = function easeOut(p) {
    return p ? --p * p * ((overshoot + 1) * p + overshoot) + 1 : 0;
  },
      ease = type === "out" ? easeOut : type === "in" ? function (p) {
    return 1 - easeOut(1 - p);
  } : _easeInOutFromOut(easeOut);

  ease.config = function (overshoot) {
    return _configBack(type, overshoot);
  };

  return ease;
}; // a cheaper (kb and cpu) but more mild way to get a parameterized weighted ease by feeding in a value between -1 (easeIn) and 1 (easeOut) where 0 is linear.
// _weightedEase = ratio => {
// 	let y = 0.5 + ratio / 2;
// 	return p => (2 * (1 - p) * p * y + p * p);
// },
// a stronger (but more expensive kb/cpu) parameterized weighted ease that lets you feed in a value between -1 (easeIn) and 1 (easeOut) where 0 is linear.
// _weightedEaseStrong = ratio => {
// 	ratio = .5 + ratio / 2;
// 	let o = 1 / 3 * (ratio < .5 ? ratio : 1 - ratio),
// 		b = ratio - o,
// 		c = ratio + o;
// 	return p => p === 1 ? p : 3 * b * (1 - p) * (1 - p) * p + 3 * c * (1 - p) * p * p + p * p * p;
// };


exports._ticker = _ticker;
exports._colorStringFilter = _colorStringFilter;
exports.splitColor = splitColor;
exports.interpolate = interpolate;
exports.mapRange = mapRange;
exports._replaceRandom = _replaceRandom;
exports.wrapYoyo = wrapYoyo;
exports.wrap = wrap;
exports.normalize = normalize;
exports.unitize = unitize;
exports.pipe = pipe;
exports.random = random;
exports.snap = snap;
exports._roundModifier = _roundModifier;
exports.distribute = distribute;
exports.shuffle = shuffle;
exports.toArray = toArray;
exports.clamp = clamp;
exports.getUnit = getUnit;
exports._removeLinkedListItem = _removeLinkedListItem;
exports._setDefaults = _setDefaults;
exports._round = _round;
exports._forEachName = _forEachName;
exports._getProperty = _getProperty;
exports._getCache = _getCache;
exports._plugins = _plugins;
exports._missingPlugin = _missingPlugin;
exports._relExp = _relExp;
exports._numWithUnitExp = _numWithUnitExp;
exports._numExp = _numExp;
exports._isUndefined = _isUndefined;
exports._isString = _isString;
exports._config = _config;

_forEachName("Linear,Quad,Cubic,Quart,Quint,Strong", function (name, i) {
  var power = i < 5 ? i + 1 : i;

  _insertEase(name + ",Power" + (power - 1), i ? function (p) {
    return Math.pow(p, power);
  } : function (p) {
    return p;
  }, function (p) {
    return 1 - Math.pow(1 - p, power);
  }, function (p) {
    return p < .5 ? Math.pow(p * 2, power) / 2 : 1 - Math.pow((1 - p) * 2, power) / 2;
  });
});

_easeMap.Linear.easeNone = _easeMap.none = _easeMap.Linear.easeIn;

_insertEase("Elastic", _configElastic("in"), _configElastic("out"), _configElastic());

(function (n, c) {
  var n1 = 1 / c,
      n2 = 2 * n1,
      n3 = 2.5 * n1,
      easeOut = function easeOut(p) {
    return p < n1 ? n * p * p : p < n2 ? n * Math.pow(p - 1.5 / c, 2) + .75 : p < n3 ? n * (p -= 2.25 / c) * p + .9375 : n * Math.pow(p - 2.625 / c, 2) + .984375;
  };

  _insertEase("Bounce", function (p) {
    return 1 - easeOut(1 - p);
  }, easeOut);
})(7.5625, 2.75);

_insertEase("Expo", function (p) {
  return p ? Math.pow(2, 10 * (p - 1)) : 0;
});

_insertEase("Circ", function (p) {
  return -(_sqrt(1 - p * p) - 1);
});

_insertEase("Sine", function (p) {
  return p === 1 ? 1 : -_cos(p * _HALF_PI) + 1;
});

_insertEase("Back", _configBack("in"), _configBack("out"), _configBack());

_easeMap.SteppedEase = _easeMap.steps = _globals.SteppedEase = {
  config: function config(steps, immediateStart) {
    if (steps === void 0) {
      steps = 1;
    }

    var p1 = 1 / steps,
        p2 = steps + (immediateStart ? 0 : 1),
        p3 = immediateStart ? 1 : 0,
        max = 1 - _tinyNum;
    return function (p) {
      return ((p2 * _clamp(0, max, p) | 0) + p3) * p1;
    };
  }
};
_defaults.ease = _easeMap["quad.out"];

_forEachName("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function (name) {
  return _callbackNames += name + "," + name + "Params,";
});
/*
 * --------------------------------------------------------------------------------------
 * CACHE
 * --------------------------------------------------------------------------------------
 */


var GSCache = function GSCache(target, harness) {
  this.id = _gsID++;
  target._gsap = this;
  this.target = target;
  this.harness = harness;
  this.get = harness ? harness.get : _getProperty;
  this.set = harness ? harness.getSetter : _getSetter;
};
/*
 * --------------------------------------------------------------------------------------
 * ANIMATION
 * --------------------------------------------------------------------------------------
 */


exports.GSCache = GSCache;

var Animation = /*#__PURE__*/function () {
  function Animation(vars, time) {
    var parent = vars.parent || _globalTimeline;
    this.vars = vars;
    this._delay = +vars.delay || 0;

    if (this._repeat = vars.repeat === Infinity ? -2 : vars.repeat || 0) {
      // TODO: repeat: Infinity on a timeline's children must flag that timeline internally and affect its totalDuration, otherwise it'll stop in the negative direction when reaching the start.
      this._rDelay = vars.repeatDelay || 0;
      this._yoyo = !!vars.yoyo || !!vars.yoyoEase;
    }

    this._ts = 1;

    _setDuration(this, +vars.duration, 1, 1);

    this.data = vars.data;
    _tickerActive || _ticker.wake();
    parent && _addToTimeline(parent, this, time || time === 0 ? time : parent._time, 1);
    vars.reversed && this.reverse();
    vars.paused && this.paused(true);
  }

  var _proto = Animation.prototype;

  _proto.delay = function delay(value) {
    if (value || value === 0) {
      this.parent && this.parent.smoothChildTiming && this.startTime(this._start + value - this._delay);
      this._delay = value;
      return this;
    }

    return this._delay;
  };

  _proto.duration = function duration(value) {
    return arguments.length ? this.totalDuration(this._repeat > 0 ? value + (value + this._rDelay) * this._repeat : value) : this.totalDuration() && this._dur;
  };

  _proto.totalDuration = function totalDuration(value) {
    if (!arguments.length) {
      return this._tDur;
    }

    this._dirty = 0;
    return _setDuration(this, this._repeat < 0 ? value : (value - this._repeat * this._rDelay) / (this._repeat + 1));
  };

  _proto.totalTime = function totalTime(_totalTime, suppressEvents) {
    _wake();

    if (!arguments.length) {
      return this._tTime;
    }

    var parent = this._dp;

    if (parent && parent.smoothChildTiming && this._ts) {
      _alignPlayhead(this, _totalTime);

      !parent._dp || parent.parent || _postAddChecks(parent, this); // edge case: if this is a child of a timeline that already completed, for example, we must re-activate the parent.
      //in case any of the ancestor timelines had completed but should now be enabled, we should reset their totalTime() which will also ensure that they're lined up properly and enabled. Skip for animations that are on the root (wasteful). Example: a TimelineLite.exportRoot() is performed when there's a paused tween on the root, the export will not complete until that tween is unpaused, but imagine a child gets restarted later, after all [unpaused] tweens have completed. The start of that child would get pushed out, but one of the ancestors may have completed.

      while (parent.parent) {
        if (parent.parent._time !== parent._start + (parent._ts >= 0 ? parent._tTime / parent._ts : (parent.totalDuration() - parent._tTime) / -parent._ts)) {
          parent.totalTime(parent._tTime, true);
        }

        parent = parent.parent;
      }

      if (!this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && _totalTime < this._tDur || this._ts < 0 && _totalTime > 0 || !this._tDur && !_totalTime)) {
        //if the animation doesn't have a parent, put it back into its last parent (recorded as _dp for exactly cases like this). Limit to parents with autoRemoveChildren (like globalTimeline) so that if the user manually removes an animation from a timeline and then alters its playhead, it doesn't get added back in.
        _addToTimeline(this._dp, this, this._start - this._delay);
      }
    }

    if (this._tTime !== _totalTime || !this._dur && !suppressEvents || this._initted && Math.abs(this._zTime) === _tinyNum || !_totalTime && !this._initted && (this.add || this._ptLookup)) {
      // check for _ptLookup on a Tween instance to ensure it has actually finished being instantiated, otherwise if this.reverse() gets called in the Animation constructor, it could trigger a render() here even though the _targets weren't populated, thus when _init() is called there won't be any PropTweens (it'll act like the tween is non-functional)
      this._ts || (this._pTime = _totalTime); // otherwise, if an animation is paused, then the playhead is moved back to zero, then resumed, it'd revert back to the original time at the pause
      //if (!this._lock) { // avoid endless recursion (not sure we need this yet or if it's worth the performance hit)
      //   this._lock = 1;

      _lazySafeRender(this, _totalTime, suppressEvents); //   this._lock = 0;
      //}

    }

    return this;
  };

  _proto.time = function time(value, suppressEvents) {
    return arguments.length ? this.totalTime(Math.min(this.totalDuration(), value + _elapsedCycleDuration(this)) % this._dur || (value ? this._dur : 0), suppressEvents) : this._time; // note: if the modulus results in 0, the playhead could be exactly at the end or the beginning, and we always defer to the END with a non-zero value, otherwise if you set the time() to the very end (duration()), it would render at the START!
  };

  _proto.totalProgress = function totalProgress(value, suppressEvents) {
    return arguments.length ? this.totalTime(this.totalDuration() * value, suppressEvents) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.ratio;
  };

  _proto.progress = function progress(value, suppressEvents) {
    return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - value : value) + _elapsedCycleDuration(this), suppressEvents) : this.duration() ? Math.min(1, this._time / this._dur) : this.ratio;
  };

  _proto.iteration = function iteration(value, suppressEvents) {
    var cycleDuration = this.duration() + this._rDelay;

    return arguments.length ? this.totalTime(this._time + (value - 1) * cycleDuration, suppressEvents) : this._repeat ? _animationCycle(this._tTime, cycleDuration) + 1 : 1;
  } // potential future addition:
  // isPlayingBackwards() {
  // 	let animation = this,
  // 		orientation = 1; // 1 = forward, -1 = backward
  // 	while (animation) {
  // 		orientation *= animation.reversed() || (animation.repeat() && !(animation.iteration() & 1)) ? -1 : 1;
  // 		animation = animation.parent;
  // 	}
  // 	return orientation < 0;
  // }
  ;

  _proto.timeScale = function timeScale(value) {
    if (!arguments.length) {
      return this._rts === -_tinyNum ? 0 : this._rts; // recorded timeScale. Special case: if someone calls reverse() on an animation with timeScale of 0, we assign it -_tinyNum to remember it's reversed.
    }

    if (this._rts === value) {
      return this;
    }

    var tTime = this.parent && this._ts ? _parentToChildTotalTime(this.parent._time, this) : this._tTime; // make sure to do the parentToChildTotalTime() BEFORE setting the new _ts because the old one must be used in that calculation.
    // prioritize rendering where the parent's playhead lines up instead of this._tTime because there could be a tween that's animating another tween's timeScale in the same rendering loop (same parent), thus if the timeScale tween renders first, it would alter _start BEFORE _tTime was set on that tick (in the rendering loop), effectively freezing it until the timeScale tween finishes.

    this._rts = +value || 0;
    this._ts = this._ps || value === -_tinyNum ? 0 : this._rts; // _ts is the functional timeScale which would be 0 if the animation is paused.

    return _recacheAncestors(this.totalTime(_clamp(-this._delay, this._tDur, tTime), true));
  };

  _proto.paused = function paused(value) {
    if (!arguments.length) {
      return this._ps;
    }

    if (this._ps !== value) {
      this._ps = value;

      if (value) {
        this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()); // if the pause occurs during the delay phase, make sure that's factored in when resuming.

        this._ts = this._act = 0; // _ts is the functional timeScale, so a paused tween would effectively have a timeScale of 0. We record the "real" timeScale as _rts (recorded time scale)
      } else {
        _wake();

        this._ts = this._rts; //only defer to _pTime (pauseTime) if tTime is zero. Remember, someone could pause() an animation, then scrub the playhead and resume(). If the parent doesn't have smoothChildTiming, we render at the rawTime() because the startTime won't get updated.

        this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && (this._tTime -= _tinyNum) && Math.abs(this._zTime) !== _tinyNum); // edge case: animation.progress(1).pause().play() wouldn't render again because the playhead is already at the end, but the call to totalTime() below will add it back to its parent...and not remove it again (since removing only happens upon rendering at a new time). Offsetting the _tTime slightly is done simply to cause the final render in totalTime() that'll pop it off its timeline (if autoRemoveChildren is true, of course). Check to make sure _zTime isn't -_tinyNum to avoid an edge case where the playhead is pushed to the end but INSIDE a tween/callback, the timeline itself is paused thus halting rendering and leaving a few unrendered. When resuming, it wouldn't render those otherwise.
      }
    }

    return this;
  };

  _proto.startTime = function startTime(value) {
    if (arguments.length) {
      this._start = value;
      var parent = this.parent || this._dp;
      parent && (parent._sort || !this.parent) && _addToTimeline(parent, this, value - this._delay);
      return this;
    }

    return this._start;
  };

  _proto.endTime = function endTime(includeRepeats) {
    return this._start + (_isNotFalse(includeRepeats) ? this.totalDuration() : this.duration()) / Math.abs(this._ts);
  };

  _proto.rawTime = function rawTime(wrapRepeats) {
    var parent = this.parent || this._dp; // _dp = detatched parent

    return !parent ? this._tTime : wrapRepeats && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : !this._ts ? this._tTime : _parentToChildTotalTime(parent.rawTime(wrapRepeats), this);
  };

  _proto.globalTime = function globalTime(rawTime) {
    var animation = this,
        time = arguments.length ? rawTime : animation.rawTime();

    while (animation) {
      time = animation._start + time / (animation._ts || 1);
      animation = animation._dp;
    }

    return time;
  };

  _proto.repeat = function repeat(value) {
    if (arguments.length) {
      this._repeat = value === Infinity ? -2 : value;
      return _onUpdateTotalDuration(this);
    }

    return this._repeat === -2 ? Infinity : this._repeat;
  };

  _proto.repeatDelay = function repeatDelay(value) {
    if (arguments.length) {
      this._rDelay = value;
      return _onUpdateTotalDuration(this);
    }

    return this._rDelay;
  };

  _proto.yoyo = function yoyo(value) {
    if (arguments.length) {
      this._yoyo = value;
      return this;
    }

    return this._yoyo;
  };

  _proto.seek = function seek(position, suppressEvents) {
    return this.totalTime(_parsePosition(this, position), _isNotFalse(suppressEvents));
  };

  _proto.restart = function restart(includeDelay, suppressEvents) {
    return this.play().totalTime(includeDelay ? -this._delay : 0, _isNotFalse(suppressEvents));
  };

  _proto.play = function play(from, suppressEvents) {
    from != null && this.seek(from, suppressEvents);
    return this.reversed(false).paused(false);
  };

  _proto.reverse = function reverse(from, suppressEvents) {
    from != null && this.seek(from || this.totalDuration(), suppressEvents);
    return this.reversed(true).paused(false);
  };

  _proto.pause = function pause(atTime, suppressEvents) {
    atTime != null && this.seek(atTime, suppressEvents);
    return this.paused(true);
  };

  _proto.resume = function resume() {
    return this.paused(false);
  };

  _proto.reversed = function reversed(value) {
    if (arguments.length) {
      !!value !== this.reversed() && this.timeScale(-this._rts || (value ? -_tinyNum : 0)); // in case timeScale is zero, reversing would have no effect so we use _tinyNum.

      return this;
    }

    return this._rts < 0;
  };

  _proto.invalidate = function invalidate() {
    this._initted = this._act = 0;
    this._zTime = -_tinyNum;
    return this;
  };

  _proto.isActive = function isActive() {
    var parent = this.parent || this._dp,
        start = this._start,
        rawTime;
    return !!(!parent || this._ts && this._initted && parent.isActive() && (rawTime = parent.rawTime(true)) >= start && rawTime < this.endTime(true) - _tinyNum);
  };

  _proto.eventCallback = function eventCallback(type, callback, params) {
    var vars = this.vars;

    if (arguments.length > 1) {
      if (!callback) {
        delete vars[type];
      } else {
        vars[type] = callback;
        params && (vars[type + "Params"] = params);
        type === "onUpdate" && (this._onUpdate = callback);
      }

      return this;
    }

    return vars[type];
  };

  _proto.then = function then(onFulfilled) {
    var self = this;
    return new Promise(function (resolve) {
      var f = _isFunction(onFulfilled) ? onFulfilled : _passThrough,
          _resolve = function _resolve() {
        var _then = self.then;
        self.then = null; // temporarily null the then() method to avoid an infinite loop (see https://github.com/greensock/GSAP/issues/322)

        _isFunction(f) && (f = f(self)) && (f.then || f === self) && (self.then = _then);
        resolve(f);
        self.then = _then;
      };

      if (self._initted && self.totalProgress() === 1 && self._ts >= 0 || !self._tTime && self._ts < 0) {
        _resolve();
      } else {
        self._prom = _resolve;
      }
    });
  };

  _proto.kill = function kill() {
    _interrupt(this);
  };

  return Animation;
}();

exports.Animation = Animation;

_setDefaults(Animation.prototype, {
  _time: 0,
  _start: 0,
  _end: 0,
  _tTime: 0,
  _tDur: 0,
  _dirty: 0,
  _repeat: 0,
  _yoyo: false,
  parent: null,
  _initted: false,
  _rDelay: 0,
  _ts: 1,
  _dp: 0,
  ratio: 0,
  _zTime: -_tinyNum,
  _prom: 0,
  _ps: false,
  _rts: 1
});
/*
 * -------------------------------------------------
 * TIMELINE
 * -------------------------------------------------
 */


var Timeline = /*#__PURE__*/function (_Animation) {
  _inheritsLoose(Timeline, _Animation);

  function Timeline(vars, time) {
    var _this;

    if (vars === void 0) {
      vars = {};
    }

    _this = _Animation.call(this, vars, time) || this;
    _this.labels = {};
    _this.smoothChildTiming = !!vars.smoothChildTiming;
    _this.autoRemoveChildren = !!vars.autoRemoveChildren;
    _this._sort = _isNotFalse(vars.sortChildren);
    _this.parent && _postAddChecks(_this.parent, _assertThisInitialized(_this));
    vars.scrollTrigger && _scrollTrigger(_assertThisInitialized(_this), vars.scrollTrigger);
    return _this;
  }

  var _proto2 = Timeline.prototype;

  _proto2.to = function to(targets, vars, position) {
    new Tween(targets, _parseVars(arguments, 0, this), _parsePosition(this, _isNumber(vars) ? arguments[3] : position));
    return this;
  };

  _proto2.from = function from(targets, vars, position) {
    new Tween(targets, _parseVars(arguments, 1, this), _parsePosition(this, _isNumber(vars) ? arguments[3] : position));
    return this;
  };

  _proto2.fromTo = function fromTo(targets, fromVars, toVars, position) {
    new Tween(targets, _parseVars(arguments, 2, this), _parsePosition(this, _isNumber(fromVars) ? arguments[4] : position));
    return this;
  };

  _proto2.set = function set(targets, vars, position) {
    vars.duration = 0;
    vars.parent = this;
    _inheritDefaults(vars).repeatDelay || (vars.repeat = 0);
    vars.immediateRender = !!vars.immediateRender;
    new Tween(targets, vars, _parsePosition(this, position), 1);
    return this;
  };

  _proto2.call = function call(callback, params, position) {
    return _addToTimeline(this, Tween.delayedCall(0, callback, params), _parsePosition(this, position));
  } //ONLY for backward compatibility! Maybe delete?
  ;

  _proto2.staggerTo = function staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
    vars.duration = duration;
    vars.stagger = vars.stagger || stagger;
    vars.onComplete = onCompleteAll;
    vars.onCompleteParams = onCompleteAllParams;
    vars.parent = this;
    new Tween(targets, vars, _parsePosition(this, position));
    return this;
  };

  _proto2.staggerFrom = function staggerFrom(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
    vars.runBackwards = 1;
    _inheritDefaults(vars).immediateRender = _isNotFalse(vars.immediateRender);
    return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams);
  };

  _proto2.staggerFromTo = function staggerFromTo(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams) {
    toVars.startAt = fromVars;
    _inheritDefaults(toVars).immediateRender = _isNotFalse(toVars.immediateRender);
    return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams);
  };

  _proto2.render = function render(totalTime, suppressEvents, force) {
    var prevTime = this._time,
        tDur = this._dirty ? this.totalDuration() : this._tDur,
        dur = this._dur,
        tTime = this !== _globalTimeline && totalTime > tDur - _tinyNum && totalTime >= 0 ? tDur : totalTime < _tinyNum ? 0 : totalTime,
        crossingStart = this._zTime < 0 !== totalTime < 0 && (this._initted || !dur),
        time,
        child,
        next,
        iteration,
        cycleDuration,
        prevPaused,
        pauseTween,
        timeScale,
        prevStart,
        prevIteration,
        yoyo,
        isYoyo;

    if (tTime !== this._tTime || force || crossingStart) {
      if (prevTime !== this._time && dur) {
        //if totalDuration() finds a child with a negative startTime and smoothChildTiming is true, things get shifted around internally so we need to adjust the time accordingly. For example, if a tween starts at -30 we must shift EVERYTHING forward 30 seconds and move this timeline's startTime backward by 30 seconds so that things align with the playhead (no jump).
        tTime += this._time - prevTime;
        totalTime += this._time - prevTime;
      }

      time = tTime;
      prevStart = this._start;
      timeScale = this._ts;
      prevPaused = !timeScale;

      if (crossingStart) {
        dur || (prevTime = this._zTime); //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect.

        (totalTime || !suppressEvents) && (this._zTime = totalTime);
      }

      if (this._repeat) {
        //adjust the time for repeats and yoyos
        yoyo = this._yoyo;
        cycleDuration = dur + this._rDelay;

        if (this._repeat < -1 && totalTime < 0) {
          return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
        }

        time = _round(tTime % cycleDuration); //round to avoid floating point errors. (4 % 0.8 should be 0 but some browsers report it as 0.79999999!)

        if (tTime === tDur) {
          // the tDur === tTime is for edge cases where there's a lengthy decimal on the duration and it may reach the very end but the time is rendered as not-quite-there (remember, tDur is rounded to 4 decimals whereas dur isn't)
          iteration = this._repeat;
          time = dur;
        } else {
          iteration = ~~(tTime / cycleDuration);

          if (iteration && iteration === tTime / cycleDuration) {
            time = dur;
            iteration--;
          }

          time > dur && (time = dur);
        }

        prevIteration = _animationCycle(this._tTime, cycleDuration);
        !prevTime && this._tTime && prevIteration !== iteration && (prevIteration = iteration); // edge case - if someone does addPause() at the very beginning of a repeating timeline, that pause is technically at the same spot as the end which causes this._time to get set to 0 when the totalTime would normally place the playhead at the end. See https://greensock.com/forums/topic/23823-closing-nav-animation-not-working-on-ie-and-iphone-6-maybe-other-older-browser/?tab=comments#comment-113005

        if (yoyo && iteration & 1) {
          time = dur - time;
          isYoyo = 1;
        }
        /*
        make sure children at the end/beginning of the timeline are rendered properly. If, for example,
        a 3-second long timeline rendered at 2.9 seconds previously, and now renders at 3.2 seconds (which
        would get translated to 2.8 seconds if the timeline yoyos or 0.2 seconds if it just repeats), there
        could be a callback or a short tween that's at 2.95 or 3 seconds in which wouldn't render. So
        we need to push the timeline to the end (and/or beginning depending on its yoyo value). Also we must
        ensure that zero-duration tweens at the very beginning or end of the Timeline work.
        */


        if (iteration !== prevIteration && !this._lock) {
          var rewinding = yoyo && prevIteration & 1,
              doesWrap = rewinding === (yoyo && iteration & 1);
          iteration < prevIteration && (rewinding = !rewinding);
          prevTime = rewinding ? 0 : dur;
          this._lock = 1;
          this.render(prevTime || (isYoyo ? 0 : _round(iteration * cycleDuration)), suppressEvents, !dur)._lock = 0;
          !suppressEvents && this.parent && _callback(this, "onRepeat");
          this.vars.repeatRefresh && !isYoyo && (this.invalidate()._lock = 1);

          if (prevTime !== this._time || prevPaused !== !this._ts) {
            return this;
          }

          dur = this._dur; // in case the duration changed in the onRepeat

          tDur = this._tDur;

          if (doesWrap) {
            this._lock = 2;
            prevTime = rewinding ? dur : -0.0001;
            this.render(prevTime, true);
            this.vars.repeatRefresh && !isYoyo && this.invalidate();
          }

          this._lock = 0;

          if (!this._ts && !prevPaused) {
            return this;
          } //in order for yoyoEase to work properly when there's a stagger, we must swap out the ease in each sub-tween.


          _propagateYoyoEase(this, isYoyo);
        }
      }

      if (this._hasPause && !this._forcing && this._lock < 2) {
        pauseTween = _findNextPauseTween(this, _round(prevTime), _round(time));

        if (pauseTween) {
          tTime -= time - (time = pauseTween._start);
        }
      }

      this._tTime = tTime;
      this._time = time;
      this._act = !timeScale; //as long as it's not paused, force it to be active so that if the user renders independent of the parent timeline, it'll be forced to re-render on the next tick.

      if (!this._initted) {
        this._onUpdate = this.vars.onUpdate;
        this._initted = 1;
        this._zTime = totalTime;
        prevTime = 0; // upon init, the playhead should always go forward; someone could invalidate() a completed timeline and then if they restart(), that would make child tweens render in reverse order which could lock in the wrong starting values if they build on each other, like tl.to(obj, {x: 100}).to(obj, {x: 0}).
      }

      !prevTime && (time || !dur && totalTime >= 0) && !suppressEvents && _callback(this, "onStart");

      if (time >= prevTime && totalTime >= 0) {
        child = this._first;

        while (child) {
          next = child._next;

          if ((child._act || time >= child._start) && child._ts && pauseTween !== child) {
            if (child.parent !== this) {
              // an extreme edge case - the child's render could do something like kill() the "next" one in the linked list, or reparent it. In that case we must re-initiate the whole render to be safe.
              return this.render(totalTime, suppressEvents, force);
            }

            child.render(child._ts > 0 ? (time - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (time - child._start) * child._ts, suppressEvents, force);

            if (time !== this._time || !this._ts && !prevPaused) {
              //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
              pauseTween = 0;
              next && (tTime += this._zTime = -_tinyNum); // it didn't finish rendering, so flag zTime as negative so that so that the next time render() is called it'll be forced (to render any remaining children)

              break;
            }
          }

          child = next;
        }
      } else {
        child = this._last;
        var adjustedTime = totalTime < 0 ? totalTime : time; //when the playhead goes backward beyond the start of this timeline, we must pass that information down to the child animations so that zero-duration tweens know whether to render their starting or ending values.

        while (child) {
          next = child._prev;

          if ((child._act || adjustedTime <= child._end) && child._ts && pauseTween !== child) {
            if (child.parent !== this) {
              // an extreme edge case - the child's render could do something like kill() the "next" one in the linked list, or reparent it. In that case we must re-initiate the whole render to be safe.
              return this.render(totalTime, suppressEvents, force);
            }

            child.render(child._ts > 0 ? (adjustedTime - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (adjustedTime - child._start) * child._ts, suppressEvents, force);

            if (time !== this._time || !this._ts && !prevPaused) {
              //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
              pauseTween = 0;
              next && (tTime += this._zTime = adjustedTime ? -_tinyNum : _tinyNum); // it didn't finish rendering, so adjust zTime so that so that the next time render() is called it'll be forced (to render any remaining children)

              break;
            }
          }

          child = next;
        }
      }

      if (pauseTween && !suppressEvents) {
        this.pause();
        pauseTween.render(time >= prevTime ? 0 : -_tinyNum)._zTime = time >= prevTime ? 1 : -1;

        if (this._ts) {
          //the callback resumed playback! So since we may have held back the playhead due to where the pause is positioned, go ahead and jump to where it's SUPPOSED to be (if no pause happened).
          this._start = prevStart; //if the pause was at an earlier time and the user resumed in the callback, it could reposition the timeline (changing its startTime), throwing things off slightly, so we make sure the _start doesn't shift.

          _setEnd(this);

          return this.render(totalTime, suppressEvents, force);
        }
      }

      this._onUpdate && !suppressEvents && _callback(this, "onUpdate", true);
      if (tTime === tDur && tDur >= this.totalDuration() || !tTime && prevTime) if (prevStart === this._start || Math.abs(timeScale) !== Math.abs(this._ts)) if (!this._lock) {
        (totalTime || !dur) && (tTime === tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1); // don't remove if the timeline is reversed and the playhead isn't at 0, otherwise tl.progress(1).reverse() won't work. Only remove if the playhead is at the end and timeScale is positive, or if the playhead is at 0 and the timeScale is negative.

        if (!suppressEvents && !(totalTime < 0 && !prevTime) && (tTime || prevTime)) {
          _callback(this, tTime === tDur ? "onComplete" : "onReverseComplete", true);

          this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
        }
      }
    }

    return this;
  };

  _proto2.add = function add(child, position) {
    var _this2 = this;

    _isNumber(position) || (position = _parsePosition(this, position));

    if (!(child instanceof Animation)) {
      if (_isArray(child)) {
        child.forEach(function (obj) {
          return _this2.add(obj, position);
        });
        return this;
      }

      if (_isString(child)) {
        return this.addLabel(child, position);
      }

      if (_isFunction(child)) {
        child = Tween.delayedCall(0, child);
      } else {
        return this;
      }
    }

    return this !== child ? _addToTimeline(this, child, position) : this; //don't allow a timeline to be added to itself as a child!
  };

  _proto2.getChildren = function getChildren(nested, tweens, timelines, ignoreBeforeTime) {
    if (nested === void 0) {
      nested = true;
    }

    if (tweens === void 0) {
      tweens = true;
    }

    if (timelines === void 0) {
      timelines = true;
    }

    if (ignoreBeforeTime === void 0) {
      ignoreBeforeTime = -_bigNum;
    }

    var a = [],
        child = this._first;

    while (child) {
      if (child._start >= ignoreBeforeTime) {
        if (child instanceof Tween) {
          tweens && a.push(child);
        } else {
          timelines && a.push(child);
          nested && a.push.apply(a, child.getChildren(true, tweens, timelines));
        }
      }

      child = child._next;
    }

    return a;
  };

  _proto2.getById = function getById(id) {
    var animations = this.getChildren(1, 1, 1),
        i = animations.length;

    while (i--) {
      if (animations[i].vars.id === id) {
        return animations[i];
      }
    }
  };

  _proto2.remove = function remove(child) {
    if (_isString(child)) {
      return this.removeLabel(child);
    }

    if (_isFunction(child)) {
      return this.killTweensOf(child);
    }

    _removeLinkedListItem(this, child);

    if (child === this._recent) {
      this._recent = this._last;
    }

    return _uncache(this);
  };

  _proto2.totalTime = function totalTime(_totalTime2, suppressEvents) {
    if (!arguments.length) {
      return this._tTime;
    }

    this._forcing = 1;

    if (!this._dp && this._ts) {
      //special case for the global timeline (or any other that has no parent or detached parent).
      this._start = _round(_ticker.time - (this._ts > 0 ? _totalTime2 / this._ts : (this.totalDuration() - _totalTime2) / -this._ts));
    }

    _Animation.prototype.totalTime.call(this, _totalTime2, suppressEvents);

    this._forcing = 0;
    return this;
  };

  _proto2.addLabel = function addLabel(label, position) {
    this.labels[label] = _parsePosition(this, position);
    return this;
  };

  _proto2.removeLabel = function removeLabel(label) {
    delete this.labels[label];
    return this;
  };

  _proto2.addPause = function addPause(position, callback, params) {
    var t = Tween.delayedCall(0, callback || _emptyFunc, params);
    t.data = "isPause";
    this._hasPause = 1;
    return _addToTimeline(this, t, _parsePosition(this, position));
  };

  _proto2.removePause = function removePause(position) {
    var child = this._first;
    position = _parsePosition(this, position);

    while (child) {
      if (child._start === position && child.data === "isPause") {
        _removeFromParent(child);
      }

      child = child._next;
    }
  };

  _proto2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
    var tweens = this.getTweensOf(targets, onlyActive),
        i = tweens.length;

    while (i--) {
      _overwritingTween !== tweens[i] && tweens[i].kill(targets, props);
    }

    return this;
  };

  _proto2.getTweensOf = function getTweensOf(targets, onlyActive) {
    var a = [],
        parsedTargets = toArray(targets),
        child = this._first,
        isGlobalTime = _isNumber(onlyActive),
        // a number is interpreted as a global time. If the animation spans
    children;

    while (child) {
      if (child instanceof Tween) {
        if (_arrayContainsAny(child._targets, parsedTargets) && (isGlobalTime ? (!_overwritingTween || child._initted && child._ts) && child.globalTime(0) <= onlyActive && child.globalTime(child.totalDuration()) > onlyActive : !onlyActive || child.isActive())) {
          // note: if this is for overwriting, it should only be for tweens that aren't paused and are initted.
          a.push(child);
        }
      } else if ((children = child.getTweensOf(parsedTargets, onlyActive)).length) {
        a.push.apply(a, children);
      }

      child = child._next;
    }

    return a;
  } // potential future feature - targets() on timelines
  // targets() {
  // 	let result = [];
  // 	this.getChildren(true, true, false).forEach(t => result.push(...t.targets()));
  // 	return result;
  // }
  ;

  _proto2.tweenTo = function tweenTo(position, vars) {
    vars = vars || {};

    var tl = this,
        endTime = _parsePosition(tl, position),
        _vars = vars,
        startAt = _vars.startAt,
        _onStart = _vars.onStart,
        onStartParams = _vars.onStartParams,
        immediateRender = _vars.immediateRender,
        tween = Tween.to(tl, _setDefaults({
      ease: "none",
      lazy: false,
      immediateRender: false,
      time: endTime,
      overwrite: "auto",
      duration: vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale()) || _tinyNum,
      onStart: function onStart() {
        tl.pause();
        var duration = vars.duration || Math.abs((endTime - tl._time) / tl.timeScale());
        tween._dur !== duration && _setDuration(tween, duration, 0, 1).render(tween._time, true, true);
        _onStart && _onStart.apply(tween, onStartParams || []); //in case the user had an onStart in the vars - we don't want to overwrite it.
      }
    }, vars));

    return immediateRender ? tween.render(0) : tween;
  };

  _proto2.tweenFromTo = function tweenFromTo(fromPosition, toPosition, vars) {
    return this.tweenTo(toPosition, _setDefaults({
      startAt: {
        time: _parsePosition(this, fromPosition)
      }
    }, vars));
  };

  _proto2.recent = function recent() {
    return this._recent;
  };

  _proto2.nextLabel = function nextLabel(afterTime) {
    if (afterTime === void 0) {
      afterTime = this._time;
    }

    return _getLabelInDirection(this, _parsePosition(this, afterTime));
  };

  _proto2.previousLabel = function previousLabel(beforeTime) {
    if (beforeTime === void 0) {
      beforeTime = this._time;
    }

    return _getLabelInDirection(this, _parsePosition(this, beforeTime), 1);
  };

  _proto2.currentLabel = function currentLabel(value) {
    return arguments.length ? this.seek(value, true) : this.previousLabel(this._time + _tinyNum);
  };

  _proto2.shiftChildren = function shiftChildren(amount, adjustLabels, ignoreBeforeTime) {
    if (ignoreBeforeTime === void 0) {
      ignoreBeforeTime = 0;
    }

    var child = this._first,
        labels = this.labels,
        p;

    while (child) {
      if (child._start >= ignoreBeforeTime) {
        child._start += amount;
        child._end += amount;
      }

      child = child._next;
    }

    if (adjustLabels) {
      for (p in labels) {
        if (labels[p] >= ignoreBeforeTime) {
          labels[p] += amount;
        }
      }
    }

    return _uncache(this);
  };

  _proto2.invalidate = function invalidate() {
    var child = this._first;
    this._lock = 0;

    while (child) {
      child.invalidate();
      child = child._next;
    }

    return _Animation.prototype.invalidate.call(this);
  };

  _proto2.clear = function clear(includeLabels) {
    if (includeLabels === void 0) {
      includeLabels = true;
    }

    var child = this._first,
        next;

    while (child) {
      next = child._next;
      this.remove(child);
      child = next;
    }

    this._dp && (this._time = this._tTime = this._pTime = 0);
    includeLabels && (this.labels = {});
    return _uncache(this);
  };

  _proto2.totalDuration = function totalDuration(value) {
    var max = 0,
        self = this,
        child = self._last,
        prevStart = _bigNum,
        prev,
        start,
        parent;

    if (arguments.length) {
      return self.timeScale((self._repeat < 0 ? self.duration() : self.totalDuration()) / (self.reversed() ? -value : value));
    }

    if (self._dirty) {
      parent = self.parent;

      while (child) {
        prev = child._prev; //record it here in case the tween changes position in the sequence...

        child._dirty && child.totalDuration(); //could change the tween._startTime, so make sure the animation's cache is clean before analyzing it.

        start = child._start;

        if (start > prevStart && self._sort && child._ts && !self._lock) {
          //in case one of the tweens shifted out of order, it needs to be re-inserted into the correct position in the sequence
          self._lock = 1; //prevent endless recursive calls - there are methods that get triggered that check duration/totalDuration when we add().

          _addToTimeline(self, child, start - child._delay, 1)._lock = 0;
        } else {
          prevStart = start;
        }

        if (start < 0 && child._ts) {
          //children aren't allowed to have negative startTimes unless smoothChildTiming is true, so adjust here if one is found.
          max -= start;

          if (!parent && !self._dp || parent && parent.smoothChildTiming) {
            self._start += start / self._ts;
            self._time -= start;
            self._tTime -= start;
          }

          self.shiftChildren(-start, false, -1e999);
          prevStart = 0;
        }

        child._end > max && child._ts && (max = child._end);
        child = prev;
      }

      _setDuration(self, self === _globalTimeline && self._time > max ? self._time : max, 1, 1);

      self._dirty = 0;
    }

    return self._tDur;
  };

  Timeline.updateRoot = function updateRoot(time) {
    if (_globalTimeline._ts) {
      _lazySafeRender(_globalTimeline, _parentToChildTotalTime(time, _globalTimeline));

      _lastRenderedFrame = _ticker.frame;
    }

    if (_ticker.frame >= _nextGCFrame) {
      _nextGCFrame += _config.autoSleep || 120;
      var child = _globalTimeline._first;
      if (!child || !child._ts) if (_config.autoSleep && _ticker._listeners.length < 2) {
        while (child && !child._ts) {
          child = child._next;
        }

        child || _ticker.sleep();
      }
    }
  };

  return Timeline;
}(Animation);

exports.TimelineLite = exports.TimelineMax = exports.Timeline = Timeline;

_setDefaults(Timeline.prototype, {
  _lock: 0,
  _hasPause: 0,
  _forcing: 0
});

var _addComplexStringPropTween = function _addComplexStringPropTween(target, prop, start, end, setter, stringFilter, funcParam) {
  //note: we call _addComplexStringPropTween.call(tweenInstance...) to ensure that it's scoped properly. We may call it from within a plugin too, thus "this" would refer to the plugin.
  var pt = new PropTween(this._pt, target, prop, 0, 1, _renderComplexString, null, setter),
      index = 0,
      matchIndex = 0,
      result,
      startNums,
      color,
      endNum,
      chunk,
      startNum,
      hasRandom,
      a;
  pt.b = start;
  pt.e = end;
  start += ""; //ensure values are strings

  end += "";

  if (hasRandom = ~end.indexOf("random(")) {
    end = _replaceRandom(end);
  }

  if (stringFilter) {
    a = [start, end];
    stringFilter(a, target, prop); //pass an array with the starting and ending values and let the filter do whatever it needs to the values.

    start = a[0];
    end = a[1];
  }

  startNums = start.match(_complexStringNumExp) || [];

  while (result = _complexStringNumExp.exec(end)) {
    endNum = result[0];
    chunk = end.substring(index, result.index);

    if (color) {
      color = (color + 1) % 5;
    } else if (chunk.substr(-5) === "rgba(") {
      color = 1;
    }

    if (endNum !== startNums[matchIndex++]) {
      startNum = parseFloat(startNums[matchIndex - 1]) || 0; //these nested PropTweens are handled in a special way - we'll never actually call a render or setter method on them. We'll just loop through them in the parent complex string PropTween's render method.

      pt._pt = {
        _next: pt._pt,
        p: chunk || matchIndex === 1 ? chunk : ",",
        //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
        s: startNum,
        c: endNum.charAt(1) === "=" ? parseFloat(endNum.substr(2)) * (endNum.charAt(0) === "-" ? -1 : 1) : parseFloat(endNum) - startNum,
        m: color && color < 4 ? Math.round : 0
      };
      index = _complexStringNumExp.lastIndex;
    }
  }

  pt.c = index < end.length ? end.substring(index, end.length) : ""; //we use the "c" of the PropTween to store the final part of the string (after the last number)

  pt.fp = funcParam;

  if (_relExp.test(end) || hasRandom) {
    pt.e = 0; //if the end string contains relative values or dynamic random(...) values, delete the end it so that on the final render we don't actually set it to the string with += or -= characters (forces it to use the calculated value).
  }

  this._pt = pt; //start the linked list with this new PropTween. Remember, we call _addComplexStringPropTween.call(tweenInstance...) to ensure that it's scoped properly. We may call it from within a plugin too, thus "this" would refer to the plugin.

  return pt;
},
    _addPropTween = function _addPropTween(target, prop, start, end, index, targets, modifier, stringFilter, funcParam) {
  _isFunction(end) && (end = end(index || 0, target, targets));
  var currentValue = target[prop],
      parsedStart = start !== "get" ? start : !_isFunction(currentValue) ? currentValue : funcParam ? target[prop.indexOf("set") || !_isFunction(target["get" + prop.substr(3)]) ? prop : "get" + prop.substr(3)](funcParam) : target[prop](),
      setter = !_isFunction(currentValue) ? _setterPlain : funcParam ? _setterFuncWithParam : _setterFunc,
      pt;

  if (_isString(end)) {
    if (~end.indexOf("random(")) {
      end = _replaceRandom(end);
    }

    if (end.charAt(1) === "=") {
      end = parseFloat(parsedStart) + parseFloat(end.substr(2)) * (end.charAt(0) === "-" ? -1 : 1) + (getUnit(parsedStart) || 0);
    }
  }

  if (parsedStart !== end) {
    if (!isNaN(parsedStart * end)) {
      pt = new PropTween(this._pt, target, prop, +parsedStart || 0, end - (parsedStart || 0), typeof currentValue === "boolean" ? _renderBoolean : _renderPlain, 0, setter);
      funcParam && (pt.fp = funcParam);
      modifier && pt.modifier(modifier, this, target);
      return this._pt = pt;
    }

    !currentValue && !(prop in target) && _missingPlugin(prop, end);
    return _addComplexStringPropTween.call(this, target, prop, parsedStart, end, setter, stringFilter || _config.stringFilter, funcParam);
  }
},
    //creates a copy of the vars object and processes any function-based values (putting the resulting values directly into the copy) as well as strings with "random()" in them. It does NOT process relative values.
_processVars = function _processVars(vars, index, target, targets, tween) {
  _isFunction(vars) && (vars = _parseFuncOrString(vars, tween, index, target, targets));

  if (!_isObject(vars) || vars.style && vars.nodeType || _isArray(vars) || _isTypedArray(vars)) {
    return _isString(vars) ? _parseFuncOrString(vars, tween, index, target, targets) : vars;
  }

  var copy = {},
      p;

  for (p in vars) {
    copy[p] = _parseFuncOrString(vars[p], tween, index, target, targets);
  }

  return copy;
},
    _checkPlugin = function _checkPlugin(property, vars, tween, index, target, targets) {
  var plugin, pt, ptLookup, i;

  if (_plugins[property] && (plugin = new _plugins[property]()).init(target, plugin.rawVars ? vars[property] : _processVars(vars[property], index, target, targets, tween), tween, index, targets) !== false) {
    tween._pt = pt = new PropTween(tween._pt, target, property, 0, 1, plugin.render, plugin, 0, plugin.priority);

    if (tween !== _quickTween) {
      ptLookup = tween._ptLookup[tween._targets.indexOf(target)]; //note: we can't use tween._ptLookup[index] because for staggered tweens, the index from the fullTargets array won't match what it is in each individual tween that spawns from the stagger.

      i = plugin._props.length;

      while (i--) {
        ptLookup[plugin._props[i]] = pt;
      }
    }
  }

  return plugin;
},
    _overwritingTween,
    //store a reference temporarily so we can avoid overwriting itself.
_initTween = function _initTween(tween, time) {
  var vars = tween.vars,
      ease = vars.ease,
      startAt = vars.startAt,
      immediateRender = vars.immediateRender,
      lazy = vars.lazy,
      onUpdate = vars.onUpdate,
      onUpdateParams = vars.onUpdateParams,
      callbackScope = vars.callbackScope,
      runBackwards = vars.runBackwards,
      yoyoEase = vars.yoyoEase,
      keyframes = vars.keyframes,
      autoRevert = vars.autoRevert,
      dur = tween._dur,
      prevStartAt = tween._startAt,
      targets = tween._targets,
      parent = tween.parent,
      fullTargets = parent && parent.data === "nested" ? parent.parent._targets : targets,
      autoOverwrite = tween._overwrite === "auto" && !_suppressOverwrites,
      tl = tween.timeline,
      cleanVars,
      i,
      p,
      pt,
      target,
      hasPriority,
      gsData,
      harness,
      plugin,
      ptLookup,
      index,
      harnessVars,
      overwritten;
  tl && (!keyframes || !ease) && (ease = "none");
  tween._ease = _parseEase(ease, _defaults.ease);
  tween._yEase = yoyoEase ? _invertEase(_parseEase(yoyoEase === true ? ease : yoyoEase, _defaults.ease)) : 0;

  if (yoyoEase && tween._yoyo && !tween._repeat) {
    //there must have been a parent timeline with yoyo:true that is currently in its yoyo phase, so flip the eases.
    yoyoEase = tween._yEase;
    tween._yEase = tween._ease;
    tween._ease = yoyoEase;
  }

  if (!tl) {
    //if there's an internal timeline, skip all the parsing because we passed that task down the chain.
    harness = targets[0] ? _getCache(targets[0]).harness : 0;
    harnessVars = harness && vars[harness.prop]; //someone may need to specify CSS-specific values AND non-CSS values, like if the element has an "x" property plus it's a standard DOM element. We allow people to distinguish by wrapping plugin-specific stuff in a css:{} object for example.

    cleanVars = _copyExcluding(vars, _reservedProps);
    prevStartAt && prevStartAt.render(-1, true).kill();

    if (startAt) {
      _removeFromParent(tween._startAt = Tween.set(targets, _setDefaults({
        data: "isStart",
        overwrite: false,
        parent: parent,
        immediateRender: true,
        lazy: _isNotFalse(lazy),
        startAt: null,
        delay: 0,
        onUpdate: onUpdate,
        onUpdateParams: onUpdateParams,
        callbackScope: callbackScope,
        stagger: 0
      }, startAt))); //copy the properties/values into a new object to avoid collisions, like var to = {x:0}, from = {x:500}; timeline.fromTo(e, from, to).fromTo(e, to, from);


      if (immediateRender) {
        if (time > 0) {
          autoRevert || (tween._startAt = 0); //tweens that render immediately (like most from() and fromTo() tweens) shouldn't revert when their parent timeline's playhead goes backward past the startTime because the initial render could have happened anytime and it shouldn't be directly correlated to this tween's startTime. Imagine setting up a complex animation where the beginning states of various objects are rendered immediately but the tween doesn't happen for quite some time - if we revert to the starting values as soon as the playhead goes backward past the tween's startTime, it will throw things off visually. Reversion should only happen in Timeline instances where immediateRender was false or when autoRevert is explicitly set to true.
        } else if (dur && !(time < 0 && prevStartAt)) {
          time && (tween._zTime = time);
          return; //we skip initialization here so that overwriting doesn't occur until the tween actually begins. Otherwise, if you create several immediateRender:true tweens of the same target/properties to drop into a Timeline, the last one created would overwrite the first ones because they didn't get placed into the timeline yet before the first render occurs and kicks in overwriting.
        }
      }
    } else if (runBackwards && dur) {
      //from() tweens must be handled uniquely: their beginning values must be rendered but we don't want overwriting to occur yet (when time is still 0). Wait until the tween actually begins before doing all the routines like overwriting. At that time, we should render at the END of the tween to ensure that things initialize correctly (remember, from() tweens go backwards)
      if (prevStartAt) {
        !autoRevert && (tween._startAt = 0);
      } else {
        time && (immediateRender = false); //in rare cases (like if a from() tween runs and then is invalidate()-ed), immediateRender could be true but the initial forced-render gets skipped, so there's no need to force the render in this context when the _time is greater than 0

        p = _setDefaults({
          overwrite: false,
          data: "isFromStart",
          //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
          lazy: immediateRender && _isNotFalse(lazy),
          immediateRender: immediateRender,
          //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
          stagger: 0,
          parent: parent //ensures that nested tweens that had a stagger are handled properly, like gsap.from(".class", {y:gsap.utils.wrap([-100,100])})

        }, cleanVars);
        harnessVars && (p[harness.prop] = harnessVars); // in case someone does something like .from(..., {css:{}})

        _removeFromParent(tween._startAt = Tween.set(targets, p));

        if (!immediateRender) {
          _initTween(tween._startAt, _tinyNum); //ensures that the initial values are recorded

        } else if (!time) {
          return;
        }
      }
    }

    tween._pt = 0;
    lazy = dur && _isNotFalse(lazy) || lazy && !dur;

    for (i = 0; i < targets.length; i++) {
      target = targets[i];
      gsData = target._gsap || _harness(targets)[i]._gsap;
      tween._ptLookup[i] = ptLookup = {};
      _lazyLookup[gsData.id] && _lazyTweens.length && _lazyRender(); //if other tweens of the same target have recently initted but haven't rendered yet, we've got to force the render so that the starting values are correct (imagine populating a timeline with a bunch of sequential tweens and then jumping to the end)

      index = fullTargets === targets ? i : fullTargets.indexOf(target);

      if (harness && (plugin = new harness()).init(target, harnessVars || cleanVars, tween, index, fullTargets) !== false) {
        tween._pt = pt = new PropTween(tween._pt, target, plugin.name, 0, 1, plugin.render, plugin, 0, plugin.priority);

        plugin._props.forEach(function (name) {
          ptLookup[name] = pt;
        });

        plugin.priority && (hasPriority = 1);
      }

      if (!harness || harnessVars) {
        for (p in cleanVars) {
          if (_plugins[p] && (plugin = _checkPlugin(p, cleanVars, tween, index, target, fullTargets))) {
            plugin.priority && (hasPriority = 1);
          } else {
            ptLookup[p] = pt = _addPropTween.call(tween, target, p, "get", cleanVars[p], index, fullTargets, 0, vars.stringFilter);
          }
        }
      }

      tween._op && tween._op[i] && tween.kill(target, tween._op[i]);

      if (autoOverwrite && tween._pt) {
        _overwritingTween = tween;

        _globalTimeline.killTweensOf(target, ptLookup, tween.globalTime(0)); //Also make sure the overwriting doesn't overwrite THIS tween!!!


        overwritten = !tween.parent;
        _overwritingTween = 0;
      }

      tween._pt && lazy && (_lazyLookup[gsData.id] = 1);
    }

    hasPriority && _sortPropTweensByPriority(tween);
    tween._onInit && tween._onInit(tween); //plugins like RoundProps must wait until ALL of the PropTweens are instantiated. In the plugin's init() function, it sets the _onInit on the tween instance. May not be pretty/intuitive, but it's fast and keeps file size down.
  }

  tween._from = !tl && !!vars.runBackwards; //nested timelines should never run backwards - the backwards-ness is in the child tweens.

  tween._onUpdate = onUpdate;
  tween._initted = (!tween._op || tween._pt) && !overwritten; // if overwrittenProps resulted in the entire tween being killed, do NOT flag it as initted or else it may render for one tick.
},
    _addAliasesToVars = function _addAliasesToVars(targets, vars) {
  var harness = targets[0] ? _getCache(targets[0]).harness : 0,
      propertyAliases = harness && harness.aliases,
      copy,
      p,
      i,
      aliases;

  if (!propertyAliases) {
    return vars;
  }

  copy = _merge({}, vars);

  for (p in propertyAliases) {
    if (p in copy) {
      aliases = propertyAliases[p].split(",");
      i = aliases.length;

      while (i--) {
        copy[aliases[i]] = copy[p];
      }
    }
  }

  return copy;
},
    _parseFuncOrString = function _parseFuncOrString(value, tween, i, target, targets) {
  return _isFunction(value) ? value.call(tween, i, target, targets) : _isString(value) && ~value.indexOf("random(") ? _replaceRandom(value) : value;
},
    _staggerTweenProps = _callbackNames + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase",
    _staggerPropsToSkip = (_staggerTweenProps + ",id,stagger,delay,duration,paused,scrollTrigger").split(",");
/*
 * --------------------------------------------------------------------------------------
 * TWEEN
 * --------------------------------------------------------------------------------------
 */


exports._checkPlugin = _checkPlugin;

var Tween = /*#__PURE__*/function (_Animation2) {
  _inheritsLoose(Tween, _Animation2);

  function Tween(targets, vars, time, skipInherit) {
    var _this3;

    if (typeof vars === "number") {
      time.duration = vars;
      vars = time;
      time = null;
    }

    _this3 = _Animation2.call(this, skipInherit ? vars : _inheritDefaults(vars), time) || this;
    var _this3$vars = _this3.vars,
        duration = _this3$vars.duration,
        delay = _this3$vars.delay,
        immediateRender = _this3$vars.immediateRender,
        stagger = _this3$vars.stagger,
        overwrite = _this3$vars.overwrite,
        keyframes = _this3$vars.keyframes,
        defaults = _this3$vars.defaults,
        scrollTrigger = _this3$vars.scrollTrigger,
        yoyoEase = _this3$vars.yoyoEase,
        parent = _this3.parent,
        parsedTargets = (_isArray(targets) || _isTypedArray(targets) ? _isNumber(targets[0]) : "length" in vars) ? [targets] : toArray(targets),
        tl,
        i,
        copy,
        l,
        p,
        curTarget,
        staggerFunc,
        staggerVarsToMerge;
    _this3._targets = parsedTargets.length ? _harness(parsedTargets) : _warn("GSAP target " + targets + " not found. https://greensock.com", !_config.nullTargetWarn) || [];
    _this3._ptLookup = []; //PropTween lookup. An array containing an object for each target, having keys for each tweening property

    _this3._overwrite = overwrite;

    if (keyframes || stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
      vars = _this3.vars;
      tl = _this3.timeline = new Timeline({
        data: "nested",
        defaults: defaults || {}
      });
      tl.kill();
      tl.parent = tl._dp = _assertThisInitialized(_this3);
      tl._start = 0;

      if (keyframes) {
        _setDefaults(tl.vars.defaults, {
          ease: "none"
        });

        keyframes.forEach(function (frame) {
          return tl.to(parsedTargets, frame, ">");
        });
      } else {
        l = parsedTargets.length;
        staggerFunc = stagger ? distribute(stagger) : _emptyFunc;

        if (_isObject(stagger)) {
          //users can pass in callbacks like onStart/onComplete in the stagger object. These should fire with each individual tween.
          for (p in stagger) {
            if (~_staggerTweenProps.indexOf(p)) {
              staggerVarsToMerge || (staggerVarsToMerge = {});
              staggerVarsToMerge[p] = stagger[p];
            }
          }
        }

        for (i = 0; i < l; i++) {
          copy = {};

          for (p in vars) {
            if (_staggerPropsToSkip.indexOf(p) < 0) {
              copy[p] = vars[p];
            }
          }

          copy.stagger = 0;
          yoyoEase && (copy.yoyoEase = yoyoEase);
          staggerVarsToMerge && _merge(copy, staggerVarsToMerge);
          curTarget = parsedTargets[i]; //don't just copy duration or delay because if they're a string or function, we'd end up in an infinite loop because _isFuncOrString() would evaluate as true in the child tweens, entering this loop, etc. So we parse the value straight from vars and default to 0.

          copy.duration = +_parseFuncOrString(duration, _assertThisInitialized(_this3), i, curTarget, parsedTargets);
          copy.delay = (+_parseFuncOrString(delay, _assertThisInitialized(_this3), i, curTarget, parsedTargets) || 0) - _this3._delay;

          if (!stagger && l === 1 && copy.delay) {
            // if someone does delay:"random(1, 5)", repeat:-1, for example, the delay shouldn't be inside the repeat.
            _this3._delay = delay = copy.delay;
            _this3._start += delay;
            copy.delay = 0;
          }

          tl.to(curTarget, copy, staggerFunc(i, curTarget, parsedTargets));
        }

        tl.duration() ? duration = delay = 0 : _this3.timeline = 0; // if the timeline's duration is 0, we don't need a timeline internally!
      }

      duration || _this3.duration(duration = tl.duration());
    } else {
      _this3.timeline = 0; //speed optimization, faster lookups (no going up the prototype chain)
    }

    if (overwrite === true && !_suppressOverwrites) {
      _overwritingTween = _assertThisInitialized(_this3);

      _globalTimeline.killTweensOf(parsedTargets);

      _overwritingTween = 0;
    }

    parent && _postAddChecks(parent, _assertThisInitialized(_this3));

    if (immediateRender || !duration && !keyframes && _this3._start === _round(parent._time) && _isNotFalse(immediateRender) && _hasNoPausedAncestors(_assertThisInitialized(_this3)) && parent.data !== "nested") {
      _this3._tTime = -_tinyNum; //forces a render without having to set the render() "force" parameter to true because we want to allow lazying by default (using the "force" parameter always forces an immediate full render)

      _this3.render(Math.max(0, -delay)); //in case delay is negative

    }

    scrollTrigger && _scrollTrigger(_assertThisInitialized(_this3), scrollTrigger);
    return _this3;
  }

  var _proto3 = Tween.prototype;

  _proto3.render = function render(totalTime, suppressEvents, force) {
    var prevTime = this._time,
        tDur = this._tDur,
        dur = this._dur,
        tTime = totalTime > tDur - _tinyNum && totalTime >= 0 ? tDur : totalTime < _tinyNum ? 0 : totalTime,
        time,
        pt,
        iteration,
        cycleDuration,
        prevIteration,
        isYoyo,
        ratio,
        timeline,
        yoyoEase;

    if (!dur) {
      _renderZeroDurationTween(this, totalTime, suppressEvents, force);
    } else if (tTime !== this._tTime || !totalTime || force || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== totalTime < 0) {
      //this senses if we're crossing over the start time, in which case we must record _zTime and force the render, but we do it in this lengthy conditional way for performance reasons (usually we can skip the calculations): this._initted && (this._zTime < 0) !== (totalTime < 0)
      time = tTime;
      timeline = this.timeline;

      if (this._repeat) {
        //adjust the time for repeats and yoyos
        cycleDuration = dur + this._rDelay;

        if (this._repeat < -1 && totalTime < 0) {
          return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
        }

        time = _round(tTime % cycleDuration); //round to avoid floating point errors. (4 % 0.8 should be 0 but some browsers report it as 0.79999999!)

        if (tTime === tDur) {
          // the tDur === tTime is for edge cases where there's a lengthy decimal on the duration and it may reach the very end but the time is rendered as not-quite-there (remember, tDur is rounded to 4 decimals whereas dur isn't)
          iteration = this._repeat;
          time = dur;
        } else {
          iteration = ~~(tTime / cycleDuration);

          if (iteration && iteration === tTime / cycleDuration) {
            time = dur;
            iteration--;
          }

          time > dur && (time = dur);
        }

        isYoyo = this._yoyo && iteration & 1;

        if (isYoyo) {
          yoyoEase = this._yEase;
          time = dur - time;
        }

        prevIteration = _animationCycle(this._tTime, cycleDuration);

        if (time === prevTime && !force && this._initted) {
          //could be during the repeatDelay part. No need to render and fire callbacks.
          return this;
        }

        if (iteration !== prevIteration) {
          timeline && this._yEase && _propagateYoyoEase(timeline, isYoyo); //repeatRefresh functionality

          if (this.vars.repeatRefresh && !isYoyo && !this._lock) {
            this._lock = force = 1; //force, otherwise if lazy is true, the _attemptInitTween() will return and we'll jump out and get caught bouncing on each tick.

            this.render(_round(cycleDuration * iteration), true).invalidate()._lock = 0;
          }
        }
      }

      if (!this._initted) {
        if (_attemptInitTween(this, totalTime < 0 ? totalTime : time, force, suppressEvents)) {
          this._tTime = 0; // in constructor if immediateRender is true, we set _tTime to -_tinyNum to have the playhead cross the starting point but we can't leave _tTime as a negative number.

          return this;
        }

        if (dur !== this._dur) {
          // while initting, a plugin like InertiaPlugin might alter the duration, so rerun from the start to ensure everything renders as it should.
          return this.render(totalTime, suppressEvents, force);
        }
      }

      this._tTime = tTime;
      this._time = time;

      if (!this._act && this._ts) {
        this._act = 1; //as long as it's not paused, force it to be active so that if the user renders independent of the parent timeline, it'll be forced to re-render on the next tick.

        this._lazy = 0;
      }

      this.ratio = ratio = (yoyoEase || this._ease)(time / dur);

      if (this._from) {
        this.ratio = ratio = 1 - ratio;
      }

      time && !prevTime && !suppressEvents && _callback(this, "onStart");
      pt = this._pt;

      while (pt) {
        pt.r(ratio, pt.d);
        pt = pt._next;
      }

      timeline && timeline.render(totalTime < 0 ? totalTime : !time && isYoyo ? -_tinyNum : timeline._dur * ratio, suppressEvents, force) || this._startAt && (this._zTime = totalTime);

      if (this._onUpdate && !suppressEvents) {
        totalTime < 0 && this._startAt && this._startAt.render(totalTime, true, force); //note: for performance reasons, we tuck this conditional logic inside less traveled areas (most tweens don't have an onUpdate). We'd just have it at the end before the onComplete, but the values should be updated before any onUpdate is called, so we ALSO put it here and then if it's not called, we do so later near the onComplete.

        _callback(this, "onUpdate");
      }

      this._repeat && iteration !== prevIteration && this.vars.onRepeat && !suppressEvents && this.parent && _callback(this, "onRepeat");

      if ((tTime === this._tDur || !tTime) && this._tTime === tTime) {
        totalTime < 0 && this._startAt && !this._onUpdate && this._startAt.render(totalTime, true, true);
        (totalTime || !dur) && (tTime === this._tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1); // don't remove if we're rendering at exactly a time of 0, as there could be autoRevert values that should get set on the next tick (if the playhead goes backward beyond the startTime, negative totalTime). Don't remove if the timeline is reversed and the playhead isn't at 0, otherwise tl.progress(1).reverse() won't work. Only remove if the playhead is at the end and timeScale is positive, or if the playhead is at 0 and the timeScale is negative.

        if (!suppressEvents && !(totalTime < 0 && !prevTime) && (tTime || prevTime)) {
          // if prevTime and tTime are zero, we shouldn't fire the onReverseComplete. This could happen if you gsap.to(... {paused:true}).play();
          _callback(this, tTime === tDur ? "onComplete" : "onReverseComplete", true);

          this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
        }
      }
    }

    return this;
  };

  _proto3.targets = function targets() {
    return this._targets;
  };

  _proto3.invalidate = function invalidate() {
    this._pt = this._op = this._startAt = this._onUpdate = this._lazy = this.ratio = 0;
    this._ptLookup = [];
    this.timeline && this.timeline.invalidate();
    return _Animation2.prototype.invalidate.call(this);
  };

  _proto3.kill = function kill(targets, vars) {
    if (vars === void 0) {
      vars = "all";
    }

    if (!targets && (!vars || vars === "all")) {
      this._lazy = this._pt = 0;
      return this.parent ? _interrupt(this) : this;
    }

    if (this.timeline) {
      var tDur = this.timeline.totalDuration();
      this.timeline.killTweensOf(targets, vars, _overwritingTween && _overwritingTween.vars.overwrite !== true)._first || _interrupt(this); // if nothing is left tweening, interrupt.

      this.parent && tDur !== this.timeline.totalDuration() && _setDuration(this, this._dur * this.timeline._tDur / tDur, 0, 1); // if a nested tween is killed that changes the duration, it should affect this tween's duration. We must use the ratio, though, because sometimes the internal timeline is stretched like for keyframes where they don't all add up to whatever the parent tween's duration was set to.

      return this;
    }

    var parsedTargets = this._targets,
        killingTargets = targets ? toArray(targets) : parsedTargets,
        propTweenLookup = this._ptLookup,
        firstPT = this._pt,
        overwrittenProps,
        curLookup,
        curOverwriteProps,
        props,
        p,
        pt,
        i;

    if ((!vars || vars === "all") && _arraysMatch(parsedTargets, killingTargets)) {
      vars === "all" && (this._pt = 0);
      return _interrupt(this);
    }

    overwrittenProps = this._op = this._op || [];

    if (vars !== "all") {
      //so people can pass in a comma-delimited list of property names
      if (_isString(vars)) {
        p = {};

        _forEachName(vars, function (name) {
          return p[name] = 1;
        });

        vars = p;
      }

      vars = _addAliasesToVars(parsedTargets, vars);
    }

    i = parsedTargets.length;

    while (i--) {
      if (~killingTargets.indexOf(parsedTargets[i])) {
        curLookup = propTweenLookup[i];

        if (vars === "all") {
          overwrittenProps[i] = vars;
          props = curLookup;
          curOverwriteProps = {};
        } else {
          curOverwriteProps = overwrittenProps[i] = overwrittenProps[i] || {};
          props = vars;
        }

        for (p in props) {
          pt = curLookup && curLookup[p];

          if (pt) {
            if (!("kill" in pt.d) || pt.d.kill(p) === true) {
              _removeLinkedListItem(this, pt, "_pt");
            }

            delete curLookup[p];
          }

          if (curOverwriteProps !== "all") {
            curOverwriteProps[p] = 1;
          }
        }
      }
    }

    this._initted && !this._pt && firstPT && _interrupt(this); //if all tweening properties are killed, kill the tween. Without this line, if there's a tween with multiple targets and then you killTweensOf() each target individually, the tween would technically still remain active and fire its onComplete even though there aren't any more properties tweening.

    return this;
  };

  Tween.to = function to(targets, vars) {
    return new Tween(targets, vars, arguments[2]);
  };

  Tween.from = function from(targets, vars) {
    return new Tween(targets, _parseVars(arguments, 1));
  };

  Tween.delayedCall = function delayedCall(delay, callback, params, scope) {
    return new Tween(callback, 0, {
      immediateRender: false,
      lazy: false,
      overwrite: false,
      delay: delay,
      onComplete: callback,
      onReverseComplete: callback,
      onCompleteParams: params,
      onReverseCompleteParams: params,
      callbackScope: scope
    });
  };

  Tween.fromTo = function fromTo(targets, fromVars, toVars) {
    return new Tween(targets, _parseVars(arguments, 2));
  };

  Tween.set = function set(targets, vars) {
    vars.duration = 0;
    vars.repeatDelay || (vars.repeat = 0);
    return new Tween(targets, vars);
  };

  Tween.killTweensOf = function killTweensOf(targets, props, onlyActive) {
    return _globalTimeline.killTweensOf(targets, props, onlyActive);
  };

  return Tween;
}(Animation);

exports.TweenLite = exports.TweenMax = exports.Tween = Tween;

_setDefaults(Tween.prototype, {
  _targets: [],
  _lazy: 0,
  _startAt: 0,
  _op: 0,
  _onInit: 0
}); //add the pertinent timeline methods to Tween instances so that users can chain conveniently and create a timeline automatically. (removed due to concerns that it'd ultimately add to more confusion especially for beginners)
// _forEachName("to,from,fromTo,set,call,add,addLabel,addPause", name => {
// 	Tween.prototype[name] = function() {
// 		let tl = new Timeline();
// 		return _addToTimeline(tl, this)[name].apply(tl, toArray(arguments));
// 	}
// });
//for backward compatibility. Leverage the timeline calls.


_forEachName("staggerTo,staggerFrom,staggerFromTo", function (name) {
  Tween[name] = function () {
    var tl = new Timeline(),
        params = _slice.call(arguments, 0);

    params.splice(name === "staggerFromTo" ? 5 : 4, 0, 0);
    return tl[name].apply(tl, params);
  };
});
/*
 * --------------------------------------------------------------------------------------
 * PROPTWEEN
 * --------------------------------------------------------------------------------------
 */


var _setterPlain = function _setterPlain(target, property, value) {
  return target[property] = value;
},
    _setterFunc = function _setterFunc(target, property, value) {
  return target[property](value);
},
    _setterFuncWithParam = function _setterFuncWithParam(target, property, value, data) {
  return target[property](data.fp, value);
},
    _setterAttribute = function _setterAttribute(target, property, value) {
  return target.setAttribute(property, value);
},
    _getSetter = function _getSetter(target, property) {
  return _isFunction(target[property]) ? _setterFunc : _isUndefined(target[property]) && target.setAttribute ? _setterAttribute : _setterPlain;
},
    _renderPlain = function _renderPlain(ratio, data) {
  return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 10000) / 10000, data);
},
    _renderBoolean = function _renderBoolean(ratio, data) {
  return data.set(data.t, data.p, !!(data.s + data.c * ratio), data);
},
    _renderComplexString = function _renderComplexString(ratio, data) {
  var pt = data._pt,
      s = "";

  if (!ratio && data.b) {
    //b = beginning string
    s = data.b;
  } else if (ratio === 1 && data.e) {
    //e = ending string
    s = data.e;
  } else {
    while (pt) {
      s = pt.p + (pt.m ? pt.m(pt.s + pt.c * ratio) : Math.round((pt.s + pt.c * ratio) * 10000) / 10000) + s; //we use the "p" property for the text inbetween (like a suffix). And in the context of a complex string, the modifier (m) is typically just Math.round(), like for RGB colors.

      pt = pt._next;
    }

    s += data.c; //we use the "c" of the PropTween to store the final chunk of non-numeric text.
  }

  data.set(data.t, data.p, s, data);
},
    _renderPropTweens = function _renderPropTweens(ratio, data) {
  var pt = data._pt;

  while (pt) {
    pt.r(ratio, pt.d);
    pt = pt._next;
  }
},
    _addPluginModifier = function _addPluginModifier(modifier, tween, target, property) {
  var pt = this._pt,
      next;

  while (pt) {
    next = pt._next;
    pt.p === property && pt.modifier(modifier, tween, target);
    pt = next;
  }
},
    _killPropTweensOf = function _killPropTweensOf(property) {
  var pt = this._pt,
      hasNonDependentRemaining,
      next;

  while (pt) {
    next = pt._next;

    if (pt.p === property && !pt.op || pt.op === property) {
      _removeLinkedListItem(this, pt, "_pt");
    } else if (!pt.dep) {
      hasNonDependentRemaining = 1;
    }

    pt = next;
  }

  return !hasNonDependentRemaining;
},
    _setterWithModifier = function _setterWithModifier(target, property, value, data) {
  data.mSet(target, property, data.m.call(data.tween, value, data.mt), data);
},
    _sortPropTweensByPriority = function _sortPropTweensByPriority(parent) {
  var pt = parent._pt,
      next,
      pt2,
      first,
      last; //sorts the PropTween linked list in order of priority because some plugins need to do their work after ALL of the PropTweens were created (like RoundPropsPlugin and ModifiersPlugin)

  while (pt) {
    next = pt._next;
    pt2 = first;

    while (pt2 && pt2.pr > pt.pr) {
      pt2 = pt2._next;
    }

    if (pt._prev = pt2 ? pt2._prev : last) {
      pt._prev._next = pt;
    } else {
      first = pt;
    }

    if (pt._next = pt2) {
      pt2._prev = pt;
    } else {
      last = pt;
    }

    pt = next;
  }

  parent._pt = first;
}; //PropTween key: t = target, p = prop, r = renderer, d = data, s = start, c = change, op = overwriteProperty (ONLY populated when it's different than p), pr = priority, _next/_prev for the linked list siblings, set = setter, m = modifier, mSet = modifierSetter (the original setter, before a modifier was added)


exports._sortPropTweensByPriority = _sortPropTweensByPriority;
exports._renderComplexString = _renderComplexString;
exports._getSetter = _getSetter;

var PropTween = /*#__PURE__*/function () {
  function PropTween(next, target, prop, start, change, renderer, data, setter, priority) {
    this.t = target;
    this.s = start;
    this.c = change;
    this.p = prop;
    this.r = renderer || _renderPlain;
    this.d = data || this;
    this.set = setter || _setterPlain;
    this.pr = priority || 0;
    this._next = next;

    if (next) {
      next._prev = this;
    }
  }

  var _proto4 = PropTween.prototype;

  _proto4.modifier = function modifier(func, tween, target) {
    this.mSet = this.mSet || this.set; //in case it was already set (a PropTween can only have one modifier)

    this.set = _setterWithModifier;
    this.m = func;
    this.mt = target; //modifier target

    this.tween = tween;
  };

  return PropTween;
}(); //Initialization tasks


exports.PropTween = PropTween;

_forEachName(_callbackNames + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", function (name) {
  return _reservedProps[name] = 1;
});

_globals.TweenMax = _globals.TweenLite = Tween;
_globals.TimelineLite = _globals.TimelineMax = Timeline;
_globalTimeline = new Timeline({
  sortChildren: false,
  defaults: _defaults,
  autoRemoveChildren: true,
  id: "root",
  smoothChildTiming: true
});
_config.stringFilter = _colorStringFilter;
/*
 * --------------------------------------------------------------------------------------
 * GSAP
 * --------------------------------------------------------------------------------------
 */

var _gsap = {
  registerPlugin: function registerPlugin() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    args.forEach(function (config) {
      return _createPlugin(config);
    });
  },
  timeline: function timeline(vars) {
    return new Timeline(vars);
  },
  getTweensOf: function getTweensOf(targets, onlyActive) {
    return _globalTimeline.getTweensOf(targets, onlyActive);
  },
  getProperty: function getProperty(target, property, unit, uncache) {
    _isString(target) && (target = toArray(target)[0]); //in case selector text or an array is passed in

    var getter = _getCache(target || {}).get,
        format = unit ? _passThrough : _numericIfPossible;

    unit === "native" && (unit = "");
    return !target ? target : !property ? function (property, unit, uncache) {
      return format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
    } : format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
  },
  quickSetter: function quickSetter(target, property, unit) {
    target = toArray(target);

    if (target.length > 1) {
      var setters = target.map(function (t) {
        return gsap.quickSetter(t, property, unit);
      }),
          l = setters.length;
      return function (value) {
        var i = l;

        while (i--) {
          setters[i](value);
        }
      };
    }

    target = target[0] || {};

    var Plugin = _plugins[property],
        cache = _getCache(target),
        p = cache.harness && (cache.harness.aliases || {})[property] || property,
        // in case it's an alias, like "rotate" for "rotation".
    setter = Plugin ? function (value) {
      var p = new Plugin();
      _quickTween._pt = 0;
      p.init(target, unit ? value + unit : value, _quickTween, 0, [target]);
      p.render(1, p);
      _quickTween._pt && _renderPropTweens(1, _quickTween);
    } : cache.set(target, p);

    return Plugin ? setter : function (value) {
      return setter(target, p, unit ? value + unit : value, cache, 1);
    };
  },
  isTweening: function isTweening(targets) {
    return _globalTimeline.getTweensOf(targets, true).length > 0;
  },
  defaults: function defaults(value) {
    value && value.ease && (value.ease = _parseEase(value.ease, _defaults.ease));
    return _mergeDeep(_defaults, value || {});
  },
  config: function config(value) {
    return _mergeDeep(_config, value || {});
  },
  registerEffect: function registerEffect(_ref2) {
    var name = _ref2.name,
        effect = _ref2.effect,
        plugins = _ref2.plugins,
        defaults = _ref2.defaults,
        extendTimeline = _ref2.extendTimeline;
    (plugins || "").split(",").forEach(function (pluginName) {
      return pluginName && !_plugins[pluginName] && !_globals[pluginName] && _warn(name + " effect requires " + pluginName + " plugin.");
    });

    _effects[name] = function (targets, vars, tl) {
      return effect(toArray(targets), _setDefaults(vars || {}, defaults), tl);
    };

    if (extendTimeline) {
      Timeline.prototype[name] = function (targets, vars, position) {
        return this.add(_effects[name](targets, _isObject(vars) ? vars : (position = vars) && {}, this), position);
      };
    }
  },
  registerEase: function registerEase(name, ease) {
    _easeMap[name] = _parseEase(ease);
  },
  parseEase: function parseEase(ease, defaultEase) {
    return arguments.length ? _parseEase(ease, defaultEase) : _easeMap;
  },
  getById: function getById(id) {
    return _globalTimeline.getById(id);
  },
  exportRoot: function exportRoot(vars, includeDelayedCalls) {
    if (vars === void 0) {
      vars = {};
    }

    var tl = new Timeline(vars),
        child,
        next;
    tl.smoothChildTiming = _isNotFalse(vars.smoothChildTiming);

    _globalTimeline.remove(tl);

    tl._dp = 0; //otherwise it'll get re-activated when adding children and be re-introduced into _globalTimeline's linked list (then added to itself).

    tl._time = tl._tTime = _globalTimeline._time;
    child = _globalTimeline._first;

    while (child) {
      next = child._next;

      if (includeDelayedCalls || !(!child._dur && child instanceof Tween && child.vars.onComplete === child._targets[0])) {
        _addToTimeline(tl, child, child._start - child._delay);
      }

      child = next;
    }

    _addToTimeline(_globalTimeline, tl, 0);

    return tl;
  },
  utils: {
    wrap: wrap,
    wrapYoyo: wrapYoyo,
    distribute: distribute,
    random: random,
    snap: snap,
    normalize: normalize,
    getUnit: getUnit,
    clamp: clamp,
    splitColor: splitColor,
    toArray: toArray,
    mapRange: mapRange,
    pipe: pipe,
    unitize: unitize,
    interpolate: interpolate,
    shuffle: shuffle
  },
  install: _install,
  effects: _effects,
  ticker: _ticker,
  updateRoot: Timeline.updateRoot,
  plugins: _plugins,
  globalTimeline: _globalTimeline,
  core: {
    PropTween: PropTween,
    globals: _addGlobal,
    Tween: Tween,
    Timeline: Timeline,
    Animation: Animation,
    getCache: _getCache,
    _removeLinkedListItem: _removeLinkedListItem,
    suppressOverwrites: function suppressOverwrites(value) {
      return _suppressOverwrites = value;
    }
  }
};

_forEachName("to,from,fromTo,delayedCall,set,killTweensOf", function (name) {
  return _gsap[name] = Tween[name];
});

_ticker.add(Timeline.updateRoot);

_quickTween = _gsap.to({}, {
  duration: 0
}); // ---- EXTRA PLUGINS --------------------------------------------------------

var _getPluginPropTween = function _getPluginPropTween(plugin, prop) {
  var pt = plugin._pt;

  while (pt && pt.p !== prop && pt.op !== prop && pt.fp !== prop) {
    pt = pt._next;
  }

  return pt;
},
    _addModifiers = function _addModifiers(tween, modifiers) {
  var targets = tween._targets,
      p,
      i,
      pt;

  for (p in modifiers) {
    i = targets.length;

    while (i--) {
      pt = tween._ptLookup[i][p];

      if (pt && (pt = pt.d)) {
        if (pt._pt) {
          // is a plugin
          pt = _getPluginPropTween(pt, p);
        }

        pt && pt.modifier && pt.modifier(modifiers[p], tween, targets[i], p);
      }
    }
  }
},
    _buildModifierPlugin = function _buildModifierPlugin(name, modifier) {
  return {
    name: name,
    rawVars: 1,
    //don't pre-process function-based values or "random()" strings.
    init: function init(target, vars, tween) {
      tween._onInit = function (tween) {
        var temp, p;

        if (_isString(vars)) {
          temp = {};

          _forEachName(vars, function (name) {
            return temp[name] = 1;
          }); //if the user passes in a comma-delimited list of property names to roundProps, like "x,y", we round to whole numbers.


          vars = temp;
        }

        if (modifier) {
          temp = {};

          for (p in vars) {
            temp[p] = modifier(vars[p]);
          }

          vars = temp;
        }

        _addModifiers(tween, vars);
      };
    }
  };
}; //register core plugins


var gsap = _gsap.registerPlugin({
  name: "attr",
  init: function init(target, vars, tween, index, targets) {
    var p, pt;

    for (p in vars) {
      pt = this.add(target, "setAttribute", (target.getAttribute(p) || 0) + "", vars[p], index, targets, 0, 0, p);
      pt && (pt.op = p);

      this._props.push(p);
    }
  }
}, {
  name: "endArray",
  init: function init(target, value) {
    var i = value.length;

    while (i--) {
      this.add(target, i, target[i] || 0, value[i]);
    }
  }
}, _buildModifierPlugin("roundProps", _roundModifier), _buildModifierPlugin("modifiers"), _buildModifierPlugin("snap", snap)) || _gsap; //to prevent the core plugins from being dropped via aggressive tree shaking, we must include them in the variable declaration in this way.


exports.default = exports.gsap = gsap;
Tween.version = Timeline.version = gsap.version = "3.6.0";
_coreReady = 1;

if (_windowExists()) {
  _wake();
}

var Power0 = _easeMap.Power0,
    Power1 = _easeMap.Power1,
    Power2 = _easeMap.Power2,
    Power3 = _easeMap.Power3,
    Power4 = _easeMap.Power4,
    Linear = _easeMap.Linear,
    Quad = _easeMap.Quad,
    Cubic = _easeMap.Cubic,
    Quart = _easeMap.Quart,
    Quint = _easeMap.Quint,
    Strong = _easeMap.Strong,
    Elastic = _easeMap.Elastic,
    Back = _easeMap.Back,
    SteppedEase = _easeMap.SteppedEase,
    Bounce = _easeMap.Bounce,
    Sine = _easeMap.Sine,
    Expo = _easeMap.Expo,
    Circ = _easeMap.Circ;
exports.Circ = Circ;
exports.Expo = Expo;
exports.Sine = Sine;
exports.Bounce = Bounce;
exports.SteppedEase = SteppedEase;
exports.Back = Back;
exports.Elastic = Elastic;
exports.Strong = Strong;
exports.Quint = Quint;
exports.Quart = Quart;
exports.Cubic = Cubic;
exports.Quad = Quad;
exports.Linear = Linear;
exports.Power4 = Power4;
exports.Power3 = Power3;
exports.Power2 = Power2;
exports.Power1 = Power1;
exports.Power0 = Power0;
},{}],"../node_modules/gsap/CSSPlugin.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkPrefix = exports._createElement = exports._getBBox = exports.default = exports.CSSPlugin = void 0;

var _gsapCore = require("./gsap-core.js");

/*!
 * CSSPlugin 3.6.0
 * https://greensock.com
 *
 * Copyright 2008-2021, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/

/* eslint-disable */
var _win,
    _doc,
    _docElement,
    _pluginInitted,
    _tempDiv,
    _tempDivStyler,
    _recentSetterPlugin,
    _windowExists = function _windowExists() {
  return typeof window !== "undefined";
},
    _transformProps = {},
    _RAD2DEG = 180 / Math.PI,
    _DEG2RAD = Math.PI / 180,
    _atan2 = Math.atan2,
    _bigNum = 1e8,
    _capsExp = /([A-Z])/g,
    _horizontalExp = /(?:left|right|width|margin|padding|x)/i,
    _complexExp = /[\s,\(]\S/,
    _propertyAliases = {
  autoAlpha: "opacity,visibility",
  scale: "scaleX,scaleY",
  alpha: "opacity"
},
    _renderCSSProp = function _renderCSSProp(ratio, data) {
  return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 10000) / 10000 + data.u, data);
},
    _renderPropWithEnd = function _renderPropWithEnd(ratio, data) {
  return data.set(data.t, data.p, ratio === 1 ? data.e : Math.round((data.s + data.c * ratio) * 10000) / 10000 + data.u, data);
},
    _renderCSSPropWithBeginning = function _renderCSSPropWithBeginning(ratio, data) {
  return data.set(data.t, data.p, ratio ? Math.round((data.s + data.c * ratio) * 10000) / 10000 + data.u : data.b, data);
},
    //if units change, we need a way to render the original unit/value when the tween goes all the way back to the beginning (ratio:0)
_renderRoundedCSSProp = function _renderRoundedCSSProp(ratio, data) {
  var value = data.s + data.c * ratio;
  data.set(data.t, data.p, ~~(value + (value < 0 ? -.5 : .5)) + data.u, data);
},
    _renderNonTweeningValue = function _renderNonTweeningValue(ratio, data) {
  return data.set(data.t, data.p, ratio ? data.e : data.b, data);
},
    _renderNonTweeningValueOnlyAtEnd = function _renderNonTweeningValueOnlyAtEnd(ratio, data) {
  return data.set(data.t, data.p, ratio !== 1 ? data.b : data.e, data);
},
    _setterCSSStyle = function _setterCSSStyle(target, property, value) {
  return target.style[property] = value;
},
    _setterCSSProp = function _setterCSSProp(target, property, value) {
  return target.style.setProperty(property, value);
},
    _setterTransform = function _setterTransform(target, property, value) {
  return target._gsap[property] = value;
},
    _setterScale = function _setterScale(target, property, value) {
  return target._gsap.scaleX = target._gsap.scaleY = value;
},
    _setterScaleWithRender = function _setterScaleWithRender(target, property, value, data, ratio) {
  var cache = target._gsap;
  cache.scaleX = cache.scaleY = value;
  cache.renderTransform(ratio, cache);
},
    _setterTransformWithRender = function _setterTransformWithRender(target, property, value, data, ratio) {
  var cache = target._gsap;
  cache[property] = value;
  cache.renderTransform(ratio, cache);
},
    _transformProp = "transform",
    _transformOriginProp = _transformProp + "Origin",
    _supports3D,
    _createElement = function _createElement(type, ns) {
  var e = _doc.createElementNS ? _doc.createElementNS((ns || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), type) : _doc.createElement(type); //some servers swap in https for http in the namespace which can break things, making "style" inaccessible.

  return e.style ? e : _doc.createElement(type); //some environments won't allow access to the element's style when created with a namespace in which case we default to the standard createElement() to work around the issue. Also note that when GSAP is embedded directly inside an SVG file, createElement() won't allow access to the style object in Firefox (see https://greensock.com/forums/topic/20215-problem-using-tweenmax-in-standalone-self-containing-svg-file-err-cannot-set-property-csstext-of-undefined/).
},
    _getComputedProperty = function _getComputedProperty(target, property, skipPrefixFallback) {
  var cs = getComputedStyle(target);
  return cs[property] || cs.getPropertyValue(property.replace(_capsExp, "-$1").toLowerCase()) || cs.getPropertyValue(property) || !skipPrefixFallback && _getComputedProperty(target, _checkPropPrefix(property) || property, 1) || ""; //css variables may not need caps swapped out for dashes and lowercase.
},
    _prefixes = "O,Moz,ms,Ms,Webkit".split(","),
    _checkPropPrefix = function _checkPropPrefix(property, element, preferPrefix) {
  var e = element || _tempDiv,
      s = e.style,
      i = 5;

  if (property in s && !preferPrefix) {
    return property;
  }

  property = property.charAt(0).toUpperCase() + property.substr(1);

  while (i-- && !(_prefixes[i] + property in s)) {}

  return i < 0 ? null : (i === 3 ? "ms" : i >= 0 ? _prefixes[i] : "") + property;
},
    _initCore = function _initCore() {
  if (_windowExists() && window.document) {
    _win = window;
    _doc = _win.document;
    _docElement = _doc.documentElement;
    _tempDiv = _createElement("div") || {
      style: {}
    };
    _tempDivStyler = _createElement("div");
    _transformProp = _checkPropPrefix(_transformProp);
    _transformOriginProp = _transformProp + "Origin";
    _tempDiv.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0"; //make sure to override certain properties that may contaminate measurements, in case the user has overreaching style sheets.

    _supports3D = !!_checkPropPrefix("perspective");
    _pluginInitted = 1;
  }
},
    _getBBoxHack = function _getBBoxHack(swapIfPossible) {
  //works around issues in some browsers (like Firefox) that don't correctly report getBBox() on SVG elements inside a <defs> element and/or <mask>. We try creating an SVG, adding it to the documentElement and toss the element in there so that it's definitely part of the rendering tree, then grab the bbox and if it works, we actually swap out the original getBBox() method for our own that does these extra steps whenever getBBox is needed. This helps ensure that performance is optimal (only do all these extra steps when absolutely necessary...most elements don't need it).
  var svg = _createElement("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"),
      oldParent = this.parentNode,
      oldSibling = this.nextSibling,
      oldCSS = this.style.cssText,
      bbox;

  _docElement.appendChild(svg);

  svg.appendChild(this);
  this.style.display = "block";

  if (swapIfPossible) {
    try {
      bbox = this.getBBox();
      this._gsapBBox = this.getBBox; //store the original

      this.getBBox = _getBBoxHack;
    } catch (e) {}
  } else if (this._gsapBBox) {
    bbox = this._gsapBBox();
  }

  if (oldParent) {
    if (oldSibling) {
      oldParent.insertBefore(this, oldSibling);
    } else {
      oldParent.appendChild(this);
    }
  }

  _docElement.removeChild(svg);

  this.style.cssText = oldCSS;
  return bbox;
},
    _getAttributeFallbacks = function _getAttributeFallbacks(target, attributesArray) {
  var i = attributesArray.length;

  while (i--) {
    if (target.hasAttribute(attributesArray[i])) {
      return target.getAttribute(attributesArray[i]);
    }
  }
},
    _getBBox = function _getBBox(target) {
  var bounds;

  try {
    bounds = target.getBBox(); //Firefox throws errors if you try calling getBBox() on an SVG element that's not rendered (like in a <symbol> or <defs>). https://bugzilla.mozilla.org/show_bug.cgi?id=612118
  } catch (error) {
    bounds = _getBBoxHack.call(target, true);
  }

  bounds && (bounds.width || bounds.height) || target.getBBox === _getBBoxHack || (bounds = _getBBoxHack.call(target, true)); //some browsers (like Firefox) misreport the bounds if the element has zero width and height (it just assumes it's at x:0, y:0), thus we need to manually grab the position in that case.

  return bounds && !bounds.width && !bounds.x && !bounds.y ? {
    x: +_getAttributeFallbacks(target, ["x", "cx", "x1"]) || 0,
    y: +_getAttributeFallbacks(target, ["y", "cy", "y1"]) || 0,
    width: 0,
    height: 0
  } : bounds;
},
    _isSVG = function _isSVG(e) {
  return !!(e.getCTM && (!e.parentNode || e.ownerSVGElement) && _getBBox(e));
},
    //reports if the element is an SVG on which getBBox() actually works
_removeProperty = function _removeProperty(target, property) {
  if (property) {
    var style = target.style;

    if (property in _transformProps && property !== _transformOriginProp) {
      property = _transformProp;
    }

    if (style.removeProperty) {
      if (property.substr(0, 2) === "ms" || property.substr(0, 6) === "webkit") {
        //Microsoft and some Webkit browsers don't conform to the standard of capitalizing the first prefix character, so we adjust so that when we prefix the caps with a dash, it's correct (otherwise it'd be "ms-transform" instead of "-ms-transform" for IE9, for example)
        property = "-" + property;
      }

      style.removeProperty(property.replace(_capsExp, "-$1").toLowerCase());
    } else {
      //note: old versions of IE use "removeAttribute()" instead of "removeProperty()"
      style.removeAttribute(property);
    }
  }
},
    _addNonTweeningPT = function _addNonTweeningPT(plugin, target, property, beginning, end, onlySetAtEnd) {
  var pt = new _gsapCore.PropTween(plugin._pt, target, property, 0, 1, onlySetAtEnd ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue);
  plugin._pt = pt;
  pt.b = beginning;
  pt.e = end;

  plugin._props.push(property);

  return pt;
},
    _nonConvertibleUnits = {
  deg: 1,
  rad: 1,
  turn: 1
},
    //takes a single value like 20px and converts it to the unit specified, like "%", returning only the numeric amount.
_convertToUnit = function _convertToUnit(target, property, value, unit) {
  var curValue = parseFloat(value) || 0,
      curUnit = (value + "").trim().substr((curValue + "").length) || "px",
      // some browsers leave extra whitespace at the beginning of CSS variables, hence the need to trim()
  style = _tempDiv.style,
      horizontal = _horizontalExp.test(property),
      isRootSVG = target.tagName.toLowerCase() === "svg",
      measureProperty = (isRootSVG ? "client" : "offset") + (horizontal ? "Width" : "Height"),
      amount = 100,
      toPixels = unit === "px",
      toPercent = unit === "%",
      px,
      parent,
      cache,
      isSVG;

  if (unit === curUnit || !curValue || _nonConvertibleUnits[unit] || _nonConvertibleUnits[curUnit]) {
    return curValue;
  }

  curUnit !== "px" && !toPixels && (curValue = _convertToUnit(target, property, value, "px"));
  isSVG = target.getCTM && _isSVG(target);

  if ((toPercent || curUnit === "%") && (_transformProps[property] || ~property.indexOf("adius"))) {
    px = isSVG ? target.getBBox()[horizontal ? "width" : "height"] : target[measureProperty];
    return (0, _gsapCore._round)(toPercent ? curValue / px * amount : curValue / 100 * px);
  }

  style[horizontal ? "width" : "height"] = amount + (toPixels ? curUnit : unit);
  parent = ~property.indexOf("adius") || unit === "em" && target.appendChild && !isRootSVG ? target : target.parentNode;

  if (isSVG) {
    parent = (target.ownerSVGElement || {}).parentNode;
  }

  if (!parent || parent === _doc || !parent.appendChild) {
    parent = _doc.body;
  }

  cache = parent._gsap;

  if (cache && toPercent && cache.width && horizontal && cache.time === _gsapCore._ticker.time) {
    return (0, _gsapCore._round)(curValue / cache.width * amount);
  } else {
    (toPercent || curUnit === "%") && (style.position = _getComputedProperty(target, "position"));
    parent === target && (style.position = "static"); // like for borderRadius, if it's a % we must have it relative to the target itself but that may not have position: relative or position: absolute in which case it'd go up the chain until it finds its offsetParent (bad). position: static protects against that.

    parent.appendChild(_tempDiv);
    px = _tempDiv[measureProperty];
    parent.removeChild(_tempDiv);
    style.position = "absolute";

    if (horizontal && toPercent) {
      cache = (0, _gsapCore._getCache)(parent);
      cache.time = _gsapCore._ticker.time;
      cache.width = parent[measureProperty];
    }
  }

  return (0, _gsapCore._round)(toPixels ? px * curValue / amount : px && curValue ? amount / px * curValue : 0);
},
    _get = function _get(target, property, unit, uncache) {
  var value;
  _pluginInitted || _initCore();

  if (property in _propertyAliases && property !== "transform") {
    property = _propertyAliases[property];

    if (~property.indexOf(",")) {
      property = property.split(",")[0];
    }
  }

  if (_transformProps[property] && property !== "transform") {
    value = _parseTransform(target, uncache);
    value = property !== "transformOrigin" ? value[property] : _firstTwoOnly(_getComputedProperty(target, _transformOriginProp)) + " " + value.zOrigin + "px";
  } else {
    value = target.style[property];

    if (!value || value === "auto" || uncache || ~(value + "").indexOf("calc(")) {
      value = _specialProps[property] && _specialProps[property](target, property, unit) || _getComputedProperty(target, property) || (0, _gsapCore._getProperty)(target, property) || (property === "opacity" ? 1 : 0); // note: some browsers, like Firefox, don't report borderRadius correctly! Instead, it only reports every corner like  borderTopLeftRadius
    }
  }

  return unit && !~(value + "").trim().indexOf(" ") ? _convertToUnit(target, property, value, unit) + unit : value;
},
    _tweenComplexCSSString = function _tweenComplexCSSString(target, prop, start, end) {
  //note: we call _tweenComplexCSSString.call(pluginInstance...) to ensure that it's scoped properly. We may call it from within a plugin too, thus "this" would refer to the plugin.
  if (!start || start === "none") {
    // some browsers like Safari actually PREFER the prefixed property and mis-report the unprefixed value like clipPath (BUG). In other words, even though clipPath exists in the style ("clipPath" in target.style) and it's set in the CSS properly (along with -webkit-clip-path), Safari reports clipPath as "none" whereas WebkitClipPath reports accurately like "ellipse(100% 0% at 50% 0%)", so in this case we must SWITCH to using the prefixed property instead. See https://greensock.com/forums/topic/18310-clippath-doesnt-work-on-ios/
    var p = _checkPropPrefix(prop, target, 1),
        s = p && _getComputedProperty(target, p, 1);

    if (s && s !== start) {
      prop = p;
      start = s;
    } else if (prop === "borderColor") {
      start = _getComputedProperty(target, "borderTopColor"); // Firefox bug: always reports "borderColor" as "", so we must fall back to borderTopColor. See https://greensock.com/forums/topic/24583-how-to-return-colors-that-i-had-after-reverse/
    }
  }

  var pt = new _gsapCore.PropTween(this._pt, target.style, prop, 0, 1, _gsapCore._renderComplexString),
      index = 0,
      matchIndex = 0,
      a,
      result,
      startValues,
      startNum,
      color,
      startValue,
      endValue,
      endNum,
      chunk,
      endUnit,
      startUnit,
      relative,
      endValues;
  pt.b = start;
  pt.e = end;
  start += ""; //ensure values are strings

  end += "";

  if (end === "auto") {
    target.style[prop] = end;
    end = _getComputedProperty(target, prop) || end;
    target.style[prop] = start;
  }

  a = [start, end];
  (0, _gsapCore._colorStringFilter)(a); //pass an array with the starting and ending values and let the filter do whatever it needs to the values. If colors are found, it returns true and then we must match where the color shows up order-wise because for things like boxShadow, sometimes the browser provides the computed values with the color FIRST, but the user provides it with the color LAST, so flip them if necessary. Same for drop-shadow().

  start = a[0];
  end = a[1];
  startValues = start.match(_gsapCore._numWithUnitExp) || [];
  endValues = end.match(_gsapCore._numWithUnitExp) || [];

  if (endValues.length) {
    while (result = _gsapCore._numWithUnitExp.exec(end)) {
      endValue = result[0];
      chunk = end.substring(index, result.index);

      if (color) {
        color = (color + 1) % 5;
      } else if (chunk.substr(-5) === "rgba(" || chunk.substr(-5) === "hsla(") {
        color = 1;
      }

      if (endValue !== (startValue = startValues[matchIndex++] || "")) {
        startNum = parseFloat(startValue) || 0;
        startUnit = startValue.substr((startNum + "").length);
        relative = endValue.charAt(1) === "=" ? +(endValue.charAt(0) + "1") : 0;

        if (relative) {
          endValue = endValue.substr(2);
        }

        endNum = parseFloat(endValue);
        endUnit = endValue.substr((endNum + "").length);
        index = _gsapCore._numWithUnitExp.lastIndex - endUnit.length;

        if (!endUnit) {
          //if something like "perspective:300" is passed in and we must add a unit to the end
          endUnit = endUnit || _gsapCore._config.units[prop] || startUnit;

          if (index === end.length) {
            end += endUnit;
            pt.e += endUnit;
          }
        }

        if (startUnit !== endUnit) {
          startNum = _convertToUnit(target, prop, startValue, endUnit) || 0;
        } //these nested PropTweens are handled in a special way - we'll never actually call a render or setter method on them. We'll just loop through them in the parent complex string PropTween's render method.


        pt._pt = {
          _next: pt._pt,
          p: chunk || matchIndex === 1 ? chunk : ",",
          //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
          s: startNum,
          c: relative ? relative * endNum : endNum - startNum,
          m: color && color < 4 || prop === "zIndex" ? Math.round : 0
        };
      }
    }

    pt.c = index < end.length ? end.substring(index, end.length) : ""; //we use the "c" of the PropTween to store the final part of the string (after the last number)
  } else {
    pt.r = prop === "display" && end === "none" ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue;
  }

  _gsapCore._relExp.test(end) && (pt.e = 0); //if the end string contains relative values or dynamic random(...) values, delete the end it so that on the final render we don't actually set it to the string with += or -= characters (forces it to use the calculated value).

  this._pt = pt; //start the linked list with this new PropTween. Remember, we call _tweenComplexCSSString.call(pluginInstance...) to ensure that it's scoped properly. We may call it from within another plugin too, thus "this" would refer to the plugin.

  return pt;
},
    _keywordToPercent = {
  top: "0%",
  bottom: "100%",
  left: "0%",
  right: "100%",
  center: "50%"
},
    _convertKeywordsToPercentages = function _convertKeywordsToPercentages(value) {
  var split = value.split(" "),
      x = split[0],
      y = split[1] || "50%";

  if (x === "top" || x === "bottom" || y === "left" || y === "right") {
    //the user provided them in the wrong order, so flip them
    value = x;
    x = y;
    y = value;
  }

  split[0] = _keywordToPercent[x] || x;
  split[1] = _keywordToPercent[y] || y;
  return split.join(" ");
},
    _renderClearProps = function _renderClearProps(ratio, data) {
  if (data.tween && data.tween._time === data.tween._dur) {
    var target = data.t,
        style = target.style,
        props = data.u,
        cache = target._gsap,
        prop,
        clearTransforms,
        i;

    if (props === "all" || props === true) {
      style.cssText = "";
      clearTransforms = 1;
    } else {
      props = props.split(",");
      i = props.length;

      while (--i > -1) {
        prop = props[i];

        if (_transformProps[prop]) {
          clearTransforms = 1;
          prop = prop === "transformOrigin" ? _transformOriginProp : _transformProp;
        }

        _removeProperty(target, prop);
      }
    }

    if (clearTransforms) {
      _removeProperty(target, _transformProp);

      if (cache) {
        cache.svg && target.removeAttribute("transform");

        _parseTransform(target, 1); // force all the cached values back to "normal"/identity, otherwise if there's another tween that's already set to render transforms on this element, it could display the wrong values.


        cache.uncache = 1;
      }
    }
  }
},
    // note: specialProps should return 1 if (and only if) they have a non-zero priority. It indicates we need to sort the linked list.
_specialProps = {
  clearProps: function clearProps(plugin, target, property, endValue, tween) {
    if (tween.data !== "isFromStart") {
      var pt = plugin._pt = new _gsapCore.PropTween(plugin._pt, target, property, 0, 0, _renderClearProps);
      pt.u = endValue;
      pt.pr = -10;
      pt.tween = tween;

      plugin._props.push(property);

      return 1;
    }
  }
  /* className feature (about 0.4kb gzipped).
  , className(plugin, target, property, endValue, tween) {
  	let _renderClassName = (ratio, data) => {
  			data.css.render(ratio, data.css);
  			if (!ratio || ratio === 1) {
  				let inline = data.rmv,
  					target = data.t,
  					p;
  				target.setAttribute("class", ratio ? data.e : data.b);
  				for (p in inline) {
  					_removeProperty(target, p);
  				}
  			}
  		},
  		_getAllStyles = (target) => {
  			let styles = {},
  				computed = getComputedStyle(target),
  				p;
  			for (p in computed) {
  				if (isNaN(p) && p !== "cssText" && p !== "length") {
  					styles[p] = computed[p];
  				}
  			}
  			_setDefaults(styles, _parseTransform(target, 1));
  			return styles;
  		},
  		startClassList = target.getAttribute("class"),
  		style = target.style,
  		cssText = style.cssText,
  		cache = target._gsap,
  		classPT = cache.classPT,
  		inlineToRemoveAtEnd = {},
  		data = {t:target, plugin:plugin, rmv:inlineToRemoveAtEnd, b:startClassList, e:(endValue.charAt(1) !== "=") ? endValue : startClassList.replace(new RegExp("(?:\\s|^)" + endValue.substr(2) + "(?![\\w-])"), "") + ((endValue.charAt(0) === "+") ? " " + endValue.substr(2) : "")},
  		changingVars = {},
  		startVars = _getAllStyles(target),
  		transformRelated = /(transform|perspective)/i,
  		endVars, p;
  	if (classPT) {
  		classPT.r(1, classPT.d);
  		_removeLinkedListItem(classPT.d.plugin, classPT, "_pt");
  	}
  	target.setAttribute("class", data.e);
  	endVars = _getAllStyles(target, true);
  	target.setAttribute("class", startClassList);
  	for (p in endVars) {
  		if (endVars[p] !== startVars[p] && !transformRelated.test(p)) {
  			changingVars[p] = endVars[p];
  			if (!style[p] && style[p] !== "0") {
  				inlineToRemoveAtEnd[p] = 1;
  			}
  		}
  	}
  	cache.classPT = plugin._pt = new PropTween(plugin._pt, target, "className", 0, 0, _renderClassName, data, 0, -11);
  	if (style.cssText !== cssText) { //only apply if things change. Otherwise, in cases like a background-image that's pulled dynamically, it could cause a refresh. See https://greensock.com/forums/topic/20368-possible-gsap-bug-switching-classnames-in-chrome/.
  		style.cssText = cssText; //we recorded cssText before we swapped classes and ran _getAllStyles() because in cases when a className tween is overwritten, we remove all the related tweening properties from that class change (otherwise class-specific stuff can't override properties we've directly set on the target's style object due to specificity).
  	}
  	_parseTransform(target, true); //to clear the caching of transforms
  	data.css = new gsap.plugins.css();
  	data.css.init(target, changingVars, tween);
  	plugin._props.push(...data.css._props);
  	return 1;
  }
  */

},

/*
 * --------------------------------------------------------------------------------------
 * TRANSFORMS
 * --------------------------------------------------------------------------------------
 */
_identity2DMatrix = [1, 0, 0, 1, 0, 0],
    _rotationalProperties = {},
    _isNullTransform = function _isNullTransform(value) {
  return value === "matrix(1, 0, 0, 1, 0, 0)" || value === "none" || !value;
},
    _getComputedTransformMatrixAsArray = function _getComputedTransformMatrixAsArray(target) {
  var matrixString = _getComputedProperty(target, _transformProp);

  return _isNullTransform(matrixString) ? _identity2DMatrix : matrixString.substr(7).match(_gsapCore._numExp).map(_gsapCore._round);
},
    _getMatrix = function _getMatrix(target, force2D) {
  var cache = target._gsap || (0, _gsapCore._getCache)(target),
      style = target.style,
      matrix = _getComputedTransformMatrixAsArray(target),
      parent,
      nextSibling,
      temp,
      addedToDOM;

  if (cache.svg && target.getAttribute("transform")) {
    temp = target.transform.baseVal.consolidate().matrix; //ensures that even complex values like "translate(50,60) rotate(135,0,0)" are parsed because it mashes it into a matrix.

    matrix = [temp.a, temp.b, temp.c, temp.d, temp.e, temp.f];
    return matrix.join(",") === "1,0,0,1,0,0" ? _identity2DMatrix : matrix;
  } else if (matrix === _identity2DMatrix && !target.offsetParent && target !== _docElement && !cache.svg) {
    //note: if offsetParent is null, that means the element isn't in the normal document flow, like if it has display:none or one of its ancestors has display:none). Firefox returns null for getComputedStyle() if the element is in an iframe that has display:none. https://bugzilla.mozilla.org/show_bug.cgi?id=548397
    //browsers don't report transforms accurately unless the element is in the DOM and has a display value that's not "none". Firefox and Microsoft browsers have a partial bug where they'll report transforms even if display:none BUT not any percentage-based values like translate(-50%, 8px) will be reported as if it's translate(0, 8px).
    temp = style.display;
    style.display = "block";
    parent = target.parentNode;

    if (!parent || !target.offsetParent) {
      // note: in 3.3.0 we switched target.offsetParent to _doc.body.contains(target) to avoid [sometimes unnecessary] MutationObserver calls but that wasn't adequate because there are edge cases where nested position: fixed elements need to get reparented to accurately sense transforms. See https://github.com/greensock/GSAP/issues/388 and https://github.com/greensock/GSAP/issues/375
      addedToDOM = 1; //flag

      nextSibling = target.nextSibling;

      _docElement.appendChild(target); //we must add it to the DOM in order to get values properly

    }

    matrix = _getComputedTransformMatrixAsArray(target);
    temp ? style.display = temp : _removeProperty(target, "display");

    if (addedToDOM) {
      nextSibling ? parent.insertBefore(target, nextSibling) : parent ? parent.appendChild(target) : _docElement.removeChild(target);
    }
  }

  return force2D && matrix.length > 6 ? [matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]] : matrix;
},
    _applySVGOrigin = function _applySVGOrigin(target, origin, originIsAbsolute, smooth, matrixArray, pluginToAddPropTweensTo) {
  var cache = target._gsap,
      matrix = matrixArray || _getMatrix(target, true),
      xOriginOld = cache.xOrigin || 0,
      yOriginOld = cache.yOrigin || 0,
      xOffsetOld = cache.xOffset || 0,
      yOffsetOld = cache.yOffset || 0,
      a = matrix[0],
      b = matrix[1],
      c = matrix[2],
      d = matrix[3],
      tx = matrix[4],
      ty = matrix[5],
      originSplit = origin.split(" "),
      xOrigin = parseFloat(originSplit[0]) || 0,
      yOrigin = parseFloat(originSplit[1]) || 0,
      bounds,
      determinant,
      x,
      y;

  if (!originIsAbsolute) {
    bounds = _getBBox(target);
    xOrigin = bounds.x + (~originSplit[0].indexOf("%") ? xOrigin / 100 * bounds.width : xOrigin);
    yOrigin = bounds.y + (~(originSplit[1] || originSplit[0]).indexOf("%") ? yOrigin / 100 * bounds.height : yOrigin);
  } else if (matrix !== _identity2DMatrix && (determinant = a * d - b * c)) {
    //if it's zero (like if scaleX and scaleY are zero), skip it to avoid errors with dividing by zero.
    x = xOrigin * (d / determinant) + yOrigin * (-c / determinant) + (c * ty - d * tx) / determinant;
    y = xOrigin * (-b / determinant) + yOrigin * (a / determinant) - (a * ty - b * tx) / determinant;
    xOrigin = x;
    yOrigin = y;
  }

  if (smooth || smooth !== false && cache.smooth) {
    tx = xOrigin - xOriginOld;
    ty = yOrigin - yOriginOld;
    cache.xOffset = xOffsetOld + (tx * a + ty * c) - tx;
    cache.yOffset = yOffsetOld + (tx * b + ty * d) - ty;
  } else {
    cache.xOffset = cache.yOffset = 0;
  }

  cache.xOrigin = xOrigin;
  cache.yOrigin = yOrigin;
  cache.smooth = !!smooth;
  cache.origin = origin;
  cache.originIsAbsolute = !!originIsAbsolute;
  target.style[_transformOriginProp] = "0px 0px"; //otherwise, if someone sets  an origin via CSS, it will likely interfere with the SVG transform attribute ones (because remember, we're baking the origin into the matrix() value).

  if (pluginToAddPropTweensTo) {
    _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOrigin", xOriginOld, xOrigin);

    _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOrigin", yOriginOld, yOrigin);

    _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOffset", xOffsetOld, cache.xOffset);

    _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOffset", yOffsetOld, cache.yOffset);
  }

  target.setAttribute("data-svg-origin", xOrigin + " " + yOrigin);
},
    _parseTransform = function _parseTransform(target, uncache) {
  var cache = target._gsap || new _gsapCore.GSCache(target);

  if ("x" in cache && !uncache && !cache.uncache) {
    return cache;
  }

  var style = target.style,
      invertedScaleX = cache.scaleX < 0,
      px = "px",
      deg = "deg",
      origin = _getComputedProperty(target, _transformOriginProp) || "0",
      x,
      y,
      z,
      scaleX,
      scaleY,
      rotation,
      rotationX,
      rotationY,
      skewX,
      skewY,
      perspective,
      xOrigin,
      yOrigin,
      matrix,
      angle,
      cos,
      sin,
      a,
      b,
      c,
      d,
      a12,
      a22,
      t1,
      t2,
      t3,
      a13,
      a23,
      a33,
      a42,
      a43,
      a32;
  x = y = z = rotation = rotationX = rotationY = skewX = skewY = perspective = 0;
  scaleX = scaleY = 1;
  cache.svg = !!(target.getCTM && _isSVG(target));
  matrix = _getMatrix(target, cache.svg);

  if (cache.svg) {
    t1 = !cache.uncache && target.getAttribute("data-svg-origin");

    _applySVGOrigin(target, t1 || origin, !!t1 || cache.originIsAbsolute, cache.smooth !== false, matrix);
  }

  xOrigin = cache.xOrigin || 0;
  yOrigin = cache.yOrigin || 0;

  if (matrix !== _identity2DMatrix) {
    a = matrix[0]; //a11

    b = matrix[1]; //a21

    c = matrix[2]; //a31

    d = matrix[3]; //a41

    x = a12 = matrix[4];
    y = a22 = matrix[5]; //2D matrix

    if (matrix.length === 6) {
      scaleX = Math.sqrt(a * a + b * b);
      scaleY = Math.sqrt(d * d + c * c);
      rotation = a || b ? _atan2(b, a) * _RAD2DEG : 0; //note: if scaleX is 0, we cannot accurately measure rotation. Same for skewX with a scaleY of 0. Therefore, we default to the previously recorded value (or zero if that doesn't exist).

      skewX = c || d ? _atan2(c, d) * _RAD2DEG + rotation : 0;
      skewX && (scaleY *= Math.cos(skewX * _DEG2RAD));

      if (cache.svg) {
        x -= xOrigin - (xOrigin * a + yOrigin * c);
        y -= yOrigin - (xOrigin * b + yOrigin * d);
      } //3D matrix

    } else {
      a32 = matrix[6];
      a42 = matrix[7];
      a13 = matrix[8];
      a23 = matrix[9];
      a33 = matrix[10];
      a43 = matrix[11];
      x = matrix[12];
      y = matrix[13];
      z = matrix[14];
      angle = _atan2(a32, a33);
      rotationX = angle * _RAD2DEG; //rotationX

      if (angle) {
        cos = Math.cos(-angle);
        sin = Math.sin(-angle);
        t1 = a12 * cos + a13 * sin;
        t2 = a22 * cos + a23 * sin;
        t3 = a32 * cos + a33 * sin;
        a13 = a12 * -sin + a13 * cos;
        a23 = a22 * -sin + a23 * cos;
        a33 = a32 * -sin + a33 * cos;
        a43 = a42 * -sin + a43 * cos;
        a12 = t1;
        a22 = t2;
        a32 = t3;
      } //rotationY


      angle = _atan2(-c, a33);
      rotationY = angle * _RAD2DEG;

      if (angle) {
        cos = Math.cos(-angle);
        sin = Math.sin(-angle);
        t1 = a * cos - a13 * sin;
        t2 = b * cos - a23 * sin;
        t3 = c * cos - a33 * sin;
        a43 = d * sin + a43 * cos;
        a = t1;
        b = t2;
        c = t3;
      } //rotationZ


      angle = _atan2(b, a);
      rotation = angle * _RAD2DEG;

      if (angle) {
        cos = Math.cos(angle);
        sin = Math.sin(angle);
        t1 = a * cos + b * sin;
        t2 = a12 * cos + a22 * sin;
        b = b * cos - a * sin;
        a22 = a22 * cos - a12 * sin;
        a = t1;
        a12 = t2;
      }

      if (rotationX && Math.abs(rotationX) + Math.abs(rotation) > 359.9) {
        //when rotationY is set, it will often be parsed as 180 degrees different than it should be, and rotationX and rotation both being 180 (it looks the same), so we adjust for that here.
        rotationX = rotation = 0;
        rotationY = 180 - rotationY;
      }

      scaleX = (0, _gsapCore._round)(Math.sqrt(a * a + b * b + c * c));
      scaleY = (0, _gsapCore._round)(Math.sqrt(a22 * a22 + a32 * a32));
      angle = _atan2(a12, a22);
      skewX = Math.abs(angle) > 0.0002 ? angle * _RAD2DEG : 0;
      perspective = a43 ? 1 / (a43 < 0 ? -a43 : a43) : 0;
    }

    if (cache.svg) {
      //sense if there are CSS transforms applied on an SVG element in which case we must overwrite them when rendering. The transform attribute is more reliable cross-browser, but we can't just remove the CSS ones because they may be applied in a CSS rule somewhere (not just inline).
      t1 = target.getAttribute("transform");
      cache.forceCSS = target.setAttribute("transform", "") || !_isNullTransform(_getComputedProperty(target, _transformProp));
      t1 && target.setAttribute("transform", t1);
    }
  }

  if (Math.abs(skewX) > 90 && Math.abs(skewX) < 270) {
    if (invertedScaleX) {
      scaleX *= -1;
      skewX += rotation <= 0 ? 180 : -180;
      rotation += rotation <= 0 ? 180 : -180;
    } else {
      scaleY *= -1;
      skewX += skewX <= 0 ? 180 : -180;
    }
  }

  cache.x = x - ((cache.xPercent = x && (cache.xPercent || (Math.round(target.offsetWidth / 2) === Math.round(-x) ? -50 : 0))) ? target.offsetWidth * cache.xPercent / 100 : 0) + px;
  cache.y = y - ((cache.yPercent = y && (cache.yPercent || (Math.round(target.offsetHeight / 2) === Math.round(-y) ? -50 : 0))) ? target.offsetHeight * cache.yPercent / 100 : 0) + px;
  cache.z = z + px;
  cache.scaleX = (0, _gsapCore._round)(scaleX);
  cache.scaleY = (0, _gsapCore._round)(scaleY);
  cache.rotation = (0, _gsapCore._round)(rotation) + deg;
  cache.rotationX = (0, _gsapCore._round)(rotationX) + deg;
  cache.rotationY = (0, _gsapCore._round)(rotationY) + deg;
  cache.skewX = skewX + deg;
  cache.skewY = skewY + deg;
  cache.transformPerspective = perspective + px;

  if (cache.zOrigin = parseFloat(origin.split(" ")[2]) || 0) {
    style[_transformOriginProp] = _firstTwoOnly(origin);
  }

  cache.xOffset = cache.yOffset = 0;
  cache.force3D = _gsapCore._config.force3D;
  cache.renderTransform = cache.svg ? _renderSVGTransforms : _supports3D ? _renderCSSTransforms : _renderNon3DTransforms;
  cache.uncache = 0;
  return cache;
},
    _firstTwoOnly = function _firstTwoOnly(value) {
  return (value = value.split(" "))[0] + " " + value[1];
},
    //for handling transformOrigin values, stripping out the 3rd dimension
_addPxTranslate = function _addPxTranslate(target, start, value) {
  var unit = (0, _gsapCore.getUnit)(start);
  return (0, _gsapCore._round)(parseFloat(start) + parseFloat(_convertToUnit(target, "x", value + "px", unit))) + unit;
},
    _renderNon3DTransforms = function _renderNon3DTransforms(ratio, cache) {
  cache.z = "0px";
  cache.rotationY = cache.rotationX = "0deg";
  cache.force3D = 0;

  _renderCSSTransforms(ratio, cache);
},
    _zeroDeg = "0deg",
    _zeroPx = "0px",
    _endParenthesis = ") ",
    _renderCSSTransforms = function _renderCSSTransforms(ratio, cache) {
  var _ref = cache || this,
      xPercent = _ref.xPercent,
      yPercent = _ref.yPercent,
      x = _ref.x,
      y = _ref.y,
      z = _ref.z,
      rotation = _ref.rotation,
      rotationY = _ref.rotationY,
      rotationX = _ref.rotationX,
      skewX = _ref.skewX,
      skewY = _ref.skewY,
      scaleX = _ref.scaleX,
      scaleY = _ref.scaleY,
      transformPerspective = _ref.transformPerspective,
      force3D = _ref.force3D,
      target = _ref.target,
      zOrigin = _ref.zOrigin,
      transforms = "",
      use3D = force3D === "auto" && ratio && ratio !== 1 || force3D === true; // Safari has a bug that causes it not to render 3D transform-origin values properly, so we force the z origin to 0, record it in the cache, and then do the math here to offset the translate values accordingly (basically do the 3D transform-origin part manually)


  if (zOrigin && (rotationX !== _zeroDeg || rotationY !== _zeroDeg)) {
    var angle = parseFloat(rotationY) * _DEG2RAD,
        a13 = Math.sin(angle),
        a33 = Math.cos(angle),
        cos;

    angle = parseFloat(rotationX) * _DEG2RAD;
    cos = Math.cos(angle);
    x = _addPxTranslate(target, x, a13 * cos * -zOrigin);
    y = _addPxTranslate(target, y, -Math.sin(angle) * -zOrigin);
    z = _addPxTranslate(target, z, a33 * cos * -zOrigin + zOrigin);
  }

  if (transformPerspective !== _zeroPx) {
    transforms += "perspective(" + transformPerspective + _endParenthesis;
  }

  if (xPercent || yPercent) {
    transforms += "translate(" + xPercent + "%, " + yPercent + "%) ";
  }

  if (use3D || x !== _zeroPx || y !== _zeroPx || z !== _zeroPx) {
    transforms += z !== _zeroPx || use3D ? "translate3d(" + x + ", " + y + ", " + z + ") " : "translate(" + x + ", " + y + _endParenthesis;
  }

  if (rotation !== _zeroDeg) {
    transforms += "rotate(" + rotation + _endParenthesis;
  }

  if (rotationY !== _zeroDeg) {
    transforms += "rotateY(" + rotationY + _endParenthesis;
  }

  if (rotationX !== _zeroDeg) {
    transforms += "rotateX(" + rotationX + _endParenthesis;
  }

  if (skewX !== _zeroDeg || skewY !== _zeroDeg) {
    transforms += "skew(" + skewX + ", " + skewY + _endParenthesis;
  }

  if (scaleX !== 1 || scaleY !== 1) {
    transforms += "scale(" + scaleX + ", " + scaleY + _endParenthesis;
  }

  target.style[_transformProp] = transforms || "translate(0, 0)";
},
    _renderSVGTransforms = function _renderSVGTransforms(ratio, cache) {
  var _ref2 = cache || this,
      xPercent = _ref2.xPercent,
      yPercent = _ref2.yPercent,
      x = _ref2.x,
      y = _ref2.y,
      rotation = _ref2.rotation,
      skewX = _ref2.skewX,
      skewY = _ref2.skewY,
      scaleX = _ref2.scaleX,
      scaleY = _ref2.scaleY,
      target = _ref2.target,
      xOrigin = _ref2.xOrigin,
      yOrigin = _ref2.yOrigin,
      xOffset = _ref2.xOffset,
      yOffset = _ref2.yOffset,
      forceCSS = _ref2.forceCSS,
      tx = parseFloat(x),
      ty = parseFloat(y),
      a11,
      a21,
      a12,
      a22,
      temp;

  rotation = parseFloat(rotation);
  skewX = parseFloat(skewX);
  skewY = parseFloat(skewY);

  if (skewY) {
    //for performance reasons, we combine all skewing into the skewX and rotation values. Remember, a skewY of 10 degrees looks the same as a rotation of 10 degrees plus a skewX of 10 degrees.
    skewY = parseFloat(skewY);
    skewX += skewY;
    rotation += skewY;
  }

  if (rotation || skewX) {
    rotation *= _DEG2RAD;
    skewX *= _DEG2RAD;
    a11 = Math.cos(rotation) * scaleX;
    a21 = Math.sin(rotation) * scaleX;
    a12 = Math.sin(rotation - skewX) * -scaleY;
    a22 = Math.cos(rotation - skewX) * scaleY;

    if (skewX) {
      skewY *= _DEG2RAD;
      temp = Math.tan(skewX - skewY);
      temp = Math.sqrt(1 + temp * temp);
      a12 *= temp;
      a22 *= temp;

      if (skewY) {
        temp = Math.tan(skewY);
        temp = Math.sqrt(1 + temp * temp);
        a11 *= temp;
        a21 *= temp;
      }
    }

    a11 = (0, _gsapCore._round)(a11);
    a21 = (0, _gsapCore._round)(a21);
    a12 = (0, _gsapCore._round)(a12);
    a22 = (0, _gsapCore._round)(a22);
  } else {
    a11 = scaleX;
    a22 = scaleY;
    a21 = a12 = 0;
  }

  if (tx && !~(x + "").indexOf("px") || ty && !~(y + "").indexOf("px")) {
    tx = _convertToUnit(target, "x", x, "px");
    ty = _convertToUnit(target, "y", y, "px");
  }

  if (xOrigin || yOrigin || xOffset || yOffset) {
    tx = (0, _gsapCore._round)(tx + xOrigin - (xOrigin * a11 + yOrigin * a12) + xOffset);
    ty = (0, _gsapCore._round)(ty + yOrigin - (xOrigin * a21 + yOrigin * a22) + yOffset);
  }

  if (xPercent || yPercent) {
    //The SVG spec doesn't support percentage-based translation in the "transform" attribute, so we merge it into the translation to simulate it.
    temp = target.getBBox();
    tx = (0, _gsapCore._round)(tx + xPercent / 100 * temp.width);
    ty = (0, _gsapCore._round)(ty + yPercent / 100 * temp.height);
  }

  temp = "matrix(" + a11 + "," + a21 + "," + a12 + "," + a22 + "," + tx + "," + ty + ")";
  target.setAttribute("transform", temp);
  forceCSS && (target.style[_transformProp] = temp); //some browsers prioritize CSS transforms over the transform attribute. When we sense that the user has CSS transforms applied, we must overwrite them this way (otherwise some browser simply won't render the  transform attribute changes!)
},
    _addRotationalPropTween = function _addRotationalPropTween(plugin, target, property, startNum, endValue, relative) {
  var cap = 360,
      isString = (0, _gsapCore._isString)(endValue),
      endNum = parseFloat(endValue) * (isString && ~endValue.indexOf("rad") ? _RAD2DEG : 1),
      change = relative ? endNum * relative : endNum - startNum,
      finalValue = startNum + change + "deg",
      direction,
      pt;

  if (isString) {
    direction = endValue.split("_")[1];

    if (direction === "short") {
      change %= cap;

      if (change !== change % (cap / 2)) {
        change += change < 0 ? cap : -cap;
      }
    }

    if (direction === "cw" && change < 0) {
      change = (change + cap * _bigNum) % cap - ~~(change / cap) * cap;
    } else if (direction === "ccw" && change > 0) {
      change = (change - cap * _bigNum) % cap - ~~(change / cap) * cap;
    }
  }

  plugin._pt = pt = new _gsapCore.PropTween(plugin._pt, target, property, startNum, change, _renderPropWithEnd);
  pt.e = finalValue;
  pt.u = "deg";

  plugin._props.push(property);

  return pt;
},
    _addRawTransformPTs = function _addRawTransformPTs(plugin, transforms, target) {
  //for handling cases where someone passes in a whole transform string, like transform: "scale(2, 3) rotate(20deg) translateY(30em)"
  var style = _tempDivStyler.style,
      startCache = target._gsap,
      exclude = "perspective,force3D,transformOrigin,svgOrigin",
      endCache,
      p,
      startValue,
      endValue,
      startNum,
      endNum,
      startUnit,
      endUnit;
  style.cssText = getComputedStyle(target).cssText + ";position:absolute;display:block;"; //%-based translations will fail unless we set the width/height to match the original target (and padding/borders can affect it)

  style[_transformProp] = transforms;

  _doc.body.appendChild(_tempDivStyler);

  endCache = _parseTransform(_tempDivStyler, 1);

  for (p in _transformProps) {
    startValue = startCache[p];
    endValue = endCache[p];

    if (startValue !== endValue && exclude.indexOf(p) < 0) {
      //tweening to no perspective gives very unintuitive results - just keep the same perspective in that case.
      startUnit = (0, _gsapCore.getUnit)(startValue);
      endUnit = (0, _gsapCore.getUnit)(endValue);
      startNum = startUnit !== endUnit ? _convertToUnit(target, p, startValue, endUnit) : parseFloat(startValue);
      endNum = parseFloat(endValue);
      plugin._pt = new _gsapCore.PropTween(plugin._pt, startCache, p, startNum, endNum - startNum, _renderCSSProp);
      plugin._pt.u = endUnit || 0;

      plugin._props.push(p);
    }
  }

  _doc.body.removeChild(_tempDivStyler);
}; // handle splitting apart padding, margin, borderWidth, and borderRadius into their 4 components. Firefox, for example, won't report borderRadius correctly - it will only do borderTopLeftRadius and the other corners. We also want to handle paddingTop, marginLeft, borderRightWidth, etc.


exports._getBBox = _getBBox;
exports.checkPrefix = _checkPropPrefix;
exports._createElement = _createElement;
(0, _gsapCore._forEachName)("padding,margin,Width,Radius", function (name, index) {
  var t = "Top",
      r = "Right",
      b = "Bottom",
      l = "Left",
      props = (index < 3 ? [t, r, b, l] : [t + l, t + r, b + r, b + l]).map(function (side) {
    return index < 2 ? name + side : "border" + side + name;
  });

  _specialProps[index > 1 ? "border" + name : name] = function (plugin, target, property, endValue, tween) {
    var a, vars;

    if (arguments.length < 4) {
      // getter, passed target, property, and unit (from _get())
      a = props.map(function (prop) {
        return _get(plugin, prop, property);
      });
      vars = a.join(" ");
      return vars.split(a[0]).length === 5 ? a[0] : vars;
    }

    a = (endValue + "").split(" ");
    vars = {};
    props.forEach(function (prop, i) {
      return vars[prop] = a[i] = a[i] || a[(i - 1) / 2 | 0];
    });
    plugin.init(target, vars, tween);
  };
});
var CSSPlugin = {
  name: "css",
  register: _initCore,
  targetTest: function targetTest(target) {
    return target.style && target.nodeType;
  },
  init: function init(target, vars, tween, index, targets) {
    var props = this._props,
        style = target.style,
        startAt = tween.vars.startAt,
        startValue,
        endValue,
        endNum,
        startNum,
        type,
        specialProp,
        p,
        startUnit,
        endUnit,
        relative,
        isTransformRelated,
        transformPropTween,
        cache,
        smooth,
        hasPriority;
    _pluginInitted || _initCore();

    for (p in vars) {
      if (p === "autoRound") {
        continue;
      }

      endValue = vars[p];

      if (_gsapCore._plugins[p] && (0, _gsapCore._checkPlugin)(p, vars, tween, index, target, targets)) {
        // plugins
        continue;
      }

      type = typeof endValue;
      specialProp = _specialProps[p];

      if (type === "function") {
        endValue = endValue.call(tween, index, target, targets);
        type = typeof endValue;
      }

      if (type === "string" && ~endValue.indexOf("random(")) {
        endValue = (0, _gsapCore._replaceRandom)(endValue);
      }

      if (specialProp) {
        specialProp(this, target, p, endValue, tween) && (hasPriority = 1);
      } else if (p.substr(0, 2) === "--") {
        //CSS variable
        startValue = (getComputedStyle(target).getPropertyValue(p) + "").trim();
        endValue += "";
        startUnit = (0, _gsapCore.getUnit)(startValue);
        endUnit = (0, _gsapCore.getUnit)(endValue);
        endUnit ? startUnit !== endUnit && (startValue = _convertToUnit(target, p, startValue, endUnit) + endUnit) : startUnit && (endValue += startUnit);
        this.add(style, "setProperty", startValue, endValue, index, targets, 0, 0, p);
      } else if (type !== "undefined") {
        if (startAt && p in startAt) {
          // in case someone hard-codes a complex value as the start, like top: "calc(2vh / 2)". Without this, it'd use the computed value (always in px)
          startValue = typeof startAt[p] === "function" ? startAt[p].call(tween, index, target, targets) : startAt[p];
          p in _gsapCore._config.units && !(0, _gsapCore.getUnit)(startValue) && (startValue += _gsapCore._config.units[p]); // for cases when someone passes in a unitless value like {x: 100}; if we try setting translate(100, 0px) it won't work.

          (startValue + "").charAt(1) === "=" && (startValue = _get(target, p)); // can't work with relative values
        } else {
          startValue = _get(target, p);
        }

        startNum = parseFloat(startValue);
        relative = type === "string" && endValue.charAt(1) === "=" ? +(endValue.charAt(0) + "1") : 0;
        relative && (endValue = endValue.substr(2));
        endNum = parseFloat(endValue);

        if (p in _propertyAliases) {
          if (p === "autoAlpha") {
            //special case where we control the visibility along with opacity. We still allow the opacity value to pass through and get tweened.
            if (startNum === 1 && _get(target, "visibility") === "hidden" && endNum) {
              //if visibility is initially set to "hidden", we should interpret that as intent to make opacity 0 (a convenience)
              startNum = 0;
            }

            _addNonTweeningPT(this, style, "visibility", startNum ? "inherit" : "hidden", endNum ? "inherit" : "hidden", !endNum);
          }

          if (p !== "scale" && p !== "transform") {
            p = _propertyAliases[p];
            ~p.indexOf(",") && (p = p.split(",")[0]);
          }
        }

        isTransformRelated = p in _transformProps; //--- TRANSFORM-RELATED ---

        if (isTransformRelated) {
          if (!transformPropTween) {
            cache = target._gsap;
            cache.renderTransform && !vars.parseTransform || _parseTransform(target, vars.parseTransform); // if, for example, gsap.set(... {transform:"translateX(50vw)"}), the _get() call doesn't parse the transform, thus cache.renderTransform won't be set yet so force the parsing of the transform here.

            smooth = vars.smoothOrigin !== false && cache.smooth;
            transformPropTween = this._pt = new _gsapCore.PropTween(this._pt, style, _transformProp, 0, 1, cache.renderTransform, cache, 0, -1); //the first time through, create the rendering PropTween so that it runs LAST (in the linked list, we keep adding to the beginning)

            transformPropTween.dep = 1; //flag it as dependent so that if things get killed/overwritten and this is the only PropTween left, we can safely kill the whole tween.
          }

          if (p === "scale") {
            this._pt = new _gsapCore.PropTween(this._pt, cache, "scaleY", cache.scaleY, relative ? relative * endNum : endNum - cache.scaleY);
            props.push("scaleY", p);
            p += "X";
          } else if (p === "transformOrigin") {
            endValue = _convertKeywordsToPercentages(endValue); //in case something like "left top" or "bottom right" is passed in. Convert to percentages.

            if (cache.svg) {
              _applySVGOrigin(target, endValue, 0, smooth, 0, this);
            } else {
              endUnit = parseFloat(endValue.split(" ")[2]) || 0; //handle the zOrigin separately!

              endUnit !== cache.zOrigin && _addNonTweeningPT(this, cache, "zOrigin", cache.zOrigin, endUnit);

              _addNonTweeningPT(this, style, p, _firstTwoOnly(startValue), _firstTwoOnly(endValue));
            }

            continue;
          } else if (p === "svgOrigin") {
            _applySVGOrigin(target, endValue, 1, smooth, 0, this);

            continue;
          } else if (p in _rotationalProperties) {
            _addRotationalPropTween(this, cache, p, startNum, endValue, relative);

            continue;
          } else if (p === "smoothOrigin") {
            _addNonTweeningPT(this, cache, "smooth", cache.smooth, endValue);

            continue;
          } else if (p === "force3D") {
            cache[p] = endValue;
            continue;
          } else if (p === "transform") {
            _addRawTransformPTs(this, endValue, target);

            continue;
          }
        } else if (!(p in style)) {
          p = _checkPropPrefix(p) || p;
        }

        if (isTransformRelated || (endNum || endNum === 0) && (startNum || startNum === 0) && !_complexExp.test(endValue) && p in style) {
          startUnit = (startValue + "").substr((startNum + "").length);
          endNum || (endNum = 0); // protect against NaN

          endUnit = (0, _gsapCore.getUnit)(endValue) || (p in _gsapCore._config.units ? _gsapCore._config.units[p] : startUnit);
          startUnit !== endUnit && (startNum = _convertToUnit(target, p, startValue, endUnit));
          this._pt = new _gsapCore.PropTween(this._pt, isTransformRelated ? cache : style, p, startNum, relative ? relative * endNum : endNum - startNum, !isTransformRelated && (endUnit === "px" || p === "zIndex") && vars.autoRound !== false ? _renderRoundedCSSProp : _renderCSSProp);
          this._pt.u = endUnit || 0;

          if (startUnit !== endUnit) {
            //when the tween goes all the way back to the beginning, we need to revert it to the OLD/ORIGINAL value (with those units). We record that as a "b" (beginning) property and point to a render method that handles that. (performance optimization)
            this._pt.b = startValue;
            this._pt.r = _renderCSSPropWithBeginning;
          }
        } else if (!(p in style)) {
          if (p in target) {
            //maybe it's not a style - it could be a property added directly to an element in which case we'll try to animate that.
            this.add(target, p, target[p], endValue, index, targets);
          } else {
            (0, _gsapCore._missingPlugin)(p, endValue);
            continue;
          }
        } else {
          _tweenComplexCSSString.call(this, target, p, startValue, endValue);
        }

        props.push(p);
      }
    }

    hasPriority && (0, _gsapCore._sortPropTweensByPriority)(this);
  },
  get: _get,
  aliases: _propertyAliases,
  getSetter: function getSetter(target, property, plugin) {
    //returns a setter function that accepts target, property, value and applies it accordingly. Remember, properties like "x" aren't as simple as target.style.property = value because they've got to be applied to a proxy object and then merged into a transform string in a renderer.
    var p = _propertyAliases[property];
    p && p.indexOf(",") < 0 && (property = p);
    return property in _transformProps && property !== _transformOriginProp && (target._gsap.x || _get(target, "x")) ? plugin && _recentSetterPlugin === plugin ? property === "scale" ? _setterScale : _setterTransform : (_recentSetterPlugin = plugin || {}) && (property === "scale" ? _setterScaleWithRender : _setterTransformWithRender) : target.style && !(0, _gsapCore._isUndefined)(target.style[property]) ? _setterCSSStyle : ~property.indexOf("-") ? _setterCSSProp : (0, _gsapCore._getSetter)(target, property);
  },
  core: {
    _removeProperty: _removeProperty,
    _getMatrix: _getMatrix
  }
};
exports.default = exports.CSSPlugin = CSSPlugin;
_gsapCore.gsap.utils.checkPrefix = _checkPropPrefix;

(function (positionAndScale, rotation, others, aliases) {
  var all = (0, _gsapCore._forEachName)(positionAndScale + "," + rotation + "," + others, function (name) {
    _transformProps[name] = 1;
  });
  (0, _gsapCore._forEachName)(rotation, function (name) {
    _gsapCore._config.units[name] = "deg";
    _rotationalProperties[name] = 1;
  });
  _propertyAliases[all[13]] = positionAndScale + "," + rotation;
  (0, _gsapCore._forEachName)(aliases, function (name) {
    var split = name.split(":");
    _propertyAliases[split[1]] = all[split[0]];
  });
})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");

(0, _gsapCore._forEachName)("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function (name) {
  _gsapCore._config.units[name] = "px";
});

_gsapCore.gsap.registerPlugin(CSSPlugin);
},{"./gsap-core.js":"../node_modules/gsap/gsap-core.js"}],"../node_modules/gsap/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Power0", {
  enumerable: true,
  get: function () {
    return _gsapCore.Power0;
  }
});
Object.defineProperty(exports, "Power1", {
  enumerable: true,
  get: function () {
    return _gsapCore.Power1;
  }
});
Object.defineProperty(exports, "Power2", {
  enumerable: true,
  get: function () {
    return _gsapCore.Power2;
  }
});
Object.defineProperty(exports, "Power3", {
  enumerable: true,
  get: function () {
    return _gsapCore.Power3;
  }
});
Object.defineProperty(exports, "Power4", {
  enumerable: true,
  get: function () {
    return _gsapCore.Power4;
  }
});
Object.defineProperty(exports, "Linear", {
  enumerable: true,
  get: function () {
    return _gsapCore.Linear;
  }
});
Object.defineProperty(exports, "Quad", {
  enumerable: true,
  get: function () {
    return _gsapCore.Quad;
  }
});
Object.defineProperty(exports, "Cubic", {
  enumerable: true,
  get: function () {
    return _gsapCore.Cubic;
  }
});
Object.defineProperty(exports, "Quart", {
  enumerable: true,
  get: function () {
    return _gsapCore.Quart;
  }
});
Object.defineProperty(exports, "Quint", {
  enumerable: true,
  get: function () {
    return _gsapCore.Quint;
  }
});
Object.defineProperty(exports, "Strong", {
  enumerable: true,
  get: function () {
    return _gsapCore.Strong;
  }
});
Object.defineProperty(exports, "Elastic", {
  enumerable: true,
  get: function () {
    return _gsapCore.Elastic;
  }
});
Object.defineProperty(exports, "Back", {
  enumerable: true,
  get: function () {
    return _gsapCore.Back;
  }
});
Object.defineProperty(exports, "SteppedEase", {
  enumerable: true,
  get: function () {
    return _gsapCore.SteppedEase;
  }
});
Object.defineProperty(exports, "Bounce", {
  enumerable: true,
  get: function () {
    return _gsapCore.Bounce;
  }
});
Object.defineProperty(exports, "Sine", {
  enumerable: true,
  get: function () {
    return _gsapCore.Sine;
  }
});
Object.defineProperty(exports, "Expo", {
  enumerable: true,
  get: function () {
    return _gsapCore.Expo;
  }
});
Object.defineProperty(exports, "Circ", {
  enumerable: true,
  get: function () {
    return _gsapCore.Circ;
  }
});
Object.defineProperty(exports, "TweenLite", {
  enumerable: true,
  get: function () {
    return _gsapCore.TweenLite;
  }
});
Object.defineProperty(exports, "TimelineLite", {
  enumerable: true,
  get: function () {
    return _gsapCore.TimelineLite;
  }
});
Object.defineProperty(exports, "TimelineMax", {
  enumerable: true,
  get: function () {
    return _gsapCore.TimelineMax;
  }
});
Object.defineProperty(exports, "CSSPlugin", {
  enumerable: true,
  get: function () {
    return _CSSPlugin.CSSPlugin;
  }
});
exports.TweenMax = exports.default = exports.gsap = void 0;

var _gsapCore = require("./gsap-core.js");

var _CSSPlugin = require("./CSSPlugin.js");

var gsapWithCSS = _gsapCore.gsap.registerPlugin(_CSSPlugin.CSSPlugin) || _gsapCore.gsap,
    // to protect from tree shaking
TweenMaxWithCSS = gsapWithCSS.core.Tween;

exports.TweenMax = TweenMaxWithCSS;
exports.default = exports.gsap = gsapWithCSS;
},{"./gsap-core.js":"../node_modules/gsap/gsap-core.js","./CSSPlugin.js":"../node_modules/gsap/CSSPlugin.js"}],"Toast.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _App = _interopRequireDefault(require("./App"));

var _litHtml = require("lit-html");

var _gsap = require("gsap");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Toast {
  static init() {
    this.showDuration = 2.5; // create container element

    this.containerEl = document.createElement('div');
    this.containerEl.id = 'toasts'; // append to <body>

    document.body.appendChild(this.containerEl);
  }

  static show(content) {
    let type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    if (!content) return; // create element

    const toastEl = document.createElement('div');
    toastEl.className = 'toast-entry';
    if (type != "") toastEl.classList.add('is-error');
    toastEl.innerText = content; // appened to container

    this.containerEl.appendChild(toastEl); // animate using gsap

    const tl = _gsap.gsap.timeline();

    tl.from(toastEl, {
      y: 60,
      opacity: 0,
      duration: 0.3,
      ease: "power3.out"
    });
    tl.to(toastEl, {
      marginTop: -50,
      opacity: 0,
      delay: this.showDuration,
      duration: 0.3,
      onComplete: () => {
        toastEl.remove();
      }
    });
  }

}

exports.default = Toast;
},{"./App":"App.js","lit-html":"../node_modules/lit-html/lit-html.js","gsap":"../node_modules/gsap/index.js"}],"FetchAPI.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _App = _interopRequireDefault(require("./App"));

var _Auth = _interopRequireDefault(require("./Auth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let headers = {};

class FetchAPI {
  // Get all places function using asynchronous fetch API call
  async getPlacesAsync() {
    // headers = {
    //     "Authorization": `Bearer ${localStorage.accessToken}` //,
    //         // "access": JSON.stringify(currentUser.accessLevel)
    // }
    let response = await fetch("".concat(_App.default.apiBase, "/place"), {
      method: 'GET',
      headers: {
        "Authorization": "Bearer ".concat(localStorage.accessToken)
      }
    }); // Handle result of API call - if unsuccessful, throw error with customised message

    if (!response.ok) {
      const message = "Problem getting places ".concat(response.status);
      throw new Error(message);
    } // If successful, convert data to JSON and return it to the calling function


    let data = await response.json(); // console.log(data)

    return data;
  } // Get all devices function using asynchronous fetch API call


  async getItemsAsync() {
    headers = {
      "Authorization": "Bearer ".concat(localStorage.accessToken) //,
      // "access": JSON.stringify(currentUser.accessLevel)

    };
    let response = await fetch("".concat(_App.default.apiBase, "/item"), {
      method: 'GET',
      headers: {
        "Authorization": "Bearer ".concat(localStorage.accessToken)
      }
    }); // Handle result of API call - if unsuccessful, throw error with customised message

    if (!response.ok) {
      const message = "Problem getting items ".concat(response.status);
      throw new Error(message);
    } // If successful, convert data to JSON and return it to the calling function


    let data = await response.json(); // console.log(data)

    return data;
  } // // Get all devices function using asynchronous fetch API call
  // async getDevicesAsync() {
  //     headers = {
  //         "Authorization": `Bearer ${localStorage.accessToken}` //,
  //             // "access": JSON.stringify(currentUser.accessLevel)
  //     }
  //     let response = await fetch(`${App.apiBase}/device`, {
  //             method: 'GET',
  //             headers: { "Authorization": `Bearer ${localStorage.accessToken}` }
  //         })
  //         // Handle result of API call - if unsuccessful, throw error with customised message
  //     if (!response.ok) {
  //         const message = `Problem getting devices ${response.status}`
  //         throw new Error(message)
  //     }
  //     // If successful, convert data to JSON and return it to the calling function
  //     let data = await response.json();
  //     console.log(data)
  //     return data;
  // }
  // // Get all devices function using asynchronous fetch API call
  // async getLocationsAsync() {
  //     headers = {
  //         "Authorization": `Bearer ${localStorage.accessToken}` //,
  //             // "access": JSON.stringify(currentUser.accessLevel)
  //     }
  //     let response = await fetch(`${App.apiBase}/location`, {
  //             method: 'GET',
  //             headers: { "Authorization": `Bearer ${localStorage.accessToken}` }
  //         })
  //         // Handle result of API call - if unsuccessful, throw error with customised message
  //     if (!response.ok) {
  //         const message = `Problem getting devices ${response.status}`
  //         throw new Error(message)
  //     }
  //     // If successful, convert data to JSON and return it to the calling function
  //     let data = await response.json();
  //     console.log(data)
  //     return data;
  // }
  // Get all users function using asynchronous fetch API call


  async getUsersAsync() {
    console.log("Local stoarge user access levels is: ".concat(localStorage.accessLevel));
    headers = {
      "Authorization": "Bearer ".concat(localStorage.accessToken) //,
      // "access": JSON.stringify(currentUser.accessLevel)

    };
    let response = await fetch("".concat(_App.default.apiBase, "/user"), {
      method: 'GET',
      headers: {
        "Authorization": "Bearer ".concat(localStorage.accessToken),
        "access": "".concat(localStorage.accessLevel)
      }
    }); // Handle result of API call - if unsuccessful, throw error with customised message

    if (!response.ok) {
      const message = "Problem getting users ".concat(response.status);
      throw new Error(message);
    } // If successful, convert data to JSON and return it to the calling function


    let data = await response.json(); // console.log(data)

    return data;
  }

}

var _default = new FetchAPI();

exports.default = _default;
},{"./App":"App.js","./Auth":"Auth.js"}],"Auth.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _App = _interopRequireDefault(require("./App"));

var _Router = _interopRequireWildcard(require("./Router"));

var _splash = _interopRequireDefault(require("./views/partials/splash"));

var _litHtml = require("lit-html");

var _Toast = _interopRequireDefault(require("./Toast"));

var _FetchAPI = _interopRequireDefault(require("./FetchAPI"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Auth {
  constructor() {
    this.currentUser = {};
  } // async getCurrentUser() {
  //     return this.currentUser
  // }


  async signUp(userData) {
    let fail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    let pass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    const response = await fetch("".concat(_App.default.apiBase, "/user"), {
      method: 'POST',
      body: userData
    });
    console.log("Auth.js signup method receiving user data as: ".concat(JSON.stringify(userData))); // if response not ok

    if (!response.ok) {
      // console log error
      const err = await response.json();
      if (err) console.log(err); // show error      

      _Toast.default.show("Problem creating user: ".concat(response.status)); // run fail() functon if set


      if (typeof fail == 'function') fail();
    } else if (response.ok) {
      /// sign up success - show toast and redirect to sign in page
      localStorage.accessLevel >= 1 ? _Toast.default.show('Account created') : _Toast.default.show('Account created, please sign in');
      pass(); // redirect to signin

      (0, _Router.gotoRoute)('/');
    } else {// show error      
      // Toast.show(`Problem getting user: ${response.status}`)
    }
  }

  async signIn(userData) {
    let fail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const response = await fetch("".concat(_App.default.apiBase, "/auth/signin"), {
      method: 'POST',
      body: userData
    }); // if response not ok

    if (!response.ok) {
      // console log error
      const err = await response.json();
      if (err) console.log(err); // show error      

      _Toast.default.show("Problem signing in: ".concat(err.message), 'error'); // run fail() functon if set


      if (typeof fail == 'function') fail();
      return;
    } // sign in success


    const data = await response.json();

    _Toast.default.show("Welcome  ".concat(data.user.firstName)); // save access token (jwt) to local storage


    localStorage.setItem('accessToken', data.accessToken); // set current user

    this.currentUser = data.user;
    localStorage.setItem('accessLevel', data.user.accessLevel); // Initialise router and load all relevant entities

    _Router.default.init(); // await FetchAPI.getPlacesAsync()
    // await FetchAPI.getItemsAsync()
    // console.log(`Localstorage user is: ${this.currentUser.accessLevel}`)
    // localStorage.accessLevel == 2 ? await FetchAPI.getUsersAsync() : ""
    // redirect to home


    (0, _Router.gotoRoute)('/');
    window.location.reload();
  }

  async check(success) {
    // show splash screen while loading ...   
    (0, _litHtml.render)(_splash.default, _App.default.rootEl); // check local token is there

    if (!localStorage.accessToken) {
      // no local token!
      _Toast.default.show("Please sign in"); // redirect to sign in page      


      (0, _Router.gotoRoute)('/');
      return;
    } // token must exist - validate token via the backend


    const response = await fetch("".concat(_App.default.apiBase, "/auth/validate"), {
      method: 'GET',
      headers: {
        "Authorization": "Bearer ".concat(localStorage.accessToken)
      }
    }); // if response not ok

    if (!response.ok) {
      // console log error
      const err = await response.json();
      if (err) console.log(err); // delete local token

      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('accessLevel');

      _Toast.default.show("session expired, please sign in"); // redirect to sign in      


      (0, _Router.gotoRoute)('/');
      return;
    } // token is valid!


    const data = await response.json(); // console.log(data)
    // set currentUser obj

    this.currentUser = data.user; // run success

    success();
  }

  signOut() {
    _Toast.default.show("You are signed out"); // delete local token


    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('accessLevel'); // redirect to sign in    

    (0, _Router.gotoRoute)('/');
    window.location.reload(); // unset currentUser

    this.currentUser = null;
  }

}

var _default = new Auth();

exports.default = _default;
},{"./App":"App.js","./Router":"Router.js","./views/partials/splash":"views/partials/splash.js","lit-html":"../node_modules/lit-html/lit-html.js","./Toast":"Toast.js","./FetchAPI":"FetchAPI.js"}],"Utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _gsap = _interopRequireDefault(require("gsap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Utils {
  isMobile() {
    let viewportWidth = window.innerWidth;

    if (viewportWidth <= 768) {
      return true;
    } else {
      return false;
    }
  }

  pageIntroAnim() {
    const pageContent = document.querySelector('.page-content');
    if (!pageContent) return;

    _gsap.default.fromTo(pageContent, {
      opacity: 0,
      y: -12
    }, {
      opacity: 1,
      y: 0,
      ease: 'power2.out',
      duration: 0.3
    });
  }

}

var _default = new Utils();

exports.default = _default;
},{"gsap":"../node_modules/gsap/index.js"}],"../node_modules/chart.js/dist/chunks/helpers.segment.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.$ = merge;
exports.A = _isPointInArea;
exports.C = toPadding;
exports.D = each;
exports.E = getMaximumSize;
exports.F = _getParentNode;
exports.G = readUsedSize;
exports.I = throttled;
exports.L = _factorize;
exports.M = finiteOrDefault;
exports.N = callback;
exports.O = _addGrace;
exports.Q = toDegrees;
exports.R = _measureText;
exports.S = _int16Range;
exports.U = _alignPixel;
exports.V = renderText;
exports.W = toFont;
exports._ = _arrayUnique;
exports.a = resolve;
exports.a0 = _capitalize;
exports.a3 = _attachContext;
exports.a4 = _createResolver;
exports.a5 = _descriptors;
exports.a6 = mergeIf;
exports.a8 = debounce;
exports.a9 = retinaScale;
exports.aA = niceNum;
exports.aB = almostWhole;
exports.aC = almostEquals;
exports.aD = _decimalPlaces;
exports.aE = _longestText;
exports.aF = _filterBetween;
exports.aG = _lookup;
exports.aH = getHoverColor;
exports.aI = clone$1;
exports.aJ = _merger;
exports.aK = _mergerIf;
exports.aL = _deprecated;
exports.aM = toFontString;
exports.aN = splineCurve;
exports.aO = splineCurveMonotone;
exports.aP = getStyle;
exports.aQ = fontString;
exports.aR = toLineHeight;
exports.aX = _angleDiff;
exports.aa = clearCanvas;
exports.ac = _elementsEqual;
exports.ad = getAngleFromPoint;
exports.ae = _readValueToProps;
exports.af = _updateBezierControlPoints;
exports.ag = _computeSegments;
exports.ah = _boundSegments;
exports.ai = _steppedInterpolation;
exports.aj = _bezierInterpolation;
exports.ak = _pointInLine;
exports.al = _steppedLineTo;
exports.am = _bezierCurveTo;
exports.an = drawPoint;
exports.ao = addRoundedRectPath;
exports.ap = toTRBL;
exports.aq = toTRBLCorners;
exports.ar = _boundSegment;
exports.as = _normalizeAngle;
exports.at = getRtlAdapter;
exports.au = overrideTextDirection;
exports.aw = restoreTextDirection;
exports.ax = noop;
exports.ay = distanceBetweenPoints;
exports.az = _setMinAndMaxByKey;
exports.b = isArray;
exports.c = color;
exports.f = resolveObjectKey;
exports.i = isObject;
exports.j = isNullOrUndef;
exports.k = clipArea;
exports.l = listenArrayEvents;
exports.m = unclipArea;
exports.p = formatNumber;
exports.q = _angleBetween;
exports.t = toRadians;
exports.u = unlistenArrayEvents;
exports.v = valueOrDefault;
exports.w = isNumber;
exports.x = _limitValue;
exports.z = getRelativePosition;
exports.y = exports.s = exports.r = exports.o = exports.n = exports.h = exports.g = exports.e = exports.d = exports.av = exports.ab = exports.aW = exports.aV = exports.aU = exports.aT = exports.aS = exports.a7 = exports.a2 = exports.a1 = exports.Z = exports.Y = exports.X = exports.T = exports.P = exports.K = exports.J = exports.H = exports.B = void 0;

/*!
 * Chart.js v3.2.1
 * https://www.chartjs.org
 * (c) 2021 Chart.js Contributors
 * Released under the MIT License
 */
function fontString(pixelSize, fontStyle, fontFamily) {
  return fontStyle + ' ' + pixelSize + 'px ' + fontFamily;
}

const requestAnimFrame = function () {
  if (typeof window === 'undefined') {
    return function (callback) {
      return callback();
    };
  }

  return window.requestAnimationFrame;
}();

exports.r = requestAnimFrame;

function throttled(fn, thisArg, updateFn) {
  const updateArgs = updateFn || (args => Array.prototype.slice.call(args));

  let ticking = false;
  let args = [];
  return function (...rest) {
    args = updateArgs(rest);

    if (!ticking) {
      ticking = true;
      requestAnimFrame.call(window, () => {
        ticking = false;
        fn.apply(thisArg, args);
      });
    }
  };
}

function debounce(fn, delay) {
  let timeout;
  return function () {
    if (delay) {
      clearTimeout(timeout);
      timeout = setTimeout(fn, delay);
    } else {
      fn();
    }

    return delay;
  };
}

const _toLeftRightCenter = align => align === 'start' ? 'left' : align === 'end' ? 'right' : 'center';

exports.X = _toLeftRightCenter;

const _alignStartEnd = (align, start, end) => align === 'start' ? start : align === 'end' ? end : (start + end) / 2;

exports.Y = _alignStartEnd;

const _textX = (align, left, right) => align === 'right' ? right : align === 'center' ? (left + right) / 2 : left;

exports.av = _textX;

function noop() {}

const uid = function () {
  let id = 0;
  return function () {
    return id++;
  };
}();

exports.a7 = uid;

function isNullOrUndef(value) {
  return value === null || typeof value === 'undefined';
}

function isArray(value) {
  if (Array.isArray && Array.isArray(value)) {
    return true;
  }

  const type = Object.prototype.toString.call(value);

  if (type.substr(0, 7) === '[object' && type.substr(-6) === 'Array]') {
    return true;
  }

  return false;
}

function isObject(value) {
  return value !== null && Object.prototype.toString.call(value) === '[object Object]';
}

const isNumberFinite = value => (typeof value === 'number' || value instanceof Number) && isFinite(+value);

exports.g = isNumberFinite;

function finiteOrDefault(value, defaultValue) {
  return isNumberFinite(value) ? value : defaultValue;
}

function valueOrDefault(value, defaultValue) {
  return typeof value === 'undefined' ? defaultValue : value;
}

const toPercentage = (value, dimension) => typeof value === 'string' && value.endsWith('%') ? parseFloat(value) / 100 : value / dimension;

exports.n = toPercentage;

const toDimension = (value, dimension) => typeof value === 'string' && value.endsWith('%') ? parseFloat(value) / 100 * dimension : +value;

exports.o = toDimension;

function callback(fn, args, thisArg) {
  if (fn && typeof fn.call === 'function') {
    return fn.apply(thisArg, args);
  }
}

function each(loopable, fn, thisArg, reverse) {
  let i, len, keys;

  if (isArray(loopable)) {
    len = loopable.length;

    if (reverse) {
      for (i = len - 1; i >= 0; i--) {
        fn.call(thisArg, loopable[i], i);
      }
    } else {
      for (i = 0; i < len; i++) {
        fn.call(thisArg, loopable[i], i);
      }
    }
  } else if (isObject(loopable)) {
    keys = Object.keys(loopable);
    len = keys.length;

    for (i = 0; i < len; i++) {
      fn.call(thisArg, loopable[keys[i]], keys[i]);
    }
  }
}

function _elementsEqual(a0, a1) {
  let i, ilen, v0, v1;

  if (!a0 || !a1 || a0.length !== a1.length) {
    return false;
  }

  for (i = 0, ilen = a0.length; i < ilen; ++i) {
    v0 = a0[i];
    v1 = a1[i];

    if (v0.datasetIndex !== v1.datasetIndex || v0.index !== v1.index) {
      return false;
    }
  }

  return true;
}

function clone$1(source) {
  if (isArray(source)) {
    return source.map(clone$1);
  }

  if (isObject(source)) {
    const target = Object.create(null);
    const keys = Object.keys(source);
    const klen = keys.length;
    let k = 0;

    for (; k < klen; ++k) {
      target[keys[k]] = clone$1(source[keys[k]]);
    }

    return target;
  }

  return source;
}

function isValidKey(key) {
  return ['__proto__', 'prototype', 'constructor'].indexOf(key) === -1;
}

function _merger(key, target, source, options) {
  if (!isValidKey(key)) {
    return;
  }

  const tval = target[key];
  const sval = source[key];

  if (isObject(tval) && isObject(sval)) {
    merge(tval, sval, options);
  } else {
    target[key] = clone$1(sval);
  }
}

function merge(target, source, options) {
  const sources = isArray(source) ? source : [source];
  const ilen = sources.length;

  if (!isObject(target)) {
    return target;
  }

  options = options || {};
  const merger = options.merger || _merger;

  for (let i = 0; i < ilen; ++i) {
    source = sources[i];

    if (!isObject(source)) {
      continue;
    }

    const keys = Object.keys(source);

    for (let k = 0, klen = keys.length; k < klen; ++k) {
      merger(keys[k], target, source, options);
    }
  }

  return target;
}

function mergeIf(target, source) {
  return merge(target, source, {
    merger: _mergerIf
  });
}

function _mergerIf(key, target, source) {
  if (!isValidKey(key)) {
    return;
  }

  const tval = target[key];
  const sval = source[key];

  if (isObject(tval) && isObject(sval)) {
    mergeIf(tval, sval);
  } else if (!Object.prototype.hasOwnProperty.call(target, key)) {
    target[key] = clone$1(sval);
  }
}

function _deprecated(scope, value, previous, current) {
  if (value !== undefined) {
    console.warn(scope + ': "' + previous + '" is deprecated. Please use "' + current + '" instead');
  }
}

const emptyString = '';
const dot = '.';

function indexOfDotOrLength(key, start) {
  const idx = key.indexOf(dot, start);
  return idx === -1 ? key.length : idx;
}

function resolveObjectKey(obj, key) {
  if (key === emptyString) {
    return obj;
  }

  let pos = 0;
  let idx = indexOfDotOrLength(key, pos);

  while (obj && idx > pos) {
    obj = obj[key.substr(pos, idx - pos)];
    pos = idx + 1;
    idx = indexOfDotOrLength(key, pos);
  }

  return obj;
}

function _capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const defined = value => typeof value !== 'undefined';

exports.h = defined;

const isFunction = value => typeof value === 'function';

exports.a2 = isFunction;

const setsEqual = (a, b) => {
  if (a.size !== b.size) {
    return false;
  }

  for (const item of a) {
    if (!b.has(item)) {
      return false;
    }
  }

  return true;
};

exports.ab = setsEqual;
const PI = Math.PI;
exports.P = PI;
const TAU = 2 * PI;
exports.T = TAU;
const PITAU = TAU + PI;
exports.aS = PITAU;
const INFINITY = Number.POSITIVE_INFINITY;
exports.aT = INFINITY;
const RAD_PER_DEG = PI / 180;
exports.aU = RAD_PER_DEG;
const HALF_PI = PI / 2;
exports.H = HALF_PI;
const QUARTER_PI = PI / 4;
exports.aV = QUARTER_PI;
const TWO_THIRDS_PI = PI * 2 / 3;
exports.aW = TWO_THIRDS_PI;
const log10 = Math.log10;
exports.K = log10;
const sign = Math.sign;
exports.s = sign;

function niceNum(range) {
  const niceRange = Math.pow(10, Math.floor(log10(range)));
  const fraction = range / niceRange;
  const niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return niceFraction * niceRange;
}

function _factorize(value) {
  const result = [];
  const sqrt = Math.sqrt(value);
  let i;

  for (i = 1; i < sqrt; i++) {
    if (value % i === 0) {
      result.push(i);
      result.push(value / i);
    }
  }

  if (sqrt === (sqrt | 0)) {
    result.push(sqrt);
  }

  result.sort((a, b) => a - b).pop();
  return result;
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function almostEquals(x, y, epsilon) {
  return Math.abs(x - y) < epsilon;
}

function almostWhole(x, epsilon) {
  const rounded = Math.round(x);
  return rounded - epsilon <= x && rounded + epsilon >= x;
}

function _setMinAndMaxByKey(array, target, property) {
  let i, ilen, value;

  for (i = 0, ilen = array.length; i < ilen; i++) {
    value = array[i][property];

    if (!isNaN(value)) {
      target.min = Math.min(target.min, value);
      target.max = Math.max(target.max, value);
    }
  }
}

function toRadians(degrees) {
  return degrees * (PI / 180);
}

function toDegrees(radians) {
  return radians * (180 / PI);
}

function _decimalPlaces(x) {
  if (!isNumberFinite(x)) {
    return;
  }

  let e = 1;
  let p = 0;

  while (Math.round(x * e) / e !== x) {
    e *= 10;
    p++;
  }

  return p;
}

function getAngleFromPoint(centrePoint, anglePoint) {
  const distanceFromXCenter = anglePoint.x - centrePoint.x;
  const distanceFromYCenter = anglePoint.y - centrePoint.y;
  const radialDistanceFromCenter = Math.sqrt(distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter);
  let angle = Math.atan2(distanceFromYCenter, distanceFromXCenter);

  if (angle < -0.5 * PI) {
    angle += TAU;
  }

  return {
    angle,
    distance: radialDistanceFromCenter
  };
}

function distanceBetweenPoints(pt1, pt2) {
  return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
}

function _angleDiff(a, b) {
  return (a - b + PITAU) % TAU - PI;
}

function _normalizeAngle(a) {
  return (a % TAU + TAU) % TAU;
}

function _angleBetween(angle, start, end) {
  const a = _normalizeAngle(angle);

  const s = _normalizeAngle(start);

  const e = _normalizeAngle(end);

  const angleToStart = _normalizeAngle(s - a);

  const angleToEnd = _normalizeAngle(e - a);

  const startToAngle = _normalizeAngle(a - s);

  const endToAngle = _normalizeAngle(a - e);

  return a === s || a === e || angleToStart > angleToEnd && startToAngle < endToAngle;
}

function _limitValue(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function _int16Range(value) {
  return _limitValue(value, -32768, 32767);
}

const atEdge = t => t === 0 || t === 1;

const elasticIn = (t, s, p) => -(Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * TAU / p));

const elasticOut = (t, s, p) => Math.pow(2, -10 * t) * Math.sin((t - s) * TAU / p) + 1;

const effects = {
  linear: t => t,
  easeInQuad: t => t * t,
  easeOutQuad: t => -t * (t - 2),
  easeInOutQuad: t => (t /= 0.5) < 1 ? 0.5 * t * t : -0.5 * (--t * (t - 2) - 1),
  easeInCubic: t => t * t * t,
  easeOutCubic: t => (t -= 1) * t * t + 1,
  easeInOutCubic: t => (t /= 0.5) < 1 ? 0.5 * t * t * t : 0.5 * ((t -= 2) * t * t + 2),
  easeInQuart: t => t * t * t * t,
  easeOutQuart: t => -((t -= 1) * t * t * t - 1),
  easeInOutQuart: t => (t /= 0.5) < 1 ? 0.5 * t * t * t * t : -0.5 * ((t -= 2) * t * t * t - 2),
  easeInQuint: t => t * t * t * t * t,
  easeOutQuint: t => (t -= 1) * t * t * t * t + 1,
  easeInOutQuint: t => (t /= 0.5) < 1 ? 0.5 * t * t * t * t * t : 0.5 * ((t -= 2) * t * t * t * t + 2),
  easeInSine: t => -Math.cos(t * HALF_PI) + 1,
  easeOutSine: t => Math.sin(t * HALF_PI),
  easeInOutSine: t => -0.5 * (Math.cos(PI * t) - 1),
  easeInExpo: t => t === 0 ? 0 : Math.pow(2, 10 * (t - 1)),
  easeOutExpo: t => t === 1 ? 1 : -Math.pow(2, -10 * t) + 1,
  easeInOutExpo: t => atEdge(t) ? t : t < 0.5 ? 0.5 * Math.pow(2, 10 * (t * 2 - 1)) : 0.5 * (-Math.pow(2, -10 * (t * 2 - 1)) + 2),
  easeInCirc: t => t >= 1 ? t : -(Math.sqrt(1 - t * t) - 1),
  easeOutCirc: t => Math.sqrt(1 - (t -= 1) * t),
  easeInOutCirc: t => (t /= 0.5) < 1 ? -0.5 * (Math.sqrt(1 - t * t) - 1) : 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1),
  easeInElastic: t => atEdge(t) ? t : elasticIn(t, 0.075, 0.3),
  easeOutElastic: t => atEdge(t) ? t : elasticOut(t, 0.075, 0.3),

  easeInOutElastic(t) {
    const s = 0.1125;
    const p = 0.45;
    return atEdge(t) ? t : t < 0.5 ? 0.5 * elasticIn(t * 2, s, p) : 0.5 + 0.5 * elasticOut(t * 2 - 1, s, p);
  },

  easeInBack(t) {
    const s = 1.70158;
    return t * t * ((s + 1) * t - s);
  },

  easeOutBack(t) {
    const s = 1.70158;
    return (t -= 1) * t * ((s + 1) * t + s) + 1;
  },

  easeInOutBack(t) {
    let s = 1.70158;

    if ((t /= 0.5) < 1) {
      return 0.5 * (t * t * (((s *= 1.525) + 1) * t - s));
    }

    return 0.5 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2);
  },

  easeInBounce: t => 1 - effects.easeOutBounce(1 - t),

  easeOutBounce(t) {
    const m = 7.5625;
    const d = 2.75;

    if (t < 1 / d) {
      return m * t * t;
    }

    if (t < 2 / d) {
      return m * (t -= 1.5 / d) * t + 0.75;
    }

    if (t < 2.5 / d) {
      return m * (t -= 2.25 / d) * t + 0.9375;
    }

    return m * (t -= 2.625 / d) * t + 0.984375;
  },

  easeInOutBounce: t => t < 0.5 ? effects.easeInBounce(t * 2) * 0.5 : effects.easeOutBounce(t * 2 - 1) * 0.5 + 0.5
};
/*!
 * @kurkle/color v0.1.9
 * https://github.com/kurkle/color#readme
 * (c) 2020 Jukka Kurkela
 * Released under the MIT License
 */

exports.e = effects;
const map = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  A: 10,
  B: 11,
  C: 12,
  D: 13,
  E: 14,
  F: 15,
  a: 10,
  b: 11,
  c: 12,
  d: 13,
  e: 14,
  f: 15
};
const hex = '0123456789ABCDEF';

const h1 = b => hex[b & 0xF];

const h2 = b => hex[(b & 0xF0) >> 4] + hex[b & 0xF];

const eq = b => (b & 0xF0) >> 4 === (b & 0xF);

function isShort(v) {
  return eq(v.r) && eq(v.g) && eq(v.b) && eq(v.a);
}

function hexParse(str) {
  var len = str.length;
  var ret;

  if (str[0] === '#') {
    if (len === 4 || len === 5) {
      ret = {
        r: 255 & map[str[1]] * 17,
        g: 255 & map[str[2]] * 17,
        b: 255 & map[str[3]] * 17,
        a: len === 5 ? map[str[4]] * 17 : 255
      };
    } else if (len === 7 || len === 9) {
      ret = {
        r: map[str[1]] << 4 | map[str[2]],
        g: map[str[3]] << 4 | map[str[4]],
        b: map[str[5]] << 4 | map[str[6]],
        a: len === 9 ? map[str[7]] << 4 | map[str[8]] : 255
      };
    }
  }

  return ret;
}

function hexString(v) {
  var f = isShort(v) ? h1 : h2;
  return v ? '#' + f(v.r) + f(v.g) + f(v.b) + (v.a < 255 ? f(v.a) : '') : v;
}

function round(v) {
  return v + 0.5 | 0;
}

const lim = (v, l, h) => Math.max(Math.min(v, h), l);

function p2b(v) {
  return lim(round(v * 2.55), 0, 255);
}

function n2b(v) {
  return lim(round(v * 255), 0, 255);
}

function b2n(v) {
  return lim(round(v / 2.55) / 100, 0, 1);
}

function n2p(v) {
  return lim(round(v * 100), 0, 100);
}

const RGB_RE = /^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;

function rgbParse(str) {
  const m = RGB_RE.exec(str);
  let a = 255;
  let r, g, b;

  if (!m) {
    return;
  }

  if (m[7] !== r) {
    const v = +m[7];
    a = 255 & (m[8] ? p2b(v) : v * 255);
  }

  r = +m[1];
  g = +m[3];
  b = +m[5];
  r = 255 & (m[2] ? p2b(r) : r);
  g = 255 & (m[4] ? p2b(g) : g);
  b = 255 & (m[6] ? p2b(b) : b);
  return {
    r: r,
    g: g,
    b: b,
    a: a
  };
}

function rgbString(v) {
  return v && (v.a < 255 ? `rgba(${v.r}, ${v.g}, ${v.b}, ${b2n(v.a)})` : `rgb(${v.r}, ${v.g}, ${v.b})`);
}

const HUE_RE = /^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;

function hsl2rgbn(h, s, l) {
  const a = s * Math.min(l, 1 - l);

  const f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);

  return [f(0), f(8), f(4)];
}

function hsv2rgbn(h, s, v) {
  const f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);

  return [f(5), f(3), f(1)];
}

function hwb2rgbn(h, w, b) {
  const rgb = hsl2rgbn(h, 1, 0.5);
  let i;

  if (w + b > 1) {
    i = 1 / (w + b);
    w *= i;
    b *= i;
  }

  for (i = 0; i < 3; i++) {
    rgb[i] *= 1 - w - b;
    rgb[i] += w;
  }

  return rgb;
}

function rgb2hsl(v) {
  const range = 255;
  const r = v.r / range;
  const g = v.g / range;
  const b = v.b / range;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h, s, d;

  if (max !== min) {
    d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h = h * 60 + 0.5;
  }

  return [h | 0, s || 0, l];
}

function calln(f, a, b, c) {
  return (Array.isArray(a) ? f(a[0], a[1], a[2]) : f(a, b, c)).map(n2b);
}

function hsl2rgb(h, s, l) {
  return calln(hsl2rgbn, h, s, l);
}

function hwb2rgb(h, w, b) {
  return calln(hwb2rgbn, h, w, b);
}

function hsv2rgb(h, s, v) {
  return calln(hsv2rgbn, h, s, v);
}

function hue(h) {
  return (h % 360 + 360) % 360;
}

function hueParse(str) {
  const m = HUE_RE.exec(str);
  let a = 255;
  let v;

  if (!m) {
    return;
  }

  if (m[5] !== v) {
    a = m[6] ? p2b(+m[5]) : n2b(+m[5]);
  }

  const h = hue(+m[2]);
  const p1 = +m[3] / 100;
  const p2 = +m[4] / 100;

  if (m[1] === 'hwb') {
    v = hwb2rgb(h, p1, p2);
  } else if (m[1] === 'hsv') {
    v = hsv2rgb(h, p1, p2);
  } else {
    v = hsl2rgb(h, p1, p2);
  }

  return {
    r: v[0],
    g: v[1],
    b: v[2],
    a: a
  };
}

function rotate(v, deg) {
  var h = rgb2hsl(v);
  h[0] = hue(h[0] + deg);
  h = hsl2rgb(h);
  v.r = h[0];
  v.g = h[1];
  v.b = h[2];
}

function hslString(v) {
  if (!v) {
    return;
  }

  const a = rgb2hsl(v);
  const h = a[0];
  const s = n2p(a[1]);
  const l = n2p(a[2]);
  return v.a < 255 ? `hsla(${h}, ${s}%, ${l}%, ${b2n(v.a)})` : `hsl(${h}, ${s}%, ${l}%)`;
}

const map$1 = {
  x: 'dark',
  Z: 'light',
  Y: 're',
  X: 'blu',
  W: 'gr',
  V: 'medium',
  U: 'slate',
  A: 'ee',
  T: 'ol',
  S: 'or',
  B: 'ra',
  C: 'lateg',
  D: 'ights',
  R: 'in',
  Q: 'turquois',
  E: 'hi',
  P: 'ro',
  O: 'al',
  N: 'le',
  M: 'de',
  L: 'yello',
  F: 'en',
  K: 'ch',
  G: 'arks',
  H: 'ea',
  I: 'ightg',
  J: 'wh'
};
const names = {
  OiceXe: 'f0f8ff',
  antiquewEte: 'faebd7',
  aqua: 'ffff',
  aquamarRe: '7fffd4',
  azuY: 'f0ffff',
  beige: 'f5f5dc',
  bisque: 'ffe4c4',
  black: '0',
  blanKedOmond: 'ffebcd',
  Xe: 'ff',
  XeviTet: '8a2be2',
  bPwn: 'a52a2a',
  burlywood: 'deb887',
  caMtXe: '5f9ea0',
  KartYuse: '7fff00',
  KocTate: 'd2691e',
  cSO: 'ff7f50',
  cSnflowerXe: '6495ed',
  cSnsilk: 'fff8dc',
  crimson: 'dc143c',
  cyan: 'ffff',
  xXe: '8b',
  xcyan: '8b8b',
  xgTMnPd: 'b8860b',
  xWay: 'a9a9a9',
  xgYF: '6400',
  xgYy: 'a9a9a9',
  xkhaki: 'bdb76b',
  xmagFta: '8b008b',
  xTivegYF: '556b2f',
  xSange: 'ff8c00',
  xScEd: '9932cc',
  xYd: '8b0000',
  xsOmon: 'e9967a',
  xsHgYF: '8fbc8f',
  xUXe: '483d8b',
  xUWay: '2f4f4f',
  xUgYy: '2f4f4f',
  xQe: 'ced1',
  xviTet: '9400d3',
  dAppRk: 'ff1493',
  dApskyXe: 'bfff',
  dimWay: '696969',
  dimgYy: '696969',
  dodgerXe: '1e90ff',
  fiYbrick: 'b22222',
  flSOwEte: 'fffaf0',
  foYstWAn: '228b22',
  fuKsia: 'ff00ff',
  gaRsbSo: 'dcdcdc',
  ghostwEte: 'f8f8ff',
  gTd: 'ffd700',
  gTMnPd: 'daa520',
  Way: '808080',
  gYF: '8000',
  gYFLw: 'adff2f',
  gYy: '808080',
  honeyMw: 'f0fff0',
  hotpRk: 'ff69b4',
  RdianYd: 'cd5c5c',
  Rdigo: '4b0082',
  ivSy: 'fffff0',
  khaki: 'f0e68c',
  lavFMr: 'e6e6fa',
  lavFMrXsh: 'fff0f5',
  lawngYF: '7cfc00',
  NmoncEffon: 'fffacd',
  ZXe: 'add8e6',
  ZcSO: 'f08080',
  Zcyan: 'e0ffff',
  ZgTMnPdLw: 'fafad2',
  ZWay: 'd3d3d3',
  ZgYF: '90ee90',
  ZgYy: 'd3d3d3',
  ZpRk: 'ffb6c1',
  ZsOmon: 'ffa07a',
  ZsHgYF: '20b2aa',
  ZskyXe: '87cefa',
  ZUWay: '778899',
  ZUgYy: '778899',
  ZstAlXe: 'b0c4de',
  ZLw: 'ffffe0',
  lime: 'ff00',
  limegYF: '32cd32',
  lRF: 'faf0e6',
  magFta: 'ff00ff',
  maPon: '800000',
  VaquamarRe: '66cdaa',
  VXe: 'cd',
  VScEd: 'ba55d3',
  VpurpN: '9370db',
  VsHgYF: '3cb371',
  VUXe: '7b68ee',
  VsprRggYF: 'fa9a',
  VQe: '48d1cc',
  VviTetYd: 'c71585',
  midnightXe: '191970',
  mRtcYam: 'f5fffa',
  mistyPse: 'ffe4e1',
  moccasR: 'ffe4b5',
  navajowEte: 'ffdead',
  navy: '80',
  Tdlace: 'fdf5e6',
  Tive: '808000',
  TivedBb: '6b8e23',
  Sange: 'ffa500',
  SangeYd: 'ff4500',
  ScEd: 'da70d6',
  pOegTMnPd: 'eee8aa',
  pOegYF: '98fb98',
  pOeQe: 'afeeee',
  pOeviTetYd: 'db7093',
  papayawEp: 'ffefd5',
  pHKpuff: 'ffdab9',
  peru: 'cd853f',
  pRk: 'ffc0cb',
  plum: 'dda0dd',
  powMrXe: 'b0e0e6',
  purpN: '800080',
  YbeccapurpN: '663399',
  Yd: 'ff0000',
  Psybrown: 'bc8f8f',
  PyOXe: '4169e1',
  saddNbPwn: '8b4513',
  sOmon: 'fa8072',
  sandybPwn: 'f4a460',
  sHgYF: '2e8b57',
  sHshell: 'fff5ee',
  siFna: 'a0522d',
  silver: 'c0c0c0',
  skyXe: '87ceeb',
  UXe: '6a5acd',
  UWay: '708090',
  UgYy: '708090',
  snow: 'fffafa',
  sprRggYF: 'ff7f',
  stAlXe: '4682b4',
  tan: 'd2b48c',
  teO: '8080',
  tEstN: 'd8bfd8',
  tomato: 'ff6347',
  Qe: '40e0d0',
  viTet: 'ee82ee',
  JHt: 'f5deb3',
  wEte: 'ffffff',
  wEtesmoke: 'f5f5f5',
  Lw: 'ffff00',
  LwgYF: '9acd32'
};

function unpack() {
  const unpacked = {};
  const keys = Object.keys(names);
  const tkeys = Object.keys(map$1);
  let i, j, k, ok, nk;

  for (i = 0; i < keys.length; i++) {
    ok = nk = keys[i];

    for (j = 0; j < tkeys.length; j++) {
      k = tkeys[j];
      nk = nk.replace(k, map$1[k]);
    }

    k = parseInt(names[ok], 16);
    unpacked[nk] = [k >> 16 & 0xFF, k >> 8 & 0xFF, k & 0xFF];
  }

  return unpacked;
}

let names$1;

function nameParse(str) {
  if (!names$1) {
    names$1 = unpack();
    names$1.transparent = [0, 0, 0, 0];
  }

  const a = names$1[str.toLowerCase()];
  return a && {
    r: a[0],
    g: a[1],
    b: a[2],
    a: a.length === 4 ? a[3] : 255
  };
}

function modHSL(v, i, ratio) {
  if (v) {
    let tmp = rgb2hsl(v);
    tmp[i] = Math.max(0, Math.min(tmp[i] + tmp[i] * ratio, i === 0 ? 360 : 1));
    tmp = hsl2rgb(tmp);
    v.r = tmp[0];
    v.g = tmp[1];
    v.b = tmp[2];
  }
}

function clone(v, proto) {
  return v ? Object.assign(proto || {}, v) : v;
}

function fromObject(input) {
  var v = {
    r: 0,
    g: 0,
    b: 0,
    a: 255
  };

  if (Array.isArray(input)) {
    if (input.length >= 3) {
      v = {
        r: input[0],
        g: input[1],
        b: input[2],
        a: 255
      };

      if (input.length > 3) {
        v.a = n2b(input[3]);
      }
    }
  } else {
    v = clone(input, {
      r: 0,
      g: 0,
      b: 0,
      a: 1
    });
    v.a = n2b(v.a);
  }

  return v;
}

function functionParse(str) {
  if (str.charAt(0) === 'r') {
    return rgbParse(str);
  }

  return hueParse(str);
}

class Color {
  constructor(input) {
    if (input instanceof Color) {
      return input;
    }

    const type = typeof input;
    let v;

    if (type === 'object') {
      v = fromObject(input);
    } else if (type === 'string') {
      v = hexParse(input) || nameParse(input) || functionParse(input);
    }

    this._rgb = v;
    this._valid = !!v;
  }

  get valid() {
    return this._valid;
  }

  get rgb() {
    var v = clone(this._rgb);

    if (v) {
      v.a = b2n(v.a);
    }

    return v;
  }

  set rgb(obj) {
    this._rgb = fromObject(obj);
  }

  rgbString() {
    return this._valid ? rgbString(this._rgb) : this._rgb;
  }

  hexString() {
    return this._valid ? hexString(this._rgb) : this._rgb;
  }

  hslString() {
    return this._valid ? hslString(this._rgb) : this._rgb;
  }

  mix(color, weight) {
    const me = this;

    if (color) {
      const c1 = me.rgb;
      const c2 = color.rgb;
      let w2;
      const p = weight === w2 ? 0.5 : weight;
      const w = 2 * p - 1;
      const a = c1.a - c2.a;
      const w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
      w2 = 1 - w1;
      c1.r = 0xFF & w1 * c1.r + w2 * c2.r + 0.5;
      c1.g = 0xFF & w1 * c1.g + w2 * c2.g + 0.5;
      c1.b = 0xFF & w1 * c1.b + w2 * c2.b + 0.5;
      c1.a = p * c1.a + (1 - p) * c2.a;
      me.rgb = c1;
    }

    return me;
  }

  clone() {
    return new Color(this.rgb);
  }

  alpha(a) {
    this._rgb.a = n2b(a);
    return this;
  }

  clearer(ratio) {
    const rgb = this._rgb;
    rgb.a *= 1 - ratio;
    return this;
  }

  greyscale() {
    const rgb = this._rgb;
    const val = round(rgb.r * 0.3 + rgb.g * 0.59 + rgb.b * 0.11);
    rgb.r = rgb.g = rgb.b = val;
    return this;
  }

  opaquer(ratio) {
    const rgb = this._rgb;
    rgb.a *= 1 + ratio;
    return this;
  }

  negate() {
    const v = this._rgb;
    v.r = 255 - v.r;
    v.g = 255 - v.g;
    v.b = 255 - v.b;
    return this;
  }

  lighten(ratio) {
    modHSL(this._rgb, 2, ratio);
    return this;
  }

  darken(ratio) {
    modHSL(this._rgb, 2, -ratio);
    return this;
  }

  saturate(ratio) {
    modHSL(this._rgb, 1, ratio);
    return this;
  }

  desaturate(ratio) {
    modHSL(this._rgb, 1, -ratio);
    return this;
  }

  rotate(deg) {
    rotate(this._rgb, deg);
    return this;
  }

}

function index_esm(input) {
  return new Color(input);
}

const isPatternOrGradient = value => value instanceof CanvasGradient || value instanceof CanvasPattern;

function color(value) {
  return isPatternOrGradient(value) ? value : index_esm(value);
}

function getHoverColor(value) {
  return isPatternOrGradient(value) ? value : index_esm(value).saturate(0.5).darken(0.1).hexString();
}

const overrides = Object.create(null);
exports.Z = overrides;
const descriptors = Object.create(null);
exports.a1 = descriptors;

function getScope$1(node, key) {
  if (!key) {
    return node;
  }

  const keys = key.split('.');

  for (let i = 0, n = keys.length; i < n; ++i) {
    const k = keys[i];
    node = node[k] || (node[k] = Object.create(null));
  }

  return node;
}

function set(root, scope, values) {
  if (typeof scope === 'string') {
    return merge(getScope$1(root, scope), values);
  }

  return merge(getScope$1(root, ''), scope);
}

class Defaults {
  constructor(_descriptors) {
    this.animation = undefined;
    this.backgroundColor = 'rgba(0,0,0,0.1)';
    this.borderColor = 'rgba(0,0,0,0.1)';
    this.color = '#666';
    this.datasets = {};

    this.devicePixelRatio = context => context.chart.platform.getDevicePixelRatio();

    this.elements = {};
    this.events = ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'];
    this.font = {
      family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
      size: 12,
      style: 'normal',
      lineHeight: 1.2,
      weight: null
    };
    this.hover = {};

    this.hoverBackgroundColor = (ctx, options) => getHoverColor(options.backgroundColor);

    this.hoverBorderColor = (ctx, options) => getHoverColor(options.borderColor);

    this.hoverColor = (ctx, options) => getHoverColor(options.color);

    this.indexAxis = 'x';
    this.interaction = {
      mode: 'nearest',
      intersect: true
    };
    this.maintainAspectRatio = true;
    this.onHover = null;
    this.onClick = null;
    this.parsing = true;
    this.plugins = {};
    this.responsive = true;
    this.scale = undefined;
    this.scales = {};
    this.showLine = true;
    this.describe(_descriptors);
  }

  set(scope, values) {
    return set(this, scope, values);
  }

  get(scope) {
    return getScope$1(this, scope);
  }

  describe(scope, values) {
    return set(descriptors, scope, values);
  }

  override(scope, values) {
    return set(overrides, scope, values);
  }

  route(scope, name, targetScope, targetName) {
    const scopeObject = getScope$1(this, scope);
    const targetScopeObject = getScope$1(this, targetScope);
    const privateName = '_' + name;
    Object.defineProperties(scopeObject, {
      [privateName]: {
        value: scopeObject[name],
        writable: true
      },
      [name]: {
        enumerable: true,

        get() {
          const local = this[privateName];
          const target = targetScopeObject[targetName];

          if (isObject(local)) {
            return Object.assign({}, target, local);
          }

          return valueOrDefault(local, target);
        },

        set(value) {
          this[privateName] = value;
        }

      }
    });
  }

}

var defaults = new Defaults({
  _scriptable: name => !name.startsWith('on'),
  _indexable: name => name !== 'events',
  hover: {
    _fallback: 'interaction'
  },
  interaction: {
    _scriptable: false,
    _indexable: false
  }
});
exports.d = defaults;

function toFontString(font) {
  if (!font || isNullOrUndef(font.size) || isNullOrUndef(font.family)) {
    return null;
  }

  return (font.style ? font.style + ' ' : '') + (font.weight ? font.weight + ' ' : '') + font.size + 'px ' + font.family;
}

function _measureText(ctx, data, gc, longest, string) {
  let textWidth = data[string];

  if (!textWidth) {
    textWidth = data[string] = ctx.measureText(string).width;
    gc.push(string);
  }

  if (textWidth > longest) {
    longest = textWidth;
  }

  return longest;
}

function _longestText(ctx, font, arrayOfThings, cache) {
  cache = cache || {};
  let data = cache.data = cache.data || {};
  let gc = cache.garbageCollect = cache.garbageCollect || [];

  if (cache.font !== font) {
    data = cache.data = {};
    gc = cache.garbageCollect = [];
    cache.font = font;
  }

  ctx.save();
  ctx.font = font;
  let longest = 0;
  const ilen = arrayOfThings.length;
  let i, j, jlen, thing, nestedThing;

  for (i = 0; i < ilen; i++) {
    thing = arrayOfThings[i];

    if (thing !== undefined && thing !== null && isArray(thing) !== true) {
      longest = _measureText(ctx, data, gc, longest, thing);
    } else if (isArray(thing)) {
      for (j = 0, jlen = thing.length; j < jlen; j++) {
        nestedThing = thing[j];

        if (nestedThing !== undefined && nestedThing !== null && !isArray(nestedThing)) {
          longest = _measureText(ctx, data, gc, longest, nestedThing);
        }
      }
    }
  }

  ctx.restore();
  const gcLen = gc.length / 2;

  if (gcLen > arrayOfThings.length) {
    for (i = 0; i < gcLen; i++) {
      delete data[gc[i]];
    }

    gc.splice(0, gcLen);
  }

  return longest;
}

function _alignPixel(chart, pixel, width) {
  const devicePixelRatio = chart.currentDevicePixelRatio;
  const halfWidth = width !== 0 ? Math.max(width / 2, 0.5) : 0;
  return Math.round((pixel - halfWidth) * devicePixelRatio) / devicePixelRatio + halfWidth;
}

function clearCanvas(canvas, ctx) {
  ctx = ctx || canvas.getContext('2d');
  ctx.save();
  ctx.resetTransform();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function drawPoint(ctx, options, x, y) {
  let type, xOffset, yOffset, size, cornerRadius;
  const style = options.pointStyle;
  const rotation = options.rotation;
  const radius = options.radius;
  let rad = (rotation || 0) * RAD_PER_DEG;

  if (style && typeof style === 'object') {
    type = style.toString();

    if (type === '[object HTMLImageElement]' || type === '[object HTMLCanvasElement]') {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rad);
      ctx.drawImage(style, -style.width / 2, -style.height / 2, style.width, style.height);
      ctx.restore();
      return;
    }
  }

  if (isNaN(radius) || radius <= 0) {
    return;
  }

  ctx.beginPath();

  switch (style) {
    default:
      ctx.arc(x, y, radius, 0, TAU);
      ctx.closePath();
      break;

    case 'triangle':
      ctx.moveTo(x + Math.sin(rad) * radius, y - Math.cos(rad) * radius);
      rad += TWO_THIRDS_PI;
      ctx.lineTo(x + Math.sin(rad) * radius, y - Math.cos(rad) * radius);
      rad += TWO_THIRDS_PI;
      ctx.lineTo(x + Math.sin(rad) * radius, y - Math.cos(rad) * radius);
      ctx.closePath();
      break;

    case 'rectRounded':
      cornerRadius = radius * 0.516;
      size = radius - cornerRadius;
      xOffset = Math.cos(rad + QUARTER_PI) * size;
      yOffset = Math.sin(rad + QUARTER_PI) * size;
      ctx.arc(x - xOffset, y - yOffset, cornerRadius, rad - PI, rad - HALF_PI);
      ctx.arc(x + yOffset, y - xOffset, cornerRadius, rad - HALF_PI, rad);
      ctx.arc(x + xOffset, y + yOffset, cornerRadius, rad, rad + HALF_PI);
      ctx.arc(x - yOffset, y + xOffset, cornerRadius, rad + HALF_PI, rad + PI);
      ctx.closePath();
      break;

    case 'rect':
      if (!rotation) {
        size = Math.SQRT1_2 * radius;
        ctx.rect(x - size, y - size, 2 * size, 2 * size);
        break;
      }

      rad += QUARTER_PI;

    case 'rectRot':
      xOffset = Math.cos(rad) * radius;
      yOffset = Math.sin(rad) * radius;
      ctx.moveTo(x - xOffset, y - yOffset);
      ctx.lineTo(x + yOffset, y - xOffset);
      ctx.lineTo(x + xOffset, y + yOffset);
      ctx.lineTo(x - yOffset, y + xOffset);
      ctx.closePath();
      break;

    case 'crossRot':
      rad += QUARTER_PI;

    case 'cross':
      xOffset = Math.cos(rad) * radius;
      yOffset = Math.sin(rad) * radius;
      ctx.moveTo(x - xOffset, y - yOffset);
      ctx.lineTo(x + xOffset, y + yOffset);
      ctx.moveTo(x + yOffset, y - xOffset);
      ctx.lineTo(x - yOffset, y + xOffset);
      break;

    case 'star':
      xOffset = Math.cos(rad) * radius;
      yOffset = Math.sin(rad) * radius;
      ctx.moveTo(x - xOffset, y - yOffset);
      ctx.lineTo(x + xOffset, y + yOffset);
      ctx.moveTo(x + yOffset, y - xOffset);
      ctx.lineTo(x - yOffset, y + xOffset);
      rad += QUARTER_PI;
      xOffset = Math.cos(rad) * radius;
      yOffset = Math.sin(rad) * radius;
      ctx.moveTo(x - xOffset, y - yOffset);
      ctx.lineTo(x + xOffset, y + yOffset);
      ctx.moveTo(x + yOffset, y - xOffset);
      ctx.lineTo(x - yOffset, y + xOffset);
      break;

    case 'line':
      xOffset = Math.cos(rad) * radius;
      yOffset = Math.sin(rad) * radius;
      ctx.moveTo(x - xOffset, y - yOffset);
      ctx.lineTo(x + xOffset, y + yOffset);
      break;

    case 'dash':
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(rad) * radius, y + Math.sin(rad) * radius);
      break;
  }

  ctx.fill();

  if (options.borderWidth > 0) {
    ctx.stroke();
  }
}

function _isPointInArea(point, area, margin) {
  margin = margin || 0.5;
  return point && point.x > area.left - margin && point.x < area.right + margin && point.y > area.top - margin && point.y < area.bottom + margin;
}

function clipArea(ctx, area) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(area.left, area.top, area.right - area.left, area.bottom - area.top);
  ctx.clip();
}

function unclipArea(ctx) {
  ctx.restore();
}

function _steppedLineTo(ctx, previous, target, flip, mode) {
  if (!previous) {
    return ctx.lineTo(target.x, target.y);
  }

  if (mode === 'middle') {
    const midpoint = (previous.x + target.x) / 2.0;
    ctx.lineTo(midpoint, previous.y);
    ctx.lineTo(midpoint, target.y);
  } else if (mode === 'after' !== !!flip) {
    ctx.lineTo(previous.x, target.y);
  } else {
    ctx.lineTo(target.x, previous.y);
  }

  ctx.lineTo(target.x, target.y);
}

function _bezierCurveTo(ctx, previous, target, flip) {
  if (!previous) {
    return ctx.lineTo(target.x, target.y);
  }

  ctx.bezierCurveTo(flip ? previous.cp1x : previous.cp2x, flip ? previous.cp1y : previous.cp2y, flip ? target.cp2x : target.cp1x, flip ? target.cp2y : target.cp1y, target.x, target.y);
}

function renderText(ctx, text, x, y, font, opts = {}) {
  const lines = isArray(text) ? text : [text];
  const stroke = opts.strokeWidth > 0 && opts.strokeColor !== '';
  let i, line;
  ctx.save();

  if (opts.translation) {
    ctx.translate(opts.translation[0], opts.translation[1]);
  }

  if (!isNullOrUndef(opts.rotation)) {
    ctx.rotate(opts.rotation);
  }

  ctx.font = font.string;

  if (opts.color) {
    ctx.fillStyle = opts.color;
  }

  if (opts.textAlign) {
    ctx.textAlign = opts.textAlign;
  }

  if (opts.textBaseline) {
    ctx.textBaseline = opts.textBaseline;
  }

  for (i = 0; i < lines.length; ++i) {
    line = lines[i];

    if (stroke) {
      if (opts.strokeColor) {
        ctx.strokeStyle = opts.strokeColor;
      }

      if (!isNullOrUndef(opts.strokeWidth)) {
        ctx.lineWidth = opts.strokeWidth;
      }

      ctx.strokeText(line, x, y, opts.maxWidth);
    }

    ctx.fillText(line, x, y, opts.maxWidth);

    if (opts.strikethrough || opts.underline) {
      const metrics = ctx.measureText(line);
      const left = x - metrics.actualBoundingBoxLeft;
      const right = x + metrics.actualBoundingBoxRight;
      const top = y - metrics.actualBoundingBoxAscent;
      const bottom = y + metrics.actualBoundingBoxDescent;
      const yDecoration = opts.strikethrough ? (top + bottom) / 2 : bottom;
      ctx.strokeStyle = ctx.fillStyle;
      ctx.beginPath();
      ctx.lineWidth = opts.decorationWidth || 2;
      ctx.moveTo(left, yDecoration);
      ctx.lineTo(right, yDecoration);
      ctx.stroke();
    }

    y += font.lineHeight;
  }

  ctx.restore();
}

function addRoundedRectPath(ctx, rect) {
  const {
    x,
    y,
    w,
    h,
    radius
  } = rect;
  ctx.arc(x + radius.topLeft, y + radius.topLeft, radius.topLeft, -HALF_PI, PI, true);
  ctx.lineTo(x, y + h - radius.bottomLeft);
  ctx.arc(x + radius.bottomLeft, y + h - radius.bottomLeft, radius.bottomLeft, PI, HALF_PI, true);
  ctx.lineTo(x + w - radius.bottomRight, y + h);
  ctx.arc(x + w - radius.bottomRight, y + h - radius.bottomRight, radius.bottomRight, HALF_PI, 0, true);
  ctx.lineTo(x + w, y + radius.topRight);
  ctx.arc(x + w - radius.topRight, y + radius.topRight, radius.topRight, 0, -HALF_PI, true);
  ctx.lineTo(x + radius.topLeft, y);
}

const LINE_HEIGHT = new RegExp(/^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/);
const FONT_STYLE = new RegExp(/^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/);

function toLineHeight(value, size) {
  const matches = ('' + value).match(LINE_HEIGHT);

  if (!matches || matches[1] === 'normal') {
    return size * 1.2;
  }

  value = +matches[2];

  switch (matches[3]) {
    case 'px':
      return value;

    case '%':
      value /= 100;
      break;
  }

  return size * value;
}

const numberOrZero = v => +v || 0;

function _readValueToProps(value, props) {
  const ret = {};
  const objProps = isObject(props);
  const keys = objProps ? Object.keys(props) : props;
  const read = isObject(value) ? objProps ? prop => valueOrDefault(value[prop], value[props[prop]]) : prop => value[prop] : () => value;

  for (const prop of keys) {
    ret[prop] = numberOrZero(read(prop));
  }

  return ret;
}

function toTRBL(value) {
  return _readValueToProps(value, {
    top: 'y',
    right: 'x',
    bottom: 'y',
    left: 'x'
  });
}

function toTRBLCorners(value) {
  return _readValueToProps(value, ['topLeft', 'topRight', 'bottomLeft', 'bottomRight']);
}

function toPadding(value) {
  const obj = toTRBL(value);
  obj.width = obj.left + obj.right;
  obj.height = obj.top + obj.bottom;
  return obj;
}

function toFont(options, fallback) {
  options = options || {};
  fallback = fallback || defaults.font;
  let size = valueOrDefault(options.size, fallback.size);

  if (typeof size === 'string') {
    size = parseInt(size, 10);
  }

  let style = valueOrDefault(options.style, fallback.style);

  if (style && !('' + style).match(FONT_STYLE)) {
    console.warn('Invalid font style specified: "' + style + '"');
    style = '';
  }

  const font = {
    family: valueOrDefault(options.family, fallback.family),
    lineHeight: toLineHeight(valueOrDefault(options.lineHeight, fallback.lineHeight), size),
    size,
    style,
    weight: valueOrDefault(options.weight, fallback.weight),
    string: ''
  };
  font.string = toFontString(font);
  return font;
}

function resolve(inputs, context, index, info) {
  let cacheable = true;
  let i, ilen, value;

  for (i = 0, ilen = inputs.length; i < ilen; ++i) {
    value = inputs[i];

    if (value === undefined) {
      continue;
    }

    if (context !== undefined && typeof value === 'function') {
      value = value(context);
      cacheable = false;
    }

    if (index !== undefined && isArray(value)) {
      value = value[index % value.length];
      cacheable = false;
    }

    if (value !== undefined) {
      if (info && !cacheable) {
        info.cacheable = false;
      }

      return value;
    }
  }
}

function _addGrace(minmax, grace) {
  const {
    min,
    max
  } = minmax;
  return {
    min: min - Math.abs(toDimension(grace, min)),
    max: max + toDimension(grace, max)
  };
}

function _lookup(table, value, cmp) {
  cmp = cmp || (index => table[index] < value);

  let hi = table.length - 1;
  let lo = 0;
  let mid;

  while (hi - lo > 1) {
    mid = lo + hi >> 1;

    if (cmp(mid)) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  return {
    lo,
    hi
  };
}

const _lookupByKey = (table, key, value) => _lookup(table, value, index => table[index][key] < value);

exports.y = _lookupByKey;

const _rlookupByKey = (table, key, value) => _lookup(table, value, index => table[index][key] >= value);

exports.B = _rlookupByKey;

function _filterBetween(values, min, max) {
  let start = 0;
  let end = values.length;

  while (start < end && values[start] < min) {
    start++;
  }

  while (end > start && values[end - 1] > max) {
    end--;
  }

  return start > 0 || end < values.length ? values.slice(start, end) : values;
}

const arrayEvents = ['push', 'pop', 'shift', 'splice', 'unshift'];

function listenArrayEvents(array, listener) {
  if (array._chartjs) {
    array._chartjs.listeners.push(listener);

    return;
  }

  Object.defineProperty(array, '_chartjs', {
    configurable: true,
    enumerable: false,
    value: {
      listeners: [listener]
    }
  });
  arrayEvents.forEach(key => {
    const method = '_onData' + _capitalize(key);

    const base = array[key];
    Object.defineProperty(array, key, {
      configurable: true,
      enumerable: false,

      value(...args) {
        const res = base.apply(this, args);

        array._chartjs.listeners.forEach(object => {
          if (typeof object[method] === 'function') {
            object[method](...args);
          }
        });

        return res;
      }

    });
  });
}

function unlistenArrayEvents(array, listener) {
  const stub = array._chartjs;

  if (!stub) {
    return;
  }

  const listeners = stub.listeners;
  const index = listeners.indexOf(listener);

  if (index !== -1) {
    listeners.splice(index, 1);
  }

  if (listeners.length > 0) {
    return;
  }

  arrayEvents.forEach(key => {
    delete array[key];
  });
  delete array._chartjs;
}

function _arrayUnique(items) {
  const set = new Set();
  let i, ilen;

  for (i = 0, ilen = items.length; i < ilen; ++i) {
    set.add(items[i]);
  }

  if (set.size === ilen) {
    return items;
  }

  const result = [];
  set.forEach(item => {
    result.push(item);
  });
  return result;
}

function _createResolver(scopes, prefixes = [''], rootScopes = scopes, fallback, getTarget = () => scopes[0]) {
  if (!defined(fallback)) {
    fallback = _resolve('_fallback', scopes);
  }

  const cache = {
    [Symbol.toStringTag]: 'Object',
    _cacheable: true,
    _scopes: scopes,
    _rootScopes: rootScopes,
    _fallback: fallback,
    _getTarget: getTarget,
    override: scope => _createResolver([scope, ...scopes], prefixes, rootScopes, fallback)
  };
  return new Proxy(cache, {
    deleteProperty(target, prop) {
      delete target[prop];
      delete target._keys;
      delete scopes[0][prop];
      return true;
    },

    get(target, prop) {
      return _cached(target, prop, () => _resolveWithPrefixes(prop, prefixes, scopes, target));
    },

    getOwnPropertyDescriptor(target, prop) {
      return Reflect.getOwnPropertyDescriptor(target._scopes[0], prop);
    },

    getPrototypeOf() {
      return Reflect.getPrototypeOf(scopes[0]);
    },

    has(target, prop) {
      return getKeysFromAllScopes(target).includes(prop);
    },

    ownKeys(target) {
      return getKeysFromAllScopes(target);
    },

    set(target, prop, value) {
      const storage = target._storage || (target._storage = getTarget());
      storage[prop] = value;
      delete target[prop];
      delete target._keys;
      return true;
    }

  });
}

function _attachContext(proxy, context, subProxy, descriptorDefaults) {
  const cache = {
    _cacheable: false,
    _proxy: proxy,
    _context: context,
    _subProxy: subProxy,
    _stack: new Set(),
    _descriptors: _descriptors(proxy, descriptorDefaults),
    setContext: ctx => _attachContext(proxy, ctx, subProxy, descriptorDefaults),
    override: scope => _attachContext(proxy.override(scope), context, subProxy, descriptorDefaults)
  };
  return new Proxy(cache, {
    deleteProperty(target, prop) {
      delete target[prop];
      delete proxy[prop];
      return true;
    },

    get(target, prop, receiver) {
      return _cached(target, prop, () => _resolveWithContext(target, prop, receiver));
    },

    getOwnPropertyDescriptor(target, prop) {
      return target._descriptors.allKeys ? Reflect.has(proxy, prop) ? {
        enumerable: true,
        configurable: true
      } : undefined : Reflect.getOwnPropertyDescriptor(proxy, prop);
    },

    getPrototypeOf() {
      return Reflect.getPrototypeOf(proxy);
    },

    has(target, prop) {
      return Reflect.has(proxy, prop);
    },

    ownKeys() {
      return Reflect.ownKeys(proxy);
    },

    set(target, prop, value) {
      proxy[prop] = value;
      delete target[prop];
      return true;
    }

  });
}

function _descriptors(proxy, defaults = {
  scriptable: true,
  indexable: true
}) {
  const {
    _scriptable = defaults.scriptable,
    _indexable = defaults.indexable,
    _allKeys = defaults.allKeys
  } = proxy;
  return {
    allKeys: _allKeys,
    scriptable: _scriptable,
    indexable: _indexable,
    isScriptable: isFunction(_scriptable) ? _scriptable : () => _scriptable,
    isIndexable: isFunction(_indexable) ? _indexable : () => _indexable
  };
}

const readKey = (prefix, name) => prefix ? prefix + _capitalize(name) : name;

const needsSubResolver = (prop, value) => isObject(value) && prop !== 'adapters';

function _cached(target, prop, resolve) {
  let value = target[prop];

  if (defined(value)) {
    return value;
  }

  value = resolve();

  if (defined(value)) {
    target[prop] = value;
  }

  return value;
}

function _resolveWithContext(target, prop, receiver) {
  const {
    _proxy,
    _context,
    _subProxy,
    _descriptors: descriptors
  } = target;
  let value = _proxy[prop];

  if (isFunction(value) && descriptors.isScriptable(prop)) {
    value = _resolveScriptable(prop, value, target, receiver);
  }

  if (isArray(value) && value.length) {
    value = _resolveArray(prop, value, target, descriptors.isIndexable);
  }

  if (needsSubResolver(prop, value)) {
    value = _attachContext(value, _context, _subProxy && _subProxy[prop], descriptors);
  }

  return value;
}

function _resolveScriptable(prop, value, target, receiver) {
  const {
    _proxy,
    _context,
    _subProxy,
    _stack
  } = target;

  if (_stack.has(prop)) {
    throw new Error('Recursion detected: ' + [..._stack].join('->') + '->' + prop);
  }

  _stack.add(prop);

  value = value(_context, _subProxy || receiver);

  _stack.delete(prop);

  if (isObject(value)) {
    value = createSubResolver(_proxy._scopes, _proxy, prop, value);
  }

  return value;
}

function _resolveArray(prop, value, target, isIndexable) {
  const {
    _proxy,
    _context,
    _subProxy,
    _descriptors: descriptors
  } = target;

  if (defined(_context.index) && isIndexable(prop)) {
    value = value[_context.index % value.length];
  } else if (isObject(value[0])) {
    const arr = value;

    const scopes = _proxy._scopes.filter(s => s !== arr);

    value = [];

    for (const item of arr) {
      const resolver = createSubResolver(scopes, _proxy, prop, item);
      value.push(_attachContext(resolver, _context, _subProxy && _subProxy[prop], descriptors));
    }
  }

  return value;
}

function resolveFallback(fallback, prop, value) {
  return isFunction(fallback) ? fallback(prop, value) : fallback;
}

const getScope = (key, parent) => key === true ? parent : typeof key === 'string' ? resolveObjectKey(parent, key) : undefined;

function addScopes(set, parentScopes, key, parentFallback) {
  for (const parent of parentScopes) {
    const scope = getScope(key, parent);

    if (scope) {
      set.add(scope);
      const fallback = resolveFallback(scope._fallback, key, scope);

      if (defined(fallback) && fallback !== key && fallback !== parentFallback) {
        return fallback;
      }
    } else if (scope === false && defined(parentFallback) && key !== parentFallback) {
      return null;
    }
  }

  return false;
}

function createSubResolver(parentScopes, resolver, prop, value) {
  const rootScopes = resolver._rootScopes;
  const fallback = resolveFallback(resolver._fallback, prop, value);
  const allScopes = [...parentScopes, ...rootScopes];
  const set = new Set();
  set.add(value);
  let key = addScopesFromKey(set, allScopes, prop, fallback || prop);

  if (key === null) {
    return false;
  }

  if (defined(fallback) && fallback !== prop) {
    key = addScopesFromKey(set, allScopes, fallback, key);

    if (key === null) {
      return false;
    }
  }

  return _createResolver([...set], [''], rootScopes, fallback, () => {
    const parent = resolver._getTarget();

    if (!(prop in parent)) {
      parent[prop] = {};
    }

    return parent[prop];
  });
}

function addScopesFromKey(set, allScopes, key, fallback) {
  while (key) {
    key = addScopes(set, allScopes, key, fallback);
  }

  return key;
}

function _resolveWithPrefixes(prop, prefixes, scopes, proxy) {
  let value;

  for (const prefix of prefixes) {
    value = _resolve(readKey(prefix, prop), scopes);

    if (defined(value)) {
      return needsSubResolver(prop, value) ? createSubResolver(scopes, proxy, prop, value) : value;
    }
  }
}

function _resolve(key, scopes) {
  for (const scope of scopes) {
    if (!scope) {
      continue;
    }

    const value = scope[key];

    if (defined(value)) {
      return value;
    }
  }
}

function getKeysFromAllScopes(target) {
  let keys = target._keys;

  if (!keys) {
    keys = target._keys = resolveKeysFromAllScopes(target._scopes);
  }

  return keys;
}

function resolveKeysFromAllScopes(scopes) {
  const set = new Set();

  for (const scope of scopes) {
    for (const key of Object.keys(scope).filter(k => !k.startsWith('_'))) {
      set.add(key);
    }
  }

  return [...set];
}

const EPSILON = Number.EPSILON || 1e-14;

const getPoint = (points, i) => i < points.length && !points[i].skip && points[i];

function splineCurve(firstPoint, middlePoint, afterPoint, t) {
  const previous = firstPoint.skip ? middlePoint : firstPoint;
  const current = middlePoint;
  const next = afterPoint.skip ? middlePoint : afterPoint;
  const d01 = distanceBetweenPoints(current, previous);
  const d12 = distanceBetweenPoints(next, current);
  let s01 = d01 / (d01 + d12);
  let s12 = d12 / (d01 + d12);
  s01 = isNaN(s01) ? 0 : s01;
  s12 = isNaN(s12) ? 0 : s12;
  const fa = t * s01;
  const fb = t * s12;
  return {
    previous: {
      x: current.x - fa * (next.x - previous.x),
      y: current.y - fa * (next.y - previous.y)
    },
    next: {
      x: current.x + fb * (next.x - previous.x),
      y: current.y + fb * (next.y - previous.y)
    }
  };
}

function monotoneAdjust(points, deltaK, mK) {
  const pointsLen = points.length;
  let alphaK, betaK, tauK, squaredMagnitude, pointCurrent;
  let pointAfter = getPoint(points, 0);

  for (let i = 0; i < pointsLen - 1; ++i) {
    pointCurrent = pointAfter;
    pointAfter = getPoint(points, i + 1);

    if (!pointCurrent || !pointAfter) {
      continue;
    }

    if (almostEquals(deltaK[i], 0, EPSILON)) {
      mK[i] = mK[i + 1] = 0;
      continue;
    }

    alphaK = mK[i] / deltaK[i];
    betaK = mK[i + 1] / deltaK[i];
    squaredMagnitude = Math.pow(alphaK, 2) + Math.pow(betaK, 2);

    if (squaredMagnitude <= 9) {
      continue;
    }

    tauK = 3 / Math.sqrt(squaredMagnitude);
    mK[i] = alphaK * tauK * deltaK[i];
    mK[i + 1] = betaK * tauK * deltaK[i];
  }
}

function monotoneCompute(points, mK) {
  const pointsLen = points.length;
  let deltaX, pointBefore, pointCurrent;
  let pointAfter = getPoint(points, 0);

  for (let i = 0; i < pointsLen; ++i) {
    pointBefore = pointCurrent;
    pointCurrent = pointAfter;
    pointAfter = getPoint(points, i + 1);

    if (!pointCurrent) {
      continue;
    }

    const {
      x,
      y
    } = pointCurrent;

    if (pointBefore) {
      deltaX = (x - pointBefore.x) / 3;
      pointCurrent.cp1x = x - deltaX;
      pointCurrent.cp1y = y - deltaX * mK[i];
    }

    if (pointAfter) {
      deltaX = (pointAfter.x - x) / 3;
      pointCurrent.cp2x = x + deltaX;
      pointCurrent.cp2y = y + deltaX * mK[i];
    }
  }
}

function splineCurveMonotone(points) {
  const pointsLen = points.length;
  const deltaK = Array(pointsLen).fill(0);
  const mK = Array(pointsLen);
  let i, pointBefore, pointCurrent;
  let pointAfter = getPoint(points, 0);

  for (i = 0; i < pointsLen; ++i) {
    pointBefore = pointCurrent;
    pointCurrent = pointAfter;
    pointAfter = getPoint(points, i + 1);

    if (!pointCurrent) {
      continue;
    }

    if (pointAfter) {
      const slopeDeltaX = pointAfter.x - pointCurrent.x;
      deltaK[i] = slopeDeltaX !== 0 ? (pointAfter.y - pointCurrent.y) / slopeDeltaX : 0;
    }

    mK[i] = !pointBefore ? deltaK[i] : !pointAfter ? deltaK[i - 1] : sign(deltaK[i - 1]) !== sign(deltaK[i]) ? 0 : (deltaK[i - 1] + deltaK[i]) / 2;
  }

  monotoneAdjust(points, deltaK, mK);
  monotoneCompute(points, mK);
}

function capControlPoint(pt, min, max) {
  return Math.max(Math.min(pt, max), min);
}

function capBezierPoints(points, area) {
  let i, ilen, point, inArea, inAreaPrev;

  let inAreaNext = _isPointInArea(points[0], area);

  for (i = 0, ilen = points.length; i < ilen; ++i) {
    inAreaPrev = inArea;
    inArea = inAreaNext;
    inAreaNext = i < ilen - 1 && _isPointInArea(points[i + 1], area);

    if (!inArea) {
      continue;
    }

    point = points[i];

    if (inAreaPrev) {
      point.cp1x = capControlPoint(point.cp1x, area.left, area.right);
      point.cp1y = capControlPoint(point.cp1y, area.top, area.bottom);
    }

    if (inAreaNext) {
      point.cp2x = capControlPoint(point.cp2x, area.left, area.right);
      point.cp2y = capControlPoint(point.cp2y, area.top, area.bottom);
    }
  }
}

function _updateBezierControlPoints(points, options, area, loop) {
  let i, ilen, point, controlPoints;

  if (options.spanGaps) {
    points = points.filter(pt => !pt.skip);
  }

  if (options.cubicInterpolationMode === 'monotone') {
    splineCurveMonotone(points);
  } else {
    let prev = loop ? points[points.length - 1] : points[0];

    for (i = 0, ilen = points.length; i < ilen; ++i) {
      point = points[i];
      controlPoints = splineCurve(prev, point, points[Math.min(i + 1, ilen - (loop ? 0 : 1)) % ilen], options.tension);
      point.cp1x = controlPoints.previous.x;
      point.cp1y = controlPoints.previous.y;
      point.cp2x = controlPoints.next.x;
      point.cp2y = controlPoints.next.y;
      prev = point;
    }
  }

  if (options.capBezierPoints) {
    capBezierPoints(points, area);
  }
}

function _getParentNode(domNode) {
  let parent = domNode.parentNode;

  if (parent && parent.toString() === '[object ShadowRoot]') {
    parent = parent.host;
  }

  return parent;
}

function parseMaxStyle(styleValue, node, parentProperty) {
  let valueInPixels;

  if (typeof styleValue === 'string') {
    valueInPixels = parseInt(styleValue, 10);

    if (styleValue.indexOf('%') !== -1) {
      valueInPixels = valueInPixels / 100 * node.parentNode[parentProperty];
    }
  } else {
    valueInPixels = styleValue;
  }

  return valueInPixels;
}

const getComputedStyle = element => window.getComputedStyle(element, null);

function getStyle(el, property) {
  return getComputedStyle(el).getPropertyValue(property);
}

const positions = ['top', 'right', 'bottom', 'left'];

function getPositionedStyle(styles, style, suffix) {
  const result = {};
  suffix = suffix ? '-' + suffix : '';

  for (let i = 0; i < 4; i++) {
    const pos = positions[i];
    result[pos] = parseFloat(styles[style + '-' + pos + suffix]) || 0;
  }

  result.width = result.left + result.right;
  result.height = result.top + result.bottom;
  return result;
}

const useOffsetPos = (x, y, target) => (x > 0 || y > 0) && (!target || !target.shadowRoot);

function getCanvasPosition(evt, canvas) {
  const e = evt.native || evt;
  const touches = e.touches;
  const source = touches && touches.length ? touches[0] : e;
  const {
    offsetX,
    offsetY
  } = source;
  let box = false;
  let x, y;

  if (useOffsetPos(offsetX, offsetY, e.target)) {
    x = offsetX;
    y = offsetY;
  } else {
    const rect = canvas.getBoundingClientRect();
    x = source.clientX - rect.left;
    y = source.clientY - rect.top;
    box = true;
  }

  return {
    x,
    y,
    box
  };
}

function getRelativePosition(evt, chart) {
  const {
    canvas,
    currentDevicePixelRatio
  } = chart;
  const style = getComputedStyle(canvas);
  const borderBox = style.boxSizing === 'border-box';
  const paddings = getPositionedStyle(style, 'padding');
  const borders = getPositionedStyle(style, 'border', 'width');
  const {
    x,
    y,
    box
  } = getCanvasPosition(evt, canvas);
  const xOffset = paddings.left + (box && borders.left);
  const yOffset = paddings.top + (box && borders.top);
  let {
    width,
    height
  } = chart;

  if (borderBox) {
    width -= paddings.width + borders.width;
    height -= paddings.height + borders.height;
  }

  return {
    x: Math.round((x - xOffset) / width * canvas.width / currentDevicePixelRatio),
    y: Math.round((y - yOffset) / height * canvas.height / currentDevicePixelRatio)
  };
}

function getContainerSize(canvas, width, height) {
  let maxWidth, maxHeight;

  if (width === undefined || height === undefined) {
    const container = _getParentNode(canvas);

    if (!container) {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
    } else {
      const rect = container.getBoundingClientRect();
      const containerStyle = getComputedStyle(container);
      const containerBorder = getPositionedStyle(containerStyle, 'border', 'width');
      const containerPadding = getPositionedStyle(containerStyle, 'padding');
      width = rect.width - containerPadding.width - containerBorder.width;
      height = rect.height - containerPadding.height - containerBorder.height;
      maxWidth = parseMaxStyle(containerStyle.maxWidth, container, 'clientWidth');
      maxHeight = parseMaxStyle(containerStyle.maxHeight, container, 'clientHeight');
    }
  }

  return {
    width,
    height,
    maxWidth: maxWidth || INFINITY,
    maxHeight: maxHeight || INFINITY
  };
}

const round1 = v => Math.round(v * 10) / 10;

function getMaximumSize(canvas, bbWidth, bbHeight, aspectRatio) {
  const style = getComputedStyle(canvas);
  const margins = getPositionedStyle(style, 'margin');
  const maxWidth = parseMaxStyle(style.maxWidth, canvas, 'clientWidth') || INFINITY;
  const maxHeight = parseMaxStyle(style.maxHeight, canvas, 'clientHeight') || INFINITY;
  const containerSize = getContainerSize(canvas, bbWidth, bbHeight);
  let {
    width,
    height
  } = containerSize;

  if (style.boxSizing === 'content-box') {
    const borders = getPositionedStyle(style, 'border', 'width');
    const paddings = getPositionedStyle(style, 'padding');
    width -= paddings.width + borders.width;
    height -= paddings.height + borders.height;
  }

  width = Math.max(0, width - margins.width);
  height = Math.max(0, aspectRatio ? Math.floor(width / aspectRatio) : height - margins.height);
  width = round1(Math.min(width, maxWidth, containerSize.maxWidth));
  height = round1(Math.min(height, maxHeight, containerSize.maxHeight));

  if (width && !height) {
    height = round1(width / 2);
  }

  return {
    width,
    height
  };
}

function retinaScale(chart, forceRatio, forceStyle) {
  const pixelRatio = chart.currentDevicePixelRatio = forceRatio || 1;
  const {
    canvas,
    width,
    height
  } = chart;
  canvas.height = height * pixelRatio;
  canvas.width = width * pixelRatio;
  chart.ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  if (canvas.style && (forceStyle || !canvas.style.height && !canvas.style.width)) {
    canvas.style.height = height + 'px';
    canvas.style.width = width + 'px';
  }
}

const supportsEventListenerOptions = function () {
  let passiveSupported = false;

  try {
    const options = {
      get passive() {
        passiveSupported = true;
        return false;
      }

    };
    window.addEventListener('test', null, options);
    window.removeEventListener('test', null, options);
  } catch (e) {}

  return passiveSupported;
}();

exports.J = supportsEventListenerOptions;

function readUsedSize(element, property) {
  const value = getStyle(element, property);
  const matches = value && value.match(/^(\d+)(\.\d+)?px$/);
  return matches ? +matches[1] : undefined;
}

function _pointInLine(p1, p2, t, mode) {
  return {
    x: p1.x + t * (p2.x - p1.x),
    y: p1.y + t * (p2.y - p1.y)
  };
}

function _steppedInterpolation(p1, p2, t, mode) {
  return {
    x: p1.x + t * (p2.x - p1.x),
    y: mode === 'middle' ? t < 0.5 ? p1.y : p2.y : mode === 'after' ? t < 1 ? p1.y : p2.y : t > 0 ? p2.y : p1.y
  };
}

function _bezierInterpolation(p1, p2, t, mode) {
  const cp1 = {
    x: p1.cp2x,
    y: p1.cp2y
  };
  const cp2 = {
    x: p2.cp1x,
    y: p2.cp1y
  };

  const a = _pointInLine(p1, cp1, t);

  const b = _pointInLine(cp1, cp2, t);

  const c = _pointInLine(cp2, p2, t);

  const d = _pointInLine(a, b, t);

  const e = _pointInLine(b, c, t);

  return _pointInLine(d, e, t);
}

const intlCache = new Map();

function getNumberFormat(locale, options) {
  options = options || {};
  const cacheKey = locale + JSON.stringify(options);
  let formatter = intlCache.get(cacheKey);

  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, options);
    intlCache.set(cacheKey, formatter);
  }

  return formatter;
}

function formatNumber(num, locale, options) {
  return getNumberFormat(locale, options).format(num);
}

const getRightToLeftAdapter = function (rectX, width) {
  return {
    x(x) {
      return rectX + rectX + width - x;
    },

    setWidth(w) {
      width = w;
    },

    textAlign(align) {
      if (align === 'center') {
        return align;
      }

      return align === 'right' ? 'left' : 'right';
    },

    xPlus(x, value) {
      return x - value;
    },

    leftForLtr(x, itemWidth) {
      return x - itemWidth;
    }

  };
};

const getLeftToRightAdapter = function () {
  return {
    x(x) {
      return x;
    },

    setWidth(w) {},

    textAlign(align) {
      return align;
    },

    xPlus(x, value) {
      return x + value;
    },

    leftForLtr(x, _itemWidth) {
      return x;
    }

  };
};

function getRtlAdapter(rtl, rectX, width) {
  return rtl ? getRightToLeftAdapter(rectX, width) : getLeftToRightAdapter();
}

function overrideTextDirection(ctx, direction) {
  let style, original;

  if (direction === 'ltr' || direction === 'rtl') {
    style = ctx.canvas.style;
    original = [style.getPropertyValue('direction'), style.getPropertyPriority('direction')];
    style.setProperty('direction', direction, 'important');
    ctx.prevTextDirection = original;
  }
}

function restoreTextDirection(ctx, original) {
  if (original !== undefined) {
    delete ctx.prevTextDirection;
    ctx.canvas.style.setProperty('direction', original[0], original[1]);
  }
}

function propertyFn(property) {
  if (property === 'angle') {
    return {
      between: _angleBetween,
      compare: _angleDiff,
      normalize: _normalizeAngle
    };
  }

  return {
    between: (n, s, e) => n >= Math.min(s, e) && n <= Math.max(e, s),
    compare: (a, b) => a - b,
    normalize: x => x
  };
}

function normalizeSegment({
  start,
  end,
  count,
  loop,
  style
}) {
  return {
    start: start % count,
    end: end % count,
    loop: loop && (end - start + 1) % count === 0,
    style
  };
}

function getSegment(segment, points, bounds) {
  const {
    property,
    start: startBound,
    end: endBound
  } = bounds;
  const {
    between,
    normalize
  } = propertyFn(property);
  const count = points.length;
  let {
    start,
    end,
    loop
  } = segment;
  let i, ilen;

  if (loop) {
    start += count;
    end += count;

    for (i = 0, ilen = count; i < ilen; ++i) {
      if (!between(normalize(points[start % count][property]), startBound, endBound)) {
        break;
      }

      start--;
      end--;
    }

    start %= count;
    end %= count;
  }

  if (end < start) {
    end += count;
  }

  return {
    start,
    end,
    loop,
    style: segment.style
  };
}

function _boundSegment(segment, points, bounds) {
  if (!bounds) {
    return [segment];
  }

  const {
    property,
    start: startBound,
    end: endBound
  } = bounds;
  const count = points.length;
  const {
    compare,
    between,
    normalize
  } = propertyFn(property);
  const {
    start,
    end,
    loop,
    style
  } = getSegment(segment, points, bounds);
  const result = [];
  let inside = false;
  let subStart = null;
  let value, point, prevValue;

  const startIsBefore = () => between(startBound, prevValue, value) && compare(startBound, prevValue) !== 0;

  const endIsBefore = () => compare(endBound, value) === 0 || between(endBound, prevValue, value);

  const shouldStart = () => inside || startIsBefore();

  const shouldStop = () => !inside || endIsBefore();

  for (let i = start, prev = start; i <= end; ++i) {
    point = points[i % count];

    if (point.skip) {
      continue;
    }

    value = normalize(point[property]);
    inside = between(value, startBound, endBound);

    if (subStart === null && shouldStart()) {
      subStart = compare(value, startBound) === 0 ? i : prev;
    }

    if (subStart !== null && shouldStop()) {
      result.push(normalizeSegment({
        start: subStart,
        end: i,
        loop,
        count,
        style
      }));
      subStart = null;
    }

    prev = i;
    prevValue = value;
  }

  if (subStart !== null) {
    result.push(normalizeSegment({
      start: subStart,
      end,
      loop,
      count,
      style
    }));
  }

  return result;
}

function _boundSegments(line, bounds) {
  const result = [];
  const segments = line.segments;

  for (let i = 0; i < segments.length; i++) {
    const sub = _boundSegment(segments[i], line.points, bounds);

    if (sub.length) {
      result.push(...sub);
    }
  }

  return result;
}

function findStartAndEnd(points, count, loop, spanGaps) {
  let start = 0;
  let end = count - 1;

  if (loop && !spanGaps) {
    while (start < count && !points[start].skip) {
      start++;
    }
  }

  while (start < count && points[start].skip) {
    start++;
  }

  start %= count;

  if (loop) {
    end += start;
  }

  while (end > start && points[end % count].skip) {
    end--;
  }

  end %= count;
  return {
    start,
    end
  };
}

function solidSegments(points, start, max, loop) {
  const count = points.length;
  const result = [];
  let last = start;
  let prev = points[start];
  let end;

  for (end = start + 1; end <= max; ++end) {
    const cur = points[end % count];

    if (cur.skip || cur.stop) {
      if (!prev.skip) {
        loop = false;
        result.push({
          start: start % count,
          end: (end - 1) % count,
          loop
        });
        start = last = cur.stop ? end : null;
      }
    } else {
      last = end;

      if (prev.skip) {
        start = end;
      }
    }

    prev = cur;
  }

  if (last !== null) {
    result.push({
      start: start % count,
      end: last % count,
      loop
    });
  }

  return result;
}

function _computeSegments(line, segmentOptions) {
  const points = line.points;
  const spanGaps = line.options.spanGaps;
  const count = points.length;

  if (!count) {
    return [];
  }

  const loop = !!line._loop;
  const {
    start,
    end
  } = findStartAndEnd(points, count, loop, spanGaps);

  if (spanGaps === true) {
    return splitByStyles([{
      start,
      end,
      loop
    }], points, segmentOptions);
  }

  const max = end < start ? end + count : end;
  const completeLoop = !!line._fullLoop && start === 0 && end === count - 1;
  return splitByStyles(solidSegments(points, start, max, completeLoop), points, segmentOptions);
}

function splitByStyles(segments, points, segmentOptions) {
  if (!segmentOptions || !segmentOptions.setContext || !points) {
    return segments;
  }

  return doSplitByStyles(segments, points, segmentOptions);
}

function doSplitByStyles(segments, points, segmentOptions) {
  const count = points.length;
  const result = [];
  let start = segments[0].start;
  let i = start;

  for (const segment of segments) {
    let prevStyle, style;
    let prev = points[start % count];

    for (i = start + 1; i <= segment.end; i++) {
      const pt = points[i % count];
      style = readStyle(segmentOptions.setContext({
        type: 'segment',
        p0: prev,
        p1: pt
      }));

      if (styleChanged(style, prevStyle)) {
        result.push({
          start: start,
          end: i - 1,
          loop: segment.loop,
          style: prevStyle
        });
        prevStyle = style;
        start = i - 1;
      }

      prev = pt;
      prevStyle = style;
    }

    if (start < i - 1) {
      result.push({
        start,
        end: i - 1,
        loop: segment.loop,
        style
      });
      start = i - 1;
    }
  }

  return result;
}

function readStyle(options) {
  return {
    backgroundColor: options.backgroundColor,
    borderCapStyle: options.borderCapStyle,
    borderDash: options.borderDash,
    borderDashOffset: options.borderDashOffset,
    borderJoinStyle: options.borderJoinStyle,
    borderWidth: options.borderWidth,
    borderColor: options.borderColor
  };
}

function styleChanged(style, prevStyle) {
  return prevStyle && JSON.stringify(style) !== JSON.stringify(prevStyle);
}
},{}],"../node_modules/chart.js/dist/chart.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "defaults", {
  enumerable: true,
  get: function () {
    return _helpersSegment.d;
  }
});
exports.scales = exports.registry = exports.registerables = exports.plugins = exports.layouts = exports.elements = exports.controllers = exports.animator = exports._adapters = exports.Tooltip = exports.Title = exports.TimeSeriesScale = exports.TimeScale = exports.Ticks = exports.ScatterController = exports.Scale = exports.RadialLinearScale = exports.RadarController = exports.PolarAreaController = exports.PointElement = exports.PieController = exports.LogarithmicScale = exports.LinearScale = exports.LineElement = exports.LineController = exports.Legend = exports.Interaction = exports.Filler = exports.Element = exports.DoughnutController = exports.DomPlatform = exports.Decimation = exports.DatasetController = exports.Chart = exports.CategoryScale = exports.BubbleController = exports.BasicPlatform = exports.BasePlatform = exports.BarElement = exports.BarController = exports.ArcElement = exports.Animations = exports.Animation = void 0;

var _helpersSegment = require("./chunks/helpers.segment.js");

/*!
 * Chart.js v3.2.1
 * https://www.chartjs.org
 * (c) 2021 Chart.js Contributors
 * Released under the MIT License
 */
class Animator {
  constructor() {
    this._request = null;
    this._charts = new Map();
    this._running = false;
    this._lastDate = undefined;
  }

  _notify(chart, anims, date, type) {
    const callbacks = anims.listeners[type];
    const numSteps = anims.duration;
    callbacks.forEach(fn => fn({
      chart,
      initial: anims.initial,
      numSteps,
      currentStep: Math.min(date - anims.start, numSteps)
    }));
  }

  _refresh() {
    const me = this;

    if (me._request) {
      return;
    }

    me._running = true;
    me._request = _helpersSegment.r.call(window, () => {
      me._update();

      me._request = null;

      if (me._running) {
        me._refresh();
      }
    });
  }

  _update(date = Date.now()) {
    const me = this;
    let remaining = 0;

    me._charts.forEach((anims, chart) => {
      if (!anims.running || !anims.items.length) {
        return;
      }

      const items = anims.items;
      let i = items.length - 1;
      let draw = false;
      let item;

      for (; i >= 0; --i) {
        item = items[i];

        if (item._active) {
          if (item._total > anims.duration) {
            anims.duration = item._total;
          }

          item.tick(date);
          draw = true;
        } else {
          items[i] = items[items.length - 1];
          items.pop();
        }
      }

      if (draw) {
        chart.draw();

        me._notify(chart, anims, date, 'progress');
      }

      if (!items.length) {
        anims.running = false;

        me._notify(chart, anims, date, 'complete');

        anims.initial = false;
      }

      remaining += items.length;
    });

    me._lastDate = date;

    if (remaining === 0) {
      me._running = false;
    }
  }

  _getAnims(chart) {
    const charts = this._charts;
    let anims = charts.get(chart);

    if (!anims) {
      anims = {
        running: false,
        initial: true,
        items: [],
        listeners: {
          complete: [],
          progress: []
        }
      };
      charts.set(chart, anims);
    }

    return anims;
  }

  listen(chart, event, cb) {
    this._getAnims(chart).listeners[event].push(cb);
  }

  add(chart, items) {
    if (!items || !items.length) {
      return;
    }

    this._getAnims(chart).items.push(...items);
  }

  has(chart) {
    return this._getAnims(chart).items.length > 0;
  }

  start(chart) {
    const anims = this._charts.get(chart);

    if (!anims) {
      return;
    }

    anims.running = true;
    anims.start = Date.now();
    anims.duration = anims.items.reduce((acc, cur) => Math.max(acc, cur._duration), 0);

    this._refresh();
  }

  running(chart) {
    if (!this._running) {
      return false;
    }

    const anims = this._charts.get(chart);

    if (!anims || !anims.running || !anims.items.length) {
      return false;
    }

    return true;
  }

  stop(chart) {
    const anims = this._charts.get(chart);

    if (!anims || !anims.items.length) {
      return;
    }

    const items = anims.items;
    let i = items.length - 1;

    for (; i >= 0; --i) {
      items[i].cancel();
    }

    anims.items = [];

    this._notify(chart, anims, Date.now(), 'complete');
  }

  remove(chart) {
    return this._charts.delete(chart);
  }

}

var animator = new Animator();
exports.animator = animator;
const transparent = 'transparent';
const interpolators = {
  boolean(from, to, factor) {
    return factor > 0.5 ? to : from;
  },

  color(from, to, factor) {
    const c0 = (0, _helpersSegment.c)(from || transparent);
    const c1 = c0.valid && (0, _helpersSegment.c)(to || transparent);
    return c1 && c1.valid ? c1.mix(c0, factor).hexString() : to;
  },

  number(from, to, factor) {
    return from + (to - from) * factor;
  }

};

class Animation {
  constructor(cfg, target, prop, to) {
    const currentValue = target[prop];
    to = (0, _helpersSegment.a)([cfg.to, to, currentValue, cfg.from]);
    const from = (0, _helpersSegment.a)([cfg.from, currentValue, to]);
    this._active = true;
    this._fn = cfg.fn || interpolators[cfg.type || typeof from];
    this._easing = _helpersSegment.e[cfg.easing] || _helpersSegment.e.linear;
    this._start = Math.floor(Date.now() + (cfg.delay || 0));
    this._duration = this._total = Math.floor(cfg.duration);
    this._loop = !!cfg.loop;
    this._target = target;
    this._prop = prop;
    this._from = from;
    this._to = to;
    this._promises = undefined;
  }

  active() {
    return this._active;
  }

  update(cfg, to, date) {
    const me = this;

    if (me._active) {
      me._notify(false);

      const currentValue = me._target[me._prop];
      const elapsed = date - me._start;
      const remain = me._duration - elapsed;
      me._start = date;
      me._duration = Math.floor(Math.max(remain, cfg.duration));
      me._total += elapsed;
      me._loop = !!cfg.loop;
      me._to = (0, _helpersSegment.a)([cfg.to, to, currentValue, cfg.from]);
      me._from = (0, _helpersSegment.a)([cfg.from, currentValue, to]);
    }
  }

  cancel() {
    const me = this;

    if (me._active) {
      me.tick(Date.now());
      me._active = false;

      me._notify(false);
    }
  }

  tick(date) {
    const me = this;
    const elapsed = date - me._start;
    const duration = me._duration;
    const prop = me._prop;
    const from = me._from;
    const loop = me._loop;
    const to = me._to;
    let factor;
    me._active = from !== to && (loop || elapsed < duration);

    if (!me._active) {
      me._target[prop] = to;

      me._notify(true);

      return;
    }

    if (elapsed < 0) {
      me._target[prop] = from;
      return;
    }

    factor = elapsed / duration % 2;
    factor = loop && factor > 1 ? 2 - factor : factor;
    factor = me._easing(Math.min(1, Math.max(0, factor)));
    me._target[prop] = me._fn(from, to, factor);
  }

  wait() {
    const promises = this._promises || (this._promises = []);
    return new Promise((res, rej) => {
      promises.push({
        res,
        rej
      });
    });
  }

  _notify(resolved) {
    const method = resolved ? 'res' : 'rej';
    const promises = this._promises || [];

    for (let i = 0; i < promises.length; i++) {
      promises[i][method]();
    }
  }

}

exports.Animation = Animation;
const numbers = ['x', 'y', 'borderWidth', 'radius', 'tension'];
const colors = ['color', 'borderColor', 'backgroundColor'];

_helpersSegment.d.set('animation', {
  delay: undefined,
  duration: 1000,
  easing: 'easeOutQuart',
  fn: undefined,
  from: undefined,
  loop: undefined,
  to: undefined,
  type: undefined
});

const animationOptions = Object.keys(_helpersSegment.d.animation);

_helpersSegment.d.describe('animation', {
  _fallback: false,
  _indexable: false,
  _scriptable: name => name !== 'onProgress' && name !== 'onComplete' && name !== 'fn'
});

_helpersSegment.d.set('animations', {
  colors: {
    type: 'color',
    properties: colors
  },
  numbers: {
    type: 'number',
    properties: numbers
  }
});

_helpersSegment.d.describe('animations', {
  _fallback: 'animation'
});

_helpersSegment.d.set('transitions', {
  active: {
    animation: {
      duration: 400
    }
  },
  resize: {
    animation: {
      duration: 0
    }
  },
  show: {
    animations: {
      colors: {
        from: 'transparent'
      },
      visible: {
        type: 'boolean',
        duration: 0
      }
    }
  },
  hide: {
    animations: {
      colors: {
        to: 'transparent'
      },
      visible: {
        type: 'boolean',
        easing: 'linear',
        fn: v => v | 0
      }
    }
  }
});

class Animations {
  constructor(chart, config) {
    this._chart = chart;
    this._properties = new Map();
    this.configure(config);
  }

  configure(config) {
    if (!(0, _helpersSegment.i)(config)) {
      return;
    }

    const animatedProps = this._properties;
    Object.getOwnPropertyNames(config).forEach(key => {
      const cfg = config[key];

      if (!(0, _helpersSegment.i)(cfg)) {
        return;
      }

      const resolved = {};

      for (const option of animationOptions) {
        resolved[option] = cfg[option];
      }

      ((0, _helpersSegment.b)(cfg.properties) && cfg.properties || [key]).forEach(prop => {
        if (prop === key || !animatedProps.has(prop)) {
          animatedProps.set(prop, resolved);
        }
      });
    });
  }

  _animateOptions(target, values) {
    const newOptions = values.options;
    const options = resolveTargetOptions(target, newOptions);

    if (!options) {
      return [];
    }

    const animations = this._createAnimations(options, newOptions);

    if (newOptions.$shared) {
      awaitAll(target.options.$animations, newOptions).then(() => {
        target.options = newOptions;
      }, () => {});
    }

    return animations;
  }

  _createAnimations(target, values) {
    const animatedProps = this._properties;
    const animations = [];
    const running = target.$animations || (target.$animations = {});
    const props = Object.keys(values);
    const date = Date.now();
    let i;

    for (i = props.length - 1; i >= 0; --i) {
      const prop = props[i];

      if (prop.charAt(0) === '$') {
        continue;
      }

      if (prop === 'options') {
        animations.push(...this._animateOptions(target, values));
        continue;
      }

      const value = values[prop];
      let animation = running[prop];
      const cfg = animatedProps.get(prop);

      if (animation) {
        if (cfg && animation.active()) {
          animation.update(cfg, value, date);
          continue;
        } else {
          animation.cancel();
        }
      }

      if (!cfg || !cfg.duration) {
        target[prop] = value;
        continue;
      }

      running[prop] = animation = new Animation(cfg, target, prop, value);
      animations.push(animation);
    }

    return animations;
  }

  update(target, values) {
    if (this._properties.size === 0) {
      Object.assign(target, values);
      return;
    }

    const animations = this._createAnimations(target, values);

    if (animations.length) {
      animator.add(this._chart, animations);
      return true;
    }
  }

}

exports.Animations = Animations;

function awaitAll(animations, properties) {
  const running = [];
  const keys = Object.keys(properties);

  for (let i = 0; i < keys.length; i++) {
    const anim = animations[keys[i]];

    if (anim && anim.active()) {
      running.push(anim.wait());
    }
  }

  return Promise.all(running);
}

function resolveTargetOptions(target, newOptions) {
  if (!newOptions) {
    return;
  }

  let options = target.options;

  if (!options) {
    target.options = newOptions;
    return;
  }

  if (options.$shared) {
    target.options = options = Object.assign({}, options, {
      $shared: false,
      $animations: {}
    });
  }

  return options;
}

function scaleClip(scale, allowedOverflow) {
  const opts = scale && scale.options || {};
  const reverse = opts.reverse;
  const min = opts.min === undefined ? allowedOverflow : 0;
  const max = opts.max === undefined ? allowedOverflow : 0;
  return {
    start: reverse ? max : min,
    end: reverse ? min : max
  };
}

function defaultClip(xScale, yScale, allowedOverflow) {
  if (allowedOverflow === false) {
    return false;
  }

  const x = scaleClip(xScale, allowedOverflow);
  const y = scaleClip(yScale, allowedOverflow);
  return {
    top: y.end,
    right: x.end,
    bottom: y.start,
    left: x.start
  };
}

function toClip(value) {
  let t, r, b, l;

  if ((0, _helpersSegment.i)(value)) {
    t = value.top;
    r = value.right;
    b = value.bottom;
    l = value.left;
  } else {
    t = r = b = l = value;
  }

  return {
    top: t,
    right: r,
    bottom: b,
    left: l
  };
}

function getSortedDatasetIndices(chart, filterVisible) {
  const keys = [];

  const metasets = chart._getSortedDatasetMetas(filterVisible);

  let i, ilen;

  for (i = 0, ilen = metasets.length; i < ilen; ++i) {
    keys.push(metasets[i].index);
  }

  return keys;
}

function applyStack(stack, value, dsIndex, options) {
  const keys = stack.keys;
  const singleMode = options.mode === 'single';
  let i, ilen, datasetIndex, otherValue;

  if (value === null) {
    return;
  }

  for (i = 0, ilen = keys.length; i < ilen; ++i) {
    datasetIndex = +keys[i];

    if (datasetIndex === dsIndex) {
      if (options.all) {
        continue;
      }

      break;
    }

    otherValue = stack.values[datasetIndex];

    if ((0, _helpersSegment.g)(otherValue) && (singleMode || value === 0 || (0, _helpersSegment.s)(value) === (0, _helpersSegment.s)(otherValue))) {
      value += otherValue;
    }
  }

  return value;
}

function convertObjectDataToArray(data) {
  const keys = Object.keys(data);
  const adata = new Array(keys.length);
  let i, ilen, key;

  for (i = 0, ilen = keys.length; i < ilen; ++i) {
    key = keys[i];
    adata[i] = {
      x: key,
      y: data[key]
    };
  }

  return adata;
}

function isStacked(scale, meta) {
  const stacked = scale && scale.options.stacked;
  return stacked || stacked === undefined && meta.stack !== undefined;
}

function getStackKey(indexScale, valueScale, meta) {
  return `${indexScale.id}.${valueScale.id}.${meta.stack || meta.type}`;
}

function getUserBounds(scale) {
  const {
    min,
    max,
    minDefined,
    maxDefined
  } = scale.getUserBounds();
  return {
    min: minDefined ? min : Number.NEGATIVE_INFINITY,
    max: maxDefined ? max : Number.POSITIVE_INFINITY
  };
}

function getOrCreateStack(stacks, stackKey, indexValue) {
  const subStack = stacks[stackKey] || (stacks[stackKey] = {});
  return subStack[indexValue] || (subStack[indexValue] = {});
}

function getLastIndexInStack(stack, vScale, positive) {
  for (const meta of vScale.getMatchingVisibleMetas('bar').reverse()) {
    const value = stack[meta.index];

    if (positive && value > 0 || !positive && value < 0) {
      return meta.index;
    }
  }

  return null;
}

function updateStacks(controller, parsed) {
  const {
    chart,
    _cachedMeta: meta
  } = controller;
  const stacks = chart._stacks || (chart._stacks = {});
  const {
    iScale,
    vScale,
    index: datasetIndex
  } = meta;
  const iAxis = iScale.axis;
  const vAxis = vScale.axis;
  const key = getStackKey(iScale, vScale, meta);
  const ilen = parsed.length;
  let stack;

  for (let i = 0; i < ilen; ++i) {
    const item = parsed[i];
    const {
      [iAxis]: index,
      [vAxis]: value
    } = item;
    const itemStacks = item._stacks || (item._stacks = {});
    stack = itemStacks[vAxis] = getOrCreateStack(stacks, key, index);
    stack[datasetIndex] = value;
    stack._top = getLastIndexInStack(stack, vScale, true);
    stack._bottom = getLastIndexInStack(stack, vScale, false);
  }
}

function getFirstScaleId(chart, axis) {
  const scales = chart.scales;
  return Object.keys(scales).filter(key => scales[key].axis === axis).shift();
}

function createDatasetContext(parent, index) {
  return Object.assign(Object.create(parent), {
    active: false,
    dataset: undefined,
    datasetIndex: index,
    index,
    mode: 'default',
    type: 'dataset'
  });
}

function createDataContext(parent, index, element) {
  return Object.assign(Object.create(parent), {
    active: false,
    dataIndex: index,
    parsed: undefined,
    raw: undefined,
    element,
    index,
    mode: 'default',
    type: 'data'
  });
}

function clearStacks(meta, items) {
  items = items || meta._parsed;

  for (const parsed of items) {
    const stacks = parsed._stacks;

    if (!stacks || stacks[meta.vScale.id] === undefined || stacks[meta.vScale.id][meta.index] === undefined) {
      return;
    }

    delete stacks[meta.vScale.id][meta.index];
  }
}

const isDirectUpdateMode = mode => mode === 'reset' || mode === 'none';

const cloneIfNotShared = (cached, shared) => shared ? cached : Object.assign({}, cached);

class DatasetController {
  constructor(chart, datasetIndex) {
    this.chart = chart;
    this._ctx = chart.ctx;
    this.index = datasetIndex;
    this._cachedDataOpts = {};
    this._cachedMeta = this.getMeta();
    this._type = this._cachedMeta.type;
    this.options = undefined;
    this._parsing = false;
    this._data = undefined;
    this._objectData = undefined;
    this._sharedOptions = undefined;
    this._drawStart = undefined;
    this._drawCount = undefined;
    this.enableOptionSharing = false;
    this.$context = undefined;
    this.initialize();
  }

  initialize() {
    const me = this;
    const meta = me._cachedMeta;
    me.configure();
    me.linkScales();
    meta._stacked = isStacked(meta.vScale, meta);
    me.addElements();
  }

  updateIndex(datasetIndex) {
    this.index = datasetIndex;
  }

  linkScales() {
    const me = this;
    const chart = me.chart;
    const meta = me._cachedMeta;
    const dataset = me.getDataset();

    const chooseId = (axis, x, y, r) => axis === 'x' ? x : axis === 'r' ? r : y;

    const xid = meta.xAxisID = (0, _helpersSegment.v)(dataset.xAxisID, getFirstScaleId(chart, 'x'));
    const yid = meta.yAxisID = (0, _helpersSegment.v)(dataset.yAxisID, getFirstScaleId(chart, 'y'));
    const rid = meta.rAxisID = (0, _helpersSegment.v)(dataset.rAxisID, getFirstScaleId(chart, 'r'));
    const indexAxis = meta.indexAxis;
    const iid = meta.iAxisID = chooseId(indexAxis, xid, yid, rid);
    const vid = meta.vAxisID = chooseId(indexAxis, yid, xid, rid);
    meta.xScale = me.getScaleForId(xid);
    meta.yScale = me.getScaleForId(yid);
    meta.rScale = me.getScaleForId(rid);
    meta.iScale = me.getScaleForId(iid);
    meta.vScale = me.getScaleForId(vid);
  }

  getDataset() {
    return this.chart.data.datasets[this.index];
  }

  getMeta() {
    return this.chart.getDatasetMeta(this.index);
  }

  getScaleForId(scaleID) {
    return this.chart.scales[scaleID];
  }

  _getOtherScale(scale) {
    const meta = this._cachedMeta;
    return scale === meta.iScale ? meta.vScale : meta.iScale;
  }

  reset() {
    this._update('reset');
  }

  _destroy() {
    const meta = this._cachedMeta;

    if (this._data) {
      (0, _helpersSegment.u)(this._data, this);
    }

    if (meta._stacked) {
      clearStacks(meta);
    }
  }

  _dataCheck() {
    const me = this;
    const dataset = me.getDataset();
    const data = dataset.data || (dataset.data = []);

    if ((0, _helpersSegment.i)(data)) {
      me._data = convertObjectDataToArray(data);
    } else if (me._data !== data) {
      if (me._data) {
        (0, _helpersSegment.u)(me._data, me);
        clearStacks(me._cachedMeta);
      }

      if (data && Object.isExtensible(data)) {
        (0, _helpersSegment.l)(data, me);
      }

      me._data = data;
    }
  }

  addElements() {
    const me = this;
    const meta = me._cachedMeta;

    me._dataCheck();

    if (me.datasetElementType) {
      meta.dataset = new me.datasetElementType();
    }
  }

  buildOrUpdateElements(resetNewElements) {
    const me = this;
    const meta = me._cachedMeta;
    const dataset = me.getDataset();
    let stackChanged = false;

    me._dataCheck();

    meta._stacked = isStacked(meta.vScale, meta);

    if (meta.stack !== dataset.stack) {
      stackChanged = true;
      clearStacks(meta);
      meta.stack = dataset.stack;
    }

    me._resyncElements(resetNewElements);

    if (stackChanged) {
      updateStacks(me, meta._parsed);
    }
  }

  configure() {
    const me = this;
    const config = me.chart.config;
    const scopeKeys = config.datasetScopeKeys(me._type);
    const scopes = config.getOptionScopes(me.getDataset(), scopeKeys, true);
    me.options = config.createResolver(scopes, me.getContext());
    me._parsing = me.options.parsing;
  }

  parse(start, count) {
    const me = this;
    const {
      _cachedMeta: meta,
      _data: data
    } = me;
    const {
      iScale,
      _stacked
    } = meta;
    const iAxis = iScale.axis;
    let sorted = start === 0 && count === data.length ? true : meta._sorted;
    let prev = start > 0 && meta._parsed[start - 1];
    let i, cur, parsed;

    if (me._parsing === false) {
      meta._parsed = data;
      meta._sorted = true;
      parsed = data;
    } else {
      if ((0, _helpersSegment.b)(data[start])) {
        parsed = me.parseArrayData(meta, data, start, count);
      } else if ((0, _helpersSegment.i)(data[start])) {
        parsed = me.parseObjectData(meta, data, start, count);
      } else {
        parsed = me.parsePrimitiveData(meta, data, start, count);
      }

      const isNotInOrderComparedToPrev = () => cur[iAxis] === null || prev && cur[iAxis] < prev[iAxis];

      for (i = 0; i < count; ++i) {
        meta._parsed[i + start] = cur = parsed[i];

        if (sorted) {
          if (isNotInOrderComparedToPrev()) {
            sorted = false;
          }

          prev = cur;
        }
      }

      meta._sorted = sorted;
    }

    if (_stacked) {
      updateStacks(me, parsed);
    }
  }

  parsePrimitiveData(meta, data, start, count) {
    const {
      iScale,
      vScale
    } = meta;
    const iAxis = iScale.axis;
    const vAxis = vScale.axis;
    const labels = iScale.getLabels();
    const singleScale = iScale === vScale;
    const parsed = new Array(count);
    let i, ilen, index;

    for (i = 0, ilen = count; i < ilen; ++i) {
      index = i + start;
      parsed[i] = {
        [iAxis]: singleScale || iScale.parse(labels[index], index),
        [vAxis]: vScale.parse(data[index], index)
      };
    }

    return parsed;
  }

  parseArrayData(meta, data, start, count) {
    const {
      xScale,
      yScale
    } = meta;
    const parsed = new Array(count);
    let i, ilen, index, item;

    for (i = 0, ilen = count; i < ilen; ++i) {
      index = i + start;
      item = data[index];
      parsed[i] = {
        x: xScale.parse(item[0], index),
        y: yScale.parse(item[1], index)
      };
    }

    return parsed;
  }

  parseObjectData(meta, data, start, count) {
    const {
      xScale,
      yScale
    } = meta;
    const {
      xAxisKey = 'x',
      yAxisKey = 'y'
    } = this._parsing;
    const parsed = new Array(count);
    let i, ilen, index, item;

    for (i = 0, ilen = count; i < ilen; ++i) {
      index = i + start;
      item = data[index];
      parsed[i] = {
        x: xScale.parse((0, _helpersSegment.f)(item, xAxisKey), index),
        y: yScale.parse((0, _helpersSegment.f)(item, yAxisKey), index)
      };
    }

    return parsed;
  }

  getParsed(index) {
    return this._cachedMeta._parsed[index];
  }

  getDataElement(index) {
    return this._cachedMeta.data[index];
  }

  applyStack(scale, parsed, mode) {
    const chart = this.chart;
    const meta = this._cachedMeta;
    const value = parsed[scale.axis];
    const stack = {
      keys: getSortedDatasetIndices(chart, true),
      values: parsed._stacks[scale.axis]
    };
    return applyStack(stack, value, meta.index, {
      mode
    });
  }

  updateRangeFromParsed(range, scale, parsed, stack) {
    const parsedValue = parsed[scale.axis];
    let value = parsedValue === null ? NaN : parsedValue;
    const values = stack && parsed._stacks[scale.axis];

    if (stack && values) {
      stack.values = values;
      range.min = Math.min(range.min, value);
      range.max = Math.max(range.max, value);
      value = applyStack(stack, parsedValue, this._cachedMeta.index, {
        all: true
      });
    }

    range.min = Math.min(range.min, value);
    range.max = Math.max(range.max, value);
  }

  getMinMax(scale, canStack) {
    const me = this;
    const meta = me._cachedMeta;
    const _parsed = meta._parsed;
    const sorted = meta._sorted && scale === meta.iScale;
    const ilen = _parsed.length;

    const otherScale = me._getOtherScale(scale);

    const stack = canStack && meta._stacked && {
      keys: getSortedDatasetIndices(me.chart, true),
      values: null
    };
    const range = {
      min: Number.POSITIVE_INFINITY,
      max: Number.NEGATIVE_INFINITY
    };
    const {
      min: otherMin,
      max: otherMax
    } = getUserBounds(otherScale);
    let i, value, parsed, otherValue;

    function _skip() {
      parsed = _parsed[i];
      value = parsed[scale.axis];
      otherValue = parsed[otherScale.axis];
      return !(0, _helpersSegment.g)(value) || otherMin > otherValue || otherMax < otherValue;
    }

    for (i = 0; i < ilen; ++i) {
      if (_skip()) {
        continue;
      }

      me.updateRangeFromParsed(range, scale, parsed, stack);

      if (sorted) {
        break;
      }
    }

    if (sorted) {
      for (i = ilen - 1; i >= 0; --i) {
        if (_skip()) {
          continue;
        }

        me.updateRangeFromParsed(range, scale, parsed, stack);
        break;
      }
    }

    return range;
  }

  getAllParsedValues(scale) {
    const parsed = this._cachedMeta._parsed;
    const values = [];
    let i, ilen, value;

    for (i = 0, ilen = parsed.length; i < ilen; ++i) {
      value = parsed[i][scale.axis];

      if ((0, _helpersSegment.g)(value)) {
        values.push(value);
      }
    }

    return values;
  }

  getMaxOverflow() {
    return false;
  }

  getLabelAndValue(index) {
    const me = this;
    const meta = me._cachedMeta;
    const iScale = meta.iScale;
    const vScale = meta.vScale;
    const parsed = me.getParsed(index);
    return {
      label: iScale ? '' + iScale.getLabelForValue(parsed[iScale.axis]) : '',
      value: vScale ? '' + vScale.getLabelForValue(parsed[vScale.axis]) : ''
    };
  }

  _update(mode) {
    const me = this;
    const meta = me._cachedMeta;
    me.configure();
    me._cachedDataOpts = {};
    me.update(mode || 'default');
    meta._clip = toClip((0, _helpersSegment.v)(me.options.clip, defaultClip(meta.xScale, meta.yScale, me.getMaxOverflow())));
  }

  update(mode) {}

  draw() {
    const me = this;
    const ctx = me._ctx;
    const chart = me.chart;
    const meta = me._cachedMeta;
    const elements = meta.data || [];
    const area = chart.chartArea;
    const active = [];
    const start = me._drawStart || 0;
    const count = me._drawCount || elements.length - start;
    let i;

    if (meta.dataset) {
      meta.dataset.draw(ctx, area, start, count);
    }

    for (i = start; i < start + count; ++i) {
      const element = elements[i];

      if (element.active) {
        active.push(element);
      } else {
        element.draw(ctx, area);
      }
    }

    for (i = 0; i < active.length; ++i) {
      active[i].draw(ctx, area);
    }
  }

  getStyle(index, active) {
    const mode = active ? 'active' : 'default';
    return index === undefined && this._cachedMeta.dataset ? this.resolveDatasetElementOptions(mode) : this.resolveDataElementOptions(index || 0, mode);
  }

  getContext(index, active, mode) {
    const me = this;
    const dataset = me.getDataset();
    let context;

    if (index >= 0 && index < me._cachedMeta.data.length) {
      const element = me._cachedMeta.data[index];
      context = element.$context || (element.$context = createDataContext(me.getContext(), index, element));
      context.parsed = me.getParsed(index);
      context.raw = dataset.data[index];
    } else {
      context = me.$context || (me.$context = createDatasetContext(me.chart.getContext(), me.index));
      context.dataset = dataset;
    }

    context.active = !!active;
    context.mode = mode;
    return context;
  }

  resolveDatasetElementOptions(mode) {
    return this._resolveElementOptions(this.datasetElementType.id, mode);
  }

  resolveDataElementOptions(index, mode) {
    return this._resolveElementOptions(this.dataElementType.id, mode, index);
  }

  _resolveElementOptions(elementType, mode = 'default', index) {
    const me = this;
    const active = mode === 'active';
    const cache = me._cachedDataOpts;
    const cacheKey = elementType + '-' + mode;
    const cached = cache[cacheKey];
    const sharing = me.enableOptionSharing && (0, _helpersSegment.h)(index);

    if (cached) {
      return cloneIfNotShared(cached, sharing);
    }

    const config = me.chart.config;
    const scopeKeys = config.datasetElementScopeKeys(me._type, elementType);
    const prefixes = active ? [`${elementType}Hover`, 'hover', elementType, ''] : [elementType, ''];
    const scopes = config.getOptionScopes(me.getDataset(), scopeKeys);
    const names = Object.keys(_helpersSegment.d.elements[elementType]);

    const context = () => me.getContext(index, active);

    const values = config.resolveNamedOptions(scopes, names, context, prefixes);

    if (values.$shared) {
      values.$shared = sharing;
      cache[cacheKey] = Object.freeze(cloneIfNotShared(values, sharing));
    }

    return values;
  }

  _resolveAnimations(index, transition, active) {
    const me = this;
    const chart = me.chart;
    const cache = me._cachedDataOpts;
    const cacheKey = `animation-${transition}`;
    const cached = cache[cacheKey];

    if (cached) {
      return cached;
    }

    let options;

    if (chart.options.animation !== false) {
      const config = me.chart.config;
      const scopeKeys = config.datasetAnimationScopeKeys(me._type, transition);
      const scopes = config.getOptionScopes(me.getDataset(), scopeKeys);
      options = config.createResolver(scopes, me.getContext(index, active, transition));
    }

    const animations = new Animations(chart, options && options.animations);

    if (options && options._cacheable) {
      cache[cacheKey] = Object.freeze(animations);
    }

    return animations;
  }

  getSharedOptions(options) {
    if (!options.$shared) {
      return;
    }

    return this._sharedOptions || (this._sharedOptions = Object.assign({}, options));
  }

  includeOptions(mode, sharedOptions) {
    return !sharedOptions || isDirectUpdateMode(mode) || this.chart._animationsDisabled;
  }

  updateElement(element, index, properties, mode) {
    if (isDirectUpdateMode(mode)) {
      Object.assign(element, properties);
    } else {
      this._resolveAnimations(index, mode).update(element, properties);
    }
  }

  updateSharedOptions(sharedOptions, mode, newOptions) {
    if (sharedOptions && !isDirectUpdateMode(mode)) {
      this._resolveAnimations(undefined, mode).update(sharedOptions, newOptions);
    }
  }

  _setStyle(element, index, mode, active) {
    element.active = active;
    const options = this.getStyle(index, active);

    this._resolveAnimations(index, mode, active).update(element, {
      options: !active && this.getSharedOptions(options) || options
    });
  }

  removeHoverStyle(element, datasetIndex, index) {
    this._setStyle(element, index, 'active', false);
  }

  setHoverStyle(element, datasetIndex, index) {
    this._setStyle(element, index, 'active', true);
  }

  _removeDatasetHoverStyle() {
    const element = this._cachedMeta.dataset;

    if (element) {
      this._setStyle(element, undefined, 'active', false);
    }
  }

  _setDatasetHoverStyle() {
    const element = this._cachedMeta.dataset;

    if (element) {
      this._setStyle(element, undefined, 'active', true);
    }
  }

  _resyncElements(resetNewElements) {
    const me = this;
    const numMeta = me._cachedMeta.data.length;
    const numData = me._data.length;

    if (numData > numMeta) {
      me._insertElements(numMeta, numData - numMeta, resetNewElements);
    } else if (numData < numMeta) {
      me._removeElements(numData, numMeta - numData);
    }

    const count = Math.min(numData, numMeta);

    if (count) {
      me.parse(0, count);
    }
  }

  _insertElements(start, count, resetNewElements = true) {
    const me = this;
    const meta = me._cachedMeta;
    const data = meta.data;
    const end = start + count;
    let i;

    const move = arr => {
      arr.length += count;

      for (i = arr.length - 1; i >= end; i--) {
        arr[i] = arr[i - count];
      }
    };

    move(data);

    for (i = start; i < end; ++i) {
      data[i] = new me.dataElementType();
    }

    if (me._parsing) {
      move(meta._parsed);
    }

    me.parse(start, count);

    if (resetNewElements) {
      me.updateElements(data, start, count, 'reset');
    }
  }

  updateElements(element, start, count, mode) {}

  _removeElements(start, count) {
    const me = this;
    const meta = me._cachedMeta;

    if (me._parsing) {
      const removed = meta._parsed.splice(start, count);

      if (meta._stacked) {
        clearStacks(meta, removed);
      }
    }

    meta.data.splice(start, count);
  }

  _onDataPush() {
    const count = arguments.length;

    this._insertElements(this.getDataset().data.length - count, count);
  }

  _onDataPop() {
    this._removeElements(this._cachedMeta.data.length - 1, 1);
  }

  _onDataShift() {
    this._removeElements(0, 1);
  }

  _onDataSplice(start, count) {
    this._removeElements(start, count);

    this._insertElements(start, arguments.length - 2);
  }

  _onDataUnshift() {
    this._insertElements(0, arguments.length);
  }

}

exports.DatasetController = DatasetController;
DatasetController.defaults = {};
DatasetController.prototype.datasetElementType = null;
DatasetController.prototype.dataElementType = null;

function getAllScaleValues(scale) {
  if (!scale._cache.$bar) {
    const metas = scale.getMatchingVisibleMetas('bar');
    let values = [];

    for (let i = 0, ilen = metas.length; i < ilen; i++) {
      values = values.concat(metas[i].controller.getAllParsedValues(scale));
    }

    scale._cache.$bar = (0, _helpersSegment._)(values.sort((a, b) => a - b));
  }

  return scale._cache.$bar;
}

function computeMinSampleSize(scale) {
  const values = getAllScaleValues(scale);
  let min = scale._length;
  let i, ilen, curr, prev;

  const updateMinAndPrev = () => {
    if (curr === 32767 || curr === -32768) {
      return;
    }

    if ((0, _helpersSegment.h)(prev)) {
      min = Math.min(min, Math.abs(curr - prev) || min);
    }

    prev = curr;
  };

  for (i = 0, ilen = values.length; i < ilen; ++i) {
    curr = scale.getPixelForValue(values[i]);
    updateMinAndPrev();
  }

  prev = undefined;

  for (i = 0, ilen = scale.ticks.length; i < ilen; ++i) {
    curr = scale.getPixelForTick(i);
    updateMinAndPrev();
  }

  return min;
}

function computeFitCategoryTraits(index, ruler, options, stackCount) {
  const thickness = options.barThickness;
  let size, ratio;

  if ((0, _helpersSegment.j)(thickness)) {
    size = ruler.min * options.categoryPercentage;
    ratio = options.barPercentage;
  } else {
    size = thickness * stackCount;
    ratio = 1;
  }

  return {
    chunk: size / stackCount,
    ratio,
    start: ruler.pixels[index] - size / 2
  };
}

function computeFlexCategoryTraits(index, ruler, options, stackCount) {
  const pixels = ruler.pixels;
  const curr = pixels[index];
  let prev = index > 0 ? pixels[index - 1] : null;
  let next = index < pixels.length - 1 ? pixels[index + 1] : null;
  const percent = options.categoryPercentage;

  if (prev === null) {
    prev = curr - (next === null ? ruler.end - ruler.start : next - curr);
  }

  if (next === null) {
    next = curr + curr - prev;
  }

  const start = curr - (curr - Math.min(prev, next)) / 2 * percent;
  const size = Math.abs(next - prev) / 2 * percent;
  return {
    chunk: size / stackCount,
    ratio: options.barPercentage,
    start
  };
}

function parseFloatBar(entry, item, vScale, i) {
  const startValue = vScale.parse(entry[0], i);
  const endValue = vScale.parse(entry[1], i);
  const min = Math.min(startValue, endValue);
  const max = Math.max(startValue, endValue);
  let barStart = min;
  let barEnd = max;

  if (Math.abs(min) > Math.abs(max)) {
    barStart = max;
    barEnd = min;
  }

  item[vScale.axis] = barEnd;
  item._custom = {
    barStart,
    barEnd,
    start: startValue,
    end: endValue,
    min,
    max
  };
}

function parseValue(entry, item, vScale, i) {
  if ((0, _helpersSegment.b)(entry)) {
    parseFloatBar(entry, item, vScale, i);
  } else {
    item[vScale.axis] = vScale.parse(entry, i);
  }

  return item;
}

function parseArrayOrPrimitive(meta, data, start, count) {
  const iScale = meta.iScale;
  const vScale = meta.vScale;
  const labels = iScale.getLabels();
  const singleScale = iScale === vScale;
  const parsed = [];
  let i, ilen, item, entry;

  for (i = start, ilen = start + count; i < ilen; ++i) {
    entry = data[i];
    item = {};
    item[iScale.axis] = singleScale || iScale.parse(labels[i], i);
    parsed.push(parseValue(entry, item, vScale, i));
  }

  return parsed;
}

function isFloatBar(custom) {
  return custom && custom.barStart !== undefined && custom.barEnd !== undefined;
}

class BarController extends DatasetController {
  parsePrimitiveData(meta, data, start, count) {
    return parseArrayOrPrimitive(meta, data, start, count);
  }

  parseArrayData(meta, data, start, count) {
    return parseArrayOrPrimitive(meta, data, start, count);
  }

  parseObjectData(meta, data, start, count) {
    const {
      iScale,
      vScale
    } = meta;
    const {
      xAxisKey = 'x',
      yAxisKey = 'y'
    } = this._parsing;
    const iAxisKey = iScale.axis === 'x' ? xAxisKey : yAxisKey;
    const vAxisKey = vScale.axis === 'x' ? xAxisKey : yAxisKey;
    const parsed = [];
    let i, ilen, item, obj;

    for (i = start, ilen = start + count; i < ilen; ++i) {
      obj = data[i];
      item = {};
      item[iScale.axis] = iScale.parse((0, _helpersSegment.f)(obj, iAxisKey), i);
      parsed.push(parseValue((0, _helpersSegment.f)(obj, vAxisKey), item, vScale, i));
    }

    return parsed;
  }

  updateRangeFromParsed(range, scale, parsed, stack) {
    super.updateRangeFromParsed(range, scale, parsed, stack);
    const custom = parsed._custom;

    if (custom && scale === this._cachedMeta.vScale) {
      range.min = Math.min(range.min, custom.min);
      range.max = Math.max(range.max, custom.max);
    }
  }

  getLabelAndValue(index) {
    const me = this;
    const meta = me._cachedMeta;
    const {
      iScale,
      vScale
    } = meta;
    const parsed = me.getParsed(index);
    const custom = parsed._custom;
    const value = isFloatBar(custom) ? '[' + custom.start + ', ' + custom.end + ']' : '' + vScale.getLabelForValue(parsed[vScale.axis]);
    return {
      label: '' + iScale.getLabelForValue(parsed[iScale.axis]),
      value
    };
  }

  initialize() {
    const me = this;
    me.enableOptionSharing = true;
    super.initialize();
    const meta = me._cachedMeta;
    meta.stack = me.getDataset().stack;
  }

  update(mode) {
    const me = this;
    const meta = me._cachedMeta;
    me.updateElements(meta.data, 0, meta.data.length, mode);
  }

  updateElements(bars, start, count, mode) {
    const me = this;
    const reset = mode === 'reset';
    const vScale = me._cachedMeta.vScale;
    const base = vScale.getBasePixel();
    const horizontal = vScale.isHorizontal();

    const ruler = me._getRuler();

    const firstOpts = me.resolveDataElementOptions(start, mode);
    const sharedOptions = me.getSharedOptions(firstOpts);
    const includeOptions = me.includeOptions(mode, sharedOptions);
    me.updateSharedOptions(sharedOptions, mode, firstOpts);

    for (let i = start; i < start + count; i++) {
      const parsed = me.getParsed(i);
      const vpixels = reset || (0, _helpersSegment.j)(parsed[vScale.axis]) ? {
        base,
        head: base
      } : me._calculateBarValuePixels(i);

      const ipixels = me._calculateBarIndexPixels(i, ruler);

      const stack = (parsed._stacks || {})[vScale.axis];
      const properties = {
        horizontal,
        base: vpixels.base,
        enableBorderRadius: !stack || isFloatBar(parsed._custom) || me.index === stack._top || me.index === stack._bottom,
        x: horizontal ? vpixels.head : ipixels.center,
        y: horizontal ? ipixels.center : vpixels.head,
        height: horizontal ? ipixels.size : undefined,
        width: horizontal ? undefined : ipixels.size
      };

      if (includeOptions) {
        properties.options = sharedOptions || me.resolveDataElementOptions(i, mode);
      }

      me.updateElement(bars[i], i, properties, mode);
    }
  }

  _getStacks(last, dataIndex) {
    const me = this;
    const meta = me._cachedMeta;
    const iScale = meta.iScale;
    const metasets = iScale.getMatchingVisibleMetas(me._type);
    const stacked = iScale.options.stacked;
    const ilen = metasets.length;
    const stacks = [];
    let i, item;

    for (i = 0; i < ilen; ++i) {
      item = metasets[i];

      if (typeof dataIndex !== 'undefined') {
        const val = item.controller.getParsed(dataIndex)[item.controller._cachedMeta.vScale.axis];

        if ((0, _helpersSegment.j)(val) || isNaN(val)) {
          continue;
        }
      }

      if (stacked === false || stacks.indexOf(item.stack) === -1 || stacked === undefined && item.stack === undefined) {
        stacks.push(item.stack);
      }

      if (item.index === last) {
        break;
      }
    }

    if (!stacks.length) {
      stacks.push(undefined);
    }

    return stacks;
  }

  _getStackCount(index) {
    return this._getStacks(undefined, index).length;
  }

  _getStackIndex(datasetIndex, name, dataIndex) {
    const stacks = this._getStacks(datasetIndex, dataIndex);

    const index = name !== undefined ? stacks.indexOf(name) : -1;
    return index === -1 ? stacks.length - 1 : index;
  }

  _getRuler() {
    const me = this;
    const opts = me.options;
    const meta = me._cachedMeta;
    const iScale = meta.iScale;
    const pixels = [];
    let i, ilen;

    for (i = 0, ilen = meta.data.length; i < ilen; ++i) {
      pixels.push(iScale.getPixelForValue(me.getParsed(i)[iScale.axis], i));
    }

    const barThickness = opts.barThickness;
    const min = barThickness || computeMinSampleSize(iScale);
    return {
      min,
      pixels,
      start: iScale._startPixel,
      end: iScale._endPixel,
      stackCount: me._getStackCount(),
      scale: iScale,
      grouped: opts.grouped,
      ratio: barThickness ? 1 : opts.categoryPercentage * opts.barPercentage
    };
  }

  _calculateBarValuePixels(index) {
    const me = this;
    const {
      vScale,
      _stacked
    } = me._cachedMeta;
    const {
      base: baseValue,
      minBarLength
    } = me.options;
    const parsed = me.getParsed(index);
    const custom = parsed._custom;
    const floating = isFloatBar(custom);
    let value = parsed[vScale.axis];
    let start = 0;
    let length = _stacked ? me.applyStack(vScale, parsed, _stacked) : value;
    let head, size;

    if (length !== value) {
      start = length - value;
      length = value;
    }

    if (floating) {
      value = custom.barStart;
      length = custom.barEnd - custom.barStart;

      if (value !== 0 && (0, _helpersSegment.s)(value) !== (0, _helpersSegment.s)(custom.barEnd)) {
        start = 0;
      }

      start += value;
    }

    const startValue = !(0, _helpersSegment.j)(baseValue) && !floating ? baseValue : start;
    let base = vScale.getPixelForValue(startValue);

    if (this.chart.getDataVisibility(index)) {
      head = vScale.getPixelForValue(start + length);
    } else {
      head = base;
    }

    size = head - base;

    if (minBarLength !== undefined && Math.abs(size) < minBarLength) {
      size = size < 0 ? -minBarLength : minBarLength;

      if (value === 0) {
        base -= size / 2;
      }

      head = base + size;
    }

    const actualBase = baseValue || 0;

    if (base === vScale.getPixelForValue(actualBase)) {
      const halfGrid = vScale.getLineWidthForValue(actualBase) / 2;

      if (size > 0) {
        base += halfGrid;
        size -= halfGrid;
      } else if (size < 0) {
        base -= halfGrid;
        size += halfGrid;
      }
    }

    return {
      size,
      base,
      head,
      center: head + size / 2
    };
  }

  _calculateBarIndexPixels(index, ruler) {
    const me = this;
    const scale = ruler.scale;
    const options = me.options;
    const skipNull = options.skipNull;
    const maxBarThickness = (0, _helpersSegment.v)(options.maxBarThickness, Infinity);
    let center, size;

    if (ruler.grouped) {
      const stackCount = skipNull ? me._getStackCount(index) : ruler.stackCount;
      const range = options.barThickness === 'flex' ? computeFlexCategoryTraits(index, ruler, options, stackCount) : computeFitCategoryTraits(index, ruler, options, stackCount);

      const stackIndex = me._getStackIndex(me.index, me._cachedMeta.stack, skipNull ? index : undefined);

      center = range.start + range.chunk * stackIndex + range.chunk / 2;
      size = Math.min(maxBarThickness, range.chunk * range.ratio);
    } else {
      center = scale.getPixelForValue(me.getParsed(index)[scale.axis], index);
      size = Math.min(maxBarThickness, ruler.min * ruler.ratio);
    }

    return {
      base: center - size / 2,
      head: center + size / 2,
      center,
      size
    };
  }

  draw() {
    const me = this;
    const chart = me.chart;
    const meta = me._cachedMeta;
    const vScale = meta.vScale;
    const rects = meta.data;
    const ilen = rects.length;
    let i = 0;
    (0, _helpersSegment.k)(chart.ctx, chart.chartArea);

    for (; i < ilen; ++i) {
      if (me.getParsed(i)[vScale.axis] !== null) {
        rects[i].draw(me._ctx);
      }
    }

    (0, _helpersSegment.m)(chart.ctx);
  }

}

exports.BarController = BarController;
BarController.id = 'bar';
BarController.defaults = {
  datasetElementType: false,
  dataElementType: 'bar',
  categoryPercentage: 0.8,
  barPercentage: 0.9,
  grouped: true,
  animations: {
    numbers: {
      type: 'number',
      properties: ['x', 'y', 'base', 'width', 'height']
    }
  }
};
BarController.overrides = {
  interaction: {
    mode: 'index'
  },
  scales: {
    _index_: {
      type: 'category',
      offset: true,
      grid: {
        offset: true
      }
    },
    _value_: {
      type: 'linear',
      beginAtZero: true
    }
  }
};

class BubbleController extends DatasetController {
  initialize() {
    this.enableOptionSharing = true;
    super.initialize();
  }

  parseObjectData(meta, data, start, count) {
    const {
      xScale,
      yScale
    } = meta;
    const {
      xAxisKey = 'x',
      yAxisKey = 'y'
    } = this._parsing;
    const parsed = [];
    let i, ilen, item;

    for (i = start, ilen = start + count; i < ilen; ++i) {
      item = data[i];
      parsed.push({
        x: xScale.parse((0, _helpersSegment.f)(item, xAxisKey), i),
        y: yScale.parse((0, _helpersSegment.f)(item, yAxisKey), i),
        _custom: item && item.r && +item.r
      });
    }

    return parsed;
  }

  getMaxOverflow() {
    const {
      data,
      _parsed
    } = this._cachedMeta;
    let max = 0;

    for (let i = data.length - 1; i >= 0; --i) {
      max = Math.max(max, data[i].size() / 2, _parsed[i]._custom);
    }

    return max > 0 && max;
  }

  getLabelAndValue(index) {
    const me = this;
    const meta = me._cachedMeta;
    const {
      xScale,
      yScale
    } = meta;
    const parsed = me.getParsed(index);
    const x = xScale.getLabelForValue(parsed.x);
    const y = yScale.getLabelForValue(parsed.y);
    const r = parsed._custom;
    return {
      label: meta.label,
      value: '(' + x + ', ' + y + (r ? ', ' + r : '') + ')'
    };
  }

  update(mode) {
    const me = this;
    const points = me._cachedMeta.data;
    me.updateElements(points, 0, points.length, mode);
  }

  updateElements(points, start, count, mode) {
    const me = this;
    const reset = mode === 'reset';
    const {
      xScale,
      yScale
    } = me._cachedMeta;
    const firstOpts = me.resolveDataElementOptions(start, mode);
    const sharedOptions = me.getSharedOptions(firstOpts);
    const includeOptions = me.includeOptions(mode, sharedOptions);

    for (let i = start; i < start + count; i++) {
      const point = points[i];
      const parsed = !reset && me.getParsed(i);
      const x = reset ? xScale.getPixelForDecimal(0.5) : xScale.getPixelForValue(parsed.x);
      const y = reset ? yScale.getBasePixel() : yScale.getPixelForValue(parsed.y);
      const properties = {
        x,
        y,
        skip: isNaN(x) || isNaN(y)
      };

      if (includeOptions) {
        properties.options = me.resolveDataElementOptions(i, mode);

        if (reset) {
          properties.options.radius = 0;
        }
      }

      me.updateElement(point, i, properties, mode);
    }

    me.updateSharedOptions(sharedOptions, mode, firstOpts);
  }

  resolveDataElementOptions(index, mode) {
    const parsed = this.getParsed(index);
    let values = super.resolveDataElementOptions(index, mode);

    if (values.$shared) {
      values = Object.assign({}, values, {
        $shared: false
      });
    }

    const radius = values.radius;

    if (mode !== 'active') {
      values.radius = 0;
    }

    values.radius += (0, _helpersSegment.v)(parsed && parsed._custom, radius);
    return values;
  }

}

exports.BubbleController = BubbleController;
BubbleController.id = 'bubble';
BubbleController.defaults = {
  datasetElementType: false,
  dataElementType: 'point',
  animations: {
    numbers: {
      type: 'number',
      properties: ['x', 'y', 'borderWidth', 'radius']
    }
  }
};
BubbleController.overrides = {
  scales: {
    x: {
      type: 'linear'
    },
    y: {
      type: 'linear'
    }
  },
  plugins: {
    tooltip: {
      callbacks: {
        title() {
          return '';
        }

      }
    }
  }
};

function getRatioAndOffset(rotation, circumference, cutout) {
  let ratioX = 1;
  let ratioY = 1;
  let offsetX = 0;
  let offsetY = 0;

  if (circumference < _helpersSegment.T) {
    const startAngle = rotation;
    const endAngle = startAngle + circumference;
    const startX = Math.cos(startAngle);
    const startY = Math.sin(startAngle);
    const endX = Math.cos(endAngle);
    const endY = Math.sin(endAngle);

    const calcMax = (angle, a, b) => (0, _helpersSegment.q)(angle, startAngle, endAngle) ? 1 : Math.max(a, a * cutout, b, b * cutout);

    const calcMin = (angle, a, b) => (0, _helpersSegment.q)(angle, startAngle, endAngle) ? -1 : Math.min(a, a * cutout, b, b * cutout);

    const maxX = calcMax(0, startX, endX);
    const maxY = calcMax(_helpersSegment.H, startY, endY);
    const minX = calcMin(_helpersSegment.P, startX, endX);
    const minY = calcMin(_helpersSegment.P + _helpersSegment.H, startY, endY);
    ratioX = (maxX - minX) / 2;
    ratioY = (maxY - minY) / 2;
    offsetX = -(maxX + minX) / 2;
    offsetY = -(maxY + minY) / 2;
  }

  return {
    ratioX,
    ratioY,
    offsetX,
    offsetY
  };
}

class DoughnutController extends DatasetController {
  constructor(chart, datasetIndex) {
    super(chart, datasetIndex);
    this.enableOptionSharing = true;
    this.innerRadius = undefined;
    this.outerRadius = undefined;
    this.offsetX = undefined;
    this.offsetY = undefined;
  }

  linkScales() {}

  parse(start, count) {
    const data = this.getDataset().data;
    const meta = this._cachedMeta;
    let i, ilen;

    for (i = start, ilen = start + count; i < ilen; ++i) {
      meta._parsed[i] = +data[i];
    }
  }

  _getRotation() {
    return (0, _helpersSegment.t)(this.options.rotation - 90);
  }

  _getCircumference() {
    return (0, _helpersSegment.t)(this.options.circumference);
  }

  _getRotationExtents() {
    let min = _helpersSegment.T;
    let max = -_helpersSegment.T;
    const me = this;

    for (let i = 0; i < me.chart.data.datasets.length; ++i) {
      if (me.chart.isDatasetVisible(i)) {
        const controller = me.chart.getDatasetMeta(i).controller;

        const rotation = controller._getRotation();

        const circumference = controller._getCircumference();

        min = Math.min(min, rotation);
        max = Math.max(max, rotation + circumference);
      }
    }

    return {
      rotation: min,
      circumference: max - min
    };
  }

  update(mode) {
    const me = this;
    const chart = me.chart;
    const {
      chartArea
    } = chart;
    const meta = me._cachedMeta;
    const arcs = meta.data;
    const spacing = me.getMaxBorderWidth() + me.getMaxOffset(arcs);
    const maxSize = Math.max((Math.min(chartArea.width, chartArea.height) - spacing) / 2, 0);
    const cutout = Math.min((0, _helpersSegment.n)(me.options.cutout, maxSize), 1);

    const chartWeight = me._getRingWeight(me.index);

    const {
      circumference,
      rotation
    } = me._getRotationExtents();

    const {
      ratioX,
      ratioY,
      offsetX,
      offsetY
    } = getRatioAndOffset(rotation, circumference, cutout);
    const maxWidth = (chartArea.width - spacing) / ratioX;
    const maxHeight = (chartArea.height - spacing) / ratioY;
    const maxRadius = Math.max(Math.min(maxWidth, maxHeight) / 2, 0);
    const outerRadius = (0, _helpersSegment.o)(me.options.radius, maxRadius);
    const innerRadius = Math.max(outerRadius * cutout, 0);

    const radiusLength = (outerRadius - innerRadius) / me._getVisibleDatasetWeightTotal();

    me.offsetX = offsetX * outerRadius;
    me.offsetY = offsetY * outerRadius;
    meta.total = me.calculateTotal();
    me.outerRadius = outerRadius - radiusLength * me._getRingWeightOffset(me.index);
    me.innerRadius = Math.max(me.outerRadius - radiusLength * chartWeight, 0);
    me.updateElements(arcs, 0, arcs.length, mode);
  }

  _circumference(i, reset) {
    const me = this;
    const opts = me.options;
    const meta = me._cachedMeta;

    const circumference = me._getCircumference();

    if (reset && opts.animation.animateRotate || !this.chart.getDataVisibility(i) || meta._parsed[i] === null) {
      return 0;
    }

    return me.calculateCircumference(meta._parsed[i] * circumference / _helpersSegment.T);
  }

  updateElements(arcs, start, count, mode) {
    const me = this;
    const reset = mode === 'reset';
    const chart = me.chart;
    const chartArea = chart.chartArea;
    const opts = chart.options;
    const animationOpts = opts.animation;
    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;
    const animateScale = reset && animationOpts.animateScale;
    const innerRadius = animateScale ? 0 : me.innerRadius;
    const outerRadius = animateScale ? 0 : me.outerRadius;
    const firstOpts = me.resolveDataElementOptions(start, mode);
    const sharedOptions = me.getSharedOptions(firstOpts);
    const includeOptions = me.includeOptions(mode, sharedOptions);

    let startAngle = me._getRotation();

    let i;

    for (i = 0; i < start; ++i) {
      startAngle += me._circumference(i, reset);
    }

    for (i = start; i < start + count; ++i) {
      const circumference = me._circumference(i, reset);

      const arc = arcs[i];
      const properties = {
        x: centerX + me.offsetX,
        y: centerY + me.offsetY,
        startAngle,
        endAngle: startAngle + circumference,
        circumference,
        outerRadius,
        innerRadius
      };

      if (includeOptions) {
        properties.options = sharedOptions || me.resolveDataElementOptions(i, mode);
      }

      startAngle += circumference;
      me.updateElement(arc, i, properties, mode);
    }

    me.updateSharedOptions(sharedOptions, mode, firstOpts);
  }

  calculateTotal() {
    const meta = this._cachedMeta;
    const metaData = meta.data;
    let total = 0;
    let i;

    for (i = 0; i < metaData.length; i++) {
      const value = meta._parsed[i];

      if (value !== null && !isNaN(value) && this.chart.getDataVisibility(i)) {
        total += Math.abs(value);
      }
    }

    return total;
  }

  calculateCircumference(value) {
    const total = this._cachedMeta.total;

    if (total > 0 && !isNaN(value)) {
      return _helpersSegment.T * (Math.abs(value) / total);
    }

    return 0;
  }

  getLabelAndValue(index) {
    const me = this;
    const meta = me._cachedMeta;
    const chart = me.chart;
    const labels = chart.data.labels || [];
    const value = (0, _helpersSegment.p)(meta._parsed[index], chart.options.locale);
    return {
      label: labels[index] || '',
      value
    };
  }

  getMaxBorderWidth(arcs) {
    const me = this;
    let max = 0;
    const chart = me.chart;
    let i, ilen, meta, controller, options;

    if (!arcs) {
      for (i = 0, ilen = chart.data.datasets.length; i < ilen; ++i) {
        if (chart.isDatasetVisible(i)) {
          meta = chart.getDatasetMeta(i);
          arcs = meta.data;
          controller = meta.controller;

          if (controller !== me) {
            controller.configure();
          }

          break;
        }
      }
    }

    if (!arcs) {
      return 0;
    }

    for (i = 0, ilen = arcs.length; i < ilen; ++i) {
      options = controller.resolveDataElementOptions(i);

      if (options.borderAlign !== 'inner') {
        max = Math.max(max, options.borderWidth || 0, options.hoverBorderWidth || 0);
      }
    }

    return max;
  }

  getMaxOffset(arcs) {
    let max = 0;

    for (let i = 0, ilen = arcs.length; i < ilen; ++i) {
      const options = this.resolveDataElementOptions(i);
      max = Math.max(max, options.offset || 0, options.hoverOffset || 0);
    }

    return max;
  }

  _getRingWeightOffset(datasetIndex) {
    let ringWeightOffset = 0;

    for (let i = 0; i < datasetIndex; ++i) {
      if (this.chart.isDatasetVisible(i)) {
        ringWeightOffset += this._getRingWeight(i);
      }
    }

    return ringWeightOffset;
  }

  _getRingWeight(datasetIndex) {
    return Math.max((0, _helpersSegment.v)(this.chart.data.datasets[datasetIndex].weight, 1), 0);
  }

  _getVisibleDatasetWeightTotal() {
    return this._getRingWeightOffset(this.chart.data.datasets.length) || 1;
  }

}

exports.DoughnutController = DoughnutController;
DoughnutController.id = 'doughnut';
DoughnutController.defaults = {
  datasetElementType: false,
  dataElementType: 'arc',
  animation: {
    animateRotate: true,
    animateScale: false
  },
  animations: {
    numbers: {
      type: 'number',
      properties: ['circumference', 'endAngle', 'innerRadius', 'outerRadius', 'startAngle', 'x', 'y', 'offset', 'borderWidth']
    }
  },
  cutout: '50%',
  rotation: 0,
  circumference: 360,
  radius: '100%',
  indexAxis: 'r'
};
DoughnutController.overrides = {
  aspectRatio: 1,
  plugins: {
    legend: {
      labels: {
        generateLabels(chart) {
          const data = chart.data;

          if (data.labels.length && data.datasets.length) {
            return data.labels.map((label, i) => {
              const meta = chart.getDatasetMeta(0);
              const style = meta.controller.getStyle(i);
              return {
                text: label,
                fillStyle: style.backgroundColor,
                strokeStyle: style.borderColor,
                lineWidth: style.borderWidth,
                hidden: !chart.getDataVisibility(i),
                index: i
              };
            });
          }

          return [];
        }

      },

      onClick(e, legendItem, legend) {
        legend.chart.toggleDataVisibility(legendItem.index);
        legend.chart.update();
      }

    },
    tooltip: {
      callbacks: {
        title() {
          return '';
        },

        label(tooltipItem) {
          let dataLabel = tooltipItem.label;
          const value = ': ' + tooltipItem.formattedValue;

          if ((0, _helpersSegment.b)(dataLabel)) {
            dataLabel = dataLabel.slice();
            dataLabel[0] += value;
          } else {
            dataLabel += value;
          }

          return dataLabel;
        }

      }
    }
  }
};

class LineController extends DatasetController {
  initialize() {
    this.enableOptionSharing = true;
    super.initialize();
  }

  update(mode) {
    const me = this;
    const meta = me._cachedMeta;
    const {
      dataset: line,
      data: points = [],
      _dataset
    } = meta;
    const animationsDisabled = me.chart._animationsDisabled;
    let {
      start,
      count
    } = getStartAndCountOfVisiblePoints(meta, points, animationsDisabled);
    me._drawStart = start;
    me._drawCount = count;

    if (scaleRangesChanged(meta)) {
      start = 0;
      count = points.length;
    }

    line._decimated = !!_dataset._decimated;
    line.points = points;
    const options = me.resolveDatasetElementOptions(mode);

    if (!me.options.showLine) {
      options.borderWidth = 0;
    }

    options.segment = me.options.segment;
    me.updateElement(line, undefined, {
      animated: !animationsDisabled,
      options
    }, mode);
    me.updateElements(points, start, count, mode);
  }

  updateElements(points, start, count, mode) {
    const me = this;
    const reset = mode === 'reset';
    const {
      xScale,
      yScale,
      _stacked
    } = me._cachedMeta;
    const firstOpts = me.resolveDataElementOptions(start, mode);
    const sharedOptions = me.getSharedOptions(firstOpts);
    const includeOptions = me.includeOptions(mode, sharedOptions);
    const spanGaps = me.options.spanGaps;
    const maxGapLength = (0, _helpersSegment.w)(spanGaps) ? spanGaps : Number.POSITIVE_INFINITY;
    const directUpdate = me.chart._animationsDisabled || reset || mode === 'none';
    let prevParsed = start > 0 && me.getParsed(start - 1);

    for (let i = start; i < start + count; ++i) {
      const point = points[i];
      const parsed = me.getParsed(i);
      const properties = directUpdate ? point : {};
      const nullData = (0, _helpersSegment.j)(parsed.y);
      const x = properties.x = xScale.getPixelForValue(parsed.x, i);
      const y = properties.y = reset || nullData ? yScale.getBasePixel() : yScale.getPixelForValue(_stacked ? me.applyStack(yScale, parsed, _stacked) : parsed.y, i);
      properties.skip = isNaN(x) || isNaN(y) || nullData;
      properties.stop = i > 0 && parsed.x - prevParsed.x > maxGapLength;
      properties.parsed = parsed;

      if (includeOptions) {
        properties.options = sharedOptions || me.resolveDataElementOptions(i, mode);
      }

      if (!directUpdate) {
        me.updateElement(point, i, properties, mode);
      }

      prevParsed = parsed;
    }

    me.updateSharedOptions(sharedOptions, mode, firstOpts);
  }

  getMaxOverflow() {
    const me = this;
    const meta = me._cachedMeta;
    const dataset = meta.dataset;
    const border = dataset.options && dataset.options.borderWidth || 0;
    const data = meta.data || [];

    if (!data.length) {
      return border;
    }

    const firstPoint = data[0].size(me.resolveDataElementOptions(0));
    const lastPoint = data[data.length - 1].size(me.resolveDataElementOptions(data.length - 1));
    return Math.max(border, firstPoint, lastPoint) / 2;
  }

  draw() {
    this._cachedMeta.dataset.updateControlPoints(this.chart.chartArea);

    super.draw();
  }

}

exports.LineController = LineController;
LineController.id = 'line';
LineController.defaults = {
  datasetElementType: 'line',
  dataElementType: 'point',
  showLine: true,
  spanGaps: false
};
LineController.overrides = {
  scales: {
    _index_: {
      type: 'category'
    },
    _value_: {
      type: 'linear'
    }
  }
};

function getStartAndCountOfVisiblePoints(meta, points, animationsDisabled) {
  const pointCount = points.length;
  let start = 0;
  let count = pointCount;

  if (meta._sorted) {
    const {
      iScale,
      _parsed
    } = meta;
    const axis = iScale.axis;
    const {
      min,
      max,
      minDefined,
      maxDefined
    } = iScale.getUserBounds();

    if (minDefined) {
      start = (0, _helpersSegment.x)(Math.min((0, _helpersSegment.y)(_parsed, iScale.axis, min).lo, animationsDisabled ? pointCount : (0, _helpersSegment.y)(points, axis, iScale.getPixelForValue(min)).lo), 0, pointCount - 1);
    }

    if (maxDefined) {
      count = (0, _helpersSegment.x)(Math.max((0, _helpersSegment.y)(_parsed, iScale.axis, max).hi + 1, animationsDisabled ? 0 : (0, _helpersSegment.y)(points, axis, iScale.getPixelForValue(max)).hi + 1), start, pointCount) - start;
    } else {
      count = pointCount - start;
    }
  }

  return {
    start,
    count
  };
}

function scaleRangesChanged(meta) {
  const {
    xScale,
    yScale,
    _scaleRanges
  } = meta;
  const newRanges = {
    xmin: xScale.min,
    xmax: xScale.max,
    ymin: yScale.min,
    ymax: yScale.max
  };

  if (!_scaleRanges) {
    meta._scaleRanges = newRanges;
    return true;
  }

  const changed = _scaleRanges.xmin !== xScale.min || _scaleRanges.xmax !== xScale.max || _scaleRanges.ymin !== yScale.min || _scaleRanges.ymax !== yScale.max;
  Object.assign(_scaleRanges, newRanges);
  return changed;
}

class PolarAreaController extends DatasetController {
  constructor(chart, datasetIndex) {
    super(chart, datasetIndex);
    this.innerRadius = undefined;
    this.outerRadius = undefined;
  }

  update(mode) {
    const arcs = this._cachedMeta.data;

    this._updateRadius();

    this.updateElements(arcs, 0, arcs.length, mode);
  }

  _updateRadius() {
    const me = this;
    const chart = me.chart;
    const chartArea = chart.chartArea;
    const opts = chart.options;
    const minSize = Math.min(chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
    const outerRadius = Math.max(minSize / 2, 0);
    const innerRadius = Math.max(opts.cutoutPercentage ? outerRadius / 100 * opts.cutoutPercentage : 1, 0);
    const radiusLength = (outerRadius - innerRadius) / chart.getVisibleDatasetCount();
    me.outerRadius = outerRadius - radiusLength * me.index;
    me.innerRadius = me.outerRadius - radiusLength;
  }

  updateElements(arcs, start, count, mode) {
    const me = this;
    const reset = mode === 'reset';
    const chart = me.chart;
    const dataset = me.getDataset();
    const opts = chart.options;
    const animationOpts = opts.animation;
    const scale = me._cachedMeta.rScale;
    const centerX = scale.xCenter;
    const centerY = scale.yCenter;

    const datasetStartAngle = scale.getIndexAngle(0) - 0.5 * _helpersSegment.P;

    let angle = datasetStartAngle;
    let i;
    const defaultAngle = 360 / me.countVisibleElements();

    for (i = 0; i < start; ++i) {
      angle += me._computeAngle(i, mode, defaultAngle);
    }

    for (i = start; i < start + count; i++) {
      const arc = arcs[i];
      let startAngle = angle;

      let endAngle = angle + me._computeAngle(i, mode, defaultAngle);

      let outerRadius = chart.getDataVisibility(i) ? scale.getDistanceFromCenterForValue(dataset.data[i]) : 0;
      angle = endAngle;

      if (reset) {
        if (animationOpts.animateScale) {
          outerRadius = 0;
        }

        if (animationOpts.animateRotate) {
          startAngle = endAngle = datasetStartAngle;
        }
      }

      const properties = {
        x: centerX,
        y: centerY,
        innerRadius: 0,
        outerRadius,
        startAngle,
        endAngle,
        options: me.resolveDataElementOptions(i, mode)
      };
      me.updateElement(arc, i, properties, mode);
    }
  }

  countVisibleElements() {
    const dataset = this.getDataset();
    const meta = this._cachedMeta;
    let count = 0;
    meta.data.forEach((element, index) => {
      if (!isNaN(dataset.data[index]) && this.chart.getDataVisibility(index)) {
        count++;
      }
    });
    return count;
  }

  _computeAngle(index, mode, defaultAngle) {
    return this.chart.getDataVisibility(index) ? (0, _helpersSegment.t)(this.resolveDataElementOptions(index, mode).angle || defaultAngle) : 0;
  }

}

exports.PolarAreaController = PolarAreaController;
PolarAreaController.id = 'polarArea';
PolarAreaController.defaults = {
  dataElementType: 'arc',
  animation: {
    animateRotate: true,
    animateScale: true
  },
  animations: {
    numbers: {
      type: 'number',
      properties: ['x', 'y', 'startAngle', 'endAngle', 'innerRadius', 'outerRadius']
    }
  },
  indexAxis: 'r',
  startAngle: 0
};
PolarAreaController.overrides = {
  aspectRatio: 1,
  plugins: {
    legend: {
      labels: {
        generateLabels(chart) {
          const data = chart.data;

          if (data.labels.length && data.datasets.length) {
            return data.labels.map((label, i) => {
              const meta = chart.getDatasetMeta(0);
              const style = meta.controller.getStyle(i);
              return {
                text: label,
                fillStyle: style.backgroundColor,
                strokeStyle: style.borderColor,
                lineWidth: style.borderWidth,
                hidden: !chart.getDataVisibility(i),
                index: i
              };
            });
          }

          return [];
        }

      },

      onClick(e, legendItem, legend) {
        legend.chart.toggleDataVisibility(legendItem.index);
        legend.chart.update();
      }

    },
    tooltip: {
      callbacks: {
        title() {
          return '';
        },

        label(context) {
          return context.chart.data.labels[context.dataIndex] + ': ' + context.formattedValue;
        }

      }
    }
  },
  scales: {
    r: {
      type: 'radialLinear',
      angleLines: {
        display: false
      },
      beginAtZero: true,
      grid: {
        circular: true
      },
      pointLabels: {
        display: false
      },
      startAngle: 0
    }
  }
};

class PieController extends DoughnutController {}

exports.PieController = PieController;
PieController.id = 'pie';
PieController.defaults = {
  cutout: 0,
  rotation: 0,
  circumference: 360,
  radius: '100%'
};

class RadarController extends DatasetController {
  getLabelAndValue(index) {
    const me = this;
    const vScale = me._cachedMeta.vScale;
    const parsed = me.getParsed(index);
    return {
      label: vScale.getLabels()[index],
      value: '' + vScale.getLabelForValue(parsed[vScale.axis])
    };
  }

  update(mode) {
    const me = this;
    const meta = me._cachedMeta;
    const line = meta.dataset;
    const points = meta.data || [];
    const labels = meta.iScale.getLabels();
    line.points = points;

    if (mode !== 'resize') {
      const options = me.resolveDatasetElementOptions(mode);

      if (!me.options.showLine) {
        options.borderWidth = 0;
      }

      const properties = {
        _loop: true,
        _fullLoop: labels.length === points.length,
        options
      };
      me.updateElement(line, undefined, properties, mode);
    }

    me.updateElements(points, 0, points.length, mode);
  }

  updateElements(points, start, count, mode) {
    const me = this;
    const dataset = me.getDataset();
    const scale = me._cachedMeta.rScale;
    const reset = mode === 'reset';

    for (let i = start; i < start + count; i++) {
      const point = points[i];
      const options = me.resolveDataElementOptions(i, mode);
      const pointPosition = scale.getPointPositionForValue(i, dataset.data[i]);
      const x = reset ? scale.xCenter : pointPosition.x;
      const y = reset ? scale.yCenter : pointPosition.y;
      const properties = {
        x,
        y,
        angle: pointPosition.angle,
        skip: isNaN(x) || isNaN(y),
        options
      };
      me.updateElement(point, i, properties, mode);
    }
  }

}

exports.RadarController = RadarController;
RadarController.id = 'radar';
RadarController.defaults = {
  datasetElementType: 'line',
  dataElementType: 'point',
  indexAxis: 'r',
  showLine: true,
  elements: {
    line: {
      fill: 'start'
    }
  }
};
RadarController.overrides = {
  aspectRatio: 1,
  scales: {
    r: {
      type: 'radialLinear'
    }
  }
};

class ScatterController extends LineController {}

exports.ScatterController = ScatterController;
ScatterController.id = 'scatter';
ScatterController.defaults = {
  showLine: false,
  fill: false
};
ScatterController.overrides = {
  interaction: {
    mode: 'point'
  },
  plugins: {
    tooltip: {
      callbacks: {
        title() {
          return '';
        },

        label(item) {
          return '(' + item.label + ', ' + item.formattedValue + ')';
        }

      }
    }
  },
  scales: {
    x: {
      type: 'linear'
    },
    y: {
      type: 'linear'
    }
  }
};
var controllers = /*#__PURE__*/Object.freeze({
  __proto__: null,
  BarController: BarController,
  BubbleController: BubbleController,
  DoughnutController: DoughnutController,
  LineController: LineController,
  PolarAreaController: PolarAreaController,
  PieController: PieController,
  RadarController: RadarController,
  ScatterController: ScatterController
});
exports.controllers = controllers;

function abstract() {
  throw new Error('This method is not implemented: either no adapter can be found or an incomplete integration was provided.');
}

class DateAdapter {
  constructor(options) {
    this.options = options || {};
  }

  formats() {
    return abstract();
  }

  parse(value, format) {
    return abstract();
  }

  format(timestamp, format) {
    return abstract();
  }

  add(timestamp, amount, unit) {
    return abstract();
  }

  diff(a, b, unit) {
    return abstract();
  }

  startOf(timestamp, unit, weekday) {
    return abstract();
  }

  endOf(timestamp, unit) {
    return abstract();
  }

}

DateAdapter.override = function (members) {
  Object.assign(DateAdapter.prototype, members);
};

var adapters = {
  _date: DateAdapter
};
exports._adapters = adapters;

function getRelativePosition(e, chart) {
  if ('native' in e) {
    return {
      x: e.x,
      y: e.y
    };
  }

  return (0, _helpersSegment.z)(e, chart);
}

function evaluateAllVisibleItems(chart, handler) {
  const metasets = chart.getSortedVisibleDatasetMetas();
  let index, data, element;

  for (let i = 0, ilen = metasets.length; i < ilen; ++i) {
    ({
      index,
      data
    } = metasets[i]);

    for (let j = 0, jlen = data.length; j < jlen; ++j) {
      element = data[j];

      if (!element.skip) {
        handler(element, index, j);
      }
    }
  }
}

function binarySearch(metaset, axis, value, intersect) {
  const {
    controller,
    data,
    _sorted
  } = metaset;
  const iScale = controller._cachedMeta.iScale;

  if (iScale && axis === iScale.axis && _sorted && data.length) {
    const lookupMethod = iScale._reversePixels ? _helpersSegment.B : _helpersSegment.y;

    if (!intersect) {
      return lookupMethod(data, axis, value);
    } else if (controller._sharedOptions) {
      const el = data[0];
      const range = typeof el.getRange === 'function' && el.getRange(axis);

      if (range) {
        const start = lookupMethod(data, axis, value - range);
        const end = lookupMethod(data, axis, value + range);
        return {
          lo: start.lo,
          hi: end.hi
        };
      }
    }
  }

  return {
    lo: 0,
    hi: data.length - 1
  };
}

function optimizedEvaluateItems(chart, axis, position, handler, intersect) {
  const metasets = chart.getSortedVisibleDatasetMetas();
  const value = position[axis];

  for (let i = 0, ilen = metasets.length; i < ilen; ++i) {
    const {
      index,
      data
    } = metasets[i];
    const {
      lo,
      hi
    } = binarySearch(metasets[i], axis, value, intersect);

    for (let j = lo; j <= hi; ++j) {
      const element = data[j];

      if (!element.skip) {
        handler(element, index, j);
      }
    }
  }
}

function getDistanceMetricForAxis(axis) {
  const useX = axis.indexOf('x') !== -1;
  const useY = axis.indexOf('y') !== -1;
  return function (pt1, pt2) {
    const deltaX = useX ? Math.abs(pt1.x - pt2.x) : 0;
    const deltaY = useY ? Math.abs(pt1.y - pt2.y) : 0;
    return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
  };
}

function getIntersectItems(chart, position, axis, useFinalPosition) {
  const items = [];

  if (!(0, _helpersSegment.A)(position, chart.chartArea, chart._minPadding)) {
    return items;
  }

  const evaluationFunc = function (element, datasetIndex, index) {
    if (element.inRange(position.x, position.y, useFinalPosition)) {
      items.push({
        element,
        datasetIndex,
        index
      });
    }
  };

  optimizedEvaluateItems(chart, axis, position, evaluationFunc, true);
  return items;
}

function getNearestItems(chart, position, axis, intersect, useFinalPosition) {
  const distanceMetric = getDistanceMetricForAxis(axis);
  let minDistance = Number.POSITIVE_INFINITY;
  let items = [];

  if (!(0, _helpersSegment.A)(position, chart.chartArea, chart._minPadding)) {
    return items;
  }

  const evaluationFunc = function (element, datasetIndex, index) {
    if (intersect && !element.inRange(position.x, position.y, useFinalPosition)) {
      return;
    }

    const center = element.getCenterPoint(useFinalPosition);
    const distance = distanceMetric(position, center);

    if (distance < minDistance) {
      items = [{
        element,
        datasetIndex,
        index
      }];
      minDistance = distance;
    } else if (distance === minDistance) {
      items.push({
        element,
        datasetIndex,
        index
      });
    }
  };

  optimizedEvaluateItems(chart, axis, position, evaluationFunc);
  return items;
}

function getAxisItems(chart, e, options, useFinalPosition) {
  const position = getRelativePosition(e, chart);
  const items = [];
  const axis = options.axis;
  const rangeMethod = axis === 'x' ? 'inXRange' : 'inYRange';
  let intersectsItem = false;
  evaluateAllVisibleItems(chart, (element, datasetIndex, index) => {
    if (element[rangeMethod](position[axis], useFinalPosition)) {
      items.push({
        element,
        datasetIndex,
        index
      });
    }

    if (element.inRange(position.x, position.y, useFinalPosition)) {
      intersectsItem = true;
    }
  });

  if (options.intersect && !intersectsItem) {
    return [];
  }

  return items;
}

var Interaction = {
  modes: {
    index(chart, e, options, useFinalPosition) {
      const position = getRelativePosition(e, chart);
      const axis = options.axis || 'x';
      const items = options.intersect ? getIntersectItems(chart, position, axis, useFinalPosition) : getNearestItems(chart, position, axis, false, useFinalPosition);
      const elements = [];

      if (!items.length) {
        return [];
      }

      chart.getSortedVisibleDatasetMetas().forEach(meta => {
        const index = items[0].index;
        const element = meta.data[index];

        if (element && !element.skip) {
          elements.push({
            element,
            datasetIndex: meta.index,
            index
          });
        }
      });
      return elements;
    },

    dataset(chart, e, options, useFinalPosition) {
      const position = getRelativePosition(e, chart);
      const axis = options.axis || 'xy';
      let items = options.intersect ? getIntersectItems(chart, position, axis, useFinalPosition) : getNearestItems(chart, position, axis, false, useFinalPosition);

      if (items.length > 0) {
        const datasetIndex = items[0].datasetIndex;
        const data = chart.getDatasetMeta(datasetIndex).data;
        items = [];

        for (let i = 0; i < data.length; ++i) {
          items.push({
            element: data[i],
            datasetIndex,
            index: i
          });
        }
      }

      return items;
    },

    point(chart, e, options, useFinalPosition) {
      const position = getRelativePosition(e, chart);
      const axis = options.axis || 'xy';
      return getIntersectItems(chart, position, axis, useFinalPosition);
    },

    nearest(chart, e, options, useFinalPosition) {
      const position = getRelativePosition(e, chart);
      const axis = options.axis || 'xy';
      return getNearestItems(chart, position, axis, options.intersect, useFinalPosition);
    },

    x(chart, e, options, useFinalPosition) {
      options.axis = 'x';
      return getAxisItems(chart, e, options, useFinalPosition);
    },

    y(chart, e, options, useFinalPosition) {
      options.axis = 'y';
      return getAxisItems(chart, e, options, useFinalPosition);
    }

  }
};
exports.Interaction = Interaction;
const STATIC_POSITIONS = ['left', 'top', 'right', 'bottom'];

function filterByPosition(array, position) {
  return array.filter(v => v.pos === position);
}

function filterDynamicPositionByAxis(array, axis) {
  return array.filter(v => STATIC_POSITIONS.indexOf(v.pos) === -1 && v.box.axis === axis);
}

function sortByWeight(array, reverse) {
  return array.sort((a, b) => {
    const v0 = reverse ? b : a;
    const v1 = reverse ? a : b;
    return v0.weight === v1.weight ? v0.index - v1.index : v0.weight - v1.weight;
  });
}

function wrapBoxes(boxes) {
  const layoutBoxes = [];
  let i, ilen, box;

  for (i = 0, ilen = (boxes || []).length; i < ilen; ++i) {
    box = boxes[i];
    layoutBoxes.push({
      index: i,
      box,
      pos: box.position,
      horizontal: box.isHorizontal(),
      weight: box.weight
    });
  }

  return layoutBoxes;
}

function setLayoutDims(layouts, params) {
  let i, ilen, layout;

  for (i = 0, ilen = layouts.length; i < ilen; ++i) {
    layout = layouts[i];

    if (layout.horizontal) {
      layout.width = layout.box.fullSize && params.availableWidth;
      layout.height = params.hBoxMaxHeight;
    } else {
      layout.width = params.vBoxMaxWidth;
      layout.height = layout.box.fullSize && params.availableHeight;
    }
  }
}

function buildLayoutBoxes(boxes) {
  const layoutBoxes = wrapBoxes(boxes);
  const fullSize = sortByWeight(layoutBoxes.filter(wrap => wrap.box.fullSize), true);
  const left = sortByWeight(filterByPosition(layoutBoxes, 'left'), true);
  const right = sortByWeight(filterByPosition(layoutBoxes, 'right'));
  const top = sortByWeight(filterByPosition(layoutBoxes, 'top'), true);
  const bottom = sortByWeight(filterByPosition(layoutBoxes, 'bottom'));
  const centerHorizontal = filterDynamicPositionByAxis(layoutBoxes, 'x');
  const centerVertical = filterDynamicPositionByAxis(layoutBoxes, 'y');
  return {
    fullSize,
    leftAndTop: left.concat(top),
    rightAndBottom: right.concat(centerVertical).concat(bottom).concat(centerHorizontal),
    chartArea: filterByPosition(layoutBoxes, 'chartArea'),
    vertical: left.concat(right).concat(centerVertical),
    horizontal: top.concat(bottom).concat(centerHorizontal)
  };
}

function getCombinedMax(maxPadding, chartArea, a, b) {
  return Math.max(maxPadding[a], chartArea[a]) + Math.max(maxPadding[b], chartArea[b]);
}

function updateMaxPadding(maxPadding, boxPadding) {
  maxPadding.top = Math.max(maxPadding.top, boxPadding.top);
  maxPadding.left = Math.max(maxPadding.left, boxPadding.left);
  maxPadding.bottom = Math.max(maxPadding.bottom, boxPadding.bottom);
  maxPadding.right = Math.max(maxPadding.right, boxPadding.right);
}

function updateDims(chartArea, params, layout) {
  const box = layout.box;
  const maxPadding = chartArea.maxPadding;

  if (!(0, _helpersSegment.i)(layout.pos)) {
    if (layout.size) {
      chartArea[layout.pos] -= layout.size;
    }

    layout.size = layout.horizontal ? box.height : box.width;
    chartArea[layout.pos] += layout.size;
  }

  if (box.getPadding) {
    updateMaxPadding(maxPadding, box.getPadding());
  }

  const newWidth = Math.max(0, params.outerWidth - getCombinedMax(maxPadding, chartArea, 'left', 'right'));
  const newHeight = Math.max(0, params.outerHeight - getCombinedMax(maxPadding, chartArea, 'top', 'bottom'));
  const widthChanged = newWidth !== chartArea.w;
  const heightChanged = newHeight !== chartArea.h;
  chartArea.w = newWidth;
  chartArea.h = newHeight;
  return layout.horizontal ? {
    same: widthChanged,
    other: heightChanged
  } : {
    same: heightChanged,
    other: widthChanged
  };
}

function handleMaxPadding(chartArea) {
  const maxPadding = chartArea.maxPadding;

  function updatePos(pos) {
    const change = Math.max(maxPadding[pos] - chartArea[pos], 0);
    chartArea[pos] += change;
    return change;
  }

  chartArea.y += updatePos('top');
  chartArea.x += updatePos('left');
  updatePos('right');
  updatePos('bottom');
}

function getMargins(horizontal, chartArea) {
  const maxPadding = chartArea.maxPadding;

  function marginForPositions(positions) {
    const margin = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    };
    positions.forEach(pos => {
      margin[pos] = Math.max(chartArea[pos], maxPadding[pos]);
    });
    return margin;
  }

  return horizontal ? marginForPositions(['left', 'right']) : marginForPositions(['top', 'bottom']);
}

function fitBoxes(boxes, chartArea, params) {
  const refitBoxes = [];
  let i, ilen, layout, box, refit, changed;

  for (i = 0, ilen = boxes.length, refit = 0; i < ilen; ++i) {
    layout = boxes[i];
    box = layout.box;
    box.update(layout.width || chartArea.w, layout.height || chartArea.h, getMargins(layout.horizontal, chartArea));
    const {
      same,
      other
    } = updateDims(chartArea, params, layout);
    refit |= same && refitBoxes.length;
    changed = changed || other;

    if (!box.fullSize) {
      refitBoxes.push(layout);
    }
  }

  return refit && fitBoxes(refitBoxes, chartArea, params) || changed;
}

function placeBoxes(boxes, chartArea, params) {
  const userPadding = params.padding;
  let x = chartArea.x;
  let y = chartArea.y;
  let i, ilen, layout, box;

  for (i = 0, ilen = boxes.length; i < ilen; ++i) {
    layout = boxes[i];
    box = layout.box;

    if (layout.horizontal) {
      box.left = box.fullSize ? userPadding.left : chartArea.left;
      box.right = box.fullSize ? params.outerWidth - userPadding.right : chartArea.left + chartArea.w;
      box.top = y;
      box.bottom = y + box.height;
      box.width = box.right - box.left;
      y = box.bottom;
    } else {
      box.left = x;
      box.right = x + box.width;
      box.top = box.fullSize ? userPadding.top : chartArea.top;
      box.bottom = box.fullSize ? params.outerHeight - userPadding.right : chartArea.top + chartArea.h;
      box.height = box.bottom - box.top;
      x = box.right;
    }
  }

  chartArea.x = x;
  chartArea.y = y;
}

_helpersSegment.d.set('layout', {
  padding: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
});

var layouts = {
  addBox(chart, item) {
    if (!chart.boxes) {
      chart.boxes = [];
    }

    item.fullSize = item.fullSize || false;
    item.position = item.position || 'top';
    item.weight = item.weight || 0;

    item._layers = item._layers || function () {
      return [{
        z: 0,

        draw(chartArea) {
          item.draw(chartArea);
        }

      }];
    };

    chart.boxes.push(item);
  },

  removeBox(chart, layoutItem) {
    const index = chart.boxes ? chart.boxes.indexOf(layoutItem) : -1;

    if (index !== -1) {
      chart.boxes.splice(index, 1);
    }
  },

  configure(chart, item, options) {
    item.fullSize = options.fullSize;
    item.position = options.position;
    item.weight = options.weight;
  },

  update(chart, width, height, minPadding) {
    if (!chart) {
      return;
    }

    const padding = (0, _helpersSegment.C)(chart.options.layout.padding);
    const availableWidth = width - padding.width;
    const availableHeight = height - padding.height;
    const boxes = buildLayoutBoxes(chart.boxes);
    const verticalBoxes = boxes.vertical;
    const horizontalBoxes = boxes.horizontal;
    (0, _helpersSegment.D)(chart.boxes, box => {
      if (typeof box.beforeLayout === 'function') {
        box.beforeLayout();
      }
    });
    const visibleVerticalBoxCount = verticalBoxes.reduce((total, wrap) => wrap.box.options && wrap.box.options.display === false ? total : total + 1, 0) || 1;
    const params = Object.freeze({
      outerWidth: width,
      outerHeight: height,
      padding,
      availableWidth,
      availableHeight,
      vBoxMaxWidth: availableWidth / 2 / visibleVerticalBoxCount,
      hBoxMaxHeight: availableHeight / 2
    });
    const maxPadding = Object.assign({}, padding);
    updateMaxPadding(maxPadding, (0, _helpersSegment.C)(minPadding));
    const chartArea = Object.assign({
      maxPadding,
      w: availableWidth,
      h: availableHeight,
      x: padding.left,
      y: padding.top
    }, padding);
    setLayoutDims(verticalBoxes.concat(horizontalBoxes), params);
    fitBoxes(boxes.fullSize, chartArea, params);
    fitBoxes(verticalBoxes, chartArea, params);

    if (fitBoxes(horizontalBoxes, chartArea, params)) {
      fitBoxes(verticalBoxes, chartArea, params);
    }

    handleMaxPadding(chartArea);
    placeBoxes(boxes.leftAndTop, chartArea, params);
    chartArea.x += chartArea.w;
    chartArea.y += chartArea.h;
    placeBoxes(boxes.rightAndBottom, chartArea, params);
    chart.chartArea = {
      left: chartArea.left,
      top: chartArea.top,
      right: chartArea.left + chartArea.w,
      bottom: chartArea.top + chartArea.h,
      height: chartArea.h,
      width: chartArea.w
    };
    (0, _helpersSegment.D)(boxes.chartArea, layout => {
      const box = layout.box;
      Object.assign(box, chart.chartArea);
      box.update(chartArea.w, chartArea.h);
    });
  }

};
exports.layouts = layouts;

class BasePlatform {
  acquireContext(canvas, aspectRatio) {}

  releaseContext(context) {
    return false;
  }

  addEventListener(chart, type, listener) {}

  removeEventListener(chart, type, listener) {}

  getDevicePixelRatio() {
    return 1;
  }

  getMaximumSize(element, width, height, aspectRatio) {
    width = Math.max(0, width || element.width);
    height = height || element.height;
    return {
      width,
      height: Math.max(0, aspectRatio ? Math.floor(width / aspectRatio) : height)
    };
  }

  isAttached(canvas) {
    return true;
  }

}

exports.BasePlatform = BasePlatform;

class BasicPlatform extends BasePlatform {
  acquireContext(item) {
    return item && item.getContext && item.getContext('2d') || null;
  }

}

exports.BasicPlatform = BasicPlatform;
const EXPANDO_KEY = '$chartjs';
const EVENT_TYPES = {
  touchstart: 'mousedown',
  touchmove: 'mousemove',
  touchend: 'mouseup',
  pointerenter: 'mouseenter',
  pointerdown: 'mousedown',
  pointermove: 'mousemove',
  pointerup: 'mouseup',
  pointerleave: 'mouseout',
  pointerout: 'mouseout'
};

const isNullOrEmpty = value => value === null || value === '';

function initCanvas(canvas, aspectRatio) {
  const style = canvas.style;
  const renderHeight = canvas.getAttribute('height');
  const renderWidth = canvas.getAttribute('width');
  canvas[EXPANDO_KEY] = {
    initial: {
      height: renderHeight,
      width: renderWidth,
      style: {
        display: style.display,
        height: style.height,
        width: style.width
      }
    }
  };
  style.display = style.display || 'block';
  style.boxSizing = style.boxSizing || 'border-box';

  if (isNullOrEmpty(renderWidth)) {
    const displayWidth = (0, _helpersSegment.G)(canvas, 'width');

    if (displayWidth !== undefined) {
      canvas.width = displayWidth;
    }
  }

  if (isNullOrEmpty(renderHeight)) {
    if (canvas.style.height === '') {
      canvas.height = canvas.width / (aspectRatio || 2);
    } else {
      const displayHeight = (0, _helpersSegment.G)(canvas, 'height');

      if (displayHeight !== undefined) {
        canvas.height = displayHeight;
      }
    }
  }

  return canvas;
}

const eventListenerOptions = _helpersSegment.J ? {
  passive: true
} : false;

function addListener(node, type, listener) {
  node.addEventListener(type, listener, eventListenerOptions);
}

function removeListener(chart, type, listener) {
  chart.canvas.removeEventListener(type, listener, eventListenerOptions);
}

function fromNativeEvent(event, chart) {
  const type = EVENT_TYPES[event.type] || event.type;
  const {
    x,
    y
  } = (0, _helpersSegment.z)(event, chart);
  return {
    type,
    chart,
    native: event,
    x: x !== undefined ? x : null,
    y: y !== undefined ? y : null
  };
}

function createAttachObserver(chart, type, listener) {
  const canvas = chart.canvas;
  const container = canvas && (0, _helpersSegment.F)(canvas);
  const element = container || canvas;
  const observer = new MutationObserver(entries => {
    const parent = (0, _helpersSegment.F)(element);
    entries.forEach(entry => {
      for (let i = 0; i < entry.addedNodes.length; i++) {
        const added = entry.addedNodes[i];

        if (added === element || added === parent) {
          listener(entry.target);
        }
      }
    });
  });
  observer.observe(document, {
    childList: true,
    subtree: true
  });
  return observer;
}

function createDetachObserver(chart, type, listener) {
  const canvas = chart.canvas;
  const container = canvas && (0, _helpersSegment.F)(canvas);

  if (!container) {
    return;
  }

  const observer = new MutationObserver(entries => {
    entries.forEach(entry => {
      for (let i = 0; i < entry.removedNodes.length; i++) {
        if (entry.removedNodes[i] === canvas) {
          listener();
          break;
        }
      }
    });
  });
  observer.observe(container, {
    childList: true
  });
  return observer;
}

const drpListeningCharts = new Map();
let oldDevicePixelRatio = 0;

function onWindowResize() {
  const dpr = window.devicePixelRatio;

  if (dpr === oldDevicePixelRatio) {
    return;
  }

  oldDevicePixelRatio = dpr;
  drpListeningCharts.forEach((resize, chart) => {
    if (chart.currentDevicePixelRatio !== dpr) {
      resize();
    }
  });
}

function listenDevicePixelRatioChanges(chart, resize) {
  if (!drpListeningCharts.size) {
    window.addEventListener('resize', onWindowResize);
  }

  drpListeningCharts.set(chart, resize);
}

function unlistenDevicePixelRatioChanges(chart) {
  drpListeningCharts.delete(chart);

  if (!drpListeningCharts.size) {
    window.removeEventListener('resize', onWindowResize);
  }
}

function createResizeObserver(chart, type, listener) {
  const canvas = chart.canvas;
  const container = canvas && (0, _helpersSegment.F)(canvas);

  if (!container) {
    return;
  }

  const resize = (0, _helpersSegment.I)((width, height) => {
    const w = container.clientWidth;
    listener(width, height);

    if (w < container.clientWidth) {
      listener();
    }
  }, window);
  const observer = new ResizeObserver(entries => {
    const entry = entries[0];
    const width = entry.contentRect.width;
    const height = entry.contentRect.height;

    if (width === 0 && height === 0) {
      return;
    }

    resize(width, height);
  });
  observer.observe(container);
  listenDevicePixelRatioChanges(chart, resize);
  return observer;
}

function releaseObserver(chart, type, observer) {
  if (observer) {
    observer.disconnect();
  }

  if (type === 'resize') {
    unlistenDevicePixelRatioChanges(chart);
  }
}

function createProxyAndListen(chart, type, listener) {
  const canvas = chart.canvas;
  const proxy = (0, _helpersSegment.I)(event => {
    if (chart.ctx !== null) {
      listener(fromNativeEvent(event, chart));
    }
  }, chart, args => {
    const event = args[0];
    return [event, event.offsetX, event.offsetY];
  });
  addListener(canvas, type, proxy);
  return proxy;
}

class DomPlatform extends BasePlatform {
  acquireContext(canvas, aspectRatio) {
    const context = canvas && canvas.getContext && canvas.getContext('2d');

    if (context && context.canvas === canvas) {
      initCanvas(canvas, aspectRatio);
      return context;
    }

    return null;
  }

  releaseContext(context) {
    const canvas = context.canvas;

    if (!canvas[EXPANDO_KEY]) {
      return false;
    }

    const initial = canvas[EXPANDO_KEY].initial;
    ['height', 'width'].forEach(prop => {
      const value = initial[prop];

      if ((0, _helpersSegment.j)(value)) {
        canvas.removeAttribute(prop);
      } else {
        canvas.setAttribute(prop, value);
      }
    });
    const style = initial.style || {};
    Object.keys(style).forEach(key => {
      canvas.style[key] = style[key];
    });
    canvas.width = canvas.width;
    delete canvas[EXPANDO_KEY];
    return true;
  }

  addEventListener(chart, type, listener) {
    this.removeEventListener(chart, type);
    const proxies = chart.$proxies || (chart.$proxies = {});
    const handlers = {
      attach: createAttachObserver,
      detach: createDetachObserver,
      resize: createResizeObserver
    };
    const handler = handlers[type] || createProxyAndListen;
    proxies[type] = handler(chart, type, listener);
  }

  removeEventListener(chart, type) {
    const proxies = chart.$proxies || (chart.$proxies = {});
    const proxy = proxies[type];

    if (!proxy) {
      return;
    }

    const handlers = {
      attach: releaseObserver,
      detach: releaseObserver,
      resize: releaseObserver
    };
    const handler = handlers[type] || removeListener;
    handler(chart, type, proxy);
    proxies[type] = undefined;
  }

  getDevicePixelRatio() {
    return window.devicePixelRatio;
  }

  getMaximumSize(canvas, width, height, aspectRatio) {
    return (0, _helpersSegment.E)(canvas, width, height, aspectRatio);
  }

  isAttached(canvas) {
    const container = (0, _helpersSegment.F)(canvas);
    return !!(container && (0, _helpersSegment.F)(container));
  }

}

exports.DomPlatform = DomPlatform;

class Element {
  constructor() {
    this.x = undefined;
    this.y = undefined;
    this.active = false;
    this.options = undefined;
    this.$animations = undefined;
  }

  tooltipPosition(useFinalPosition) {
    const {
      x,
      y
    } = this.getProps(['x', 'y'], useFinalPosition);
    return {
      x,
      y
    };
  }

  hasValue() {
    return (0, _helpersSegment.w)(this.x) && (0, _helpersSegment.w)(this.y);
  }

  getProps(props, final) {
    const me = this;
    const anims = this.$animations;

    if (!final || !anims) {
      return me;
    }

    const ret = {};
    props.forEach(prop => {
      ret[prop] = anims[prop] && anims[prop].active() ? anims[prop]._to : me[prop];
    });
    return ret;
  }

}

exports.Element = Element;
Element.defaults = {};
Element.defaultRoutes = undefined;
const formatters = {
  values(value) {
    return (0, _helpersSegment.b)(value) ? value : '' + value;
  },

  numeric(tickValue, index, ticks) {
    if (tickValue === 0) {
      return '0';
    }

    const locale = this.chart.options.locale;
    let notation;
    let delta = tickValue;

    if (ticks.length > 1) {
      const maxTick = Math.max(Math.abs(ticks[0].value), Math.abs(ticks[ticks.length - 1].value));

      if (maxTick < 1e-4 || maxTick > 1e+15) {
        notation = 'scientific';
      }

      delta = calculateDelta(tickValue, ticks);
    }

    const logDelta = (0, _helpersSegment.K)(Math.abs(delta));
    const numDecimal = Math.max(Math.min(-1 * Math.floor(logDelta), 20), 0);
    const options = {
      notation,
      minimumFractionDigits: numDecimal,
      maximumFractionDigits: numDecimal
    };
    Object.assign(options, this.options.ticks.format);
    return (0, _helpersSegment.p)(tickValue, locale, options);
  },

  logarithmic(tickValue, index, ticks) {
    if (tickValue === 0) {
      return '0';
    }

    const remain = tickValue / Math.pow(10, Math.floor((0, _helpersSegment.K)(tickValue)));

    if (remain === 1 || remain === 2 || remain === 5) {
      return formatters.numeric.call(this, tickValue, index, ticks);
    }

    return '';
  }

};

function calculateDelta(tickValue, ticks) {
  let delta = ticks.length > 3 ? ticks[2].value - ticks[1].value : ticks[1].value - ticks[0].value;

  if (Math.abs(delta) > 1 && tickValue !== Math.floor(tickValue)) {
    delta = tickValue - Math.floor(tickValue);
  }

  return delta;
}

var Ticks = {
  formatters
};
exports.Ticks = Ticks;

_helpersSegment.d.set('scale', {
  display: true,
  offset: false,
  reverse: false,
  beginAtZero: false,
  bounds: 'ticks',
  grace: 0,
  grid: {
    display: true,
    lineWidth: 1,
    drawBorder: true,
    drawOnChartArea: true,
    drawTicks: true,
    tickLength: 8,
    tickWidth: (_ctx, options) => options.lineWidth,
    tickColor: (_ctx, options) => options.color,
    offset: false,
    borderDash: [],
    borderDashOffset: 0.0,
    borderWidth: 1
  },
  title: {
    display: false,
    text: '',
    padding: {
      top: 4,
      bottom: 4
    }
  },
  ticks: {
    minRotation: 0,
    maxRotation: 50,
    mirror: false,
    textStrokeWidth: 0,
    textStrokeColor: '',
    padding: 3,
    display: true,
    autoSkip: true,
    autoSkipPadding: 3,
    labelOffset: 0,
    callback: Ticks.formatters.values,
    minor: {},
    major: {},
    align: 'center',
    crossAlign: 'near',
    showLabelBackdrop: false,
    backdropColor: 'rgba(255, 255, 255, 0.75)',
    backdropPadding: 2
  }
});

_helpersSegment.d.route('scale.ticks', 'color', '', 'color');

_helpersSegment.d.route('scale.grid', 'color', '', 'borderColor');

_helpersSegment.d.route('scale.grid', 'borderColor', '', 'borderColor');

_helpersSegment.d.route('scale.title', 'color', '', 'color');

_helpersSegment.d.describe('scale', {
  _fallback: false,
  _scriptable: name => !name.startsWith('before') && !name.startsWith('after') && name !== 'callback' && name !== 'parser',
  _indexable: name => name !== 'borderDash' && name !== 'tickBorderDash'
});

_helpersSegment.d.describe('scales', {
  _fallback: 'scale'
});

function autoSkip(scale, ticks) {
  const tickOpts = scale.options.ticks;
  const ticksLimit = tickOpts.maxTicksLimit || determineMaxTicks(scale);
  const majorIndices = tickOpts.major.enabled ? getMajorIndices(ticks) : [];
  const numMajorIndices = majorIndices.length;
  const first = majorIndices[0];
  const last = majorIndices[numMajorIndices - 1];
  const newTicks = [];

  if (numMajorIndices > ticksLimit) {
    skipMajors(ticks, newTicks, majorIndices, numMajorIndices / ticksLimit);
    return newTicks;
  }

  const spacing = calculateSpacing(majorIndices, ticks, ticksLimit);

  if (numMajorIndices > 0) {
    let i, ilen;
    const avgMajorSpacing = numMajorIndices > 1 ? Math.round((last - first) / (numMajorIndices - 1)) : null;
    skip(ticks, newTicks, spacing, (0, _helpersSegment.j)(avgMajorSpacing) ? 0 : first - avgMajorSpacing, first);

    for (i = 0, ilen = numMajorIndices - 1; i < ilen; i++) {
      skip(ticks, newTicks, spacing, majorIndices[i], majorIndices[i + 1]);
    }

    skip(ticks, newTicks, spacing, last, (0, _helpersSegment.j)(avgMajorSpacing) ? ticks.length : last + avgMajorSpacing);
    return newTicks;
  }

  skip(ticks, newTicks, spacing);
  return newTicks;
}

function determineMaxTicks(scale) {
  const offset = scale.options.offset;

  const tickLength = scale._tickSize();

  const maxScale = scale._length / tickLength + (offset ? 0 : 1);
  const maxChart = scale._maxLength / tickLength;
  return Math.floor(Math.min(maxScale, maxChart));
}

function calculateSpacing(majorIndices, ticks, ticksLimit) {
  const evenMajorSpacing = getEvenSpacing(majorIndices);
  const spacing = ticks.length / ticksLimit;

  if (!evenMajorSpacing) {
    return Math.max(spacing, 1);
  }

  const factors = (0, _helpersSegment.L)(evenMajorSpacing);

  for (let i = 0, ilen = factors.length - 1; i < ilen; i++) {
    const factor = factors[i];

    if (factor > spacing) {
      return factor;
    }
  }

  return Math.max(spacing, 1);
}

function getMajorIndices(ticks) {
  const result = [];
  let i, ilen;

  for (i = 0, ilen = ticks.length; i < ilen; i++) {
    if (ticks[i].major) {
      result.push(i);
    }
  }

  return result;
}

function skipMajors(ticks, newTicks, majorIndices, spacing) {
  let count = 0;
  let next = majorIndices[0];
  let i;
  spacing = Math.ceil(spacing);

  for (i = 0; i < ticks.length; i++) {
    if (i === next) {
      newTicks.push(ticks[i]);
      count++;
      next = majorIndices[count * spacing];
    }
  }
}

function skip(ticks, newTicks, spacing, majorStart, majorEnd) {
  const start = (0, _helpersSegment.v)(majorStart, 0);
  const end = Math.min((0, _helpersSegment.v)(majorEnd, ticks.length), ticks.length);
  let count = 0;
  let length, i, next;
  spacing = Math.ceil(spacing);

  if (majorEnd) {
    length = majorEnd - majorStart;
    spacing = length / Math.floor(length / spacing);
  }

  next = start;

  while (next < 0) {
    count++;
    next = Math.round(start + count * spacing);
  }

  for (i = Math.max(start, 0); i < end; i++) {
    if (i === next) {
      newTicks.push(ticks[i]);
      count++;
      next = Math.round(start + count * spacing);
    }
  }
}

function getEvenSpacing(arr) {
  const len = arr.length;
  let i, diff;

  if (len < 2) {
    return false;
  }

  for (diff = arr[0], i = 1; i < len; ++i) {
    if (arr[i] - arr[i - 1] !== diff) {
      return false;
    }
  }

  return diff;
}

const reverseAlign = align => align === 'left' ? 'right' : align === 'right' ? 'left' : align;

const offsetFromEdge = (scale, edge, offset) => edge === 'top' || edge === 'left' ? scale[edge] + offset : scale[edge] - offset;

function sample(arr, numItems) {
  const result = [];
  const increment = arr.length / numItems;
  const len = arr.length;
  let i = 0;

  for (; i < len; i += increment) {
    result.push(arr[Math.floor(i)]);
  }

  return result;
}

function getPixelForGridLine(scale, index, offsetGridLines) {
  const length = scale.ticks.length;
  const validIndex = Math.min(index, length - 1);
  const start = scale._startPixel;
  const end = scale._endPixel;
  const epsilon = 1e-6;
  let lineValue = scale.getPixelForTick(validIndex);
  let offset;

  if (offsetGridLines) {
    if (length === 1) {
      offset = Math.max(lineValue - start, end - lineValue);
    } else if (index === 0) {
      offset = (scale.getPixelForTick(1) - lineValue) / 2;
    } else {
      offset = (lineValue - scale.getPixelForTick(validIndex - 1)) / 2;
    }

    lineValue += validIndex < index ? offset : -offset;

    if (lineValue < start - epsilon || lineValue > end + epsilon) {
      return;
    }
  }

  return lineValue;
}

function garbageCollect(caches, length) {
  (0, _helpersSegment.D)(caches, cache => {
    const gc = cache.gc;
    const gcLen = gc.length / 2;
    let i;

    if (gcLen > length) {
      for (i = 0; i < gcLen; ++i) {
        delete cache.data[gc[i]];
      }

      gc.splice(0, gcLen);
    }
  });
}

function getTickMarkLength(options) {
  return options.drawTicks ? options.tickLength : 0;
}

function getTitleHeight(options, fallback) {
  if (!options.display) {
    return 0;
  }

  const font = (0, _helpersSegment.W)(options.font, fallback);
  const padding = (0, _helpersSegment.C)(options.padding);
  const lines = (0, _helpersSegment.b)(options.text) ? options.text.length : 1;
  return lines * font.lineHeight + padding.height;
}

function createScaleContext(parent, scale) {
  return Object.assign(Object.create(parent), {
    scale,
    type: 'scale'
  });
}

function createTickContext(parent, index, tick) {
  return Object.assign(Object.create(parent), {
    tick,
    index,
    type: 'tick'
  });
}

function titleAlign(align, position, reverse) {
  let ret = (0, _helpersSegment.X)(align);

  if (reverse && position !== 'right' || !reverse && position === 'right') {
    ret = reverseAlign(ret);
  }

  return ret;
}

function titleArgs(scale, offset, position, align) {
  const {
    top,
    left,
    bottom,
    right
  } = scale;
  let rotation = 0;
  let maxWidth, titleX, titleY;

  if (scale.isHorizontal()) {
    titleX = (0, _helpersSegment.Y)(align, left, right);
    titleY = offsetFromEdge(scale, position, offset);
    maxWidth = right - left;
  } else {
    titleX = offsetFromEdge(scale, position, offset);
    titleY = (0, _helpersSegment.Y)(align, bottom, top);
    rotation = position === 'left' ? -_helpersSegment.H : _helpersSegment.H;
  }

  return {
    titleX,
    titleY,
    maxWidth,
    rotation
  };
}

class Scale extends Element {
  constructor(cfg) {
    super();
    this.id = cfg.id;
    this.type = cfg.type;
    this.options = undefined;
    this.ctx = cfg.ctx;
    this.chart = cfg.chart;
    this.top = undefined;
    this.bottom = undefined;
    this.left = undefined;
    this.right = undefined;
    this.width = undefined;
    this.height = undefined;
    this._margins = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    };
    this.maxWidth = undefined;
    this.maxHeight = undefined;
    this.paddingTop = undefined;
    this.paddingBottom = undefined;
    this.paddingLeft = undefined;
    this.paddingRight = undefined;
    this.axis = undefined;
    this.labelRotation = undefined;
    this.min = undefined;
    this.max = undefined;
    this._range = undefined;
    this.ticks = [];
    this._gridLineItems = null;
    this._labelItems = null;
    this._labelSizes = null;
    this._length = 0;
    this._maxLength = 0;
    this._longestTextCache = {};
    this._startPixel = undefined;
    this._endPixel = undefined;
    this._reversePixels = false;
    this._userMax = undefined;
    this._userMin = undefined;
    this._suggestedMax = undefined;
    this._suggestedMin = undefined;
    this._ticksLength = 0;
    this._borderValue = 0;
    this._cache = {};
    this._dataLimitsCached = false;
    this.$context = undefined;
  }

  init(options) {
    const me = this;
    me.options = options.setContext(me.getContext());
    me.axis = options.axis;
    me._userMin = me.parse(options.min);
    me._userMax = me.parse(options.max);
    me._suggestedMin = me.parse(options.suggestedMin);
    me._suggestedMax = me.parse(options.suggestedMax);
  }

  parse(raw, index) {
    return raw;
  }

  getUserBounds() {
    let {
      _userMin,
      _userMax,
      _suggestedMin,
      _suggestedMax
    } = this;
    _userMin = (0, _helpersSegment.M)(_userMin, Number.POSITIVE_INFINITY);
    _userMax = (0, _helpersSegment.M)(_userMax, Number.NEGATIVE_INFINITY);
    _suggestedMin = (0, _helpersSegment.M)(_suggestedMin, Number.POSITIVE_INFINITY);
    _suggestedMax = (0, _helpersSegment.M)(_suggestedMax, Number.NEGATIVE_INFINITY);
    return {
      min: (0, _helpersSegment.M)(_userMin, _suggestedMin),
      max: (0, _helpersSegment.M)(_userMax, _suggestedMax),
      minDefined: (0, _helpersSegment.g)(_userMin),
      maxDefined: (0, _helpersSegment.g)(_userMax)
    };
  }

  getMinMax(canStack) {
    const me = this;
    let {
      min,
      max,
      minDefined,
      maxDefined
    } = me.getUserBounds();
    let range;

    if (minDefined && maxDefined) {
      return {
        min,
        max
      };
    }

    const metas = me.getMatchingVisibleMetas();

    for (let i = 0, ilen = metas.length; i < ilen; ++i) {
      range = metas[i].controller.getMinMax(me, canStack);

      if (!minDefined) {
        min = Math.min(min, range.min);
      }

      if (!maxDefined) {
        max = Math.max(max, range.max);
      }
    }

    return {
      min: (0, _helpersSegment.M)(min, (0, _helpersSegment.M)(max, min)),
      max: (0, _helpersSegment.M)(max, (0, _helpersSegment.M)(min, max))
    };
  }

  getPadding() {
    const me = this;
    return {
      left: me.paddingLeft || 0,
      top: me.paddingTop || 0,
      right: me.paddingRight || 0,
      bottom: me.paddingBottom || 0
    };
  }

  getTicks() {
    return this.ticks;
  }

  getLabels() {
    const data = this.chart.data;
    return this.options.labels || (this.isHorizontal() ? data.xLabels : data.yLabels) || data.labels || [];
  }

  beforeLayout() {
    this._cache = {};
    this._dataLimitsCached = false;
  }

  beforeUpdate() {
    (0, _helpersSegment.N)(this.options.beforeUpdate, [this]);
  }

  update(maxWidth, maxHeight, margins) {
    const me = this;
    const tickOpts = me.options.ticks;
    const sampleSize = tickOpts.sampleSize;
    me.beforeUpdate();
    me.maxWidth = maxWidth;
    me.maxHeight = maxHeight;
    me._margins = margins = Object.assign({
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }, margins);
    me.ticks = null;
    me._labelSizes = null;
    me._gridLineItems = null;
    me._labelItems = null;
    me.beforeSetDimensions();
    me.setDimensions();
    me.afterSetDimensions();
    me._maxLength = me.isHorizontal() ? me.width + margins.left + margins.right : me.height + margins.top + margins.bottom;

    if (!me._dataLimitsCached) {
      me.beforeDataLimits();
      me.determineDataLimits();
      me.afterDataLimits();
      me._range = (0, _helpersSegment.O)(me, me.options.grace);
      me._dataLimitsCached = true;
    }

    me.beforeBuildTicks();
    me.ticks = me.buildTicks() || [];
    me.afterBuildTicks();
    const samplingEnabled = sampleSize < me.ticks.length;

    me._convertTicksToLabels(samplingEnabled ? sample(me.ticks, sampleSize) : me.ticks);

    me.configure();
    me.beforeCalculateLabelRotation();
    me.calculateLabelRotation();
    me.afterCalculateLabelRotation();

    if (tickOpts.display && (tickOpts.autoSkip || tickOpts.source === 'auto')) {
      me.ticks = autoSkip(me, me.ticks);
      me._labelSizes = null;
    }

    if (samplingEnabled) {
      me._convertTicksToLabels(me.ticks);
    }

    me.beforeFit();
    me.fit();
    me.afterFit();
    me.afterUpdate();
  }

  configure() {
    const me = this;
    let reversePixels = me.options.reverse;
    let startPixel, endPixel;

    if (me.isHorizontal()) {
      startPixel = me.left;
      endPixel = me.right;
    } else {
      startPixel = me.top;
      endPixel = me.bottom;
      reversePixels = !reversePixels;
    }

    me._startPixel = startPixel;
    me._endPixel = endPixel;
    me._reversePixels = reversePixels;
    me._length = endPixel - startPixel;
    me._alignToPixels = me.options.alignToPixels;
  }

  afterUpdate() {
    (0, _helpersSegment.N)(this.options.afterUpdate, [this]);
  }

  beforeSetDimensions() {
    (0, _helpersSegment.N)(this.options.beforeSetDimensions, [this]);
  }

  setDimensions() {
    const me = this;

    if (me.isHorizontal()) {
      me.width = me.maxWidth;
      me.left = 0;
      me.right = me.width;
    } else {
      me.height = me.maxHeight;
      me.top = 0;
      me.bottom = me.height;
    }

    me.paddingLeft = 0;
    me.paddingTop = 0;
    me.paddingRight = 0;
    me.paddingBottom = 0;
  }

  afterSetDimensions() {
    (0, _helpersSegment.N)(this.options.afterSetDimensions, [this]);
  }

  _callHooks(name) {
    const me = this;
    me.chart.notifyPlugins(name, me.getContext());
    (0, _helpersSegment.N)(me.options[name], [me]);
  }

  beforeDataLimits() {
    this._callHooks('beforeDataLimits');
  }

  determineDataLimits() {}

  afterDataLimits() {
    this._callHooks('afterDataLimits');
  }

  beforeBuildTicks() {
    this._callHooks('beforeBuildTicks');
  }

  buildTicks() {
    return [];
  }

  afterBuildTicks() {
    this._callHooks('afterBuildTicks');
  }

  beforeTickToLabelConversion() {
    (0, _helpersSegment.N)(this.options.beforeTickToLabelConversion, [this]);
  }

  generateTickLabels(ticks) {
    const me = this;
    const tickOpts = me.options.ticks;
    let i, ilen, tick;

    for (i = 0, ilen = ticks.length; i < ilen; i++) {
      tick = ticks[i];
      tick.label = (0, _helpersSegment.N)(tickOpts.callback, [tick.value, i, ticks], me);
    }

    for (i = 0; i < ilen; i++) {
      if ((0, _helpersSegment.j)(ticks[i].label)) {
        ticks.splice(i, 1);
        ilen--;
        i--;
      }
    }
  }

  afterTickToLabelConversion() {
    (0, _helpersSegment.N)(this.options.afterTickToLabelConversion, [this]);
  }

  beforeCalculateLabelRotation() {
    (0, _helpersSegment.N)(this.options.beforeCalculateLabelRotation, [this]);
  }

  calculateLabelRotation() {
    const me = this;
    const options = me.options;
    const tickOpts = options.ticks;
    const numTicks = me.ticks.length;
    const minRotation = tickOpts.minRotation || 0;
    const maxRotation = tickOpts.maxRotation;
    let labelRotation = minRotation;
    let tickWidth, maxHeight, maxLabelDiagonal;

    if (!me._isVisible() || !tickOpts.display || minRotation >= maxRotation || numTicks <= 1 || !me.isHorizontal()) {
      me.labelRotation = minRotation;
      return;
    }

    const labelSizes = me._getLabelSizes();

    const maxLabelWidth = labelSizes.widest.width;
    const maxLabelHeight = labelSizes.highest.height;
    const maxWidth = (0, _helpersSegment.x)(me.chart.width - maxLabelWidth, 0, me.maxWidth);
    tickWidth = options.offset ? me.maxWidth / numTicks : maxWidth / (numTicks - 1);

    if (maxLabelWidth + 6 > tickWidth) {
      tickWidth = maxWidth / (numTicks - (options.offset ? 0.5 : 1));
      maxHeight = me.maxHeight - getTickMarkLength(options.grid) - tickOpts.padding - getTitleHeight(options.title, me.chart.options.font);
      maxLabelDiagonal = Math.sqrt(maxLabelWidth * maxLabelWidth + maxLabelHeight * maxLabelHeight);
      labelRotation = (0, _helpersSegment.Q)(Math.min(Math.asin(Math.min((labelSizes.highest.height + 6) / tickWidth, 1)), Math.asin(Math.min(maxHeight / maxLabelDiagonal, 1)) - Math.asin(maxLabelHeight / maxLabelDiagonal)));
      labelRotation = Math.max(minRotation, Math.min(maxRotation, labelRotation));
    }

    me.labelRotation = labelRotation;
  }

  afterCalculateLabelRotation() {
    (0, _helpersSegment.N)(this.options.afterCalculateLabelRotation, [this]);
  }

  beforeFit() {
    (0, _helpersSegment.N)(this.options.beforeFit, [this]);
  }

  fit() {
    const me = this;
    const minSize = {
      width: 0,
      height: 0
    };
    const {
      chart,
      options: {
        ticks: tickOpts,
        title: titleOpts,
        grid: gridOpts
      }
    } = me;

    const display = me._isVisible();

    const isHorizontal = me.isHorizontal();

    if (display) {
      const titleHeight = getTitleHeight(titleOpts, chart.options.font);

      if (isHorizontal) {
        minSize.width = me.maxWidth;
        minSize.height = getTickMarkLength(gridOpts) + titleHeight;
      } else {
        minSize.height = me.maxHeight;
        minSize.width = getTickMarkLength(gridOpts) + titleHeight;
      }

      if (tickOpts.display && me.ticks.length) {
        const {
          first,
          last,
          widest,
          highest
        } = me._getLabelSizes();

        const tickPadding = tickOpts.padding * 2;
        const angleRadians = (0, _helpersSegment.t)(me.labelRotation);
        const cos = Math.cos(angleRadians);
        const sin = Math.sin(angleRadians);

        if (isHorizontal) {
          const labelHeight = tickOpts.mirror ? 0 : sin * widest.width + cos * highest.height;
          minSize.height = Math.min(me.maxHeight, minSize.height + labelHeight + tickPadding);
        } else {
          const labelWidth = tickOpts.mirror ? 0 : cos * widest.width + sin * highest.height;
          minSize.width = Math.min(me.maxWidth, minSize.width + labelWidth + tickPadding);
        }

        me._calculatePadding(first, last, sin, cos);
      }
    }

    me._handleMargins();

    if (isHorizontal) {
      me.width = me._length = chart.width - me._margins.left - me._margins.right;
      me.height = minSize.height;
    } else {
      me.width = minSize.width;
      me.height = me._length = chart.height - me._margins.top - me._margins.bottom;
    }
  }

  _calculatePadding(first, last, sin, cos) {
    const me = this;
    const {
      ticks: {
        align,
        padding
      },
      position
    } = me.options;
    const isRotated = me.labelRotation !== 0;
    const labelsBelowTicks = position !== 'top' && me.axis === 'x';

    if (me.isHorizontal()) {
      const offsetLeft = me.getPixelForTick(0) - me.left;
      const offsetRight = me.right - me.getPixelForTick(me.ticks.length - 1);
      let paddingLeft = 0;
      let paddingRight = 0;

      if (isRotated) {
        if (labelsBelowTicks) {
          paddingLeft = cos * first.width;
          paddingRight = sin * last.height;
        } else {
          paddingLeft = sin * first.height;
          paddingRight = cos * last.width;
        }
      } else if (align === 'start') {
        paddingRight = last.width;
      } else if (align === 'end') {
        paddingLeft = first.width;
      } else {
        paddingLeft = first.width / 2;
        paddingRight = last.width / 2;
      }

      me.paddingLeft = Math.max((paddingLeft - offsetLeft + padding) * me.width / (me.width - offsetLeft), 0);
      me.paddingRight = Math.max((paddingRight - offsetRight + padding) * me.width / (me.width - offsetRight), 0);
    } else {
      let paddingTop = last.height / 2;
      let paddingBottom = first.height / 2;

      if (align === 'start') {
        paddingTop = 0;
        paddingBottom = first.height;
      } else if (align === 'end') {
        paddingTop = last.height;
        paddingBottom = 0;
      }

      me.paddingTop = paddingTop + padding;
      me.paddingBottom = paddingBottom + padding;
    }
  }

  _handleMargins() {
    const me = this;

    if (me._margins) {
      me._margins.left = Math.max(me.paddingLeft, me._margins.left);
      me._margins.top = Math.max(me.paddingTop, me._margins.top);
      me._margins.right = Math.max(me.paddingRight, me._margins.right);
      me._margins.bottom = Math.max(me.paddingBottom, me._margins.bottom);
    }
  }

  afterFit() {
    (0, _helpersSegment.N)(this.options.afterFit, [this]);
  }

  isHorizontal() {
    const {
      axis,
      position
    } = this.options;
    return position === 'top' || position === 'bottom' || axis === 'x';
  }

  isFullSize() {
    return this.options.fullSize;
  }

  _convertTicksToLabels(ticks) {
    const me = this;
    me.beforeTickToLabelConversion();
    me.generateTickLabels(ticks);
    me.afterTickToLabelConversion();
  }

  _getLabelSizes() {
    const me = this;
    let labelSizes = me._labelSizes;

    if (!labelSizes) {
      const sampleSize = me.options.ticks.sampleSize;
      let ticks = me.ticks;

      if (sampleSize < ticks.length) {
        ticks = sample(ticks, sampleSize);
      }

      me._labelSizes = labelSizes = me._computeLabelSizes(ticks, ticks.length);
    }

    return labelSizes;
  }

  _computeLabelSizes(ticks, length) {
    const {
      ctx,
      _longestTextCache: caches
    } = this;
    const widths = [];
    const heights = [];
    let widestLabelSize = 0;
    let highestLabelSize = 0;
    let i, j, jlen, label, tickFont, fontString, cache, lineHeight, width, height, nestedLabel;

    for (i = 0; i < length; ++i) {
      label = ticks[i].label;
      tickFont = this._resolveTickFontOptions(i);
      ctx.font = fontString = tickFont.string;
      cache = caches[fontString] = caches[fontString] || {
        data: {},
        gc: []
      };
      lineHeight = tickFont.lineHeight;
      width = height = 0;

      if (!(0, _helpersSegment.j)(label) && !(0, _helpersSegment.b)(label)) {
        width = (0, _helpersSegment.R)(ctx, cache.data, cache.gc, width, label);
        height = lineHeight;
      } else if ((0, _helpersSegment.b)(label)) {
        for (j = 0, jlen = label.length; j < jlen; ++j) {
          nestedLabel = label[j];

          if (!(0, _helpersSegment.j)(nestedLabel) && !(0, _helpersSegment.b)(nestedLabel)) {
            width = (0, _helpersSegment.R)(ctx, cache.data, cache.gc, width, nestedLabel);
            height += lineHeight;
          }
        }
      }

      widths.push(width);
      heights.push(height);
      widestLabelSize = Math.max(width, widestLabelSize);
      highestLabelSize = Math.max(height, highestLabelSize);
    }

    garbageCollect(caches, length);
    const widest = widths.indexOf(widestLabelSize);
    const highest = heights.indexOf(highestLabelSize);

    const valueAt = idx => ({
      width: widths[idx] || 0,
      height: heights[idx] || 0
    });

    return {
      first: valueAt(0),
      last: valueAt(length - 1),
      widest: valueAt(widest),
      highest: valueAt(highest),
      widths,
      heights
    };
  }

  getLabelForValue(value) {
    return value;
  }

  getPixelForValue(value, index) {
    return NaN;
  }

  getValueForPixel(pixel) {}

  getPixelForTick(index) {
    const ticks = this.ticks;

    if (index < 0 || index > ticks.length - 1) {
      return null;
    }

    return this.getPixelForValue(ticks[index].value);
  }

  getPixelForDecimal(decimal) {
    const me = this;

    if (me._reversePixels) {
      decimal = 1 - decimal;
    }

    const pixel = me._startPixel + decimal * me._length;
    return (0, _helpersSegment.S)(me._alignToPixels ? (0, _helpersSegment.U)(me.chart, pixel, 0) : pixel);
  }

  getDecimalForPixel(pixel) {
    const decimal = (pixel - this._startPixel) / this._length;
    return this._reversePixels ? 1 - decimal : decimal;
  }

  getBasePixel() {
    return this.getPixelForValue(this.getBaseValue());
  }

  getBaseValue() {
    const {
      min,
      max
    } = this;
    return min < 0 && max < 0 ? max : min > 0 && max > 0 ? min : 0;
  }

  getContext(index) {
    const me = this;
    const ticks = me.ticks || [];

    if (index >= 0 && index < ticks.length) {
      const tick = ticks[index];
      return tick.$context || (tick.$context = createTickContext(me.getContext(), index, tick));
    }

    return me.$context || (me.$context = createScaleContext(me.chart.getContext(), me));
  }

  _tickSize() {
    const me = this;
    const optionTicks = me.options.ticks;
    const rot = (0, _helpersSegment.t)(me.labelRotation);
    const cos = Math.abs(Math.cos(rot));
    const sin = Math.abs(Math.sin(rot));

    const labelSizes = me._getLabelSizes();

    const padding = optionTicks.autoSkipPadding || 0;
    const w = labelSizes ? labelSizes.widest.width + padding : 0;
    const h = labelSizes ? labelSizes.highest.height + padding : 0;
    return me.isHorizontal() ? h * cos > w * sin ? w / cos : h / sin : h * sin < w * cos ? h / cos : w / sin;
  }

  _isVisible() {
    const display = this.options.display;

    if (display !== 'auto') {
      return !!display;
    }

    return this.getMatchingVisibleMetas().length > 0;
  }

  _computeGridLineItems(chartArea) {
    const me = this;
    const axis = me.axis;
    const chart = me.chart;
    const options = me.options;
    const {
      grid,
      position
    } = options;
    const offset = grid.offset;
    const isHorizontal = me.isHorizontal();
    const ticks = me.ticks;
    const ticksLength = ticks.length + (offset ? 1 : 0);
    const tl = getTickMarkLength(grid);
    const items = [];
    const borderOpts = grid.setContext(me.getContext());
    const axisWidth = borderOpts.drawBorder ? borderOpts.borderWidth : 0;
    const axisHalfWidth = axisWidth / 2;

    const alignBorderValue = function (pixel) {
      return (0, _helpersSegment.U)(chart, pixel, axisWidth);
    };

    let borderValue, i, lineValue, alignedLineValue;
    let tx1, ty1, tx2, ty2, x1, y1, x2, y2;

    if (position === 'top') {
      borderValue = alignBorderValue(me.bottom);
      ty1 = me.bottom - tl;
      ty2 = borderValue - axisHalfWidth;
      y1 = alignBorderValue(chartArea.top) + axisHalfWidth;
      y2 = chartArea.bottom;
    } else if (position === 'bottom') {
      borderValue = alignBorderValue(me.top);
      y1 = chartArea.top;
      y2 = alignBorderValue(chartArea.bottom) - axisHalfWidth;
      ty1 = borderValue + axisHalfWidth;
      ty2 = me.top + tl;
    } else if (position === 'left') {
      borderValue = alignBorderValue(me.right);
      tx1 = me.right - tl;
      tx2 = borderValue - axisHalfWidth;
      x1 = alignBorderValue(chartArea.left) + axisHalfWidth;
      x2 = chartArea.right;
    } else if (position === 'right') {
      borderValue = alignBorderValue(me.left);
      x1 = chartArea.left;
      x2 = alignBorderValue(chartArea.right) - axisHalfWidth;
      tx1 = borderValue + axisHalfWidth;
      tx2 = me.left + tl;
    } else if (axis === 'x') {
      if (position === 'center') {
        borderValue = alignBorderValue((chartArea.top + chartArea.bottom) / 2 + 0.5);
      } else if ((0, _helpersSegment.i)(position)) {
        const positionAxisID = Object.keys(position)[0];
        const value = position[positionAxisID];
        borderValue = alignBorderValue(me.chart.scales[positionAxisID].getPixelForValue(value));
      }

      y1 = chartArea.top;
      y2 = chartArea.bottom;
      ty1 = borderValue + axisHalfWidth;
      ty2 = ty1 + tl;
    } else if (axis === 'y') {
      if (position === 'center') {
        borderValue = alignBorderValue((chartArea.left + chartArea.right) / 2);
      } else if ((0, _helpersSegment.i)(position)) {
        const positionAxisID = Object.keys(position)[0];
        const value = position[positionAxisID];
        borderValue = alignBorderValue(me.chart.scales[positionAxisID].getPixelForValue(value));
      }

      tx1 = borderValue - axisHalfWidth;
      tx2 = tx1 - tl;
      x1 = chartArea.left;
      x2 = chartArea.right;
    }

    for (i = 0; i < ticksLength; ++i) {
      const optsAtIndex = grid.setContext(me.getContext(i));
      const lineWidth = optsAtIndex.lineWidth;
      const lineColor = optsAtIndex.color;
      const borderDash = grid.borderDash || [];
      const borderDashOffset = optsAtIndex.borderDashOffset;
      const tickWidth = optsAtIndex.tickWidth;
      const tickColor = optsAtIndex.tickColor;
      const tickBorderDash = optsAtIndex.tickBorderDash || [];
      const tickBorderDashOffset = optsAtIndex.tickBorderDashOffset;
      lineValue = getPixelForGridLine(me, i, offset);

      if (lineValue === undefined) {
        continue;
      }

      alignedLineValue = (0, _helpersSegment.U)(chart, lineValue, lineWidth);

      if (isHorizontal) {
        tx1 = tx2 = x1 = x2 = alignedLineValue;
      } else {
        ty1 = ty2 = y1 = y2 = alignedLineValue;
      }

      items.push({
        tx1,
        ty1,
        tx2,
        ty2,
        x1,
        y1,
        x2,
        y2,
        width: lineWidth,
        color: lineColor,
        borderDash,
        borderDashOffset,
        tickWidth,
        tickColor,
        tickBorderDash,
        tickBorderDashOffset
      });
    }

    me._ticksLength = ticksLength;
    me._borderValue = borderValue;
    return items;
  }

  _computeLabelItems(chartArea) {
    const me = this;
    const axis = me.axis;
    const options = me.options;
    const {
      position,
      ticks: optionTicks
    } = options;
    const isHorizontal = me.isHorizontal();
    const ticks = me.ticks;
    const {
      align,
      crossAlign,
      padding,
      mirror
    } = optionTicks;
    const tl = getTickMarkLength(options.grid);
    const tickAndPadding = tl + padding;
    const hTickAndPadding = mirror ? -padding : tickAndPadding;
    const rotation = -(0, _helpersSegment.t)(me.labelRotation);
    const items = [];
    let i, ilen, tick, label, x, y, textAlign, pixel, font, lineHeight, lineCount, textOffset;
    let textBaseline = 'middle';

    if (position === 'top') {
      y = me.bottom - hTickAndPadding;
      textAlign = me._getXAxisLabelAlignment();
    } else if (position === 'bottom') {
      y = me.top + hTickAndPadding;
      textAlign = me._getXAxisLabelAlignment();
    } else if (position === 'left') {
      const ret = me._getYAxisLabelAlignment(tl);

      textAlign = ret.textAlign;
      x = ret.x;
    } else if (position === 'right') {
      const ret = me._getYAxisLabelAlignment(tl);

      textAlign = ret.textAlign;
      x = ret.x;
    } else if (axis === 'x') {
      if (position === 'center') {
        y = (chartArea.top + chartArea.bottom) / 2 + tickAndPadding;
      } else if ((0, _helpersSegment.i)(position)) {
        const positionAxisID = Object.keys(position)[0];
        const value = position[positionAxisID];
        y = me.chart.scales[positionAxisID].getPixelForValue(value) + tickAndPadding;
      }

      textAlign = me._getXAxisLabelAlignment();
    } else if (axis === 'y') {
      if (position === 'center') {
        x = (chartArea.left + chartArea.right) / 2 - tickAndPadding;
      } else if ((0, _helpersSegment.i)(position)) {
        const positionAxisID = Object.keys(position)[0];
        const value = position[positionAxisID];
        x = me.chart.scales[positionAxisID].getPixelForValue(value);
      }

      textAlign = me._getYAxisLabelAlignment(tl).textAlign;
    }

    if (axis === 'y') {
      if (align === 'start') {
        textBaseline = 'top';
      } else if (align === 'end') {
        textBaseline = 'bottom';
      }
    }

    const labelSizes = me._getLabelSizes();

    for (i = 0, ilen = ticks.length; i < ilen; ++i) {
      tick = ticks[i];
      label = tick.label;
      const optsAtIndex = optionTicks.setContext(me.getContext(i));
      pixel = me.getPixelForTick(i) + optionTicks.labelOffset;
      font = me._resolveTickFontOptions(i);
      lineHeight = font.lineHeight;
      lineCount = (0, _helpersSegment.b)(label) ? label.length : 1;
      const halfCount = lineCount / 2;
      const color = optsAtIndex.color;
      const strokeColor = optsAtIndex.textStrokeColor;
      const strokeWidth = optsAtIndex.textStrokeWidth;

      if (isHorizontal) {
        x = pixel;

        if (position === 'top') {
          if (crossAlign === 'near' || rotation !== 0) {
            textOffset = -lineCount * lineHeight + lineHeight / 2;
          } else if (crossAlign === 'center') {
            textOffset = -labelSizes.highest.height / 2 - halfCount * lineHeight + lineHeight;
          } else {
            textOffset = -labelSizes.highest.height + lineHeight / 2;
          }
        } else {
          if (crossAlign === 'near' || rotation !== 0) {
            textOffset = lineHeight / 2;
          } else if (crossAlign === 'center') {
            textOffset = labelSizes.highest.height / 2 - halfCount * lineHeight;
          } else {
            textOffset = labelSizes.highest.height - lineCount * lineHeight;
          }
        }

        if (mirror) {
          textOffset *= -1;
        }
      } else {
        y = pixel;
        textOffset = (1 - lineCount) * lineHeight / 2;
      }

      let backdrop;

      if (optsAtIndex.showLabelBackdrop) {
        const labelPadding = (0, _helpersSegment.C)(optsAtIndex.backdropPadding);
        const height = labelSizes.heights[i];
        const width = labelSizes.widths[i];
        let top = y + textOffset - labelPadding.top;
        let left = x - labelPadding.left;

        switch (textBaseline) {
          case 'middle':
            top -= height / 2;
            break;

          case 'bottom':
            top -= height;
            break;
        }

        switch (textAlign) {
          case 'center':
            left -= width / 2;
            break;

          case 'right':
            left -= width;
            break;
        }

        backdrop = {
          left,
          top,
          width: width + labelPadding.width,
          height: height + labelPadding.height,
          color: optsAtIndex.backdropColor
        };
      }

      items.push({
        rotation,
        label,
        font,
        color,
        strokeColor,
        strokeWidth,
        textOffset,
        textAlign,
        textBaseline,
        translation: [x, y],
        backdrop
      });
    }

    return items;
  }

  _getXAxisLabelAlignment() {
    const me = this;
    const {
      position,
      ticks
    } = me.options;
    const rotation = -(0, _helpersSegment.t)(me.labelRotation);

    if (rotation) {
      return position === 'top' ? 'left' : 'right';
    }

    let align = 'center';

    if (ticks.align === 'start') {
      align = 'left';
    } else if (ticks.align === 'end') {
      align = 'right';
    }

    return align;
  }

  _getYAxisLabelAlignment(tl) {
    const me = this;
    const {
      position,
      ticks: {
        crossAlign,
        mirror,
        padding
      }
    } = me.options;

    const labelSizes = me._getLabelSizes();

    const tickAndPadding = tl + padding;
    const widest = labelSizes.widest.width;
    let textAlign;
    let x;

    if (position === 'left') {
      if (mirror) {
        textAlign = 'left';
        x = me.right + padding;
      } else {
        x = me.right - tickAndPadding;

        if (crossAlign === 'near') {
          textAlign = 'right';
        } else if (crossAlign === 'center') {
          textAlign = 'center';
          x -= widest / 2;
        } else {
          textAlign = 'left';
          x = me.left;
        }
      }
    } else if (position === 'right') {
      if (mirror) {
        textAlign = 'right';
        x = me.left + padding;
      } else {
        x = me.left + tickAndPadding;

        if (crossAlign === 'near') {
          textAlign = 'left';
        } else if (crossAlign === 'center') {
          textAlign = 'center';
          x += widest / 2;
        } else {
          textAlign = 'right';
          x = me.right;
        }
      }
    } else {
      textAlign = 'right';
    }

    return {
      textAlign,
      x
    };
  }

  _computeLabelArea() {
    const me = this;

    if (me.options.ticks.mirror) {
      return;
    }

    const chart = me.chart;
    const position = me.options.position;

    if (position === 'left' || position === 'right') {
      return {
        top: 0,
        left: me.left,
        bottom: chart.height,
        right: me.right
      };
    }

    if (position === 'top' || position === 'bottom') {
      return {
        top: me.top,
        left: 0,
        bottom: me.bottom,
        right: chart.width
      };
    }
  }

  drawBackground() {
    const {
      ctx,
      options: {
        backgroundColor
      },
      left,
      top,
      width,
      height
    } = this;

    if (backgroundColor) {
      ctx.save();
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(left, top, width, height);
      ctx.restore();
    }
  }

  getLineWidthForValue(value) {
    const me = this;
    const grid = me.options.grid;

    if (!me._isVisible() || !grid.display) {
      return 0;
    }

    const ticks = me.ticks;
    const index = ticks.findIndex(t => t.value === value);

    if (index >= 0) {
      const opts = grid.setContext(me.getContext(index));
      return opts.lineWidth;
    }

    return 0;
  }

  drawGrid(chartArea) {
    const me = this;
    const grid = me.options.grid;
    const ctx = me.ctx;

    const items = me._gridLineItems || (me._gridLineItems = me._computeGridLineItems(chartArea));

    let i, ilen;

    const drawLine = (p1, p2, style) => {
      if (!style.width || !style.color) {
        return;
      }

      ctx.save();
      ctx.lineWidth = style.width;
      ctx.strokeStyle = style.color;
      ctx.setLineDash(style.borderDash || []);
      ctx.lineDashOffset = style.borderDashOffset;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
      ctx.restore();
    };

    if (grid.display) {
      for (i = 0, ilen = items.length; i < ilen; ++i) {
        const item = items[i];

        if (grid.drawOnChartArea) {
          drawLine({
            x: item.x1,
            y: item.y1
          }, {
            x: item.x2,
            y: item.y2
          }, item);
        }

        if (grid.drawTicks) {
          drawLine({
            x: item.tx1,
            y: item.ty1
          }, {
            x: item.tx2,
            y: item.ty2
          }, {
            color: item.tickColor,
            width: item.tickWidth,
            borderDash: item.tickBorderDash,
            borderDashOffset: item.tickBorderDashOffset
          });
        }
      }
    }
  }

  drawBorder() {
    const me = this;
    const {
      chart,
      ctx,
      options: {
        grid
      }
    } = me;
    const borderOpts = grid.setContext(me.getContext());
    const axisWidth = grid.drawBorder ? borderOpts.borderWidth : 0;

    if (!axisWidth) {
      return;
    }

    const lastLineWidth = grid.setContext(me.getContext(0)).lineWidth;
    const borderValue = me._borderValue;
    let x1, x2, y1, y2;

    if (me.isHorizontal()) {
      x1 = (0, _helpersSegment.U)(chart, me.left, axisWidth) - axisWidth / 2;
      x2 = (0, _helpersSegment.U)(chart, me.right, lastLineWidth) + lastLineWidth / 2;
      y1 = y2 = borderValue;
    } else {
      y1 = (0, _helpersSegment.U)(chart, me.top, axisWidth) - axisWidth / 2;
      y2 = (0, _helpersSegment.U)(chart, me.bottom, lastLineWidth) + lastLineWidth / 2;
      x1 = x2 = borderValue;
    }

    ctx.save();
    ctx.lineWidth = borderOpts.borderWidth;
    ctx.strokeStyle = borderOpts.borderColor;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }

  drawLabels(chartArea) {
    const me = this;
    const optionTicks = me.options.ticks;

    if (!optionTicks.display) {
      return;
    }

    const ctx = me.ctx;

    const area = me._computeLabelArea();

    if (area) {
      (0, _helpersSegment.k)(ctx, area);
    }

    const items = me._labelItems || (me._labelItems = me._computeLabelItems(chartArea));

    let i, ilen;

    for (i = 0, ilen = items.length; i < ilen; ++i) {
      const item = items[i];
      const tickFont = item.font;
      const label = item.label;

      if (item.backdrop) {
        ctx.fillStyle = item.backdrop.color;
        ctx.fillRect(item.backdrop.left, item.backdrop.top, item.backdrop.width, item.backdrop.height);
      }

      let y = item.textOffset;
      (0, _helpersSegment.V)(ctx, label, 0, y, tickFont, item);
    }

    if (area) {
      (0, _helpersSegment.m)(ctx);
    }
  }

  drawTitle() {
    const {
      ctx,
      options: {
        position,
        title,
        reverse
      }
    } = this;

    if (!title.display) {
      return;
    }

    const font = (0, _helpersSegment.W)(title.font);
    const padding = (0, _helpersSegment.C)(title.padding);
    const align = title.align;
    let offset = font.lineHeight / 2;

    if (position === 'bottom') {
      offset += padding.bottom;

      if ((0, _helpersSegment.b)(title.text)) {
        offset += font.lineHeight * (title.text.length - 1);
      }
    } else {
      offset += padding.top;
    }

    const {
      titleX,
      titleY,
      maxWidth,
      rotation
    } = titleArgs(this, offset, position, align);
    (0, _helpersSegment.V)(ctx, title.text, 0, 0, font, {
      color: title.color,
      maxWidth,
      rotation,
      textAlign: titleAlign(align, position, reverse),
      textBaseline: 'middle',
      translation: [titleX, titleY]
    });
  }

  draw(chartArea) {
    const me = this;

    if (!me._isVisible()) {
      return;
    }

    me.drawBackground();
    me.drawGrid(chartArea);
    me.drawBorder();
    me.drawTitle();
    me.drawLabels(chartArea);
  }

  _layers() {
    const me = this;
    const opts = me.options;
    const tz = opts.ticks && opts.ticks.z || 0;
    const gz = opts.grid && opts.grid.z || 0;

    if (!me._isVisible() || me.draw !== Scale.prototype.draw) {
      return [{
        z: tz,

        draw(chartArea) {
          me.draw(chartArea);
        }

      }];
    }

    return [{
      z: gz,

      draw(chartArea) {
        me.drawBackground();
        me.drawGrid(chartArea);
        me.drawTitle();
      }

    }, {
      z: gz + 1,

      draw() {
        me.drawBorder();
      }

    }, {
      z: tz,

      draw(chartArea) {
        me.drawLabels(chartArea);
      }

    }];
  }

  getMatchingVisibleMetas(type) {
    const me = this;
    const metas = me.chart.getSortedVisibleDatasetMetas();
    const axisID = me.axis + 'AxisID';
    const result = [];
    let i, ilen;

    for (i = 0, ilen = metas.length; i < ilen; ++i) {
      const meta = metas[i];

      if (meta[axisID] === me.id && (!type || meta.type === type)) {
        result.push(meta);
      }
    }

    return result;
  }

  _resolveTickFontOptions(index) {
    const opts = this.options.ticks.setContext(this.getContext(index));
    return (0, _helpersSegment.W)(opts.font);
  }

  _maxDigits() {
    const me = this;

    const fontSize = me._resolveTickFontOptions(0).lineHeight;

    return me.isHorizontal() ? me.width / fontSize / 0.7 : me.height / fontSize;
  }

}

exports.Scale = Scale;

class TypedRegistry {
  constructor(type, scope, override) {
    this.type = type;
    this.scope = scope;
    this.override = override;
    this.items = Object.create(null);
  }

  isForType(type) {
    return Object.prototype.isPrototypeOf.call(this.type.prototype, type.prototype);
  }

  register(item) {
    const me = this;
    const proto = Object.getPrototypeOf(item);
    let parentScope;

    if (isIChartComponent(proto)) {
      parentScope = me.register(proto);
    }

    const items = me.items;
    const id = item.id;
    const scope = me.scope + '.' + id;

    if (!id) {
      throw new Error('class does not have id: ' + item);
    }

    if (id in items) {
      return scope;
    }

    items[id] = item;
    registerDefaults(item, scope, parentScope);

    if (me.override) {
      _helpersSegment.d.override(item.id, item.overrides);
    }

    return scope;
  }

  get(id) {
    return this.items[id];
  }

  unregister(item) {
    const items = this.items;
    const id = item.id;
    const scope = this.scope;

    if (id in items) {
      delete items[id];
    }

    if (scope && id in _helpersSegment.d[scope]) {
      delete _helpersSegment.d[scope][id];

      if (this.override) {
        delete _helpersSegment.Z[id];
      }
    }
  }

}

function registerDefaults(item, scope, parentScope) {
  const itemDefaults = (0, _helpersSegment.$)(Object.create(null), [parentScope ? _helpersSegment.d.get(parentScope) : {}, _helpersSegment.d.get(scope), item.defaults]);

  _helpersSegment.d.set(scope, itemDefaults);

  if (item.defaultRoutes) {
    routeDefaults(scope, item.defaultRoutes);
  }

  if (item.descriptors) {
    _helpersSegment.d.describe(scope, item.descriptors);
  }
}

function routeDefaults(scope, routes) {
  Object.keys(routes).forEach(property => {
    const propertyParts = property.split('.');
    const sourceName = propertyParts.pop();
    const sourceScope = [scope].concat(propertyParts).join('.');
    const parts = routes[property].split('.');
    const targetName = parts.pop();
    const targetScope = parts.join('.');

    _helpersSegment.d.route(sourceScope, sourceName, targetScope, targetName);
  });
}

function isIChartComponent(proto) {
  return 'id' in proto && 'defaults' in proto;
}

class Registry {
  constructor() {
    this.controllers = new TypedRegistry(DatasetController, 'datasets', true);
    this.elements = new TypedRegistry(Element, 'elements');
    this.plugins = new TypedRegistry(Object, 'plugins');
    this.scales = new TypedRegistry(Scale, 'scales');
    this._typedRegistries = [this.controllers, this.scales, this.elements];
  }

  add(...args) {
    this._each('register', args);
  }

  remove(...args) {
    this._each('unregister', args);
  }

  addControllers(...args) {
    this._each('register', args, this.controllers);
  }

  addElements(...args) {
    this._each('register', args, this.elements);
  }

  addPlugins(...args) {
    this._each('register', args, this.plugins);
  }

  addScales(...args) {
    this._each('register', args, this.scales);
  }

  getController(id) {
    return this._get(id, this.controllers, 'controller');
  }

  getElement(id) {
    return this._get(id, this.elements, 'element');
  }

  getPlugin(id) {
    return this._get(id, this.plugins, 'plugin');
  }

  getScale(id) {
    return this._get(id, this.scales, 'scale');
  }

  removeControllers(...args) {
    this._each('unregister', args, this.controllers);
  }

  removeElements(...args) {
    this._each('unregister', args, this.elements);
  }

  removePlugins(...args) {
    this._each('unregister', args, this.plugins);
  }

  removeScales(...args) {
    this._each('unregister', args, this.scales);
  }

  _each(method, args, typedRegistry) {
    const me = this;
    [...args].forEach(arg => {
      const reg = typedRegistry || me._getRegistryForType(arg);

      if (typedRegistry || reg.isForType(arg) || reg === me.plugins && arg.id) {
        me._exec(method, reg, arg);
      } else {
        (0, _helpersSegment.D)(arg, item => {
          const itemReg = typedRegistry || me._getRegistryForType(item);

          me._exec(method, itemReg, item);
        });
      }
    });
  }

  _exec(method, registry, component) {
    const camelMethod = (0, _helpersSegment.a0)(method);
    (0, _helpersSegment.N)(component['before' + camelMethod], [], component);
    registry[method](component);
    (0, _helpersSegment.N)(component['after' + camelMethod], [], component);
  }

  _getRegistryForType(type) {
    for (let i = 0; i < this._typedRegistries.length; i++) {
      const reg = this._typedRegistries[i];

      if (reg.isForType(type)) {
        return reg;
      }
    }

    return this.plugins;
  }

  _get(id, typedRegistry, type) {
    const item = typedRegistry.get(id);

    if (item === undefined) {
      throw new Error('"' + id + '" is not a registered ' + type + '.');
    }

    return item;
  }

}

var registry = new Registry();
exports.registry = registry;

class PluginService {
  constructor() {
    this._init = [];
  }

  notify(chart, hook, args, filter) {
    const me = this;

    if (hook === 'beforeInit') {
      me._init = me._createDescriptors(chart, true);

      me._notify(me._init, chart, 'install');
    }

    const descriptors = filter ? me._descriptors(chart).filter(filter) : me._descriptors(chart);

    const result = me._notify(descriptors, chart, hook, args);

    if (hook === 'destroy') {
      me._notify(descriptors, chart, 'stop');

      me._notify(me._init, chart, 'uninstall');
    }

    return result;
  }

  _notify(descriptors, chart, hook, args) {
    args = args || {};

    for (const descriptor of descriptors) {
      const plugin = descriptor.plugin;
      const method = plugin[hook];
      const params = [chart, args, descriptor.options];

      if ((0, _helpersSegment.N)(method, params, plugin) === false && args.cancelable) {
        return false;
      }
    }

    return true;
  }

  invalidate() {
    if (!(0, _helpersSegment.j)(this._cache)) {
      this._oldCache = this._cache;
      this._cache = undefined;
    }
  }

  _descriptors(chart) {
    if (this._cache) {
      return this._cache;
    }

    const descriptors = this._cache = this._createDescriptors(chart);

    this._notifyStateChanges(chart);

    return descriptors;
  }

  _createDescriptors(chart, all) {
    const config = chart && chart.config;
    const options = (0, _helpersSegment.v)(config.options && config.options.plugins, {});
    const plugins = allPlugins(config);
    return options === false && !all ? [] : createDescriptors(chart, plugins, options, all);
  }

  _notifyStateChanges(chart) {
    const previousDescriptors = this._oldCache || [];
    const descriptors = this._cache;

    const diff = (a, b) => a.filter(x => !b.some(y => x.plugin.id === y.plugin.id));

    this._notify(diff(previousDescriptors, descriptors), chart, 'stop');

    this._notify(diff(descriptors, previousDescriptors), chart, 'start');
  }

}

function allPlugins(config) {
  const plugins = [];
  const keys = Object.keys(registry.plugins.items);

  for (let i = 0; i < keys.length; i++) {
    plugins.push(registry.getPlugin(keys[i]));
  }

  const local = config.plugins || [];

  for (let i = 0; i < local.length; i++) {
    const plugin = local[i];

    if (plugins.indexOf(plugin) === -1) {
      plugins.push(plugin);
    }
  }

  return plugins;
}

function getOpts(options, all) {
  if (!all && options === false) {
    return null;
  }

  if (options === true) {
    return {};
  }

  return options;
}

function createDescriptors(chart, plugins, options, all) {
  const result = [];
  const context = chart.getContext();

  for (let i = 0; i < plugins.length; i++) {
    const plugin = plugins[i];
    const id = plugin.id;
    const opts = getOpts(options[id], all);

    if (opts === null) {
      continue;
    }

    result.push({
      plugin,
      options: pluginOpts(chart.config, plugin, opts, context)
    });
  }

  return result;
}

function pluginOpts(config, plugin, opts, context) {
  const keys = config.pluginScopeKeys(plugin);
  const scopes = config.getOptionScopes(opts, keys);
  return config.createResolver(scopes, context, [''], {
    scriptable: false,
    indexable: false,
    allKeys: true
  });
}

function getIndexAxis(type, options) {
  const datasetDefaults = _helpersSegment.d.datasets[type] || {};
  const datasetOptions = (options.datasets || {})[type] || {};
  return datasetOptions.indexAxis || options.indexAxis || datasetDefaults.indexAxis || 'x';
}

function getAxisFromDefaultScaleID(id, indexAxis) {
  let axis = id;

  if (id === '_index_') {
    axis = indexAxis;
  } else if (id === '_value_') {
    axis = indexAxis === 'x' ? 'y' : 'x';
  }

  return axis;
}

function getDefaultScaleIDFromAxis(axis, indexAxis) {
  return axis === indexAxis ? '_index_' : '_value_';
}

function axisFromPosition(position) {
  if (position === 'top' || position === 'bottom') {
    return 'x';
  }

  if (position === 'left' || position === 'right') {
    return 'y';
  }
}

function determineAxis(id, scaleOptions) {
  if (id === 'x' || id === 'y') {
    return id;
  }

  return scaleOptions.axis || axisFromPosition(scaleOptions.position) || id.charAt(0).toLowerCase();
}

function mergeScaleConfig(config, options) {
  const chartDefaults = _helpersSegment.Z[config.type] || {
    scales: {}
  };
  const configScales = options.scales || {};
  const chartIndexAxis = getIndexAxis(config.type, options);
  const firstIDs = Object.create(null);
  const scales = Object.create(null);
  Object.keys(configScales).forEach(id => {
    const scaleConf = configScales[id];
    const axis = determineAxis(id, scaleConf);
    const defaultId = getDefaultScaleIDFromAxis(axis, chartIndexAxis);
    const defaultScaleOptions = chartDefaults.scales || {};
    firstIDs[axis] = firstIDs[axis] || id;
    scales[id] = (0, _helpersSegment.a6)(Object.create(null), [{
      axis
    }, scaleConf, defaultScaleOptions[axis], defaultScaleOptions[defaultId]]);
  });
  config.data.datasets.forEach(dataset => {
    const type = dataset.type || config.type;
    const indexAxis = dataset.indexAxis || getIndexAxis(type, options);
    const datasetDefaults = _helpersSegment.Z[type] || {};
    const defaultScaleOptions = datasetDefaults.scales || {};
    Object.keys(defaultScaleOptions).forEach(defaultID => {
      const axis = getAxisFromDefaultScaleID(defaultID, indexAxis);
      const id = dataset[axis + 'AxisID'] || firstIDs[axis] || axis;
      scales[id] = scales[id] || Object.create(null);
      (0, _helpersSegment.a6)(scales[id], [{
        axis
      }, configScales[id], defaultScaleOptions[defaultID]]);
    });
  });
  Object.keys(scales).forEach(key => {
    const scale = scales[key];
    (0, _helpersSegment.a6)(scale, [_helpersSegment.d.scales[scale.type], _helpersSegment.d.scale]);
  });
  return scales;
}

function initOptions(config) {
  const options = config.options || (config.options = {});
  options.plugins = (0, _helpersSegment.v)(options.plugins, {});
  options.scales = mergeScaleConfig(config, options);
}

function initData(data) {
  data = data || {};
  data.datasets = data.datasets || [];
  data.labels = data.labels || [];
  return data;
}

function initConfig(config) {
  config = config || {};
  config.data = initData(config.data);
  initOptions(config);
  return config;
}

const keyCache = new Map();
const keysCached = new Set();

function cachedKeys(cacheKey, generate) {
  let keys = keyCache.get(cacheKey);

  if (!keys) {
    keys = generate();
    keyCache.set(cacheKey, keys);
    keysCached.add(keys);
  }

  return keys;
}

const addIfFound = (set, obj, key) => {
  const opts = (0, _helpersSegment.f)(obj, key);

  if (opts !== undefined) {
    set.add(opts);
  }
};

class Config {
  constructor(config) {
    this._config = initConfig(config);
    this._scopeCache = new Map();
    this._resolverCache = new Map();
  }

  get type() {
    return this._config.type;
  }

  set type(type) {
    this._config.type = type;
  }

  get data() {
    return this._config.data;
  }

  set data(data) {
    this._config.data = initData(data);
  }

  get options() {
    return this._config.options;
  }

  set options(options) {
    this._config.options = options;
  }

  get plugins() {
    return this._config.plugins;
  }

  update() {
    const config = this._config;
    this.clearCache();
    initOptions(config);
  }

  clearCache() {
    this._scopeCache.clear();

    this._resolverCache.clear();
  }

  datasetScopeKeys(datasetType) {
    return cachedKeys(datasetType, () => [[`datasets.${datasetType}`, '']]);
  }

  datasetAnimationScopeKeys(datasetType, transition) {
    return cachedKeys(`${datasetType}.transition.${transition}`, () => [[`datasets.${datasetType}.transitions.${transition}`, `transitions.${transition}`], [`datasets.${datasetType}`, '']]);
  }

  datasetElementScopeKeys(datasetType, elementType) {
    return cachedKeys(`${datasetType}-${elementType}`, () => [[`datasets.${datasetType}.elements.${elementType}`, `datasets.${datasetType}`, `elements.${elementType}`, '']]);
  }

  pluginScopeKeys(plugin) {
    const id = plugin.id;
    const type = this.type;
    return cachedKeys(`${type}-plugin-${id}`, () => [[`plugins.${id}`, ...(plugin.additionalOptionScopes || [])]]);
  }

  _cachedScopes(mainScope, resetCache) {
    const _scopeCache = this._scopeCache;

    let cache = _scopeCache.get(mainScope);

    if (!cache || resetCache) {
      cache = new Map();

      _scopeCache.set(mainScope, cache);
    }

    return cache;
  }

  getOptionScopes(mainScope, keyLists, resetCache) {
    const {
      options,
      type
    } = this;

    const cache = this._cachedScopes(mainScope, resetCache);

    const cached = cache.get(keyLists);

    if (cached) {
      return cached;
    }

    const scopes = new Set();
    keyLists.forEach(keys => {
      if (mainScope) {
        scopes.add(mainScope);
        keys.forEach(key => addIfFound(scopes, mainScope, key));
      }

      keys.forEach(key => addIfFound(scopes, options, key));
      keys.forEach(key => addIfFound(scopes, _helpersSegment.Z[type] || {}, key));
      keys.forEach(key => addIfFound(scopes, _helpersSegment.d, key));
      keys.forEach(key => addIfFound(scopes, _helpersSegment.a1, key));
    });
    const array = [...scopes];

    if (keysCached.has(keyLists)) {
      cache.set(keyLists, array);
    }

    return array;
  }

  chartOptionScopes() {
    const {
      options,
      type
    } = this;
    return [options, _helpersSegment.Z[type] || {}, _helpersSegment.d.datasets[type] || {}, {
      type
    }, _helpersSegment.d, _helpersSegment.a1];
  }

  resolveNamedOptions(scopes, names, context, prefixes = ['']) {
    const result = {
      $shared: true
    };
    const {
      resolver,
      subPrefixes
    } = getResolver(this._resolverCache, scopes, prefixes);
    let options = resolver;

    if (needContext(resolver, names)) {
      result.$shared = false;
      context = (0, _helpersSegment.a2)(context) ? context() : context;
      const subResolver = this.createResolver(scopes, context, subPrefixes);
      options = (0, _helpersSegment.a3)(resolver, context, subResolver);
    }

    for (const prop of names) {
      result[prop] = options[prop];
    }

    return result;
  }

  createResolver(scopes, context, prefixes = [''], descriptorDefaults) {
    const {
      resolver
    } = getResolver(this._resolverCache, scopes, prefixes);
    return (0, _helpersSegment.i)(context) ? (0, _helpersSegment.a3)(resolver, context, undefined, descriptorDefaults) : resolver;
  }

}

function getResolver(resolverCache, scopes, prefixes) {
  let cache = resolverCache.get(scopes);

  if (!cache) {
    cache = new Map();
    resolverCache.set(scopes, cache);
  }

  const cacheKey = prefixes.join();
  let cached = cache.get(cacheKey);

  if (!cached) {
    const resolver = (0, _helpersSegment.a4)(scopes, prefixes);
    cached = {
      resolver,
      subPrefixes: prefixes.filter(p => !p.toLowerCase().includes('hover'))
    };
    cache.set(cacheKey, cached);
  }

  return cached;
}

function needContext(proxy, names) {
  const {
    isScriptable,
    isIndexable
  } = (0, _helpersSegment.a5)(proxy);

  for (const prop of names) {
    if (isScriptable(prop) && (0, _helpersSegment.a2)(proxy[prop]) || isIndexable(prop) && (0, _helpersSegment.b)(proxy[prop])) {
      return true;
    }
  }

  return false;
}

var version = "3.2.1";
const KNOWN_POSITIONS = ['top', 'bottom', 'left', 'right', 'chartArea'];

function positionIsHorizontal(position, axis) {
  return position === 'top' || position === 'bottom' || KNOWN_POSITIONS.indexOf(position) === -1 && axis === 'x';
}

function compare2Level(l1, l2) {
  return function (a, b) {
    return a[l1] === b[l1] ? a[l2] - b[l2] : a[l1] - b[l1];
  };
}

function onAnimationsComplete(context) {
  const chart = context.chart;
  const animationOptions = chart.options.animation;
  chart.notifyPlugins('afterRender');
  (0, _helpersSegment.N)(animationOptions && animationOptions.onComplete, [context], chart);
}

function onAnimationProgress(context) {
  const chart = context.chart;
  const animationOptions = chart.options.animation;
  (0, _helpersSegment.N)(animationOptions && animationOptions.onProgress, [context], chart);
}

function isDomSupported() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function getCanvas(item) {
  if (isDomSupported() && typeof item === 'string') {
    item = document.getElementById(item);
  } else if (item && item.length) {
    item = item[0];
  }

  if (item && item.canvas) {
    item = item.canvas;
  }

  return item;
}

const instances = {};

const getChart = key => {
  const canvas = getCanvas(key);
  return Object.values(instances).filter(c => c.canvas === canvas).pop();
};

class Chart {
  constructor(item, config) {
    const me = this;
    this.config = config = new Config(config);
    const initialCanvas = getCanvas(item);
    const existingChart = getChart(initialCanvas);

    if (existingChart) {
      throw new Error('Canvas is already in use. Chart with ID \'' + existingChart.id + '\'' + ' must be destroyed before the canvas can be reused.');
    }

    const options = config.createResolver(config.chartOptionScopes(), me.getContext());
    this.platform = me._initializePlatform(initialCanvas, config);
    const context = me.platform.acquireContext(initialCanvas, options.aspectRatio);
    const canvas = context && context.canvas;
    const height = canvas && canvas.height;
    const width = canvas && canvas.width;
    this.id = (0, _helpersSegment.a7)();
    this.ctx = context;
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this._options = options;
    this._aspectRatio = this.aspectRatio;
    this._layers = [];
    this._metasets = [];
    this._stacks = undefined;
    this.boxes = [];
    this.currentDevicePixelRatio = undefined;
    this.chartArea = undefined;
    this._active = [];
    this._lastEvent = undefined;
    this._listeners = {};
    this._sortedMetasets = [];
    this.scales = {};
    this.scale = undefined;
    this._plugins = new PluginService();
    this.$proxies = {};
    this._hiddenIndices = {};
    this.attached = false;
    this._animationsDisabled = undefined;
    this.$context = undefined;
    this._doResize = (0, _helpersSegment.a8)(() => this.update('resize'), options.resizeDelay || 0);
    instances[me.id] = me;

    if (!context || !canvas) {
      console.error("Failed to create chart: can't acquire context from the given item");
      return;
    }

    animator.listen(me, 'complete', onAnimationsComplete);
    animator.listen(me, 'progress', onAnimationProgress);

    me._initialize();

    if (me.attached) {
      me.update();
    }
  }

  get aspectRatio() {
    const {
      options: {
        aspectRatio,
        maintainAspectRatio
      },
      width,
      height,
      _aspectRatio
    } = this;

    if (!(0, _helpersSegment.j)(aspectRatio)) {
      return aspectRatio;
    }

    if (maintainAspectRatio && _aspectRatio) {
      return _aspectRatio;
    }

    return height ? width / height : null;
  }

  get data() {
    return this.config.data;
  }

  set data(data) {
    this.config.data = data;
  }

  get options() {
    return this._options;
  }

  set options(options) {
    this.config.options = options;
  }

  _initialize() {
    const me = this;
    me.notifyPlugins('beforeInit');

    if (me.options.responsive) {
      me.resize();
    } else {
      (0, _helpersSegment.a9)(me, me.options.devicePixelRatio);
    }

    me.bindEvents();
    me.notifyPlugins('afterInit');
    return me;
  }

  _initializePlatform(canvas, config) {
    if (config.platform) {
      return new config.platform();
    } else if (!isDomSupported() || typeof OffscreenCanvas !== 'undefined' && canvas instanceof OffscreenCanvas) {
      return new BasicPlatform();
    }

    return new DomPlatform();
  }

  clear() {
    (0, _helpersSegment.aa)(this.canvas, this.ctx);
    return this;
  }

  stop() {
    animator.stop(this);
    return this;
  }

  resize(width, height) {
    if (!animator.running(this)) {
      this._resize(width, height);
    } else {
      this._resizeBeforeDraw = {
        width,
        height
      };
    }
  }

  _resize(width, height) {
    const me = this;
    const options = me.options;
    const canvas = me.canvas;
    const aspectRatio = options.maintainAspectRatio && me.aspectRatio;
    const newSize = me.platform.getMaximumSize(canvas, width, height, aspectRatio);
    const oldRatio = me.currentDevicePixelRatio;
    const newRatio = options.devicePixelRatio || me.platform.getDevicePixelRatio();

    if (me.width === newSize.width && me.height === newSize.height && oldRatio === newRatio) {
      return;
    }

    me.width = newSize.width;
    me.height = newSize.height;
    me._aspectRatio = me.aspectRatio;
    (0, _helpersSegment.a9)(me, newRatio, true);
    me.notifyPlugins('resize', {
      size: newSize
    });
    (0, _helpersSegment.N)(options.onResize, [me, newSize], me);

    if (me.attached) {
      if (me._doResize()) {
        me.render();
      }
    }
  }

  ensureScalesHaveIDs() {
    const options = this.options;
    const scalesOptions = options.scales || {};
    (0, _helpersSegment.D)(scalesOptions, (axisOptions, axisID) => {
      axisOptions.id = axisID;
    });
  }

  buildOrUpdateScales() {
    const me = this;
    const options = me.options;
    const scaleOpts = options.scales;
    const scales = me.scales;
    const updated = Object.keys(scales).reduce((obj, id) => {
      obj[id] = false;
      return obj;
    }, {});
    let items = [];

    if (scaleOpts) {
      items = items.concat(Object.keys(scaleOpts).map(id => {
        const scaleOptions = scaleOpts[id];
        const axis = determineAxis(id, scaleOptions);
        const isRadial = axis === 'r';
        const isHorizontal = axis === 'x';
        return {
          options: scaleOptions,
          dposition: isRadial ? 'chartArea' : isHorizontal ? 'bottom' : 'left',
          dtype: isRadial ? 'radialLinear' : isHorizontal ? 'category' : 'linear'
        };
      }));
    }

    (0, _helpersSegment.D)(items, item => {
      const scaleOptions = item.options;
      const id = scaleOptions.id;
      const axis = determineAxis(id, scaleOptions);
      const scaleType = (0, _helpersSegment.v)(scaleOptions.type, item.dtype);

      if (scaleOptions.position === undefined || positionIsHorizontal(scaleOptions.position, axis) !== positionIsHorizontal(item.dposition)) {
        scaleOptions.position = item.dposition;
      }

      updated[id] = true;
      let scale = null;

      if (id in scales && scales[id].type === scaleType) {
        scale = scales[id];
      } else {
        const scaleClass = registry.getScale(scaleType);
        scale = new scaleClass({
          id,
          type: scaleType,
          ctx: me.ctx,
          chart: me
        });
        scales[scale.id] = scale;
      }

      scale.init(scaleOptions, options);
    });
    (0, _helpersSegment.D)(updated, (hasUpdated, id) => {
      if (!hasUpdated) {
        delete scales[id];
      }
    });
    (0, _helpersSegment.D)(scales, scale => {
      layouts.configure(me, scale, scale.options);
      layouts.addBox(me, scale);
    });
  }

  _updateMetasetIndex(meta, index) {
    const metasets = this._metasets;
    const oldIndex = meta.index;

    if (oldIndex !== index) {
      metasets[oldIndex] = metasets[index];
      metasets[index] = meta;
      meta.index = index;
    }
  }

  _updateMetasets() {
    const me = this;
    const metasets = me._metasets;
    const numData = me.data.datasets.length;
    const numMeta = metasets.length;

    if (numMeta > numData) {
      for (let i = numData; i < numMeta; ++i) {
        me._destroyDatasetMeta(i);
      }

      metasets.splice(numData, numMeta - numData);
    }

    me._sortedMetasets = metasets.slice(0).sort(compare2Level('order', 'index'));
  }

  _removeUnreferencedMetasets() {
    const me = this;
    const {
      _metasets: metasets,
      data: {
        datasets
      }
    } = me;

    if (metasets.length > datasets.length) {
      delete me._stacks;
    }

    metasets.forEach((meta, index) => {
      if (datasets.filter(x => x === meta._dataset).length === 0) {
        me._destroyDatasetMeta(index);
      }
    });
  }

  buildOrUpdateControllers() {
    const me = this;
    const newControllers = [];
    const datasets = me.data.datasets;
    let i, ilen;

    me._removeUnreferencedMetasets();

    for (i = 0, ilen = datasets.length; i < ilen; i++) {
      const dataset = datasets[i];
      let meta = me.getDatasetMeta(i);
      const type = dataset.type || me.config.type;

      if (meta.type && meta.type !== type) {
        me._destroyDatasetMeta(i);

        meta = me.getDatasetMeta(i);
      }

      meta.type = type;
      meta.indexAxis = dataset.indexAxis || getIndexAxis(type, me.options);
      meta.order = dataset.order || 0;

      me._updateMetasetIndex(meta, i);

      meta.label = '' + dataset.label;
      meta.visible = me.isDatasetVisible(i);

      if (meta.controller) {
        meta.controller.updateIndex(i);
        meta.controller.linkScales();
      } else {
        const ControllerClass = registry.getController(type);
        const {
          datasetElementType,
          dataElementType
        } = _helpersSegment.d.datasets[type];
        Object.assign(ControllerClass.prototype, {
          dataElementType: registry.getElement(dataElementType),
          datasetElementType: datasetElementType && registry.getElement(datasetElementType)
        });
        meta.controller = new ControllerClass(me, i);
        newControllers.push(meta.controller);
      }
    }

    me._updateMetasets();

    return newControllers;
  }

  _resetElements() {
    const me = this;
    (0, _helpersSegment.D)(me.data.datasets, (dataset, datasetIndex) => {
      me.getDatasetMeta(datasetIndex).controller.reset();
    }, me);
  }

  reset() {
    this._resetElements();

    this.notifyPlugins('reset');
  }

  update(mode) {
    const me = this;
    const config = me.config;
    config.update();
    me._options = config.createResolver(config.chartOptionScopes(), me.getContext());
    (0, _helpersSegment.D)(me.scales, scale => {
      layouts.removeBox(me, scale);
    });
    const animsDisabled = me._animationsDisabled = !me.options.animation;
    me.ensureScalesHaveIDs();
    me.buildOrUpdateScales();
    const existingEvents = new Set(Object.keys(me._listeners));
    const newEvents = new Set(me.options.events);

    if (!(0, _helpersSegment.ab)(existingEvents, newEvents)) {
      me.unbindEvents();
      me.bindEvents();
    }

    me._plugins.invalidate();

    if (me.notifyPlugins('beforeUpdate', {
      mode,
      cancelable: true
    }) === false) {
      return;
    }

    const newControllers = me.buildOrUpdateControllers();
    me.notifyPlugins('beforeElementsUpdate');
    let minPadding = 0;

    for (let i = 0, ilen = me.data.datasets.length; i < ilen; i++) {
      const {
        controller
      } = me.getDatasetMeta(i);
      const reset = !animsDisabled && newControllers.indexOf(controller) === -1;
      controller.buildOrUpdateElements(reset);
      minPadding = Math.max(+controller.getMaxOverflow(), minPadding);
    }

    me._minPadding = minPadding;

    me._updateLayout(minPadding);

    if (!animsDisabled) {
      (0, _helpersSegment.D)(newControllers, controller => {
        controller.reset();
      });
    }

    me._updateDatasets(mode);

    me.notifyPlugins('afterUpdate', {
      mode
    });

    me._layers.sort(compare2Level('z', '_idx'));

    if (me._lastEvent) {
      me._eventHandler(me._lastEvent, true);
    }

    me.render();
  }

  _updateLayout(minPadding) {
    const me = this;

    if (me.notifyPlugins('beforeLayout', {
      cancelable: true
    }) === false) {
      return;
    }

    layouts.update(me, me.width, me.height, minPadding);
    const area = me.chartArea;
    const noArea = area.width <= 0 || area.height <= 0;
    me._layers = [];
    (0, _helpersSegment.D)(me.boxes, box => {
      if (noArea && box.position === 'chartArea') {
        return;
      }

      if (box.configure) {
        box.configure();
      }

      me._layers.push(...box._layers());
    }, me);

    me._layers.forEach((item, index) => {
      item._idx = index;
    });

    me.notifyPlugins('afterLayout');
  }

  _updateDatasets(mode) {
    const me = this;
    const isFunction = typeof mode === 'function';

    if (me.notifyPlugins('beforeDatasetsUpdate', {
      mode,
      cancelable: true
    }) === false) {
      return;
    }

    for (let i = 0, ilen = me.data.datasets.length; i < ilen; ++i) {
      me._updateDataset(i, isFunction ? mode({
        datasetIndex: i
      }) : mode);
    }

    me.notifyPlugins('afterDatasetsUpdate', {
      mode
    });
  }

  _updateDataset(index, mode) {
    const me = this;
    const meta = me.getDatasetMeta(index);
    const args = {
      meta,
      index,
      mode,
      cancelable: true
    };

    if (me.notifyPlugins('beforeDatasetUpdate', args) === false) {
      return;
    }

    meta.controller._update(mode);

    args.cancelable = false;
    me.notifyPlugins('afterDatasetUpdate', args);
  }

  render() {
    const me = this;

    if (me.notifyPlugins('beforeRender', {
      cancelable: true
    }) === false) {
      return;
    }

    if (animator.has(me)) {
      if (me.attached && !animator.running(me)) {
        animator.start(me);
      }
    } else {
      me.draw();
      onAnimationsComplete({
        chart: me
      });
    }
  }

  draw() {
    const me = this;
    let i;

    if (me._resizeBeforeDraw) {
      const {
        width,
        height
      } = me._resizeBeforeDraw;

      me._resize(width, height);

      me._resizeBeforeDraw = null;
    }

    me.clear();

    if (me.width <= 0 || me.height <= 0) {
      return;
    }

    if (me.notifyPlugins('beforeDraw', {
      cancelable: true
    }) === false) {
      return;
    }

    const layers = me._layers;

    for (i = 0; i < layers.length && layers[i].z <= 0; ++i) {
      layers[i].draw(me.chartArea);
    }

    me._drawDatasets();

    for (; i < layers.length; ++i) {
      layers[i].draw(me.chartArea);
    }

    me.notifyPlugins('afterDraw');
  }

  _getSortedDatasetMetas(filterVisible) {
    const me = this;
    const metasets = me._sortedMetasets;
    const result = [];
    let i, ilen;

    for (i = 0, ilen = metasets.length; i < ilen; ++i) {
      const meta = metasets[i];

      if (!filterVisible || meta.visible) {
        result.push(meta);
      }
    }

    return result;
  }

  getSortedVisibleDatasetMetas() {
    return this._getSortedDatasetMetas(true);
  }

  _drawDatasets() {
    const me = this;

    if (me.notifyPlugins('beforeDatasetsDraw', {
      cancelable: true
    }) === false) {
      return;
    }

    const metasets = me.getSortedVisibleDatasetMetas();

    for (let i = metasets.length - 1; i >= 0; --i) {
      me._drawDataset(metasets[i]);
    }

    me.notifyPlugins('afterDatasetsDraw');
  }

  _drawDataset(meta) {
    const me = this;
    const ctx = me.ctx;
    const clip = meta._clip;
    const area = me.chartArea;
    const args = {
      meta,
      index: meta.index,
      cancelable: true
    };

    if (me.notifyPlugins('beforeDatasetDraw', args) === false) {
      return;
    }

    (0, _helpersSegment.k)(ctx, {
      left: clip.left === false ? 0 : area.left - clip.left,
      right: clip.right === false ? me.width : area.right + clip.right,
      top: clip.top === false ? 0 : area.top - clip.top,
      bottom: clip.bottom === false ? me.height : area.bottom + clip.bottom
    });
    meta.controller.draw();
    (0, _helpersSegment.m)(ctx);
    args.cancelable = false;
    me.notifyPlugins('afterDatasetDraw', args);
  }

  getElementsAtEventForMode(e, mode, options, useFinalPosition) {
    const method = Interaction.modes[mode];

    if (typeof method === 'function') {
      return method(this, e, options, useFinalPosition);
    }

    return [];
  }

  getDatasetMeta(datasetIndex) {
    const me = this;
    const dataset = me.data.datasets[datasetIndex];
    const metasets = me._metasets;
    let meta = metasets.filter(x => x && x._dataset === dataset).pop();

    if (!meta) {
      meta = metasets[datasetIndex] = {
        type: null,
        data: [],
        dataset: null,
        controller: null,
        hidden: null,
        xAxisID: null,
        yAxisID: null,
        order: dataset && dataset.order || 0,
        index: datasetIndex,
        _dataset: dataset,
        _parsed: [],
        _sorted: false
      };
    }

    return meta;
  }

  getContext() {
    return this.$context || (this.$context = {
      chart: this,
      type: 'chart'
    });
  }

  getVisibleDatasetCount() {
    return this.getSortedVisibleDatasetMetas().length;
  }

  isDatasetVisible(datasetIndex) {
    const dataset = this.data.datasets[datasetIndex];

    if (!dataset) {
      return false;
    }

    const meta = this.getDatasetMeta(datasetIndex);
    return typeof meta.hidden === 'boolean' ? !meta.hidden : !dataset.hidden;
  }

  setDatasetVisibility(datasetIndex, visible) {
    const meta = this.getDatasetMeta(datasetIndex);
    meta.hidden = !visible;
  }

  toggleDataVisibility(index) {
    this._hiddenIndices[index] = !this._hiddenIndices[index];
  }

  getDataVisibility(index) {
    return !this._hiddenIndices[index];
  }

  _updateDatasetVisibility(datasetIndex, visible) {
    const me = this;
    const mode = visible ? 'show' : 'hide';
    const meta = me.getDatasetMeta(datasetIndex);

    const anims = meta.controller._resolveAnimations(undefined, mode);

    me.setDatasetVisibility(datasetIndex, visible);
    anims.update(meta, {
      visible
    });
    me.update(ctx => ctx.datasetIndex === datasetIndex ? mode : undefined);
  }

  hide(datasetIndex) {
    this._updateDatasetVisibility(datasetIndex, false);
  }

  show(datasetIndex) {
    this._updateDatasetVisibility(datasetIndex, true);
  }

  _destroyDatasetMeta(datasetIndex) {
    const me = this;
    const meta = me._metasets && me._metasets[datasetIndex];

    if (meta && meta.controller) {
      meta.controller._destroy();

      delete me._metasets[datasetIndex];
    }
  }

  destroy() {
    const me = this;
    const {
      canvas,
      ctx
    } = me;
    let i, ilen;
    me.stop();
    animator.remove(me);

    for (i = 0, ilen = me.data.datasets.length; i < ilen; ++i) {
      me._destroyDatasetMeta(i);
    }

    me.config.clearCache();

    if (canvas) {
      me.unbindEvents();
      (0, _helpersSegment.aa)(canvas, ctx);
      me.platform.releaseContext(ctx);
      me.canvas = null;
      me.ctx = null;
    }

    me.notifyPlugins('destroy');
    delete instances[me.id];
  }

  toBase64Image(...args) {
    return this.canvas.toDataURL(...args);
  }

  bindEvents() {
    const me = this;
    const listeners = me._listeners;
    const platform = me.platform;

    const _add = (type, listener) => {
      platform.addEventListener(me, type, listener);
      listeners[type] = listener;
    };

    const _remove = (type, listener) => {
      if (listeners[type]) {
        platform.removeEventListener(me, type, listener);
        delete listeners[type];
      }
    };

    let listener = function (e, x, y) {
      e.offsetX = x;
      e.offsetY = y;

      me._eventHandler(e);
    };

    (0, _helpersSegment.D)(me.options.events, type => _add(type, listener));

    if (me.options.responsive) {
      listener = (width, height) => {
        if (me.canvas) {
          me.resize(width, height);
        }
      };

      let detached;

      const attached = () => {
        _remove('attach', attached);

        me.attached = true;
        me.resize();

        _add('resize', listener);

        _add('detach', detached);
      };

      detached = () => {
        me.attached = false;

        _remove('resize', listener);

        _add('attach', attached);
      };

      if (platform.isAttached(me.canvas)) {
        attached();
      } else {
        detached();
      }
    } else {
      me.attached = true;
    }
  }

  unbindEvents() {
    const me = this;
    const listeners = me._listeners;

    if (!listeners) {
      return;
    }

    me._listeners = {};
    (0, _helpersSegment.D)(listeners, (listener, type) => {
      me.platform.removeEventListener(me, type, listener);
    });
  }

  updateHoverStyle(items, mode, enabled) {
    const prefix = enabled ? 'set' : 'remove';
    let meta, item, i, ilen;

    if (mode === 'dataset') {
      meta = this.getDatasetMeta(items[0].datasetIndex);
      meta.controller['_' + prefix + 'DatasetHoverStyle']();
    }

    for (i = 0, ilen = items.length; i < ilen; ++i) {
      item = items[i];
      const controller = item && this.getDatasetMeta(item.datasetIndex).controller;

      if (controller) {
        controller[prefix + 'HoverStyle'](item.element, item.datasetIndex, item.index);
      }
    }
  }

  getActiveElements() {
    return this._active || [];
  }

  setActiveElements(activeElements) {
    const me = this;
    const lastActive = me._active || [];
    const active = activeElements.map(({
      datasetIndex,
      index
    }) => {
      const meta = me.getDatasetMeta(datasetIndex);

      if (!meta) {
        throw new Error('No dataset found at index ' + datasetIndex);
      }

      return {
        datasetIndex,
        element: meta.data[index],
        index
      };
    });
    const changed = !(0, _helpersSegment.ac)(active, lastActive);

    if (changed) {
      me._active = active;

      me._updateHoverStyles(active, lastActive);
    }
  }

  notifyPlugins(hook, args, filter) {
    return this._plugins.notify(this, hook, args, filter);
  }

  _updateHoverStyles(active, lastActive, replay) {
    const me = this;
    const hoverOptions = me.options.hover;

    const diff = (a, b) => a.filter(x => !b.some(y => x.datasetIndex === y.datasetIndex && x.index === y.index));

    const deactivated = diff(lastActive, active);
    const activated = replay ? active : diff(active, lastActive);

    if (deactivated.length) {
      me.updateHoverStyle(deactivated, hoverOptions.mode, false);
    }

    if (activated.length && hoverOptions.mode) {
      me.updateHoverStyle(activated, hoverOptions.mode, true);
    }
  }

  _eventHandler(e, replay) {
    const me = this;
    const args = {
      event: e,
      replay,
      cancelable: true
    };

    const eventFilter = plugin => (plugin.options.events || this.options.events).includes(e.type);

    if (me.notifyPlugins('beforeEvent', args, eventFilter) === false) {
      return;
    }

    const changed = me._handleEvent(e, replay);

    args.cancelable = false;
    me.notifyPlugins('afterEvent', args, eventFilter);

    if (changed || args.changed) {
      me.render();
    }

    return me;
  }

  _handleEvent(e, replay) {
    const me = this;
    const {
      _active: lastActive = [],
      options
    } = me;
    const hoverOptions = options.hover;
    const useFinalPosition = replay;
    let active = [];
    let changed = false;
    let lastEvent = null;

    if (e.type !== 'mouseout') {
      active = me.getElementsAtEventForMode(e, hoverOptions.mode, hoverOptions, useFinalPosition);
      lastEvent = e.type === 'click' ? me._lastEvent : e;
    }

    me._lastEvent = null;

    if ((0, _helpersSegment.A)(e, me.chartArea, me._minPadding)) {
      (0, _helpersSegment.N)(options.onHover, [e, active, me], me);

      if (e.type === 'mouseup' || e.type === 'click' || e.type === 'contextmenu') {
        (0, _helpersSegment.N)(options.onClick, [e, active, me], me);
      }
    }

    changed = !(0, _helpersSegment.ac)(active, lastActive);

    if (changed || replay) {
      me._active = active;

      me._updateHoverStyles(active, lastActive, replay);
    }

    me._lastEvent = lastEvent;
    return changed;
  }

}

exports.Chart = Chart;

const invalidatePlugins = () => (0, _helpersSegment.D)(Chart.instances, chart => chart._plugins.invalidate());

const enumerable = true;
Object.defineProperties(Chart, {
  defaults: {
    enumerable,
    value: _helpersSegment.d
  },
  instances: {
    enumerable,
    value: instances
  },
  overrides: {
    enumerable,
    value: _helpersSegment.Z
  },
  registry: {
    enumerable,
    value: registry
  },
  version: {
    enumerable,
    value: version
  },
  getChart: {
    enumerable,
    value: getChart
  },
  register: {
    enumerable,
    value: (...items) => {
      registry.add(...items);
      invalidatePlugins();
    }
  },
  unregister: {
    enumerable,
    value: (...items) => {
      registry.remove(...items);
      invalidatePlugins();
    }
  }
});

function clipArc(ctx, element) {
  const {
    startAngle,
    endAngle,
    pixelMargin,
    x,
    y,
    outerRadius,
    innerRadius
  } = element;
  let angleMargin = pixelMargin / outerRadius;
  ctx.beginPath();
  ctx.arc(x, y, outerRadius, startAngle - angleMargin, endAngle + angleMargin);

  if (innerRadius > pixelMargin) {
    angleMargin = pixelMargin / innerRadius;
    ctx.arc(x, y, innerRadius, endAngle + angleMargin, startAngle - angleMargin, true);
  } else {
    ctx.arc(x, y, pixelMargin, endAngle + _helpersSegment.H, startAngle - _helpersSegment.H);
  }

  ctx.closePath();
  ctx.clip();
}

function toRadiusCorners(value) {
  return (0, _helpersSegment.ae)(value, ['outerStart', 'outerEnd', 'innerStart', 'innerEnd']);
}

function parseBorderRadius$1(arc, innerRadius, outerRadius, angleDelta) {
  const o = toRadiusCorners(arc.options.borderRadius);
  const halfThickness = (outerRadius - innerRadius) / 2;
  const innerLimit = Math.min(halfThickness, angleDelta * innerRadius / 2);

  const computeOuterLimit = val => {
    const outerArcLimit = (outerRadius - Math.min(halfThickness, val)) * angleDelta / 2;
    return (0, _helpersSegment.x)(val, 0, Math.min(halfThickness, outerArcLimit));
  };

  return {
    outerStart: computeOuterLimit(o.outerStart),
    outerEnd: computeOuterLimit(o.outerEnd),
    innerStart: (0, _helpersSegment.x)(o.innerStart, 0, innerLimit),
    innerEnd: (0, _helpersSegment.x)(o.innerEnd, 0, innerLimit)
  };
}

function rThetaToXY(r, theta, x, y) {
  return {
    x: x + r * Math.cos(theta),
    y: y + r * Math.sin(theta)
  };
}

function pathArc(ctx, element) {
  const {
    x,
    y,
    startAngle,
    endAngle,
    pixelMargin
  } = element;
  const outerRadius = Math.max(element.outerRadius - pixelMargin, 0);
  const innerRadius = element.innerRadius + pixelMargin;
  const {
    outerStart,
    outerEnd,
    innerStart,
    innerEnd
  } = parseBorderRadius$1(element, innerRadius, outerRadius, endAngle - startAngle);
  const outerStartAdjustedRadius = outerRadius - outerStart;
  const outerEndAdjustedRadius = outerRadius - outerEnd;
  const outerStartAdjustedAngle = startAngle + outerStart / outerStartAdjustedRadius;
  const outerEndAdjustedAngle = endAngle - outerEnd / outerEndAdjustedRadius;
  const innerStartAdjustedRadius = innerRadius + innerStart;
  const innerEndAdjustedRadius = innerRadius + innerEnd;
  const innerStartAdjustedAngle = startAngle + innerStart / innerStartAdjustedRadius;
  const innerEndAdjustedAngle = endAngle - innerEnd / innerEndAdjustedRadius;
  ctx.beginPath();
  ctx.arc(x, y, outerRadius, outerStartAdjustedAngle, outerEndAdjustedAngle);

  if (outerEnd > 0) {
    const pCenter = rThetaToXY(outerEndAdjustedRadius, outerEndAdjustedAngle, x, y);
    ctx.arc(pCenter.x, pCenter.y, outerEnd, outerEndAdjustedAngle, endAngle + _helpersSegment.H);
  }

  const p4 = rThetaToXY(innerEndAdjustedRadius, endAngle, x, y);
  ctx.lineTo(p4.x, p4.y);

  if (innerEnd > 0) {
    const pCenter = rThetaToXY(innerEndAdjustedRadius, innerEndAdjustedAngle, x, y);
    ctx.arc(pCenter.x, pCenter.y, innerEnd, endAngle + _helpersSegment.H, innerEndAdjustedAngle + Math.PI);
  }

  ctx.arc(x, y, innerRadius, endAngle - innerEnd / innerRadius, startAngle + innerStart / innerRadius, true);

  if (innerStart > 0) {
    const pCenter = rThetaToXY(innerStartAdjustedRadius, innerStartAdjustedAngle, x, y);
    ctx.arc(pCenter.x, pCenter.y, innerStart, innerStartAdjustedAngle + Math.PI, startAngle - _helpersSegment.H);
  }

  const p8 = rThetaToXY(outerStartAdjustedRadius, startAngle, x, y);
  ctx.lineTo(p8.x, p8.y);

  if (outerStart > 0) {
    const pCenter = rThetaToXY(outerStartAdjustedRadius, outerStartAdjustedAngle, x, y);
    ctx.arc(pCenter.x, pCenter.y, outerStart, startAngle - _helpersSegment.H, outerStartAdjustedAngle);
  }

  ctx.closePath();
}

function drawArc(ctx, element) {
  if (element.fullCircles) {
    element.endAngle = element.startAngle + _helpersSegment.T;
    pathArc(ctx, element);

    for (let i = 0; i < element.fullCircles; ++i) {
      ctx.fill();
    }
  }

  if (!isNaN(element.circumference)) {
    element.endAngle = element.startAngle + element.circumference % _helpersSegment.T;
  }

  pathArc(ctx, element);
  ctx.fill();
}

function drawFullCircleBorders(ctx, element, inner) {
  const {
    x,
    y,
    startAngle,
    endAngle,
    pixelMargin
  } = element;
  const outerRadius = Math.max(element.outerRadius - pixelMargin, 0);
  const innerRadius = element.innerRadius + pixelMargin;
  let i;

  if (inner) {
    element.endAngle = element.startAngle + _helpersSegment.T;
    clipArc(ctx, element);
    element.endAngle = endAngle;

    if (element.endAngle === element.startAngle) {
      element.endAngle += _helpersSegment.T;
      element.fullCircles--;
    }
  }

  ctx.beginPath();
  ctx.arc(x, y, innerRadius, startAngle + _helpersSegment.T, startAngle, true);

  for (i = 0; i < element.fullCircles; ++i) {
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(x, y, outerRadius, startAngle, startAngle + _helpersSegment.T);

  for (i = 0; i < element.fullCircles; ++i) {
    ctx.stroke();
  }
}

function drawBorder(ctx, element) {
  const {
    options
  } = element;
  const inner = options.borderAlign === 'inner';

  if (!options.borderWidth) {
    return;
  }

  if (inner) {
    ctx.lineWidth = options.borderWidth * 2;
    ctx.lineJoin = 'round';
  } else {
    ctx.lineWidth = options.borderWidth;
    ctx.lineJoin = 'bevel';
  }

  if (element.fullCircles) {
    drawFullCircleBorders(ctx, element, inner);
  }

  if (inner) {
    clipArc(ctx, element);
  }

  pathArc(ctx, element);
  ctx.stroke();
}

class ArcElement extends Element {
  constructor(cfg) {
    super();
    this.options = undefined;
    this.circumference = undefined;
    this.startAngle = undefined;
    this.endAngle = undefined;
    this.innerRadius = undefined;
    this.outerRadius = undefined;
    this.pixelMargin = 0;
    this.fullCircles = 0;

    if (cfg) {
      Object.assign(this, cfg);
    }
  }

  inRange(chartX, chartY, useFinalPosition) {
    const point = this.getProps(['x', 'y'], useFinalPosition);
    const {
      angle,
      distance
    } = (0, _helpersSegment.ad)(point, {
      x: chartX,
      y: chartY
    });
    const {
      startAngle,
      endAngle,
      innerRadius,
      outerRadius,
      circumference
    } = this.getProps(['startAngle', 'endAngle', 'innerRadius', 'outerRadius', 'circumference'], useFinalPosition);
    const betweenAngles = circumference >= _helpersSegment.T || (0, _helpersSegment.q)(angle, startAngle, endAngle);
    const withinRadius = distance >= innerRadius && distance <= outerRadius;
    return betweenAngles && withinRadius;
  }

  getCenterPoint(useFinalPosition) {
    const {
      x,
      y,
      startAngle,
      endAngle,
      innerRadius,
      outerRadius
    } = this.getProps(['x', 'y', 'startAngle', 'endAngle', 'innerRadius', 'outerRadius'], useFinalPosition);
    const halfAngle = (startAngle + endAngle) / 2;
    const halfRadius = (innerRadius + outerRadius) / 2;
    return {
      x: x + Math.cos(halfAngle) * halfRadius,
      y: y + Math.sin(halfAngle) * halfRadius
    };
  }

  tooltipPosition(useFinalPosition) {
    return this.getCenterPoint(useFinalPosition);
  }

  draw(ctx) {
    const me = this;
    const options = me.options;
    const offset = options.offset || 0;
    me.pixelMargin = options.borderAlign === 'inner' ? 0.33 : 0;
    me.fullCircles = Math.floor(me.circumference / _helpersSegment.T);

    if (me.circumference === 0 || me.innerRadius < 0 || me.outerRadius < 0) {
      return;
    }

    ctx.save();

    if (offset && me.circumference < _helpersSegment.T) {
      const halfAngle = (me.startAngle + me.endAngle) / 2;
      ctx.translate(Math.cos(halfAngle) * offset, Math.sin(halfAngle) * offset);
    }

    ctx.fillStyle = options.backgroundColor;
    ctx.strokeStyle = options.borderColor;
    drawArc(ctx, me);
    drawBorder(ctx, me);
    ctx.restore();
  }

}

exports.ArcElement = ArcElement;
ArcElement.id = 'arc';
ArcElement.defaults = {
  borderAlign: 'center',
  borderColor: '#fff',
  borderRadius: 0,
  borderWidth: 2,
  offset: 0,
  angle: undefined
};
ArcElement.defaultRoutes = {
  backgroundColor: 'backgroundColor'
};

function setStyle(ctx, options, style = options) {
  ctx.lineCap = (0, _helpersSegment.v)(style.borderCapStyle, options.borderCapStyle);
  ctx.setLineDash((0, _helpersSegment.v)(style.borderDash, options.borderDash));
  ctx.lineDashOffset = (0, _helpersSegment.v)(style.borderDashOffset, options.borderDashOffset);
  ctx.lineJoin = (0, _helpersSegment.v)(style.borderJoinStyle, options.borderJoinStyle);
  ctx.lineWidth = (0, _helpersSegment.v)(style.borderWidth, options.borderWidth);
  ctx.strokeStyle = (0, _helpersSegment.v)(style.borderColor, options.borderColor);
}

function lineTo(ctx, previous, target) {
  ctx.lineTo(target.x, target.y);
}

function getLineMethod(options) {
  if (options.stepped) {
    return _helpersSegment.al;
  }

  if (options.tension || options.cubicInterpolationMode === 'monotone') {
    return _helpersSegment.am;
  }

  return lineTo;
}

function pathVars(points, segment, params = {}) {
  const count = points.length;
  const {
    start: paramsStart = 0,
    end: paramsEnd = count - 1
  } = params;
  const {
    start: segmentStart,
    end: segmentEnd
  } = segment;
  const start = Math.max(paramsStart, segmentStart);
  const end = Math.min(paramsEnd, segmentEnd);
  const outside = paramsStart < segmentStart && paramsEnd < segmentStart || paramsStart > segmentEnd && paramsEnd > segmentEnd;
  return {
    count,
    start,
    loop: segment.loop,
    ilen: end < start && !outside ? count + end - start : end - start
  };
}

function pathSegment(ctx, line, segment, params) {
  const {
    points,
    options
  } = line;
  const {
    count,
    start,
    loop,
    ilen
  } = pathVars(points, segment, params);
  const lineMethod = getLineMethod(options);
  let {
    move = true,
    reverse
  } = params || {};
  let i, point, prev;

  for (i = 0; i <= ilen; ++i) {
    point = points[(start + (reverse ? ilen - i : i)) % count];

    if (point.skip) {
      continue;
    } else if (move) {
      ctx.moveTo(point.x, point.y);
      move = false;
    } else {
      lineMethod(ctx, prev, point, reverse, options.stepped);
    }

    prev = point;
  }

  if (loop) {
    point = points[(start + (reverse ? ilen : 0)) % count];
    lineMethod(ctx, prev, point, reverse, options.stepped);
  }

  return !!loop;
}

function fastPathSegment(ctx, line, segment, params) {
  const points = line.points;
  const {
    count,
    start,
    ilen
  } = pathVars(points, segment, params);
  const {
    move = true,
    reverse
  } = params || {};
  let avgX = 0;
  let countX = 0;
  let i, point, prevX, minY, maxY, lastY;

  const pointIndex = index => (start + (reverse ? ilen - index : index)) % count;

  const drawX = () => {
    if (minY !== maxY) {
      ctx.lineTo(avgX, maxY);
      ctx.lineTo(avgX, minY);
      ctx.lineTo(avgX, lastY);
    }
  };

  if (move) {
    point = points[pointIndex(0)];
    ctx.moveTo(point.x, point.y);
  }

  for (i = 0; i <= ilen; ++i) {
    point = points[pointIndex(i)];

    if (point.skip) {
      continue;
    }

    const x = point.x;
    const y = point.y;
    const truncX = x | 0;

    if (truncX === prevX) {
      if (y < minY) {
        minY = y;
      } else if (y > maxY) {
        maxY = y;
      }

      avgX = (countX * avgX + x) / ++countX;
    } else {
      drawX();
      ctx.lineTo(x, y);
      prevX = truncX;
      countX = 0;
      minY = maxY = y;
    }

    lastY = y;
  }

  drawX();
}

function _getSegmentMethod(line) {
  const opts = line.options;
  const borderDash = opts.borderDash && opts.borderDash.length;
  const useFastPath = !line._decimated && !line._loop && !opts.tension && opts.cubicInterpolationMode !== 'monotone' && !opts.stepped && !borderDash;
  return useFastPath ? fastPathSegment : pathSegment;
}

function _getInterpolationMethod(options) {
  if (options.stepped) {
    return _helpersSegment.ai;
  }

  if (options.tension || options.cubicInterpolationMode === 'monotone') {
    return _helpersSegment.aj;
  }

  return _helpersSegment.ak;
}

function strokePathWithCache(ctx, line, start, count) {
  let path = line._path;

  if (!path) {
    path = line._path = new Path2D();

    if (line.path(path, start, count)) {
      path.closePath();
    }
  }

  setStyle(ctx, line.options);
  ctx.stroke(path);
}

function strokePathDirect(ctx, line, start, count) {
  const {
    segments,
    options
  } = line;

  const segmentMethod = _getSegmentMethod(line);

  for (const segment of segments) {
    setStyle(ctx, options, segment.style);
    ctx.beginPath();

    if (segmentMethod(ctx, line, segment, {
      start,
      end: start + count - 1
    })) {
      ctx.closePath();
    }

    ctx.stroke();
  }
}

const usePath2D = typeof Path2D === 'function';

function draw(ctx, line, start, count) {
  if (usePath2D && line.segments.length === 1) {
    strokePathWithCache(ctx, line, start, count);
  } else {
    strokePathDirect(ctx, line, start, count);
  }
}

class LineElement extends Element {
  constructor(cfg) {
    super();
    this.animated = true;
    this.options = undefined;
    this._loop = undefined;
    this._fullLoop = undefined;
    this._path = undefined;
    this._points = undefined;
    this._segments = undefined;
    this._decimated = false;
    this._pointsUpdated = false;

    if (cfg) {
      Object.assign(this, cfg);
    }
  }

  updateControlPoints(chartArea) {
    const me = this;
    const options = me.options;

    if ((options.tension || options.cubicInterpolationMode === 'monotone') && !options.stepped && !me._pointsUpdated) {
      const loop = options.spanGaps ? me._loop : me._fullLoop;
      (0, _helpersSegment.af)(me._points, options, chartArea, loop);
      me._pointsUpdated = true;
    }
  }

  set points(points) {
    const me = this;
    me._points = points;
    delete me._segments;
    delete me._path;
    me._pointsUpdated = false;
  }

  get points() {
    return this._points;
  }

  get segments() {
    return this._segments || (this._segments = (0, _helpersSegment.ag)(this, this.options.segment));
  }

  first() {
    const segments = this.segments;
    const points = this.points;
    return segments.length && points[segments[0].start];
  }

  last() {
    const segments = this.segments;
    const points = this.points;
    const count = segments.length;
    return count && points[segments[count - 1].end];
  }

  interpolate(point, property) {
    const me = this;
    const options = me.options;
    const value = point[property];
    const points = me.points;
    const segments = (0, _helpersSegment.ah)(me, {
      property,
      start: value,
      end: value
    });

    if (!segments.length) {
      return;
    }

    const result = [];

    const _interpolate = _getInterpolationMethod(options);

    let i, ilen;

    for (i = 0, ilen = segments.length; i < ilen; ++i) {
      const {
        start,
        end
      } = segments[i];
      const p1 = points[start];
      const p2 = points[end];

      if (p1 === p2) {
        result.push(p1);
        continue;
      }

      const t = Math.abs((value - p1[property]) / (p2[property] - p1[property]));

      const interpolated = _interpolate(p1, p2, t, options.stepped);

      interpolated[property] = point[property];
      result.push(interpolated);
    }

    return result.length === 1 ? result[0] : result;
  }

  pathSegment(ctx, segment, params) {
    const segmentMethod = _getSegmentMethod(this);

    return segmentMethod(ctx, this, segment, params);
  }

  path(ctx, start, count) {
    const me = this;
    const segments = me.segments;

    const segmentMethod = _getSegmentMethod(me);

    let loop = me._loop;
    start = start || 0;
    count = count || me.points.length - start;

    for (const segment of segments) {
      loop &= segmentMethod(ctx, me, segment, {
        start,
        end: start + count - 1
      });
    }

    return !!loop;
  }

  draw(ctx, chartArea, start, count) {
    const me = this;
    const options = me.options || {};
    const points = me.points || [];

    if (!points.length || !options.borderWidth) {
      return;
    }

    ctx.save();
    draw(ctx, me, start, count);
    ctx.restore();

    if (me.animated) {
      me._pointsUpdated = false;
      me._path = undefined;
    }
  }

}

exports.LineElement = LineElement;
LineElement.id = 'line';
LineElement.defaults = {
  borderCapStyle: 'butt',
  borderDash: [],
  borderDashOffset: 0,
  borderJoinStyle: 'miter',
  borderWidth: 3,
  capBezierPoints: true,
  cubicInterpolationMode: 'default',
  fill: false,
  spanGaps: false,
  stepped: false,
  tension: 0
};
LineElement.defaultRoutes = {
  backgroundColor: 'backgroundColor',
  borderColor: 'borderColor'
};
LineElement.descriptors = {
  _scriptable: true,
  _indexable: name => name !== 'borderDash' && name !== 'fill'
};

function inRange$1(el, pos, axis, useFinalPosition) {
  const options = el.options;
  const {
    [axis]: value
  } = el.getProps([axis], useFinalPosition);
  return Math.abs(pos - value) < options.radius + options.hitRadius;
}

class PointElement extends Element {
  constructor(cfg) {
    super();
    this.options = undefined;
    this.parsed = undefined;
    this.skip = undefined;
    this.stop = undefined;

    if (cfg) {
      Object.assign(this, cfg);
    }
  }

  inRange(mouseX, mouseY, useFinalPosition) {
    const options = this.options;
    const {
      x,
      y
    } = this.getProps(['x', 'y'], useFinalPosition);
    return Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2) < Math.pow(options.hitRadius + options.radius, 2);
  }

  inXRange(mouseX, useFinalPosition) {
    return inRange$1(this, mouseX, 'x', useFinalPosition);
  }

  inYRange(mouseY, useFinalPosition) {
    return inRange$1(this, mouseY, 'y', useFinalPosition);
  }

  getCenterPoint(useFinalPosition) {
    const {
      x,
      y
    } = this.getProps(['x', 'y'], useFinalPosition);
    return {
      x,
      y
    };
  }

  size(options) {
    options = options || this.options || {};
    let radius = options.radius || 0;
    radius = Math.max(radius, radius && options.hoverRadius || 0);
    const borderWidth = radius && options.borderWidth || 0;
    return (radius + borderWidth) * 2;
  }

  draw(ctx) {
    const me = this;
    const options = me.options;

    if (me.skip || options.radius < 0.1) {
      return;
    }

    ctx.strokeStyle = options.borderColor;
    ctx.lineWidth = options.borderWidth;
    ctx.fillStyle = options.backgroundColor;
    (0, _helpersSegment.an)(ctx, options, me.x, me.y);
  }

  getRange() {
    const options = this.options || {};
    return options.radius + options.hitRadius;
  }

}

exports.PointElement = PointElement;
PointElement.id = 'point';
PointElement.defaults = {
  borderWidth: 1,
  hitRadius: 1,
  hoverBorderWidth: 1,
  hoverRadius: 4,
  pointStyle: 'circle',
  radius: 3,
  rotation: 0
};
PointElement.defaultRoutes = {
  backgroundColor: 'backgroundColor',
  borderColor: 'borderColor'
};

function getBarBounds(bar, useFinalPosition) {
  const {
    x,
    y,
    base,
    width,
    height
  } = bar.getProps(['x', 'y', 'base', 'width', 'height'], useFinalPosition);
  let left, right, top, bottom, half;

  if (bar.horizontal) {
    half = height / 2;
    left = Math.min(x, base);
    right = Math.max(x, base);
    top = y - half;
    bottom = y + half;
  } else {
    half = width / 2;
    left = x - half;
    right = x + half;
    top = Math.min(y, base);
    bottom = Math.max(y, base);
  }

  return {
    left,
    top,
    right,
    bottom
  };
}

function parseBorderSkipped(bar) {
  let edge = bar.options.borderSkipped;
  const res = {};

  if (!edge) {
    return res;
  }

  edge = bar.horizontal ? parseEdge(edge, 'left', 'right', bar.base > bar.x) : parseEdge(edge, 'bottom', 'top', bar.base < bar.y);
  res[edge] = true;
  return res;
}

function parseEdge(edge, a, b, reverse) {
  if (reverse) {
    edge = swap(edge, a, b);
    edge = startEnd(edge, b, a);
  } else {
    edge = startEnd(edge, a, b);
  }

  return edge;
}

function swap(orig, v1, v2) {
  return orig === v1 ? v2 : orig === v2 ? v1 : orig;
}

function startEnd(v, start, end) {
  return v === 'start' ? start : v === 'end' ? end : v;
}

function skipOrLimit(skip, value, min, max) {
  return skip ? 0 : Math.max(Math.min(value, max), min);
}

function parseBorderWidth(bar, maxW, maxH) {
  const value = bar.options.borderWidth;
  const skip = parseBorderSkipped(bar);
  const o = (0, _helpersSegment.ap)(value);
  return {
    t: skipOrLimit(skip.top, o.top, 0, maxH),
    r: skipOrLimit(skip.right, o.right, 0, maxW),
    b: skipOrLimit(skip.bottom, o.bottom, 0, maxH),
    l: skipOrLimit(skip.left, o.left, 0, maxW)
  };
}

function parseBorderRadius(bar, maxW, maxH) {
  const {
    enableBorderRadius
  } = bar.getProps(['enableBorderRadius']);
  const value = bar.options.borderRadius;
  const o = (0, _helpersSegment.aq)(value);
  const maxR = Math.min(maxW, maxH);
  const skip = parseBorderSkipped(bar);
  const enableBorder = enableBorderRadius || (0, _helpersSegment.i)(value);
  return {
    topLeft: skipOrLimit(!enableBorder || skip.top || skip.left, o.topLeft, 0, maxR),
    topRight: skipOrLimit(!enableBorder || skip.top || skip.right, o.topRight, 0, maxR),
    bottomLeft: skipOrLimit(!enableBorder || skip.bottom || skip.left, o.bottomLeft, 0, maxR),
    bottomRight: skipOrLimit(!enableBorder || skip.bottom || skip.right, o.bottomRight, 0, maxR)
  };
}

function boundingRects(bar) {
  const bounds = getBarBounds(bar);
  const width = bounds.right - bounds.left;
  const height = bounds.bottom - bounds.top;
  const border = parseBorderWidth(bar, width / 2, height / 2);
  const radius = parseBorderRadius(bar, width / 2, height / 2);
  return {
    outer: {
      x: bounds.left,
      y: bounds.top,
      w: width,
      h: height,
      radius
    },
    inner: {
      x: bounds.left + border.l,
      y: bounds.top + border.t,
      w: width - border.l - border.r,
      h: height - border.t - border.b,
      radius: {
        topLeft: Math.max(0, radius.topLeft - Math.max(border.t, border.l)),
        topRight: Math.max(0, radius.topRight - Math.max(border.t, border.r)),
        bottomLeft: Math.max(0, radius.bottomLeft - Math.max(border.b, border.l)),
        bottomRight: Math.max(0, radius.bottomRight - Math.max(border.b, border.r))
      }
    }
  };
}

function inRange(bar, x, y, useFinalPosition) {
  const skipX = x === null;
  const skipY = y === null;
  const skipBoth = skipX && skipY;
  const bounds = bar && !skipBoth && getBarBounds(bar, useFinalPosition);
  return bounds && (skipX || x >= bounds.left && x <= bounds.right) && (skipY || y >= bounds.top && y <= bounds.bottom);
}

function hasRadius(radius) {
  return radius.topLeft || radius.topRight || radius.bottomLeft || radius.bottomRight;
}

function addNormalRectPath(ctx, rect) {
  ctx.rect(rect.x, rect.y, rect.w, rect.h);
}

class BarElement extends Element {
  constructor(cfg) {
    super();
    this.options = undefined;
    this.horizontal = undefined;
    this.base = undefined;
    this.width = undefined;
    this.height = undefined;

    if (cfg) {
      Object.assign(this, cfg);
    }
  }

  draw(ctx) {
    const options = this.options;
    const {
      inner,
      outer
    } = boundingRects(this);
    const addRectPath = hasRadius(outer.radius) ? _helpersSegment.ao : addNormalRectPath;
    ctx.save();

    if (outer.w !== inner.w || outer.h !== inner.h) {
      ctx.beginPath();
      addRectPath(ctx, outer);
      ctx.clip();
      addRectPath(ctx, inner);
      ctx.fillStyle = options.borderColor;
      ctx.fill('evenodd');
    }

    ctx.beginPath();
    addRectPath(ctx, inner);
    ctx.fillStyle = options.backgroundColor;
    ctx.fill();
    ctx.restore();
  }

  inRange(mouseX, mouseY, useFinalPosition) {
    return inRange(this, mouseX, mouseY, useFinalPosition);
  }

  inXRange(mouseX, useFinalPosition) {
    return inRange(this, mouseX, null, useFinalPosition);
  }

  inYRange(mouseY, useFinalPosition) {
    return inRange(this, null, mouseY, useFinalPosition);
  }

  getCenterPoint(useFinalPosition) {
    const {
      x,
      y,
      base,
      horizontal
    } = this.getProps(['x', 'y', 'base', 'horizontal'], useFinalPosition);
    return {
      x: horizontal ? (x + base) / 2 : x,
      y: horizontal ? y : (y + base) / 2
    };
  }

  getRange(axis) {
    return axis === 'x' ? this.width / 2 : this.height / 2;
  }

}

exports.BarElement = BarElement;
BarElement.id = 'bar';
BarElement.defaults = {
  borderSkipped: 'start',
  borderWidth: 0,
  borderRadius: 0,
  enableBorderRadius: true,
  pointStyle: undefined
};
BarElement.defaultRoutes = {
  backgroundColor: 'backgroundColor',
  borderColor: 'borderColor'
};
var elements = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ArcElement: ArcElement,
  LineElement: LineElement,
  PointElement: PointElement,
  BarElement: BarElement
});
exports.elements = elements;

function lttbDecimation(data, start, count, availableWidth, options) {
  const samples = options.samples || availableWidth;

  if (samples >= count) {
    return data.slice(start, start + count);
  }

  const decimated = [];
  const bucketWidth = (count - 2) / (samples - 2);
  let sampledIndex = 0;
  const endIndex = start + count - 1;
  let a = start;
  let i, maxAreaPoint, maxArea, area, nextA;
  decimated[sampledIndex++] = data[a];

  for (i = 0; i < samples - 2; i++) {
    let avgX = 0;
    let avgY = 0;
    let j;
    const avgRangeStart = Math.floor((i + 1) * bucketWidth) + 1 + start;
    const avgRangeEnd = Math.min(Math.floor((i + 2) * bucketWidth) + 1, count) + start;
    const avgRangeLength = avgRangeEnd - avgRangeStart;

    for (j = avgRangeStart; j < avgRangeEnd; j++) {
      avgX += data[j].x;
      avgY += data[j].y;
    }

    avgX /= avgRangeLength;
    avgY /= avgRangeLength;
    const rangeOffs = Math.floor(i * bucketWidth) + 1 + start;
    const rangeTo = Math.floor((i + 1) * bucketWidth) + 1 + start;
    const {
      x: pointAx,
      y: pointAy
    } = data[a];
    maxArea = area = -1;

    for (j = rangeOffs; j < rangeTo; j++) {
      area = 0.5 * Math.abs((pointAx - avgX) * (data[j].y - pointAy) - (pointAx - data[j].x) * (avgY - pointAy));

      if (area > maxArea) {
        maxArea = area;
        maxAreaPoint = data[j];
        nextA = j;
      }
    }

    decimated[sampledIndex++] = maxAreaPoint;
    a = nextA;
  }

  decimated[sampledIndex++] = data[endIndex];
  return decimated;
}

function minMaxDecimation(data, start, count, availableWidth) {
  let avgX = 0;
  let countX = 0;
  let i, point, x, y, prevX, minIndex, maxIndex, startIndex, minY, maxY;
  const decimated = [];
  const endIndex = start + count - 1;
  const xMin = data[start].x;
  const xMax = data[endIndex].x;
  const dx = xMax - xMin;

  for (i = start; i < start + count; ++i) {
    point = data[i];
    x = (point.x - xMin) / dx * availableWidth;
    y = point.y;
    const truncX = x | 0;

    if (truncX === prevX) {
      if (y < minY) {
        minY = y;
        minIndex = i;
      } else if (y > maxY) {
        maxY = y;
        maxIndex = i;
      }

      avgX = (countX * avgX + point.x) / ++countX;
    } else {
      const lastIndex = i - 1;

      if (!(0, _helpersSegment.j)(minIndex) && !(0, _helpersSegment.j)(maxIndex)) {
        const intermediateIndex1 = Math.min(minIndex, maxIndex);
        const intermediateIndex2 = Math.max(minIndex, maxIndex);

        if (intermediateIndex1 !== startIndex && intermediateIndex1 !== lastIndex) {
          decimated.push({ ...data[intermediateIndex1],
            x: avgX
          });
        }

        if (intermediateIndex2 !== startIndex && intermediateIndex2 !== lastIndex) {
          decimated.push({ ...data[intermediateIndex2],
            x: avgX
          });
        }
      }

      if (i > 0 && lastIndex !== startIndex) {
        decimated.push(data[lastIndex]);
      }

      decimated.push(point);
      prevX = truncX;
      countX = 0;
      minY = maxY = y;
      minIndex = maxIndex = startIndex = i;
    }
  }

  return decimated;
}

function cleanDecimatedDataset(dataset) {
  if (dataset._decimated) {
    const data = dataset._data;
    delete dataset._decimated;
    delete dataset._data;
    Object.defineProperty(dataset, 'data', {
      value: data
    });
  }
}

function cleanDecimatedData(chart) {
  chart.data.datasets.forEach(dataset => {
    cleanDecimatedDataset(dataset);
  });
}

function getStartAndCountOfVisiblePointsSimplified(meta, points) {
  const pointCount = points.length;
  let start = 0;
  let count;
  const {
    iScale
  } = meta;
  const {
    min,
    max,
    minDefined,
    maxDefined
  } = iScale.getUserBounds();

  if (minDefined) {
    start = (0, _helpersSegment.x)((0, _helpersSegment.y)(points, iScale.axis, min).lo, 0, pointCount - 1);
  }

  if (maxDefined) {
    count = (0, _helpersSegment.x)((0, _helpersSegment.y)(points, iScale.axis, max).hi + 1, start, pointCount) - start;
  } else {
    count = pointCount - start;
  }

  return {
    start,
    count
  };
}

var plugin_decimation = {
  id: 'decimation',
  defaults: {
    algorithm: 'min-max',
    enabled: false
  },
  beforeElementsUpdate: (chart, args, options) => {
    if (!options.enabled) {
      cleanDecimatedData(chart);
      return;
    }

    const availableWidth = chart.width;
    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const {
        _data,
        indexAxis
      } = dataset;
      const meta = chart.getDatasetMeta(datasetIndex);
      const data = _data || dataset.data;

      if ((0, _helpersSegment.a)([indexAxis, chart.options.indexAxis]) === 'y') {
        return;
      }

      if (meta.type !== 'line') {
        return;
      }

      const xAxis = chart.scales[meta.xAxisID];

      if (xAxis.type !== 'linear' && xAxis.type !== 'time') {
        return;
      }

      if (chart.options.parsing) {
        return;
      }

      let {
        start,
        count
      } = getStartAndCountOfVisiblePointsSimplified(meta, data);

      if (count <= 4 * availableWidth) {
        cleanDecimatedDataset(dataset);
        return;
      }

      if ((0, _helpersSegment.j)(_data)) {
        dataset._data = data;
        delete dataset.data;
        Object.defineProperty(dataset, 'data', {
          configurable: true,
          enumerable: true,
          get: function () {
            return this._decimated;
          },
          set: function (d) {
            this._data = d;
          }
        });
      }

      let decimated;

      switch (options.algorithm) {
        case 'lttb':
          decimated = lttbDecimation(data, start, count, availableWidth, options);
          break;

        case 'min-max':
          decimated = minMaxDecimation(data, start, count, availableWidth);
          break;

        default:
          throw new Error(`Unsupported decimation algorithm '${options.algorithm}'`);
      }

      dataset._decimated = decimated;
    });
  },

  destroy(chart) {
    cleanDecimatedData(chart);
  }

};
exports.Decimation = plugin_decimation;

function getLineByIndex(chart, index) {
  const meta = chart.getDatasetMeta(index);
  const visible = meta && chart.isDatasetVisible(index);
  return visible ? meta.dataset : null;
}

function parseFillOption(line) {
  const options = line.options;
  const fillOption = options.fill;
  let fill = (0, _helpersSegment.v)(fillOption && fillOption.target, fillOption);

  if (fill === undefined) {
    fill = !!options.backgroundColor;
  }

  if (fill === false || fill === null) {
    return false;
  }

  if (fill === true) {
    return 'origin';
  }

  return fill;
}

function decodeFill(line, index, count) {
  const fill = parseFillOption(line);

  if ((0, _helpersSegment.i)(fill)) {
    return isNaN(fill.value) ? false : fill;
  }

  let target = parseFloat(fill);

  if ((0, _helpersSegment.g)(target) && Math.floor(target) === target) {
    if (fill[0] === '-' || fill[0] === '+') {
      target = index + target;
    }

    if (target === index || target < 0 || target >= count) {
      return false;
    }

    return target;
  }

  return ['origin', 'start', 'end', 'stack'].indexOf(fill) >= 0 && fill;
}

function computeLinearBoundary(source) {
  const {
    scale = {},
    fill
  } = source;
  let target = null;
  let horizontal;

  if (fill === 'start') {
    target = scale.bottom;
  } else if (fill === 'end') {
    target = scale.top;
  } else if ((0, _helpersSegment.i)(fill)) {
    target = scale.getPixelForValue(fill.value);
  } else if (scale.getBasePixel) {
    target = scale.getBasePixel();
  }

  if ((0, _helpersSegment.g)(target)) {
    horizontal = scale.isHorizontal();
    return {
      x: horizontal ? target : null,
      y: horizontal ? null : target
    };
  }

  return null;
}

class simpleArc {
  constructor(opts) {
    this.x = opts.x;
    this.y = opts.y;
    this.radius = opts.radius;
  }

  pathSegment(ctx, bounds, opts) {
    const {
      x,
      y,
      radius
    } = this;
    bounds = bounds || {
      start: 0,
      end: _helpersSegment.T
    };
    ctx.arc(x, y, radius, bounds.end, bounds.start, true);
    return !opts.bounds;
  }

  interpolate(point) {
    const {
      x,
      y,
      radius
    } = this;
    const angle = point.angle;
    return {
      x: x + Math.cos(angle) * radius,
      y: y + Math.sin(angle) * radius,
      angle
    };
  }

}

function computeCircularBoundary(source) {
  const {
    scale,
    fill
  } = source;
  const options = scale.options;
  const length = scale.getLabels().length;
  const target = [];
  const start = options.reverse ? scale.max : scale.min;
  const end = options.reverse ? scale.min : scale.max;
  let i, center, value;

  if (fill === 'start') {
    value = start;
  } else if (fill === 'end') {
    value = end;
  } else if ((0, _helpersSegment.i)(fill)) {
    value = fill.value;
  } else {
    value = scale.getBaseValue();
  }

  if (options.grid.circular) {
    center = scale.getPointPositionForValue(0, start);
    return new simpleArc({
      x: center.x,
      y: center.y,
      radius: scale.getDistanceFromCenterForValue(value)
    });
  }

  for (i = 0; i < length; ++i) {
    target.push(scale.getPointPositionForValue(i, value));
  }

  return target;
}

function computeBoundary(source) {
  const scale = source.scale || {};

  if (scale.getPointPositionForValue) {
    return computeCircularBoundary(source);
  }

  return computeLinearBoundary(source);
}

function pointsFromSegments(boundary, line) {
  const {
    x = null,
    y = null
  } = boundary || {};
  const linePoints = line.points;
  const points = [];
  line.segments.forEach(segment => {
    const first = linePoints[segment.start];
    const last = linePoints[segment.end];

    if (y !== null) {
      points.push({
        x: first.x,
        y
      });
      points.push({
        x: last.x,
        y
      });
    } else if (x !== null) {
      points.push({
        x,
        y: first.y
      });
      points.push({
        x,
        y: last.y
      });
    }
  });
  return points;
}

function buildStackLine(source) {
  const {
    chart,
    scale,
    index,
    line
  } = source;
  const points = [];
  const segments = line.segments;
  const sourcePoints = line.points;
  const linesBelow = getLinesBelow(chart, index);
  linesBelow.push(createBoundaryLine({
    x: null,
    y: scale.bottom
  }, line));

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];

    for (let j = segment.start; j <= segment.end; j++) {
      addPointsBelow(points, sourcePoints[j], linesBelow);
    }
  }

  return new LineElement({
    points,
    options: {}
  });
}

const isLineAndNotInHideAnimation = meta => meta.type === 'line' && !meta.hidden;

function getLinesBelow(chart, index) {
  const below = [];
  const metas = chart.getSortedVisibleDatasetMetas();

  for (let i = 0; i < metas.length; i++) {
    const meta = metas[i];

    if (meta.index === index) {
      break;
    }

    if (isLineAndNotInHideAnimation(meta)) {
      below.unshift(meta.dataset);
    }
  }

  return below;
}

function addPointsBelow(points, sourcePoint, linesBelow) {
  const postponed = [];

  for (let j = 0; j < linesBelow.length; j++) {
    const line = linesBelow[j];
    const {
      first,
      last,
      point
    } = findPoint(line, sourcePoint, 'x');

    if (!point || first && last) {
      continue;
    }

    if (first) {
      postponed.unshift(point);
    } else {
      points.push(point);

      if (!last) {
        break;
      }
    }
  }

  points.push(...postponed);
}

function findPoint(line, sourcePoint, property) {
  const point = line.interpolate(sourcePoint, property);

  if (!point) {
    return {};
  }

  const pointValue = point[property];
  const segments = line.segments;
  const linePoints = line.points;
  let first = false;
  let last = false;

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const firstValue = linePoints[segment.start][property];
    const lastValue = linePoints[segment.end][property];

    if (pointValue >= firstValue && pointValue <= lastValue) {
      first = pointValue === firstValue;
      last = pointValue === lastValue;
      break;
    }
  }

  return {
    first,
    last,
    point
  };
}

function getTarget(source) {
  const {
    chart,
    fill,
    line
  } = source;

  if ((0, _helpersSegment.g)(fill)) {
    return getLineByIndex(chart, fill);
  }

  if (fill === 'stack') {
    return buildStackLine(source);
  }

  const boundary = computeBoundary(source);

  if (boundary instanceof simpleArc) {
    return boundary;
  }

  return createBoundaryLine(boundary, line);
}

function createBoundaryLine(boundary, line) {
  let points = [];
  let _loop = false;

  if ((0, _helpersSegment.b)(boundary)) {
    _loop = true;
    points = boundary;
  } else {
    points = pointsFromSegments(boundary, line);
  }

  return points.length ? new LineElement({
    points,
    options: {
      tension: 0
    },
    _loop,
    _fullLoop: _loop
  }) : null;
}

function resolveTarget(sources, index, propagate) {
  const source = sources[index];
  let fill = source.fill;
  const visited = [index];
  let target;

  if (!propagate) {
    return fill;
  }

  while (fill !== false && visited.indexOf(fill) === -1) {
    if (!(0, _helpersSegment.g)(fill)) {
      return fill;
    }

    target = sources[fill];

    if (!target) {
      return false;
    }

    if (target.visible) {
      return fill;
    }

    visited.push(fill);
    fill = target.fill;
  }

  return false;
}

function _clip(ctx, target, clipY) {
  ctx.beginPath();
  target.path(ctx);
  ctx.lineTo(target.last().x, clipY);
  ctx.lineTo(target.first().x, clipY);
  ctx.closePath();
  ctx.clip();
}

function getBounds(property, first, last, loop) {
  if (loop) {
    return;
  }

  let start = first[property];
  let end = last[property];

  if (property === 'angle') {
    start = (0, _helpersSegment.as)(start);
    end = (0, _helpersSegment.as)(end);
  }

  return {
    property,
    start,
    end
  };
}

function _getEdge(a, b, prop, fn) {
  if (a && b) {
    return fn(a[prop], b[prop]);
  }

  return a ? a[prop] : b ? b[prop] : 0;
}

function _segments(line, target, property) {
  const segments = line.segments;
  const points = line.points;
  const tpoints = target.points;
  const parts = [];

  for (const segment of segments) {
    const bounds = getBounds(property, points[segment.start], points[segment.end], segment.loop);

    if (!target.segments) {
      parts.push({
        source: segment,
        target: bounds,
        start: points[segment.start],
        end: points[segment.end]
      });
      continue;
    }

    const targetSegments = (0, _helpersSegment.ah)(target, bounds);

    for (const tgt of targetSegments) {
      const subBounds = getBounds(property, tpoints[tgt.start], tpoints[tgt.end], tgt.loop);
      const fillSources = (0, _helpersSegment.ar)(segment, points, subBounds);

      for (const fillSource of fillSources) {
        parts.push({
          source: fillSource,
          target: tgt,
          start: {
            [property]: _getEdge(bounds, subBounds, 'start', Math.max)
          },
          end: {
            [property]: _getEdge(bounds, subBounds, 'end', Math.min)
          }
        });
      }
    }
  }

  return parts;
}

function clipBounds(ctx, scale, bounds) {
  const {
    top,
    bottom
  } = scale.chart.chartArea;
  const {
    property,
    start,
    end
  } = bounds || {};

  if (property === 'x') {
    ctx.beginPath();
    ctx.rect(start, top, end - start, bottom - top);
    ctx.clip();
  }
}

function interpolatedLineTo(ctx, target, point, property) {
  const interpolatedPoint = target.interpolate(point, property);

  if (interpolatedPoint) {
    ctx.lineTo(interpolatedPoint.x, interpolatedPoint.y);
  }
}

function _fill(ctx, cfg) {
  const {
    line,
    target,
    property,
    color,
    scale
  } = cfg;

  const segments = _segments(line, target, property);

  for (const {
    source: src,
    target: tgt,
    start,
    end
  } of segments) {
    const {
      style: {
        backgroundColor = color
      } = {}
    } = src;
    ctx.save();
    ctx.fillStyle = backgroundColor;
    clipBounds(ctx, scale, getBounds(property, start, end));
    ctx.beginPath();
    const lineLoop = !!line.pathSegment(ctx, src);

    if (lineLoop) {
      ctx.closePath();
    } else {
      interpolatedLineTo(ctx, target, end, property);
    }

    const targetLoop = !!target.pathSegment(ctx, tgt, {
      move: lineLoop,
      reverse: true
    });
    const loop = lineLoop && targetLoop;

    if (!loop) {
      interpolatedLineTo(ctx, target, start, property);
    }

    ctx.closePath();
    ctx.fill(loop ? 'evenodd' : 'nonzero');
    ctx.restore();
  }
}

function doFill(ctx, cfg) {
  const {
    line,
    target,
    above,
    below,
    area,
    scale
  } = cfg;
  const property = line._loop ? 'angle' : cfg.axis;
  ctx.save();

  if (property === 'x' && below !== above) {
    _clip(ctx, target, area.top);

    _fill(ctx, {
      line,
      target,
      color: above,
      scale,
      property
    });

    ctx.restore();
    ctx.save();

    _clip(ctx, target, area.bottom);
  }

  _fill(ctx, {
    line,
    target,
    color: below,
    scale,
    property
  });

  ctx.restore();
}

function drawfill(ctx, source, area) {
  const target = getTarget(source);
  const {
    line,
    scale,
    axis
  } = source;
  const lineOpts = line.options;
  const fillOption = lineOpts.fill;
  const color = lineOpts.backgroundColor;
  const {
    above = color,
    below = color
  } = fillOption || {};

  if (target && line.points.length) {
    (0, _helpersSegment.k)(ctx, area);
    doFill(ctx, {
      line,
      target,
      above,
      below,
      area,
      scale,
      axis
    });
    (0, _helpersSegment.m)(ctx);
  }
}

var plugin_filler = {
  id: 'filler',

  afterDatasetsUpdate(chart, _args, options) {
    const count = (chart.data.datasets || []).length;
    const sources = [];
    let meta, i, line, source;

    for (i = 0; i < count; ++i) {
      meta = chart.getDatasetMeta(i);
      line = meta.dataset;
      source = null;

      if (line && line.options && line instanceof LineElement) {
        source = {
          visible: chart.isDatasetVisible(i),
          index: i,
          fill: decodeFill(line, i, count),
          chart,
          axis: meta.controller.options.indexAxis,
          scale: meta.vScale,
          line
        };
      }

      meta.$filler = source;
      sources.push(source);
    }

    for (i = 0; i < count; ++i) {
      source = sources[i];

      if (!source || source.fill === false) {
        continue;
      }

      source.fill = resolveTarget(sources, i, options.propagate);
    }
  },

  beforeDraw(chart, _args, options) {
    const draw = options.drawTime === 'beforeDraw';
    const metasets = chart.getSortedVisibleDatasetMetas();
    const area = chart.chartArea;

    for (let i = metasets.length - 1; i >= 0; --i) {
      const source = metasets[i].$filler;

      if (!source) {
        continue;
      }

      source.line.updateControlPoints(area);

      if (draw) {
        drawfill(chart.ctx, source, area);
      }
    }
  },

  beforeDatasetsDraw(chart, _args, options) {
    if (options.drawTime !== 'beforeDatasetsDraw') {
      return;
    }

    const metasets = chart.getSortedVisibleDatasetMetas();

    for (let i = metasets.length - 1; i >= 0; --i) {
      const source = metasets[i].$filler;

      if (source) {
        drawfill(chart.ctx, source, chart.chartArea);
      }
    }
  },

  beforeDatasetDraw(chart, args, options) {
    const source = args.meta.$filler;

    if (!source || source.fill === false || options.drawTime !== 'beforeDatasetDraw') {
      return;
    }

    drawfill(chart.ctx, source, chart.chartArea);
  },

  defaults: {
    propagate: true,
    drawTime: 'beforeDatasetDraw'
  }
};
exports.Filler = plugin_filler;

const getBoxSize = (labelOpts, fontSize) => {
  let {
    boxHeight = fontSize,
    boxWidth = fontSize
  } = labelOpts;

  if (labelOpts.usePointStyle) {
    boxHeight = Math.min(boxHeight, fontSize);
    boxWidth = Math.min(boxWidth, fontSize);
  }

  return {
    boxWidth,
    boxHeight,
    itemHeight: Math.max(fontSize, boxHeight)
  };
};

const itemsEqual = (a, b) => a !== null && b !== null && a.datasetIndex === b.datasetIndex && a.index === b.index;

class Legend extends Element {
  constructor(config) {
    super();
    this._added = false;
    this.legendHitBoxes = [];
    this._hoveredItem = null;
    this.doughnutMode = false;
    this.chart = config.chart;
    this.options = config.options;
    this.ctx = config.ctx;
    this.legendItems = undefined;
    this.columnSizes = undefined;
    this.lineWidths = undefined;
    this.maxHeight = undefined;
    this.maxWidth = undefined;
    this.top = undefined;
    this.bottom = undefined;
    this.left = undefined;
    this.right = undefined;
    this.height = undefined;
    this.width = undefined;
    this._margins = undefined;
    this.position = undefined;
    this.weight = undefined;
    this.fullSize = undefined;
  }

  update(maxWidth, maxHeight, margins) {
    const me = this;
    me.maxWidth = maxWidth;
    me.maxHeight = maxHeight;
    me._margins = margins;
    me.setDimensions();
    me.buildLabels();
    me.fit();
  }

  setDimensions() {
    const me = this;

    if (me.isHorizontal()) {
      me.width = me.maxWidth;
      me.left = 0;
      me.right = me.width;
    } else {
      me.height = me.maxHeight;
      me.top = 0;
      me.bottom = me.height;
    }
  }

  buildLabels() {
    const me = this;
    const labelOpts = me.options.labels || {};
    let legendItems = (0, _helpersSegment.N)(labelOpts.generateLabels, [me.chart], me) || [];

    if (labelOpts.filter) {
      legendItems = legendItems.filter(item => labelOpts.filter(item, me.chart.data));
    }

    if (labelOpts.sort) {
      legendItems = legendItems.sort((a, b) => labelOpts.sort(a, b, me.chart.data));
    }

    if (me.options.reverse) {
      legendItems.reverse();
    }

    me.legendItems = legendItems;
  }

  fit() {
    const me = this;
    const {
      options,
      ctx
    } = me;

    if (!options.display) {
      me.width = me.height = 0;
      return;
    }

    const labelOpts = options.labels;
    const labelFont = (0, _helpersSegment.W)(labelOpts.font);
    const fontSize = labelFont.size;

    const titleHeight = me._computeTitleHeight();

    const {
      boxWidth,
      itemHeight
    } = getBoxSize(labelOpts, fontSize);
    let width, height;
    ctx.font = labelFont.string;

    if (me.isHorizontal()) {
      width = me.maxWidth;
      height = me._fitRows(titleHeight, fontSize, boxWidth, itemHeight) + 10;
    } else {
      height = me.maxHeight;
      width = me._fitCols(titleHeight, fontSize, boxWidth, itemHeight) + 10;
    }

    me.width = Math.min(width, options.maxWidth || me.maxWidth);
    me.height = Math.min(height, options.maxHeight || me.maxHeight);
  }

  _fitRows(titleHeight, fontSize, boxWidth, itemHeight) {
    const me = this;
    const {
      ctx,
      maxWidth,
      options: {
        labels: {
          padding
        }
      }
    } = me;
    const hitboxes = me.legendHitBoxes = [];
    const lineWidths = me.lineWidths = [0];
    const lineHeight = itemHeight + padding;
    let totalHeight = titleHeight;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    let row = -1;
    let top = -lineHeight;
    me.legendItems.forEach((legendItem, i) => {
      const itemWidth = boxWidth + fontSize / 2 + ctx.measureText(legendItem.text).width;

      if (i === 0 || lineWidths[lineWidths.length - 1] + itemWidth + 2 * padding > maxWidth) {
        totalHeight += lineHeight;
        lineWidths[lineWidths.length - (i > 0 ? 0 : 1)] = 0;
        top += lineHeight;
        row++;
      }

      hitboxes[i] = {
        left: 0,
        top,
        row,
        width: itemWidth,
        height: itemHeight
      };
      lineWidths[lineWidths.length - 1] += itemWidth + padding;
    });
    return totalHeight;
  }

  _fitCols(titleHeight, fontSize, boxWidth, itemHeight) {
    const me = this;
    const {
      ctx,
      maxHeight,
      options: {
        labels: {
          padding
        }
      }
    } = me;
    const hitboxes = me.legendHitBoxes = [];
    const columnSizes = me.columnSizes = [];
    const heightLimit = maxHeight - titleHeight;
    let totalWidth = padding;
    let currentColWidth = 0;
    let currentColHeight = 0;
    let left = 0;
    let top = 0;
    let col = 0;
    me.legendItems.forEach((legendItem, i) => {
      const itemWidth = boxWidth + fontSize / 2 + ctx.measureText(legendItem.text).width;

      if (i > 0 && currentColHeight + fontSize + 2 * padding > heightLimit) {
        totalWidth += currentColWidth + padding;
        columnSizes.push({
          width: currentColWidth,
          height: currentColHeight
        });
        left += currentColWidth + padding;
        col++;
        top = 0;
        currentColWidth = currentColHeight = 0;
      }

      currentColWidth = Math.max(currentColWidth, itemWidth);
      currentColHeight += fontSize + padding;
      hitboxes[i] = {
        left,
        top,
        col,
        width: itemWidth,
        height: itemHeight
      };
      top += itemHeight + padding;
    });
    totalWidth += currentColWidth;
    columnSizes.push({
      width: currentColWidth,
      height: currentColHeight
    });
    return totalWidth;
  }

  adjustHitBoxes() {
    const me = this;

    if (!me.options.display) {
      return;
    }

    const titleHeight = me._computeTitleHeight();

    const {
      legendHitBoxes: hitboxes,
      options: {
        align,
        labels: {
          padding
        }
      }
    } = me;

    if (this.isHorizontal()) {
      let row = 0;
      let left = (0, _helpersSegment.Y)(align, me.left + padding, me.right - me.lineWidths[row]);

      for (const hitbox of hitboxes) {
        if (row !== hitbox.row) {
          row = hitbox.row;
          left = (0, _helpersSegment.Y)(align, me.left + padding, me.right - me.lineWidths[row]);
        }

        hitbox.top += me.top + titleHeight + padding;
        hitbox.left = left;
        left += hitbox.width + padding;
      }
    } else {
      let col = 0;
      let top = (0, _helpersSegment.Y)(align, me.top + titleHeight + padding, me.bottom - me.columnSizes[col].height);

      for (const hitbox of hitboxes) {
        if (hitbox.col !== col) {
          col = hitbox.col;
          top = (0, _helpersSegment.Y)(align, me.top + titleHeight + padding, me.bottom - me.columnSizes[col].height);
        }

        hitbox.top = top;
        hitbox.left += me.left + padding;
        top += hitbox.height + padding;
      }
    }
  }

  isHorizontal() {
    return this.options.position === 'top' || this.options.position === 'bottom';
  }

  draw() {
    const me = this;

    if (me.options.display) {
      const ctx = me.ctx;
      (0, _helpersSegment.k)(ctx, me);

      me._draw();

      (0, _helpersSegment.m)(ctx);
    }
  }

  _draw() {
    const me = this;
    const {
      options: opts,
      columnSizes,
      lineWidths,
      ctx
    } = me;
    const {
      align,
      labels: labelOpts
    } = opts;
    const defaultColor = _helpersSegment.d.color;
    const rtlHelper = (0, _helpersSegment.at)(opts.rtl, me.left, me.width);
    const labelFont = (0, _helpersSegment.W)(labelOpts.font);
    const {
      color: fontColor,
      padding
    } = labelOpts;
    const fontSize = labelFont.size;
    const halfFontSize = fontSize / 2;
    let cursor;
    me.drawTitle();
    ctx.textAlign = rtlHelper.textAlign('left');
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 0.5;
    ctx.font = labelFont.string;
    const {
      boxWidth,
      boxHeight,
      itemHeight
    } = getBoxSize(labelOpts, fontSize);

    const drawLegendBox = function (x, y, legendItem) {
      if (isNaN(boxWidth) || boxWidth <= 0 || isNaN(boxHeight) || boxHeight < 0) {
        return;
      }

      ctx.save();
      const lineWidth = (0, _helpersSegment.v)(legendItem.lineWidth, 1);
      ctx.fillStyle = (0, _helpersSegment.v)(legendItem.fillStyle, defaultColor);
      ctx.lineCap = (0, _helpersSegment.v)(legendItem.lineCap, 'butt');
      ctx.lineDashOffset = (0, _helpersSegment.v)(legendItem.lineDashOffset, 0);
      ctx.lineJoin = (0, _helpersSegment.v)(legendItem.lineJoin, 'miter');
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = (0, _helpersSegment.v)(legendItem.strokeStyle, defaultColor);
      ctx.setLineDash((0, _helpersSegment.v)(legendItem.lineDash, []));

      if (labelOpts.usePointStyle) {
        const drawOptions = {
          radius: boxWidth * Math.SQRT2 / 2,
          pointStyle: legendItem.pointStyle,
          rotation: legendItem.rotation,
          borderWidth: lineWidth
        };
        const centerX = rtlHelper.xPlus(x, boxWidth / 2);
        const centerY = y + halfFontSize;
        (0, _helpersSegment.an)(ctx, drawOptions, centerX, centerY);
      } else {
        const yBoxTop = y + Math.max((fontSize - boxHeight) / 2, 0);
        const xBoxLeft = rtlHelper.leftForLtr(x, boxWidth);
        const borderRadius = (0, _helpersSegment.aq)(legendItem.borderRadius);
        ctx.beginPath();

        if (Object.values(borderRadius).some(v => v !== 0)) {
          (0, _helpersSegment.ao)(ctx, {
            x: xBoxLeft,
            y: yBoxTop,
            w: boxWidth,
            h: boxHeight,
            radius: borderRadius
          });
        } else {
          ctx.rect(xBoxLeft, yBoxTop, boxWidth, boxHeight);
        }

        ctx.fill();

        if (lineWidth !== 0) {
          ctx.stroke();
        }
      }

      ctx.restore();
    };

    const fillText = function (x, y, legendItem) {
      (0, _helpersSegment.V)(ctx, legendItem.text, x, y + itemHeight / 2, labelFont, {
        strikethrough: legendItem.hidden,
        textAlign: legendItem.textAlign
      });
    };

    const isHorizontal = me.isHorizontal();

    const titleHeight = this._computeTitleHeight();

    if (isHorizontal) {
      cursor = {
        x: (0, _helpersSegment.Y)(align, me.left + padding, me.right - lineWidths[0]),
        y: me.top + padding + titleHeight,
        line: 0
      };
    } else {
      cursor = {
        x: me.left + padding,
        y: (0, _helpersSegment.Y)(align, me.top + titleHeight + padding, me.bottom - columnSizes[0].height),
        line: 0
      };
    }

    (0, _helpersSegment.au)(me.ctx, opts.textDirection);
    const lineHeight = itemHeight + padding;
    me.legendItems.forEach((legendItem, i) => {
      ctx.strokeStyle = legendItem.fontColor || fontColor;
      ctx.fillStyle = legendItem.fontColor || fontColor;
      const textWidth = ctx.measureText(legendItem.text).width;
      const textAlign = rtlHelper.textAlign(legendItem.textAlign || (legendItem.textAlign = labelOpts.textAlign));
      const width = boxWidth + fontSize / 2 + textWidth;
      let x = cursor.x;
      let y = cursor.y;
      rtlHelper.setWidth(me.width);

      if (isHorizontal) {
        if (i > 0 && x + width + padding > me.right) {
          y = cursor.y += lineHeight;
          cursor.line++;
          x = cursor.x = (0, _helpersSegment.Y)(align, me.left + padding, me.right - lineWidths[cursor.line]);
        }
      } else if (i > 0 && y + lineHeight > me.bottom) {
        x = cursor.x = x + columnSizes[cursor.line].width + padding;
        cursor.line++;
        y = cursor.y = (0, _helpersSegment.Y)(align, me.top + titleHeight + padding, me.bottom - columnSizes[cursor.line].height);
      }

      const realX = rtlHelper.x(x);
      drawLegendBox(realX, y, legendItem);
      x = (0, _helpersSegment.av)(textAlign, x + boxWidth + halfFontSize, me.right);
      fillText(rtlHelper.x(x), y, legendItem);

      if (isHorizontal) {
        cursor.x += width + padding;
      } else {
        cursor.y += lineHeight;
      }
    });
    (0, _helpersSegment.aw)(me.ctx, opts.textDirection);
  }

  drawTitle() {
    const me = this;
    const opts = me.options;
    const titleOpts = opts.title;
    const titleFont = (0, _helpersSegment.W)(titleOpts.font);
    const titlePadding = (0, _helpersSegment.C)(titleOpts.padding);

    if (!titleOpts.display) {
      return;
    }

    const rtlHelper = (0, _helpersSegment.at)(opts.rtl, me.left, me.width);
    const ctx = me.ctx;
    const position = titleOpts.position;
    const halfFontSize = titleFont.size / 2;
    const topPaddingPlusHalfFontSize = titlePadding.top + halfFontSize;
    let y;
    let left = me.left;
    let maxWidth = me.width;

    if (this.isHorizontal()) {
      maxWidth = Math.max(...me.lineWidths);
      y = me.top + topPaddingPlusHalfFontSize;
      left = (0, _helpersSegment.Y)(opts.align, left, me.right - maxWidth);
    } else {
      const maxHeight = me.columnSizes.reduce((acc, size) => Math.max(acc, size.height), 0);
      y = topPaddingPlusHalfFontSize + (0, _helpersSegment.Y)(opts.align, me.top, me.bottom - maxHeight - opts.labels.padding - me._computeTitleHeight());
    }

    const x = (0, _helpersSegment.Y)(position, left, left + maxWidth);
    ctx.textAlign = rtlHelper.textAlign((0, _helpersSegment.X)(position));
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = titleOpts.color;
    ctx.fillStyle = titleOpts.color;
    ctx.font = titleFont.string;
    (0, _helpersSegment.V)(ctx, titleOpts.text, x, y, titleFont);
  }

  _computeTitleHeight() {
    const titleOpts = this.options.title;
    const titleFont = (0, _helpersSegment.W)(titleOpts.font);
    const titlePadding = (0, _helpersSegment.C)(titleOpts.padding);
    return titleOpts.display ? titleFont.lineHeight + titlePadding.height : 0;
  }

  _getLegendItemAt(x, y) {
    const me = this;
    let i, hitBox, lh;

    if (x >= me.left && x <= me.right && y >= me.top && y <= me.bottom) {
      lh = me.legendHitBoxes;

      for (i = 0; i < lh.length; ++i) {
        hitBox = lh[i];

        if (x >= hitBox.left && x <= hitBox.left + hitBox.width && y >= hitBox.top && y <= hitBox.top + hitBox.height) {
          return me.legendItems[i];
        }
      }
    }

    return null;
  }

  handleEvent(e) {
    const me = this;
    const opts = me.options;

    if (!isListened(e.type, opts)) {
      return;
    }

    const hoveredItem = me._getLegendItemAt(e.x, e.y);

    if (e.type === 'mousemove') {
      const previous = me._hoveredItem;
      const sameItem = itemsEqual(previous, hoveredItem);

      if (previous && !sameItem) {
        (0, _helpersSegment.N)(opts.onLeave, [e, previous, me], me);
      }

      me._hoveredItem = hoveredItem;

      if (hoveredItem && !sameItem) {
        (0, _helpersSegment.N)(opts.onHover, [e, hoveredItem, me], me);
      }
    } else if (hoveredItem) {
      (0, _helpersSegment.N)(opts.onClick, [e, hoveredItem, me], me);
    }
  }

}

function isListened(type, opts) {
  if (type === 'mousemove' && (opts.onHover || opts.onLeave)) {
    return true;
  }

  if (opts.onClick && (type === 'click' || type === 'mouseup')) {
    return true;
  }

  return false;
}

var plugin_legend = {
  id: 'legend',
  _element: Legend,

  start(chart, _args, options) {
    const legend = chart.legend = new Legend({
      ctx: chart.ctx,
      options,
      chart
    });
    layouts.configure(chart, legend, options);
    layouts.addBox(chart, legend);
  },

  stop(chart) {
    layouts.removeBox(chart, chart.legend);
    delete chart.legend;
  },

  beforeUpdate(chart, _args, options) {
    const legend = chart.legend;
    layouts.configure(chart, legend, options);
    legend.options = options;
  },

  afterUpdate(chart) {
    const legend = chart.legend;
    legend.buildLabels();
    legend.adjustHitBoxes();
  },

  afterEvent(chart, args) {
    if (!args.replay) {
      chart.legend.handleEvent(args.event);
    }
  },

  defaults: {
    display: true,
    position: 'top',
    align: 'center',
    fullSize: true,
    reverse: false,
    weight: 1000,

    onClick(e, legendItem, legend) {
      const index = legendItem.datasetIndex;
      const ci = legend.chart;

      if (ci.isDatasetVisible(index)) {
        ci.hide(index);
        legendItem.hidden = true;
      } else {
        ci.show(index);
        legendItem.hidden = false;
      }
    },

    onHover: null,
    onLeave: null,
    labels: {
      color: ctx => ctx.chart.options.color,
      boxWidth: 40,
      padding: 10,

      generateLabels(chart) {
        const datasets = chart.data.datasets;
        const {
          labels: {
            usePointStyle,
            pointStyle,
            textAlign,
            color
          }
        } = chart.legend.options;
        return chart._getSortedDatasetMetas().map(meta => {
          const style = meta.controller.getStyle(usePointStyle ? 0 : undefined);
          const borderWidth = (0, _helpersSegment.C)(style.borderWidth);
          return {
            text: datasets[meta.index].label,
            fillStyle: style.backgroundColor,
            fontColor: color,
            hidden: !meta.visible,
            lineCap: style.borderCapStyle,
            lineDash: style.borderDash,
            lineDashOffset: style.borderDashOffset,
            lineJoin: style.borderJoinStyle,
            lineWidth: (borderWidth.width + borderWidth.height) / 4,
            strokeStyle: style.borderColor,
            pointStyle: pointStyle || style.pointStyle,
            rotation: style.rotation,
            textAlign: textAlign || style.textAlign,
            borderRadius: 0,
            datasetIndex: meta.index
          };
        }, this);
      }

    },
    title: {
      color: ctx => ctx.chart.options.color,
      display: false,
      position: 'center',
      text: ''
    }
  },
  descriptors: {
    _scriptable: name => !name.startsWith('on'),
    labels: {
      _scriptable: name => !['generateLabels', 'filter', 'sort'].includes(name)
    }
  }
};
exports.Legend = plugin_legend;

class Title extends Element {
  constructor(config) {
    super();
    this.chart = config.chart;
    this.options = config.options;
    this.ctx = config.ctx;
    this._padding = undefined;
    this.top = undefined;
    this.bottom = undefined;
    this.left = undefined;
    this.right = undefined;
    this.width = undefined;
    this.height = undefined;
    this.position = undefined;
    this.weight = undefined;
    this.fullSize = undefined;
  }

  update(maxWidth, maxHeight) {
    const me = this;
    const opts = me.options;
    me.left = 0;
    me.top = 0;

    if (!opts.display) {
      me.width = me.height = me.right = me.bottom = 0;
      return;
    }

    me.width = me.right = maxWidth;
    me.height = me.bottom = maxHeight;
    const lineCount = (0, _helpersSegment.b)(opts.text) ? opts.text.length : 1;
    me._padding = (0, _helpersSegment.C)(opts.padding);

    const textSize = lineCount * (0, _helpersSegment.W)(opts.font).lineHeight + me._padding.height;

    if (me.isHorizontal()) {
      me.height = textSize;
    } else {
      me.width = textSize;
    }
  }

  isHorizontal() {
    const pos = this.options.position;
    return pos === 'top' || pos === 'bottom';
  }

  _drawArgs(offset) {
    const {
      top,
      left,
      bottom,
      right,
      options
    } = this;
    const align = options.align;
    let rotation = 0;
    let maxWidth, titleX, titleY;

    if (this.isHorizontal()) {
      titleX = (0, _helpersSegment.Y)(align, left, right);
      titleY = top + offset;
      maxWidth = right - left;
    } else {
      if (options.position === 'left') {
        titleX = left + offset;
        titleY = (0, _helpersSegment.Y)(align, bottom, top);
        rotation = _helpersSegment.P * -0.5;
      } else {
        titleX = right - offset;
        titleY = (0, _helpersSegment.Y)(align, top, bottom);
        rotation = _helpersSegment.P * 0.5;
      }

      maxWidth = bottom - top;
    }

    return {
      titleX,
      titleY,
      maxWidth,
      rotation
    };
  }

  draw() {
    const me = this;
    const ctx = me.ctx;
    const opts = me.options;

    if (!opts.display) {
      return;
    }

    const fontOpts = (0, _helpersSegment.W)(opts.font);
    const lineHeight = fontOpts.lineHeight;
    const offset = lineHeight / 2 + me._padding.top;

    const {
      titleX,
      titleY,
      maxWidth,
      rotation
    } = me._drawArgs(offset);

    (0, _helpersSegment.V)(ctx, opts.text, 0, 0, fontOpts, {
      color: opts.color,
      maxWidth,
      rotation,
      textAlign: (0, _helpersSegment.X)(opts.align),
      textBaseline: 'middle',
      translation: [titleX, titleY]
    });
  }

}

function createTitle(chart, titleOpts) {
  const title = new Title({
    ctx: chart.ctx,
    options: titleOpts,
    chart
  });
  layouts.configure(chart, title, titleOpts);
  layouts.addBox(chart, title);
  chart.titleBlock = title;
}

var plugin_title = {
  id: 'title',
  _element: Title,

  start(chart, _args, options) {
    createTitle(chart, options);
  },

  stop(chart) {
    const titleBlock = chart.titleBlock;
    layouts.removeBox(chart, titleBlock);
    delete chart.titleBlock;
  },

  beforeUpdate(chart, _args, options) {
    const title = chart.titleBlock;
    layouts.configure(chart, title, options);
    title.options = options;
  },

  defaults: {
    align: 'center',
    display: false,
    font: {
      weight: 'bold'
    },
    fullSize: true,
    padding: 10,
    position: 'top',
    text: '',
    weight: 2000
  },
  defaultRoutes: {
    color: 'color'
  },
  descriptors: {
    _scriptable: true,
    _indexable: false
  }
};
exports.Title = plugin_title;
const positioners = {
  average(items) {
    if (!items.length) {
      return false;
    }

    let i, len;
    let x = 0;
    let y = 0;
    let count = 0;

    for (i = 0, len = items.length; i < len; ++i) {
      const el = items[i].element;

      if (el && el.hasValue()) {
        const pos = el.tooltipPosition();
        x += pos.x;
        y += pos.y;
        ++count;
      }
    }

    return {
      x: x / count,
      y: y / count
    };
  },

  nearest(items, eventPosition) {
    if (!items.length) {
      return false;
    }

    let x = eventPosition.x;
    let y = eventPosition.y;
    let minDistance = Number.POSITIVE_INFINITY;
    let i, len, nearestElement;

    for (i = 0, len = items.length; i < len; ++i) {
      const el = items[i].element;

      if (el && el.hasValue()) {
        const center = el.getCenterPoint();
        const d = (0, _helpersSegment.ay)(eventPosition, center);

        if (d < minDistance) {
          minDistance = d;
          nearestElement = el;
        }
      }
    }

    if (nearestElement) {
      const tp = nearestElement.tooltipPosition();
      x = tp.x;
      y = tp.y;
    }

    return {
      x,
      y
    };
  }

};

function pushOrConcat(base, toPush) {
  if (toPush) {
    if ((0, _helpersSegment.b)(toPush)) {
      Array.prototype.push.apply(base, toPush);
    } else {
      base.push(toPush);
    }
  }

  return base;
}

function splitNewlines(str) {
  if ((typeof str === 'string' || str instanceof String) && str.indexOf('\n') > -1) {
    return str.split('\n');
  }

  return str;
}

function createTooltipItem(chart, item) {
  const {
    element,
    datasetIndex,
    index
  } = item;
  const controller = chart.getDatasetMeta(datasetIndex).controller;
  const {
    label,
    value
  } = controller.getLabelAndValue(index);
  return {
    chart,
    label,
    parsed: controller.getParsed(index),
    raw: chart.data.datasets[datasetIndex].data[index],
    formattedValue: value,
    dataset: controller.getDataset(),
    dataIndex: index,
    datasetIndex,
    element
  };
}

function getTooltipSize(tooltip, options) {
  const ctx = tooltip._chart.ctx;
  const {
    body,
    footer,
    title
  } = tooltip;
  const {
    boxWidth,
    boxHeight
  } = options;
  const bodyFont = (0, _helpersSegment.W)(options.bodyFont);
  const titleFont = (0, _helpersSegment.W)(options.titleFont);
  const footerFont = (0, _helpersSegment.W)(options.footerFont);
  const titleLineCount = title.length;
  const footerLineCount = footer.length;
  const bodyLineItemCount = body.length;
  const padding = (0, _helpersSegment.C)(options.padding);
  let height = padding.height;
  let width = 0;
  let combinedBodyLength = body.reduce((count, bodyItem) => count + bodyItem.before.length + bodyItem.lines.length + bodyItem.after.length, 0);
  combinedBodyLength += tooltip.beforeBody.length + tooltip.afterBody.length;

  if (titleLineCount) {
    height += titleLineCount * titleFont.lineHeight + (titleLineCount - 1) * options.titleSpacing + options.titleMarginBottom;
  }

  if (combinedBodyLength) {
    const bodyLineHeight = options.displayColors ? Math.max(boxHeight, bodyFont.lineHeight) : bodyFont.lineHeight;
    height += bodyLineItemCount * bodyLineHeight + (combinedBodyLength - bodyLineItemCount) * bodyFont.lineHeight + (combinedBodyLength - 1) * options.bodySpacing;
  }

  if (footerLineCount) {
    height += options.footerMarginTop + footerLineCount * footerFont.lineHeight + (footerLineCount - 1) * options.footerSpacing;
  }

  let widthPadding = 0;

  const maxLineWidth = function (line) {
    width = Math.max(width, ctx.measureText(line).width + widthPadding);
  };

  ctx.save();
  ctx.font = titleFont.string;
  (0, _helpersSegment.D)(tooltip.title, maxLineWidth);
  ctx.font = bodyFont.string;
  (0, _helpersSegment.D)(tooltip.beforeBody.concat(tooltip.afterBody), maxLineWidth);
  widthPadding = options.displayColors ? boxWidth + 2 : 0;
  (0, _helpersSegment.D)(body, bodyItem => {
    (0, _helpersSegment.D)(bodyItem.before, maxLineWidth);
    (0, _helpersSegment.D)(bodyItem.lines, maxLineWidth);
    (0, _helpersSegment.D)(bodyItem.after, maxLineWidth);
  });
  widthPadding = 0;
  ctx.font = footerFont.string;
  (0, _helpersSegment.D)(tooltip.footer, maxLineWidth);
  ctx.restore();
  width += padding.width;
  return {
    width,
    height
  };
}

function determineYAlign(chart, size) {
  const {
    y,
    height
  } = size;

  if (y < height / 2) {
    return 'top';
  } else if (y > chart.height - height / 2) {
    return 'bottom';
  }

  return 'center';
}

function doesNotFitWithAlign(xAlign, chart, options, size) {
  const {
    x,
    width
  } = size;
  const caret = options.caretSize + options.caretPadding;

  if (xAlign === 'left' && x + width + caret > chart.width) {
    return true;
  }

  if (xAlign === 'right' && x - width - caret < 0) {
    return true;
  }
}

function determineXAlign(chart, options, size, yAlign) {
  const {
    x,
    width
  } = size;
  const {
    width: chartWidth,
    chartArea: {
      left,
      right
    }
  } = chart;
  let xAlign = 'center';

  if (yAlign === 'center') {
    xAlign = x <= (left + right) / 2 ? 'left' : 'right';
  } else if (x <= width / 2) {
    xAlign = 'left';
  } else if (x >= chartWidth - width / 2) {
    xAlign = 'right';
  }

  if (doesNotFitWithAlign(xAlign, chart, options, size)) {
    xAlign = 'center';
  }

  return xAlign;
}

function determineAlignment(chart, options, size) {
  const yAlign = options.yAlign || determineYAlign(chart, size);
  return {
    xAlign: options.xAlign || determineXAlign(chart, options, size, yAlign),
    yAlign
  };
}

function alignX(size, xAlign) {
  let {
    x,
    width
  } = size;

  if (xAlign === 'right') {
    x -= width;
  } else if (xAlign === 'center') {
    x -= width / 2;
  }

  return x;
}

function alignY(size, yAlign, paddingAndSize) {
  let {
    y,
    height
  } = size;

  if (yAlign === 'top') {
    y += paddingAndSize;
  } else if (yAlign === 'bottom') {
    y -= height + paddingAndSize;
  } else {
    y -= height / 2;
  }

  return y;
}

function getBackgroundPoint(options, size, alignment, chart) {
  const {
    caretSize,
    caretPadding,
    cornerRadius
  } = options;
  const {
    xAlign,
    yAlign
  } = alignment;
  const paddingAndSize = caretSize + caretPadding;
  const radiusAndPadding = cornerRadius + caretPadding;
  let x = alignX(size, xAlign);
  const y = alignY(size, yAlign, paddingAndSize);

  if (yAlign === 'center') {
    if (xAlign === 'left') {
      x += paddingAndSize;
    } else if (xAlign === 'right') {
      x -= paddingAndSize;
    }
  } else if (xAlign === 'left') {
    x -= radiusAndPadding;
  } else if (xAlign === 'right') {
    x += radiusAndPadding;
  }

  return {
    x: (0, _helpersSegment.x)(x, 0, chart.width - size.width),
    y: (0, _helpersSegment.x)(y, 0, chart.height - size.height)
  };
}

function getAlignedX(tooltip, align, options) {
  const padding = (0, _helpersSegment.C)(options.padding);
  return align === 'center' ? tooltip.x + tooltip.width / 2 : align === 'right' ? tooltip.x + tooltip.width - padding.right : tooltip.x + padding.left;
}

function getBeforeAfterBodyLines(callback) {
  return pushOrConcat([], splitNewlines(callback));
}

function createTooltipContext(parent, tooltip, tooltipItems) {
  return Object.assign(Object.create(parent), {
    tooltip,
    tooltipItems,
    type: 'tooltip'
  });
}

function overrideCallbacks(callbacks, context) {
  const override = context && context.dataset && context.dataset.tooltip && context.dataset.tooltip.callbacks;
  return override ? callbacks.override(override) : callbacks;
}

class Tooltip extends Element {
  constructor(config) {
    super();
    this.opacity = 0;
    this._active = [];
    this._chart = config._chart;
    this._eventPosition = undefined;
    this._size = undefined;
    this._cachedAnimations = undefined;
    this._tooltipItems = [];
    this.$animations = undefined;
    this.$context = undefined;
    this.options = config.options;
    this.dataPoints = undefined;
    this.title = undefined;
    this.beforeBody = undefined;
    this.body = undefined;
    this.afterBody = undefined;
    this.footer = undefined;
    this.xAlign = undefined;
    this.yAlign = undefined;
    this.x = undefined;
    this.y = undefined;
    this.height = undefined;
    this.width = undefined;
    this.caretX = undefined;
    this.caretY = undefined;
    this.labelColors = undefined;
    this.labelPointStyles = undefined;
    this.labelTextColors = undefined;
  }

  initialize(options) {
    this.options = options;
    this._cachedAnimations = undefined;
    this.$context = undefined;
  }

  _resolveAnimations() {
    const me = this;
    const cached = me._cachedAnimations;

    if (cached) {
      return cached;
    }

    const chart = me._chart;
    const options = me.options.setContext(me.getContext());
    const opts = options.enabled && chart.options.animation && options.animations;
    const animations = new Animations(me._chart, opts);

    if (opts._cacheable) {
      me._cachedAnimations = Object.freeze(animations);
    }

    return animations;
  }

  getContext() {
    const me = this;
    return me.$context || (me.$context = createTooltipContext(me._chart.getContext(), me, me._tooltipItems));
  }

  getTitle(context, options) {
    const me = this;
    const {
      callbacks
    } = options;
    const beforeTitle = callbacks.beforeTitle.apply(me, [context]);
    const title = callbacks.title.apply(me, [context]);
    const afterTitle = callbacks.afterTitle.apply(me, [context]);
    let lines = [];
    lines = pushOrConcat(lines, splitNewlines(beforeTitle));
    lines = pushOrConcat(lines, splitNewlines(title));
    lines = pushOrConcat(lines, splitNewlines(afterTitle));
    return lines;
  }

  getBeforeBody(tooltipItems, options) {
    return getBeforeAfterBodyLines(options.callbacks.beforeBody.apply(this, [tooltipItems]));
  }

  getBody(tooltipItems, options) {
    const me = this;
    const {
      callbacks
    } = options;
    const bodyItems = [];
    (0, _helpersSegment.D)(tooltipItems, context => {
      const bodyItem = {
        before: [],
        lines: [],
        after: []
      };
      const scoped = overrideCallbacks(callbacks, context);
      pushOrConcat(bodyItem.before, splitNewlines(scoped.beforeLabel.call(me, context)));
      pushOrConcat(bodyItem.lines, scoped.label.call(me, context));
      pushOrConcat(bodyItem.after, splitNewlines(scoped.afterLabel.call(me, context)));
      bodyItems.push(bodyItem);
    });
    return bodyItems;
  }

  getAfterBody(tooltipItems, options) {
    return getBeforeAfterBodyLines(options.callbacks.afterBody.apply(this, [tooltipItems]));
  }

  getFooter(tooltipItems, options) {
    const me = this;
    const {
      callbacks
    } = options;
    const beforeFooter = callbacks.beforeFooter.apply(me, [tooltipItems]);
    const footer = callbacks.footer.apply(me, [tooltipItems]);
    const afterFooter = callbacks.afterFooter.apply(me, [tooltipItems]);
    let lines = [];
    lines = pushOrConcat(lines, splitNewlines(beforeFooter));
    lines = pushOrConcat(lines, splitNewlines(footer));
    lines = pushOrConcat(lines, splitNewlines(afterFooter));
    return lines;
  }

  _createItems(options) {
    const me = this;
    const active = me._active;
    const data = me._chart.data;
    const labelColors = [];
    const labelPointStyles = [];
    const labelTextColors = [];
    let tooltipItems = [];
    let i, len;

    for (i = 0, len = active.length; i < len; ++i) {
      tooltipItems.push(createTooltipItem(me._chart, active[i]));
    }

    if (options.filter) {
      tooltipItems = tooltipItems.filter((element, index, array) => options.filter(element, index, array, data));
    }

    if (options.itemSort) {
      tooltipItems = tooltipItems.sort((a, b) => options.itemSort(a, b, data));
    }

    (0, _helpersSegment.D)(tooltipItems, context => {
      const scoped = overrideCallbacks(options.callbacks, context);
      labelColors.push(scoped.labelColor.call(me, context));
      labelPointStyles.push(scoped.labelPointStyle.call(me, context));
      labelTextColors.push(scoped.labelTextColor.call(me, context));
    });
    me.labelColors = labelColors;
    me.labelPointStyles = labelPointStyles;
    me.labelTextColors = labelTextColors;
    me.dataPoints = tooltipItems;
    return tooltipItems;
  }

  update(changed, replay) {
    const me = this;
    const options = me.options.setContext(me.getContext());
    const active = me._active;
    let properties;
    let tooltipItems = [];

    if (!active.length) {
      if (me.opacity !== 0) {
        properties = {
          opacity: 0
        };
      }
    } else {
      const position = positioners[options.position].call(me, active, me._eventPosition);
      tooltipItems = me._createItems(options);
      me.title = me.getTitle(tooltipItems, options);
      me.beforeBody = me.getBeforeBody(tooltipItems, options);
      me.body = me.getBody(tooltipItems, options);
      me.afterBody = me.getAfterBody(tooltipItems, options);
      me.footer = me.getFooter(tooltipItems, options);
      const size = me._size = getTooltipSize(me, options);
      const positionAndSize = Object.assign({}, position, size);
      const alignment = determineAlignment(me._chart, options, positionAndSize);
      const backgroundPoint = getBackgroundPoint(options, positionAndSize, alignment, me._chart);
      me.xAlign = alignment.xAlign;
      me.yAlign = alignment.yAlign;
      properties = {
        opacity: 1,
        x: backgroundPoint.x,
        y: backgroundPoint.y,
        width: size.width,
        height: size.height,
        caretX: position.x,
        caretY: position.y
      };
    }

    me._tooltipItems = tooltipItems;
    me.$context = undefined;

    if (properties) {
      me._resolveAnimations().update(me, properties);
    }

    if (changed && options.external) {
      options.external.call(me, {
        chart: me._chart,
        tooltip: me,
        replay
      });
    }
  }

  drawCaret(tooltipPoint, ctx, size, options) {
    const caretPosition = this.getCaretPosition(tooltipPoint, size, options);
    ctx.lineTo(caretPosition.x1, caretPosition.y1);
    ctx.lineTo(caretPosition.x2, caretPosition.y2);
    ctx.lineTo(caretPosition.x3, caretPosition.y3);
  }

  getCaretPosition(tooltipPoint, size, options) {
    const {
      xAlign,
      yAlign
    } = this;
    const {
      cornerRadius,
      caretSize
    } = options;
    const {
      x: ptX,
      y: ptY
    } = tooltipPoint;
    const {
      width,
      height
    } = size;
    let x1, x2, x3, y1, y2, y3;

    if (yAlign === 'center') {
      y2 = ptY + height / 2;

      if (xAlign === 'left') {
        x1 = ptX;
        x2 = x1 - caretSize;
        y1 = y2 + caretSize;
        y3 = y2 - caretSize;
      } else {
        x1 = ptX + width;
        x2 = x1 + caretSize;
        y1 = y2 - caretSize;
        y3 = y2 + caretSize;
      }

      x3 = x1;
    } else {
      if (xAlign === 'left') {
        x2 = ptX + cornerRadius + caretSize;
      } else if (xAlign === 'right') {
        x2 = ptX + width - cornerRadius - caretSize;
      } else {
        x2 = this.caretX;
      }

      if (yAlign === 'top') {
        y1 = ptY;
        y2 = y1 - caretSize;
        x1 = x2 - caretSize;
        x3 = x2 + caretSize;
      } else {
        y1 = ptY + height;
        y2 = y1 + caretSize;
        x1 = x2 + caretSize;
        x3 = x2 - caretSize;
      }

      y3 = y1;
    }

    return {
      x1,
      x2,
      x3,
      y1,
      y2,
      y3
    };
  }

  drawTitle(pt, ctx, options) {
    const me = this;
    const title = me.title;
    const length = title.length;
    let titleFont, titleSpacing, i;

    if (length) {
      const rtlHelper = (0, _helpersSegment.at)(options.rtl, me.x, me.width);
      pt.x = getAlignedX(me, options.titleAlign, options);
      ctx.textAlign = rtlHelper.textAlign(options.titleAlign);
      ctx.textBaseline = 'middle';
      titleFont = (0, _helpersSegment.W)(options.titleFont);
      titleSpacing = options.titleSpacing;
      ctx.fillStyle = options.titleColor;
      ctx.font = titleFont.string;

      for (i = 0; i < length; ++i) {
        ctx.fillText(title[i], rtlHelper.x(pt.x), pt.y + titleFont.lineHeight / 2);
        pt.y += titleFont.lineHeight + titleSpacing;

        if (i + 1 === length) {
          pt.y += options.titleMarginBottom - titleSpacing;
        }
      }
    }
  }

  _drawColorBox(ctx, pt, i, rtlHelper, options) {
    const me = this;
    const labelColors = me.labelColors[i];
    const labelPointStyle = me.labelPointStyles[i];
    const {
      boxHeight,
      boxWidth
    } = options;
    const bodyFont = (0, _helpersSegment.W)(options.bodyFont);
    const colorX = getAlignedX(me, 'left', options);
    const rtlColorX = rtlHelper.x(colorX);
    const yOffSet = boxHeight < bodyFont.lineHeight ? (bodyFont.lineHeight - boxHeight) / 2 : 0;
    const colorY = pt.y + yOffSet;

    if (options.usePointStyle) {
      const drawOptions = {
        radius: Math.min(boxWidth, boxHeight) / 2,
        pointStyle: labelPointStyle.pointStyle,
        rotation: labelPointStyle.rotation,
        borderWidth: 1
      };
      const centerX = rtlHelper.leftForLtr(rtlColorX, boxWidth) + boxWidth / 2;
      const centerY = colorY + boxHeight / 2;
      ctx.strokeStyle = options.multiKeyBackground;
      ctx.fillStyle = options.multiKeyBackground;
      (0, _helpersSegment.an)(ctx, drawOptions, centerX, centerY);
      ctx.strokeStyle = labelColors.borderColor;
      ctx.fillStyle = labelColors.backgroundColor;
      (0, _helpersSegment.an)(ctx, drawOptions, centerX, centerY);
    } else {
      ctx.lineWidth = labelColors.borderWidth || 1;
      ctx.strokeStyle = labelColors.borderColor;
      ctx.setLineDash(labelColors.borderDash || []);
      ctx.lineDashOffset = labelColors.borderDashOffset || 0;
      const outerX = rtlHelper.leftForLtr(rtlColorX, boxWidth);
      const innerX = rtlHelper.leftForLtr(rtlHelper.xPlus(rtlColorX, 1), boxWidth - 2);
      const borderRadius = (0, _helpersSegment.aq)(labelColors.borderRadius);

      if (Object.values(borderRadius).some(v => v !== 0)) {
        ctx.beginPath();
        ctx.fillStyle = options.multiKeyBackground;
        (0, _helpersSegment.ao)(ctx, {
          x: outerX,
          y: colorY,
          w: boxWidth,
          h: boxHeight,
          radius: borderRadius
        });
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = labelColors.backgroundColor;
        ctx.beginPath();
        (0, _helpersSegment.ao)(ctx, {
          x: innerX,
          y: colorY + 1,
          w: boxWidth - 2,
          h: boxHeight - 2,
          radius: borderRadius
        });
        ctx.fill();
      } else {
        ctx.fillStyle = options.multiKeyBackground;
        ctx.fillRect(outerX, colorY, boxWidth, boxHeight);
        ctx.strokeRect(outerX, colorY, boxWidth, boxHeight);
        ctx.fillStyle = labelColors.backgroundColor;
        ctx.fillRect(innerX, colorY + 1, boxWidth - 2, boxHeight - 2);
      }
    }

    ctx.fillStyle = me.labelTextColors[i];
  }

  drawBody(pt, ctx, options) {
    const me = this;
    const {
      body
    } = me;
    const {
      bodySpacing,
      bodyAlign,
      displayColors,
      boxHeight,
      boxWidth
    } = options;
    const bodyFont = (0, _helpersSegment.W)(options.bodyFont);
    let bodyLineHeight = bodyFont.lineHeight;
    let xLinePadding = 0;
    const rtlHelper = (0, _helpersSegment.at)(options.rtl, me.x, me.width);

    const fillLineOfText = function (line) {
      ctx.fillText(line, rtlHelper.x(pt.x + xLinePadding), pt.y + bodyLineHeight / 2);
      pt.y += bodyLineHeight + bodySpacing;
    };

    const bodyAlignForCalculation = rtlHelper.textAlign(bodyAlign);
    let bodyItem, textColor, lines, i, j, ilen, jlen;
    ctx.textAlign = bodyAlign;
    ctx.textBaseline = 'middle';
    ctx.font = bodyFont.string;
    pt.x = getAlignedX(me, bodyAlignForCalculation, options);
    ctx.fillStyle = options.bodyColor;
    (0, _helpersSegment.D)(me.beforeBody, fillLineOfText);
    xLinePadding = displayColors && bodyAlignForCalculation !== 'right' ? bodyAlign === 'center' ? boxWidth / 2 + 1 : boxWidth + 2 : 0;

    for (i = 0, ilen = body.length; i < ilen; ++i) {
      bodyItem = body[i];
      textColor = me.labelTextColors[i];
      ctx.fillStyle = textColor;
      (0, _helpersSegment.D)(bodyItem.before, fillLineOfText);
      lines = bodyItem.lines;

      if (displayColors && lines.length) {
        me._drawColorBox(ctx, pt, i, rtlHelper, options);

        bodyLineHeight = Math.max(bodyFont.lineHeight, boxHeight);
      }

      for (j = 0, jlen = lines.length; j < jlen; ++j) {
        fillLineOfText(lines[j]);
        bodyLineHeight = bodyFont.lineHeight;
      }

      (0, _helpersSegment.D)(bodyItem.after, fillLineOfText);
    }

    xLinePadding = 0;
    bodyLineHeight = bodyFont.lineHeight;
    (0, _helpersSegment.D)(me.afterBody, fillLineOfText);
    pt.y -= bodySpacing;
  }

  drawFooter(pt, ctx, options) {
    const me = this;
    const footer = me.footer;
    const length = footer.length;
    let footerFont, i;

    if (length) {
      const rtlHelper = (0, _helpersSegment.at)(options.rtl, me.x, me.width);
      pt.x = getAlignedX(me, options.footerAlign, options);
      pt.y += options.footerMarginTop;
      ctx.textAlign = rtlHelper.textAlign(options.footerAlign);
      ctx.textBaseline = 'middle';
      footerFont = (0, _helpersSegment.W)(options.footerFont);
      ctx.fillStyle = options.footerColor;
      ctx.font = footerFont.string;

      for (i = 0; i < length; ++i) {
        ctx.fillText(footer[i], rtlHelper.x(pt.x), pt.y + footerFont.lineHeight / 2);
        pt.y += footerFont.lineHeight + options.footerSpacing;
      }
    }
  }

  drawBackground(pt, ctx, tooltipSize, options) {
    const {
      xAlign,
      yAlign
    } = this;
    const {
      x,
      y
    } = pt;
    const {
      width,
      height
    } = tooltipSize;
    const radius = options.cornerRadius;
    ctx.fillStyle = options.backgroundColor;
    ctx.strokeStyle = options.borderColor;
    ctx.lineWidth = options.borderWidth;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);

    if (yAlign === 'top') {
      this.drawCaret(pt, ctx, tooltipSize, options);
    }

    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);

    if (yAlign === 'center' && xAlign === 'right') {
      this.drawCaret(pt, ctx, tooltipSize, options);
    }

    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);

    if (yAlign === 'bottom') {
      this.drawCaret(pt, ctx, tooltipSize, options);
    }

    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);

    if (yAlign === 'center' && xAlign === 'left') {
      this.drawCaret(pt, ctx, tooltipSize, options);
    }

    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();

    if (options.borderWidth > 0) {
      ctx.stroke();
    }
  }

  _updateAnimationTarget(options) {
    const me = this;
    const chart = me._chart;
    const anims = me.$animations;
    const animX = anims && anims.x;
    const animY = anims && anims.y;

    if (animX || animY) {
      const position = positioners[options.position].call(me, me._active, me._eventPosition);

      if (!position) {
        return;
      }

      const size = me._size = getTooltipSize(me, options);
      const positionAndSize = Object.assign({}, position, me._size);
      const alignment = determineAlignment(chart, options, positionAndSize);
      const point = getBackgroundPoint(options, positionAndSize, alignment, chart);

      if (animX._to !== point.x || animY._to !== point.y) {
        me.xAlign = alignment.xAlign;
        me.yAlign = alignment.yAlign;
        me.width = size.width;
        me.height = size.height;
        me.caretX = position.x;
        me.caretY = position.y;

        me._resolveAnimations().update(me, point);
      }
    }
  }

  draw(ctx) {
    const me = this;
    const options = me.options.setContext(me.getContext());
    let opacity = me.opacity;

    if (!opacity) {
      return;
    }

    me._updateAnimationTarget(options);

    const tooltipSize = {
      width: me.width,
      height: me.height
    };
    const pt = {
      x: me.x,
      y: me.y
    };
    opacity = Math.abs(opacity) < 1e-3 ? 0 : opacity;
    const padding = (0, _helpersSegment.C)(options.padding);
    const hasTooltipContent = me.title.length || me.beforeBody.length || me.body.length || me.afterBody.length || me.footer.length;

    if (options.enabled && hasTooltipContent) {
      ctx.save();
      ctx.globalAlpha = opacity;
      me.drawBackground(pt, ctx, tooltipSize, options);
      (0, _helpersSegment.au)(ctx, options.textDirection);
      pt.y += padding.top;
      me.drawTitle(pt, ctx, options);
      me.drawBody(pt, ctx, options);
      me.drawFooter(pt, ctx, options);
      (0, _helpersSegment.aw)(ctx, options.textDirection);
      ctx.restore();
    }
  }

  getActiveElements() {
    return this._active || [];
  }

  setActiveElements(activeElements, eventPosition) {
    const me = this;
    const lastActive = me._active;
    const active = activeElements.map(({
      datasetIndex,
      index
    }) => {
      const meta = me._chart.getDatasetMeta(datasetIndex);

      if (!meta) {
        throw new Error('Cannot find a dataset at index ' + datasetIndex);
      }

      return {
        datasetIndex,
        element: meta.data[index],
        index
      };
    });
    const changed = !(0, _helpersSegment.ac)(lastActive, active);

    const positionChanged = me._positionChanged(active, eventPosition);

    if (changed || positionChanged) {
      me._active = active;
      me._eventPosition = eventPosition;
      me.update(true);
    }
  }

  handleEvent(e, replay) {
    const me = this;
    const options = me.options;
    const lastActive = me._active || [];
    let changed = false;
    let active = [];

    if (e.type !== 'mouseout') {
      active = me._chart.getElementsAtEventForMode(e, options.mode, options, replay);

      if (options.reverse) {
        active.reverse();
      }
    }

    const positionChanged = me._positionChanged(active, e);

    changed = replay || !(0, _helpersSegment.ac)(active, lastActive) || positionChanged;

    if (changed) {
      me._active = active;

      if (options.enabled || options.external) {
        me._eventPosition = {
          x: e.x,
          y: e.y
        };
        me.update(true, replay);
      }
    }

    return changed;
  }

  _positionChanged(active, e) {
    const {
      caretX,
      caretY,
      options
    } = this;
    const position = positioners[options.position].call(this, active, e);
    return position !== false && (caretX !== position.x || caretY !== position.y);
  }

}

Tooltip.positioners = positioners;
var plugin_tooltip = {
  id: 'tooltip',
  _element: Tooltip,
  positioners,

  afterInit(chart, _args, options) {
    if (options) {
      chart.tooltip = new Tooltip({
        _chart: chart,
        options
      });
    }
  },

  beforeUpdate(chart, _args, options) {
    if (chart.tooltip) {
      chart.tooltip.initialize(options);
    }
  },

  reset(chart, _args, options) {
    if (chart.tooltip) {
      chart.tooltip.initialize(options);
    }
  },

  afterDraw(chart) {
    const tooltip = chart.tooltip;
    const args = {
      tooltip
    };

    if (chart.notifyPlugins('beforeTooltipDraw', args) === false) {
      return;
    }

    if (tooltip) {
      tooltip.draw(chart.ctx);
    }

    chart.notifyPlugins('afterTooltipDraw', args);
  },

  afterEvent(chart, args) {
    if (chart.tooltip) {
      const useFinalPosition = args.replay;

      if (chart.tooltip.handleEvent(args.event, useFinalPosition)) {
        args.changed = true;
      }
    }
  },

  defaults: {
    enabled: true,
    external: null,
    position: 'average',
    backgroundColor: 'rgba(0,0,0,0.8)',
    titleColor: '#fff',
    titleFont: {
      weight: 'bold'
    },
    titleSpacing: 2,
    titleMarginBottom: 6,
    titleAlign: 'left',
    bodyColor: '#fff',
    bodySpacing: 2,
    bodyFont: {},
    bodyAlign: 'left',
    footerColor: '#fff',
    footerSpacing: 2,
    footerMarginTop: 6,
    footerFont: {
      weight: 'bold'
    },
    footerAlign: 'left',
    padding: 6,
    caretPadding: 2,
    caretSize: 5,
    cornerRadius: 6,
    boxHeight: (ctx, opts) => opts.bodyFont.size,
    boxWidth: (ctx, opts) => opts.bodyFont.size,
    multiKeyBackground: '#fff',
    displayColors: true,
    borderColor: 'rgba(0,0,0,0)',
    borderWidth: 0,
    animation: {
      duration: 400,
      easing: 'easeOutQuart'
    },
    animations: {
      numbers: {
        type: 'number',
        properties: ['x', 'y', 'width', 'height', 'caretX', 'caretY']
      },
      opacity: {
        easing: 'linear',
        duration: 200
      }
    },
    callbacks: {
      beforeTitle: _helpersSegment.ax,

      title(tooltipItems) {
        if (tooltipItems.length > 0) {
          const item = tooltipItems[0];
          const labels = item.chart.data.labels;
          const labelCount = labels ? labels.length : 0;

          if (this && this.options && this.options.mode === 'dataset') {
            return item.dataset.label || '';
          } else if (item.label) {
            return item.label;
          } else if (labelCount > 0 && item.dataIndex < labelCount) {
            return labels[item.dataIndex];
          }
        }

        return '';
      },

      afterTitle: _helpersSegment.ax,
      beforeBody: _helpersSegment.ax,
      beforeLabel: _helpersSegment.ax,

      label(tooltipItem) {
        if (this && this.options && this.options.mode === 'dataset') {
          return tooltipItem.label + ': ' + tooltipItem.formattedValue || tooltipItem.formattedValue;
        }

        let label = tooltipItem.dataset.label || '';

        if (label) {
          label += ': ';
        }

        const value = tooltipItem.formattedValue;

        if (!(0, _helpersSegment.j)(value)) {
          label += value;
        }

        return label;
      },

      labelColor(tooltipItem) {
        const meta = tooltipItem.chart.getDatasetMeta(tooltipItem.datasetIndex);
        const options = meta.controller.getStyle(tooltipItem.dataIndex);
        return {
          borderColor: options.borderColor,
          backgroundColor: options.backgroundColor,
          borderWidth: options.borderWidth,
          borderDash: options.borderDash,
          borderDashOffset: options.borderDashOffset,
          borderRadius: 0
        };
      },

      labelTextColor() {
        return this.options.bodyColor;
      },

      labelPointStyle(tooltipItem) {
        const meta = tooltipItem.chart.getDatasetMeta(tooltipItem.datasetIndex);
        const options = meta.controller.getStyle(tooltipItem.dataIndex);
        return {
          pointStyle: options.pointStyle,
          rotation: options.rotation
        };
      },

      afterLabel: _helpersSegment.ax,
      afterBody: _helpersSegment.ax,
      beforeFooter: _helpersSegment.ax,
      footer: _helpersSegment.ax,
      afterFooter: _helpersSegment.ax
    }
  },
  defaultRoutes: {
    bodyFont: 'font',
    footerFont: 'font',
    titleFont: 'font'
  },
  descriptors: {
    _scriptable: name => name !== 'filter' && name !== 'itemSort' && name !== 'external',
    _indexable: false,
    callbacks: {
      _scriptable: false,
      _indexable: false
    },
    animation: {
      _fallback: false
    },
    animations: {
      _fallback: 'animation'
    }
  },
  additionalOptionScopes: ['interaction']
};
exports.Tooltip = plugin_tooltip;
var plugins = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Decimation: plugin_decimation,
  Filler: plugin_filler,
  Legend: plugin_legend,
  Title: plugin_title,
  Tooltip: plugin_tooltip
});
exports.plugins = plugins;

const addIfString = (labels, raw, index) => typeof raw === 'string' ? labels.push(raw) - 1 : isNaN(raw) ? null : index;

function findOrAddLabel(labels, raw, index) {
  const first = labels.indexOf(raw);

  if (first === -1) {
    return addIfString(labels, raw, index);
  }

  const last = labels.lastIndexOf(raw);
  return first !== last ? index : first;
}

const validIndex = (index, max) => index === null ? null : (0, _helpersSegment.x)(Math.round(index), 0, max);

class CategoryScale extends Scale {
  constructor(cfg) {
    super(cfg);
    this._startValue = undefined;
    this._valueRange = 0;
  }

  parse(raw, index) {
    if ((0, _helpersSegment.j)(raw)) {
      return null;
    }

    const labels = this.getLabels();
    index = isFinite(index) && labels[index] === raw ? index : findOrAddLabel(labels, raw, (0, _helpersSegment.v)(index, raw));
    return validIndex(index, labels.length - 1);
  }

  determineDataLimits() {
    const me = this;
    const {
      minDefined,
      maxDefined
    } = me.getUserBounds();
    let {
      min,
      max
    } = me.getMinMax(true);

    if (me.options.bounds === 'ticks') {
      if (!minDefined) {
        min = 0;
      }

      if (!maxDefined) {
        max = me.getLabels().length - 1;
      }
    }

    me.min = min;
    me.max = max;
  }

  buildTicks() {
    const me = this;
    const min = me.min;
    const max = me.max;
    const offset = me.options.offset;
    const ticks = [];
    let labels = me.getLabels();
    labels = min === 0 && max === labels.length - 1 ? labels : labels.slice(min, max + 1);
    me._valueRange = Math.max(labels.length - (offset ? 0 : 1), 1);
    me._startValue = me.min - (offset ? 0.5 : 0);

    for (let value = min; value <= max; value++) {
      ticks.push({
        value
      });
    }

    return ticks;
  }

  getLabelForValue(value) {
    const me = this;
    const labels = me.getLabels();

    if (value >= 0 && value < labels.length) {
      return labels[value];
    }

    return value;
  }

  configure() {
    const me = this;
    super.configure();

    if (!me.isHorizontal()) {
      me._reversePixels = !me._reversePixels;
    }
  }

  getPixelForValue(value) {
    const me = this;

    if (typeof value !== 'number') {
      value = me.parse(value);
    }

    return value === null ? NaN : me.getPixelForDecimal((value - me._startValue) / me._valueRange);
  }

  getPixelForTick(index) {
    const me = this;
    const ticks = me.ticks;

    if (index < 0 || index > ticks.length - 1) {
      return null;
    }

    return me.getPixelForValue(ticks[index].value);
  }

  getValueForPixel(pixel) {
    const me = this;
    return Math.round(me._startValue + me.getDecimalForPixel(pixel) * me._valueRange);
  }

  getBasePixel() {
    return this.bottom;
  }

}

exports.CategoryScale = CategoryScale;
CategoryScale.id = 'category';
CategoryScale.defaults = {
  ticks: {
    callback: CategoryScale.prototype.getLabelForValue
  }
};

function generateTicks$1(generationOptions, dataRange) {
  const ticks = [];
  const MIN_SPACING = 1e-14;
  const {
    step,
    min,
    max,
    precision,
    count,
    maxTicks,
    maxDigits,
    horizontal
  } = generationOptions;
  const unit = step || 1;
  const maxSpaces = maxTicks - 1;
  const {
    min: rmin,
    max: rmax
  } = dataRange;
  const minDefined = !(0, _helpersSegment.j)(min);
  const maxDefined = !(0, _helpersSegment.j)(max);
  const countDefined = !(0, _helpersSegment.j)(count);
  const minSpacing = (rmax - rmin) / maxDigits;
  let spacing = (0, _helpersSegment.aA)((rmax - rmin) / maxSpaces / unit) * unit;
  let factor, niceMin, niceMax, numSpaces;

  if (spacing < MIN_SPACING && !minDefined && !maxDefined) {
    return [{
      value: rmin
    }, {
      value: rmax
    }];
  }

  numSpaces = Math.ceil(rmax / spacing) - Math.floor(rmin / spacing);

  if (numSpaces > maxSpaces) {
    spacing = (0, _helpersSegment.aA)(numSpaces * spacing / maxSpaces / unit) * unit;
  }

  if (!(0, _helpersSegment.j)(precision)) {
    factor = Math.pow(10, precision);
    spacing = Math.ceil(spacing * factor) / factor;
  }

  niceMin = Math.floor(rmin / spacing) * spacing;
  niceMax = Math.ceil(rmax / spacing) * spacing;

  if (minDefined && maxDefined && step && (0, _helpersSegment.aB)((max - min) / step, spacing / 1000)) {
    numSpaces = Math.min((max - min) / spacing, maxTicks);
    spacing = (max - min) / numSpaces;
    niceMin = min;
    niceMax = max;
  } else if (countDefined) {
    niceMin = minDefined ? min : niceMin;
    niceMax = maxDefined ? max : niceMax;
    numSpaces = count - 1;
    spacing = (niceMax - niceMin) / numSpaces;
  } else {
    numSpaces = (niceMax - niceMin) / spacing;

    if ((0, _helpersSegment.aC)(numSpaces, Math.round(numSpaces), spacing / 1000)) {
      numSpaces = Math.round(numSpaces);
    } else {
      numSpaces = Math.ceil(numSpaces);
    }
  }

  factor = Math.pow(10, (0, _helpersSegment.j)(precision) ? (0, _helpersSegment.aD)(spacing) : precision);
  niceMin = Math.round(niceMin * factor) / factor;
  niceMax = Math.round(niceMax * factor) / factor;
  let j = 0;

  if (minDefined) {
    ticks.push({
      value: min
    });

    if (niceMin <= min) {
      j++;
    }

    if ((0, _helpersSegment.aC)(Math.round((niceMin + j * spacing) * factor) / factor, min, minSpacing * (horizontal ? ('' + min).length : 1))) {
      j++;
    }
  }

  for (; j < numSpaces; ++j) {
    ticks.push({
      value: Math.round((niceMin + j * spacing) * factor) / factor
    });
  }

  if (maxDefined) {
    if ((0, _helpersSegment.aC)(ticks[ticks.length - 1].value, max, minSpacing * (horizontal ? ('' + max).length : 1))) {
      ticks[ticks.length - 1].value = max;
    } else {
      ticks.push({
        value: max
      });
    }
  } else {
    ticks.push({
      value: niceMax
    });
  }

  return ticks;
}

class LinearScaleBase extends Scale {
  constructor(cfg) {
    super(cfg);
    this.start = undefined;
    this.end = undefined;
    this._startValue = undefined;
    this._endValue = undefined;
    this._valueRange = 0;
  }

  parse(raw, index) {
    if ((0, _helpersSegment.j)(raw)) {
      return null;
    }

    if ((typeof raw === 'number' || raw instanceof Number) && !isFinite(+raw)) {
      return null;
    }

    return +raw;
  }

  handleTickRangeOptions() {
    const me = this;
    const {
      beginAtZero,
      stacked
    } = me.options;
    const {
      minDefined,
      maxDefined
    } = me.getUserBounds();
    let {
      min,
      max
    } = me;

    const setMin = v => min = minDefined ? min : v;

    const setMax = v => max = maxDefined ? max : v;

    if (beginAtZero || stacked) {
      const minSign = (0, _helpersSegment.s)(min);
      const maxSign = (0, _helpersSegment.s)(max);

      if (minSign < 0 && maxSign < 0) {
        setMax(0);
      } else if (minSign > 0 && maxSign > 0) {
        setMin(0);
      }
    }

    if (min === max) {
      setMax(max + 1);

      if (!beginAtZero) {
        setMin(min - 1);
      }
    }

    me.min = min;
    me.max = max;
  }

  getTickLimit() {
    const me = this;
    const tickOpts = me.options.ticks;
    let {
      maxTicksLimit,
      stepSize
    } = tickOpts;
    let maxTicks;

    if (stepSize) {
      maxTicks = Math.ceil(me.max / stepSize) - Math.floor(me.min / stepSize) + 1;
    } else {
      maxTicks = me.computeTickLimit();
      maxTicksLimit = maxTicksLimit || 11;
    }

    if (maxTicksLimit) {
      maxTicks = Math.min(maxTicksLimit, maxTicks);
    }

    return maxTicks;
  }

  computeTickLimit() {
    return Number.POSITIVE_INFINITY;
  }

  buildTicks() {
    const me = this;
    const opts = me.options;
    const tickOpts = opts.ticks;
    let maxTicks = me.getTickLimit();
    maxTicks = Math.max(2, maxTicks);
    const numericGeneratorOptions = {
      maxTicks,
      min: opts.min,
      max: opts.max,
      precision: tickOpts.precision,
      step: tickOpts.stepSize,
      count: tickOpts.count,
      maxDigits: me._maxDigits(),
      horizontal: me.isHorizontal()
    };
    const dataRange = me._range || me;
    const ticks = generateTicks$1(numericGeneratorOptions, dataRange);

    if (opts.bounds === 'ticks') {
      (0, _helpersSegment.az)(ticks, me, 'value');
    }

    if (opts.reverse) {
      ticks.reverse();
      me.start = me.max;
      me.end = me.min;
    } else {
      me.start = me.min;
      me.end = me.max;
    }

    return ticks;
  }

  configure() {
    const me = this;
    const ticks = me.ticks;
    let start = me.min;
    let end = me.max;
    super.configure();

    if (me.options.offset && ticks.length) {
      const offset = (end - start) / Math.max(ticks.length - 1, 1) / 2;
      start -= offset;
      end += offset;
    }

    me._startValue = start;
    me._endValue = end;
    me._valueRange = end - start;
  }

  getLabelForValue(value) {
    return (0, _helpersSegment.p)(value, this.chart.options.locale);
  }

}

class LinearScale extends LinearScaleBase {
  determineDataLimits() {
    const me = this;
    const {
      min,
      max
    } = me.getMinMax(true);
    me.min = (0, _helpersSegment.g)(min) ? min : 0;
    me.max = (0, _helpersSegment.g)(max) ? max : 1;
    me.handleTickRangeOptions();
  }

  computeTickLimit() {
    const me = this;

    if (me.isHorizontal()) {
      return Math.ceil(me.width / 40);
    }

    const tickFont = me._resolveTickFontOptions(0);

    return Math.ceil(me.height / tickFont.lineHeight);
  }

  getPixelForValue(value) {
    return value === null ? NaN : this.getPixelForDecimal((value - this._startValue) / this._valueRange);
  }

  getValueForPixel(pixel) {
    return this._startValue + this.getDecimalForPixel(pixel) * this._valueRange;
  }

}

exports.LinearScale = LinearScale;
LinearScale.id = 'linear';
LinearScale.defaults = {
  ticks: {
    callback: Ticks.formatters.numeric
  }
};

function isMajor(tickVal) {
  const remain = tickVal / Math.pow(10, Math.floor((0, _helpersSegment.K)(tickVal)));
  return remain === 1;
}

function generateTicks(generationOptions, dataRange) {
  const endExp = Math.floor((0, _helpersSegment.K)(dataRange.max));
  const endSignificand = Math.ceil(dataRange.max / Math.pow(10, endExp));
  const ticks = [];
  let tickVal = (0, _helpersSegment.M)(generationOptions.min, Math.pow(10, Math.floor((0, _helpersSegment.K)(dataRange.min))));
  let exp = Math.floor((0, _helpersSegment.K)(tickVal));
  let significand = Math.floor(tickVal / Math.pow(10, exp));
  let precision = exp < 0 ? Math.pow(10, Math.abs(exp)) : 1;

  do {
    ticks.push({
      value: tickVal,
      major: isMajor(tickVal)
    });
    ++significand;

    if (significand === 10) {
      significand = 1;
      ++exp;
      precision = exp >= 0 ? 1 : precision;
    }

    tickVal = Math.round(significand * Math.pow(10, exp) * precision) / precision;
  } while (exp < endExp || exp === endExp && significand < endSignificand);

  const lastTick = (0, _helpersSegment.M)(generationOptions.max, tickVal);
  ticks.push({
    value: lastTick,
    major: isMajor(tickVal)
  });
  return ticks;
}

class LogarithmicScale extends Scale {
  constructor(cfg) {
    super(cfg);
    this.start = undefined;
    this.end = undefined;
    this._startValue = undefined;
    this._valueRange = 0;
  }

  parse(raw, index) {
    const value = LinearScaleBase.prototype.parse.apply(this, [raw, index]);

    if (value === 0) {
      this._zero = true;
      return undefined;
    }

    return (0, _helpersSegment.g)(value) && value > 0 ? value : null;
  }

  determineDataLimits() {
    const me = this;
    const {
      min,
      max
    } = me.getMinMax(true);
    me.min = (0, _helpersSegment.g)(min) ? Math.max(0, min) : null;
    me.max = (0, _helpersSegment.g)(max) ? Math.max(0, max) : null;

    if (me.options.beginAtZero) {
      me._zero = true;
    }

    me.handleTickRangeOptions();
  }

  handleTickRangeOptions() {
    const me = this;
    const {
      minDefined,
      maxDefined
    } = me.getUserBounds();
    let min = me.min;
    let max = me.max;

    const setMin = v => min = minDefined ? min : v;

    const setMax = v => max = maxDefined ? max : v;

    const exp = (v, m) => Math.pow(10, Math.floor((0, _helpersSegment.K)(v)) + m);

    if (min === max) {
      if (min <= 0) {
        setMin(1);
        setMax(10);
      } else {
        setMin(exp(min, -1));
        setMax(exp(max, +1));
      }
    }

    if (min <= 0) {
      setMin(exp(max, -1));
    }

    if (max <= 0) {
      setMax(exp(min, +1));
    }

    if (me._zero && me.min !== me._suggestedMin && min === exp(me.min, 0)) {
      setMin(exp(min, -1));
    }

    me.min = min;
    me.max = max;
  }

  buildTicks() {
    const me = this;
    const opts = me.options;
    const generationOptions = {
      min: me._userMin,
      max: me._userMax
    };
    const ticks = generateTicks(generationOptions, me);

    if (opts.bounds === 'ticks') {
      (0, _helpersSegment.az)(ticks, me, 'value');
    }

    if (opts.reverse) {
      ticks.reverse();
      me.start = me.max;
      me.end = me.min;
    } else {
      me.start = me.min;
      me.end = me.max;
    }

    return ticks;
  }

  getLabelForValue(value) {
    return value === undefined ? '0' : (0, _helpersSegment.p)(value, this.chart.options.locale);
  }

  configure() {
    const me = this;
    const start = me.min;
    super.configure();
    me._startValue = (0, _helpersSegment.K)(start);
    me._valueRange = (0, _helpersSegment.K)(me.max) - (0, _helpersSegment.K)(start);
  }

  getPixelForValue(value) {
    const me = this;

    if (value === undefined || value === 0) {
      value = me.min;
    }

    if (value === null || isNaN(value)) {
      return NaN;
    }

    return me.getPixelForDecimal(value === me.min ? 0 : ((0, _helpersSegment.K)(value) - me._startValue) / me._valueRange);
  }

  getValueForPixel(pixel) {
    const me = this;
    const decimal = me.getDecimalForPixel(pixel);
    return Math.pow(10, me._startValue + decimal * me._valueRange);
  }

}

exports.LogarithmicScale = LogarithmicScale;
LogarithmicScale.id = 'logarithmic';
LogarithmicScale.defaults = {
  ticks: {
    callback: Ticks.formatters.logarithmic,
    major: {
      enabled: true
    }
  }
};

function getTickBackdropHeight(opts) {
  const tickOpts = opts.ticks;

  if (tickOpts.display && opts.display) {
    const padding = (0, _helpersSegment.C)(tickOpts.backdropPadding);
    return (0, _helpersSegment.v)(tickOpts.font && tickOpts.font.size, _helpersSegment.d.font.size) + padding.height;
  }

  return 0;
}

function measureLabelSize(ctx, lineHeight, label) {
  if ((0, _helpersSegment.b)(label)) {
    return {
      w: (0, _helpersSegment.aE)(ctx, ctx.font, label),
      h: label.length * lineHeight
    };
  }

  return {
    w: ctx.measureText(label).width,
    h: lineHeight
  };
}

function determineLimits(angle, pos, size, min, max) {
  if (angle === min || angle === max) {
    return {
      start: pos - size / 2,
      end: pos + size / 2
    };
  } else if (angle < min || angle > max) {
    return {
      start: pos - size,
      end: pos
    };
  }

  return {
    start: pos,
    end: pos + size
  };
}

function fitWithPointLabels(scale) {
  const furthestLimits = {
    l: 0,
    r: scale.width,
    t: 0,
    b: scale.height - scale.paddingTop
  };
  const furthestAngles = {};
  let i, textSize, pointPosition;
  const labelSizes = [];
  const padding = [];
  const valueCount = scale.getLabels().length;

  for (i = 0; i < valueCount; i++) {
    const opts = scale.options.pointLabels.setContext(scale.getContext(i));
    padding[i] = opts.padding;
    pointPosition = scale.getPointPosition(i, scale.drawingArea + padding[i]);
    const plFont = (0, _helpersSegment.W)(opts.font);
    scale.ctx.font = plFont.string;
    textSize = measureLabelSize(scale.ctx, plFont.lineHeight, scale._pointLabels[i]);
    labelSizes[i] = textSize;
    const angleRadians = scale.getIndexAngle(i);
    const angle = (0, _helpersSegment.Q)(angleRadians);
    const hLimits = determineLimits(angle, pointPosition.x, textSize.w, 0, 180);
    const vLimits = determineLimits(angle, pointPosition.y, textSize.h, 90, 270);

    if (hLimits.start < furthestLimits.l) {
      furthestLimits.l = hLimits.start;
      furthestAngles.l = angleRadians;
    }

    if (hLimits.end > furthestLimits.r) {
      furthestLimits.r = hLimits.end;
      furthestAngles.r = angleRadians;
    }

    if (vLimits.start < furthestLimits.t) {
      furthestLimits.t = vLimits.start;
      furthestAngles.t = angleRadians;
    }

    if (vLimits.end > furthestLimits.b) {
      furthestLimits.b = vLimits.end;
      furthestAngles.b = angleRadians;
    }
  }

  scale._setReductions(scale.drawingArea, furthestLimits, furthestAngles);

  scale._pointLabelItems = [];
  const opts = scale.options;
  const tickBackdropHeight = getTickBackdropHeight(opts);
  const outerDistance = scale.getDistanceFromCenterForValue(opts.ticks.reverse ? scale.min : scale.max);

  for (i = 0; i < valueCount; i++) {
    const extra = i === 0 ? tickBackdropHeight / 2 : 0;
    const pointLabelPosition = scale.getPointPosition(i, outerDistance + extra + padding[i]);
    const angle = (0, _helpersSegment.Q)(scale.getIndexAngle(i));
    const size = labelSizes[i];
    adjustPointPositionForLabelHeight(angle, size, pointLabelPosition);
    const textAlign = getTextAlignForAngle(angle);
    let left;

    if (textAlign === 'left') {
      left = pointLabelPosition.x;
    } else if (textAlign === 'center') {
      left = pointLabelPosition.x - size.w / 2;
    } else {
      left = pointLabelPosition.x - size.w;
    }

    const right = left + size.w;
    scale._pointLabelItems[i] = {
      x: pointLabelPosition.x,
      y: pointLabelPosition.y,
      textAlign,
      left,
      top: pointLabelPosition.y,
      right,
      bottom: pointLabelPosition.y + size.h
    };
  }
}

function getTextAlignForAngle(angle) {
  if (angle === 0 || angle === 180) {
    return 'center';
  } else if (angle < 180) {
    return 'left';
  }

  return 'right';
}

function adjustPointPositionForLabelHeight(angle, textSize, position) {
  if (angle === 90 || angle === 270) {
    position.y -= textSize.h / 2;
  } else if (angle > 270 || angle < 90) {
    position.y -= textSize.h;
  }
}

function drawPointLabels(scale, labelCount) {
  const {
    ctx,
    options: {
      pointLabels
    }
  } = scale;

  for (let i = labelCount - 1; i >= 0; i--) {
    const optsAtIndex = pointLabels.setContext(scale.getContext(i));
    const plFont = (0, _helpersSegment.W)(optsAtIndex.font);
    const {
      x,
      y,
      textAlign,
      left,
      top,
      right,
      bottom
    } = scale._pointLabelItems[i];
    const {
      backdropColor
    } = optsAtIndex;

    if (!(0, _helpersSegment.j)(backdropColor)) {
      const padding = (0, _helpersSegment.C)(optsAtIndex.backdropPadding);
      ctx.fillStyle = backdropColor;
      ctx.fillRect(left - padding.left, top - padding.top, right - left + padding.width, bottom - top + padding.height);
    }

    (0, _helpersSegment.V)(ctx, scale._pointLabels[i], x, y + plFont.lineHeight / 2, plFont, {
      color: optsAtIndex.color,
      textAlign: textAlign,
      textBaseline: 'middle'
    });
  }
}

function pathRadiusLine(scale, radius, circular, labelCount) {
  const {
    ctx
  } = scale;

  if (circular) {
    ctx.arc(scale.xCenter, scale.yCenter, radius, 0, _helpersSegment.T);
  } else {
    let pointPosition = scale.getPointPosition(0, radius);
    ctx.moveTo(pointPosition.x, pointPosition.y);

    for (let i = 1; i < labelCount; i++) {
      pointPosition = scale.getPointPosition(i, radius);
      ctx.lineTo(pointPosition.x, pointPosition.y);
    }
  }
}

function drawRadiusLine(scale, gridLineOpts, radius, labelCount) {
  const ctx = scale.ctx;
  const circular = gridLineOpts.circular;
  const {
    color,
    lineWidth
  } = gridLineOpts;

  if (!circular && !labelCount || !color || !lineWidth || radius < 0) {
    return;
  }

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.setLineDash(gridLineOpts.borderDash);
  ctx.lineDashOffset = gridLineOpts.borderDashOffset;
  ctx.beginPath();
  pathRadiusLine(scale, radius, circular, labelCount);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function numberOrZero(param) {
  return (0, _helpersSegment.w)(param) ? param : 0;
}

class RadialLinearScale extends LinearScaleBase {
  constructor(cfg) {
    super(cfg);
    this.xCenter = undefined;
    this.yCenter = undefined;
    this.drawingArea = undefined;
    this._pointLabels = [];
    this._pointLabelItems = [];
  }

  setDimensions() {
    const me = this;
    me.width = me.maxWidth;
    me.height = me.maxHeight;
    me.paddingTop = getTickBackdropHeight(me.options) / 2;
    me.xCenter = Math.floor(me.width / 2);
    me.yCenter = Math.floor((me.height - me.paddingTop) / 2);
    me.drawingArea = Math.min(me.height - me.paddingTop, me.width) / 2;
  }

  determineDataLimits() {
    const me = this;
    const {
      min,
      max
    } = me.getMinMax(false);
    me.min = (0, _helpersSegment.g)(min) && !isNaN(min) ? min : 0;
    me.max = (0, _helpersSegment.g)(max) && !isNaN(max) ? max : 0;
    me.handleTickRangeOptions();
  }

  computeTickLimit() {
    return Math.ceil(this.drawingArea / getTickBackdropHeight(this.options));
  }

  generateTickLabels(ticks) {
    const me = this;
    LinearScaleBase.prototype.generateTickLabels.call(me, ticks);
    me._pointLabels = me.getLabels().map((value, index) => {
      const label = (0, _helpersSegment.N)(me.options.pointLabels.callback, [value, index], me);
      return label || label === 0 ? label : '';
    });
  }

  fit() {
    const me = this;
    const opts = me.options;

    if (opts.display && opts.pointLabels.display) {
      fitWithPointLabels(me);
    } else {
      me.setCenterPoint(0, 0, 0, 0);
    }
  }

  _setReductions(largestPossibleRadius, furthestLimits, furthestAngles) {
    const me = this;
    let radiusReductionLeft = furthestLimits.l / Math.sin(furthestAngles.l);
    let radiusReductionRight = Math.max(furthestLimits.r - me.width, 0) / Math.sin(furthestAngles.r);
    let radiusReductionTop = -furthestLimits.t / Math.cos(furthestAngles.t);
    let radiusReductionBottom = -Math.max(furthestLimits.b - (me.height - me.paddingTop), 0) / Math.cos(furthestAngles.b);
    radiusReductionLeft = numberOrZero(radiusReductionLeft);
    radiusReductionRight = numberOrZero(radiusReductionRight);
    radiusReductionTop = numberOrZero(radiusReductionTop);
    radiusReductionBottom = numberOrZero(radiusReductionBottom);
    me.drawingArea = Math.max(largestPossibleRadius / 2, Math.min(Math.floor(largestPossibleRadius - (radiusReductionLeft + radiusReductionRight) / 2), Math.floor(largestPossibleRadius - (radiusReductionTop + radiusReductionBottom) / 2)));
    me.setCenterPoint(radiusReductionLeft, radiusReductionRight, radiusReductionTop, radiusReductionBottom);
  }

  setCenterPoint(leftMovement, rightMovement, topMovement, bottomMovement) {
    const me = this;
    const maxRight = me.width - rightMovement - me.drawingArea;
    const maxLeft = leftMovement + me.drawingArea;
    const maxTop = topMovement + me.drawingArea;
    const maxBottom = me.height - me.paddingTop - bottomMovement - me.drawingArea;
    me.xCenter = Math.floor((maxLeft + maxRight) / 2 + me.left);
    me.yCenter = Math.floor((maxTop + maxBottom) / 2 + me.top + me.paddingTop);
  }

  getIndexAngle(index) {
    const angleMultiplier = _helpersSegment.T / this.getLabels().length;
    const startAngle = this.options.startAngle || 0;
    return (0, _helpersSegment.as)(index * angleMultiplier + (0, _helpersSegment.t)(startAngle));
  }

  getDistanceFromCenterForValue(value) {
    const me = this;

    if ((0, _helpersSegment.j)(value)) {
      return NaN;
    }

    const scalingFactor = me.drawingArea / (me.max - me.min);

    if (me.options.reverse) {
      return (me.max - value) * scalingFactor;
    }

    return (value - me.min) * scalingFactor;
  }

  getValueForDistanceFromCenter(distance) {
    if ((0, _helpersSegment.j)(distance)) {
      return NaN;
    }

    const me = this;
    const scaledDistance = distance / (me.drawingArea / (me.max - me.min));
    return me.options.reverse ? me.max - scaledDistance : me.min + scaledDistance;
  }

  getPointPosition(index, distanceFromCenter) {
    const me = this;

    const angle = me.getIndexAngle(index) - _helpersSegment.H;

    return {
      x: Math.cos(angle) * distanceFromCenter + me.xCenter,
      y: Math.sin(angle) * distanceFromCenter + me.yCenter,
      angle
    };
  }

  getPointPositionForValue(index, value) {
    return this.getPointPosition(index, this.getDistanceFromCenterForValue(value));
  }

  getBasePosition(index) {
    return this.getPointPositionForValue(index || 0, this.getBaseValue());
  }

  getPointLabelPosition(index) {
    const {
      left,
      top,
      right,
      bottom
    } = this._pointLabelItems[index];
    return {
      left,
      top,
      right,
      bottom
    };
  }

  drawBackground() {
    const me = this;
    const {
      backgroundColor,
      grid: {
        circular
      }
    } = me.options;

    if (backgroundColor) {
      const ctx = me.ctx;
      ctx.save();
      ctx.beginPath();
      pathRadiusLine(me, me.getDistanceFromCenterForValue(me._endValue), circular, me.getLabels().length);
      ctx.closePath();
      ctx.fillStyle = backgroundColor;
      ctx.fill();
      ctx.restore();
    }
  }

  drawGrid() {
    const me = this;
    const ctx = me.ctx;
    const opts = me.options;
    const {
      angleLines,
      grid
    } = opts;
    const labelCount = me.getLabels().length;
    let i, offset, position;

    if (opts.pointLabels.display) {
      drawPointLabels(me, labelCount);
    }

    if (grid.display) {
      me.ticks.forEach((tick, index) => {
        if (index !== 0) {
          offset = me.getDistanceFromCenterForValue(tick.value);
          const optsAtIndex = grid.setContext(me.getContext(index - 1));
          drawRadiusLine(me, optsAtIndex, offset, labelCount);
        }
      });
    }

    if (angleLines.display) {
      ctx.save();

      for (i = me.getLabels().length - 1; i >= 0; i--) {
        const optsAtIndex = angleLines.setContext(me.getContext(i));
        const {
          color,
          lineWidth
        } = optsAtIndex;

        if (!lineWidth || !color) {
          continue;
        }

        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.setLineDash(optsAtIndex.borderDash);
        ctx.lineDashOffset = optsAtIndex.borderDashOffset;
        offset = me.getDistanceFromCenterForValue(opts.ticks.reverse ? me.min : me.max);
        position = me.getPointPosition(i, offset);
        ctx.beginPath();
        ctx.moveTo(me.xCenter, me.yCenter);
        ctx.lineTo(position.x, position.y);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  drawBorder() {}

  drawLabels() {
    const me = this;
    const ctx = me.ctx;
    const opts = me.options;
    const tickOpts = opts.ticks;

    if (!tickOpts.display) {
      return;
    }

    const startAngle = me.getIndexAngle(0);
    let offset, width;
    ctx.save();
    ctx.translate(me.xCenter, me.yCenter);
    ctx.rotate(startAngle);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    me.ticks.forEach((tick, index) => {
      if (index === 0 && !opts.reverse) {
        return;
      }

      const optsAtIndex = tickOpts.setContext(me.getContext(index));
      const tickFont = (0, _helpersSegment.W)(optsAtIndex.font);
      offset = me.getDistanceFromCenterForValue(me.ticks[index].value);

      if (optsAtIndex.showLabelBackdrop) {
        width = ctx.measureText(tick.label).width;
        ctx.fillStyle = optsAtIndex.backdropColor;
        const padding = (0, _helpersSegment.C)(optsAtIndex.backdropPadding);
        ctx.fillRect(-width / 2 - padding.left, -offset - tickFont.size / 2 - padding.top, width + padding.width, tickFont.size + padding.height);
      }

      (0, _helpersSegment.V)(ctx, tick.label, 0, -offset, tickFont, {
        color: optsAtIndex.color
      });
    });
    ctx.restore();
  }

  drawTitle() {}

}

exports.RadialLinearScale = RadialLinearScale;
RadialLinearScale.id = 'radialLinear';
RadialLinearScale.defaults = {
  display: true,
  animate: true,
  position: 'chartArea',
  angleLines: {
    display: true,
    lineWidth: 1,
    borderDash: [],
    borderDashOffset: 0.0
  },
  grid: {
    circular: false
  },
  startAngle: 0,
  ticks: {
    showLabelBackdrop: true,
    callback: Ticks.formatters.numeric
  },
  pointLabels: {
    backdropColor: undefined,
    backdropPadding: 2,
    display: true,
    font: {
      size: 10
    },

    callback(label) {
      return label;
    },

    padding: 5
  }
};
RadialLinearScale.defaultRoutes = {
  'angleLines.color': 'borderColor',
  'pointLabels.color': 'color',
  'ticks.color': 'color'
};
RadialLinearScale.descriptors = {
  angleLines: {
    _fallback: 'grid'
  }
};
const INTERVALS = {
  millisecond: {
    common: true,
    size: 1,
    steps: 1000
  },
  second: {
    common: true,
    size: 1000,
    steps: 60
  },
  minute: {
    common: true,
    size: 60000,
    steps: 60
  },
  hour: {
    common: true,
    size: 3600000,
    steps: 24
  },
  day: {
    common: true,
    size: 86400000,
    steps: 30
  },
  week: {
    common: false,
    size: 604800000,
    steps: 4
  },
  month: {
    common: true,
    size: 2.628e9,
    steps: 12
  },
  quarter: {
    common: false,
    size: 7.884e9,
    steps: 4
  },
  year: {
    common: true,
    size: 3.154e10
  }
};
const UNITS = Object.keys(INTERVALS);

function sorter(a, b) {
  return a - b;
}

function parse(scale, input) {
  if ((0, _helpersSegment.j)(input)) {
    return null;
  }

  const adapter = scale._adapter;
  const {
    parser,
    round,
    isoWeekday
  } = scale._parseOpts;
  let value = input;

  if (typeof parser === 'function') {
    value = parser(value);
  }

  if (!(0, _helpersSegment.g)(value)) {
    value = typeof parser === 'string' ? adapter.parse(value, parser) : adapter.parse(value);
  }

  if (value === null) {
    return null;
  }

  if (round) {
    value = round === 'week' && ((0, _helpersSegment.w)(isoWeekday) || isoWeekday === true) ? adapter.startOf(value, 'isoWeek', isoWeekday) : adapter.startOf(value, round);
  }

  return +value;
}

function determineUnitForAutoTicks(minUnit, min, max, capacity) {
  const ilen = UNITS.length;

  for (let i = UNITS.indexOf(minUnit); i < ilen - 1; ++i) {
    const interval = INTERVALS[UNITS[i]];
    const factor = interval.steps ? interval.steps : Number.MAX_SAFE_INTEGER;

    if (interval.common && Math.ceil((max - min) / (factor * interval.size)) <= capacity) {
      return UNITS[i];
    }
  }

  return UNITS[ilen - 1];
}

function determineUnitForFormatting(scale, numTicks, minUnit, min, max) {
  for (let i = UNITS.length - 1; i >= UNITS.indexOf(minUnit); i--) {
    const unit = UNITS[i];

    if (INTERVALS[unit].common && scale._adapter.diff(max, min, unit) >= numTicks - 1) {
      return unit;
    }
  }

  return UNITS[minUnit ? UNITS.indexOf(minUnit) : 0];
}

function determineMajorUnit(unit) {
  for (let i = UNITS.indexOf(unit) + 1, ilen = UNITS.length; i < ilen; ++i) {
    if (INTERVALS[UNITS[i]].common) {
      return UNITS[i];
    }
  }
}

function addTick(ticks, time, timestamps) {
  if (!timestamps) {
    ticks[time] = true;
  } else if (timestamps.length) {
    const {
      lo,
      hi
    } = (0, _helpersSegment.aG)(timestamps, time);
    const timestamp = timestamps[lo] >= time ? timestamps[lo] : timestamps[hi];
    ticks[timestamp] = true;
  }
}

function setMajorTicks(scale, ticks, map, majorUnit) {
  const adapter = scale._adapter;
  const first = +adapter.startOf(ticks[0].value, majorUnit);
  const last = ticks[ticks.length - 1].value;
  let major, index;

  for (major = first; major <= last; major = +adapter.add(major, 1, majorUnit)) {
    index = map[major];

    if (index >= 0) {
      ticks[index].major = true;
    }
  }

  return ticks;
}

function ticksFromTimestamps(scale, values, majorUnit) {
  const ticks = [];
  const map = {};
  const ilen = values.length;
  let i, value;

  for (i = 0; i < ilen; ++i) {
    value = values[i];
    map[value] = i;
    ticks.push({
      value,
      major: false
    });
  }

  return ilen === 0 || !majorUnit ? ticks : setMajorTicks(scale, ticks, map, majorUnit);
}

class TimeScale extends Scale {
  constructor(props) {
    super(props);
    this._cache = {
      data: [],
      labels: [],
      all: []
    };
    this._unit = 'day';
    this._majorUnit = undefined;
    this._offsets = {};
    this._normalized = false;
    this._parseOpts = undefined;
  }

  init(scaleOpts, opts) {
    const time = scaleOpts.time || (scaleOpts.time = {});
    const adapter = this._adapter = new adapters._date(scaleOpts.adapters.date);
    (0, _helpersSegment.a6)(time.displayFormats, adapter.formats());
    this._parseOpts = {
      parser: time.parser,
      round: time.round,
      isoWeekday: time.isoWeekday
    };
    super.init(scaleOpts);
    this._normalized = opts.normalized;
  }

  parse(raw, index) {
    if (raw === undefined) {
      return null;
    }

    return parse(this, raw);
  }

  beforeLayout() {
    super.beforeLayout();
    this._cache = {
      data: [],
      labels: [],
      all: []
    };
  }

  determineDataLimits() {
    const me = this;
    const options = me.options;
    const adapter = me._adapter;
    const unit = options.time.unit || 'day';
    let {
      min,
      max,
      minDefined,
      maxDefined
    } = me.getUserBounds();

    function _applyBounds(bounds) {
      if (!minDefined && !isNaN(bounds.min)) {
        min = Math.min(min, bounds.min);
      }

      if (!maxDefined && !isNaN(bounds.max)) {
        max = Math.max(max, bounds.max);
      }
    }

    if (!minDefined || !maxDefined) {
      _applyBounds(me._getLabelBounds());

      if (options.bounds !== 'ticks' || options.ticks.source !== 'labels') {
        _applyBounds(me.getMinMax(false));
      }
    }

    min = (0, _helpersSegment.g)(min) && !isNaN(min) ? min : +adapter.startOf(Date.now(), unit);
    max = (0, _helpersSegment.g)(max) && !isNaN(max) ? max : +adapter.endOf(Date.now(), unit) + 1;
    me.min = Math.min(min, max - 1);
    me.max = Math.max(min + 1, max);
  }

  _getLabelBounds() {
    const arr = this.getLabelTimestamps();
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;

    if (arr.length) {
      min = arr[0];
      max = arr[arr.length - 1];
    }

    return {
      min,
      max
    };
  }

  buildTicks() {
    const me = this;
    const options = me.options;
    const timeOpts = options.time;
    const tickOpts = options.ticks;
    const timestamps = tickOpts.source === 'labels' ? me.getLabelTimestamps() : me._generate();

    if (options.bounds === 'ticks' && timestamps.length) {
      me.min = me._userMin || timestamps[0];
      me.max = me._userMax || timestamps[timestamps.length - 1];
    }

    const min = me.min;
    const max = me.max;
    const ticks = (0, _helpersSegment.aF)(timestamps, min, max);
    me._unit = timeOpts.unit || (tickOpts.autoSkip ? determineUnitForAutoTicks(timeOpts.minUnit, me.min, me.max, me._getLabelCapacity(min)) : determineUnitForFormatting(me, ticks.length, timeOpts.minUnit, me.min, me.max));
    me._majorUnit = !tickOpts.major.enabled || me._unit === 'year' ? undefined : determineMajorUnit(me._unit);
    me.initOffsets(timestamps);

    if (options.reverse) {
      ticks.reverse();
    }

    return ticksFromTimestamps(me, ticks, me._majorUnit);
  }

  initOffsets(timestamps) {
    const me = this;
    let start = 0;
    let end = 0;
    let first, last;

    if (me.options.offset && timestamps.length) {
      first = me.getDecimalForValue(timestamps[0]);

      if (timestamps.length === 1) {
        start = 1 - first;
      } else {
        start = (me.getDecimalForValue(timestamps[1]) - first) / 2;
      }

      last = me.getDecimalForValue(timestamps[timestamps.length - 1]);

      if (timestamps.length === 1) {
        end = last;
      } else {
        end = (last - me.getDecimalForValue(timestamps[timestamps.length - 2])) / 2;
      }
    }

    const limit = timestamps.length < 3 ? 0.5 : 0.25;
    start = (0, _helpersSegment.x)(start, 0, limit);
    end = (0, _helpersSegment.x)(end, 0, limit);
    me._offsets = {
      start,
      end,
      factor: 1 / (start + 1 + end)
    };
  }

  _generate() {
    const me = this;
    const adapter = me._adapter;
    const min = me.min;
    const max = me.max;
    const options = me.options;
    const timeOpts = options.time;
    const minor = timeOpts.unit || determineUnitForAutoTicks(timeOpts.minUnit, min, max, me._getLabelCapacity(min));
    const stepSize = (0, _helpersSegment.v)(timeOpts.stepSize, 1);
    const weekday = minor === 'week' ? timeOpts.isoWeekday : false;
    const hasWeekday = (0, _helpersSegment.w)(weekday) || weekday === true;
    const ticks = {};
    let first = min;
    let time, count;

    if (hasWeekday) {
      first = +adapter.startOf(first, 'isoWeek', weekday);
    }

    first = +adapter.startOf(first, hasWeekday ? 'day' : minor);

    if (adapter.diff(max, min, minor) > 100000 * stepSize) {
      throw new Error(min + ' and ' + max + ' are too far apart with stepSize of ' + stepSize + ' ' + minor);
    }

    const timestamps = options.ticks.source === 'data' && me.getDataTimestamps();

    for (time = first, count = 0; time < max; time = +adapter.add(time, stepSize, minor), count++) {
      addTick(ticks, time, timestamps);
    }

    if (time === max || options.bounds === 'ticks' || count === 1) {
      addTick(ticks, time, timestamps);
    }

    return Object.keys(ticks).sort((a, b) => a - b).map(x => +x);
  }

  getLabelForValue(value) {
    const me = this;
    const adapter = me._adapter;
    const timeOpts = me.options.time;

    if (timeOpts.tooltipFormat) {
      return adapter.format(value, timeOpts.tooltipFormat);
    }

    return adapter.format(value, timeOpts.displayFormats.datetime);
  }

  _tickFormatFunction(time, index, ticks, format) {
    const me = this;
    const options = me.options;
    const formats = options.time.displayFormats;
    const unit = me._unit;
    const majorUnit = me._majorUnit;
    const minorFormat = unit && formats[unit];
    const majorFormat = majorUnit && formats[majorUnit];
    const tick = ticks[index];
    const major = majorUnit && majorFormat && tick && tick.major;

    const label = me._adapter.format(time, format || (major ? majorFormat : minorFormat));

    const formatter = options.ticks.callback;
    return formatter ? (0, _helpersSegment.N)(formatter, [label, index, ticks], me) : label;
  }

  generateTickLabels(ticks) {
    let i, ilen, tick;

    for (i = 0, ilen = ticks.length; i < ilen; ++i) {
      tick = ticks[i];
      tick.label = this._tickFormatFunction(tick.value, i, ticks);
    }
  }

  getDecimalForValue(value) {
    const me = this;
    return value === null ? NaN : (value - me.min) / (me.max - me.min);
  }

  getPixelForValue(value) {
    const me = this;
    const offsets = me._offsets;
    const pos = me.getDecimalForValue(value);
    return me.getPixelForDecimal((offsets.start + pos) * offsets.factor);
  }

  getValueForPixel(pixel) {
    const me = this;
    const offsets = me._offsets;
    const pos = me.getDecimalForPixel(pixel) / offsets.factor - offsets.end;
    return me.min + pos * (me.max - me.min);
  }

  _getLabelSize(label) {
    const me = this;
    const ticksOpts = me.options.ticks;
    const tickLabelWidth = me.ctx.measureText(label).width;
    const angle = (0, _helpersSegment.t)(me.isHorizontal() ? ticksOpts.maxRotation : ticksOpts.minRotation);
    const cosRotation = Math.cos(angle);
    const sinRotation = Math.sin(angle);

    const tickFontSize = me._resolveTickFontOptions(0).size;

    return {
      w: tickLabelWidth * cosRotation + tickFontSize * sinRotation,
      h: tickLabelWidth * sinRotation + tickFontSize * cosRotation
    };
  }

  _getLabelCapacity(exampleTime) {
    const me = this;
    const timeOpts = me.options.time;
    const displayFormats = timeOpts.displayFormats;
    const format = displayFormats[timeOpts.unit] || displayFormats.millisecond;

    const exampleLabel = me._tickFormatFunction(exampleTime, 0, ticksFromTimestamps(me, [exampleTime], me._majorUnit), format);

    const size = me._getLabelSize(exampleLabel);

    const capacity = Math.floor(me.isHorizontal() ? me.width / size.w : me.height / size.h) - 1;
    return capacity > 0 ? capacity : 1;
  }

  getDataTimestamps() {
    const me = this;
    let timestamps = me._cache.data || [];
    let i, ilen;

    if (timestamps.length) {
      return timestamps;
    }

    const metas = me.getMatchingVisibleMetas();

    if (me._normalized && metas.length) {
      return me._cache.data = metas[0].controller.getAllParsedValues(me);
    }

    for (i = 0, ilen = metas.length; i < ilen; ++i) {
      timestamps = timestamps.concat(metas[i].controller.getAllParsedValues(me));
    }

    return me._cache.data = me.normalize(timestamps);
  }

  getLabelTimestamps() {
    const me = this;
    const timestamps = me._cache.labels || [];
    let i, ilen;

    if (timestamps.length) {
      return timestamps;
    }

    const labels = me.getLabels();

    for (i = 0, ilen = labels.length; i < ilen; ++i) {
      timestamps.push(parse(me, labels[i]));
    }

    return me._cache.labels = me._normalized ? timestamps : me.normalize(timestamps);
  }

  normalize(values) {
    return (0, _helpersSegment._)(values.sort(sorter));
  }

}

exports.TimeScale = TimeScale;
TimeScale.id = 'time';
TimeScale.defaults = {
  bounds: 'data',
  adapters: {},
  time: {
    parser: false,
    unit: false,
    round: false,
    isoWeekday: false,
    minUnit: 'millisecond',
    displayFormats: {}
  },
  ticks: {
    source: 'auto',
    major: {
      enabled: false
    }
  }
};

function interpolate(table, val, reverse) {
  let prevSource, nextSource, prevTarget, nextTarget;

  if (reverse) {
    prevSource = Math.floor(val);
    nextSource = Math.ceil(val);
    prevTarget = table[prevSource];
    nextTarget = table[nextSource];
  } else {
    const result = (0, _helpersSegment.aG)(table, val);
    prevTarget = result.lo;
    nextTarget = result.hi;
    prevSource = table[prevTarget];
    nextSource = table[nextTarget];
  }

  const span = nextSource - prevSource;
  return span ? prevTarget + (nextTarget - prevTarget) * (val - prevSource) / span : prevTarget;
}

class TimeSeriesScale extends TimeScale {
  constructor(props) {
    super(props);
    this._table = [];
    this._maxIndex = undefined;
  }

  initOffsets() {
    const me = this;

    const timestamps = me._getTimestampsForTable();

    me._table = me.buildLookupTable(timestamps);
    me._maxIndex = me._table.length - 1;
    super.initOffsets(timestamps);
  }

  buildLookupTable(timestamps) {
    const me = this;
    const {
      min,
      max
    } = me;

    if (!timestamps.length) {
      return [{
        time: min,
        pos: 0
      }, {
        time: max,
        pos: 1
      }];
    }

    const items = [min];
    let i, ilen, curr;

    for (i = 0, ilen = timestamps.length; i < ilen; ++i) {
      curr = timestamps[i];

      if (curr > min && curr < max) {
        items.push(curr);
      }
    }

    items.push(max);
    return items;
  }

  _getTimestampsForTable() {
    const me = this;
    let timestamps = me._cache.all || [];

    if (timestamps.length) {
      return timestamps;
    }

    const data = me.getDataTimestamps();
    const label = me.getLabelTimestamps();

    if (data.length && label.length) {
      timestamps = me.normalize(data.concat(label));
    } else {
      timestamps = data.length ? data : label;
    }

    timestamps = me._cache.all = timestamps;
    return timestamps;
  }

  getPixelForValue(value, index) {
    const me = this;
    const offsets = me._offsets;
    const pos = me._normalized && me._maxIndex > 0 && !(0, _helpersSegment.j)(index) ? index / me._maxIndex : me.getDecimalForValue(value);
    return me.getPixelForDecimal((offsets.start + pos) * offsets.factor);
  }

  getDecimalForValue(value) {
    return interpolate(this._table, value) / this._maxIndex;
  }

  getValueForPixel(pixel) {
    const me = this;
    const offsets = me._offsets;
    const decimal = me.getDecimalForPixel(pixel) / offsets.factor - offsets.end;
    return interpolate(me._table, decimal * this._maxIndex, true);
  }

}

exports.TimeSeriesScale = TimeSeriesScale;
TimeSeriesScale.id = 'timeseries';
TimeSeriesScale.defaults = TimeScale.defaults;
var scales = /*#__PURE__*/Object.freeze({
  __proto__: null,
  CategoryScale: CategoryScale,
  LinearScale: LinearScale,
  LogarithmicScale: LogarithmicScale,
  RadialLinearScale: RadialLinearScale,
  TimeScale: TimeScale,
  TimeSeriesScale: TimeSeriesScale
});
exports.scales = scales;
const registerables = [controllers, elements, plugins, scales];
exports.registerables = registerables;
},{"./chunks/helpers.segment.js":"../node_modules/chart.js/dist/chunks/helpers.segment.js"}],"views/pages/home.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _App = _interopRequireDefault(require("./../../App"));

var _litHtml = require("lit-html");

var _Router = require("./../../Router");

var _Auth = _interopRequireDefault(require("./../../Auth"));

var _Utils = _interopRequireDefault(require("./../../Utils"));

var _FetchAPI = _interopRequireDefault(require("./../../FetchAPI"));

var _chart = require("chart.js");

var _gsapCore = require("gsap/gsap-core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  const data = _taggedTemplateLiteral(["\n        <style>\n            .charts-container{\n                width: 100%;\n                display: flex;\n                flex-wrap: wrap;\n                justify-content: space-between;\n                align-items: center;\n            }\n            \n            .chart-container{\n                position: relative; \n                margin: auto;\n                width: 500px;\n                height: 500px;\n                min-width: 400px;\n                min-height: 400px;\n                padding: 1rem;\n            }\n\n            /* RESPONSIVE - SMALLER MONITORS -------------------*/\n            @media all and (max-width: 1611px) {\n                .charts-container{\n                    justify-content: space-evenly;\n            }\n                .chart-container{\n                    width: 50%;\n                    min-width: 300px;\n                    min-height: 300px;\n                }\n            }\n\n            /* RESPONSIVE - TABLET LRG -------------------*/\n            @media all and (max-width: 1023px) {\n                .chart-container{\n                    width: 100%;\n                    height: 100%;\n                }\n            }\n\n            /* RESPONSIVE - MOBILE -------------------*/\n            @media all and (max-width: 359px) {\n                .chart-container{\n                    height: 100%;\n                }\n            }\n        </style>\n\n        <link href=\"https://fonts.googleapis.com/icon?family=Material+Icons\" rel=\"stylesheet\">\n        <va-app-header title=\"Dashboard\" user=", "></va-app-header>\n        <div class=\"page-content\">\n            <aa-panel-template title=", ">\n            <div class=\"charts-container\" slot=\"body\">\n                <div class=\"chart-container\">\n                    <canvas class=\"charts\" id=\"myChart1\"></canvas>\n                </div>\n                <div class=\"chart-container\">\n                    <canvas class=\"charts\" id=\"myChart2\"></canvas>\n                </div>\n                <div class=\"chart-container\">\n                    <canvas class=\"charts\" id=\"myChart3\"></canvas>\n                </div>\n                <div class=\"chart-container\">\n                    <canvas class=\"charts\" id=\"myChart4\"></canvas>\n                </div>\n                <div class=\"chart-container\">\n                    <canvas class=\"charts\" id=\"myChart5\"></canvas>\n                </div>\n                <div class=\"chart-container\">\n                    <canvas class=\"charts\" id=\"myChart6\"></canvas>\n                </div>\n            </div>\n            </aa-panel-template>\n        </div>\n        "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

_chart.Chart.register(_chart.ArcElement, _chart.LineElement, _chart.BarElement, _chart.PointElement, _chart.BarController, _chart.BubbleController, _chart.DoughnutController, _chart.LineController, _chart.PieController, _chart.PolarAreaController, _chart.RadarController, _chart.ScatterController, _chart.CategoryScale, _chart.LinearScale, _chart.LogarithmicScale, _chart.RadialLinearScale, _chart.TimeScale, _chart.TimeSeriesScale, _chart.Decimation, _chart.Filler, _chart.Legend, _chart.Title, _chart.Tooltip);

class HomeView {
  async init() {
    console.log('HomeView.init');
    document.title = 'Overview';
    let users = await _FetchAPI.default.getUsersAsync();
    let items = await _FetchAPI.default.getItemsAsync();
    let places = await _FetchAPI.default.getPlacesAsync();
    await this.render();
    await this.renderCharts(users, items, places);

    _Utils.default.pageIntroAnim();
  }

  handleClick() {// console.log(`User selected... ${JSON.stringify(users)}`)
  }

  async renderCharts(users, items, places) {
    let ctx1 = document.getElementById('myChart1').getContext('2d');
    _chart.Chart.defaults.color = '#fff';
    let myChart1 = new _chart.Chart(ctx1, {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
          hoverBackgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)', 'rgba(75, 192, 192, 0.5)', 'rgba(153, 102, 255, 0.5)', 'rgba(255, 159, 64, 0.5)'],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
    let ctx2 = document.getElementById('myChart2').getContext('2d');
    console.log(items);
    _chart.Chart.defaults.color = '#fff';
    let i, j;
    let labels = [];
    let temp = [];
    let durations = [];
    let colours = [];
    console.log(durations);
    items.forEach(item => {
      labels.push("".concat(item.name, " duration"));
      temp.push(item.activityHistory.activityDuration); // colours.push()
    });
    console.log(temp);

    for (i = 0; i < temp.length; i++) {
      let counter = 0;

      for (j = 0; j < temp[i].length; j++) {
        counter += temp[i][j];
      }

      durations.push(counter);
    }

    console.log(durations);
    let myChart2 = new _chart.Chart(ctx2, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: 'Most used device',
          data: durations,
          backgroundColor: [// this will be random generated and other colours are opacity variations
          'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
          hoverBackgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)'],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
    let ctx3 = document.getElementById('myChart3').getContext('2d');
    _chart.Chart.defaults.color = '#fff';
    let myChart3 = new _chart.Chart(ctx3, {
      type: 'line',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
    let ctx4 = document.getElementById('myChart4').getContext('2d');
    _chart.Chart.defaults.color = '#fff';
    let myChart4 = new _chart.Chart(ctx4, {
      type: 'radar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
    let ctx5 = document.getElementById('myChart5').getContext('2d');
    _chart.Chart.defaults.color = '#fff';
    let myChart5 = new _chart.Chart(ctx5, {
      type: 'polarArea',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
    let ctx6 = document.getElementById('myChart6').getContext('2d');
    _chart.Chart.defaults.color = '#fff';
    let myChart6 = new _chart.Chart(ctx6, {
      type: 'pie',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  async render() {
    const template = (0, _litHtml.html)(_templateObject(), JSON.stringify(_Auth.default.currentUser), document.title);
    (0, _litHtml.render)(template, _App.default.rootEl);
  }

}

var _default = new HomeView();

exports.default = _default;
},{"./../../App":"App.js","lit-html":"../node_modules/lit-html/lit-html.js","./../../Router":"Router.js","./../../Auth":"Auth.js","./../../Utils":"Utils.js","./../../FetchAPI":"FetchAPI.js","chart.js":"../node_modules/chart.js/dist/chart.esm.js","gsap/gsap-core":"../node_modules/gsap/gsap-core.js"}],"views/pages/404.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _App = _interopRequireDefault(require("./../../App"));

var _litHtml = require("lit-html");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  const data = _taggedTemplateLiteral(["    \n      <div class=\"calign\">\n        <h1>Opps!</h1>\n        <p>Sorry, we couldn't find that.</p>\n      </div>\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

class FourOFourView {
  init() {
    console.log('FourOFourView.init');
    document.title = '404 File not found';
    this.render();
  }

  render() {
    const template = (0, _litHtml.html)(_templateObject());
    (0, _litHtml.render)(template, _App.default.rootEl);
  }

}

var _default = new FourOFourView();

exports.default = _default;
},{"./../../App":"App.js","lit-html":"../node_modules/lit-html/lit-html.js"}],"views/pages/places.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _App = _interopRequireDefault(require("../../App"));

var _litHtml = require("lit-html");

var _Router = require("../../Router");

var _Auth = _interopRequireDefault(require("../../Auth"));

var _Utils = _interopRequireDefault(require("../../Utils"));

var _FetchAPI = _interopRequireDefault(require("../../FetchAPI"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject2() {
  const data = _taggedTemplateLiteral(["\n            <div class=\"cols col1\">\n                <div class=\"material-icons\">", "</div>\n              </div>\n              <div class=\"cols col2\">\n                <div>", "</div>\n              </div>\n              <div class=\"cols col4\">\n                <div class=\"material-icons link\" @click=", ">handyman</div>\n              </div>\n            </div>\n            "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  const data = _taggedTemplateLiteral(["\n    <style>\n      .active{\n        color: lightgreen;\n      }\n\n      .inactive{\n        color: red;\n      }\n\n      .image{\n        height: 100%;\n        width: auto;\n      }\n\n      .grid-container{\n        display: grid;\n        width: 100%;\n        grid-template-columns: 10% 80% 10%;\n      }\n\n      .header{\n        font-weight: 900;\n        font-size: 1.2rem;\n      }\n\n      .cols{\n        border-bottom: 1px solid;\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        width: 100%;\n        height: 4rem;\n        padding: 0.5rem 0;\n      }\n\n      .col1{\n      }\n\n      .col2{\n        justify-content: flex-start;\n        padding: 0 1rem;\n      }\n\n      .col3{\n\n      }\n\n      .col4{\n        justify-content: flex-end;\n      }\n\n      .link{\n        cursor: pointer;\n      }\n\n      .col1 .material-icons{\n        font-size: 48px !important;\n      }\n\n      div::part(body){\n        /* background: orange; */\n      }\n\n    </style>\n    <link href=\"https://fonts.googleapis.com/icon?family=Material+Icons\" rel=\"stylesheet\">\n    <va-app-header title=\"Places\" user=\"", "\"></va-app-header>\n    <div class=\"page-content\">\n      <aa-panel-template title=", ">\n        <div slot=\"table-heading\">\n          <div class=\"grid-container\">\n            <div class=\"cols col1 header\">\n              <div></div>\n            </div>\n            <div class=\"cols col2 header\">\n              <div>Place Name</div>\n            </div>\n            <div class=\"cols col4 header\">\n              <div></div>\n            </div>\n          </div>\n        </div>\n        <div slot=\"body\" part=\"body\">\n          <div class=\"grid-container\">\n            ", "\n              </div>\n          </div>\n        </div>\n      </aa-panel-template>\n    </div>      \n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

class PlacesView {
  async init() {
    document.title = 'Places';
    let places = await _FetchAPI.default.getPlacesAsync();
    await this.render(places);

    _Utils.default.pageIntroAnim();
  }

  handleClick(place) {
    console.log("Place selected... ".concat(JSON.stringify(place)));
  }

  async render(places) {
    const template = (0, _litHtml.html)(_templateObject(), JSON.stringify(_Auth.default.currentUser), document.title, places.map(place => (0, _litHtml.html)(_templateObject2(), place.locationType.iconURL, place.placeName, () => this.handleClick(place))));
    (0, _litHtml.render)(template, _App.default.rootEl);
  }

}

var _default = new PlacesView();

exports.default = _default;
},{"../../App":"App.js","lit-html":"../node_modules/lit-html/lit-html.js","../../Router":"Router.js","../../Auth":"Auth.js","../../Utils":"Utils.js","../../FetchAPI":"FetchAPI.js"}],"views/pages/devices.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _App = _interopRequireDefault(require("../../App"));

var _litHtml = require("lit-html");

var _Router = require("../../Router");

var _Auth = _interopRequireDefault(require("../../Auth"));

var _Utils = _interopRequireDefault(require("../../Utils"));

var _FetchAPI = _interopRequireDefault(require("../../FetchAPI"));

var _gsap = _interopRequireDefault(require("gsap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject2() {
  const data = _taggedTemplateLiteral(["\n            <div class=\"cols col1\">\n              <div class=\"material-icons\">", "</div>\n            </div>\n            <div class=\"cols col2\">\n              <div>", "</div>\n            </div>\n              <div class=\"cols col3\">\n                <div>", "</div>\n              </div>\n              <div class=\"cols col4\">\n                <div class=\"status-container\">\n                  <div class=\"", "\"></div>\n                  <div>", "</div>\n                </div>\n              </div>\n              <div class=\"cols col5\">\n                <div class=\"status-container\">\n                  <div class=\"", "\"></div>\n                  <div>", " ", "</div>\n                </div>\n              </div>\n            <div class=\"cols col6\">\n              <div class=\"", " material-icons\">", "</div>\n            </div>\n              <div class=\"cols col7\">\n                <div class=\"material-icons link\" @click=", ">handyman</div>\n              </div>\n            </div>\n            "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  const data = _taggedTemplateLiteral(["\n      <style>\n        .status-container{\n          display: flex; \n          align-items: center; \n          justify-content: center; \n        }\n\n        .active{\n          background: #003A85;\n          width: 22px;\n          height: 12px;\n          margin-right: 10px;\n          /* box-shadow: #000 0 -1px 7px 1px, inset #460 0 -1px 9px, #7D0 0 2px 12px; */\n        }\n\n        .inactive{\n          background-color: red;\n          width: 22px;\n          height: 12px;\n          margin-right: 10px;\n        }\n\n        .online{\n          width: 22px;\n          height: 12px;\n          background-color: #00FF33;\n          margin-right: 10px;\n          /* box-shadow: #000 0 -1px 7px 1px, inset #460 0 -1px 9px, #7D0 0 2px 12px; */\n        }\n\n        .offline{\n          width: 22px;\n          height: 12px;\n          background-color: lightgray;\n          margin-right: 10px;\n        }\n\n        .image{\n          height: 100%;\n          width: auto;\n        }\n\n        .grid-container{\n          display: grid;\n          width: 100%;\n          grid-template-columns: 10% 20% 20% 20% 20% 5% 5%;\n        }\n\n        .header{\n          font-weight: 900;\n          font-size: 1.2rem;\n        }\n\n        .cols{\n          border-bottom: 1px solid;\n          display: flex;\n          justify-content: center;\n          align-items: center;\n          width: 100%;\n          height: 4rem;\n          padding: 0.5rem 0;\n        }\n\n        /* .col1{\n        } */\n\n        .col2{\n          justify-content: flex-start;\n          padding: 0 1rem;\n        }\n\n        .col3{\n          justify-content: flex-start;\n        }\n\n        .col4{\n          /* justify-content: flex-start; */\n        }\n\n        .col5{\n          /* justify-content: flex-start; */\n        }\n\n        .col6{\n\n        }\n\n        .col7{\n\n        }\n\n        .link{\n          cursor: pointer;\n        }\n\n        .col1 .material-icons{\n          font-size: 48px !important;\n        }\n\n        div::part(body){\n          /* background: orange; */\n        }\n\n      </style>\n      <link href=\"https://fonts.googleapis.com/icon?family=Material+Icons\" rel=\"stylesheet\">\n      <va-app-header title=\"Devices\" user=\"", "\"></va-app-header>\n      <div class=\"page-content\">\n        <aa-panel-template title=", ">\n          <div slot=\"table-heading\">\n            <div class=\"grid-container\">\n              <div class=\"cols col1 header\">\n                <div></div>\n              </div>\n              <div class=\"cols col2 header\">\n                <div>Device Name</div>\n              </div>\n              <div class=\"cols col3 header\">\n                <div>Location</div>\n              </div>\n              <div class=\"cols col4 header\">\n                <div>Sensor Status</div>\n              </div>\n              <div class=\"cols col5 header\">\n                <div>Status</div>\n              </div>\n              <div class=\"cols col6 header\">\n                <div class=\"material-icons\">push_pin</div>\n              </div>\n              <div class=\"cols col7 header\">\n                <div></div>\n              </div>\n            </div>\n          </div>\n          <div slot=\"body\" part=\"body\">\n            <div class=\"grid-container\">\n              ", "\n            </div>\n        </div>\n      </div>\n    </aa-panel-template>\n  </div>     \n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

class DevicesView {
  async init() {
    document.title = 'Devices';
    let devices = await _FetchAPI.default.getItemsAsync();
    await this.render(devices);
    this.animateStatus();

    _Utils.default.pageIntroAnim();
  }

  animateStatus() {
    const tl1 = new _gsap.default.to(".active", {
      backgroundColor: "#3B90FF",
      delay: 0.5,
      duration: .5,
      repeat: -1,
      yoyo: true
    });
  }

  handleClick(device) {
    console.log("Device selected... ".concat(JSON.stringify(device)));
  }

  async render(devices) {
    const template = (0, _litHtml.html)(_templateObject(), JSON.stringify(_Auth.default.currentUser), document.title, devices.map(device => (0, _litHtml.html)(_templateObject2(), device.type.iconURL, device.name, device.placeName.placeName, device.status ? "online" : "offline", device.status ? "online" : "offline", device.state ? "active" : "inactive", device.level ? "".concat(device.level, "%,") : "", device.state ? "active" : "inactive", device.pinned ? "pinned" : "unpinned", device.pinned ? "push_pin" : "", () => this.handleClick(device))));
    (0, _litHtml.render)(template, _App.default.rootEl);
  }

}

var _default = new DevicesView();

exports.default = _default;
},{"../../App":"App.js","lit-html":"../node_modules/lit-html/lit-html.js","../../Router":"Router.js","../../Auth":"Auth.js","../../Utils":"Utils.js","../../FetchAPI":"FetchAPI.js","gsap":"../node_modules/gsap/index.js"}],"views/pages/guide.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _App = _interopRequireDefault(require("../../App"));

var _litHtml = require("lit-html");

var _Router = require("../../Router");

var _Auth = _interopRequireDefault(require("../../Auth"));

var _Utils = _interopRequireDefault(require("../../Utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  const data = _taggedTemplateLiteral(["\n      <va-app-header title=\"Guide\" user=\"", "\"></va-app-header>\n      <div class=\"page-content calign\">\n        <h3 class=\"brand-color\">Welcome ", "!</h3>\n        <p>This is a quick tour to teach you the basics of using Haircuts ...</p>\n      \n        <div class=\"guide-step\">\n          <h4>Search Hairdressers</h4>\n          <img src=\"https://plchldr.co/i/500x300?&bg=dddddd&fc=666666&text=IMAGE\">\n        </div>\n      \n        <div class=\"guide-step\">\n          <h4>Find a haircut</h4>\n          <img src=\"https://plchldr.co/i/500x300?&bg=dddddd&fc=666666&text=IMAGE\">\n        </div>\n      \n        <div class=\"guide-step\">\n          <h4>Save haircuts to favourites</h4>\n          <img src=\"https://plchldr.co/i/500x300?&bg=dddddd&fc=666666&text=IMAGE\">\n        </div>\n      \n        <sl-button type=\"primary\" @click=", ">Okay got it!</sl-button>\n      \n      \n      </div>\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

class GuideView {
  init() {
    document.title = 'Guide';
    this.render();

    _Utils.default.pageIntroAnim();
  }

  render() {
    const template = (0, _litHtml.html)(_templateObject(), JSON.stringify(_Auth.default.currentUser), _Auth.default.currentUser.firstName, () => (0, _Router.gotoRoute)('/'));
    (0, _litHtml.render)(template, _App.default.rootEl);
  }

}

var _default = new GuideView();

exports.default = _default;
},{"../../App":"App.js","lit-html":"../node_modules/lit-html/lit-html.js","../../Router":"Router.js","../../Auth":"Auth.js","../../Utils":"Utils.js"}],"views/pages/usersView.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _App = _interopRequireDefault(require("../../App"));

var _litHtml = require("lit-html");

var _Router = require("../../Router");

var _Auth = _interopRequireDefault(require("../../Auth"));

var _Utils = _interopRequireDefault(require("../../Utils"));

var _FetchAPI = _interopRequireDefault(require("../../FetchAPI"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject4() {
  const data = _taggedTemplateLiteral(["    \n                      <img src=", " \n                            alt=\"", "\"\n                            class=\"image\"/>\n                    "]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  const data = _taggedTemplateLiteral(["\n                      <div class=\"material-icons\">account_circle</div>\n                      "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  const data = _taggedTemplateLiteral(["\n              <div class=\"cols col1\">\n                  ", "\n                </div>\n                <div class=\"cols col2\">\n                  <div>", " ", "</div>\n                </div>\n                <div class=\"cols col3\">\n                  <div class=", ">", "</div>\n                </div>\n                <div class=\"cols col4\">\n                  <div class=\"material-icons link\" @click=", ">handyman</div>\n                </div>\n              </div>\n              "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  const data = _taggedTemplateLiteral(["\n      <style>\n        .active{\n          color: lightgreen;\n        }\n\n        .inactive{\n          color: red;\n        }\n\n        .image{\n          height: 100%;\n          width: auto;\n        }\n\n        .grid-container{\n          display: grid;\n          width: 100%;\n          grid-template-columns: 10% 40% 40% 10%;\n        }\n\n        .header{\n          font-weight: 900;\n          font-size: 1.2rem;\n        }\n\n        .cols{\n          border-bottom: 1px solid;\n          display: flex;\n          justify-content: center;\n          align-items: center;\n          width: 100%;\n          height: 4rem;\n          padding: 0.5rem 0;\n        }\n\n        .col1{\n        }\n\n        .col2{\n          justify-content: flex-start;\n          padding: 0 1rem;\n        }\n\n        .col3{\n\n        }\n\n        .col4{\n          justify-content: flex-end;\n        }\n\n        .link{\n          cursor: pointer;\n        }\n\n        .col1 .material-icons{\n          font-size: 48px !important;\n        }\n\n        div::part(body){\n          /* background: orange; */\n        }\n\n      </style>\n      <link href=\"https://fonts.googleapis.com/icon?family=Material+Icons\" rel=\"stylesheet\">\n      <va-app-header title=\"Users\" user=\"", "\"></va-app-header>\n      <div class=\"page-content\">\n        <aa-panel-template title=", ">\n          <div slot=\"table-heading\">\n            <div class=\"grid-container\">\n              <div class=\"cols col1 header\">\n                <div></div>\n              </div>\n              <div class=\"cols col2 header\">\n                <div>User Name</div>\n              </div>\n              <div class=\"cols col3 header\">\n                <div>Status</div>\n              </div>\n              <div class=\"cols col4 header\">\n                <div></div>\n              </div>\n            </div>\n          </div>\n          <div slot=\"body\" part=\"body\">\n            <div class=\"grid-container\">\n              ", "\n                </div>\n            </div>\n          </div>\n        </aa-panel-template>\n      </div>      \n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

class UsersView {
  async init() {
    document.title = 'Users';
    let users = await _FetchAPI.default.getUsersAsync();
    await this.render(users);

    _Utils.default.pageIntroAnim();
  }

  handleClick(user) {
    console.log("User selected... ".concat(JSON.stringify(user)));
  }

  async render(users) {
    const template = (0, _litHtml.html)(_templateObject(), JSON.stringify(_Auth.default.currentUser), document.title, users.map(user => (0, _litHtml.html)(_templateObject2(), user.imageURL === "" ? (0, _litHtml.html)(_templateObject3()) : (0, _litHtml.html)(_templateObject4(), "".concat(_App.default.apiBase, "/images/").concat(user.imageURL), "".concat(user.firstName, " image")), user.firstName, user.lastName, user.status ? "active" : "inactive", user.status ? "Active" : "Inactive", () => this.handleClick(user))));
    (0, _litHtml.render)(template, _App.default.rootEl);
  }

}

var _default = new UsersView();

exports.default = _default;
},{"../../App":"App.js","lit-html":"../node_modules/lit-html/lit-html.js","../../Router":"Router.js","../../Auth":"Auth.js","../../Utils":"Utils.js","../../FetchAPI":"FetchAPI.js"}],"Router.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gotoRoute = gotoRoute;
exports.anchorRoute = anchorRoute;
exports.default = void 0;

var _home = _interopRequireDefault(require("./views/pages/home"));

var _ = _interopRequireDefault(require("./views/pages/404"));

var _places = _interopRequireDefault(require("./views/pages/places"));

var _devices = _interopRequireDefault(require("./views/pages/devices"));

var _guide = _interopRequireDefault(require("./views/pages/guide"));

var _usersView = _interopRequireDefault(require("./views/pages/usersView"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import views
// import profileView from './views/pages/profile'
// import editProfileView from './views/pages/editProfile'
// define routes
const routes = {
  '/': _home.default,
  '/guide': _guide.default,
  '/users': _usersView.default,
  '404': _.default,
  '/places': _places.default,
  '/devices': _devices.default // '/profile': profileView,
  // '/editProfile': editProfileView

};

class Router {
  constructor() {
    this.routes = routes;
  }

  init() {
    // initial call
    this.route(window.location.pathname); // on back/forward

    window.addEventListener('popstate', () => {
      this.route(window.location.pathname);
    });
  }

  route(fullPathname) {
    // extract path without params
    const pathname = fullPathname.split('?')[0];
    const route = this.routes[pathname];

    if (route) {
      // if route exists, run init() of the view
      this.routes[window.location.pathname].init();
    } else {
      // show 404 view instead
      this.routes['404'].init();
    }
  }

  gotoRoute(pathname) {
    window.history.pushState({}, pathname, window.location.origin + pathname);
    this.route(pathname);
  }

} // create appRouter instance and export


const AppRouter = new Router();
var _default = AppRouter; // programmatically load any route

exports.default = _default;

function gotoRoute(pathname) {
  AppRouter.gotoRoute(pathname);
} // allows anchor <a> links to load routes


function anchorRoute(e) {
  e.preventDefault();
  const pathname = e.target.closest('a').pathname;
  AppRouter.gotoRoute(pathname);
}
},{"./views/pages/home":"views/pages/home.js","./views/pages/404":"views/pages/404.js","./views/pages/places":"views/pages/places.js","./views/pages/devices":"views/pages/devices.js","./views/pages/guide":"views/pages/guide.js","./views/pages/usersView":"views/pages/usersView.js"}],"App.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Router = _interopRequireDefault(require("./Router"));

var _Auth = _interopRequireDefault(require("./Auth"));

var _Toast = _interopRequireDefault(require("./Toast"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class App {
  constructor() {
    this.name = "Haircuts";
    this.version = "1.0.0";
    this.apiBase = 'http://localhost:3000';
    this.rootEl = document.getElementById("root");
    this.version = "1.0.0";
  }

  init() {
    console.log("App.init"); // Toast init

    _Toast.default.init(); // Authentication check    


    _Auth.default.check(() => {
      // authenticated! init Router
      _Router.default.init();
    });
  }

}

var _default = new App();

exports.default = _default;
},{"./Router":"Router.js","./Auth":"Auth.js","./Toast":"Toast.js"}],"../node_modules/lit-html/lib/modify-template.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeNodesFromTemplate = removeNodesFromTemplate;
exports.insertNodeIntoTemplate = insertNodeIntoTemplate;

var _template = require("./template.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const walkerNodeFilter = 133
/* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
;
/**
 * Removes the list of nodes from a Template safely. In addition to removing
 * nodes from the Template, the Template part indices are updated to match
 * the mutated Template DOM.
 *
 * As the template is walked the removal state is tracked and
 * part indices are adjusted as needed.
 *
 * div
 *   div#1 (remove) <-- start removing (removing node is div#1)
 *     div
 *       div#2 (remove)  <-- continue removing (removing node is still div#1)
 *         div
 * div <-- stop removing since previous sibling is the removing node (div#1,
 * removed 4 nodes)
 */

function removeNodesFromTemplate(template, nodesToRemove) {
  const {
    element: {
      content
    },
    parts
  } = template;
  const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
  let partIndex = nextActiveIndexInTemplateParts(parts);
  let part = parts[partIndex];
  let nodeIndex = -1;
  let removeCount = 0;
  const nodesToRemoveInTemplate = [];
  let currentRemovingNode = null;

  while (walker.nextNode()) {
    nodeIndex++;
    const node = walker.currentNode; // End removal if stepped past the removing node

    if (node.previousSibling === currentRemovingNode) {
      currentRemovingNode = null;
    } // A node to remove was found in the template


    if (nodesToRemove.has(node)) {
      nodesToRemoveInTemplate.push(node); // Track node we're removing

      if (currentRemovingNode === null) {
        currentRemovingNode = node;
      }
    } // When removing, increment count by which to adjust subsequent part indices


    if (currentRemovingNode !== null) {
      removeCount++;
    }

    while (part !== undefined && part.index === nodeIndex) {
      // If part is in a removed node deactivate it by setting index to -1 or
      // adjust the index as needed.
      part.index = currentRemovingNode !== null ? -1 : part.index - removeCount; // go to the next active part.

      partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
      part = parts[partIndex];
    }
  }

  nodesToRemoveInTemplate.forEach(n => n.parentNode.removeChild(n));
}

const countNodes = node => {
  let count = node.nodeType === 11
  /* Node.DOCUMENT_FRAGMENT_NODE */
  ? 0 : 1;
  const walker = document.createTreeWalker(node, walkerNodeFilter, null, false);

  while (walker.nextNode()) {
    count++;
  }

  return count;
};

const nextActiveIndexInTemplateParts = (parts, startIndex = -1) => {
  for (let i = startIndex + 1; i < parts.length; i++) {
    const part = parts[i];

    if ((0, _template.isTemplatePartActive)(part)) {
      return i;
    }
  }

  return -1;
};
/**
 * Inserts the given node into the Template, optionally before the given
 * refNode. In addition to inserting the node into the Template, the Template
 * part indices are updated to match the mutated Template DOM.
 */


function insertNodeIntoTemplate(template, node, refNode = null) {
  const {
    element: {
      content
    },
    parts
  } = template; // If there's no refNode, then put node at end of template.
  // No part indices need to be shifted in this case.

  if (refNode === null || refNode === undefined) {
    content.appendChild(node);
    return;
  }

  const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
  let partIndex = nextActiveIndexInTemplateParts(parts);
  let insertCount = 0;
  let walkerIndex = -1;

  while (walker.nextNode()) {
    walkerIndex++;
    const walkerNode = walker.currentNode;

    if (walkerNode === refNode) {
      insertCount = countNodes(node);
      refNode.parentNode.insertBefore(node, refNode);
    }

    while (partIndex !== -1 && parts[partIndex].index === walkerIndex) {
      // If we've inserted the node, simply adjust all subsequent parts
      if (insertCount > 0) {
        while (partIndex !== -1) {
          parts[partIndex].index += insertCount;
          partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
        }

        return;
      }

      partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
    }
  }
}
},{"./template.js":"../node_modules/lit-html/lib/template.js"}],"../node_modules/lit-html/lib/shady-render.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "html", {
  enumerable: true,
  get: function () {
    return _litHtml.html;
  }
});
Object.defineProperty(exports, "svg", {
  enumerable: true,
  get: function () {
    return _litHtml.svg;
  }
});
Object.defineProperty(exports, "TemplateResult", {
  enumerable: true,
  get: function () {
    return _litHtml.TemplateResult;
  }
});
exports.render = exports.shadyTemplateFactory = void 0;

var _dom = require("./dom.js");

var _modifyTemplate = require("./modify-template.js");

var _render = require("./render.js");

var _templateFactory = require("./template-factory.js");

var _templateInstance = require("./template-instance.js");

var _template = require("./template.js");

var _litHtml = require("../lit-html.js");

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * Module to add shady DOM/shady CSS polyfill support to lit-html template
 * rendering. See the [[render]] method for details.
 *
 * @packageDocumentation
 */

/**
 * Do not remove this comment; it keeps typedoc from misplacing the module
 * docs.
 */
// Get a key to lookup in `templateCaches`.
const getTemplateCacheKey = (type, scopeName) => `${type}--${scopeName}`;

let compatibleShadyCSSVersion = true;

if (typeof window.ShadyCSS === 'undefined') {
  compatibleShadyCSSVersion = false;
} else if (typeof window.ShadyCSS.prepareTemplateDom === 'undefined') {
  console.warn(`Incompatible ShadyCSS version detected. ` + `Please update to at least @webcomponents/webcomponentsjs@2.0.2 and ` + `@webcomponents/shadycss@1.3.1.`);
  compatibleShadyCSSVersion = false;
}
/**
 * Template factory which scopes template DOM using ShadyCSS.
 * @param scopeName {string}
 */


const shadyTemplateFactory = scopeName => result => {
  const cacheKey = getTemplateCacheKey(result.type, scopeName);

  let templateCache = _templateFactory.templateCaches.get(cacheKey);

  if (templateCache === undefined) {
    templateCache = {
      stringsArray: new WeakMap(),
      keyString: new Map()
    };

    _templateFactory.templateCaches.set(cacheKey, templateCache);
  }

  let template = templateCache.stringsArray.get(result.strings);

  if (template !== undefined) {
    return template;
  }

  const key = result.strings.join(_template.marker);
  template = templateCache.keyString.get(key);

  if (template === undefined) {
    const element = result.getTemplateElement();

    if (compatibleShadyCSSVersion) {
      window.ShadyCSS.prepareTemplateDom(element, scopeName);
    }

    template = new _template.Template(result, element);
    templateCache.keyString.set(key, template);
  }

  templateCache.stringsArray.set(result.strings, template);
  return template;
};

exports.shadyTemplateFactory = shadyTemplateFactory;
const TEMPLATE_TYPES = ['html', 'svg'];
/**
 * Removes all style elements from Templates for the given scopeName.
 */

const removeStylesFromLitTemplates = scopeName => {
  TEMPLATE_TYPES.forEach(type => {
    const templates = _templateFactory.templateCaches.get(getTemplateCacheKey(type, scopeName));

    if (templates !== undefined) {
      templates.keyString.forEach(template => {
        const {
          element: {
            content
          }
        } = template; // IE 11 doesn't support the iterable param Set constructor

        const styles = new Set();
        Array.from(content.querySelectorAll('style')).forEach(s => {
          styles.add(s);
        });
        (0, _modifyTemplate.removeNodesFromTemplate)(template, styles);
      });
    }
  });
};

const shadyRenderSet = new Set();
/**
 * For the given scope name, ensures that ShadyCSS style scoping is performed.
 * This is done just once per scope name so the fragment and template cannot
 * be modified.
 * (1) extracts styles from the rendered fragment and hands them to ShadyCSS
 * to be scoped and appended to the document
 * (2) removes style elements from all lit-html Templates for this scope name.
 *
 * Note, <style> elements can only be placed into templates for the
 * initial rendering of the scope. If <style> elements are included in templates
 * dynamically rendered to the scope (after the first scope render), they will
 * not be scoped and the <style> will be left in the template and rendered
 * output.
 */

const prepareTemplateStyles = (scopeName, renderedDOM, template) => {
  shadyRenderSet.add(scopeName); // If `renderedDOM` is stamped from a Template, then we need to edit that
  // Template's underlying template element. Otherwise, we create one here
  // to give to ShadyCSS, which still requires one while scoping.

  const templateElement = !!template ? template.element : document.createElement('template'); // Move styles out of rendered DOM and store.

  const styles = renderedDOM.querySelectorAll('style');
  const {
    length
  } = styles; // If there are no styles, skip unnecessary work

  if (length === 0) {
    // Ensure prepareTemplateStyles is called to support adding
    // styles via `prepareAdoptedCssText` since that requires that
    // `prepareTemplateStyles` is called.
    //
    // ShadyCSS will only update styles containing @apply in the template
    // given to `prepareTemplateStyles`. If no lit Template was given,
    // ShadyCSS will not be able to update uses of @apply in any relevant
    // template. However, this is not a problem because we only create the
    // template for the purpose of supporting `prepareAdoptedCssText`,
    // which doesn't support @apply at all.
    window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
    return;
  }

  const condensedStyle = document.createElement('style'); // Collect styles into a single style. This helps us make sure ShadyCSS
  // manipulations will not prevent us from being able to fix up template
  // part indices.
  // NOTE: collecting styles is inefficient for browsers but ShadyCSS
  // currently does this anyway. When it does not, this should be changed.

  for (let i = 0; i < length; i++) {
    const style = styles[i];
    style.parentNode.removeChild(style);
    condensedStyle.textContent += style.textContent;
  } // Remove styles from nested templates in this scope.


  removeStylesFromLitTemplates(scopeName); // And then put the condensed style into the "root" template passed in as
  // `template`.

  const content = templateElement.content;

  if (!!template) {
    (0, _modifyTemplate.insertNodeIntoTemplate)(template, condensedStyle, content.firstChild);
  } else {
    content.insertBefore(condensedStyle, content.firstChild);
  } // Note, it's important that ShadyCSS gets the template that `lit-html`
  // will actually render so that it can update the style inside when
  // needed (e.g. @apply native Shadow DOM case).


  window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
  const style = content.querySelector('style');

  if (window.ShadyCSS.nativeShadow && style !== null) {
    // When in native Shadow DOM, ensure the style created by ShadyCSS is
    // included in initially rendered output (`renderedDOM`).
    renderedDOM.insertBefore(style.cloneNode(true), renderedDOM.firstChild);
  } else if (!!template) {
    // When no style is left in the template, parts will be broken as a
    // result. To fix this, we put back the style node ShadyCSS removed
    // and then tell lit to remove that node from the template.
    // There can be no style in the template in 2 cases (1) when Shady DOM
    // is in use, ShadyCSS removes all styles, (2) when native Shadow DOM
    // is in use ShadyCSS removes the style if it contains no content.
    // NOTE, ShadyCSS creates its own style so we can safely add/remove
    // `condensedStyle` here.
    content.insertBefore(condensedStyle, content.firstChild);
    const removes = new Set();
    removes.add(condensedStyle);
    (0, _modifyTemplate.removeNodesFromTemplate)(template, removes);
  }
};
/**
 * Extension to the standard `render` method which supports rendering
 * to ShadowRoots when the ShadyDOM (https://github.com/webcomponents/shadydom)
 * and ShadyCSS (https://github.com/webcomponents/shadycss) polyfills are used
 * or when the webcomponentsjs
 * (https://github.com/webcomponents/webcomponentsjs) polyfill is used.
 *
 * Adds a `scopeName` option which is used to scope element DOM and stylesheets
 * when native ShadowDOM is unavailable. The `scopeName` will be added to
 * the class attribute of all rendered DOM. In addition, any style elements will
 * be automatically re-written with this `scopeName` selector and moved out
 * of the rendered DOM and into the document `<head>`.
 *
 * It is common to use this render method in conjunction with a custom element
 * which renders a shadowRoot. When this is done, typically the element's
 * `localName` should be used as the `scopeName`.
 *
 * In addition to DOM scoping, ShadyCSS also supports a basic shim for css
 * custom properties (needed only on older browsers like IE11) and a shim for
 * a deprecated feature called `@apply` that supports applying a set of css
 * custom properties to a given location.
 *
 * Usage considerations:
 *
 * * Part values in `<style>` elements are only applied the first time a given
 * `scopeName` renders. Subsequent changes to parts in style elements will have
 * no effect. Because of this, parts in style elements should only be used for
 * values that will never change, for example parts that set scope-wide theme
 * values or parts which render shared style elements.
 *
 * * Note, due to a limitation of the ShadyDOM polyfill, rendering in a
 * custom element's `constructor` is not supported. Instead rendering should
 * either done asynchronously, for example at microtask timing (for example
 * `Promise.resolve()`), or be deferred until the first time the element's
 * `connectedCallback` runs.
 *
 * Usage considerations when using shimmed custom properties or `@apply`:
 *
 * * Whenever any dynamic changes are made which affect
 * css custom properties, `ShadyCSS.styleElement(element)` must be called
 * to update the element. There are two cases when this is needed:
 * (1) the element is connected to a new parent, (2) a class is added to the
 * element that causes it to match different custom properties.
 * To address the first case when rendering a custom element, `styleElement`
 * should be called in the element's `connectedCallback`.
 *
 * * Shimmed custom properties may only be defined either for an entire
 * shadowRoot (for example, in a `:host` rule) or via a rule that directly
 * matches an element with a shadowRoot. In other words, instead of flowing from
 * parent to child as do native css custom properties, shimmed custom properties
 * flow only from shadowRoots to nested shadowRoots.
 *
 * * When using `@apply` mixing css shorthand property names with
 * non-shorthand names (for example `border` and `border-width`) is not
 * supported.
 */


const render = (result, container, options) => {
  if (!options || typeof options !== 'object' || !options.scopeName) {
    throw new Error('The `scopeName` option is required.');
  }

  const scopeName = options.scopeName;

  const hasRendered = _render.parts.has(container);

  const needsScoping = compatibleShadyCSSVersion && container.nodeType === 11
  /* Node.DOCUMENT_FRAGMENT_NODE */
  && !!container.host; // Handle first render to a scope specially...

  const firstScopeRender = needsScoping && !shadyRenderSet.has(scopeName); // On first scope render, render into a fragment; this cannot be a single
  // fragment that is reused since nested renders can occur synchronously.

  const renderContainer = firstScopeRender ? document.createDocumentFragment() : container;
  (0, _render.render)(result, renderContainer, Object.assign({
    templateFactory: shadyTemplateFactory(scopeName)
  }, options)); // When performing first scope render,
  // (1) We've rendered into a fragment so that there's a chance to
  // `prepareTemplateStyles` before sub-elements hit the DOM
  // (which might cause them to render based on a common pattern of
  // rendering in a custom element's `connectedCallback`);
  // (2) Scope the template with ShadyCSS one time only for this scope.
  // (3) Render the fragment into the container and make sure the
  // container knows its `part` is the one we just rendered. This ensures
  // DOM will be re-used on subsequent renders.

  if (firstScopeRender) {
    const part = _render.parts.get(renderContainer);

    _render.parts.delete(renderContainer); // ShadyCSS might have style sheets (e.g. from `prepareAdoptedCssText`)
    // that should apply to `renderContainer` even if the rendered value is
    // not a TemplateInstance. However, it will only insert scoped styles
    // into the document if `prepareTemplateStyles` has already been called
    // for the given scope name.


    const template = part.value instanceof _templateInstance.TemplateInstance ? part.value.template : undefined;
    prepareTemplateStyles(scopeName, renderContainer, template);
    (0, _dom.removeNodes)(container, container.firstChild);
    container.appendChild(renderContainer);

    _render.parts.set(container, part);
  } // After elements have hit the DOM, update styling if this is the
  // initial render to this container.
  // This is needed whenever dynamic changes are made so it would be
  // safest to do every render; however, this would regress performance
  // so we leave it up to the user to call `ShadyCSS.styleElement`
  // for dynamic changes.


  if (!hasRendered && needsScoping) {
    window.ShadyCSS.styleElement(container.host);
  }
};

exports.render = render;
},{"./dom.js":"../node_modules/lit-html/lib/dom.js","./modify-template.js":"../node_modules/lit-html/lib/modify-template.js","./render.js":"../node_modules/lit-html/lib/render.js","./template-factory.js":"../node_modules/lit-html/lib/template-factory.js","./template-instance.js":"../node_modules/lit-html/lib/template-instance.js","./template.js":"../node_modules/lit-html/lib/template.js","../lit-html.js":"../node_modules/lit-html/lit-html.js"}],"../node_modules/@polymer/lit-element/lib/updating-element.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UpdatingElement = exports.notEqual = exports.defaultConverter = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

/**
 * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
 * replaced at compile time by the munged name for object[property]. We cannot
 * alias this function, so we have to use a small shim that has the same
 * behavior when not compiling.
 */
const JSCompiler_renameProperty = (prop, _obj) => prop;
/**
 * Returns the property descriptor for a property on this prototype by walking
 * up the prototype chain. Note that we stop just before Object.prototype, which
 * also avoids issues with Symbol polyfills (core-js, get-own-property-symbols),
 * which create accessors for the symbols on Object.prototype.
 */


const descriptorFromPrototype = (name, proto) => {
  if (name in proto) {
    while (proto !== Object.prototype) {
      if (proto.hasOwnProperty(name)) {
        return Object.getOwnPropertyDescriptor(proto, name);
      }

      proto = Object.getPrototypeOf(proto);
    }
  }

  return undefined;
};

const defaultConverter = {
  toAttribute(value, type) {
    switch (type) {
      case Boolean:
        return value ? '' : null;

      case Object:
      case Array:
        // if the value is `null` or `undefined` pass this through
        // to allow removing/no change behavior.
        return value == null ? value : JSON.stringify(value);
    }

    return value;
  },

  fromAttribute(value, type) {
    switch (type) {
      case Boolean:
        return value !== null;

      case Number:
        return value === null ? null : Number(value);

      case Object:
      case Array:
        return JSON.parse(value);
    }

    return value;
  }

};
/**
 * Change function that returns true if `value` is different from `oldValue`.
 * This method is used as the default for a property's `hasChanged` function.
 */

exports.defaultConverter = defaultConverter;

const notEqual = (value, old) => {
  // This ensures (old==NaN, value==NaN) always returns false
  return old !== value && (old === old || value === value);
};

exports.notEqual = notEqual;
const defaultPropertyDeclaration = {
  attribute: true,
  type: String,
  converter: defaultConverter,
  reflect: false,
  hasChanged: notEqual
};
const microtaskPromise = Promise.resolve(true);
const STATE_HAS_UPDATED = 1;
const STATE_UPDATE_REQUESTED = 1 << 2;
const STATE_IS_REFLECTING_TO_ATTRIBUTE = 1 << 3;
const STATE_IS_REFLECTING_TO_PROPERTY = 1 << 4;
const STATE_HAS_CONNECTED = 1 << 5;
/**
 * Base element class which manages element properties and attributes. When
 * properties change, the `update` method is asynchronously called. This method
 * should be supplied by subclassers to render updates as desired.
 */

class UpdatingElement extends HTMLElement {
  constructor() {
    super();
    this._updateState = 0;
    this._instanceProperties = undefined;
    this._updatePromise = microtaskPromise;
    this._hasConnectedResolver = undefined;
    /**
     * Map with keys for any properties that have changed since the last
     * update cycle with previous values.
     */

    this._changedProperties = new Map();
    /**
     * Map with keys of properties that should be reflected when updated.
     */

    this._reflectingProperties = undefined;
    this.initialize();
  }
  /**
   * Returns a list of attributes corresponding to the registered properties.
   * @nocollapse
   */


  static get observedAttributes() {
    // note: piggy backing on this to ensure we're _finalized.
    this._finalize();

    const attributes = [];

    for (const [p, v] of this._classProperties) {
      const attr = this._attributeNameForProperty(p, v);

      if (attr !== undefined) {
        this._attributeToPropertyMap.set(attr, p);

        attributes.push(attr);
      }
    }

    return attributes;
  }
  /**
   * Ensures the private `_classProperties` property metadata is created.
   * In addition to `_finalize` this is also called in `createProperty` to
   * ensure the `@property` decorator can add property metadata.
   */

  /** @nocollapse */


  static _ensureClassProperties() {
    // ensure private storage for property declarations.
    if (!this.hasOwnProperty(JSCompiler_renameProperty('_classProperties', this))) {
      this._classProperties = new Map(); // NOTE: Workaround IE11 not supporting Map constructor argument.

      const superProperties = Object.getPrototypeOf(this)._classProperties;

      if (superProperties !== undefined) {
        superProperties.forEach((v, k) => this._classProperties.set(k, v));
      }
    }
  }
  /**
   * Creates a property accessor on the element prototype if one does not exist.
   * The property setter calls the property's `hasChanged` property option
   * or uses a strict identity check to determine whether or not to request
   * an update.
   * @nocollapse
   */


  static createProperty(name, options = defaultPropertyDeclaration) {
    // Note, since this can be called by the `@property` decorator which
    // is called before `_finalize`, we ensure storage exists for property
    // metadata.
    this._ensureClassProperties();

    this._classProperties.set(name, options);

    if (!options.noAccessor) {
      const superDesc = descriptorFromPrototype(name, this.prototype);
      let desc; // If there is a super accessor, capture it and "super" to it

      if (superDesc !== undefined && superDesc.set && superDesc.get) {
        const {
          set,
          get
        } = superDesc;
        desc = {
          get() {
            return get.call(this);
          },

          set(value) {
            const oldValue = this[name];
            set.call(this, value);
            this.requestUpdate(name, oldValue);
          },

          configurable: true,
          enumerable: true
        };
      } else {
        const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
        desc = {
          get() {
            return this[key];
          },

          set(value) {
            const oldValue = this[name];
            this[key] = value;
            this.requestUpdate(name, oldValue);
          },

          configurable: true,
          enumerable: true
        };
      }

      Object.defineProperty(this.prototype, name, desc);
    }
  }
  /**
   * Creates property accessors for registered properties and ensures
   * any superclasses are also finalized.
   * @nocollapse
   */


  static _finalize() {
    if (this.hasOwnProperty(JSCompiler_renameProperty('finalized', this)) && this.finalized) {
      return;
    } // finalize any superclasses


    const superCtor = Object.getPrototypeOf(this);

    if (typeof superCtor._finalize === 'function') {
      superCtor._finalize();
    }

    this.finalized = true;

    this._ensureClassProperties(); // initialize Map populated in observedAttributes


    this._attributeToPropertyMap = new Map(); // make any properties
    // Note, only process "own" properties since this element will inherit
    // any properties defined on the superClass, and finalization ensures
    // the entire prototype chain is finalized.

    if (this.hasOwnProperty(JSCompiler_renameProperty('properties', this))) {
      const props = this.properties; // support symbols in properties (IE11 does not support this)

      const propKeys = [...Object.getOwnPropertyNames(props), ...(typeof Object.getOwnPropertySymbols === 'function' ? Object.getOwnPropertySymbols(props) : [])];

      for (const p of propKeys) {
        // note, use of `any` is due to TypeSript lack of support for symbol in
        // index types
        this.createProperty(p, props[p]);
      }
    }
  }
  /**
   * Returns the property name for the given attribute `name`.
   * @nocollapse
   */


  static _attributeNameForProperty(name, options) {
    const attribute = options.attribute;
    return attribute === false ? undefined : typeof attribute === 'string' ? attribute : typeof name === 'string' ? name.toLowerCase() : undefined;
  }
  /**
   * Returns true if a property should request an update.
   * Called when a property value is set and uses the `hasChanged`
   * option for the property if present or a strict identity check.
   * @nocollapse
   */


  static _valueHasChanged(value, old, hasChanged = notEqual) {
    return hasChanged(value, old);
  }
  /**
   * Returns the property value for the given attribute value.
   * Called via the `attributeChangedCallback` and uses the property's
   * `converter` or `converter.fromAttribute` property option.
   * @nocollapse
   */


  static _propertyValueFromAttribute(value, options) {
    const type = options.type;
    const converter = options.converter || defaultConverter;
    const fromAttribute = typeof converter === 'function' ? converter : converter.fromAttribute;
    return fromAttribute ? fromAttribute(value, type) : value;
  }
  /**
   * Returns the attribute value for the given property value. If this
   * returns undefined, the property will *not* be reflected to an attribute.
   * If this returns null, the attribute will be removed, otherwise the
   * attribute will be set to the value.
   * This uses the property's `reflect` and `type.toAttribute` property options.
   * @nocollapse
   */


  static _propertyValueToAttribute(value, options) {
    if (options.reflect === undefined) {
      return;
    }

    const type = options.type;
    const converter = options.converter;
    const toAttribute = converter && converter.toAttribute || defaultConverter.toAttribute;
    return toAttribute(value, type);
  }
  /**
   * Performs element initialization. By default captures any pre-set values for
   * registered properties.
   */


  initialize() {
    this._saveInstanceProperties();
  }
  /**
   * Fixes any properties set on the instance before upgrade time.
   * Otherwise these would shadow the accessor and break these properties.
   * The properties are stored in a Map which is played back after the
   * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
   * (<=41), properties created for native platform properties like (`id` or
   * `name`) may not have default values set in the element constructor. On
   * these browsers native properties appear on instances and therefore their
   * default value will overwrite any element default (e.g. if the element sets
   * this.id = 'id' in the constructor, the 'id' will become '' since this is
   * the native platform default).
   */


  _saveInstanceProperties() {
    for (const [p] of this.constructor._classProperties) {
      if (this.hasOwnProperty(p)) {
        const value = this[p];
        delete this[p];

        if (!this._instanceProperties) {
          this._instanceProperties = new Map();
        }

        this._instanceProperties.set(p, value);
      }
    }
  }
  /**
   * Applies previously saved instance properties.
   */


  _applyInstanceProperties() {
    for (const [p, v] of this._instanceProperties) {
      this[p] = v;
    }

    this._instanceProperties = undefined;
  }

  connectedCallback() {
    this._updateState = this._updateState | STATE_HAS_CONNECTED; // Ensure connection triggers an update. Updates cannot complete before
    // connection and if one is pending connection the `_hasConnectionResolver`
    // will exist. If so, resolve it to complete the update, otherwise
    // requestUpdate.

    if (this._hasConnectedResolver) {
      this._hasConnectedResolver();

      this._hasConnectedResolver = undefined;
    } else {
      this.requestUpdate();
    }
  }
  /**
   * Allows for `super.disconnectedCallback()` in extensions while
   * reserving the possibility of making non-breaking feature additions
   * when disconnecting at some point in the future.
   */


  disconnectedCallback() {}
  /**
   * Synchronizes property values when attributes change.
   */


  attributeChangedCallback(name, old, value) {
    if (old !== value) {
      this._attributeToProperty(name, value);
    }
  }

  _propertyToAttribute(name, value, options = defaultPropertyDeclaration) {
    const ctor = this.constructor;

    const attr = ctor._attributeNameForProperty(name, options);

    if (attr !== undefined) {
      const attrValue = ctor._propertyValueToAttribute(value, options); // an undefined value does not change the attribute.


      if (attrValue === undefined) {
        return;
      } // Track if the property is being reflected to avoid
      // setting the property again via `attributeChangedCallback`. Note:
      // 1. this takes advantage of the fact that the callback is synchronous.
      // 2. will behave incorrectly if multiple attributes are in the reaction
      // stack at time of calling. However, since we process attributes
      // in `update` this should not be possible (or an extreme corner case
      // that we'd like to discover).
      // mark state reflecting


      this._updateState = this._updateState | STATE_IS_REFLECTING_TO_ATTRIBUTE;

      if (attrValue == null) {
        this.removeAttribute(attr);
      } else {
        this.setAttribute(attr, attrValue);
      } // mark state not reflecting


      this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_ATTRIBUTE;
    }
  }

  _attributeToProperty(name, value) {
    // Use tracking info to avoid deserializing attribute value if it was
    // just set from a property setter.
    if (this._updateState & STATE_IS_REFLECTING_TO_ATTRIBUTE) {
      return;
    }

    const ctor = this.constructor;

    const propName = ctor._attributeToPropertyMap.get(name);

    if (propName !== undefined) {
      const options = ctor._classProperties.get(propName) || defaultPropertyDeclaration; // mark state reflecting

      this._updateState = this._updateState | STATE_IS_REFLECTING_TO_PROPERTY;
      this[propName] = ctor._propertyValueFromAttribute(value, options); // mark state not reflecting

      this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_PROPERTY;
    }
  }
  /**
   * Requests an update which is processed asynchronously. This should
   * be called when an element should update based on some state not triggered
   * by setting a property. In this case, pass no arguments. It should also be
   * called when manually implementing a property setter. In this case, pass the
   * property `name` and `oldValue` to ensure that any configured property
   * options are honored. Returns the `updateComplete` Promise which is resolved
   * when the update completes.
   *
   * @param name {PropertyKey} (optional) name of requesting property
   * @param oldValue {any} (optional) old value of requesting property
   * @returns {Promise} A Promise that is resolved when the update completes.
   */


  requestUpdate(name, oldValue) {
    let shouldRequestUpdate = true; // if we have a property key, perform property update steps.

    if (name !== undefined && !this._changedProperties.has(name)) {
      const ctor = this.constructor;
      const options = ctor._classProperties.get(name) || defaultPropertyDeclaration;

      if (ctor._valueHasChanged(this[name], oldValue, options.hasChanged)) {
        // track old value when changing.
        this._changedProperties.set(name, oldValue); // add to reflecting properties set


        if (options.reflect === true && !(this._updateState & STATE_IS_REFLECTING_TO_PROPERTY)) {
          if (this._reflectingProperties === undefined) {
            this._reflectingProperties = new Map();
          }

          this._reflectingProperties.set(name, options);
        } // abort the request if the property should not be considered changed.

      } else {
        shouldRequestUpdate = false;
      }
    }

    if (!this._hasRequestedUpdate && shouldRequestUpdate) {
      this._enqueueUpdate();
    }

    return this.updateComplete;
  }
  /**
   * Sets up the element to asynchronously update.
   */


  async _enqueueUpdate() {
    // Mark state updating...
    this._updateState = this._updateState | STATE_UPDATE_REQUESTED;
    let resolve;
    const previousUpdatePromise = this._updatePromise;
    this._updatePromise = new Promise(res => resolve = res); // Ensure any previous update has resolved before updating.
    // This `await` also ensures that property changes are batched.

    await previousUpdatePromise; // Make sure the element has connected before updating.

    if (!this._hasConnected) {
      await new Promise(res => this._hasConnectedResolver = res);
    } // Allow `performUpdate` to be asynchronous to enable scheduling of updates.


    const result = this.performUpdate(); // Note, this is to avoid delaying an additional microtask unless we need
    // to.

    if (result != null && typeof result.then === 'function') {
      await result;
    }

    resolve(!this._hasRequestedUpdate);
  }

  get _hasConnected() {
    return this._updateState & STATE_HAS_CONNECTED;
  }

  get _hasRequestedUpdate() {
    return this._updateState & STATE_UPDATE_REQUESTED;
  }

  get hasUpdated() {
    return this._updateState & STATE_HAS_UPDATED;
  }
  /**
   * Performs an element update.
   *
   * You can override this method to change the timing of updates. For instance,
   * to schedule updates to occur just before the next frame:
   *
   * ```
   * protected async performUpdate(): Promise<unknown> {
   *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
   *   super.performUpdate();
   * }
   * ```
   */


  performUpdate() {
    // Mixin instance properties once, if they exist.
    if (this._instanceProperties) {
      this._applyInstanceProperties();
    }

    if (this.shouldUpdate(this._changedProperties)) {
      const changedProperties = this._changedProperties;
      this.update(changedProperties);

      this._markUpdated();

      if (!(this._updateState & STATE_HAS_UPDATED)) {
        this._updateState = this._updateState | STATE_HAS_UPDATED;
        this.firstUpdated(changedProperties);
      }

      this.updated(changedProperties);
    } else {
      this._markUpdated();
    }
  }

  _markUpdated() {
    this._changedProperties = new Map();
    this._updateState = this._updateState & ~STATE_UPDATE_REQUESTED;
  }
  /**
   * Returns a Promise that resolves when the element has completed updating.
   * The Promise value is a boolean that is `true` if the element completed the
   * update without triggering another update. The Promise result is `false` if
   * a property was set inside `updated()`. This getter can be implemented to
   * await additional state. For example, it is sometimes useful to await a
   * rendered element before fulfilling this Promise. To do this, first await
   * `super.updateComplete` then any subsequent state.
   *
   * @returns {Promise} The Promise returns a boolean that indicates if the
   * update resolved without triggering another update.
   */


  get updateComplete() {
    return this._updatePromise;
  }
  /**
   * Controls whether or not `update` should be called when the element requests
   * an update. By default, this method always returns `true`, but this can be
   * customized to control when to update.
   *
   * * @param _changedProperties Map of changed properties with old values
   */


  shouldUpdate(_changedProperties) {
    return true;
  }
  /**
   * Updates the element. This method reflects property values to attributes.
   * It can be overridden to render and keep updated element DOM.
   * Setting properties inside this method will *not* trigger
   * another update.
   *
   * * @param _changedProperties Map of changed properties with old values
   */


  update(_changedProperties) {
    if (this._reflectingProperties !== undefined && this._reflectingProperties.size > 0) {
      for (const [k, v] of this._reflectingProperties) {
        this._propertyToAttribute(k, this[k], v);
      }

      this._reflectingProperties = undefined;
    }
  }
  /**
   * Invoked whenever the element is updated. Implement to perform
   * post-updating tasks via DOM APIs, for example, focusing an element.
   *
   * Setting properties inside this method will trigger the element to update
   * again after this update cycle completes.
   *
   * * @param _changedProperties Map of changed properties with old values
   */


  updated(_changedProperties) {}
  /**
   * Invoked when the element is first updated. Implement to perform one time
   * work on the element after update.
   *
   * Setting properties inside this method will trigger the element to update
   * again after this update cycle completes.
   *
   * * @param _changedProperties Map of changed properties with old values
   */


  firstUpdated(_changedProperties) {}

}
/**
 * Marks class as having finished creating properties.
 */


exports.UpdatingElement = UpdatingElement;
UpdatingElement.finalized = true;
},{}],"../node_modules/@polymer/lit-element/lib/decorators.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eventOptions = exports.queryAll = exports.query = exports.property = exports.customElement = void 0;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const legacyCustomElement = (tagName, clazz) => {
  window.customElements.define(tagName, clazz); // Cast as any because TS doesn't recognize the return type as being a
  // subtype of the decorated class when clazz is typed as
  // `Constructor<HTMLElement>` for some reason.
  // `Constructor<HTMLElement>` is helpful to make sure the decorator is
  // applied to elements however.

  return clazz;
};

const standardCustomElement = (tagName, descriptor) => {
  const {
    kind,
    elements
  } = descriptor;
  return {
    kind,
    elements,

    // This callback is called once the class is otherwise fully defined
    finisher(clazz) {
      window.customElements.define(tagName, clazz);
    }

  };
};
/**
 * Class decorator factory that defines the decorated class as a custom element.
 *
 * @param tagName the name of the custom element to define
 *
 * In TypeScript, the `tagName` passed to `customElement` should be a key of the
 * `HTMLElementTagNameMap` interface. To add your element to the interface,
 * declare the interface in this module:
 *
 *     @customElement('my-element')
 *     export class MyElement extends LitElement {}
 *
 *     declare global {
 *       interface HTMLElementTagNameMap {
 *         'my-element': MyElement;
 *       }
 *     }
 *
 */


const customElement = tagName => classOrDescriptor => typeof classOrDescriptor === 'function' ? legacyCustomElement(tagName, classOrDescriptor) : standardCustomElement(tagName, classOrDescriptor);

exports.customElement = customElement;

const standardProperty = (options, element) => {
  // createProperty() takes care of defining the property, but we still must
  // return some kind of descriptor, so return a descriptor for an unused
  // prototype field. The finisher calls createProperty().
  return {
    kind: 'field',
    key: Symbol(),
    placement: 'own',
    descriptor: {},

    // When @babel/plugin-proposal-decorators implements initializers,
    // do this instead of the initializer below. See:
    // https://github.com/babel/babel/issues/9260 extras: [
    //   {
    //     kind: 'initializer',
    //     placement: 'own',
    //     initializer: descriptor.initializer,
    //   }
    // ],
    initializer() {
      if (typeof element.initializer === 'function') {
        this[element.key] = element.initializer.call(this);
      }
    },

    finisher(clazz) {
      clazz.createProperty(element.key, options);
    }

  };
};

const legacyProperty = (options, proto, name) => {
  proto.constructor.createProperty(name, options);
};
/**
 * A property decorator which creates a LitElement property which reflects a
 * corresponding attribute value. A `PropertyDeclaration` may optionally be
 * supplied to configure property features.
 */


const property = options => (protoOrDescriptor, name) => name !== undefined ? legacyProperty(options, protoOrDescriptor, name) : standardProperty(options, protoOrDescriptor);
/**
 * A property decorator that converts a class property into a getter that
 * executes a querySelector on the element's renderRoot.
 */


exports.property = property;

const query = _query((target, selector) => target.querySelector(selector));
/**
 * A property decorator that converts a class property into a getter
 * that executes a querySelectorAll on the element's renderRoot.
 */


exports.query = query;

const queryAll = _query((target, selector) => target.querySelectorAll(selector));

exports.queryAll = queryAll;

const legacyQuery = (descriptor, proto, name) => {
  Object.defineProperty(proto, name, descriptor);
};

const standardQuery = (descriptor, element) => ({
  kind: 'method',
  placement: 'prototype',
  key: element.key,
  descriptor
});
/**
 * Base-implementation of `@query` and `@queryAll` decorators.
 *
 * @param queryFn exectute a `selector` (ie, querySelector or querySelectorAll)
 * against `target`.
 */


function _query(queryFn) {
  return selector => (protoOrDescriptor, name) => {
    const descriptor = {
      get() {
        return queryFn(this.renderRoot, selector);
      },

      enumerable: true,
      configurable: true
    };
    return name !== undefined ? legacyQuery(descriptor, protoOrDescriptor, name) : standardQuery(descriptor, protoOrDescriptor);
  };
}

const standardEventOptions = (options, element) => {
  return Object.assign({}, element, {
    finisher(clazz) {
      Object.assign(clazz.prototype[element.key], options);
    }

  });
};

const legacyEventOptions = (options, proto, name) => {
  Object.assign(proto[name], options);
};
/**
 * Adds event listener options to a method used as an event listener in a
 * lit-html template.
 *
 * @param options An object that specifis event listener options as accepted by
 * `EventTarget#addEventListener` and `EventTarget#removeEventListener`.
 *
 * Current browsers support the `capture`, `passive`, and `once` options. See:
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters
 *
 * @example
 *
 *     class MyElement {
 *
 *       clicked = false;
 *
 *       render() {
 *         return html`<div @click=${this._onClick}`><button></button></div>`;
 *       }
 *
 *       @eventOptions({capture: true})
 *       _onClick(e) {
 *         this.clicked = true;
 *       }
 *     }
 */


const eventOptions = options => // Return value typed as any to prevent TypeScript from complaining that
// standard decorator function signature does not match TypeScript decorator
// signature
// TODO(kschaaf): unclear why it was only failing on this decorator and not
// the others
(protoOrDescriptor, name) => name !== undefined ? legacyEventOptions(options, protoOrDescriptor, name) : standardEventOptions(options, protoOrDescriptor);

exports.eventOptions = eventOptions;
},{}],"../node_modules/@polymer/lit-element/lib/css-tag.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.css = exports.CSSResult = exports.supportsAdoptingStyleSheets = void 0;

/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
const supportsAdoptingStyleSheets = ('adoptedStyleSheets' in Document.prototype);
exports.supportsAdoptingStyleSheets = supportsAdoptingStyleSheets;

class CSSResult {
  constructor(cssText) {
    this.cssText = cssText;
  } // Note, this is a getter so that it's lazy. In practice, this means
  // stylesheets are not created until the first element instance is made.


  get styleSheet() {
    if (this._styleSheet === undefined) {
      // Note, if `adoptedStyleSheets` is supported then we assume CSSStyleSheet
      // is constructable.
      if (supportsAdoptingStyleSheets) {
        this._styleSheet = new CSSStyleSheet();

        this._styleSheet.replaceSync(this.cssText);
      } else {
        this._styleSheet = null;
      }
    }

    return this._styleSheet;
  }

}

exports.CSSResult = CSSResult;

const textFromCSSResult = value => {
  if (value instanceof CSSResult) {
    return value.cssText;
  } else {
    throw new Error(`Value passed to 'css' function must be a 'css' function result: ${value}.`);
  }
};

const css = (strings, ...values) => {
  const cssText = values.reduce((acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1], strings[0]);
  return new CSSResult(cssText);
};

exports.css = css;
},{}],"../node_modules/@polymer/lit-element/lit-element.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  LitElement: true,
  html: true,
  svg: true,
  TemplateResult: true,
  SVGTemplateResult: true
};
Object.defineProperty(exports, "html", {
  enumerable: true,
  get: function () {
    return _litHtml2.html;
  }
});
Object.defineProperty(exports, "svg", {
  enumerable: true,
  get: function () {
    return _litHtml2.svg;
  }
});
Object.defineProperty(exports, "TemplateResult", {
  enumerable: true,
  get: function () {
    return _litHtml2.TemplateResult;
  }
});
Object.defineProperty(exports, "SVGTemplateResult", {
  enumerable: true,
  get: function () {
    return _litHtml2.SVGTemplateResult;
  }
});
exports.LitElement = void 0;

var _litHtml = require("lit-html");

var _shadyRender = require("lit-html/lib/shady-render");

var _updatingElement = require("./lib/updating-element.js");

Object.keys(_updatingElement).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _updatingElement[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _updatingElement[key];
    }
  });
});

var _decorators = require("./lib/decorators.js");

Object.keys(_decorators).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _decorators[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _decorators[key];
    }
  });
});

var _litHtml2 = require("lit-html/lit-html");

var _cssTag = require("./lib/css-tag.js");

Object.keys(_cssTag).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _cssTag[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _cssTag[key];
    }
  });
});

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
class LitElement extends _updatingElement.UpdatingElement {
  /**
   * Array of styles to apply to the element. The styles should be defined
   * using the `css` tag function.
   */
  static get styles() {
    return [];
  }

  static get _uniqueStyles() {
    if (this._styles === undefined) {
      const styles = this.styles; // As a performance optimization to avoid duplicated styling that can
      // occur especially when composing via subclassing, de-duplicate styles
      // preserving the last item in the list. The last item is kept to
      // try to preserve cascade order with the assumption that it's most
      // important that last added styles override previous styles.

      const styleSet = styles.reduceRight((set, s) => {
        set.add(s); // on IE set.add does not return the set.

        return set;
      }, new Set()); // Array.form does not work on Set in IE

      this._styles = [];
      styleSet.forEach(v => this._styles.unshift(v));
    }

    return this._styles;
  }
  /**
   * Performs element initialization. By default this calls `createRenderRoot`
   * to create the element `renderRoot` node and captures any pre-set values for
   * registered properties.
   */


  initialize() {
    super.initialize();
    this.renderRoot = this.createRenderRoot(); // Note, if renderRoot is not a shadowRoot, styles would/could apply to the
    // element's getRootNode(). While this could be done, we're choosing not to
    // support this now since it would require different logic around de-duping.

    if (window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot) {
      this.adoptStyles();
    }
  }
  /**
   * Returns the node into which the element should render and by default
   * creates and returns an open shadowRoot. Implement to customize where the
   * element's DOM is rendered. For example, to render into the element's
   * childNodes, return `this`.
   * @returns {Element|DocumentFragment} Returns a node into which to render.
   */


  createRenderRoot() {
    return this.attachShadow({
      mode: 'open'
    });
  }
  /**
   * Applies styling to the element shadowRoot using the `static get styles`
   * property. Styling will apply using `shadowRoot.adoptedStyleSheets` where
   * available and will fallback otherwise. When Shadow DOM is polyfilled,
   * ShadyCSS scopes styles and adds them to the document. When Shadow DOM
   * is available but `adoptedStyleSheets` is not, styles are appended to the
   * end of the `shadowRoot` to [mimic spec
   * behavior](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets).
   */


  adoptStyles() {
    const styles = this.constructor._uniqueStyles;

    if (styles.length === 0) {
      return;
    } // There are three separate cases here based on Shadow DOM support.
    // (1) shadowRoot polyfilled: use ShadyCSS
    // (2) shadowRoot.adoptedStyleSheets available: use it.
    // (3) shadowRoot.adoptedStyleSheets polyfilled: append styles after
    // rendering


    if (window.ShadyCSS !== undefined && !window.ShadyCSS.nativeShadow) {
      window.ShadyCSS.ScopingShim.prepareAdoptedCssText(styles.map(s => s.cssText), this.localName);
    } else if (_cssTag.supportsAdoptingStyleSheets) {
      this.renderRoot.adoptedStyleSheets = styles.map(s => s.styleSheet);
    } else {
      // This must be done after rendering so the actual style insertion is done
      // in `update`.
      this._needsShimAdoptedStyleSheets = true;
    }
  }

  connectedCallback() {
    super.connectedCallback(); // Note, first update/render handles styleElement so we only call this if
    // connected after first update.

    if (this.hasUpdated && window.ShadyCSS !== undefined) {
      window.ShadyCSS.styleElement(this);
    }
  }
  /**
   * Updates the element. This method reflects property values to attributes
   * and calls `render` to render DOM via lit-html. Setting properties inside
   * this method will *not* trigger another update.
   * * @param _changedProperties Map of changed properties with old values
   */


  update(changedProperties) {
    super.update(changedProperties);
    const templateResult = this.render();

    if (templateResult instanceof _litHtml.TemplateResult) {
      this.constructor.render(templateResult, this.renderRoot, {
        scopeName: this.localName,
        eventContext: this
      });
    } // When native Shadow DOM is used but adoptedStyles are not supported,
    // insert styling after rendering to ensure adoptedStyles have highest
    // priority.


    if (this._needsShimAdoptedStyleSheets) {
      this._needsShimAdoptedStyleSheets = false;

      this.constructor._uniqueStyles.forEach(s => {
        const style = document.createElement('style');
        style.textContent = s.cssText;
        this.renderRoot.appendChild(style);
      });
    }
  }
  /**
   * Invoked on each update to perform rendering tasks. This method must return
   * a lit-html TemplateResult. Setting properties inside this method will *not*
   * trigger the element to update.
   */


  render() {}

}
/**
 * Ensure this class is marked as `finalized` as an optimization ensuring
 * it will not needlessly try to `finalize`.
 */


exports.LitElement = LitElement;
LitElement.finalized = true;
/**
 * Render method used to render the lit-html TemplateResult to the element's
 * DOM.
 * @param {TemplateResult} Template to render.
 * @param {Element|DocumentFragment} Node into which to render.
 * @param {String} Element name.
 * @nocollapse
 */

LitElement.render = _shadyRender.render;
},{"lit-html":"../node_modules/lit-html/lit-html.js","lit-html/lib/shady-render":"../node_modules/lit-html/lib/shady-render.js","./lib/updating-element.js":"../node_modules/@polymer/lit-element/lib/updating-element.js","./lib/decorators.js":"../node_modules/@polymer/lit-element/lib/decorators.js","lit-html/lit-html":"../node_modules/lit-html/lit-html.js","./lib/css-tag.js":"../node_modules/@polymer/lit-element/lib/css-tag.js"}],"components/va-app-header.js":[function(require,module,exports) {
"use strict";

var _litElement = require("@polymer/lit-element");

var _Router = require("./../Router");

var _Auth = _interopRequireDefault(require("./../Auth"));

var _App = _interopRequireDefault(require("./../App"));

var _FetchAPI = _interopRequireDefault(require("../FetchAPI"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject7() {
  const data = _taggedTemplateLiteral(["\n                  <sl-menu-divider></sl-menu-divider>\n                    <sl-menu-item @click=\"", "\">\n                      <sl-icon class=\"dropdown-icon\" slot=\"prefix\" name=\"house-door\"></sl-icon>\n                      <sl-icon class=\"settings-icon\" slot=\"prefix\" name=\"plus\"></sl-icon>\n                        Register Place\n                    </sl-menu-item>\n                  <sl-menu-item @click=\"", "\">\n                    <sl-icon class=\"dropdown-icon\" slot=\"prefix\" name=\"house-door\"></sl-icon>\n                    <sl-icon class=\"manage-place\" slot=\"prefix\" name=\"gear-fill\"></sl-icon>\n                      Manage Place\n                  </sl-menu-item>\n                  <sl-menu-divider></sl-menu-divider>\n                  <sl-menu-item @click=\"", "\">\n                    <sl-icon class=\"dropdown-icon\" slot=\"prefix\" name=\"broadcast\"></sl-icon>\n                    <sl-icon class=\"manage-device\" slot=\"prefix\" name=\"plus\"></sl-icon>\n                      Register Device\n                  </sl-menu-item>\n                  <sl-menu-item @click=\"", "\">\n                    <sl-icon class=\"dropdown-icon\" slot=\"prefix\" name=\"broadcast\"></sl-icon>\n                    <sl-icon class=\"add-device\" slot=\"prefix\" name=\"gear-fill\"></sl-icon>\n                      Manage Device\n                  </sl-menu-item>\n                  <sl-menu-divider></sl-menu-divider>\n                  "]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  const data = _taggedTemplateLiteral(["\n                  <sl-menu-item class=\"register-user\" id=\"register-user-side\">\n                    <sl-icon class=\"dropdown-icon\" slot=\"prefix\" name=\"person\"></sl-icon>\n                    <sl-icon class=\"settings-icon\" slot=\"prefix\" name=\"plus\"></sl-icon>\n                      Register User\n                  "]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  const data = _taggedTemplateLiteral(["<sl-details class=\"details users-list\" summary=\"Users\"><span slot=\"summary\" class=\"material-icons\" style=\"font-size: 40px;\">account_circle</span><span style=\"margin-left: 10px; font-weight:900;\" slot=\"summary\">Users</span></sl-details>"]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  const data = _taggedTemplateLiteral(["\n              <sl-menu-divider></sl-menu-divider>\n                <sl-menu-item @click=\"", "\">\n                  <sl-icon class=\"dropdown-icon\" slot=\"prefix\" name=\"house-door\"></sl-icon>\n                  <sl-icon class=\"settings-icon\" slot=\"prefix\" name=\"plus\"></sl-icon>\n                    Register Place\n                </sl-menu-item>\n              <sl-menu-item @click=\"", "\">\n                <sl-icon class=\"dropdown-icon\" slot=\"prefix\" name=\"house-door\"></sl-icon>\n                <sl-icon class=\"manage-place\" slot=\"prefix\" name=\"gear-fill\"></sl-icon>\n                  Manage Place\n              </sl-menu-item>\n              <sl-menu-divider></sl-menu-divider>\n              <sl-menu-item @click=\"", "\">\n                <sl-icon class=\"dropdown-icon\" slot=\"prefix\" name=\"broadcast\"></sl-icon>\n                <sl-icon class=\"manage-device\" slot=\"prefix\" name=\"plus\"></sl-icon>\n                  Register Device\n              </sl-menu-item>\n              <sl-menu-item @click=\"", "\">\n                <sl-icon class=\"dropdown-icon\" slot=\"prefix\" name=\"broadcast\"></sl-icon>\n                <sl-icon class=\"add-device\" slot=\"prefix\" name=\"gear-fill\"></sl-icon>\n                  Manage Device\n              </sl-menu-item>\n              <sl-menu-divider></sl-menu-divider>\n              "]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  const data = _taggedTemplateLiteral(["\n              <sl-menu-item class=\"register-user\" id=\"register-user\">\n                <sl-icon class=\"dropdown-icon\" slot=\"prefix\" name=\"person\"></sl-icon>\n                <sl-icon class=\"settings-icon\" slot=\"prefix\" name=\"plus\"></sl-icon>\n                  Register User\n              "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  const data = _taggedTemplateLiteral(["\n            <div class=\"input-group\">\n            <p class=\"toggle-text\">User type (regular/admin)</p>\n              <sl-switch class=\"toggle-switch\" id=\"access-level-toggle\"></sl-switch>      \n            </div>\n            <div class=\"input-group\">\n            <p class=\"toggle-text\">User status (inactive/active)</p>\n              <sl-switch class=\"toggle-switch\"  id=\"user-status-toggle\" checked></sl-switch>\n            "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  const data = _taggedTemplateLiteral(["\n    <style>      \n      * {\n        box-sizing: border-box;\n      }\n      .app-header {\n        background: rgb(94,85,107);\n        position: fixed;\n        top: 0;\n        right: 0;\n        left: 0;\n        height: var(--app-header-height);\n        color: #fff;\n        display: flex;\n        justify-content: flex-end;\n        z-index: 9;\n        box-shadow: 4px 0px 10px rgba(0,0,0,0.2);\n        align-items: center;\n      }\n\n      .app-header-main {\n        flex-grow: 1;\n        display: flex;\n        align-items: center;\n      }\n\n      .app-header-main::slotted(h1){\n        color: #fff;\n      }\n\n      .app-logo a {\n        color: #fff;\n        text-decoration: none;\n        font-weight: bold;\n        font-size: 1.2em;\n        padding: .6em;\n        display: inline-block;        \n      }\n\n      .app-logo img {\n        width: 90px;\n      }\n      \n      .hamburger-btn::part(base) {\n        color: #fff;\n        font-size: 2.5em;\n      }\n\n      .app-top-nav {\n        display: flex;\n        height: 100%;\n        align-items: center;\n      }\n\n      .app-top-nav a {\n        display: inline-block;\n        padding: .8em;\n        text-decoration: none;\n        color: #fff;\n      }\n\n      sl-drawer::part(panel){\n        background-color: rgb(94,85,107);\n        --size: 20em;\n      }\n\n      sl-drawer::part(body){\n        padding: 0;\n        scrollbar-width: none; /* Firefox */\n        -ms-overflow-style: none;  /* IE 10+ */\n        &::-webkit-scrollbar {\n        width: 0px;\n        background: transparent; /* Chrome/Safari/Webkit */\n        }\n      }\n      \n      sl-drawer::part(overlay){\n        background: transparent;\n      }\n\n      sl-drawer::part(close-button){\n        color: white;\n      }\n\n      .sidenav-content{\n        display: flex; \n        flex-direction: column; \n        align-items: center; \n        height: 100%; \n        justify-content: space-between;\n      }\n\n      .accordion-container{\n        width: 100%;\n      }\n\n      .dashboard-button::part(content){\n        display: none;\n      }\n\n      .bottom-menus{\n        width: 100%;\n        padding: 5%;\n      }\n\n      .app-side-menu-items a {\n        display: block;\n        padding: .5em;\n        text-decoration: none;\n        font-size: 1.3em;\n        color: var(--app-header-txt-color);\n      }\n\n      .page-title {\n        color: var(--app-header-txt-color);\n        margin-right: 0.5em;\n        font-size: var(--app-header-title-font-size);\n      }\n\n      /* active nav links */\n      .app-top-nav a.active,\n      .app-side-menu-items a.active {\n        font-weight: bold;\n      }\n\n      #bell-icon, #bell-icon-sidenav, #alert-icon, #alert-icon-sidenav, .bi-bell{\n        color: gray;\n      }\n\n      sl-dropdown::part(panel){\n        background-color: rgb(94,85,107);\n        border: none;\n        max-height: 100vh;\n        border-radius:  0 0 5px 5px;\n      }\n\n      sl-menu.left-menu::part(base){\n        border: 1px solid #fff;\n        border-radius: 5px;\n      }\n\n      sl-menu-item::part(base){\n        color: #fff;\n      }\n\n      sl-menu-item::part(base):hover{\n        color: rgb(94,85,107);\n      } \n\n      sl-avatar::part(base){\n        --size: 2rem;\n        color: white;\n      }\n\n      sl-details::part(header){\n        padding: var(--sl-spacing-x-small);\n      }\n      \n      sl-details::part(content){\n        padding: 0;\n        \n        border-top: 1px solid white;\n      }\n\n      sl-details::part(summary):hover{\n        color: var(--base-color);\n      }\n\n      sl-details::part(base){\n        color: white;\n        background: var(--base-color);\n      }\n\n      sl-details::part(base):hover{\n        color: var(--base-color);\n        background: white;\n      }\n\n      .dropdown-icon{\n        font-size: 2rem;\n\n      }.settings-icon{\n        font-size: 1.5rem; \n        position:relative; \n        top:-25%; \n        left: -15%; \n        margin-right:0;\n      }\n\n      .add-icon{\n        font-size: 1rem; \n        position:relative; \n        top:-25%; \n        left: -5%;\n      }\n\n      .manage-place{\n        font-size: 1rem; \n        position:relative; \n        top:-25%; \n        left: -5%;\n      }\n\n      .manage-device{\n        font-size: 1.5rem; \n        position:relative; \n        top:-25%; \n        left: -5%; \n        margin-right:0;\n      }\n\n      .add-device{\n        font-size: 1rem; \n        position:relative; \n        top:-25%; \n        left: 0;\n      }\n\n      .signout-icon{\n        font-size: 2rem;\n        left: 10%;\n        margin-right:1.5rem;\n      }\n\n      .app-side-nav{\n        display:none;\n      }\n\n      .summary-icon::part(summary){\n        font-size: 2rem;\n      }\n\n      /* RESPONSIVE - MOBILE ------------------- */\n      @media all and (max-width: 768px){       \n        \n        .app-top-nav {\n          display: none;\n        }\n\n        .app-side-nav{\n          display:flex;\n          align-items: center;\n          justify-content: space-evenly;\n        }\n      }\n\n      .dialog-heading{\n                display: flex; \n                align-items: center; \n                justify-content: center; \n                font-size: 1.5rem; \n                font-weight: 900;\n                color: white;\n            }\n\n            .flex-center{\n                display:flex;\n                align-items: center;\n                justify-content: center;\n            }\n\n            sl-dialog::part(panel){\n                background: var(--dialog-background);\n            }\n\n            .pad-bottom{\n                padding-bottom: 20px;\n            }\n\n            .toggle-dialogs{\n              cursor: pointer;\n              color: var(--brand-color);\n              text-decoration: underline;\n            }\n\n            .toggle-dialogs:hover{\n              color: white;\n            }\n\n            .toggle-text{\n              margin: 0;\n              color: white;\n            }\n\n            .toggle-switch{\n             --width: 60px; --height: 30px; --thumb-size: 28px;\n             color: white;\n             margin: 10px 0;\n            }\n\n    </style>  \n    <!-- Sign in dialog -->\n    <link href=\"https://fonts.googleapis.com/icon?family=Material+Icons\" rel=\"stylesheet\">\n    <sl-dialog no-header=\"true\" slot=\"label\" class=\"signin-dialog\" style=\"--width: 30vw;\">\n    <span class=\"dialog-heading\">Sign In</span>\n    <div class=\"page-content page-centered\">\n        <div class=\"signinup-box\">\n        <div class=\"flex-center\">\n            <div class=\"material-icons\" style=\"font-size: 8rem; margin: 1rem; color: white;\">account_circle</div>          \n        </div>\n        <sl-form class=\"form-signup dark-theme\" @sl-submit=", ">          \n            <div class=\"input-group\">\n            <sl-input class=\"pad-bottom\" name=\"email\" type=\"email\" placeholder=\"Email\" required></sl-input>\n            </div>\n            <div class=\"input-group\">\n            <sl-input class=\"pad-bottom\" name=\"password\" type=\"password\" placeholder=\"Password\" required toggle-password></sl-input>\n            </div>\n            <sl-button class=\"submit-btn\" type=\"primary\" submit style=\"width: 100%;\">Sign In</sl-button>\n        </sl-form>\n        <p>No Account? <span class=\"toggle-dialogs\">Sign Up</span></p>\n        </div>\n    </div>\n    </sl-dialog>\n    <!-- Sign up dialog -->\n    <sl-dialog no-header=\"true\" slot=\"label\" class=\"signup-dialog\" style=\"--width: 30vw;\">\n    <span class=\"dialog-heading\">Sign up</span>\n    <div class=\"page-content page-centered\">\n        <div class=\"signupup-box\">\n        <div class=\"flex-center\">\n            <div class=\"material-icons\" style=\"font-size: 8rem; margin: 1rem; color: white;\">account_circle</div>          \n        </div>\n        <sl-form class=\"form-signup\" @sl-submit=", ">\n            <div class=\"input-group\">\n              <sl-input class=\"pad-bottom\" name=\"firstName\" type=\"text\" placeholder=\"First Name\" required></sl-input>\n            </div>\n            <div class=\"input-group\">\n              <sl-input class=\"pad-bottom\" name=\"lastName\" type=\"text\" placeholder=\"Last Name\" required></sl-input>\n            </div>\n            <div class=\"input-group\">\n            <sl-input class=\"pad-bottom\" name=\"username\" type=\"text\" placeholder=\"Username\" required></sl-input>\n            </div>\n            <div class=\"input-group\">\n              <sl-input class=\"pad-bottom\" name=\"email\" type=\"email\" placeholder=\"Email\" required></sl-input>\n            </div>\n            <div class=\"input-group\">\n              <sl-input class=\"pad-bottom\" name=\"password\" type=\"password\" placeholder=\"Password\" required toggle-password></sl-input>\n            </div>      \n            ", "\n            <sl-button type=\"primary\" class=\"submit-btn\" submit style=\"width: 100%;\">Sign Up</sl-button>\n        </sl-form>\n        <p>Have an account? <span class=\"toggle-dialogs\">Sign In</span></p>\n        </div>\n    </div>\n    </sl-dialog>\n    <!-- Hamburger -->\n    <header class=\"app-header\" style=\"display:flex; justify-content: space-between; align-items:center;\">\n      <div class=\"left-navs\">\n        <sl-icon-button class=\"hamburger-btn\" name=\"list\" @click=\"", "\"></sl-icon-button>       \n      </div>\n      <!-- Main (top) menus -->\n      <div class=\"right-navs\">\n        <nav class=\"app-top-nav\">\n          <a slot=\"trigger\" href=\"#\" style=\"display: flex; align-items: center;\" @click=\"", "\">\n              <sl-icon id=\"bell-icon\" slot=\"icon\" name=\"bell\" style=\"font-size: 2rem;\"></sl-icon>\n            </a>\n          <a slot=\"trigger\" href=\"#\" style=\"display: flex; align-items: center;\" @click=\"", "\">\n              <sl-icon id=\"alert-icon\" slot=\"icon\" name=\"exclamation-circle\" style=\"font-size: 2rem;\"></sl-icon>\n            </a>\n          <sl-dropdown>\n            <a slot=\"trigger\" href=\"#\" style=\"display: flex; align-items: center;\" @click=\"", "\">\n              <sl-icon slot=\"icon\" name=\"gear-fill\" style=\"font-size: 1.9rem;\"></sl-icon>\n            </a>\n            <sl-menu>            \n              <sl-menu-item @click=\"", "\"><sl-icon class=\"dropdown-icon\" slot=\"prefix\" name=\"wifi\"></sl-icon>System Status</sl-menu-item>\n              <sl-menu-item @click=\"", "\"><sl-icon class=\"dropdown-icon\" slot=\"prefix\" name=\"list-ul\"></sl-icon>Logs</sl-menu-item>\n            </sl-menu>\n          </sl-dropdown>\n          <sl-dropdown distance=\"0\" class=\"dropdowns\">\n            <a slot=\"trigger\" href=\"#\" @click=\"", "\">\n              <sl-avatar image=", "></sl-avatar> ", "\n            </a>\n            <sl-menu>            \n            ", "\n              </sl-menu-item>\n              <sl-menu-item class=\"manage-account\" id=\"manage-account\" @click=\"", "\">\n                <sl-icon class=\"dropdown-icon\" slot=\"prefix\" name=\"person\"></sl-icon>\n                <sl-icon class=\"add-icon\" slot=\"prefix\" name=\"gear-fill\"></sl-icon>\n                  Manage Account\n              </sl-menu-item>\n              ", "\n              <sl-menu-item @click=\"", "\">\n                <sl-icon class=\"signout-icon\" slot=\"prefix\" name=\"box-arrow-right\"></sl-icon>\n                  Sign Out\n              </sl-menu-item>\n            </sl-menu>\n          </sl-dropdown>\n        </nav>\n      </div>\n    </header>\n    <sl-drawer class=\"app-side-menu\" placement=\"left\">\n      <div class=\"sidenav-content\">\n        <!-- accordion (details) container to list all entities categorically -->\n        <div class=\"accordion-container\">\n        <link href=\"https://fonts.googleapis.com/icon?family=Material+Icons\" rel=\"stylesheet\">\n          <div class=\"accordion-menu\">\n            <sl-details class=\"dashboard-button\" @click=\"", "\"><span slot=\"summary\" class=\"material-icons\" style=\"font-size: 40px;\">dashboard</span><span style=\"margin-left: 10px; font-weight:900;\" slot=\"summary\">Dashboard</span></sl-details>\n            <sl-details class=\"details places-list\" summary=\"Places\" ><span slot=\"summary\" class=\"material-icons\" style=\"font-size: 40px;\">home</span><span style=\"margin-left: 10px; font-weight:900;\" slot=\"summary\">Places</span></sl-details>\n            <sl-details class=\"details devices-list\" summary=\"Devices\"><span slot=\"summary\" class=\"material-icons\" style=\"font-size: 40px;\">sensors</span><span style=\"margin-left: 10px; font-weight:900;\" slot=\"summary\">Devices</span></sl-details>\n            ", "\n          </div>\n          <style>\n            .details-group-example sl-details:not(:last-of-type) {\n              margin-bottom: var(--sl-spacing-xx-small);\n            }\n          </style>\n        </div>\n        <!--  -->\n        <div class=\"bottom-menus\">\n          <nav class=\"app-side-nav\">\n            <!-- <a href=\"/\" @click=\"", "\">Home</a>         -->\n            <a slot=\"trigger\" href=\"#\" style=\"display: flex; align-items: center;\" @click=\"", "\">\n                <sl-icon id=\"bell-icon-sidenav\" slot=\"icon\" name=\"bell\" style=\"font-size: 2rem;\"></sl-icon>\n              </a>\n            <a slot=\"trigger\" href=\"#\" style=\"display: flex; align-items: center;\" @click=\"", "\">\n                <sl-icon id=\"alert-icon-sidenav\" slot=\"icon\" name=\"exclamation-circle\" style=\"font-size: 2rem;\"></sl-icon>\n              </a>\n            <sl-dropdown skidding=\"-109\" distance=\"10\">\n              <a slot=\"trigger\" href=\"#\" style=\"display: flex; align-items: center;\" @click=\"", "\">\n                <sl-icon slot=\"icon\" name=\"gear-fill\" style=\"font-size: 2rem; color: white;\"></sl-icon>\n              </a>\n              <sl-menu class=\"left-menu\">            \n                <sl-menu-item @click=\"", "\"><sl-icon class=\"dropdown-icon\" slot=\"prefix\" name=\"wifi\"></sl-icon>System Status</sl-menu-item>\n                <sl-menu-item @click=\"", "\"><sl-icon class=\"dropdown-icon\" slot=\"prefix\" name=\"list-ul\"></sl-icon>Logs</sl-menu-item>\n              </sl-menu>\n            </sl-dropdown>\n            <sl-dropdown skidding=\"-171\" distance=\"10\" class=\"dropdowns-left\">\n              <a slot=\"trigger\" href=\"#\" @click=\"", "\">\n                <sl-avatar image=", ">\n              </a>\n              <sl-menu class=\"left-menu\">            \n                ", "\n                  </sl-menu-item>\n                  <sl-menu-item class=\"manage-account\" id=\"manage-account-side\" @click=\"", "\">\n                    <sl-icon class=\"dropdown-icon\" slot=\"prefix\" name=\"person\"></sl-icon>\n                    <sl-icon class=\"add-icon\" slot=\"prefix\" name=\"gear-fill\"></sl-icon>\n                      Manage Account\n                  </sl-menu-item>\n                  ", "\n                  <sl-menu-item @click=\"", "\">\n                    <sl-icon class=\"signout-icon\" slot=\"prefix\" name=\"box-arrow-right\"></sl-icon>\n                      Sign Out\n                  </sl-menu-item>\n              </sl-menu>\n            </sl-dropdown>\n          </nav>\n        </div>\n      </div>\n    </sl-drawer>\n    "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

let places,
    items,
    users = [{}];
let collections = [{
  places,
  items,
  users
}];
customElements.define('va-app-header', class AppHeader extends _litElement.LitElement {
  constructor() {
    super();
  }

  static get properties() {
    return {
      title: {
        type: String
      },
      user: {
        type: Object
      }
    };
  }

  async firstUpdated() {
    super.firstUpdated();
    this.navActiveLinks();
    const container = this.shadowRoot.querySelector('.accordion-menu');
    const signinDialog = this.shadowRoot.querySelector('.signin-dialog');
    const signupDialog = this.shadowRoot.querySelector('.signup-dialog');
    const menuItems = this.shadowRoot.querySelectorAll('sl-menu-item'); // set click event listener for menu items

    menuItems.forEach(menuItem => {
      menuItem.addEventListener('click', e => {
        // console.log(`Target clicked was: ${e.target.id}`)
        if (e.target.id === 'register-user' || e.target.id === 'regsiter-user-side') {
          signupDialog.show();
        } // else if(e.target.id === 'manage-account' || e.target.id === 'manage-account-side'){
        // }

      });
    }); // if user is not signed in do not allow them to cancel the dialogs, otherwise
    // a signed in user is creating a new user and should be able to dismiss it

    if (typeof _Auth.default.currentUser.accessLevel === 'undefined') signinDialog.show();

    if (!localStorage.accessLevel >= 1) {
      signinDialog.addEventListener('sl-overlay-dismiss', event => event.preventDefault());
      signupDialog.addEventListener('sl-overlay-dismiss', event => event.preventDefault());
    } // Close all other details when one is shown


    container.addEventListener('sl-show', event => {
      [...container.querySelectorAll('sl-details')].map(details => details.open = event.target === details);
    }); // if user is signed in then load all the collections for rendering

    if (localStorage.accessLevel >= 1) {
      collections.places = await _FetchAPI.default.getPlacesAsync();
      collections.items = await _FetchAPI.default.getItemsAsync();
      collections.users = localStorage.accessLevel == 2 ? await _FetchAPI.default.getUsersAsync() : ""; // these HAVE to be streamlined...waaay to repetitive! Do if time permits, otherwise after unit completion!

      this.renderPlacesButtons();
      this.renderItemsButtons();
      localStorage.accessLevel == 2 ? this.renderUsersButtons() : "";
      const signinDialog = this.shadowRoot.querySelector('.signin-dialog');
      signinDialog.addEventListener('sl-overlay-dismiss', event => event.preventDefault());
    } // switch between sign in and sign up dialogs based on user selection and supplied target


    const toggleDialogs = this.shadowRoot.querySelectorAll('.toggle-dialogs');
    toggleDialogs.forEach(toggleDialog => {
      toggleDialog.addEventListener('click', e => {
        if (e.target.textContent === "Sign Up") {
          signinDialog.hide();
          signupDialog.show();
        } else {
          signupDialog.hide();
          signinDialog.show();
        }
      });
    });
  }

  async renderPlacesButtons() {
    let list = this.shadowRoot.querySelector('.places-list');
    collections.places.forEach(entity => {
      let itemElement = document.createElement('aa-accordion-button');
      itemElement.setAttribute('icon', entity.locationType.iconURL);
      itemElement.setAttribute('path', "icons");
      itemElement.append(entity.placeName);
      list.appendChild(itemElement);
      itemElement.addEventListener('click', () => {
        console.log(entity);
      });
    });
  }

  async renderItemsButtons() {
    let list = this.shadowRoot.querySelector('.devices-list');
    collections.items.forEach(entity => {
      let itemElement = document.createElement('aa-accordion-button');
      itemElement.setAttribute('icon', "".concat(entity.type.iconURL));
      itemElement.setAttribute('path', "icons");
      itemElement.append(entity.name);
      list.appendChild(itemElement);
      itemElement.addEventListener('click', () => {
        console.log(entity);
      });
    });
  }

  renderImage(itemElement, entity) {
    itemElement.setAttribute('icon', "".concat(_App.default.apiBase, "/images/").concat(entity.imageURL));
    itemElement.setAttribute('path', "Images");
  }

  renderIcon(itemElement) {
    itemElement.setAttribute('icon', "account_circle");
    itemElement.setAttribute('path', "icons");
  }

  async renderUsersButtons() {
    let list = this.shadowRoot.querySelector('.users-list');
    collections.users.forEach(entity => {
      let itemElement = document.createElement('aa-accordion-button');
      entity && entity.imageURL != "" ? this.renderImage(itemElement, entity) : this.renderIcon(itemElement);
      itemElement.append(entity.firstName, " ", entity.lastName);
      list.appendChild(itemElement);
      itemElement.addEventListener('click', () => {
        console.log(entity);
      });
    });
  }

  navActiveLinks() {
    const currentPath = window.location.pathname;
    const navLinks = this.shadowRoot.querySelectorAll('.app-top-nav a, .app-side-menu-items a');
    navLinks.forEach(navLink => {
      if (navLink.href.slice(-1) == '#') return;

      if (navLink.pathname === currentPath) {
        navLink.classList.add('active');
      }
    });
  }

  hamburgerClick() {
    const appMenu = this.shadowRoot.querySelector('.app-side-menu');
    appMenu.show();
  }

  menuClick(e) {
    e.preventDefault();
    const pathname = e.target.closest('a').pathname;
    const appSideMenu = this.shadowRoot.querySelector('.app-side-menu'); // hide appMenu

    appSideMenu.hide();
    appSideMenu.addEventListener('sl-after-hide', () => {
      // goto route after menu is hidden
      (0, _Router.gotoRoute)(pathname);
    });
  }

  signInSubmitHandler(e) {
    e.preventDefault(); // determine which dialog is sending the submit call to be able to carry out appropriate post method

    const signinDialog = this.shadowRoot.querySelector('.signin-dialog');
    const signupDialog = this.shadowRoot.querySelector('.signup-dialog');
    const formData = e.detail.formData;
    const submitBtn = this.shadowRoot.querySelector('.submit-btn');
    console.log(e.target);

    if (e.target.innerText === "Sign In") {
      submitBtn.setAttribute('loading', ''); // sign in using Auth    

      _Auth.default.signIn(formData, () => {
        submitBtn.removeAttribute('loading');
      });

      console.log(localStorage.accessLevel);

      if (localStorage.accessLevel >= 1) {
        signinDialog.hide();
        submitBtn.removeAttribute('loading');
      } // sign up user

    } else {
      // if its not an admin then append default user values
      if (localStorage.accessLevel != 2) {
        formData.append('accessLevel', 1);
        formData.append('status', true);
        formData.append('imageURL', "");
      } // if user creating account is admin then convert toggle buttons to input values and append them to the form data
      else {
          formData.append('status', this.shadowRoot.querySelector('#user-status-toggle').checked);
          formData.append('accessLevel', this.shadowRoot.querySelector('#access-level-toggle').checked ? 2 : 1);
          formData.append('imageURL', "");
        } // sign up using Auth


      _Auth.default.signUp(formData, () => {
        submitBtn.removeAttribute('loading');
      }, () => {
        signupDialog.hide();
        submitBtn.removeAttribute('loading'); // if the person who registered the new user is signed in then don't prompt them to log in

        if (!localStorage.accessLevel >= 1) signinDialog.show(); // If the user is admin then refresh their users list

        if (localStorage.accessLevel == 2) {
          window.location.reload();
        }
      });
    }
  }

  render() {
    return (0, _litElement.html)(_templateObject(), this.signInSubmitHandler, this.signInSubmitHandler, _Auth.default.currentUser.accessLevel == 2 ? (0, _litElement.html)(_templateObject2()) : "", this.hamburgerClick, e => e.preventDefault(), e => e.preventDefault(), e => e.preventDefault(), () => (0, _Router.gotoRoute)('/profile'), () => (0, _Router.gotoRoute)('/editProfile'), e => e.preventDefault(), this.user && this.user.imageURL ? "".concat(_App.default.apiBase, "/images/").concat(this.user.imageURL) : "", this.user && this.user.firstName, _Auth.default.currentUser.accessLevel == 2 ? (0, _litElement.html)(_templateObject3()) : "", () => (0, _Router.gotoRoute)('/users'), _Auth.default.currentUser.accessLevel == 2 ? (0, _litElement.html)(_templateObject4(), () => (0, _Router.gotoRoute)('/profile'), () => (0, _Router.gotoRoute)('/places'), () => (0, _Router.gotoRoute)('/profile'), () => (0, _Router.gotoRoute)('/devices')) : "", () => _Auth.default.signOut(), () => (0, _Router.gotoRoute)('/'), localStorage.accessLevel == 2 ? (0, _litElement.html)(_templateObject5()) : "", _Router.anchorRoute, e => e.preventDefault(), e => e.preventDefault(), e => e.preventDefault(), () => (0, _Router.gotoRoute)('/profile'), () => (0, _Router.gotoRoute)('/editProfile'), e => e.preventDefault(), this.user && this.user.avatar ? "".concat(_App.default.apiBase, "/images/").concat(this.user.avatar) : "", _Auth.default.currentUser.accessLevel == 2 ? (0, _litElement.html)(_templateObject6()) : "", () => (0, _Router.gotoRoute)('/users'), _Auth.default.currentUser.accessLevel == 2 ? (0, _litElement.html)(_templateObject7(), () => (0, _Router.gotoRoute)('/profile'), () => (0, _Router.gotoRoute)('/places'), () => (0, _Router.gotoRoute)('/profile'), () => (0, _Router.gotoRoute)('/devices')) : "", () => _Auth.default.signOut());
  }

});
},{"@polymer/lit-element":"../node_modules/@polymer/lit-element/lit-element.js","./../Router":"Router.js","./../Auth":"Auth.js","./../App":"App.js","../FetchAPI":"FetchAPI.js"}],"components/aa-accordion-button.js":[function(require,module,exports) {
"use strict";

var _litElement = require("@polymer/lit-element");

var _Router = require("../Router");

var _Auth = _interopRequireDefault(require("../Auth"));

var _App = _interopRequireDefault(require("../App"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject3() {
  const data = _taggedTemplateLiteral(["\n            <img class=\"icon\" style=\"width: auto; height: 40px;\" src=", "></span>\n            "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  const data = _taggedTemplateLiteral(["\n            <span class=\"material-icons icon\" style=\"font-size: 2rem;\">", "</span>\n            "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  const data = _taggedTemplateLiteral(["\n        <style>\n            h3{\n                margin: 1rem;\n            }\n\n            .container{\n                position: relative;\n                border-bottom: 1px solid;\n                color: white;\n                background: var(--brand-color);\n                width: 100%;\n                height: 100%;\n                display: flex;\n                justify-content: flex-start;\n                align-items: center;\n            }\n\n            .container:hover{\n                color: var(--brand-color);\n                background: white;\n                border: 0 1px 1px 1px solid white;\n                cursor: pointer;\n            }\n\n            .icon{\n                padding-left: 2rem;\n                display: flex;\n                justify-content: center;\n                align-items: center;\n            }\n\n            .icon slot{\n                width: 2rem;\n            }\n\n            .active-indicator{\n                height: 100%; \n                width: 10px; \n                position: absolute; \n                right: 0;\n            }\n\n            .active-indicator.active{\n                background: white;\n            }\n        </style>\n\n        <link href=\"https://fonts.googleapis.com/icon?family=Material+Icons\" rel=\"stylesheet\">\n            <div class=\"container\" part=\"container\">\n            ", "\n            <h3>", "</h3>\n            <div class=\"active-indicator\" part=\"active-indicator\"></div>\n        </div>\n        "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

// const template = document.createElement
class AccordionButton extends _litElement.LitElement {
  constructor() {
    super();
  } // element attributes


  static get properties() {
    return {
      textContent: {
        type: String
      },
      icon: {
        type: String
      },
      path: {
        type: String
      },
      active: {
        type: String
      }
    };
  }

  firstUpdated() {
    super.firstUpdated();
    let button = this.shadowRoot.querySelector('.container');
    button.addEventListener('click', () => {
      this.shadowRoot.querySelector('.active-indicator').classList.toggle('active');
    });
  }

  render() {
    return (0, _litElement.html)(_templateObject(), this.path === "icons" ? (0, _litElement.html)(_templateObject2(), this.icon) : (0, _litElement.html)(_templateObject3(), this.icon), this.textContent);
  }

}

customElements.define('aa-accordion-button', AccordionButton);
},{"@polymer/lit-element":"../node_modules/@polymer/lit-element/lit-element.js","../Router":"Router.js","../Auth":"Auth.js","../App":"App.js"}],"components/aa-panel-template.js":[function(require,module,exports) {
"use strict";

var _litElement = require("@polymer/lit-element");

var _Router = require("../Router");

var _Auth = _interopRequireDefault(require("../Auth"));

var _App = _interopRequireDefault(require("../App"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject3() {
  const data = _taggedTemplateLiteral(["<div class=\"material-icons settings-icon icon\"></div>"]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  const data = _taggedTemplateLiteral(["<div class=\"material-icons add-icon icon\">add</div>"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  const data = _taggedTemplateLiteral(["\n        <style>\n            .container{\n                position: relative;\n                color: white;\n                background: var(--panel-color);\n                width: 100%;\n                height: 100%;\n                border-radius: 10px;\n                box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.65);\n                padding: 0 1.5rem;\n                overflow-y: scroll;\n            }\n\n            .header{\n                display: flex;\n                justify-content: space-between;\n                align-items: center;\n                margin-bottom: 1rem;\n            }\n\n            .icon{\n                cursor: pointer;\n            }\n\n            .body-container{\n                height: 100%;\n                /* overflow-y: scroll; */\n                /* overflow: hidden; */\n            }\n\n            .body{\n                height: 100%;\n                /* overflow-y: scroll; */\n            }\n\n        </style>\n\n        <link href=\"https://fonts.googleapis.com/icon?family=Material+Icons\" rel=\"stylesheet\">\n        <div class=\"container\" part=\"container\">\n            <div class=\"header\">\n                ", "\n                <slot name=\"header-title\" part=\"title\"><h2>", "</h2></slot>\n                ", "\n            </div>\n            <div class=\"body-container\">\n                <slot class=\"table-heading\" name=\"table-heading\" part=\"table-heading\"></slot>\n                <slot class=\"body\" name=\"body\" part=\"body\"></slot>\n            </div>\n        </div>\n        "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

// const template = document.createElement
class PanelTemplate extends _litElement.LitElement {
  constructor() {
    super();
  } // element attributes


  static get properties() {
    return {
      title: {
        type: String
      },
      icon: {
        type: String
      },
      path: {
        type: String
      },
      active: {
        type: String
      }
    };
  }

  firstUpdated() {
    super.firstUpdated();
  }

  render() {
    return (0, _litElement.html)(_templateObject(), localStorage.accessLevel == 2 ? (0, _litElement.html)(_templateObject2()) : "", this.title, localStorage.accessLevel == 2 ? (0, _litElement.html)(_templateObject3()) : "");
  }

}

customElements.define('aa-panel-template', PanelTemplate);
},{"@polymer/lit-element":"../node_modules/@polymer/lit-element/lit-element.js","../Router":"Router.js","../Auth":"Auth.js","../App":"App.js"}],"../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"scss/master.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _App = _interopRequireDefault(require("./App.js"));

require("./components/va-app-header");

require("./components/aa-accordion-button");

require("./components/aa-panel-template");

require("./scss/master.scss");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// components (custom web components)
// styles
// app.init
document.addEventListener('DOMContentLoaded', () => {
  _App.default.init();
});
},{"./App.js":"App.js","./components/va-app-header":"components/va-app-header.js","./components/aa-accordion-button":"components/aa-accordion-button.js","./components/aa-panel-template":"components/aa-panel-template.js","./scss/master.scss":"scss/master.scss"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56125" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map