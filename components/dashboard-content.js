import {ACCOUNT_NUMBER_LOCAL_STORAGE_KEY} from "../util/constant.js";
import {findAccountByAccountNumber} from "../util/http-request.js";
import {createButton, createElement, createForm, createInputGroup} from "./components.js";
import {showErrorInput} from "../util/message-util.js";
import {clearForm} from "../util/form-util.js";

const createDashboardForm = () => {
  return createForm({
    id: "getAccountInfoForm",
    method: "GET",
    action: "/account",
    className: "form-group",
    children: [
      createInputGroup({
        id: "accountNumber",
        type: "number",
        name: "accountNumber",
        labelText: "Account Number",
        placeholder: "Type account number here...",
      }),
      createButton({type: "submit", className: "btn", text: "Find account info"}),
      createElement({tag: "hr"}),
      createInputGroup({
        id: "accountName",
        type: "text",
        name: "accountName",
        labelText: "Name",
        inputAttributeMap: new Map([["readonly", "true"]]),
      }),
      createInputGroup({
        id: "balance",
        type: "number",
        name: "balance",
        labelText: "Balance",
        inputAttributeMap: new Map([["readonly", "true"]]),
      })],
  });
}

const onSubmit = async (event, form) => {
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
}

const onLoad = async (form) => {
  const accountNumber = globalThis.localStorage.getItem(ACCOUNT_NUMBER_LOCAL_STORAGE_KEY);
  if (accountNumber) {
    const account = await findAccountByAccountNumber(accountNumber);
    form.elements["accountNumber"].value = account.accountNumber;
    form.elements["accountName"].value = account.name;
    form.elements["balance"].value = account.balance;
  }
}

const dashboardContent = () => {
  const form = createDashboardForm();
  form.addEventListener("submit", (event) => onSubmit(event, form));

  const content = createElement({
    tag: "div",
    id: "dashboard-content",
    children: [form]
  });
  return {
    content,
    onLoad: () => onLoad(form),
  };
}

export default dashboardContent;