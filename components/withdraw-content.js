import {createButton, createElement, createForm, createInputGroup} from "./components.js";

const successNotificationSpan = () => {
  return createElement({
    tag: "div",
    className: "input-group",
    children: [
      createElement({tag: "div"}),
      createElement({tag: "span", id: "withdrawSuccess", attributeMap: new Map([["hidden", "true"]])}),
    ]
  });
}

const WithdrawContent = () => {
  const form = createForm({
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
        id: "withdrawAmount",
        type: "number",
        name: "withdrawAmount",
        labelText: "Withdraw Amount",
        className: "form-group",
        placeholder: "Type withdraw amount here...",
      }),
      successNotificationSpan(),
      createButton({type: "submit", className: "btn", text: "Withdraw"}),
    ]
  });

  const content = createElement({
    tag: "div",
    id: "withdraw-content",
    children: [form],
  })

  return {
    content,
    form,
  }
}

export default WithdrawContent;