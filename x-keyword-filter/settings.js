const form = document.querySelector("form");
const controls = document.getElementById("controls");
const listsFieldset = document.getElementById("lists");
const listEditor = document.getElementById("list-editor");
const listInput = document.getElementById("list");
const nameInput = document.getElementById("list-name");
const enabledInput = document.getElementById("list-enabled");
const keywordsInput = document.getElementById("keywords");
const statusMessage = document.getElementById("status");
const newListName = chrome.i18n.getMessage("new_list");
let lists;
let selected = 0;

document.documentElement.lang = chrome.i18n.getMessage("language");
for (const element of document.querySelectorAll("[data-message]")) {
  element.textContent = chrome.i18n.getMessage(element.dataset.message);
}
listInput.setAttribute("aria-label", chrome.i18n.getMessage("edit_list"));

function captureList() {
  if (lists.length === 0) return;
  const name = nameInput.value.trim() || newListName;
  const keywords = [...new Set(keywordsInput.value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean))];
  lists[selected] = { name, enabled: enabledInput.checked, keywords };
}

function showList() {
  listEditor.hidden = lists.length === 0;
  listEditor.disabled = listEditor.hidden;
  if (listEditor.hidden) return;

  listInput.replaceChildren(...lists.map(({ name, enabled }, index) =>
    new Option(enabled ? name : chrome.i18n.getMessage("inactive_list", name), index)
  ));
  listInput.value = String(selected);
  const { name, enabled, keywords } = lists[selected];
  nameInput.value = name;
  enabledInput.checked = enabled;
  keywordsInput.value = keywords.join("\n");
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
  statusMessage.textContent = chrome.i18n.getMessage("settings_read_error");
});

listInput.addEventListener("change", () => {
  captureList();
  selected = Number(listInput.value);
  showList();
});

document.getElementById("add-list").addEventListener("click", () => {
  captureList();
  selected = lists.length;
  lists.push({ name: newListName, enabled: false, keywords: [] });
  showList();
  nameInput.focus();
  nameInput.select();
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
    statusMessage.textContent = chrome.i18n.getMessage("settings_saved");
  } catch {
    statusMessage.textContent = chrome.i18n.getMessage("settings_save_error");
  } finally {
    controls.disabled = false;
    listsFieldset.disabled = false;
  }
});
