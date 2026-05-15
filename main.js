import {findAccountByAccountNumber, withdraw} from "./http-request.js";
import withdrawContent from "./components/withdraw-content.js";
import {hideSuccessInput, showErrorInput, showSuccessInput} from "./util/message-util.js";
import {ACCOUNT_NUMBER_LOCAL_STORAGE_KEY} from "./util/constant.js";
import {clearForm} from "./util/form-util.js";
import dashboardContent from "./components/dashboard-content.js";

let contentTitle = document.getElementById("content-title");
let linkToDashboard = document.getElementById("to-dashboard");
let linkToWithdraw = document.getElementById("to-withdraw");

const activateNavItem = (linkElement) => {
  let ul = document.getElementsByClassName("sidebar-nav");
  let list = ul[0].getElementsByTagName("li");
  for (const li of list) {
    li.getElementsByTagName("a")[0].classList.remove("nav-item-active");
  }

  linkElement.classList.add("nav-item-active");
}

const replaceContent = (content, pageTitle) => {
  let mainContent = document.getElementById("main-section");
  mainContent.innerHTML = "";
  mainContent.append(content);

  contentTitle.innerHTML = pageTitle;
}

linkToDashboard.addEventListener("click", async (event) => {
  event.preventDefault();
  const {content, onLoad} = dashboardContent();

  replaceContent(content, "Dashboard");
  activateNavItem(linkToDashboard);

  await onLoad();
});

linkToWithdraw.addEventListener("click", async (event) => {
  event.preventDefault();
  const {content, form} = withdrawContent();
  replaceContent(content, "Withdraw");
  activateNavItem(linkToWithdraw);

  hideSuccessInput(document.getElementById("withdrawSuccess"));

  const accountNumber = globalThis.localStorage.getItem(ACCOUNT_NUMBER_LOCAL_STORAGE_KEY);
  if (accountNumber) {
    const account = await findAccountByAccountNumber(accountNumber);
    form.elements["accountNumber"].value = account.accountNumber;
    form.elements["balance"].value = account.balance;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearForm(form, "accountNumber", "balance", "withdrawAmount");
    hideSuccessInput(document.getElementById("withdrawSuccess"));

    const formData = new FormData(form);
    const accountNumber = formData.get("accountNumber");
    const withdrawAmount = formData.get("withdrawAmount");

    if (!accountNumber) {
      showErrorInput(form.elements["accountNumber"], "Account number is required");
      return;
    }

    if (!withdrawAmount) {
      showErrorInput(form.elements["withdrawAmount"], "Withdraw amount is required");
      return;
    }

    if (withdrawAmount <= 0) {
      showErrorInput(form.elements["withdrawAmount"], "Should be greater than 0");
      return;
    }

    try {
      const account = await withdraw(accountNumber, withdrawAmount);
      form.elements["balance"].value = account.balance;
      showSuccessInput(document.getElementById("withdrawSuccess"), `Withdraw ${withdrawAmount} successful`);
    } catch (error) {
      const errBody = await error.json();
      showErrorInput(form.elements["withdrawAmount"], errBody.detail);
    }
  });
});
