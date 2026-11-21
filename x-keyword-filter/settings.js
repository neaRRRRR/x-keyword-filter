const form = document.querySelector("form");
const controls = document.getElementById("controls");
const listsFieldset = document.getElementById("lists");
const listEditor = document.getElementById("list-editor");
const listInput = document.getElementById("list");
const nameInput = document.getElementById("list-name");
const enabledInput = document.getElementById("list-enabled");
const keywordsInput = document.getElementById("keywords");
const statusMessage = document.getElementById("status");
let lists;
let selected = 0;

function captureList() {
  if (lists.length === 0) return;
  const name = nameInput.value.trim() || "Yeni liste";
  const keywords = [...new Set(keywordsInput.value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean))];
  lists[selected] = { name, enabled: enabledInput.checked, keywords };
}

function showList() {
  listEditor.hidden = lists.length === 0;
  listEditor.disabled = listEditor.hidden;
  if (listEditor.hidden) return;

  listInput.replaceChildren(...lists.map(({ name, enabled }, index) =>
    new Option(enabled ? name : `${name} (kapalı)`, index)
  ));
  listInput.value = String(selected);
  const { name, enabled, keywords } = lists[selected];
  nameInput.value = name;
  enabledInput.checked = enabled;
  keywordsInput.value = keywords.join("\n");
}

function appendList(list) {
  captureList();
  selected = lists.length;
  lists.push(list);
  showList();
}

chrome.storage.local.get(FILTER_DEFAULTS).then(({ mode, lists: savedLists }) => {
  form.elements.mode.value = mode === "remove" ? "remove" : "blur";
  lists = Array.isArray(savedLists) ? savedLists.filter((list) =>
    typeof list?.name === "string" && typeof list.enabled === "boolean" && Array.isArray(list.keywords)
  ) : [];
  showList();
  controls.disabled = false;
  listsFieldset.disabled = false;
}, () => {
  statusMessage.textContent = "Ayarlar okunamadı. Uzantının menüsünü tekrar aç.";
});

listInput.addEventListener("change", () => {
  captureList();
  selected = Number(listInput.value);
  showList();
});

document.getElementById("add-list").addEventListener("click", () => {
  appendList({ name: "Yeni liste", enabled: false, keywords: [] });
  nameInput.focus();
  nameInput.select();
});

document.getElementById("add-gta-preset").addEventListener("click", () => {
  appendList({ name: "GTA VI", enabled: true, keywords: GTA_VI_KEYWORDS });
  enabledInput.focus();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  captureList();
  const mode = form.elements.mode.value;
  controls.disabled = true;
  listsFieldset.disabled = true;
  try {
    await chrome.storage.local.set({ mode, lists });
    showList();
    statusMessage.textContent = "Kaydedildi. Açık X sekmelerini yenile.";
  } catch {
    statusMessage.textContent = "Ayarlar kaydedilemedi. Tekrar dene.";
  } finally {
    controls.disabled = false;
    listsFieldset.disabled = false;
  }
});
