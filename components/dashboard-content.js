import {createButton, createElement, createForm, createInputGroup} from "./components.js";

const dashboardContent = () => {
  const form = createForm({
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
        attributeMap: new Map([["readonly", "true"]]),
      })],
  });

  let content = createElement({
    tag: "div",
    id: "dashboard-content",
    children: [form]
  });
  return {
    content,
    form
  };
}

export default dashboardContent;