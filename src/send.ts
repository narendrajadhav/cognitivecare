import { StreamSend, StreamingAdapterObserver } from '@nlux/react';

/* export const FAQList = `How many types of dementia are there?
What are the most common types of dementia?
Are the symptoms all the same for all types of dementia?
How do you get a diagnosis of dementia?
Tips for living with dementia`.split('\n'); */
const url = 'https://cognitive-service-gr4scjs2pq-uc.a.run.app/';

export const VertexQuestion: any = {
    "Please tell me something about dementia": `${url}dementia`,
    "How to diagnose dementia disease?": `${url}diagnose`,
    "How Alzheimer is related to dementia?": `${url}alzheimer`,
    "How to take care of dementia patient?": `${url}care`,
    "Encouraging a person with dementia to eat": `${url}encourage`,
};

// A demo API by NLUX that connects to OpenAI
// and returns a stream of Server-Sent events
const openAIProxy = 'https://gptalks.api.nlux.dev/openai/chat/stream';

// Function to send query to the server and receive a stream of chunks as response
export const send: StreamSend = async (
    prompt: string,
    observer: StreamingAdapterObserver,
) => {
    const body = { prompt };
    const url = VertexQuestion[prompt];
    const response = await (url
        ? fetch(url)
        : fetch(openAIProxy, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        }));

    if (response.status !== 200) {
        observer.error(new Error('Failed to connect to the server'));
        return;
    }

    if (!response.body) {
        return;
    }

    // Read a stream of server-sent events
    // and feed them to the observer as they are being generated
    const reader = response.body.getReader();
    const textDecoder = new TextDecoder();

    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            break;
        }

        const content = textDecoder.decode(value);
        if (content) {
            observer.next(content);
        }
    }

    observer.complete();
};
