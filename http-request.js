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

/**
 * Find account by account number.
 * Following is an example of success response body
 * <pre>
 * {
 *   "accountNumber": "100001",
 *   "name": "John Doe",
 *   "balance": 5000
 * }
 * </pre>
 *
 * Following is an example of error response body:
 * <pre>
 * {
 *   "detail": "Account not found",
 *   "instance": "/account/10000",
 *   "status": 400,
 *   "title": "Bad Request",
 *   "type": "https://localhost:8080/problems/bad-request"
 * }
 * </pre>
 *
 * @param accountNumber
 * @return {Promise<*>}
 */
export const findAccountByAccountNumber = async (accountNumber) => {
  let response = await fetch(`http://localhost:8080/account/${accountNumber}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw response;
  }

  return await response.json();
}

/**
 * Withdraw money from an account.
 * If successful, the server will return HTTP status 200 with account details body:
 * <pre>
 * {
 *   "accountNumber": "100001",
 *   "name": "John Doe",
 *   "balance": 4950
 * }
 * </pre>
 *
 * Any return status other than 200 will be treated as an error.
 * Following is an example of an error response body:
 * <pre>
 * {
 *   "detail": "Insufficient balance",
 *   "instance": "/transaction/withdraw",
 *   "status": 400,
 *   "title": "Bad Request",
 *   "type": "https://localhost:8080/problems/bad-request"
 * }
 * </pre>
 *
 * @param accountNumber
 * @param amount
 * @return {Promise<any>}
 */
export const withdraw = async (accountNumber, amount) => {
  const response = await fetch(`http://localhost:8080/transaction/withdraw`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      accountNumber,
      amount,
    })
  });

  if (!response.ok) {
    throw response;
  }

  return await response.json();
}