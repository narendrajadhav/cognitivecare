import React, { useEffect } from "react";
import { AiChat, useAsStreamAdapter } from "@nlux/react";
import { ToastContainer, toast } from "react-toastify";
import "@nlux/themes/nova.css";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { send } from "./send";
import { user, Assistant as assistant } from "./personas";
import { ReactComponent as Microphone } from './images/microphone.svg';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const adapter = useAsStreamAdapter(send, []);
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  const [startListening, setStartListening] = React.useState(false);
  const onMircoPhoneClick = () => {
    window.nluxSimulator.disableSimulator();
    setStartListening(prevState => {
      SpeechRecognition[!prevState ? 'startListening' : 'stopListening']();

      return !prevState;
    });
  };

  useEffect(() => {
    if (!listening && transcript) {
      window.nluxSimulator.setTranscriptValue(transcript);
      setStartListening(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening]);


  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      toast.error("Error Notification!", {
        position: 'top-right',
      });
    }
  }, [browserSupportsSpeechRecognition]);

  return (<>
    <AiChat
      adapter={adapter}
      personaOptions={{
        assistant,
        user,
      }}
      conversationOptions={{ layout: "bubbles" }}
      displayOptions={{ colorScheme: "light", height: '100vh' }}
      composerOptions={{
        placeholder: "How may I help you ?",
      }}
    />
    <button className="btn-container">
      <div className="icon-container">
        <Microphone
          onClick={onMircoPhoneClick}
          className={startListening ? 'microphone-on' : 'microphone-off'}
        />
      </div>
    </button>
    <ToastContainer />
  </>
  );
};

export default App;
