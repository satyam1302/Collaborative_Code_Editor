// import React, { useEffect, useState, useRef } from 'react';
// import Client from './Client';
// import Editor from './Editor';
// import { initSocket } from '../socket';
// import { useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';
// import { toast } from 'react-hot-toast';
// import axios from 'axios';
// import executeCode from './CodeRun';

// function EditorPage() {
//     const [clients, setClients] = useState([]);
//     const [messages, setMessages] = useState([]);
//     const [language, setLanguage] = useState('5');
//     const [output, setOutput] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [showChat, setShowChat] = useState(false);
//     const socketRef = useRef(null);
//     const messageRef = useRef();
//     const executionInputRef = useRef(null); // Ref for code execution input
//     const location = useLocation();
//     const { roomId } = useParams();
//     const navigate = useNavigate();
//     const codeRef = useRef(null);
//     const [editorHeight, setEditorHeight] = React.useState(0.99); // 70% of editor initially
//     const [outputHeight, setOutputHeight] = React.useState(0.3); // 30% of output initially
//     const [showOutput, setShowOutput] = useState(false);


//     const languages = [
//         { code: '5', name: 'Python' },
//         { code: '4', name: 'Java' },
//         { code: '17', name: 'JavaScript' },
//         { code: '7', name: 'C++' },
//         { code: '6', name: 'C' },
//     ];

//     useEffect(() => {
//         const init = async () => {
//             const handleError = (e) => {
//                 toast.error("Socket Connection Failed");
//                 navigate('/');
//             };

//             socketRef.current = await initSocket();
//             socketRef.current.on('connect_error', handleError);
//             socketRef.current.on('connect_failed', handleError);

//             socketRef.current.emit('join', {
//                 roomId,
//                 username: location.state?.username,
//             });

//             socketRef.current.on('joined', ({ clients, username, socketId }) => {
//                 if (username !== location.state?.username) {
//                     toast.success(`${username} joined the room`);
//                 }
//                 setClients(clients);
//                 socketRef.current.emit('sync-code', { code: codeRef.current, socketId });
//             });

//             socketRef.current.on('userLeft', ({ socketId, username }) => {
//                 if (username) {
//                     toast.success(`${username} left the room`);
//                     setClients((prev) => prev.filter((client) => client.socketId !== socketId));
//                 }
//             });

//             socketRef.current.on('newMessage', (message) => {
//                 if (message.username !== location.state?.username) {
//                     setMessages((prev) => [...prev, message]);
//                 }
//             });
//         };
//         init();

//         return () => {
//             socketRef.current.off('joined');
//             socketRef.current.off('userLeft');
//             socketRef.current.disconnect();
//         };
//     }, [location.state?.username, navigate, roomId]);

//     const handleSendMessage = () => {
//         const message = messageRef.current.value;
//         if (message.trim() === '') return;

//         const newMessage = { username: location.state?.username, message };
//         socketRef.current.emit('newMessage', newMessage);
//         setMessages((prev) => [...prev, newMessage]);

//         messageRef.current.value = '';
//     };

//     const handleRunCode = async () => {
//         const code = codeRef.current;
//         if (!code || !code.trim()) {
//             toast.error("Error: Code cannot be empty");
//             return;
//         }
        
//         // Capture the user-provided input from the new textarea
//         const userInput = executionInputRef.current ? executionInputRef.current.value : "";

//         setLoading(true);
//         const response = await executeCode(code, language, userInput);
//         setLoading(false);

//         if (response.success) {
//             setOutput(response.output);
//         } else {
//             toast.error(`Error: ${response.output}`);
//             setOutput("");
//         }
//     };

//     const handleSaveCode = async () => {
//         const code = codeRef.current;
//         if (!code || !code.trim()) {
//             toast.error("Error: Code cannot be empty");
//             return;
//         }

//         try {
//             // const response = await axios.post('http://localhost:5001/save-code', {
//             const response = await axios.post('https://collaborative-code-editor-backend-keay.onrender.com/save-code', {
//                 roomId,
//                 code,
//             });
//             if (response.status === 200) {
//                 toast.success("Code saved successfully!");
//             }
//         } catch (error) {
//             console.error("Error saving code:", error);
//             toast.error("Failed to save code");
//         }
//     };

//     if (!location.state) return <Navigate to="/" />;

//     const copyRoomId = async () => {
//         try {
//             await navigator.clipboard.writeText(roomId);
//             toast.success("Room Id copied");
//         } catch (e) {
//             toast.error("Unable to copy Id");
//         }
//     };

//     const leaveRoom = () => navigate("/");

