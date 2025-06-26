import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ContinuousVoiceService from '../../services/continuousVoiceService';

const VoiceTestPage = () => {
  const [tests, setTests] = useState({
    browserSupport: null,
    microphoneAccess: null,
    speechRecognition: null,
    wakeWordDetection: null,
    commandProcessing: null
  });
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [logs, setLogs] = useState([]);
  const voiceServiceRef = useRef(null);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, type, timestamp }]);
    console.log(`[${timestamp}] ${message}`);
  };

  // Test 1: Browser Support
  const testBrowserSupport = () => {
    addLog('Testing browser support...');
    const isSupported = ContinuousVoiceService.isSupported();
    const hasWebkitSpeech = !!window.webkitSpeechRecognition;
    const hasSpeech = !!window.SpeechRecognition;
    
    addLog(`SpeechRecognition: ${hasSpeech ? '✅' : '❌'}`);
    addLog(`webkitSpeechRecognition: ${hasWebkitSpeech ? '✅' : '❌'}`);
    addLog(`Overall support: ${isSupported ? '✅' : '❌'}`);
    
    setTests(prev => ({ ...prev, browserSupport: isSupported }));
    return isSupported;
  };

  // Test 2: Microphone Access
  const testMicrophoneAccess = async () => {
    addLog('Testing microphone access...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      addLog('✅ Microphone access granted');
      setTests(prev => ({ ...prev, microphoneAccess: true }));
      return true;
    } catch (error) {
      addLog(`❌ Microphone access failed: ${error.message}`, 'error');
      setTests(prev => ({ ...prev, microphoneAccess: false }));
      return false;
    }
  };

  // Test 3: Basic Speech Recognition
  const testSpeechRecognition = () => {
    return new Promise((resolve) => {
      addLog('Testing basic speech recognition...');
      
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        addLog('❌ Speech recognition not available', 'error');
        setTests(prev => ({ ...prev, speechRecognition: false }));
        resolve(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      let hasResult = false;

      recognition.onstart = () => {
        addLog('🎤 Speech recognition started - say something!');
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        hasResult = true;
        const result = event.results[0][0].transcript;
        addLog(`✅ Recognized: "${result}"`);
        setTranscript(result);
        setTests(prev => ({ ...prev, speechRecognition: true }));
        resolve(true);
      };

      recognition.onerror = (event) => {
        addLog(`❌ Recognition error: ${event.error}`, 'error');
        setTests(prev => ({ ...prev, speechRecognition: false }));
        resolve(false);
      };

      recognition.onend = () => {
        addLog('🔇 Speech recognition ended');
        setIsListening(false);
        if (!hasResult) {
          addLog('❌ No speech detected', 'error');
          setTests(prev => ({ ...prev, speechRecognition: false }));
          resolve(false);
        }
      };

      try {
        recognition.start();
        // Auto-stop after 10 seconds
        setTimeout(() => {
          if (!hasResult) {
            recognition.stop();
          }
        }, 10000);
      } catch (error) {
        addLog(`❌ Failed to start recognition: ${error.message}`, 'error');
        setTests(prev => ({ ...prev, speechRecognition: false }));
        resolve(false);
      }
    });
  };

  // Test 4: Wake Word Detection
  const testWakeWordDetection = async () => {
    addLog('Testing wake word detection...');
    addLog('Say "Hey Sense" to test wake word detection...');
    
    try {
      voiceServiceRef.current = new ContinuousVoiceService();
      
      voiceServiceRef.current.setCallbacks({
        onWakeWord: () => {
          addLog('✅ Wake word detected!');
          setTests(prev => ({ ...prev, wakeWordDetection: true }));
          voiceServiceRef.current?.stop();
        },
        onError: (error) => {
          addLog(`❌ Wake word detection error: ${error}`, 'error');
          setTests(prev => ({ ...prev, wakeWordDetection: false }));
        },
        onStatusChange: (status) => {
          addLog(`Status: listening=${status.listening}, active=${status.active}`);
        }
      });

      const started = await voiceServiceRef.current.start();
      if (started) {
        addLog('🎤 Wake word detection started - say "Hey Sense"');
        // Auto-stop after 15 seconds
        setTimeout(() => {
          if (tests.wakeWordDetection === null) {
            addLog('❌ Wake word detection timeout', 'error');
            setTests(prev => ({ ...prev, wakeWordDetection: false }));
            voiceServiceRef.current?.stop();
          }
        }, 15000);
      } else {
        addLog('❌ Failed to start wake word detection', 'error');
        setTests(prev => ({ ...prev, wakeWordDetection: false }));
      }
    } catch (error) {
      addLog(`❌ Wake word detection setup failed: ${error.message}`, 'error');
      setTests(prev => ({ ...prev, wakeWordDetection: false }));
    }
  };

  // Test 5: Command Processing
  const testCommandProcessing = async () => {
    addLog('Testing command processing...');
    addLog('Say "Hey Sense take me to products" to test command processing...');
    
    try {
      if (!voiceServiceRef.current) {
        voiceServiceRef.current = new ContinuousVoiceService();
      }
      
      voiceServiceRef.current.setCallbacks({
        onCommand: (result, transcript) => {
          addLog(`✅ Command processed: "${transcript}" -> ${JSON.stringify(result)}`);
          setTests(prev => ({ ...prev, commandProcessing: true }));
          voiceServiceRef.current?.stop();
        },
        onWakeWord: () => {
          addLog('Wake word detected, listening for command...');
        },
        onError: (error) => {
          addLog(`❌ Command processing error: ${error}`, 'error');
          setTests(prev => ({ ...prev, commandProcessing: false }));
        }
      });

      const started = await voiceServiceRef.current.start();
      if (started) {
        addLog('🎤 Command processing test started');
        // Auto-stop after 20 seconds
        setTimeout(() => {
          if (tests.commandProcessing === null) {
            addLog('❌ Command processing timeout', 'error');
            setTests(prev => ({ ...prev, commandProcessing: false }));
            voiceServiceRef.current?.stop();
          }
        }, 20000);
      }
    } catch (error) {
      addLog(`❌ Command processing setup failed: ${error.message}`, 'error');
      setTests(prev => ({ ...prev, commandProcessing: false }));
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setTests({
      browserSupport: null,
      microphoneAccess: null,
      speechRecognition: null,
      wakeWordDetection: null,
      commandProcessing: null
    });
    setLogs([]);
    
    addLog('🚀 Starting comprehensive voice bot diagnostics...');
    
    // Test 1: Browser Support
    const browserOk = testBrowserSupport();
    if (!browserOk) {
      addLog('❌ Browser not supported, stopping tests', 'error');
      return;
    }
    
    // Test 2: Microphone Access
    const micOk = await testMicrophoneAccess();
    if (!micOk) {
      addLog('❌ Microphone access failed, stopping tests', 'error');
      return;
    }
    
    addLog('✅ Basic requirements met, proceeding with advanced tests...');
    
    // Test 3: Speech Recognition (manual)
    addLog('⏳ Please run speech recognition test manually');
  };

  const getTestIcon = (result) => {
    if (result === null) return <AlertCircle className="w-4 h-4 text-gray-400" />;
    if (result === true) return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <AlertCircle className="w-4 h-4 text-red-500" />;
  };

  const getTestColor = (result) => {
    if (result === null) return 'text-gray-600';
    if (result === true) return 'text-green-600';
    return 'text-red-600';
  };

  useEffect(() => {
    return () => {
      if (voiceServiceRef.current) {
        voiceServiceRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">🎤 Voice Bot Diagnostics</h1>
          <p className="text-gray-600 mb-6">
            This tool helps diagnose issues with the voice bot functionality. 
            Run the tests below to identify what's working and what needs attention.
          </p>
          
          <button
            onClick={runAllTests}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 mb-6"
          >
            Run All Tests
          </button>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="space-y-3">
            {Object.entries(tests).map(([test, result]) => (
              <div key={test} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center">
                  {getTestIcon(result)}
                  <span className={`ml-2 font-medium ${getTestColor(result)}`}>
                    {test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                </div>
                <div className="flex space-x-2">
                  {test === 'speechRecognition' && (
                    <button
                      onClick={testSpeechRecognition}
                      disabled={isListening}
                      className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 disabled:opacity-50"
                    >
                      {isListening ? 'Listening...' : 'Test'}
                    </button>
                  )}
                  {test === 'wakeWordDetection' && (
                    <button
                      onClick={testWakeWordDetection}
                      className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200"
                    >
                      Test
                    </button>
                  )}
                  {test === 'commandProcessing' && (
                    <button
                      onClick={testCommandProcessing}
                      className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded hover:bg-purple-200"
                    >
                      Test
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Last Transcript</h2>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800">"{transcript}"</p>
            </div>
          </div>
        )}

        {/* Logs */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Diagnostic Logs</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-64 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-gray-500">No logs yet. Run tests to see diagnostic information.</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className={`mb-1 ${log.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                  <span className="text-gray-500">[{log.timestamp}]</span> {log.message}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceTestPage;
