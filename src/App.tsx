import React, { useEffect } from "react";
import { AiChat, useAsStreamAdapter } from "@nlux/react";
import { ToastContainer, toast } from "react-toastify";
import "@nlux/themes/nova.css";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { send, VertexQuestion } from "./send";
import { user, Assistant as assistant } from "./personas";
import { ReactComponent as Microphone } from './images/microphone.svg';
import { ReactComponent as FAQs } from './images/faqs-icon.svg';
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

  const onFAQCLick = () => {
    toast.info(<div className="faq-list-container">
      {Object.keys(VertexQuestion).map(item => <div
        key={item}
        className="faq-item"
        onClick={() => onQuestionClick(item)}>
        {item}
      </div>)}
    </div>, {
      position: 'bottom-left',
      autoClose: false,
      icon: false,
      toastId: 'faq-list'
    });
  };

  const onQuestionClick = (value: string) => {
    window.nluxSimulator.setTranscriptValue(value);
    toast.dismiss('faq-list');
  };

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

    <button className="faq-container">
      <div className="icon-container" >
        <FAQs onClick={onFAQCLick}
          className="faq-icon"
          title="Frequently asked questions about the types of dementia" />
      </div>
    </button>
    <ToastContainer />
  </>
  );
};

export default App;
