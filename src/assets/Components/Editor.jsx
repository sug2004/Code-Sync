import Codemirror from 'codemirror';
import { useEffect, useRef } from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/python/python'; // Import Python mode
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../../Action.js';




const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) {
      // Initialize CodeMirror
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById('realtimeEditor'),
        {
          mode: { name: 'javascript', json: true },
          theme: 'dracula',
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }

      );
      editorRef.current.setSize(null, '100vh');

      // Event listener for changes in the editor
      editorRef.current.on('change', (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);

        if (origin !== 'setValue' && socketRef.current) {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomId, code });
        }
      });
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.toTextArea(); // Cleanup CodeMirror instance
        editorRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs only once

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null && editorRef.current) {
          if (editorRef.current.getValue() !== code) {
            editorRef.current.setValue(code);
          }
        }
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off(ACTIONS.CODE_CHANGE);
      }
    };
  }, [socketRef.current]); // Ensure socketRef.current is updated when it changes

  return (
    <textarea
      id="realtimeEditor"
      className="text-[20px] leading-[1.6] pt-5"
    ></textarea>
  );
};

export default Editor;
