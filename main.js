let contentTitle = document.getElementById("content-title");
let dashboardContent = document.getElementById("dashboard-content");
let depositContent = document.getElementById("deposit-content");

const showDashboardContent = () => {
  dashboardContent.style.display = "block";
  depositContent.style.display = "none";
  contentTitle.innerHTML = "Dashboard";
}

const showDepositContent = () => {
  dashboardContent.style.display = "none";
  depositContent.style.display = "block";
  contentTitle.innerHTML = "Deposit";
}

document.getElementById("to-deposit").addEventListener("click", (event) => {
  event.preventDefault();
  showDepositContent();
})

document.getElementById("to-dashboard").addEventListener("click", (event) => {
  event.preventDefault();
  showDashboardContent();
})