// //     return (
// //         <div className="container-fluid vh-100">
// //             <div className="row h-100">
// //                 <div className="col-md-2 bg-dark text-light d-flex flex-column h-100">
// //                     <img src="/images/logo.png" alt="CodeCast" className="img-fluid mx-auto" style={{ maxWidth: '70px', marginTop: '10px' }} />
// //                     <hr />
// //                     <div className="d-flex flex-column">
// //                         {clients.map((client) => (
// //                             <Client key={client.socketId} username={String(client.username)} />
// //                         ))}
// //                     </div>
// //                     <div className="mt-auto">
// //     <hr />
// //     <button onClick={copyRoomId} className="btn btn-success w-100 my-2">Copy Room Id</button>
// //     <button onClick={leaveRoom} className="btn btn-danger w-100 my-2">Leave Room</button>
// //     <button onClick={() => setShowChat(!showChat)} className="btn btn-secondary w-100 my-2">ChatBox</button>
// // </div>

// //                 </div>

// //                 <div className={showChat ? "col-md-7 d-flex flex-column" : "col-md-10 d-flex flex-column"}>
// //                     <div style={{ height: 'calc(80vh - 60px)', overflow: 'auto', padding: '10px', border: '1px solid #333' }}>
// //                         <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => (codeRef.current = code)} />
// //                     </div>
// //                     <div className="d-flex justify-content-between align-items-center mt-2">
// //                         <select
// //                             className="form-select"
// //                             style={{ width: '20%' }}
// //                             value={language}
// //                             onChange={(e) => setLanguage(e.target.value)}
// //                         >
// //                             {languages.map((lang) => (
// //                                 <option key={lang.code} value={lang.code}>
// //                                     {lang.name}
// //                                 </option>
// //                             ))}
// //                         </select>
// //                         <button onClick={handleRunCode} className="btn btn-primary" disabled={loading}>
// //                             {loading ? "Running..." : "Run Code"}
// //                         </button>
// //                         <button onClick={handleSaveCode} className="btn btn-success">Save Code</button>
// //                     </div>

// //                     {/* New Input Field for Code Execution Input */}
// //                     <div className="mt-2">
// //                         <label htmlFor="codeInput" className="form-label">Input (if required):</label>
// //                         <textarea
// //                             id="codeInput"
// //                             ref={executionInputRef}
// //                             placeholder="Enter input for your code here"
// //                             rows="3"
// //                             className="form-control"
// //                         ></textarea>
// //                     </div>

// //                     <div className="mt-2" style={{ height: 'calc(26vh - 60px)', overflowY: 'auto', padding: '10px', border: '1px solid #333', color: 'white' }}>
// //                         <strong>Output:</strong>
// //                         <pre>{output}</pre>
// //                     </div>
// //                 </div>

// //                 {showChat && (
// //                     <div className="col-md-3 d-flex flex-column position-relative" style={{ borderLeft: '1px solid #333' }}>
// //                         <button
// //                             onClick={() => setShowChat(false)}
// //                             style={{
// //                                 position: 'absolute',
// //                                 top: '4px',
// //                                 right: '10px',
// //                                 background: 'none',
// //                                 border: 'none',
// //                                 fontSize: '20px',
// //                                 color: 'white',
// //                                 cursor: 'pointer',
// //                                 zIndex: 10
// //                             }}
// //                         >
// //                             &#x2715;
// //                         </button>
// //                         <div
// //                             className="chat-box overflow-auto"
// //                             style={{
// //                                 flexGrow: 1,
// //                                 color: 'white',
// //                                 paddingTop: '40px',
// //                                 paddingRight: '10px',
// //                                 paddingLeft: '10px'
// //                             }}
// //                         >
// //                             {messages.map((msg, index) => (
// //                                 <div
// //                                     key={index}
// //                                     className={`d-flex ${msg.username === location.state?.username ? 'justify-content-end' : 'justify-content-start'}`}
// //                                 >
// //                                     <div
// //                                         className={`message-box p-2 mb-2 ${msg.username === location.state?.username ? 'bg-primary text-light' : 'bg-secondary text-light'}`}
// //                                         style={{ maxWidth: '70%', borderRadius: '10px', paddingTop: '20px' }}
// //                                     >
// //                                         {msg.username !== location.state?.username && <strong>{msg.username}</strong>}
// //                                         <div>{msg.message}</div>
// //                                     </div>
// //                                 </div>
// //                             ))}
// //                         </div>
// //                         <div className="chat-input d-flex">
// //                             <input
// //                                 type="text"
// //                                 ref={messageRef}
// //                                 className="form-control"
// //                                 placeholder="Type a message"
// //                                 onKeyDown={(e) => {
// //                                     if (e.key === 'Enter') {
// //                                         handleSendMessage();
// //                                     }
// //                                 }}
// //                             />
// //                             <button onClick={handleSendMessage} className="btn btn-primary">Send</button>
// //                         </div>
// //                     </div>
// //                 )}
// //             </div>
// //         </div>
// //     );
// // }

