import withdrawContent from "./components/withdraw-content.js";
import dashboardContent from "./components/dashboard-content.js";
import {PageState, PageStateContext} from "./util/page-state.js";
import {PAGE_STATE_NAME} from "./util/constant.js";

let linkToDashboard = document.getElementById("to-dashboard");
let linkToWithdraw = document.getElementById("to-withdraw");

const pageStateContext = PageStateContext.from(
  PageState(PAGE_STATE_NAME.DASHBOARD, showDashboard),
  PageState(PAGE_STATE_NAME.WITHDRAW, showWithdraw)
);

document.addEventListener("DOMContentLoaded", async () => {
  pageStateContext.applyCurrentState();
});

linkToDashboard.addEventListener("click", async (event) => {
  event.preventDefault();
  await showDashboard();
  pageStateContext.saveCurrentState(PAGE_STATE_NAME.DASHBOARD);
});

linkToWithdraw.addEventListener("click", async (event) => {
  event.preventDefault();
  await showWithdraw();
  pageStateContext.saveCurrentState(PAGE_STATE_NAME.WITHDRAW);
});

async function showDashboard() {
  const {content, onLoad} = dashboardContent();
  showContent(content, "Dashboard");
  activateNavItem(linkToDashboard);

  await onLoad();
}

async function showWithdraw() {
  const {content, onLoad} = withdrawContent();
  showContent(content, "Withdraw");
  activateNavItem(linkToWithdraw);

  await onLoad();
}

const activateNavItem = (linkElement) => {
  let ul = document.getElementsByClassName("sidebar-nav");
  let list = ul[0].getElementsByTagName("li");
  for (const li of list) {
    li.getElementsByTagName("a")[0].classList.remove("nav-item-active");
  }

  linkElement.classList.add("nav-item-active");
}

const showContent = (content, pageTitle) => {
  let mainContent = document.getElementById("main-section");
  mainContent.innerHTML = "";
  mainContent.append(content);

  let contentTitle = document.getElementById("content-title");
  contentTitle.innerHTML = pageTitle;
}
