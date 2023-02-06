import { ApplicationError } from "@/protocols";

export function notFoundError(): ApplicationError {
  return {
    name: "NotFoundError",
    message: "No result for this search!",
  };
}

export function PaymentRequiredError():ApplicationError{
  return {
    name: "PaymentRequiredError",
    message: "Your payment was not found!"
  }
}
