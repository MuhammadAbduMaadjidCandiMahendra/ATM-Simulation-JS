import withdrawContent from "./components/withdraw-content.js";
import dashboardContent from "./components/dashboard-content.js";

let linkToDashboard = document.getElementById("to-dashboard");
let linkToWithdraw = document.getElementById("to-withdraw");

// todo: would be nice to create a state
document.addEventListener("DOMContentLoaded", async () => await showDashboard());

linkToDashboard.addEventListener("click", async (event) => {
  event.preventDefault();
  await showDashboard();
});

linkToWithdraw.addEventListener("click", async (event) => {
  event.preventDefault();
  const {content, onLoad} = withdrawContent();
  showContent(content, "Withdraw");
  activateNavItem(linkToWithdraw);

  await onLoad();
});

const showDashboard = async () => {
  const {content, onLoad} = dashboardContent();
  showContent(content, "Dashboard");
  activateNavItem(linkToDashboard);

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
