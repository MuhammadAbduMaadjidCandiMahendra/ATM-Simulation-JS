export const clearForm = (form, ...excludeInputNames) => {
  for (const inputElement of form.elements) {
    if (inputElement.nodeName === "INPUT") {
      inputElement.classList.remove("input-error");
      if (inputElement.nextElementSibling?.classList.contains("text-error")) {
        inputElement.nextElementSibling.innerHTML = "";
      }

      if (excludeInputNames.includes(inputElement.name)) {
        continue;
      }

      inputElement.value = "";
    }
  }
}