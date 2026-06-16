import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const VoiceAssistant = () => {
    const [listening, setListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const navigate = useNavigate();
    const { toggleCart } = useCart();

    const recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        ? new ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)()
        : null;

    useEffect(() => {
        if (!recognition) return;

        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onstart = () => {
            setListening(true);
            setTranscript("Listening...");
        };

        recognition.onend = () => {
            setListening(false);
        };

        recognition.onresult = (event: any) => {
            const command = event.results[0][0].transcript.toLowerCase();
            setTranscript(`"${command}"`);
            processCommand(command);
        };

        recognition.onerror = (event: any) => {
            console.error("Speech error", event.error);
            setListening(false);
            setTranscript("Error. Try again.");
        };

    }, []);

    const processCommand = (cmd: string) => {
        if (cmd.includes('menu') || cmd.includes('food')) {
            navigate('/menu');
            speak("Opening Menu");
        } else if (cmd.includes('home') || cmd.includes('main')) {
            navigate('/');
            speak("Going Home");
        } else if (cmd.includes('cart') || cmd.includes('bag')) {
            toggleCart();
            speak("Opening Cart");
        } else if (cmd.includes('build') || cmd.includes('custom')) {
            navigate('/build');
            speak("Opening Meal Builder");
        } else if (cmd.includes('profile') || cmd.includes('account')) {
            navigate('/profile');
            speak("Opening Profile");
        } else {
            speak("Sorry, I didn't get that.");
        }
    };

    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    };

    const toggleListen = () => {
        if (!recognition) {
            alert("Voice API not supported in this browser.");
            return;
        }
        if (listening) {
            recognition.stop();
        } else {
            recognition.start();
        }
    };

    if (!recognition) return null;

    return (
        <div className={`fixed bottom-6 left-6 z-[100] transition-all duration-300 ${listening ? 'scale-110' : 'hover:scale-105'}`}>
            {transcript && (
                <div className="absolute bottom-full left-0 mb-4 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-xl">
                    {transcript}
                </div>
            )}
            <button 
                className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all ${listening ? 'bg-rose-500 animate-pulse' : 'bg-slate-900'}`} 
                onClick={toggleListen}
            >
                {listening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>
        </div>
    );
};

export default VoiceAssistant;
