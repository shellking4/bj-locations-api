import React, { useRef, useCallback } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { image_upload_handler } from './upload-handler.helper';

export default function TinyMCEComponent(props: any) {
  const editorRef: any = useRef(null);
  const { property, record, onChange } = props
  const value = record.params?.[property.path]

  const handleUpdate = useCallback((newValue: string) => {
    onChange(property.path, newValue)
  }, []);

  return (<>
    <label>
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
      }} />
  </>);
}