// // return (
// //  <div className="container-fluid vh-100">
// //   <div className="row h-100">
// //     {/* Sidebar */}
// //     <div className="col-md-2 bg-dark text-light d-flex flex-column h-100">
// //       <img src="/images/logo.png" alt="CodeCast" className="img-fluid mx-auto mt-2" style={{ maxWidth: '70px' }} />
// //       <hr />
// //       <div className="d-flex flex-column flex-grow-1 overflow-auto">
// //         {clients.map((client) => (
// //           <Client key={client.socketId} username={String(client.username)} />
// //         ))}
// //       </div>
// //       <div className="mt-auto">
// //         <hr />
// //         <button onClick={copyRoomId} className="btn btn-success w-100 my-2">Copy Room Id</button>
// //         <button onClick={leaveRoom} className="btn btn-danger w-100 my-2">Leave Room</button>
// //         <button onClick={() => setShowChat(!showChat)} className="btn btn-secondary w-100 my-2">ChatBox</button>
// //       </div>
// //     </div>

// //     {/* Editor + Input + Output with Sliding Divider */}
// //     <div className={showChat ? "col-md-7 d-flex flex-column h-100" : "col-md-10 d-flex flex-column h-100"}>

// //       {/* Editor */}
// //       <div style={{ flex: editorHeight, overflow: 'auto', padding: '10px', border: '1px solid #333' }}>
// //         <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => (codeRef.current = code)} />
// //       </div>

// //       {/* Divider */}
// //       <div
// //         style={{ height: '5px', cursor: 'row-resize', background: '#555' }}
// //         onMouseDown={(e) => {
// //           e.preventDefault();
// //           const startY = e.clientY;
// //           const startEditorHeight = editorHeight;
// //           const startOutputHeight = outputHeight;

// //           const onMouseMove = (moveEvent) => {
// //             const dy = moveEvent.clientY - startY;
// //             const containerHeight = document.querySelector('.col-md-7').clientHeight;
// //             const newEditorHeight = ((startEditorHeight * containerHeight + dy) / containerHeight);
// //             const newOutputHeight = ((startOutputHeight * containerHeight - dy) / containerHeight);
// //             if (newEditorHeight > 0.1 && newOutputHeight > 0.1) {
// //               setEditorHeight(newEditorHeight);
// //               setOutputHeight(newOutputHeight);
// //             }
// //           };

// //           const onMouseUp = () => {
// //             document.removeEventListener('mousemove', onMouseMove);
// //             document.removeEventListener('mouseup', onMouseUp);
// //           };

// //           document.addEventListener('mousemove', onMouseMove);
// //           document.addEventListener('mouseup', onMouseUp);
// //         }}
// //       ></div>

// //        {/* Run + Save + Language */}
// //       <div className="d-flex justify-content-between align-items-center mt-2">
// //         <select
// //           className="form-select"
// //           style={{ width: '20%' }}
// //           value={language}
// //           onChange={(e) => setLanguage(e.target.value)}
// //         >
// //           {languages.map((lang) => (
// //             <option key={lang.code} value={lang.code}>{lang.name}</option>
// //           ))}
// //         </select>
// //         <button onClick={handleRunCode} className="btn btn-primary" disabled={loading}>
// //           {loading ? "Running..." : "Run Code"}
// //         </button>
// //         <button onClick={handleSaveCode} className="btn btn-success">Save Code</button>
// //       </div>
// //       {/* Input + Output */}
// //       <div style={{ flex: outputHeight, display: 'flex', flexDirection: 'column', padding: '5px' }}>
// //         {/* Input */}
// //         <div>
// //           <label htmlFor="codeInput" className="form-label text-white">Input (if required):</label>
// //           <textarea
// //             id="codeInput"
// //             ref={executionInputRef}
// //             placeholder="Enter input for your code here"
// //             rows="3"
// //             className="form-control"
// //           ></textarea>
// //         </div>

// //         {/* Output */}
// //         <div style={{ flex: 1, overflowY: 'auto', marginTop: '5px', padding: '10px', border: '1px solid #333', color: 'white', backgroundColor: '#1e1e1e' }}>
// //           <strong>Output:</strong>
// //           <pre>{output}</pre>
// //         </div>
// //       </div>

