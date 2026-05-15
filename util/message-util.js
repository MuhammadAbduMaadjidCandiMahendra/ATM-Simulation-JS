export const showErrorInput = (element, errorMessage) => {
  element.classList.add("input-error");
  element.nextElementSibling.classList.add("text-error");
  element.nextElementSibling.innerHTML = errorMessage;
}

export const showSuccessInput = (element, successMessage) => {
  element.hidden = false;
  element.classList.add("success-message");
  element.innerHTML = successMessage;
}

export const hideSuccessInput = (element) => {
  element.hidden = true;
  element.classList.remove("success-message");
}