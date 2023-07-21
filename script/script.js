// 履歴を保存するための配列
let history = [];
// 変換履歴を最大何件まで保存するか
const HISTORY_LIMIT = 10;
// ページが読み込まれた後に実行する処理
window.addEventListener("DOMContentLoaded", function() {
  // 変換ボタンのクリックイベントリスナーを設定
  const convertButton = document.querySelector(".convert-button");
  convertButton.addEventListener("click", convertToUnicodeEscape);
  // 逆変換ボタンのクリックイベントリスナーを設定
  const reverseButton = document.querySelector(".reverse-button");
  reverseButton.addEventListener("click", convertToNormalText);
  // Enterキーが押されたときに変換するようにイベントリスナーを登録
  const inputText = document.getElementById("input-text");
  inputText.addEventListener("keypress", function(e) {
    if (e.keyCode === 13) {
      convertToUnicodeEscape();
      e.preventDefault();
    }
  });
  const inputUnicode = document.getElementById("input-unicode");
  inputUnicode.addEventListener("keydown", function(e) {
    if (e.keyCode === 13) {
      convertToNormalText();
      e.preventDefault();
    }
  });
});
// テキストをユニコードエスケープシーケンスに変換する
function convertToUnicodeEscape() {
  const inputText = document.getElementById("input-text").value;
  const outputText = escapeText(inputText);
  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = `
    <p style="font-size: 20px;">変換結果：</p>
    <textarea style="font-size: 20px;">${outputText}</textarea>
    <button class="copy-button" onclick="copyToClipboard('input-text')">テキストをコピー</button>
  `;
  addToHistory(inputText, outputText);
}
// ユニコードエスケープシーケンスをテキストに変換する
function convertToNormalText() {
  const inputText = document.getElementById("input-unicode").value;
  const outputText = unescapeText(inputText);
  const outputDiv = document.getElementById("output-unicode");
  outputDiv.innerHTML = `
    <p style="font-size: 20px;">変換結果：</p>
    <textarea style="font-size: 20px;">${outputText}</textarea>
    <button class="copy-button" onclick="copyToClipboard('input-unicode')">テキストをコピー</button>
  `;
  addToHistory(outputText, inputText);
}
// §を&に変換する関数
function convertSection() {
  const input = document.getElementById("section-text").value;
  // §を&に変換
  const convertedText = input.replace(/§/g, "&");
  const result = document.getElementById("result");
  result.innerHTML = `
    <p style="font-size: 20px;">変換結果：</p>
    <textarea style="font-size: 20px;">${convertedText}</textarea>
  `;
}
// テキストをクリップボードにコピーする関数
function copyToClipboard(text) {
  let copyText;
  if (text === "input-text") {
    copyText = escapeText(document.getElementById("input-text").value);
  } else if (text === "input-unicode") {
    copyText = unescapeText(document.getElementById("input-unicode").value);
  }
  navigator.clipboard.writeText(copyText)
    .then(() => {
      const successAlert = document.createElement("div");
      successAlert.textContent = "テキストがコピーされました！";
      document.body.appendChild(successAlert);
      setTimeout(() => successAlert.remove(), 3000);
    })
    .catch((error) => console.error(error));
}
// 変換履歴に追加する関数
function addToHistory(input, output) {
  const time = new Date().toLocaleString();
  const historyTable = document.querySelector(".history-table");
  const tbody = historyTable.querySelector("tbody");
  const tr = document.createElement("tr");
  const tdInput = document.createElement("td");
  const tdOutput = document.createElement("td");
  const tdDelete = document.createElement("td");
  const tdTime = document.createElement("td");
  tdInput.textContent = input;
  tdOutput.textContent = output;
  // 削除ボタンを作成する
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "削除";
  deleteButton.addEventListener("click", () => {
    history = history.filter(h => h.input !== input);
    tr.remove();
  });
  tdDelete.appendChild(deleteButton);
  tdTime.textContent = time;
  // tbody の最初の子要素として追加する
  tr.appendChild(tdInput);
  tr.appendChild(tdOutput);
  tr.appendChild(tdDelete);
  tr.appendChild(tdTime);
  tbody.appendChild(tr);
  // 履歴を保存する
  history.unshift({ input, output, time });
  if (history.length > HISTORY_LIMIT) {
    history.pop();
    tbody.lastElementChild.remove();
  }
}
// テキストをユニコードエスケープシーケンスに変換する関数
function escapeText(text) {
  return text
    .split("")
    .map(c =>
      c.codePointAt(0) > 127 ? "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0") : c
    )
    .join("");
}
// ユニコードエスケープシーケンスをテキストに変換する関数
function unescapeText(unicode) {
  return unicode.replace(/\\u(\w\w\w\w)/g, (matched, p1) =>
    String.fromCharCode(parseInt(p1, 16))
  );
}