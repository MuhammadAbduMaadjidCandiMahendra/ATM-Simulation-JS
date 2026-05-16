import {createButton, createElement, createForm, createInputGroup} from "./components.js";
import {clearForm} from "../util/form-util.js";
import {hideSuccessInput, showErrorInput, showSuccessInput} from "../util/message-util.js";
import {deposit, findAccountByAccountNumber} from "../util/http-request.js";
import {ACCOUNT_NUMBER_LOCAL_STORAGE_KEY} from "../util/constant.js";

const createDepositForm = () => {
  return createForm({
    id: "depositForm",
    method: "POST",
    action: "/transaction/deposit",
    className: "form-group",
    children: [
      createInputGroup({
        id: "accountNumber",
        type: "number",
        name: "accountNumber",
        labelText: "Account Number",
        className: "form-group",
        inputAttributeMap: new Map([["readonly", "true"]]),
      }),
      createInputGroup({
        id: "balance",
        type: "number",
        name: "balance",
        labelText: "Balance",
        className: "form-group",
        inputAttributeMap: new Map([["readonly", "true"]]),
      }),
      createInputGroup({
        id: "depositAmount",
        type: "number",
        name: "depositAmount",
        labelText: "Deposit Amount",
        className: "form-group",
        placeholder: "Type Deposit amount here...",
      }),
      createElement({
        tag: "div",
        className: "input-group",
        children: [
          createElement({tag: "div"}),
          createElement({tag: "span", id: "depositSuccess", attributeMap: new Map([["hidden", "true"]])}),
        ]
      }),
      createButton({type: "submit", className: "btn", text: "Deposit"}),
    ],
  });
}

const onSubmit = async (event, form) => {
  event.preventDefault();
  clearForm(form, "accountNumber", "balance", "depositAmount");
  hideSuccessInput(document.getElementById("depositSuccess"));

  const formData = new FormData(form);
  const accountNumber = formData.get("accountNumber");
  const depositAmount = formData.get("depositAmount");

  if (!accountNumber) {
    showErrorInput(form.elements["accountNumber"], "Account number is required");
    return;
  }

  if (!depositAmount) {
    showErrorInput(form.elements["depositAmount"], "Deposit amount is required");
    return;
  }

  if (depositAmount <= 0) {
    showErrorInput(form.elements["depositAmount"], "Should be greater than 0");
    return;
  }

  try {
    const account = await deposit(accountNumber, depositAmount);
    form.elements["balance"].value = account.balance;
    showSuccessInput(document.getElementById("depositSuccess"), `Deposit ${depositAmount} successful`);
  } catch (error) {
    const errBody = await error.json();
    showErrorInput(form.elements["depositAmount"], errBody.detail);
  }
}

const onLoad = async (form) => {
  hideSuccessInput(document.getElementById("depositSuccess"));

  const accountNumber = globalThis.localStorage.getItem(ACCOUNT_NUMBER_LOCAL_STORAGE_KEY);
  if (accountNumber) {
    const account = await findAccountByAccountNumber(accountNumber);
    form.elements["accountNumber"].value = account.accountNumber;
    form.elements["balance"].value = account.balance;
  }
}

const depositContent = () => {
  const form = createDepositForm();
  form.addEventListener("submit", (event) => onSubmit(event, form));

  const content = createElement({
    tag: "div",
    id: "deposit-content",
    children: [form],
  });

  return {
    content,
    onLoad: () => onLoad(form),
  }
}

export default depositContent;
