(() => {
  const POST = ':is(article, [role="article"])[data-testid="tweet"]';
  const CELL = '[data-testid="cellInnerDiv"]';
  const STATE = "data-x-keyword-filter";
  const TEXT_ATTRIBUTES = ["href", "data-expanded-url", "title", "alt", "aria-label"];
  const TEXT_FIELDS = [
    '[data-testid="tweetText"]', '[data-testid="User-Name"]',
    '[data-testid="quoteTweet"]', '[data-testid="quote"]', "[lang][dir]",
    ...TEXT_ATTRIBUTES.map((attribute) => `[${attribute}]`)
  ].join(", ");

  function normalize(text) {
    return text.normalize("NFKD")
      .replace(/[\p{M}\p{Cf}]/gu, "")
      .toLowerCase()
      .replace(/ı/g, "i")
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .trim();
  }

  function outerPost(element) {
    let post = element?.closest(POST);
    let enclosing;
    while ((enclosing = post?.parentElement?.closest(POST))) {
      post = enclosing;
    }
    return post;
  }

  function startFilter({ mode, lists }) {
    const termsByLength = new Map();

    for (const list of Array.isArray(lists) ? lists : FILTER_DEFAULTS.lists) {
      if (list?.enabled !== true || !Array.isArray(list.keywords)) continue;
      for (const keyword of list.keywords) {
        if (typeof keyword !== "string") continue;
        const term = normalize(keyword);
        if (!term) continue;
        const length = term.split(" ").length;
        if (!termsByLength.has(length)) termsByLength.set(length, new Set());
        termsByLength.get(length).add(term);
      }
    }

    if (termsByLength.size === 0) {
      const revealTimeline = () => document.documentElement.setAttribute(STATE, "inactive");
      if (document.documentElement) revealTimeline();
      else document.addEventListener("DOMContentLoaded", revealTimeline, { once: true });
      return;
    }

    const madeInert = new WeakSet();
    const revealControls = new WeakMap();
    const revealedPosts = new WeakMap();

    function matches(text) {
      if (!text) return false;
      const words = normalize(text).split(" ");
      for (const [length, terms] of termsByLength) {
        for (let start = 0; start + length <= words.length; start++) {
          if (terms.has(words.slice(start, start + length).join(" "))) return true;
        }
      }
      return false;
    }

    function hasMatch(post) {
      if (matches(post.textContent) || matches(post.getAttribute("aria-label"))) return true;
      return Array.from(post.querySelectorAll(TEXT_FIELDS)).some((field) =>
        matches(field.textContent) ||
        TEXT_ATTRIBUTES.some((attribute) => matches(field.getAttribute(attribute)))
      );
    }

    function postIdentity(post) {
      return post.querySelector('a[href*="/status/"] time')?.closest("a").pathname ?? post.textContent;
    }

    function removeRevealControl(post) {
      revealControls.get(post)?.remove();
      revealControls.delete(post);
    }

    function clearPost(post) {
      removeRevealControl(post);
      if (madeInert.delete(post)) post.inert = false;
      if (post.getAttribute(STATE) !== "clear") post.setAttribute(STATE, "clear");
    }

    function addRevealControl(post) {
      let control = revealControls.get(post);
      if (!control) {
        // The button stays outside the blurred, inert article.
        control = document.createElement("div");
        control.className = "x-keyword-filter-reveal";
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = chrome.i18n.getMessage("reveal_post");
        button.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          const hadFocus = document.activeElement === button;
          revealedPosts.set(post, postIdentity(post));
          clearPost(post);
          if (hadFocus && !post.inert) {
            if (!post.hasAttribute("tabindex")) post.tabIndex = -1;
            post.focus({ preventScroll: true });
          }
        });
        control.append(button);
        revealControls.set(post, control);
      }
      if (control.nextElementSibling !== post) post.before(control);
    }

    function filterPost(post) {
      if (!post.isConnected) return;
      if (!hasMatch(post)) {
        revealedPosts.delete(post);
        clearPost(post);
        return;
      }

      if (mode === "remove") {
        const cell = post.closest(CELL);
        // X's timeline keeps the cell for layout and can reuse it for a different post.
        post.remove();
        cell?.setAttribute(STATE, "empty");
        return;
      }

      if (revealedPosts.has(post)) {
        if (revealedPosts.get(post) === postIdentity(post)) return;
        revealedPosts.delete(post);
      }

      if (!post.inert) {
        post.inert = true;
        madeInert.add(post);
      }
      if (post.getAttribute(STATE) !== "blurred") post.setAttribute(STATE, "blurred");
      addRevealControl(post);
    }

    new MutationObserver((mutations) => {
      const posts = new Set();
      for (const mutation of mutations) {
        for (const node of mutation.removedNodes) {
          if (!node.isConnected && revealControls.has(node)) removeRevealControl(node);
        }

        const target = mutation.target.nodeType === Node.ELEMENT_NODE
          ? mutation.target
          : mutation.target.parentElement;
        const existingPost = outerPost(target);
        if (existingPost) {
          posts.add(existingPost);
          continue;
        }

        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          if (node.matches(POST)) posts.add(outerPost(node));
          node.querySelectorAll(POST).forEach((post) => posts.add(outerPost(post)));
        }
      }
      posts.forEach(filterPost);
    }).observe(document, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["data-testid", "role", ...TEXT_ATTRIBUTES]
    });

    new Set(Array.from(document.querySelectorAll(POST), outerPost)).forEach(filterPost);
  }

  chrome.storage.local.get(FILTER_DEFAULTS)
    .catch(() => FILTER_DEFAULTS)
    .then(startFilter);
})();
