import React, { useState, useEffect } from 'react';
import { Button, Text } from '@tremor/react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Paho from 'paho-mqtt';
import firebase from '../DataBase/Firebase';

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

function Mobile() {
  const [temperatura, setTemperatura] = useState(0);
  const [humedad, setHumedad] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');

  useEffect(() => {
    const mqttConnect = () => {
    
      if (client.isConnected()) {
        console.log('El cliente ya está conectado. No se intentará reconectar.');
        return;
      }
  
  
      client.connect({
        useSSL: true,
        onSuccess: () => {
          console.log('Conectado al broker MQTT! fasd');
          setIsConnected(true);
          client.subscribe(MQTT_PUB_TEMP);
          client.subscribe(MQTT_PUB_HUM);
          client.onMessageArrived = onMessage;
        },
        onFailure: (error) => {
          console.error('Fallo al conectar al MQTT:', error);
        }
      });
    };
  
  
    mqttConnect();
  
  
    return () => {
      if (client.isConnected()) {
        client.disconnect();
        setIsConnected(false);
        console.log('Desconectado del broker MQTT.');
      }
    };
  }, [isConnected]);

  function onMessage(message) {    
    if (message.destinationName === MQTT_PUB_TEMP){
        const valueToStoreTemp = parseInt(message.payloadString);
        const specificKeyTemp = 'Temp';
        setTemperatura(parseInt(message.payloadString));
        firebase.database().ref('HospObrero/hab01/').update({
          Temp: parseInt(message.payloadString),
        });
        firebase.database().ref('HospObrero/hab01/Graphics/' + specificKeyTemp).push(valueToStoreTemp);
    }
    else if(message.destinationName === MQTT_PUB_HUM){
        const valueToStoreHum = parseInt(message.payloadString);
        const specificKeyHum = 'Hum';
        setHumedad(parseInt(message.payloadString));
        firebase.database().ref('HospObrero/hab01/').update({
          Hum: parseInt(message.payloadString),
        }); 
        firebase.database().ref('HospObrero/hab01/Graphics/' + specificKeyHum).push(valueToStoreHum);
    }    
  }

  function control(c, opcion) {
    const message = new Paho.Message(opcion.toString());
    message.destinationName = MQTT_CONTROL;
    c.send(message);
  
    if (parseInt(message.payloadString) == 1 )
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

      else if (parseInt(message.payloadString) == 3){
        
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
        
        firebase.database().ref('HospObrero/hab01/Graphics/Cortina/' ).push(0); 
      }






      else if (parseInt(message.payloadString) == 9 ){
        const valueToStorePuer = parseInt(message.payloadString);
        const specificKeyPuer = 'Puerta'; 
        firebase.database().ref('HospObrero/hab01/').update({
          Puerta: parseInt(message.payloadString),
        }); 
        firebase.database().ref('HospObrero/hab01/Graphics/' + specificKeyPuer).push(1);
      }

      else if (parseInt(message.payloadString) == 9 ||parseInt(message.payloadString) == 0){
        
        firebase.database().ref('HospObrero/hab01/Graphics/Puerta/').push(0);
      }

  
    // Actualizar Firebase
    
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
    <div style={{ padding: 20, overflowY: 'scroll', height: 'calc(100vh - 40px)', }}>
        <div style={styles.container}>
      <div style={styles.cont1}>
        <h1>Habitación IoT </h1>
      </div>
      <div style={{ height: 20}} />

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
      <div style={{ height: 10 }} />
      <div style={styles.voiceContainer}>
        <button onClick={toggleListening}>
          {isListening ? 'Detener Reconocimiento de Voz' : 'Iniciar Reconocimiento de Voz'}
        </button>
        <p>Transcripción: {transcript}</p>
        <p>Respuesta: {response}</p>
      </div>
      <div style={{ height: 10 }} />
      <Text style={styles.sectionTitle}>Luces LED</Text>
      <div style={styles.buttonContainer}>
        <button style={styles.button} 
          onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
          onClick={() => { control(client, 1);} }>Encender Luz</button>
        <button style={styles.button}
          onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
         onClick={() => { control(client, 2);} }>Apagar Luz</button>
      </div>

      <div style={{ height: 10 }} />
      <Text style={styles.sectionTitle}>Ventilación</Text>
      <div style={styles.buttonContainer}>
        <button
          style={styles.button} 
          onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
          onClick={() => { control(client, 3);} }>Encender Ventilación</button>
        <button 
          style={styles.button} 
          onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
          onClick={() => { control(client, 4);} }>Apagar Ventilación</button>
      </div>
      
      <div style={{ height: 10 }} />
      <Text style={styles.sectionTitle}>Cama</Text>
      <div style={styles.buttonContainer}>
        <button 
          style={styles.button} 
          onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
          onClick={() => { control(client, 5);} }>Subir Cama</button>
        <button
          style={styles.button} 
          onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor} 
          onClick={() => { control(client, 6);} }>Bajar Cama</button>
      </div>
      
      <div style={{ height: 10 }} />
      <Text style={styles.sectionTitle}>Cortinas</Text>
      <div style={styles.buttonContainer}>
        <button 
          style={styles.button} 
          onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
          onMouseDown={() => { control(client, 7); }}  
          onMouseUp={() => { control(client, 'a'); }}
          onTouchStart={() => { control(client, 7); }}  // Inicia acción al tocar
          onTouchEnd={() => { control(client, 'a'); }} 
          >Abrir Cortinas</button>
        <button 
          style={styles.button} 
          onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
          onMouseDown={() => { control(client, 8); }}  
          onMouseUp={() => { control(client, 'a'); }}
          onTouchStart={() => { control(client, 8); }}  // Inicia acción al tocar
          onTouchEnd={() => { control(client, 'a'); }} 
          >
            
          Cerrar Cortinas</button>
      </div>
      
      <div style={{ height: 10 }} />
      <Text style={styles.sectionTitle}>Puerta</Text>
      <div style={styles.buttonContainer}>
        <button 
          style={styles.button} 
          onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
          onClick={() => { control(client, 9);} }>Abrir Puerta</button>
        <button 
          style={styles.button} 
          onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
          onClick={() => { control(client, 0);} }>Cerrar Puerta</button>
      </div>
    </div>
    </div>
    
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  cont1: {
    alignItems: 'center',
  },
  gaugeContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%', // Ancho completo por defecto
    maxWidth: '400px', // Máximo ancho para pantallas grandes
  },
  gauge: {
    width: '45%', // Ajusta el ancho de cada gráfica en relación al contenedor
    minWidth: '120px', // Ancho mínimo para que no se hagan demasiado pequeñas
    textAlign: 'center',
  },
  title2: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  voiceContainer: {
    margin: 5,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4CAF50', // Fondo verde
    color: 'white', // Texto blanco
    padding: '10px 20px', // Espaciado interno
    margin: '10px', // Margen entre botones
    border: 'none', // Sin borde
    borderRadius: '10px', // Bordes redondeados
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Sombra ligera
    cursor: 'pointer', // Cambia el cursor al pasar sobre el botón
    fontSize: '16px', // Tamaño de fuente
    textAlign: 'center', // Alineación del texto
    transition: 'background-color 0.3s ease', // Transición suave para el fondo
    display: 'inline-block', // Asegura que el botón se comporte como un bloque en línea
    width: '100%', // Hace que el botón ocupe todo el ancho del contenedor padre
    minHeight: '60px', // Altura mínima para todos los botones
    whiteSpace: 'normal', // Permite que el texto se envuelva en varias líneas
    
},
  buttonHover: {
    backgroundColor: '#45a049', // Fondo un poco más oscuro al pasar el ratón
  },
  '@media (max-width: 768px)': { // Para pantallas más pequeñas
    gaugeContainer: {
      width: '80%', // Reduce el ancho del contenedor en pantallas pequeñas
    },
    gauge: {
      width: '90%', // Cada gráfica ocupa más espacio en pantallas pequeñas
    },
  },
  '@media (min-width: 769px)': { // Para pantallas más grandes
    gaugeContainer: {
      width: '100%', // El contenedor ocupa todo el ancho disponible
      maxWidth: '600px', // Limita el ancho máximo
    },
    gauge: {
      width: '45%', // Ajusta el tamaño de las gráficas para pantallas grandes
    },
  },
};

export default Mobile;
