import {createButton, createElement, createForm, createInputGroup} from "./components.js";
import {clearForm} from "../util/form-util.js";
import {hideSuccessInput, showErrorInput, showSuccessInput} from "../util/message-util.js";
import {findAccountByAccountNumber, withdraw} from "../util/http-request.js";
import {ACCOUNT_NUMBER_LOCAL_STORAGE_KEY} from "../util/constant.js";

const createWithdrawForm = () => {
  return createForm({
    id: "withdrawForm",
    action: "/transaction/withdraw",
    method: "POST",
    className: "form-group",
    children: [
      createInputGroup({
        id: "accountNumber",
        type: "number",
        name: "accountNumber",
        labelText: "Account Number",
        inputAttributeMap: new Map([["readonly", "true"]]),
      }),
      createInputGroup({
        id: "balance",
        type: "number",
        name: "balance",
        labelText: "Balance",
        inputAttributeMap: new Map([["readonly", "true"]]),
      }),
      createInputGroup({
        id: "withdrawAmount",
        type: "number",
        name: "withdrawAmount",
        labelText: "Withdraw Amount",
        placeholder: "Type withdraw amount here...",
      }),
      createElement({
        tag: "div",
        className: "input-group",
        children: [
          createElement({tag: "div"}),
          createElement({tag: "span", id: "withdrawSuccess", attributeMap: new Map([["hidden", "true"]])}),
        ]
      }),
      createButton({type: "submit", className: "btn", text: "Withdraw"}),
    ]
  });
}

const onSubmit = async (event, form) => {
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
}

const onLoad = async (form) => {
  hideSuccessInput(document.getElementById("withdrawSuccess"));

  const accountNumber = globalThis.localStorage.getItem(ACCOUNT_NUMBER_LOCAL_STORAGE_KEY);
  if (accountNumber) {
    const account = await findAccountByAccountNumber(accountNumber);
    form.elements["accountNumber"].value = account.accountNumber;
    form.elements["balance"].value = account.balance;
  }
}

const WithdrawContent = () => {
  const form = createWithdrawForm();
  form.addEventListener("submit", (event) => onSubmit(event, form));

  const content = createElement({
    tag: "div",
    id: "withdraw-content",
    children: [form],
  })

  return {
    content,
    onLoad: () => onLoad(form),
  }
}

export default WithdrawContent;
