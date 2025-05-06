"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var net_exports = {};
__export(net_exports, {
  HttpError: () => HttpError,
  Net: () => Net,
  NetRequest: () => NetRequest,
  NetStream: () => NetStream
});
module.exports = __toCommonJS(net_exports);
var https = __toESM(require("https"));
var http = __toESM(require("http"));
var url = __toESM(require("url"));
var Streams = __toESM(require("./streams"));
class HttpError extends Error {
  constructor(message, statusCode, body) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.body = body;
    Error.captureStackTrace(this, HttpError);
  }
}
class NetStream extends Streams.ReadWriteStream {
  constructor(uri, opts = null) {
    super();
    this.statusCode = null;
    this.headers = null;
    this.uri = uri;
    this.opts = opts;
    this.response = null;
    this.state = "pending";
    this.request = this.makeRequest(opts);
  }
  makeRequest(opts) {
    if (!opts) opts = {};
    let body = opts.body;
    if (body && typeof body !== "string") {
      if (!opts.headers) opts.headers = {};
      if (!opts.headers["Content-Type"]) {
        opts.headers["Content-Type"] = "application/x-www-form-urlencoded";
      }
      body = NetStream.encodeQuery(body);
    }
    if (opts.query) {
      this.uri += (this.uri.includes("?") ? "&" : "?") + NetStream.encodeQuery(opts.query);
    }
    if (body) {
      if (!opts.headers) opts.headers = {};
      if (!opts.headers["Content-Length"]) {
        opts.headers["Content-Length"] = Buffer.byteLength(body);
      }
    }
    const protocol = url.parse(this.uri).protocol;
    const net = protocol === "https:" ? https : http;
    let resolveResponse;
    this.response = new Promise((resolve) => {
      resolveResponse = resolve;
    });
    const request = net.request(this.uri, opts, (response) => {
      this.state = "open";
      this.nodeReadableStream = response;
      this.response = response;
      this.statusCode = response.statusCode || null;
      this.headers = response.headers;
      response.setEncoding("utf-8");
      resolveResponse(response);
      resolveResponse = null;
      response.on("data", (data) => {
        this.push(data);
      });
      response.on("error", (error) => {
        if (!this.atEOF) this.pushError(error, true);
      });
      response.on("end", () => {
        if (this.state === "open") this.state = "success";
        if (!this.atEOF) this.pushEnd();
      });
    });
    request.on("close", () => {
      if (!this.atEOF) {
        this.state = "error";
        this.pushError(new Error("Unexpected connection close"));
      }
      if (resolveResponse) {
        this.response = null;
        resolveResponse(null);
        resolveResponse = null;
      }
    });
    request.on("error", (error) => {
      if (!this.atEOF) this.pushError(error, true);
    });
    if (opts.timeout || opts.timeout === void 0) {
      request.setTimeout(opts.timeout || 5e3, () => {
        this.state = "timeout";
        this.pushError(new Error("Request timeout"));
        request.abort();
      });
    }
    if (body) {
      request.write(body);
      request.end();
      if (opts.writable) {
        throw new Error(`options.body is what you would have written to a NetStream - you must choose one or the other`);
      }
    } else if (opts.writable) {
      this.nodeWritableStream = request;
    } else {
      request.end();
    }
    return request;
  }
  static encodeQuery(data) {
    let out = "";
    for (const key in data) {
      if (out) out += `&`;
      out += `${key}=${encodeURIComponent(`${data[key]}`)}`;
    }
    return out;
  }
  _write(data) {
    if (!this.nodeWritableStream) {
      throw new Error("You must specify opts.writable to write to a request.");
    }
    const result = this.nodeWritableStream.write(data);
    if (result !== false) return void 0;
    if (!this.drainListeners.length) {
      this.nodeWritableStream.once("drain", () => {
        for (const listener of this.drainListeners) listener();
        this.drainListeners = [];
      });
    }
    return new Promise((resolve) => {
      this.drainListeners.push(resolve);
    });
  }
  _read() {
    this.nodeReadableStream?.resume();
  }
  _pause() {
    this.nodeReadableStream?.pause();
  }
}
class NetRequest {
  constructor(uri) {
    this.uri = uri;
  }
  /**
   * Makes a http/https get request to the given link and returns a stream.
   * The request data itself can be read with ReadStream#readAll().
   * The NetStream class also holds headers and statusCode as a property.
   *
   * @param opts request opts - headers, etc.
   * @param body POST body
   */
  getStream(opts = {}) {
    if (typeof Config !== "undefined" && Config.noNetRequests) {
      throw new Error(`Net requests are disabled.`);
    }
    const stream = new NetStream(this.uri, opts);
    return stream;
  }
  /**
   * Makes a basic http/https request to the URI.
   * Returns the response data.
   *
   * Will throw if the response code isn't 200 OK.
   *
   * @param opts request opts - headers, etc.
   */
  async get(opts = {}) {
    const stream = this.getStream(opts);
    const response = await stream.response;
    if (response) this.response = response;
    if (response && response.statusCode !== 200) {
      throw new HttpError(response.statusMessage || "Connection error", response.statusCode, await stream.readAll());
    }
    return stream.readAll();
  }
  post(opts = {}, body) {
    if (!body) body = opts.body;
    return this.get({
      ...opts,
      method: "POST",
      body
    });
  }
}
const Net = Object.assign((path) => new NetRequest(path), {
  NetRequest,
  NetStream
});
//# sourceMappingURL=net.js.map
