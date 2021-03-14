import React, { Component } from "react";
import crypto from "crypto";

const algorithm = "aes256";
const inputEncoding = "utf8";
const outputEncoding = "hex";
const ivlength = 16;

export default class Main extends Component {
  state = {
    secretKey: "",
    inputText: "",
    resultText: "",
    fileName: null,
  };

  validateSecretString = (secretString) => {
    while (secretString.length !== 32) secretString += " ";
    let key = Buffer.from(secretString, "utf-8");
    return key;
  };

  handleSecretKey = (e) => {
    this.setState(() => ({
      secretKey: e.target.value,
    }));
  };

  handleInputText = (e) => {
    this.setState(() => ({
      inputText: e.target.value,
    }));
  };

  handleFileName = (e) => {
    this.setState(() => ({
      fileName: e.target.value,
    }));
  };

  encrypt = () => {
    let key = this.validateSecretString(this.state.secretKey);
    var iv = crypto.randomBytes(ivlength);
    let cipher = crypto.createCipheriv(algorithm, key, iv);
    let ciphered = cipher.update(
      this.state.inputText,
      inputEncoding,
      outputEncoding
    );
    ciphered += cipher.final(outputEncoding);
    let ciphertext = iv.toString(outputEncoding) + ":" + ciphered;
    this.setState(() => ({
      resultText: ciphertext,
    }));
  };

  decrypt = () => {
    try {
      let key = this.validateSecretString(this.state.secretKey);
      let components = this.state.inputText.split(":");
      let iv_from_ciphertext = Buffer.from(components.shift(), outputEncoding);
      let decipher = crypto.createDecipheriv(
        algorithm,
        key,
        iv_from_ciphertext
      );
      let deciphered = decipher.update(
        components.join(":"),
        outputEncoding,
        inputEncoding
      );
      deciphered += decipher.final(inputEncoding);
      this.setState(() => ({
        resultText: deciphered,
      }));
    } catch (error) {
      this.setState(() => ({
        resultText: "Sorry, either cipher text or key is invalid!",
      }));
    }
  };

  generateTextFile = () => {
    if (this.state.fileName === null || this.state.fileName.length === 0)
      return;
    const element = document.createElement("a");
    const file = new Blob([this.state.resultText], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `${this.state.fileName}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  render() {
    return (
      <div>
        <nav class="navbar navbar-light bg-light">
          <div class="container-fluid">
            <a class="navbar-brand" href="/">
              <i className="fab fa-contao m-2"></i>
              Crypto File Safe
            </a>
          </div>
        </nav>
        <div className="d-flex justify-content-center ">
          <div class="col-sm-7 mt-5 d-flex justify-content-center flex-column">
            <label for="secretkey" class="form-label">
              Enter secret key (Keep it secret and don't forget){" "}
            </label>
            <input
              type="text"
              class="form-control"
              id="secretkey"
              placeholder="< 32 length"
              onChange={this.handleSecretKey}
            />
            <div class="form-text my-2" style={{ wordWrap: "break-word" }}>
              {this.state.secretKey}
            </div>

            <label for="input text" class="form-label">
              Enter data to encrypt/decrypt
            </label>
            <input
              type="text"
              class="form-control"
              id="input text"
              placeholder="*****"
              onChange={this.handleInputText}
            />
            <div class="form-text my-2" style={{ wordWrap: "break-word" }}>
              {this.state.inputText}
            </div>

            <div
              class="btn-group"
              role="group"
              aria-label="Basic checkbox toggle button group"
            >
              <input
                onClick={this.encrypt}
                class="btn-check"
                id="btncheck1"
                autocomplete="off"
              />
              <label class="btn btn-outline-primary" for="btncheck1">
                <i class="fas fa-lock mx-2 text-success"></i> Encrypt it!
              </label>

              <input
                onClick={this.decrypt}
                class="btn-check"
                id="btncheck3"
                autocomplete="off"
              />
              <label class="btn btn-outline-primary" for="btncheck3">
                <i class="fas fa-unlock mx-2 text-default"></i> Decrypt it!
              </label>
            </div>

            <div className="my-3 text-wrap" style={{ wordWrap: "break-word" }}>
              {this.state.resultText}
            </div>

            <div class="input-group">
              <input
                type="text"
                class="form-control"
                onChange={this.handleFileName}
                placeholder="Enter file name"
              />
              <span class="input-group-text" id="basic-addon2">
                .txt
              </span>
            </div>
            <div class="form-text mb-3">
              {(this.state.fileName == null ||
                this.state.fileName.length === 0) &&
                "File name to save with"}
            </div>
            <button
              onClick={this.generateTextFile}
              type="button"
              class="btn btn-primary btn-lg"
            >
              <i class="fas fa-angle-double-down mx-3"></i>Download
            </button>
          </div>
        </div>
      </div>
    );
  }
}
