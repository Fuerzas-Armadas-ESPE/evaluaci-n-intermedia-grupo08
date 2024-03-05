[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/YHXnZX8I)
# sistemaDocente

``` mermaid
graph TD;
    A[Autenticación] --> B[Gestión de Roles]
    B --> C[Gestión de Temas]
    C --> D[Registro de Actividades]
    C --> E[Registro de Calificaciones]
    C --> F[CRUD de Tareas]
    F --> G[Marcar como impartida]
    F --> H[Indicar actividad pendiente]
    F --> I[Registrar observaciones]
    C --> J[Reporte en PDF]
    C --> K[Interfaz de Usuario]
    D --> K
    E --> K
    F --> K
    J --> K
    K --> L[Agregar, editar y eliminar temas]
    K --> M[Registrar actividades]
    K --> N[Gestionar tareas]
    N --> O[Marcar como realizada]
    N --> P[Nueva actividad]
    K --> Q[Generar reporte en PDF]
  ```

# Prueba Intermedia Parcial 3
Nombre: Adrian Isaee Simbaña Moreira

NRC: 14386

# Pasos Para la Ejecución
Intalar todas las dependecias y librerias
### `npm install`
### `npm install antd`
### `npm install file-saver html2pdf.js`
### `npm install @supabase/supabase-js`
### `npm install moment`

Ejecutamos el proyecto de React
### `npm start`
[http://localhost:3000](http://localhost:3000)

# Base de datos Supabase
Ejecutar el script en Supabase

```
CREATE TABLE docentes (
    id SERIAL PRIMARY KEY,
    nombre TEXT,
    correo_electronico TEXT,
    contrasena TEXT
);


CREATE TABLE cursos (
    id SERIAL PRIMARY KEY,
    nombre_curso TEXT,
    descripcion TEXT
);


CREATE TABLE temas_curso (
    id SERIAL PRIMARY KEY,
    id_curso INTEGER REFERENCES cursos(id),
    titulo TEXT,
    objetivo TEXT
);


CREATE TABLE actividades (
    id SERIAL PRIMARY KEY,
    id_tema_curso INTEGER REFERENCES temas_curso(id),
    descripcion TEXT,
    estado TEXT 
);


CREATE TABLE tareas (
    id SERIAL PRIMARY KEY,
    id_tema_curso INTEGER REFERENCES temas_curso(id),
    descripcion TEXT,
    clase_impartida BOOLEAN,
    actividad_pendiente BOOLEAN,
    observaciones TEXT
);


INSERT INTO docentes (nombre, correo_electronico, contrasena) 
VALUES 
('Juan Pérez', 'juan@example.com', 'contrasena123'),
('María López', 'maria@example.com', 'password456'),
('Carlos Ramirez', 'carlos@example.com', 'securepassword789'),
('Ana Martínez', 'ana@example.com', '123456'),
('Pedro García', 'pedro@example.com', 'abcdef');

INSERT INTO cursos (nombre_curso, descripcion) 
VALUES 
('Matemáticas', 'Curso de Matemáticas Avanzadas'),
('Historia', 'Curso de Historia del Mundo'),
('Literatura', 'Curso de Literatura Clásica'),
('Biología', 'Curso de Biología Celular'),
('Programación', 'Curso de Desarrollo Web');

INSERT INTO temas_curso (id_curso, titulo, objetivo) 
VALUES 
(1, 'Álgebra Lineal', 'Introducción al Álgebra Lineal'),
(1, 'Cálculo Diferencial', 'Conceptos básicos del Cálculo Diferencial'),
(2, 'Edad Media', 'Estudio de la Edad Media en Europa'),
(3, 'El Quijote', 'Análisis de la obra El Quijote de Cervantes'),
(4, 'Estructura Celular', 'Conocimientos sobre la estructura de la célula');

INSERT INTO actividades (id_tema_curso, descripcion, estado) 
VALUES 
(1, 'Resolver ejercicios de matrices', 'Realizadas'),
(2, 'Lectura de Capítulo 1', 'Pendientes'),
(3, 'Debate sobre la Edad Media', 'Realizadas'),
(4, 'Análisis del Capítulo 5', 'Pendientes'),
(5, 'Laboratorio de Microscopía', 'Realizadas');

INSERT INTO tareas (id_tema_curso, descripcion, clase_impartida, actividad_pendiente, observaciones) 
VALUES 
(1, 'Practicar suma y resta de matrices', true, false, 'Los estudiantes mostraron un buen entendimiento del tema'),
(2, 'Resumen del Capítulo 1', false, true, 'La tarea se asignará para la próxima clase'),
(3, 'Preparar una presentación sobre la Edad Media', true, false, 'La presentación fue exitosa'),
(4, 'Escribir un ensayo sobre el Capítulo 5', false, true, 'Se revisará en la próxima clase'),
(5, 'Realizar observaciones bajo el microscopio', true, false, 'Se identificaron correctamente las estructuras celulares');
```
# IMPORTANTE!!
Colocar las credenciales respectivas de supabase en el archivo 
### `supabase.js`

```
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    "Url Supabase", 
    "Key Supabase"
);
```
