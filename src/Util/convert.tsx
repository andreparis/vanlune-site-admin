export const convertToBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.file as Blob);
        reader.onload = () => {
            // Make a fileInfo Object
            console.log("Called", reader);
            var baseURL = reader.result;
            console.log(baseURL);
            resolve(baseURL);
          };

        reader.onerror = (err) => {
            reject(err);
        };
    })
}