// //       {/* Run + Save + Language
// //       <div className="d-flex justify-content-between align-items-center mt-2">
// //         <select
// //           className="form-select"
// //           style={{ width: '20%' }}
// //           value={language}
// //           onChange={(e) => setLanguage(e.target.value)}
// //         >
// //           {languages.map((lang) => (
// //             <option key={lang.code} value={lang.code}>{lang.name}</option>
// //           ))}
// //         </select>
// //         <button onClick={handleRunCode} className="btn btn-primary" disabled={loading}>
// //           {loading ? "Running..." : "Run Code"}
// //         </button>
// //         <button onClick={handleSaveCode} className="btn btn-success">Save Code</button>
// //       </div> */}
// //     </div>

// //     {/* Chat */}
// //     {showChat && (
// //       <div className="col-md-3 d-flex flex-column position-relative h-100" style={{ borderLeft: '1px solid #333' }}>
// //         <button
// //           onClick={() => setShowChat(false)}
// //           style={{
// //             position: 'absolute',
// //             top: '4px',
// //             right: '10px',
// //             background: 'none',
// //             border: 'none',
// //             fontSize: '20px',
// //             color: 'white',
// //             cursor: 'pointer',
// //             zIndex: 10
// //           }}
// //         >
// //           &#x2715;
// //         </button>
// //         <div className="chat-box overflow-auto flex-grow-1 pt-5 px-2 text-white">
// //           {messages.map((msg, index) => (
// //             <div
// //               key={index}
// //               className={`d-flex ${msg.username === location.state?.username ? 'justify-content-end' : 'justify-content-start'}`}
// //             >
// //               <div
// //                 className={`message-box p-2 mb-2 ${msg.username === location.state?.username ? 'bg-primary text-light' : 'bg-secondary text-light'}`}
// //                 style={{ maxWidth: '70%', borderRadius: '10px', paddingTop: '20px' }}
// //               >
// //                 {msg.username !== location.state?.username && <strong>{msg.username}</strong>}
// //                 <div>{msg.message}</div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //         <div className="chat-input d-flex mt-2">
// //           <input
// //             type="text"
// //             ref={messageRef}
// //             className="form-control"
// //             placeholder="Type a message"
// //             onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
// //           />
// //           <button onClick={handleSendMessage} className="btn btn-primary">Send</button>
// //         </div>
// //       </div>
// //     )}
// //   </div>
// // </div>

// // );


// // return (
// //  <div className="container-fluid vh-100">
// //   <div className="row h-100">
// //     {/* Sidebar */}
// //     <div className="col-md-2 bg-dark text-light d-flex flex-column h-100">
// //       <img src="/images/logo.png" alt="CodeCast" className="img-fluid mx-auto mt-2" style={{ maxWidth: '70px' }} />
// //       <hr />
// //       <div className="d-flex flex-column flex-grow-1 overflow-auto">
// //         {clients.map((client) => (
// //           <Client key={client.socketId} username={String(client.username)} />
// //         ))}
// //       </div>
// //       <div className="mt-auto">
// //         <hr />
// //         <button onClick={copyRoomId} className="btn btn-success w-100 my-2">Copy Room Id</button>
// //         <button onClick={leaveRoom} className="btn btn-danger w-100 my-2">Leave Room</button>
// //         <button onClick={() => setShowChat(!showChat)} className="btn btn-secondary w-100 my-2">ChatBox</button>
// //       </div>
// //     </div>

// //     {/* Editor + Input + Output with Sliding Divider */}
// //     <div className={showChat ? "col-md-7 d-flex flex-column h-100" : "col-md-10 d-flex flex-column h-100"}>

// //       {/* Editor */}
// //       <div style={{ flex: editorHeight, overflow: 'auto', padding: '10px', border: '1px solid #333' }}>
// //         <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => (codeRef.current = code)} />
// //       </div>

// //       {/* Divider */}
// //       <div
// //         style={{ height: '5px', cursor: 'row-resize', background: '#555' }}
// //         onMouseDown={(e) => {
// //           e.preventDefault();
// //           const startY = e.clientY;
// //           const startEditorHeight = editorHeight;
// //           const startOutputHeight = outputHeight;

// //           const onMouseMove = (moveEvent) => {
// //             const dy = moveEvent.clientY - startY;
// //             const containerHeight = document.querySelector('.col-md-7').clientHeight;
// //             const newEditorHeight = ((startEditorHeight * containerHeight + dy) / containerHeight);
// //             const newOutputHeight = ((startOutputHeight * containerHeight - dy) / containerHeight);
// //             if (newEditorHeight > 0.1 && newOutputHeight > 0.1) {
// //               setEditorHeight(newEditorHeight);
// //               setOutputHeight(newOutputHeight);
// //             }
// //           };

// //           const onMouseUp = () => {
// //             document.removeEventListener('mousemove', onMouseMove);
// //             document.removeEventListener('mouseup', onMouseUp);
// //           };

// //           document.addEventListener('mousemove', onMouseMove);
// //           document.addEventListener('mouseup', onMouseUp);
// //         }}
// //       ></div>

