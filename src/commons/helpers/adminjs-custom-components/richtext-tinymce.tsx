import React, { useRef, useCallback } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import { image_upload_handler } from './upload-handler.helper';

export default function TinyMCEComponent(props: any) {
  const editorRef: any = useRef(null);
  const { property, record, onChange } = props
  const value = record.params?.[property.path]

  const handleUpdate = useCallback((newValue: string) => {
    props.onChange(property.path, newValue)
  }, []);

  return (<>
    <label style={{ marginBottom: '10' }}>
      {property.label}
    </label>
    <Editor
      apiKey='y17gxjuzy24zjbkth51mc3zs7xuvsh3rtwll025rrz9lt09o'
      onInit={(evt, editor) => {
        editorRef.current = editor
      }}
      onEditorChange={handleUpdate}
      value={value}
      init={{
        height: 500,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'emoticons',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'preview',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'fullscreen',
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | emoticons ' +
          'removeformat | help | image | media | fullscreen | preview |',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        automatic_uploads: true,
        images_upload_handler: image_upload_handler,
        file_picker_types: 'file image media',
        file_picker_callback: (callback, value, meta) => {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', '*/*');

          input.addEventListener('change', (e: any) => {
            const file = e.target.files[0];

            const reader: any = new FileReader();
            reader.addEventListener('load', () => {
              const id = 'blobid' + (new Date()).getTime();
              const blobCache = editorRef.current.editorUpload.blobCache;
              const base64 = reader?.result?.split(',')[1];
              const blobInfo = blobCache.create(id, file, base64);
              blobCache.add(blobInfo);
              callback(blobInfo.blobUri(), { title: file.name });
            });
            reader.readAsDataURL(file);
          });
          input.click();
        },
      }} />
  </>);
}