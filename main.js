import {findAccountByAccountNumber} from "./http-request.js";

let contentTitle = document.getElementById("content-title");

let dashboardContent = document.getElementById("dashboard-content");
let depositContent = document.getElementById("deposit-content");
let withdrawContent = document.getElementById("withdraw-content");

let linkToDeposit = document.getElementById("to-deposit");
let linkToDashboard = document.getElementById("to-dashboard");
let linkToWithdraw = document.getElementById("to-withdraw");

const formAccountInfo = document.getElementById("getAccountInfoForm");

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

linkToDashboard.addEventListener("click", (event) => {
  event.preventDefault();
  showDashboardContent();
  activateNavItem(linkToDashboard);
  clearForm(formAccountInfo);
});

linkToDeposit.addEventListener("click", (event) => {
  event.preventDefault();
  showDepositContent();
  activateNavItem(linkToDeposit);
});

linkToWithdraw.addEventListener("click", (event) => {
  event.preventDefault();
  showWithdrawContent();
  activateNavItem(linkToWithdraw);
});

formAccountInfo.addEventListener("submit", (event) => {
  event.preventDefault();
  clearForm(formAccountInfo, "accountNumber");

  const formData = new FormData(formAccountInfo);
  const accountNumber = formData.get("accountNumber");

  if (!accountNumber) {
    styleInputError(formAccountInfo.elements["accountNumber"], "Please input valid account number");
    return;
  }

  findAccountByAccountNumber(accountNumber)
    .then(response => {
      formAccountInfo.elements['accountName'].value = response.name;
      formAccountInfo.elements['balance'].value = response.balance;
    })
    .catch(error => {
      error.json().then(errBody => {
        formAccountInfo.elements['accountNumber'].classList.add("input-error");
        formAccountInfo.elements['accountNumber'].nextElementSibling.innerHTML = errBody.detail
      });
    });
});

