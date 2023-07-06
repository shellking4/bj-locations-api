import React, { useCallback } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { UploadHandler } from './upload-handler.helper';


export default function CkEditorComponent(props: any) {

    const { property, record, onChange } = props
    const value = record.params?.[property.path]

    const handleUpdate = useCallback((newValue: string) => {
        onChange(property.path, newValue)
    }, []);

    return (<>
        <label style={{ marginBottom: '10' }}>
            {property.label}
        </label>
        <CKEditor
            editor={ClassicEditor}
            data={value}
            onReady={editor => {
                editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
                    return new UploadHandler(loader);
                };
            }}
            onChange={(event, editor) => {
                const data = editor.getData();
                handleUpdate(data);
            }}
        />
    </>);
}
