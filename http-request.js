// BE error response example:
// {
//   "detail": "Account number cannot be empty",
//   "instance": "/login",
//   "status": 400,
//   "title": "Bad Request",
//   "type": "https://localhost:8080/problems/bad-request"
// }

export const login = async (accountNumber) => {
  let response = await fetch("http://localhost:8080/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      accountNumber,
    })
  });

  return await response.json();
}