export const validEmailRegex =
  /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// eslint-disable-next-line
export const validPhoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

export const getErrorMessageResponse = (response: any) => {
  let errorMessage = '';
  if (typeof response?.errors === 'object') {
    for (const [, value] of Object.entries(response?.errors)) {
      if (typeof value === 'string') {
        errorMessage = value;
      }
      break;
    }
  }
  if (typeof response?.errors === 'string') {
    errorMessage = response.errors;
  }
  return errorMessage;
};