// //       {/* Run + Save + Language */}
// //       <div className="d-flex align-items-center justify-content-between mt-2">
// //         {/* Left group: Language + Run Code */}
// //         <div className="d-flex align-items-center" style={{ gap: "10px" }}>
// //           <select
// //             className="form-select"
// //             style={{ width: '150px' }}
// //             value={language}
// //             onChange={(e) => setLanguage(e.target.value)}
// //           >
// //             {languages.map((lang) => (
// //               <option key={lang.code} value={lang.code}>{lang.name}</option>
// //             ))}
// //           </select>
// //           <button onClick={handleRunCode} className="btn btn-primary" disabled={loading}>
// //             {loading ? "Running..." : "Run Code"}
// //           </button>
// //         </div>

// //         {/* Right: Save Code */}
// //         <button onClick={handleSaveCode} className="btn btn-success">Save Code</button>
// //       </div>

// //       {/* Input + Output */}
// //       <div style={{ flex: outputHeight, display: 'flex', flexDirection: 'column', padding: '5px' }}>
// //         {/* Input */}
// //         <div>
// //           <label htmlFor="codeInput" className="form-label text-white">Input (if required):</label>
// //           <textarea
// //             id="codeInput"
// //             ref={executionInputRef}
// //             placeholder="Enter input for your code here"
// //             rows="3"
// //             className="form-control"
// //           ></textarea>
// //         </div>

// //         {/* Output */}
// //         <div style={{ flex: 1, overflowY: 'auto', marginTop: '5px', padding: '10px', border: '1px solid #333', color: 'white', backgroundColor: '#1e1e1e' }}>
// //           <strong>Output:</strong>
// //           <pre>{output}</pre>
// //         </div>
// //       </div>
// //     </div>

// //     {/* Chat */}
// //     {showChat && (
// //       <div className="col-md-3 d-flex flex-column position-relative h-100" style={{ borderLeft: '1px solid #333' }}>
// //         <button
// //           onClick={() => setShowChat(false)}
// //           style={{
// //             position: 'absolute',
// //             top: '4px',
// //             right: '10px',
// //             background: 'none',
// //             border: 'none',
// //             fontSize: '20px',
// //             color: 'white',
// //             cursor: 'pointer',
// //             zIndex: 10
// //           }}
// //         >
// //           &#x2715;
// //         </button>
// //         <div className="chat-box overflow-auto flex-grow-1 pt-5 px-2 text-white">
// //           {messages.map((msg, index) => (
// //             <div
// //               key={index}
// //               className={`d-flex ${msg.username === location.state?.username ? 'justify-content-end' : 'justify-content-start'}`}
// //             >
// //               <div
// //                 className={`message-box p-2 mb-2 ${msg.username === location.state?.username ? 'bg-primary text-light' : 'bg-secondary text-light'}`}
// //                 style={{ maxWidth: '70%', borderRadius: '10px', paddingTop: '20px' }}
// //               >
// //                 {msg.username !== location.state?.username && <strong>{msg.username}</strong>}
// //                 <div>{msg.message}</div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //         <div className="chat-input d-flex mt-2">
// //           <input
// //             type="text"
// //             ref={messageRef}
// //             className="form-control"
// //             placeholder="Type a message"
// //             onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
// //           />
// //           <button onClick={handleSendMessage} className="btn btn-primary">Send</button>
// //         </div>
// //       </div>
// //     )}
// //   </div>
// // </div>
// // );


// return (
//  <div className="container-fluid vh-100">
//   <div className="row h-100">
//     {/* Sidebar */}
//     <div className="col-md-2 bg-dark text-light d-flex flex-column h-100">
//       <img src="/images/logo.png" alt="CodeCast" className="img-fluid mx-auto mt-2" style={{ maxWidth: '70px' }} />
//       <hr />
//       <div className="d-flex flex-column flex-grow-1 overflow-auto">
//         {clients.map((client) => (
//           <Client key={client.socketId} username={String(client.username)} />
//         ))}
//       </div>
//       <div className="mt-auto">
//         <hr />
//         <button onClick={copyRoomId} className="btn btn-success w-100 my-2">Copy Room Id</button>
//         <button onClick={leaveRoom} className="btn btn-danger w-100 my-2">Leave Room</button>
//         <button onClick={() => setShowChat(!showChat)} className="btn btn-secondary w-100 my-2">ChatBox</button>
//       </div>
//     </div>

//     {/* Editor + Input + Output */}
//     <div className={showChat ? "col-md-7 d-flex flex-column h-100" : "col-md-10 d-flex flex-column h-100"}>

//       {/* Editor */}
//       <div style={{ flex: editorHeight, overflow: 'auto', padding: '10px', border: '1px solid #333' }}>
//         <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => (codeRef.current = code)} />
//       </div>

