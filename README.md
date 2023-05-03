<h1 align="center">Bookease</h1>

<!-- descripcion  -->
<p>Bookease es un repositorio para la gestión de reservas en distintos tipos de negocios. Este proyecto utiliza NestJS y MongoDB como stack principal y se encuentra en desarrollo. Está destinado únicamente para fines de práctica y aprendizaje.</p>
<!--  -->

<br>

<!-- Indice -->
<h2 align="center">Índice</h2>
<ul>
    <li><a href="#requisitos-previos">Requisitos previos</a></li>
    <li><a href="#recursos">Recursos</a></li>
    <li><a href="#instalación">Instalación</a></li>
    <li><a href="#desarollo">Desarrollo</a></li>
    <li><a href="#uso">Uso</a></li>
    <li><a href="#pruebas">Pruebas</a></li>
    <li><a href="#contribuciones">Contribuciones</a></li>
    <li><a href="#licencia">Licencia</a></li>
</ul>
<!--  -->

<br>

<!-- Requisitos previos -->
<h2 id="requisitos-previos" align="center">Requisitos previos</h2>
<p>Para ejecutar este proyecto en su entorno local, debe tener instalado lo siguiente:</p>
<ul>
    <li>Node.js (versión recomendada 14.x o superior)</li>
    <li>MongoDB</li>
    <li>npm o yarn (recomendado)</li>
</ul>
<h3 id="configuracion">Configuración</h3>
<p>Siga estos pasos para configurar el entorno del proyecto:</p>
<ol>
    <li>Crear un archivo <code>.env</code></li>
    <li>Renombra el archivo <code>.env.example</code> a <code>.env</code> para solucionarlo.</li>
    <li>Editar la configuración del <code>.env</code> según tus necesidades.</li>
</ol>
<!--                   -->

<br>

<!-- Recursos -->
<h2 id="recursos" align="center">Recursos</h2>
<p>Dentro de la carpeta "recursos", ubicada en la raíz del proyecto, encontrarás tanto la estructura de carpetas del mismo como la colección Postman para su utilización o prueba.</p>
<h3>Estructura simplificada:</h3>
<pre>
src/
├── application/
│   ├── auth/       <i># Módulo de autenticación, incluye CQRS, estrategias y controladores</i>
│   ├── booking/    <i># Módulo de reservas, incluye CQRS, servicios y controladores</i>
│   └── user/       <i># Módulo de usuarios, incluye CQRS, servicios y controladores</i>
├── domain/
│   ├── booking/    <i># Entidad de reserva y su interfaz de repositorio</i>
│   ├── user/       <i># Entidad de usuario y su interfaz de repositorio</i>
│   └── login-attempt/ <i># Entidad de intento de inicio de sesión y su interfaz de repositorio</i>
├── infrastructure/
│   └── mongo/      <i># Módulo de MongoDB, incluye esquemas y repositorios para cada entidad</i>
├── app.module.ts   <i># Módulo principal de la aplicación</i>
└── main.ts         <i># Punto de entrada principal de la aplicación</i>
</pre>

<p>La estructura de carpetas presentada sigue la arquitectura de NestJS, que es modular y utiliza el patrón CQRS. La aplicación se organiza en capas, incluyendo <code>application</code>, <code>domain</code> e <code>infrastructure</code>. La capa de <code>application</code> contiene la lógica de negocio y los controladores, la capa de <code>domain</code> define las entidades y sus interfaces de repositorio, y la capa de <code>infrastructure</code> maneja la persistencia y conexión con bases de datos, en este caso, MongoDB.</p>
<p>Esta organización en capas y la separación de responsabilidades facilitan la escalabilidad y el mantenimiento del proyecto.</p>
<!--  -->

<br>

<!-- Instalación -->
<h2 id="instalación" align="center">Instalación</h2>
<p>Siga los siguientes pasos para instalar el proyecto en su entorno local:</p>
<ol>
    <li>Clone el repositorio:</li>
</ol>
<pre><code>git clone https://github.com/antonio-112/bookease.git</code></pre>
<ol start="2">
    <li>Cambie al directorio del proyecto:</li>
</ol>
<pre><code>cd bookease</code></pre>
<ol start="3">
    <li>Instale las dependencias:</li>
