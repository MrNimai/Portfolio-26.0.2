// Store the sessionStorage key in one place so it is easy to rename later.
const NOTICE_STORAGE_KEY = "portfolioPrototypeNoticeAccepted";

// Get the modal elements from the page.
const noticeOverlay = document.querySelector("[data-notice-modal]");
const noticeAcceptButton = document.querySelector("[data-notice-accept]");
const noticeCloseWebsiteButton = document.querySelector("[data-notice-close-website]");

// Check if the current page is the home page.
// The notice should not appear on About, Projects, Blog, or any other page.
function isHomePage() {
  const pageName = window.location.pathname.split("/").pop();
  return pageName === "" || pageName === "index.html";
}

// Read sessionStorage safely. This keeps the notice hidden while browsing pages.
function hasAcceptedNotice() {
  try {
    return sessionStorage.getItem(NOTICE_STORAGE_KEY) === "true";
  } catch (error) {
    return false;
  }
}

// Save the visitor's confirmation for this browsing session.
function rememberNoticeAcceptance() {
  try {
    sessionStorage.setItem(NOTICE_STORAGE_KEY, "true");
  } catch (error) {
    // If storage is blocked, the modal may show again on page navigation.
  }
}

// Show the modal with a small delay so the CSS transition can run smoothly.
function openNoticeModal() {
  if (!noticeOverlay) return;

  noticeOverlay.hidden = false;
  document.body.classList.add("notice-lock");

  requestAnimationFrame(() => {
    noticeOverlay.classList.add("is-open");
  });
}

// Close the modal and unlock the page scroll.
function closeNoticeModal() {
  if (!noticeOverlay) return;

  noticeOverlay.classList.remove("is-open");
  document.body.classList.remove("notice-lock");

  setTimeout(() => {
    noticeOverlay.hidden = true;
  }, 250);
}

// Accept button: remember the choice and close the modal.
if (noticeAcceptButton) {
  noticeAcceptButton.addEventListener("click", () => {
    rememberNoticeAcceptance();
    closeNoticeModal();
  });
}

// Close Website button: try to close the tab, then redirect if the browser blocks it.
if (noticeCloseWebsiteButton) {
  noticeCloseWebsiteButton.addEventListener("click", () => {
    window.close();

    setTimeout(() => {
      window.location.href = "about:blank";
    }, 150);
  });
}

// If the home page is refreshed, clear the session confirmation so it appears again.
if (isHomePage() && performance.getEntriesByType("navigation")[0]?.type === "reload") {
  sessionStorage.removeItem(NOTICE_STORAGE_KEY);
}

// Automatically show the notice only on the home page.
// After clicking "I Understand", it will not appear on other pages.
if (isHomePage() && !hasAcceptedNotice()) {
  openNoticeModal();
}
