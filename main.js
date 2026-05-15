import {findAccountByAccountNumber, withdraw} from "./http-request.js";

import dashboardContent from "./components/dashboard-content.js";

const ACCOUNT_NUMBER_LOCAL_STORAGE_KEY = "account";

let contentTitle = document.getElementById("content-title");

let withdrawContent = document.getElementById("withdraw-content");

let linkToDashboard = document.getElementById("to-dashboard");
let linkToWithdraw = document.getElementById("to-withdraw");

const showWithdrawContent = () => {
  dashboardContent.style.display = "none";
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

const dashboardFormEventListener = (form) => {
  return async (event) => {
    event.preventDefault();
    clearForm(form, "accountNumber");

    const formData = new FormData(form);
    const accountNumber = formData.get("accountNumber");

    if (!accountNumber) {
      showErrorInput(form.elements["accountNumber"], "Please input valid account number");
      return;
    }

    try {
      let response = await findAccountByAccountNumber(accountNumber);
      form.elements['accountName'].value = response.name;
      form.elements['balance'].value = response.balance;
      globalThis.localStorage.setItem(ACCOUNT_NUMBER_LOCAL_STORAGE_KEY, response.accountNumber);
    } catch (error) {
      const errBody = await error.json();
      showErrorInput(form.elements['accountNumber'], errBody.detail);
    }
  };
}

const replaceContent = (content) => {
  let mainContent = document.getElementById("main-section");
  mainContent.innerHTML = "";
  mainContent.append(content);
  contentTitle.innerHTML = "Dashboard";
}

linkToDashboard.addEventListener("click", async (event) => {
  event.preventDefault();
  const {content, form} = dashboardContent();
  replaceContent(content);
  activateNavItem(linkToDashboard);

  const accountNumber = globalThis.localStorage.getItem(ACCOUNT_NUMBER_LOCAL_STORAGE_KEY);
  if (accountNumber) {
    const account = await findAccountByAccountNumber(accountNumber);
    form.elements["accountNumber"].value = account.accountNumber;
    form.elements["accountName"].value = account.name;
    form.elements["balance"].value = account.balance;
  }

  form.addEventListener("submit", dashboardFormEventListener(form));
});

// linkToWithdraw.addEventListener("click", async (event) => {
//   event.preventDefault();
//   showWithdrawContent();
//   activateNavItem(linkToWithdraw);
//   clearForm(formWithdraw);
//   hideSuccessInput(document.getElementById("withdrawSuccess"));
//
//   const accountNumber = globalThis.localStorage.getItem(ACCOUNT_NUMBER_LOCAL_STORAGE_KEY);
//   if (accountNumber) {
//     const account = await findAccountByAccountNumber(accountNumber);
//     formWithdraw.elements["accountNumber"].value = account.accountNumber;
//     formWithdraw.elements["balance"].value = account.balance;
//   }
// });

const showErrorInput = (element, errorMessage) => {
  element.classList.add("input-error");
  element.nextElementSibling.classList.add("text-error");
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

// formWithdraw.addEventListener("submit", async (event) => {
//   event.preventDefault();
//   clearForm(formWithdraw, "accountNumber", "balance", "withdrawAmount");
//   hideSuccessInput(document.getElementById("withdrawSuccess"));
//
//   const formData = new FormData(formWithdraw);
//   const accountNumber = formData.get("accountNumber");
//   const withdrawAmount = formData.get("withdrawAmount");
//
//   if (!accountNumber) {
//     showErrorInput(formWithdraw.elements["accountNumber"], "Account number is required");
//     return;
//   }
//
//   if (!withdrawAmount) {
//     showErrorInput(formWithdraw.elements["withdrawAmount"], "Withdraw amount is required");
//     return;
//   }
//
//   if (withdrawAmount <= 0) {
//     showErrorInput(formWithdraw.elements["withdrawAmount"], "Should be greater than 0");
//     return;
//   }
//
//   try {
//     const account = await withdraw(accountNumber, withdrawAmount);
//     formWithdraw.elements["balance"].value = account.balance;
//     showSuccessInput(document.getElementById("withdrawSuccess"), `Withdraw ${withdrawAmount} successful`);
//   } catch (error) {
//     const errBody = await error.json();
//     showErrorInput(formWithdraw.elements["withdrawAmount"], errBody.detail);
//   }
// });