</ol>
<pre><code>npm install</code></pre>
<p>Una vez que haya completado estos pasos, tendrá una copia del proyecto en su entorno local con todas las dependencias necesarias instaladas. Asegúrese de configurar el archivo <code>.env</code> según los requisitos previos y siga las instrucciones de ejecución y desarrollo para comenzar a trabajar con el proyecto.</p>

<!--  -->

<br>

<!-- Desarrollo -->
<h2 id="desarollo" align="center">Desarrollo</h2>

<p>Para ejecutar el proyecto en modo de desarrollo, ejecute el siguiente comando:</p>
<pre><code>npm run start:dev</code></pre>

<p>Para ejecutar el proyecto en modo Read-Eval-Print-Loop (REPL)</p>
<pre><code>npm run start:repl</code></pre>

<!--  -->
<br>
<!-- Uso -->
<h2 id="uso" align="center">Uso</h2>

<p>Para ejecutar el proyecto, ejecute el siguiente comando:</p>
<pre><code>npm run start</code></pre>

<p>o si está utilizando yarn:</p>
<pre><code>yarn start</code></pre>

<p>El servidor se iniciará en el puerto 3000 por defecto. Puede acceder a la API en <code>http://localhost:3000</code>.</p>

<p>Adicionalmente, hay un archivo llamado <code>bookease</code> que contiene una colección Postman en la carpeta <code>resources</code>, la cual puede ser útil para probar los endpoints de la API.</p>
<br>

<p>Para iniciar Docker, utilice el siguiente comando:</p>
<pre><code>npm run docker:start</code></pre>

<p>o si está utilizando yarn:</p>
<pre><code>yarn docker:start</code></pre>
<!--  -->

<br>

<!-- Pruebas -->
<h2 id="pruebas" align="center">Pruebas</h2>
<p>Este proyecto utiliza Jest para realizar pruebas unitarias y de integración. Las pruebas se encuentran en la carpeta <code>test</code> del proyecto.</p>
<p>Para ejecutar las pruebas, siga los siguientes pasos:</p>
<ol>
    <li>Asegúrese de estar en el directorio principal del proyecto</li>
    <li>Para ejecutar las pruebas, utilice el siguiente comando:</li>
</ol>
<pre><code>npm run test</code></pre>
<ol start="3">
    <li>Si desea ver el informe de cobertura de las pruebas, utilice el siguiente comando:</li>
</ol>
<pre><code>npm run test:cov</code></pre>
<p>Al ejecutar las pruebas, Jest generará un informe detallado de los resultados de las pruebas, así como cualquier error o advertencia que pueda encontrar. El informe de cobertura le mostrará qué partes del código han sido probadas y cuáles no, lo que le permitirá mejorar la calidad y la confiabilidad del proyecto.</p>
<p>Asegúrese de mantener las pruebas actualizadas y de agregar nuevas pruebas cuando se introduzcan nuevas características o se realicen cambios significativos en el código.</p>
<!--  -->

<br>

<!-- Contribuciones -->
<h2 id="contribuciones" align="center">Contribuciones</h2>
<p>Este proyecto es de código abierto y las contribuciones son bienvenidas. Si desea contribuir, siga estos pasos:</p>
<ol>
    <li>Realice un "fork" del repositorio</li>
    <li>Clone su fork en su entorno local</li>
    <li>Cree una nueva rama con un nombre descriptivo relacionado con la característica o corrección que desea aportar</li>
    <li>Realice sus cambios y envíelos</li>
    <li>Abra una solicitud de extracción (pull request) desde su repositorio al repositorio original</li>
</ol>
<p>Al contribuir al proyecto, asegúrese de seguir las buenas prácticas de desarrollo y las convenciones del código. También es importante mantener una comunicación abierta con el equipo del proyecto, especialmente al discutir nuevas características o cambios significativos en la estructura del código. Trabajar juntos y mantener una comunicación efectiva garantizará que las contribuciones sean valiosas y beneficiosas para el proyecto.</p>
<!--  -->

<br>

<!-- Licencia -->
<h2 id="licencia" align="center">Licencia</h2>
<p>Este proyecto está licenciado bajo la Licencia MIT. Siéntase libre de usar, modificar y distribuir el código siguiendo los términos de la licencia.</p>

<pre align="center">
    /\_/\  
   / o o \ 
  (   "   ) 
</pre>
