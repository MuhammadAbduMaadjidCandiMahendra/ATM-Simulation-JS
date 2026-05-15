export const dashboardContent = () => {
  const accountNumber = createInputGroup({
    id: "accountNumber",
    type: "number",
    name: "accountNumber",
    labelText: "Account Number",
    placeholder: "Type account number here...",
  });
  const submitButton = createButton({type: "submit", className: "btn", text: "Find account info"})
  const hr = createElement({tag: "hr"});
  const accountName = createInputGroup({
    id: "accountName",
    type: "text",
    name: "accountName",
    labelText: "Name",
  });
  accountName.readOnly = true;
  const balance = createInputGroup({
    id: "balance",
    type: "number",
    name: "balance",
    labelText: "Balance",
  });
  balance.readOnly = true;

  const form = createForm({
    id: "getAccountInfoForm",
    method: "GET",
    action: "/account",
    className: "form-group",
    children: [accountNumber, submitButton, hr, accountName, balance],
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

const createButton = ({type, className, text}) => {
  let button = createElement({tag: "button", className, children: text});
  button.type = type;
  return button;
}

const createInputGroup = ({id, type, name, labelText, placeholder, inputAttributeMap}) => {
  const input = createInput({id, type, name, placeholder, inputAttributeMap});
  const span = createElement({tag: "span"});
  const innerDiv = createElement({
    tag: "div",
    className: "input-container",
    children: [input, span],
  });

  const label = createElement({tag: "label", children: [labelText]});
  label.setAttribute("for", id);
  return createElement({
    tag: "div",
    className: "input-group",
    children: [label, innerDiv]
  });
}

const createInput = ({id, type, name, placeholder, inputAttributeMap}) => {
  const input = createElement({
    tag: "input",
    id,
    attributeMap: inputAttributeMap,
  });

  input.type = type || "text";
  input.name = name;
  input.placeholder = placeholder || "";
  return input;
}

const createForm = ({id, method, action, className, children}) => {
  const form = createElement({
    tag: "form",
    id,
    className: className?? null,
    children,
  });

  form.method = method;
  form.action = action;
  return form;
}

const createElement = ({tag, id, className, children, attributeMap}) => {
  if (!tag) {
    throw new Error("Tag is required");
  }

  const element = document.createElement(tag);

  if (id !== undefined && id !== null) {
    element.id = id;
  }

  if (className !== undefined && className !== null) {
    element.className = className;
  }

  if (children && children.length > 0) {
    element.append(...children);
  }

  attributeMap?.keys().forEach(key => {
    element.setAttribute(key, attributeMap.get(key));
  });

  return element;
}