let contentTitle = document.getElementById("content-title");
let dashboardContent = document.getElementById("dashboard-content");
let depositContent = document.getElementById("deposit-content");
let withdrawContent = document.getElementById("withdraw-content");

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

document.getElementById("to-deposit").addEventListener("click", (event) => {
  event.preventDefault();
  showDepositContent();
})

document.getElementById("to-dashboard").addEventListener("click", (event) => {
  event.preventDefault();
  showDashboardContent();
})

document.getElementById("to-withdraw").addEventListener("click", (event) => {
  event.preventDefault();
  showWithdrawContent();
})