/*
import React, { useState, useEffect } from 'react';
import { Button, Text } from '@tremor/react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Paho from 'paho-mqtt';
import firebase from '../../Database/Firebase';

// Configuración de MQTT
const MQTT_PUB_TEMP = 'HospVietma/hab01/temperatura';
const MQTT_PUB_HUM = 'HospVietma/hab01/humedad';
const MQTT_CONTROL = 'HospVietma/hab01/control';

// Cambiar el protocolo a wss:// para una conexión segura
const client = new Paho.Client(
  'broker.hivemq.com',
  Number(8884),  // Verifica que el puerto sea el adecuado (8884 debería ser para wss)
  `mqtt-async-test-${parseInt(Math.random() * 100)}`
);

client.onConnectionLost = (responseObject) => {
  if (responseObject.errorCode !== 0) {
    console.log('Connection Lost:', responseObject.errorMessage);
  }
};

client.onMessageArrived = (message) => {
  console.log('Message Arrived:', message.payloadString);
};

function Web() {
  const [temperatura, setTemperatura] = useState(0);
  const [humedad, setHumedad] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');

  useEffect(() => {
    client.connect({
      useSSL: true,  // Asegúrate de usar SSL para una conexión segura
      onSuccess: () => {
        console.log('Connected to MQTT broker!');
        setIsConnected(true);
        client.subscribe(MQTT_PUB_TEMP);
        client.subscribe(MQTT_PUB_HUM);
        client.onMessageArrived = onMessage;
      },
      onFailure: (error) => {
        console.error('MQTT connection failed:', error);
      }
    });

    return () => {
      client.disconnect();
      setIsConnected(false);
    };
  }, []);

  function onMessage(message) {    
    if (message.destinationName === MQTT_PUB_TEMP){
        setTemperatura(parseInt(message.payloadString));
        firebase.database().ref('HospObrero/hab01/').update({
          Temp: parseInt(message.payloadString),
        });
        
    }
    else if(message.destinationName === MQTT_PUB_HUM){
        setHumedad(parseInt(message.payloadString));
        firebase.database().ref('HospObrero/hab01/').update({
          Hum: parseInt(message.payloadString),
        }); 
    }    
  }

  function control(c, opcion) {
    const message = new Paho.Message(opcion.toString());
    message.destinationName = MQTT_CONTROL;
    c.send(message);
  
    if (parseInt(message.payloadString) == 1)
      {
        const valueToStore = parseInt(message.payloadString);
        const specificKey = 'Luz'; 
        firebase.database().ref('HospObrero/hab01/').update({
          Luz: parseInt(message.payloadString),
          
        });  
        firebase.database().ref('HospObrero/hab01/Graphics/' + specificKey).push(1);
      }

      else if (parseInt(message.payloadString) == 2)
        { 
          firebase.database().ref('HospObrero/hab01/Graphics/Luz/').push(0);
        }






      else if (parseInt(message.payloadString) == 3 ){
        const valueToStoreVen = parseInt(message.payloadString);
        const specificKeyVen = 'Ventilacion'; 
        firebase.database().ref('HospObrero/hab01/').update({
          Ventilacion: parseInt(message.payloadString),
        }); 
        firebase.database().ref('HospObrero/hab01/Graphics/' + specificKeyVen).push(1);
      }

      else if (parseInt(message.payloadString) == 4){
        
        firebase.database().ref('HospObrero/hab01/Graphics/Ventilacion/').push(0);
      }








      else if (parseInt(message.payloadString) == 5 ){
        const valueToStoreCama = parseInt(message.payloadString);
        const specificKeyCama = 'Cama'; 
        firebase.database().ref('HospObrero/hab01/').update({
          Cama: parseInt(message.payloadString),
        }); 
        firebase.database().ref('HospObrero/hab01/Graphics/' + specificKeyCama).push(1);
      }
      else if (parseInt(message.payloadString) == 6){
       
        firebase.database().ref('HospObrero/hab01/Graphics/Cama/').push(0);
      }








      else if (parseInt(message.payloadString) == 7 ){
        const valueToStoreCort = parseInt(message.payloadString);
        const specificKeyCort = 'Cortina'; 
        firebase.database().ref('HospObrero/hab01/').update({
          
          Cortina: parseInt(message.payloadString),
        }); 
        firebase.database().ref('HospObrero/hab01/Graphics/' + specificKeyCort).push(1);
      }

      else if (parseInt(message.payloadString) == 8){
        
        firebase.database().ref('HospObrero/hab01/Graphics/Cortina/').push(0);
      }



      else if (parseInt(message.payloadString) == 9 ){
        const valueToStorePuer = parseInt(message.payloadString);
        const specificKeyPuer = 'Puerta'; 
        firebase.database().ref('HospObrero/hab01/').update({
          Puerta: parseInt(message.payloadString),
        }); 
        firebase.database().ref('HospObrero/hab01/Graphics/' + specificKeyPuer).push(1);
      }

      else if (parseInt(message.payloadString) == 0){
        const valueToStorePuer = parseInt(message.payloadString);
        const specificKeyPuer = 'Puerta'; 
        firebase.database().ref('HospObrero/hab01/').update({
          Puerta: parseInt(message.payloadString),
        }); 
        firebase.database().ref('HospObrero/hab01/Graphics/Puerta/').push(0);
      }





  }

  // Lógica de reconocimiento de voz
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Tu navegador no soporta la API de reconocimiento de voz.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setTranscript(speechResult);
      processCommand(speechResult);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event);
    };

    if (isListening) {
      recognition.start();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening]);

  // Procesar comandos de voz
  const processCommand = (command) => {
    if (command.toLowerCase().includes('prender luz')) {
      setResponse('Luz prendida');
      control(client, 1);  // Ejecutar la acción correspondiente
    } 
    if(command.toLowerCase().includes('apagar luz')){
      setResponse('Luz apagada');
      control(client, 2);
    }
    if (command.toLowerCase().includes('prender ventilación')) {
      setResponse('Prender ventilación');
      control(client, 3);
    } 
    if(command.toLowerCase().includes('apagar ventilación')){
      setResponse('Apagar ventilación');
      control(client, 4);
    }
    if (command.toLowerCase().includes('abrir cortinas')) {
      setResponse('Abrir cortinas');
      control(client, 7);
    } 
    if(command.toLowerCase().includes('cerrar cortinas')){
      setResponse('Cerrar cortinas');
      control(client, 8);
    }
    if(command.toLowerCase().includes('subir cama')){
      setResponse('Subir cama');
      control(client, 5);
    }
    if(command.toLowerCase().includes('bajar cama')){
      setResponse('Bajar cama');
      control(client, 6);
    }
    if(command.toLowerCase().includes('abrir puerta')){
      setResponse('Abrir puerta');
      control(client, 9);
    }
    if(command.toLowerCase().includes('cerrar puerta')){
      setResponse('Cerrar puerta');
      control(client, 0);
    }
    if(command.toLowerCase().includes('detener')){
      setResponse('detener');
      control(client, 'a');
    }
  };

  // Función para activar/desactivar el reconocimiento de voz
  const toggleListening = () => {
    setIsListening(!isListening);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Habitación IoT</h1>
      </div>
      <div style={styles.gaugeContainer}>
        <div style={styles.gauge}>
          <CircularProgressbar
            value={temperatura}
            maxValue={100}
            text={`${Math.round(temperatura)}ºC`}
            styles={buildStyles({
              pathColor: '#EE4E4E',
              textColor: '#EE4E4E',
              trailColor: '#3d5875'
            })}
          />
          <Text style={styles.title2}>Temperatura</Text>
        </div>
        <div style={styles.gauge}>
          <CircularProgressbar
            value={humedad}
            maxValue={100}
            text={`${Math.round(humedad)}%`}
            styles={buildStyles({
              pathColor: '#00e0ff',
              textColor: '#00e0ff',
              trailColor: '#3d5875'
            })}
          />
          <Text style={styles.title2}>Humedad</Text>
        </div>
      </div>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => control(client, 1)}>Encender Luz</button>
        <button style={styles.button} onClick={() => control(client, 2)}>Apagar Luz</button>
        <button style={styles.button} onClick={() => control(client, 3)}>Encender Ventilación</button>
        <button style={styles.button} onClick={() => control(client, 4)}>Apagar Ventilación</button>
        <button style={styles.button} onMouseDown={() => { control(client, 7); }}  
          onMouseUp={() => { control(client, 'a'); }}>Abrir Cortinas</button>
        <button style={styles.button} onMouseDown={() => { control(client, 8); }}  
          onMouseUp={() => { control(client, 'a'); }}>Cerrar Cortinas</button>
        <button style={styles.button} onClick={() => control(client, 5)}>Subir Cama</button>
        <button style={styles.button} onClick={() => control(client, 6)}>Bajar Cama</button>
        <button style={styles.button} onClick={() => control(client, 9)}>Abrir Puerta</button>
        <button style={styles.button} onClick={() => control(client, 0)}>Cerrar Puerta</button>
      </div>
      <div style={styles.voiceContainer}>
        <button style={styles.button} onClick={toggleListening}>
          {isListening ? 'Detener Reconocimiento de Voz' : 'Iniciar Reconocimiento de Voz'}
        </button>
        <Text style={styles.response}>{response}</Text>
        <Text style={styles.transcript}>Último comando: {transcript}</Text>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    marginBottom: '20px',
  },
  gaugeContainer: {
    display: 'flex',
    gap: '100px',
    marginBottom: '30px',
  },
  gauge: {
    width: '190px',
    height: '190px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title2: {
    marginTop: '10px',
  },
  buttonContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 2fr))',
    gap: '20px',
    width: '100%',
    maxWidth: '1000px',
    marginBottom: '20px',
  },
  button: {
    backgroundColor: '#3bc206',
    color: '#FFF',
    border: 'none',
    borderRadius: '8px',
    padding: '15px',
    fontSize: '18px',
    cursor: 'pointer',
    textAlign: 'center',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)',
    transition: 'all 0.3s ease',
    width: '100%', // Asegura que el botón ocupe todo el ancho del contenedor
  },
  buttonHover: {
    backgroundColor: '#0056b3',
    transform: 'scale(1.05)', // Aumenta el tamaño ligeramente al pasar el mouse
  },
  voiceContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  response: {
    marginTop: '10px',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  transcript: {
    marginTop: '5px',
    fontSize: '16px',
  },
};
export default Web ;
*/