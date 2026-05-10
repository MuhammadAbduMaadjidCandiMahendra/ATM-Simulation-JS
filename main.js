import { findAccountByAccountNumber } from "./http-request.js";

let contentTitle = document.getElementById("content-title");

let dashboardContent = document.getElementById("dashboard-content");
let depositContent = document.getElementById("deposit-content");
let withdrawContent = document.getElementById("withdraw-content");

let linkToDeposit = document.getElementById("to-deposit");
let linkToDashboard = document.getElementById("to-dashboard");
let linkToWithdraw = document.getElementById("to-withdraw");

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

const activateNavItem = (linkElement) => {
  let ul = document.getElementsByClassName("sidebar-nav");
  let list = ul[0].getElementsByTagName("li");
  for (const li of list) {
    li.getElementsByTagName("a")[0].classList.remove("nav-item-active");
  }

  linkElement.classList.add("nav-item-active");
}

linkToDeposit.addEventListener("click", (event) => {
  event.preventDefault();
  showDepositContent();
  activateNavItem(linkToDeposit);
})

linkToDashboard.addEventListener("click", (event) => {
  event.preventDefault();
  showDashboardContent();
  activateNavItem(linkToDashboard);
})

linkToWithdraw.addEventListener("click", (event) => {
  event.preventDefault();
  showWithdrawContent();
  activateNavItem(linkToWithdraw);
})

const formAccountInfo = document.getElementById("getAccountInfoForm");
formAccountInfo.addEventListener("submit", (event) => {
  event.preventDefault();

  let accountNumberInput = formAccountInfo.elements['accountNumber'];
  let accountNameInput = formAccountInfo.elements['accountName'];
  let balanceInput = formAccountInfo.elements['balance'];

  accountNumberInput.classList.remove("input-error");
  accountNumberInput.nextElementSibling.innerHTML = "";
  accountNameInput.value = "";
  balanceInput.value = "";

  const formData = new FormData(formAccountInfo);
  const accountNumber = formData.get("accountNumber");
  findAccountByAccountNumber(accountNumber)
    .then(response => {
      accountNameInput.value = response.name;
      balanceInput.value = response.balance;
    })
    .catch(error => {
      error.json().then(errBody => {
        accountNumberInput.classList.add("input-error");
        accountNumberInput.nextElementSibling.innerHTML = errBody.detail
      });
    });
});