//       {/* Divider */}
//       <div
//         style={{ height: '5px', cursor: 'row-resize', background: '#555' }}
//         onMouseDown={(e) => {
//           e.preventDefault();
//           const startY = e.clientY;
//           const startEditorHeight = editorHeight;
//           const startOutputHeight = outputHeight;

//           const onMouseMove = (moveEvent) => {
//             const dy = moveEvent.clientY - startY;
//             const containerHeight = document.querySelector('.col-md-7, .col-md-10').clientHeight;
//             const newEditorHeight = ((startEditorHeight * containerHeight + dy) / containerHeight);
//             const newOutputHeight = ((startOutputHeight * containerHeight - dy) / containerHeight);
//             if (newEditorHeight > 0.1 && newOutputHeight > 0.1) {
//               setEditorHeight(newEditorHeight);
//               setOutputHeight(newOutputHeight);
//             }
//           };

//           const onMouseUp = () => {
//             document.removeEventListener('mousemove', onMouseMove);
//             document.removeEventListener('mouseup', onMouseUp);
//           };

//           document.addEventListener('mousemove', onMouseMove);
//           document.addEventListener('mouseup', onMouseUp);
//         }}
//       ></div>

//       {/* Run + Save + Language */}
//       <div className="d-flex align-items-center justify-content-between mt-2">
//         {/* Left group: Language + Run Code */}
//         <div className="d-flex align-items-center" style={{ gap: "10px" }}>
//           <select
//             className="form-select"
//             style={{ width: '150px' }}
//             value={language}
//             onChange={(e) => setLanguage(e.target.value)}
//           >
//             {languages.map((lang) => (
//               <option key={lang.code} value={lang.code}>{lang.name}</option>
//             ))}
//           </select>
//           <button 
//             onClick={() => {
//               handleRunCode();
//               setShowOutput(true); // auto open Output when running
//             }} 
//             className="btn btn-primary" 
//             disabled={loading}
//           >
//             {loading ? "Running..." : "Run Code"}
//           </button>
//         </div>

//         {/* Right: Save Code */}
//         <button onClick={handleSaveCode} className="btn btn-success">Save Code</button>
//       </div>

//       {/* Input */}
//       <div style={{ marginTop: '5px' }}>
//         <label htmlFor="codeInput" className="form-label text-white">Input (if required):</label>
//         <textarea
//           id="codeInput"
//           ref={executionInputRef}
//           placeholder="Enter input for your code here"
//           rows="3"
//           className="form-control"
//         ></textarea>
//       </div>

//       {/* Output (Collapsible) */}
//       {showOutput && (
//         <div 
//           style={{ flex: outputHeight, display: 'flex', flexDirection: 'column', marginTop: '5px', padding: '10px', border: '1px solid #333', color: 'white', backgroundColor: '#1e1e1e' }}
//         >
//           <div className="d-flex justify-content-between align-items-center">
//             <strong>Output:</strong>
//             <button 
//               onClick={() => setShowOutput(false)} 
//               className="btn btn-sm btn-outline-light"
//             >
//               {/* Minimize */} ▼
//             </button>
//           </div>
//           <pre>{output}</pre>
//         </div>
//       )}

//       {/* Toggle Output Button (like VS Code terminal) */}
//       <div className="d-flex justify-content-start mt-2">
//         <button 
//           onClick={() => setShowOutput(!showOutput)} 
//           className="btn btn-dark btn-sm"
//         >
//           {showOutput ? "TERMINAL" : "TERMINAL"}
//         </button>
//       </div>
//     </div>

//     {/* Chat */}
//     {showChat && (
//       <div className="col-md-3 d-flex flex-column position-relative h-100" style={{ borderLeft: '1px solid #333' }}>
//         <button
//           onClick={() => setShowChat(false)}
//           style={{
//             position: 'absolute',
//             top: '4px',
//             right: '10px',
//             background: 'none',
//             border: 'none',
//             fontSize: '20px',
//             color: 'white',
//             cursor: 'pointer',
//             zIndex: 10
//           }}
//         >
//           &#x2715;
//         </button>
//         <div className="chat-box overflow-auto flex-grow-1 pt-5 px-2 text-white">
//           {messages.map((msg, index) => (
//             <div
//               key={index}
//               className={`d-flex ${msg.username === location.state?.username ? 'justify-content-end' : 'justify-content-start'}`}
//             >
//               <div
//                 className={`message-box p-2 mb-2 ${msg.username === location.state?.username ? 'bg-primary text-light' : 'bg-secondary text-light'}`}
//                 style={{ maxWidth: '70%', borderRadius: '10px', paddingTop: '20px' }}
//               >
//                 {msg.username !== location.state?.username && <strong>{msg.username}</strong>}
//                 <div>{msg.message}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="chat-input d-flex mt-2">
//           <input
//             type="text"
//             ref={messageRef}
//             className="form-control"
//             placeholder="Type a message"
//             onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
//           />
//           <button onClick={handleSendMessage} className="btn btn-primary">Send</button>
//         </div>
//       </div>
//     )}
//   </div>
// </div>
// );    
// }

