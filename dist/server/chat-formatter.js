"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var chat_formatter_exports = {};
__export(chat_formatter_exports, {
  formatText: () => formatText,
  linkRegex: () => linkRegex,
  stripFormatting: () => stripFormatting
});
module.exports = __toCommonJS(chat_formatter_exports);
/**
 * Chat parser
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Parses formate.
 *
 * @license MIT
 */
const linkRegex = /(?:(?:https?:\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)*|www\.[a-z0-9-]+(?:\.[a-z0-9-]+)+|\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:(?:com?|org|net|edu|info|us|jp)\b|[a-z]{2,3}(?=:[0-9]|\/)))(?::[0-9]+)?(?:\/(?:(?:[^\s()&<>[\]]|&amp;|&quot;|\((?:[^\s()<>&[\]]|&amp;)*\)|\[(?:[^\s()<>&[\]]|&amp;)*])*(?:[^\s()[\]{}".,!?;:&<>*`^~\\]|\((?:[^\s()<>&[\]]|&amp;)*\)))?)?|[a-z0-9.]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,})(?![^ ]*&gt;)/ig;
class TextFormatter {
  constructor(str, isTrusted = false, replaceLinebreaks = false, showSyntax = false) {
    str = `${str}`.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
    str = str.replace(linkRegex, (uri) => {
      if (showSyntax) return `<u>${uri}</u>`;
      let fulluri;
      if (/^[a-z0-9.]+@/ig.test(uri)) {
        fulluri = "mailto:" + uri;
      } else {
        fulluri = uri.replace(/^([a-z]*[^a-z:])/g, "http://$1");
        if (uri.substr(0, 24) === "https://docs.google.com/" || uri.substr(0, 16) === "docs.google.com/") {
          if (uri.startsWith("https")) uri = uri.slice(8);
          if (uri.substr(-12) === "?usp=sharing" || uri.substr(-12) === "&usp=sharing") uri = uri.slice(0, -12);
          if (uri.substr(-6) === "#gid=0") uri = uri.slice(0, -6);
          let slashIndex = uri.lastIndexOf("/");
          if (uri.length - slashIndex > 18) slashIndex = uri.length;
          if (slashIndex - 4 > 19 + 3) {
            uri = `${uri.slice(0, 19)}<small class="message-overflow">${uri.slice(19, slashIndex - 4)}</small>${uri.slice(slashIndex - 4)}`;
          }
        }
      }
      return `<a href="${fulluri}" rel="noopener" target="_blank">${uri}</a>`;
    });
    this.str = str;
    this.buffers = [];
    this.stack = [];
    this.isTrusted = isTrusted;
    this.replaceLinebreaks = this.isTrusted || replaceLinebreaks;
    this.showSyntax = showSyntax;
    this.offset = 0;
  }
  // debugAt(i=0, j=i+1) { console.log(`${this.slice(0, i)}[${this.slice(i, j)}]${this.slice(j, this.str.length)}`); }
  slice(start, end) {
    return this.str.slice(start, end);
  }
  at(start) {
    return this.str.charAt(start);
  }
  /**
   * We've encountered a possible start for a span. It's pushed onto our span
   * stack.
   *
   * The span stack saves the start position so it can be replaced with HTML
   * if we find an end for the span, but we don't actually replace it until
   * `closeSpan` is called, so nothing happens (it stays plaintext) if no end
   * is found.
   */
  pushSpan(spanType, start, end) {
    this.pushSlice(start);
    this.stack.push([spanType, this.buffers.length]);
    this.buffers.push(this.slice(start, end));
    this.offset = end;
  }
  pushSlice(end) {
    if (end !== this.offset) {
      this.buffers.push(this.slice(this.offset, end));
      this.offset = end;
    }
  }
  closeParenSpan(start) {
    let stackPosition = -1;
    for (let i = this.stack.length - 1; i >= 0; i--) {
      const span = this.stack[i];
      if (span[0] === "(") {
        stackPosition = i;
        break;
      }
      if (span[0] !== "spoiler") break;
    }
    if (stackPosition === -1) return false;
    this.pushSlice(start);
    while (this.stack.length > stackPosition) this.popSpan(start);
    this.offset = start;
    return true;
  }
  /**
   * We've encountered a possible end for a span. If it's in the span stack,
   * we transform it into HTML.
   */
  closeSpan(spanType, start, end) {
    let stackPosition = -1;
    for (let i = this.stack.length - 1; i >= 0; i--) {
      const span2 = this.stack[i];
      if (span2[0] === spanType) {
        stackPosition = i;
        break;
      }
    }
    if (stackPosition === -1) return false;
    this.pushSlice(start);
    while (this.stack.length > stackPosition + 1) this.popSpan(start);
    const span = this.stack.pop();
    const startIndex = span[1];
    let tagName = "";
    let attrs = "";
    switch (spanType) {
      case "_":
        tagName = "i";
        break;
      case "*":
        tagName = "b";
        break;
      case "~":
        tagName = "s";
        break;
      case "^":
        tagName = "sup";
        break;
      case "\\":
        tagName = "sub";
        break;
      case "|":
        tagName = "span";
        attrs = this.showSyntax ? ' class="spoiler-shown"' : ' class="spoiler"';
        break;
    }
    const syntax = this.showSyntax ? `<tt>${spanType}${spanType}</tt>` : "";
    if (tagName) {
      this.buffers[startIndex] = `${syntax}<${tagName}${attrs}>`;
      this.buffers.push(`</${tagName}>${syntax}`);
      this.offset = end;
    }
    return true;
  }
  /**
   * Ends a span without an ending symbol. For most spans, this means
   * they don't take effect, but certain spans like spoiler tags don't
   * require ending symbols.
   */
  popSpan(end) {
    const span = this.stack.pop();
    if (!span) return false;
    this.pushSlice(end);
    switch (span[0]) {
      case "spoiler":
        this.buffers.push(`</span>`);
        this.buffers[span[1]] = this.showSyntax ? `<span class="spoiler-shown">` : `<span class="spoiler">`;
        break;
      case ">":
        this.buffers.push(`</span>`);
        this.buffers[span[1]] = `<span class="greentext">`;
        break;
      default:
        break;
    }
    return true;
  }
  popAllSpans(end) {
    while (this.stack.length) this.popSpan(end);
    this.pushSlice(end);
  }
  toUriComponent(html) {
    const component = html.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
    return encodeURIComponent(component);
  }
  /**
   * Handles special cases.
   */
  runLookahead(spanType, start) {
    switch (spanType) {
      case "`":
        {
          let delimLength = 0;
          let i = start;
          while (this.at(i) === "`") {
            delimLength++;
            i++;
          }
          let curDelimLength = 0;
          while (i < this.str.length) {
            const char = this.at(i);
            if (char === "\n") break;
            if (char === "`") {
              curDelimLength++;
            } else {
              if (curDelimLength === delimLength) break;
              curDelimLength = 0;
            }
            i++;
          }
          if (curDelimLength !== delimLength) return false;
          const end = i;
          this.pushSlice(start);
          let innerStart = start + delimLength;
          let innerEnd = i - delimLength;
          if (innerStart + 1 >= innerEnd) {
          } else if (this.at(innerStart) === " " && this.at(innerEnd - 1) === " ") {
            innerStart++;
            innerEnd--;
          } else if (this.at(innerStart) === " " && this.at(innerStart + 1) === "`") {
            innerStart++;
          } else if (this.at(innerEnd - 1) === " " && this.at(innerEnd - 2) === "`") {
            innerEnd--;
          }
          if (this.showSyntax) this.buffers.push(`<tt>${this.slice(start, innerStart)}</tt>`);
          this.buffers.push(`<code>`);
          this.buffers.push(this.slice(innerStart, innerEnd));
          this.buffers.push(`</code>`);
          if (this.showSyntax) this.buffers.push(`<tt>${this.slice(innerEnd, end)}</tt>`);
          this.offset = end;
        }
        return true;
      case "[":
        {
          if (this.slice(start, start + 2) !== "[[") return false;
          let i = start + 2;
          let colonPos = -1;
          let anglePos = -1;
          while (i < this.str.length) {
            const char = this.at(i);
            if (char === "]" || char === "\n") break;
            if (char === ":" && colonPos < 0) colonPos = i;
            if (char === "&" && this.slice(i, i + 4) === "&lt;") anglePos = i;
            i++;
          }
          if (this.slice(i, i + 2) !== "]]") return false;
          this.pushSlice(start);
          this.offset = i + 2;
          let termEnd = i;
          let uri = "";
          if (anglePos >= 0 && this.slice(i - 4, i) === "&gt;") {
            uri = this.slice(anglePos + 4, i - 4);
            termEnd = anglePos;
            if (this.at(termEnd - 1) === " ") termEnd--;
            uri = encodeURI(uri.replace(/^([a-z]*[^a-z:])/g, "http://$1"));
          }
          let term = this.slice(start + 2, termEnd).replace(/<\/?[au](?: [^>]+)?>/g, "");
          if (this.showSyntax) {
            term += `<small>${this.slice(termEnd, i)}</small>`;
          } else if (uri && !this.isTrusted) {
            const shortUri = uri.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
            term += `<small> &lt;${shortUri}&gt;</small>`;
            uri += '" rel="noopener';
          }
          if (colonPos > 0) {
            const key = this.slice(start + 2, colonPos).toLowerCase();
            switch (key) {
              case "w":
              case "wiki":
                if (this.showSyntax) break;
                term = term.slice(term.charAt(key.length + 1) === " " ? key.length + 2 : key.length + 1);
                uri = `//en.wikipedia.org/w/index.php?title=Special:Search&search=${this.toUriComponent(term)}`;
                term = `wiki: ${term}`;
                break;
              case "pokemon":
              case "item":
              case "type":
              case "category":
                if (this.showSyntax) {
                  this.buffers.push(`<tt>${this.slice(start, this.offset)}</tt>`);
                  return true;
                }
                term = term.slice(term.charAt(key.length + 1) === " " ? key.length + 2 : key.length + 1);
                let display = "";
                if (this.isTrusted) {
                  display = `<psicon ${key}="${term}" />`;
                } else {
                  display = `[${term}]`;
                }
                let dir = key;
                if (key === "item") dir += "s";
                if (key === "category") dir = "categories";
                uri = `//dex.pokemonshowdown.com/${dir}/${toID(term)}`;
                term = display;
            }
          }
          if (!uri) {
            uri = `//www.google.com/search?ie=UTF-8&btnI&q=${this.toUriComponent(term)}`;
          }
          if (this.showSyntax) {
            this.buffers.push(`<tt>[[</tt><u>${term}</u><tt>]]</tt>`);
          } else {
            this.buffers.push(`<a href="${uri}" target="_blank">${term}</a>`);
          }
        }
        return true;
      case "<":
        {
          if (this.slice(start, start + 8) !== "&lt;&lt;") return false;
          let i = start + 8;
          while (/[a-z0-9-]/.test(this.at(i))) i++;
          if (this.slice(i, i + 8) !== "&gt;&gt;") return false;
          this.pushSlice(start);
          const roomid = this.slice(start + 8, i);
          if (this.showSyntax) {
            this.buffers.push(`<small>&lt;&lt;</small><u>${roomid}</u><small>&gt;&gt;</small>`);
          } else {
            this.buffers.push(`&laquo;<a href="/${roomid}" target="_blank">${roomid}</a>&raquo;`);
          }
          this.offset = i + 8;
        }
        return true;
      case "a":
      case "u":
        {
          let i = start + 2;
          while (this.at(i) !== "<" || this.at(i + 1) !== "/" || this.at(i + 3) !== ">") i++;
          i += 4;
          this.pushSlice(i);
        }
        return true;
    }
    return false;
  }
  get() {
    let beginningOfLine = this.offset;
    for (let i = beginningOfLine; i < this.str.length; i++) {
      const char = this.at(i);
      switch (char) {
        case "_":
        case "*":
        case "~":
        case "^":
        case "\\":
        case "|":
          if (this.at(i + 1) === char && this.at(i + 2) !== char) {
            if (!(this.at(i - 1) !== " " && this.closeSpan(char, i, i + 2))) {
              if (this.at(i + 2) !== " ") this.pushSpan(char, i, i + 2);
            }
            if (i < this.offset) {
              i = this.offset - 1;
              break;
            }
          }
          while (this.at(i + 1) === char) i++;
          break;
        case "(":
          this.stack.push(["(", -1]);
          break;
        case ")":
          this.closeParenSpan(i);
          if (i < this.offset) {
            i = this.offset - 1;
            break;
          }
          break;
        case "`":
          if (this.at(i + 1) === "`") this.runLookahead("`", i);
          if (i < this.offset) {
            i = this.offset - 1;
            break;
          }
          while (this.at(i + 1) === "`") i++;
          break;
        case "[":
          this.runLookahead("[", i);
          if (i < this.offset) {
            i = this.offset - 1;
            break;
          }
          while (this.at(i + 1) === "[") i++;
          break;
        case ":":
          if (i < 7) break;
          if (this.slice(i - 7, i + 1).toLowerCase() === "spoiler:" || this.slice(i - 8, i + 1).toLowerCase() === "spoilers:") {
            if (this.at(i + 1) === " ") i++;
            this.pushSpan("spoiler", i + 1, i + 1);
          }
          break;
        case "&":
          if (i === beginningOfLine && this.slice(i, i + 4) === "&gt;") {
            if (!"._/=:;".includes(this.at(i + 4)) && !["w&lt;", "w&gt;"].includes(this.slice(i + 4, i + 9))) {
              this.pushSpan(">", i, i);
            }
          } else {
            this.runLookahead("<", i);
          }
          if (i < this.offset) {
            i = this.offset - 1;
            break;
          }
          while (this.slice(i + 1, i + 5) === "lt;&") i += 4;
          break;
        case "<":
          this.runLookahead("a", i);
          if (i < this.offset) {
            i = this.offset - 1;
            break;
          }
          break;
        case "\r":
        case "\n":
          this.popAllSpans(i);
          if (this.replaceLinebreaks) {
            this.buffers.push(`<br />`);
            this.offset++;
          }
          beginningOfLine = i + 1;
          break;
      }
    }
    this.popAllSpans(this.str.length);
    return this.buffers.join("");
  }
}
function formatText(str, isTrusted = false, replaceLinebreaks = false, showSyntax = false) {
  return new TextFormatter(str, isTrusted, replaceLinebreaks, showSyntax).get();
}
function stripFormatting(str) {
  str = str.replace(
    /\*\*([^\s*]+)\*\*|__([^\s_]+)__|~~([^\s~]+)~~|``([^\s`]+)``|\^\^([^\s^]+)\^\^|\\([^\s\\]+)\\/g,
    (match, $1, $2, $3, $4, $5, $6) => $1 || $2 || $3 || $4 || $5 || $6
  );
  return str.replace(/\[\[(?:([^<]*)\s*<[^>]+>|([^\]]+))\]\]/g, (match, $1, $2) => $1 || $2 || "");
}
//# sourceMappingURL=chat-formatter.js.map
