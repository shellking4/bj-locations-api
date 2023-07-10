export class UploadHandler {
  loader: any;
  xhr: any;

  constructor(loader: any) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file
      .then((file: any) => new Promise((resolve, reject) => {
        this._initRequest();
        this._initListeners(resolve, reject, file);
        this._sendRequest(file);
      }));
  }

  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  _initRequest() {
    const xhr = this.xhr = new XMLHttpRequest();
    xhr.open('POST', `some url`, true);
    xhr.responseType = 'json';
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Authorization", `Bearer token`);
  }

  _initListeners(resolve: any, reject: any, file: any) {
    const xhr = this.xhr;
    const loader = this.loader;
    const genericErrorText = `Couldn't upload file: ${file.name}.`;
    xhr.addEventListener('error', () => reject(genericErrorText));
    xhr.addEventListener('abort', () => reject());
    xhr.addEventListener('load', () => {
      const response = xhr.response;
      if (!response || response.error) {
        return reject(response && response.error ? response.error.message : genericErrorText);
      }
      resolve({
        default: response.url
      });
    });
    if (xhr.upload) {
      xhr.upload.addEventListener('progress', (evt: any) => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }

  _sendRequest(file: any) {
    const data = new FormData();
    data.append('file', file);
    this.xhr.send(data);
  }
}


export const image_upload_handler = (blobInfo: any, progress: any) => new Promise<string>((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = false;
  xhr.open('POST', 'postAcceptor.php');

  xhr.upload.onprogress = (e) => {
    progress(e.loaded / e.total * 100);
  };

  xhr.onload = () => {
    if (xhr.status === 403) {
      reject({ message: 'HTTP Error: ' + xhr.status, remove: true });
      return;
    }

    if (xhr.status < 200 || xhr.status >= 300) {
      reject('HTTP Error: ' + xhr.status);
      return;
    }

    const json = JSON.parse(xhr.responseText);

    if (!json || typeof json.location != 'string') {
      reject('Invalid JSON: ' + xhr.responseText);
      return;
    }
    resolve(json.location);
  };

  xhr.onerror = () => {
    reject('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
  };
  console.log(blobInfo.filename())
  const formData = new FormData();
  formData.append('file', blobInfo.blob(), blobInfo.filename());

  xhr.send(formData);
});

