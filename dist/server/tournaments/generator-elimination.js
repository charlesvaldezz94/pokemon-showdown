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
var generator_elimination_exports = {};
__export(generator_elimination_exports, {
  Elimination: () => Elimination
});
module.exports = __toCommonJS(generator_elimination_exports);
var import_lib = require("../../lib");
class ElimNode {
  constructor(options) {
    this.children = null;
    this.user = options.user || null;
    this.state = options.state || "";
    this.result = options.result || "";
    this.score = options.score || null;
    this.losersBracketNode = options.losersBracketNode || null;
    this.losersBracketIndex = options.losersBracketIndex || 0;
    this.parent = options.parent || null;
    this.fromNode = options.fromNode || null;
  }
  setChildren(children) {
    if (this.children) {
      for (const child of this.children) child.parent = null;
    }
    if (children) {
      for (const child of children) child.parent = this;
    }
    this.children = children;
  }
  traverse(multiCallback) {
    const queue = [this];
    let node;
    while (node = queue.shift()) {
      multiCallback(node);
      if (node.children) queue.push(...node.children);
    }
  }
  find(multiCallback) {
    const queue = [this];
    let node;
    while (node = queue.shift()) {
      const value = multiCallback(node);
      if (value) {
        return value;
      }
      if (node.children) queue.push(...node.children);
    }
    return void 0;
  }
  [Symbol.iterator]() {
    const results = [this];
    for (const result of results) {
      if (result.children) results.push(...result.children);
    }
    return results[Symbol.iterator]();
  }
  toJSON() {
    const node = {};
    if (!this.children) {
      node.team = this.user || (this.losersBracketIndex <= 1 ? `(loser's bracket)` : `(loser's bracket ${this.losersBracketIndex})`);
    } else {
      node.children = this.children.map((child) => child.toJSON());
      node.state = this.state || "unavailable";
      if (node.state === "finished") {
        node.team = this.user;
        node.result = this.result;
        node.score = this.score;
      }
    }
    return node;
  }
}
const nameMap = [
  "",
  "Single",
  "Double",
  "Triple",
  "Quadruple",
  "Quintuple",
  "Sextuple"
  // Feel free to add more
];
class Elimination {
  constructor(maxSubtrees) {
    this.name = "Elimination";
    this.isDrawingSupported = false;
    this.isBracketFrozen = false;
    this.players = [];
    maxSubtrees = maxSubtrees || 1;
    if (typeof maxSubtrees === "string" && maxSubtrees.toLowerCase() === "infinity") {
      maxSubtrees = Infinity;
    } else if (typeof maxSubtrees !== "number") {
      maxSubtrees = parseInt(maxSubtrees);
    }
    if (!maxSubtrees || maxSubtrees < 1) maxSubtrees = 1;
    this.maxSubtrees = maxSubtrees;
    this.treeRoot = null;
    if (nameMap[maxSubtrees]) {
      this.name = `${nameMap[maxSubtrees]} ${this.name}`;
    } else if (maxSubtrees === Infinity) {
      this.name = `N-${this.name}`;
    } else {
      this.name = `${maxSubtrees}-tuple ${this.name}`;
    }
  }
  getPendingBracketData(players) {
    return {
      type: "tree",
      rootNode: null
    };
  }
  getBracketData() {
    return {
      type: "tree",
      rootNode: this.treeRoot.toJSON()
    };
  }
  freezeBracket(players) {
    if (!players.length) throw new Error(`No players in tournament`);
    this.players = players;
    this.isBracketFrozen = true;
    let tree = null;
    for (const user of import_lib.Utils.shuffle(players)) {
      if (!tree) {
        tree = {
          root: new ElimNode({ user }),
          currentLayerLeafNodes: [],
          nextLayerLeafNodes: []
        };
        tree.currentLayerLeafNodes.push(tree.root);
        continue;
      }
      const targetNode = tree.currentLayerLeafNodes.shift();
      if (!targetNode) throw new Error(`TypeScript bug: no ! in checkJs`);
      const newLeftChild = new ElimNode({ user: targetNode.user });
      tree.nextLayerLeafNodes.push(newLeftChild);
      const newRightChild = new ElimNode({ user });
      tree.nextLayerLeafNodes.push(newRightChild);
      targetNode.setChildren([newLeftChild, newRightChild]);
      targetNode.user = null;
      if (tree.currentLayerLeafNodes.length === 0) {
        tree.currentLayerLeafNodes = tree.nextLayerLeafNodes;
        tree.nextLayerLeafNodes = [];
      }
    }
    this.maxSubtrees = Math.min(this.maxSubtrees, players.length - 1);
    for (let losersBracketIndex = 1; losersBracketIndex < this.maxSubtrees; losersBracketIndex++) {
      const matchesByDepth = {};
      const queue = [{ node: tree.root, depth: 0 }];
      let frame;
      while (frame = queue.shift()) {
        if (!frame.node.children || frame.node.losersBracketNode) continue;
        if (!matchesByDepth[frame.depth]) matchesByDepth[frame.depth] = [];
        matchesByDepth[frame.depth].push(frame.node);
        queue.push({ node: frame.node.children[0], depth: frame.depth + 1 });
        queue.push({ node: frame.node.children[1], depth: frame.depth + 1 });
      }
      const newTree = {
        root: new ElimNode({ losersBracketIndex, fromNode: matchesByDepth[0][0] }),
        currentLayerLeafNodes: [],
        nextLayerLeafNodes: []
      };
      newTree.currentLayerLeafNodes.push(newTree.root);
      for (const depth in matchesByDepth) {
        if (depth === "0") continue;
        const matchesThisDepth = matchesByDepth[depth];
        let n = 0;
        for (; n < matchesThisDepth.length - 1; n += 2) {
          const oldLeaf = newTree.currentLayerLeafNodes.shift();
          if (!oldLeaf) throw new Error(`TypeScript bug: no ! in checkJs`);
          const oldLeafFromNode = oldLeaf.fromNode;
          oldLeaf.fromNode = null;
          const newBranch = new ElimNode({ losersBracketIndex });
          oldLeaf.setChildren([new ElimNode({ losersBracketIndex, fromNode: oldLeafFromNode }), newBranch]);
          const newLeftChild = new ElimNode({ losersBracketIndex, fromNode: matchesThisDepth[n] });
          newTree.nextLayerLeafNodes.push(newLeftChild);
          const newRightChild = new ElimNode({ losersBracketIndex, fromNode: matchesThisDepth[n + 1] });
          newTree.nextLayerLeafNodes.push(newRightChild);
          newBranch.setChildren([newLeftChild, newRightChild]);
        }
        if (n < matchesThisDepth.length) {
          const oldLeaf = newTree.currentLayerLeafNodes.shift();
          const oldLeafFromNode = oldLeaf.fromNode;
          oldLeaf.fromNode = null;
          const newLeaf = new ElimNode({ fromNode: matchesThisDepth[n] });
          newTree.nextLayerLeafNodes.push(newLeaf);
          oldLeaf.setChildren([new ElimNode({ fromNode: oldLeafFromNode }), newLeaf]);
        }
        newTree.currentLayerLeafNodes = newTree.nextLayerLeafNodes;
        newTree.nextLayerLeafNodes = [];
      }
      newTree.root.traverse((node) => {
        if (node.fromNode) {
          node.fromNode.losersBracketNode = node;
          node.fromNode = null;
        }
      });
      const newRoot = new ElimNode({});
      newRoot.setChildren([tree.root, newTree.root]);
      tree.root = newRoot;
    }
    tree.root.traverse((node) => {
      if (node.children?.[0].user && node.children[1].user) {
        node.state = "available";
      }
    });
    this.treeRoot = tree.root;
  }
  disqualifyUser(user) {
    if (!this.isBracketFrozen) return "BracketNotFrozen";
    const found = this.treeRoot.find((node) => {
      if (node.state === "available") {
        if (!node.children) throw new Error(`no children`);
        if (node.children[0].user === user) {
          return {
            match: [user, node.children[1].user],
            result: "loss",
            score: [0, 1]
          };
        } else if (node.children[1].user === user) {
          return {
            match: [node.children[0].user, user],
            result: "win",
            score: [1, 0]
          };
        }
      }
      return void 0;
    });
    if (found) {
      const error = this.setMatchResult(found.match, found.result, found.score);
      if (error) {
        throw new Error(`Unexpected ${error} from setMatchResult([${found.match.join(", ")}], ${found.result})`);
      }
    }
    user.game.setPlayerUser(user, null);
  }
  getAvailableMatches() {
    if (!this.isBracketFrozen) return "BracketNotFrozen";
    const matches = [];
    this.treeRoot.traverse((node) => {
      if (node.state !== "available") return;
      const p1 = node.children[0].user;
      const p2 = node.children[1].user;
      if (!p1.isBusy && !p2.isBusy) {
        matches.push([p1, p2]);
      }
    });
    return matches;
  }
  setMatchResult([p1, p2], result, score) {
    if (!this.isBracketFrozen) return "BracketNotFrozen";
    if (!["win", "loss"].includes(result)) return "InvalidMatchResult";
    if (!this.players.includes(p1) || !this.players.includes(p2)) return "UserNotAdded";
    const targetNode = this.treeRoot.find((node) => {
      if (node.state === "available" && (node.children[0].user === p1 && node.children[1].user === p2)) {
        return node;
      }
      return void 0;
    });
    if (!targetNode) return "InvalidMatch";
    if (!targetNode.children) throw new Error(`invalid available state`);
    targetNode.state = "finished";
    targetNode.result = result;
    targetNode.score = score.slice();
    const winner = targetNode.children[result === "win" ? 0 : 1].user;
    const loser = targetNode.children[result === "loss" ? 0 : 1].user;
    targetNode.user = winner;
    if (!winner || !loser) throw new Error(`invalid available state`);
    if (loser.losses === this.maxSubtrees) {
      loser.isEliminated = true;
      loser.sendRoom(`|tournament|update|{"isJoined":false}`);
      loser.game.setPlayerUser(loser, null);
    }
    if (targetNode.parent) {
      const parent = targetNode.parent;
      if (loser.losses <= winner.losses && !loser.isDisqualified) {
        const newNode = new ElimNode({ state: "available", losersBracketNode: targetNode.losersBracketNode });
        newNode.setChildren([targetNode, new ElimNode({ user: loser })]);
        parent.setChildren([newNode, parent.children[1]]);
        return;
      }
      const userA = parent.children[0].user;
      const userB = parent.children[1].user;
      if (userA && userB) {
        parent.state = "available";
        let error = "";
        if (userA.isDisqualified) {
          error = this.setMatchResult([userA, userB], "loss", [0, 1]);
        } else if (userB.isDisqualified) {
          error = this.setMatchResult([userA, userB], "win", [1, 0]);
        }
        if (error) {
          throw new Error(`Unexpected ${error} from setMatchResult([${userA},${userB}], ...)`);
        }
      }
    } else if (loser.losses < this.maxSubtrees && !loser.isDisqualified) {
      const newRoot = new ElimNode({ state: "available" });
      newRoot.setChildren([targetNode, new ElimNode({ user: loser })]);
      this.treeRoot = newRoot;
    }
    if (targetNode.losersBracketNode) {
      targetNode.losersBracketNode.user = loser;
      const userA = targetNode.losersBracketNode.parent.children[0].user;
      const userB = targetNode.losersBracketNode.parent.children[1].user;
      if (userA && userB) {
        targetNode.losersBracketNode.parent.state = "available";
        let error = "";
        if (userA.isDisqualified) {
          error = this.setMatchResult([userA, userB], "loss", [0, 1]);
        } else if (userB.isDisqualified) {
          error = this.setMatchResult([userA, userB], "win", [1, 0]);
        }
        if (error) {
          throw new Error(`Unexpected ${error} from setMatchResult([${userA}, ${userB}], ...)`);
        }
      }
    }
  }
  isTournamentEnded() {
    return this.treeRoot.state === "finished";
  }
  getResults() {
    if (!this.isTournamentEnded()) return "TournamentNotEnded";
    const results = [];
    let currentNode = this.treeRoot;
    for (let n = 0; n < this.maxSubtrees; ++n) {
      results.push([currentNode.user]);
      if (!currentNode.children) break;
      currentNode = currentNode.children[currentNode.result === "loss" ? 0 : 1];
      if (!currentNode) break;
    }
    if (this.players.length - 1 === this.maxSubtrees && currentNode) {
      results.push([currentNode.user]);
    }
    return results;
  }
}
//# sourceMappingURL=generator-elimination.js.map
