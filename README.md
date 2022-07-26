## Desafío: Loggers, gzip y análisis de performance
#### Como ejecutar el programa en su computadora:

Ejecutar "npm install" para instalar las dependecias.

Definir las variables de entorno en el .env de acuerdo al .env.sample

Ejecutar "npm run build" para crear la estructura de db.

Ejecutar "npm run start" para arrancar el server.

Se le agregó compresión a la ruta /info para comprobar la disminución de peso al traficar.

Se le agregó el logger winston para registrar según el nivel de información en diferentes archivos, ademas de la consola.

Para testear la carga se utiliza artillery ejecutando el siguiente commando:
```
artillery quick --count 50 -n 20 http://localhost:8080/info > result_fork.txt
```