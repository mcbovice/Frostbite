   /*!
 * Socket.IO v2.3.0
 * (c) 2020-2030 Berny Chavez
 * Released under the MIT License.
 */
   
   var socket = io();
 
   socket.on('connect', function(){
 
   console.log('Conectado al Servidor');
   
   });
   
    socket.on('disconnect', function(){
 
   console.log('Se Perdio la Conexion al Servidor');
   
   });

