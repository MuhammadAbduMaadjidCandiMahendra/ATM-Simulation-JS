import {findAccountByAccountNumber, withdraw} from "./http-request.js";

const ACCOUNT_INFO_LOCAL_STORAGE_KEY = "accountInfo"; // todo store accoun number only

let contentTitle = document.getElementById("content-title");

let dashboardContent = document.getElementById("dashboard-content");
let depositContent = document.getElementById("deposit-content");
let withdrawContent = document.getElementById("withdraw-content");

let linkToDeposit = document.getElementById("to-deposit");
let linkToDashboard = document.getElementById("to-dashboard");
let linkToWithdraw = document.getElementById("to-withdraw");

const formAccountInfo = document.getElementById("getAccountInfoForm");
const formWithdraw = document.getElementById("withdrawForm");

const showDashboardContent = () => {
  dashboardContent.style.display = "block";
  depositContent.style.display = "none";
  withdrawContent.style.display = "none";
  contentTitle.innerHTML = "Dashboard";
}

const showDepositContent = () => {
  dashboardContent.style.display = "none";
  depositContent.style.display = "block";
  withdrawContent.style.display = "none";
  contentTitle.innerHTML = "Deposit";
}

const showWithdrawContent = () => {
  dashboardContent.style.display = "none";
  depositContent.style.display = "none";
  withdrawContent.style.display = "block";
  contentTitle.innerHTML = "Withdraw";
}

const clearForm = (form, ...excludeInputNames) => {
  for (const inputElement of form.elements) {
    if (inputElement.nodeName === "INPUT") {
      inputElement.classList.remove("input-error");
      if (inputElement.nextElementSibling?.classList.contains("text-error")) {
        inputElement.nextElementSibling.innerHTML = "";
      }

      if (excludeInputNames.includes(inputElement.name)) {
        continue;
      }

      inputElement.value = "";
    }
  }
}

const activateNavItem = (linkElement) => {
  let ul = document.getElementsByClassName("sidebar-nav");
  let list = ul[0].getElementsByTagName("li");
  for (const li of list) {
    li.getElementsByTagName("a")[0].classList.remove("nav-item-active");
  }

  linkElement.classList.add("nav-item-active");
}

linkToDashboard.addEventListener("click", async (event) => {
  event.preventDefault();
  showDashboardContent();
  activateNavItem(linkToDashboard);
  clearForm(formAccountInfo);

  const accountInfoJson = globalThis.localStorage.getItem(ACCOUNT_INFO_LOCAL_STORAGE_KEY);
  if (accountInfoJson) {
    const accountInfo = JSON.parse(accountInfoJson);
    const account = await findAccountByAccountNumber(accountInfo.accountNumber);
    formAccountInfo.elements["accountNumber"].value = account.accountNumber;
    formAccountInfo.elements["accountName"].value = account.name;
    formAccountInfo.elements["balance"].value = account.balance;
  }
});

linkToDeposit.addEventListener("click", (event) => {
  event.preventDefault();
  showDepositContent();
  activateNavItem(linkToDeposit);
});

linkToWithdraw.addEventListener("click", async (event) => {
  event.preventDefault();
  showWithdrawContent();
  activateNavItem(linkToWithdraw);
  clearForm(formWithdraw);
  hideSuccessInput(document.getElementById("withdrawSuccess"));

  const accountInfoJson = globalThis.localStorage.getItem(ACCOUNT_INFO_LOCAL_STORAGE_KEY);
  if (accountInfoJson) {
    const accountInfo = JSON.parse(accountInfoJson);
    const account = await findAccountByAccountNumber(accountInfo.accountNumber);
    formWithdraw.elements["accountNumber"].value = account.accountNumber;
    formWithdraw.elements["balance"].value = account.balance;
  }
});

const showErrorInput = (element, errorMessage) => {
  element.classList.add("input-error");
  element.nextElementSibling.innerHTML = errorMessage;
}

const showSuccessInput = (element, successMessage) => {
  element.hidden = false;
  element.classList.add("success-message");
  element.innerHTML = successMessage;
}

const hideSuccessInput = (element) => {
  element.hidden = true;
  element.classList.remove("success-message");
}

formAccountInfo.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearForm(formAccountInfo, "accountNumber");

  const formData = new FormData(formAccountInfo);
  const accountNumber = formData.get("accountNumber");

  if (!accountNumber) {
    showErrorInput(formAccountInfo.elements["accountNumber"], "Please input valid account number");
    return;
  }

  try {
    let response = await findAccountByAccountNumber(accountNumber);
    formAccountInfo.elements['accountName'].value = response.name;
    formAccountInfo.elements['balance'].value = response.balance;
    globalThis.localStorage.setItem(ACCOUNT_INFO_LOCAL_STORAGE_KEY, JSON.stringify(response)); // todo store account number only
  } catch (error) {
    const errBody = await error.json();
    showErrorInput(formAccountInfo.elements['accountNumber'], errBody.detail);
  }
});

formWithdraw.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearForm(formWithdraw, "accountNumber", "balance", "withdrawAmount");
  hideSuccessInput(document.getElementById("withdrawSuccess"));

  const formData = new FormData(formWithdraw);
  const accountNumber = formData.get("accountNumber");
  const withdrawAmount = formData.get("withdrawAmount");

  if (!accountNumber) {
    showErrorInput(formWithdraw.elements["accountNumber"], "Account number is required");
    return;
  }

  if (!withdrawAmount) {
    showErrorInput(formWithdraw.elements["withdrawAmount"], "Withdraw amount is required");
    return;
  }

  if (withdrawAmount <= 0) {
    showErrorInput(formWithdraw.elements["withdrawAmount"], "Should be greater than 0");
    return;
  }

  try {
    const account = await withdraw(accountNumber, withdrawAmount);
    formWithdraw.elements["balance"].value = account.balance;
    showSuccessInput(document.getElementById("withdrawSuccess"), `Withdraw ${withdrawAmount} successful`);
  } catch (error) {
    const errBody = await error.json();
    showErrorInput(formWithdraw.elements["withdrawAmount"], errBody.detail);
  }
});