// export default EditorPage;






import React, { useEffect, useState, useRef } from 'react';
import Client from './Client';
import Editor from './Editor';
import { initSocket } from '../socket';
import { useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import executeCode from './CodeRun';

function EditorPage() {
  const [clients, setClients] = useState([]);
  const [messages, setMessages] = useState([]);
  const [language, setLanguage] = useState('5');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const [editorHeight, setEditorHeight] = useState(0.99);
  const [outputHeight, setOutputHeight] = useState(0.3);

  const [unreadCount, setUnreadCount] = useState(0);      // NEW
  const showChatRef = useRef(false);                      // NEW

  const socketRef = useRef(null);
  const messageRef = useRef();
  const executionInputRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const codeRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const handleError = () => {
        toast.error("Socket Connection Failed");
        navigate('/');
      };

      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', handleError);
      socketRef.current.on('connect_failed', handleError);

      socketRef.current.emit('join', {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on('joined', ({ clients, username, socketId }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined the room`);
        }
        setClients(clients);
        socketRef.current.emit('sync-code', { code: codeRef.current, socketId });
      });

      socketRef.current.on('userLeft', ({ socketId, username }) => {
        if (username) {
          toast.success(`${username} left the room`);
          setClients((prev) => prev.filter((client) => client.socketId !== socketId));
        }
      });

      // NEW: unread badge logic in newMessage
      socketRef.current.on('newMessage', (message) => {
        if (message.username !== location.state?.username) {
          setMessages((prev) => [...prev, message]);
          if (!showChatRef.current) {
            setUnreadCount((c) => c + 1);
          }
        }
      });
    };
    init();

    return () => {
      if (!socketRef.current) return;
      socketRef.current.off('joined');
      socketRef.current.off('userLeft');
      socketRef.current.off('newMessage'); // NEW cleanup
      socketRef.current.disconnect();
    };
  }, [location.state?.username, navigate, roomId]);

  // keep ref in sync
  useEffect(() => {
    showChatRef.current = showChat;
  }, [showChat]);

  const handleSendMessage = () => {
    const message = messageRef.current.value;
    if (message.trim() === '') return;
    const newMessage = { username: location.state?.username, message };
    socketRef.current.emit('newMessage', newMessage);
    setMessages((prev) => [...prev, newMessage]);
    messageRef.current.value = '';
  };

  const handleRunCode = async () => {
    const code = codeRef.current;
    if (!code || !code.trim()) {
      toast.error("Error: Code cannot be empty");
      return;
    }
    const userInput = executionInputRef.current ? executionInputRef.current.value : "";
    setLoading(true);
    const response = await executeCode(code, language, userInput);
    setLoading(false);
    if (response.success) {
      setOutput(response.output);
      setShowOutput(true); // auto-open terminal on success
    } else {
      toast.error(`Error: ${response.output}`);
      setOutput("");
      setShowOutput(true); // also open to show error
    }
  };

  const handleSaveCode = async () => {
    const code = codeRef.current;
    if (!code || !code.trim()) {
      toast.error("Error: Code cannot be empty");
      return;
    }
    try {
      const response = await axios.post('http://localhost:5001/save-code', {
        roomId,
        code,
      });
      if (response.status === 200) toast.success("Code saved successfully!");
    } catch (error) {
      console.error("Error saving code:", error);
      toast.error("Failed to save code");
    }
  };

  if (!location.state) return <Navigate to="/" />;

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room Id copied");
    } catch {
      toast.error("Unable to copy Id");
    }
  };

  const leaveRoom = () => navigate("/");

  // NEW: toggle that also resets unread when opening
  const toggleChat = () => {
    setShowChat(prev => {
      const next = !prev;
      if (next) setUnreadCount(0);
      return next;
    });
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Sidebar */}
        <div className="col-md-2 bg-dark text-light d-flex flex-column h-100">
          <img src="/images/logo.png" alt="CodeCast" className="img-fluid mx-auto mt-2" style={{ maxWidth: '70px' }} />
          <hr />
          <div className="d-flex flex-column flex-grow-1 overflow-auto">
            {clients.map((client) => (
              <Client key={client.socketId} username={String(client.username)} />
            ))}
          </div>
          <div className="mt-auto">
            <hr />
            <button onClick={copyRoomId} className="btn btn-success w-100 my-2">Copy Room Id</button>
            <button onClick={leaveRoom} className="btn btn-danger w-100 my-2">Leave Room</button>

            {/* UPDATED Chat button with unread badge */}
            <button onClick={toggleChat} className="btn btn-secondary w-100 my-2 position-relative">
              ChatBox
              {unreadCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Editor + Input + Output */}
        <div className={showChat ? "col-md-7 d-flex flex-column h-100" : "col-md-10 d-flex flex-column h-100"}>

          {/* Editor */}
          <div style={{ flex: editorHeight, overflow: 'auto', padding: '10px', border: '1px solid #333' }}>
            <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => (codeRef.current = code)} />
          </div>

          {/* Divider */}
          <div
            style={{ height: '5px', cursor: 'row-resize', background: '#555' }}
            onMouseDown={(e) => {
              e.preventDefault();
              const startY = e.clientY;
              const startEditorHeight = editorHeight;
              const startOutputHeight = outputHeight;

              const onMouseMove = (moveEvent) => {
                const dy = moveEvent.clientY - startY;
                const containerEl = document.querySelector('.col-md-7, .col-md-10');
                if (!containerEl) return;
                const containerHeight = containerEl.clientHeight;
                const newEditorHeight = ((startEditorHeight * containerHeight + dy) / containerHeight);
                const newOutputHeight = ((startOutputHeight * containerHeight - dy) / containerHeight);
                if (newEditorHeight > 0.1 && newOutputHeight > 0.1) {
                  setEditorHeight(newEditorHeight);
                  setOutputHeight(newOutputHeight);
                }
              };

              const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
              };

              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('mouseup', onMouseUp);
            }}
          ></div>

          {/* Run + Save + Language */}
          <div className="d-flex align-items-center justify-content-between mt-2">
            {/* Left group: Language + Run Code */}
            <div className="d-flex align-items-center" style={{ gap: "10px" }}>
              <select
                className="form-select"
                style={{ width: '150px' }}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {['5','4','17','7','6'].map(code => {
                  const map = { '5':'Python', '4':'Java', '17':'JavaScript', '7':'C++', '6':'C' };
                  return <option key={code} value={code}>{map[code]}</option>;
                })}
              </select>
              <button
                onClick={handleRunCode}
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Running..." : "Run Code"}
              </button>
            </div>

            {/* Right: Save Code */}
            <button onClick={handleSaveCode} className="btn btn-success">Save Code</button>
          </div>

          {/* Input */}
          <div style={{ marginTop: '5px' }}>
            <label htmlFor="codeInput" className="form-label text-white">Input (if required):</label>
            <textarea
              id="codeInput"
              ref={executionInputRef}
              placeholder="Enter input for your code here"
              rows="3"
              className="form-control"
            ></textarea>
          </div>

          {/* Output (Collapsible) */}
          {showOutput && (
            <div
              style={{ flex: outputHeight, display: 'flex', flexDirection: 'column', marginTop: '5px', padding: '10px', border: '1px solid #333', color: 'white', backgroundColor: '#1e1e1e' }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <strong>Output:</strong>
                <button
                  onClick={() => setShowOutput(false)}
                  className="btn btn-sm btn-outline-light"
                >
                  ▼
                </button>
              </div>
              <pre>{output}</pre>
            </div>
          )}

          {/* Toggle Output Button (left-aligned) */}
          <div className="d-flex justify-content-start mt-2">
            <button
              onClick={() => setShowOutput(!showOutput)}
              className="btn btn-dark btn-sm"
            >
              TERMINAL
            </button>
          </div>
        </div>

        {/* Chat */}
        {showChat && (
          <div className="col-md-3 d-flex flex-column position-relative h-100" style={{ borderLeft: '1px solid #333' }}>
            <button
              onClick={() => setShowChat(false)}
              style={{
                position: 'absolute',
                top: '4px',
                right: '10px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                color: 'white',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              &#x2715;
            </button>
            <div className="chat-box overflow-auto flex-grow-1 pt-5 px-2 text-white">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`d-flex ${msg.username === location.state?.username ? 'justify-content-end' : 'justify-content-start'}`}
                >
                  <div
                    className={`message-box p-2 mb-2 ${msg.username === location.state?.username ? 'bg-primary text-light' : 'bg-secondary text-light'}`}
                    style={{ maxWidth: '70%', borderRadius: '10px', paddingTop: '20px' }}
                  >
                    {msg.username !== location.state?.username && <strong>{msg.username}</strong>}
                    <div>{msg.message}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="chat-input d-flex mt-2">
              <input
                type="text"
                ref={messageRef}
                className="form-control"
                placeholder="Type a message"
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage} className="btn btn-primary">Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditorPage;
