import React from 'react';
import { useState } from 'react';
import { Editor } from "../editor";
import { Navigate } from "react-router-dom";
import 'react-quill/dist/quill.snow.css';

export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);

    async function createNewPost(ev) {
        // ... (remaining code remains unchanged)
    }

    if (redirect) {
        return <Navigate to={'/'} />;
    }

    return (
        <div style={{  flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', marginTop:'150px', }}>
            <form onSubmit={createNewPost}>
                <input type="title" placeholder="Title" value={title} onChange={ev => setTitle(ev.target.value)} className="form-control mb-3" />
                <input type="summary" placeholder="Summary" value={summary} onChange={ev => setSummary(ev.target.value)} className="form-control mb-3" />
                <input type="file" onChange={ev => setFiles(ev.target.files)} className="form-control mb-3" />
                <Editor onChange={setContent} value={content} />
                <button style={{ marginTop: '5px' }} className="btn btn-primary">Create Post</button>
            </form>
        </div>
    );
}
