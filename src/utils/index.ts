export const validEmailRegex =
  /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// eslint-disable-next-line
export const validPhoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

export const validDateyyyyMMddRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/

export const validNameRegex = /^[A-Za-z0-9 ]+$/
export const getErrorMessageResponse = (response: any) => {
  let errorMessage = '';
  if (typeof response?.errors === 'object') {
    for (const [key, value] of Object.entries(response?.errors)) {
      if (typeof value === 'string') {
        errorMessage = `${key}: ${value}`;
      }
      break;
    }
  }
  if (typeof response?.errors === 'string') {
    errorMessage = response.errors;
  }
  return errorMessage;
};

export const fileToBase64String = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    let baseURL = '';
    // Make new FileReader
    let reader = new FileReader();

    // Convert the file to base64 text
    reader.readAsDataURL(file);

    // on reader load somthing...
    reader.onload = () => {
      // Make a fileInfo Object
      baseURL = reader.result ? reader.result.toString() : '';
      resolve(baseURL);
    };
  });
};
export const base64ToArrayBuffer = (base64String: string): ArrayBuffer => {
  return Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0));
};
export const base64toBlob = (base64Data: string, contentType = '', sliceSize = 512): Blob => {
  const byteCharacters = window.atob(base64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};
