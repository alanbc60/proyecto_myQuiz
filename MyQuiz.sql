create database myquiz;
use myquiz;
#Ver todas las tablas de la bd
show tables;
#Borrar base de datos
drop database myquiz;


# ======= Tabla de usuario ========

CREATE TABLE USUARIO (
    id_usuario INT AUTO_INCREMENT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    contraseña VARCHAR(100) NOT NULL,
    PRIMARY KEY (id_usuario)
);


#Metodo 2 -- Funciona
INSERT into USUARIO (nombre,correo,contraseña)  
SELECT * FROM (SELECT 'Alan Keveen' AS nombre, 'alanbc66@gmail.com' AS correo, 'password123' As contraseña) AS nuevo_valor
WHERE NOT EXISTS (
	#Solo insertamos este valor si los registros existentes no coinciden con el select
    SELECT correo FROM USUARIO WHERE USUARIO.correo = 'alanbc66@gmail.com'
) LIMIT 1;

#Metodo 3
INSERT IGNORE INTO USUARIO (nombre,correo,contraseña)  VALUES ('Alan','alanbc60@gmail.com','password123');
#Insertar usuarios sin condiciones de duplicado, solo para pruebas
insert into USUARIO (nombre,correo,contraseña) values ('Alan','alanbc60@gmail.com','password123');
insert into USUARIO (nombre,correo,contraseña) values ('Monserrat','monserrat60@gmail.com','password123');
insert into USUARIO (nombre,correo,contraseña) values ('Caro','caro@gmail.com','password123');
insert into USUARIO (nombre,correo,contraseña) values ('Cesar','cesar@gmail.com','password123');

select * from USUARIO; 

 SELECT * FROM USUARIO WHERE correo = "tere@gmail.com"; 
select id_usuario from USUARIO Where USUARIO.id_usuario= 1;
SELECT * FROM USUARIO WHERE correo ="keveenM@gmail.com" AND contraseña ="password123"; 
SELECT id_usuario FROM USUARIO WHERE USUARIO.correo = 'caro@gmail.com';

drop table USUARIO;

DELETE FROM USUARIO WHERE id_usuario = 6;


# ======= Tabla de grupo ========

create table GRUPO(
	id_grupo INT AUTO_INCREMENT NOT NULL,
	fk_id_usuario INT NOT NULL,
    nombre varchar(50) not null,
    color_fondo varchar(50) not null,
    color_texto varchar(50) not null,
    imagen varchar(100) not null,
	primary key(id_grupo,fk_id_usuario),
    foreign key(fk_id_usuario) references USUARIO(id_usuario)
);
drop table GRUPO;

SELECT * FROM GRUPO WHERE GRUPO.id_usuario = 1;

INSERT into GRUPO (id_usuario,nombre,color_fondo,color_texto,imagen)
#Lo que vamos a insertar
SELECT * FROM (SELECT 1 AS id_usuario, 'Literatura' AS nombre, 'Rosa' AS color_fondo, 'Blanco' As color_texto, 'Literatura.jpg' AS imagen) AS nuevo_valor
WHERE NOT EXISTS (
	#Solo insertamos este valor si en la consulta no existe esos valores
    SELECT * FROM GRUPO WHERE GRUPO.id_grupo = 6    
     UNION
	SELECT * FROM GRUPO WHERE EXISTS(
		 SELECT * FROM GRUPO WHERE GRUPO.id_usuario = 1   
    )
);

INSERT into GRUPO (id_usuario,nombre,color_fondo,color_texto,imagen)
#Lo que vamos a insertar
SELECT * FROM (SELECT 1 AS id_usuario, 'Literatura' AS nombre, 'Rosa' AS color_fondo, 'Blanco' As color_texto, 'Literatura.jpg' AS imagen) AS nuevo_valor
WHERE NOT EXISTS (
	#Solo insertamos este valor si en la consulta no existe esos valores
    SELECT * FROM GRUPO WHERE GRUPO.id_grupo = 6    
     UNION
		 SELECT IF( EXISTS( 
					SELECT * FROM GRUPO WHERE GRUPO.id_usuario = 1 ), 'Si, existe', 'No, no existe')  AS Resultado
);

select * from GRUPO;
SELECT * FROM GRUPO WHERE nombre='Estructura de datos' AND fk_id_usuario = 3;
insert into GRUPO (fk_id_usuario,nombre,color_fondo,color_texto,imagen) values (1,'Estructura de datos','Blanco','Azul','Lista_ligadas.png');
insert into GRUPO (fk_id_usuario,nombre,color_fondo,color_texto,imagen) values (1,'Estructura de datos','Blanco','Azul','Lista_ligadas.png');
insert into GRUPO (fk_id_usuario,nombre,color_fondo,color_texto,imagen) values (1,'Desarrollo web','Blanco','Azul','Lista_ligadas.png');
insert into GRUPO (fk_id_usuario,nombre,color_fondo,color_texto,imagen) values (2,'Estructura de datos','Blanco','Azul','Lista_ligadas.png');


SELECT DISTINCT nombre FROM GRUPO ORDER BY nombre;


# ======= Tabla de quiz ========
CREATE TABLE QUIZZ (
    id_quiz INT AUTO_INCREMENT NOT NULL,
	fk_id_usuario INT NOT NULL,
	fk_id_grupo INT NULL,
    nombre_quiz VARCHAR(100) NOT NULL,
    tiempo_quiz INT NOT NULL,
    img VARCHAR(100),
    PRIMARY KEY (id_quiz , fk_id_usuario),
	foreign key(fk_id_usuario) references USUARIO(id_usuario)
);

select * from QUIZZ Where fk_id_usuario= 1;

drop table QUIZZ;
describe QUIZZ;
select * from QUIZZ;
SELECT * FROM QUIZZ LIMIT 20;

/*
Usuario:id_usuario=1;
Grupo(Sexualidad):id_grupo=2;
Quiz:id_quiz=1,id_usuario=1,id_grupo=1; 
Quiz:id_quiz=2,id_usuario=1,id_grupo=2;

Usuario:id_usuario=2;
Quiz:id_quiz=1,id_usuario=2,id_grupo=1;
Quiz:id_quiz=2,id_usuario=2,id_grupo=2;




id_usuario=1,id_quiz=1,,id_grupo = 1; 
id_usuario=1,id_quiz=2,,id_grupo = 1; 

//No se puede
id_usuario=1,id_quiz=1,,id_grupo = 1; 


//Se puede
id_usuario=2,id_quiz=1,,id_grupo = 1; 



CREATE TABLE QUIZZ (
    id_quiz INT AUTO_INCREMENT NOT NULL,
	fk_id_usuario INT NOT NULL,
	fk_id_grupo INT NULL,
    nombre_quiz VARCHAR(100) NOT NULL,
    tiempo_quiz INT NOT NULL,
    img VARCHAR(100),
    PRIMARY KEY (id_quiz , fk_id_usuario , fk_id_grupo),
	foreign key(fk_id_usuario) references USUARIO(id_usuario),
	foreign key(fk_id_grupo) references GRUPO(id_grupo)
);

*/

Tengo varios 
    Grupo 1 
    Grupo 2

Si quiero crear un quiz
    No le vamos a asignar al inicio



insert into QUIZZ(id_quiz,fk_id_usuario,fk_id_grupo,nombre_quiz,tiempo_quiz,img) values (1,1,NULL,"Estructura de datos", 10,"imagen1.jpg");
insert into QUIZZ(id_quiz,fk_id_usuario,fk_id_grupo,nombre_quiz,tiempo_quiz,img) values (2,1,NULL,"Algoritmos", 10,"imagen2.jpg");
insert into QUIZZ(id_quiz,fk_id_usuario,fk_id_grupo,nombre_quiz,tiempo_quiz,img) values (3,1,NULL,"Base de datos", 10,"imagen3.jpg");
insert into QUIZZ(id_quiz,fk_id_usuario,fk_id_grupo,nombre_quiz,tiempo_quiz,img) values (4,1,NULL,"Sistemas operativos", 10,"imagen4.jpg");

insert into QUIZZ(fk_id_usuario,fk_id_grupo,nombre_quiz,tiempo_quiz,img) values (1,null,"Estructura de datos 2", 10,"imagen_prueba.jpg");
insert into QUIZZ(fk_id_usuario,fk_id_grupo,nombre_quiz,tiempo_quiz) values (1,1,"Algoritmos 2", 10);
insert into QUIZZ(fk_id_usuario,fk_id_grupo,nombre_quiz,tiempo_quiz) values (1,1,"Base de datos 2", 10);
insert into QUIZZ(fk_id_usuario,fk_id_grupo,nombre_quiz,tiempo_quiz) values (1,1,"Sistemas operativos 2", 10);


insert into QUIZZ(fk_id_usuario,fk_id_grupo,nombre_quiz,tiempo_quiz) values (1,1,"Estructura de datos 3", 10);
insert into QUIZZ(fk_id_usuario,fk_id_grupo,nombre_quiz,tiempo_quiz) values (1,1,"Algoritmos 3", 10);
insert into QUIZZ(fk_id_usuario,fk_id_grupo,nombre_quiz,tiempo_quiz) values (1,1,"Base de datos 3", 10);
insert into QUIZZ(fk_id_usuario,fk_id_grupo,nombre_quiz,tiempo_quiz) values (1,1,"Sistemas operativos 3", 10);




# ======= Tabla pregunta ========
CREATE TABLE PREGUNTA (
id_pregunta INT(1000) AUTO_INCREMENT NOT NULL,
pregunta VARCHAR(300) NOT NULL,
respuesta VARCHAR(300) NOT NULL,
tipo_pregunta VARCHAR(100) NOT NULL,
id_quiz INT(1000) AUTO_INCREMENT NOT NULL,
PRIMARY KEY (id_pregunta,id_quiz)
);

ALTER TABLE PREGUNTA ADD CONSTRAINT PREGUNTA_id_quiz_QUIZZ_id_quiz FOREIGN KEY (id_quiz) REFERENCES QUIZZ(id_quiz);

# ======= Tabla respuesta ========
CREATE TABLE RESPUESTA  (
	id_pregunta INT(1000) AUTO_INCREMENT NOT NULL,
	id_quiz INT(1000) AUTO_INCREMENT NOT NULL,
	id_usuario INT(1000) AUTO_INCREMENT NOT NULL,
	texto_respuesta VARCHAR(500) NOT NULL,
	PRIMARY KEY (id_pregunta,id_quiz,id_usuario)
);

ALTER TABLE RESPUESTA  ADD CONSTRAINT RESPUESTA_id_pregunta_PREGUNTA_id_pregunta FOREIGN KEY (id_pregunta) REFERENCES PREGUNTA(id_pregunta);
ALTER TABLE RESPUESTA  ADD CONSTRAINT RESPUESTA_id_quiz_QUIZZ_id_quiz FOREIGN KEY (id_quiz) REFERENCES QUIZZ(id_quiz);
ALTER TABLE RESPUESTA  ADD CONSTRAINT RESPUESTA_id_usuario_USUARIO_id_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario);


# ======= Tabla opcion ========
CREATE TABLE OPCIÓN (
	id_opcion INT(1000) AUTO_INCREMENT NOT NULL,
	id_quiz INT(1000) AUTO_INCREMENT NOT NULL,
	id_pregunta INT(1000) AUTO_INCREMENT NOT NULL,
	respuesta VARCHAR(500) NOT NULL,
	id_usuario INT(1000) AUTO_INCREMENT NOT NULL,
	PRIMARY KEY (id_opcion,id_quiz,id_pregunta,id_usuario)
);

ALTER TABLE OPCIÓN ADD CONSTRAINT OPCIÓN_id_quiz_QUIZZ_id_quiz FOREIGN KEY (id_quiz) REFERENCES QUIZZ(id_quiz);
ALTER TABLE OPCIÓN ADD CONSTRAINT OPCIÓN_id_pregunta_PREGUNTA_id_pregunta FOREIGN KEY (id_pregunta) REFERENCES PREGUNTA(id_pregunta);
ALTER TABLE OPCIÓN ADD CONSTRAINT OPCIÓN_id_usuario_USUARIO_id_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario);

# ======= Tabla favoritos ========
CREATE TABLE FAVORITOS (
	id_usuario INT(1000) AUTO_INCREMENT NOT NULL,
	id_quiz INT(1000) AUTO_INCREMENT NOT NULL,
	PRIMARY KEY (id_usuario,id_quiz)
);

ALTER TABLE FAVORITOS ADD CONSTRAINT FAVORITOS_id_usuario_USUARIO_id_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario);
ALTER TABLE FAVORITOS ADD CONSTRAINT FAVORITOS_id_quiz_QUIZZ_id_quiz FOREIGN KEY (id_quiz) REFERENCES QUIZZ(id_quiz);

# ======= Tabla conversacion ========
CREATE TABLE CONVERSACIÓN (
id_conversacion INT(1000) AUTO_INCREMENT NOT NULL,
encabezado VARCHAR(120) NOT NULL,
id_pregunta INT(1000) AUTO_INCREMENT NOT NULL,
id_quiz INT(1000) AUTO_INCREMENT NOT NULL,
PRIMARY KEY (id_conversacion,id_pregunta));

ALTER TABLE CONVERSACIÓN ADD CONSTRAINT CONVERSACIÓN_id_pregunta_PREGUNTA_id_pregunta FOREIGN KEY (id_pregunta) REFERENCES PREGUNTA(id_pregunta);
ALTER TABLE CONVERSACIÓN ADD CONSTRAINT CONVERSACIÓN_id_quiz_QUIZZ_id_quiz FOREIGN KEY (id_quiz) REFERENCES QUIZZ(id_quiz);

# ======= Tabla comentario ========

CREATE TABLE COMENTARIO (
	id_comentario  INT(1000) AUTO_INCREMENT NOT NULL,
	texto_comentario VARCHAR(400) NOT NULL,
	id_conversacion INT(1000) AUTO_INCREMENT NOT NULL,
	id_usuario INT(1000) AUTO_INCREMENT NOT NULL,
	PRIMARY KEY (id_comentario ,id_conversacion,id_usuario)
);

ALTER TABLE COMENTARIO ADD CONSTRAINT COMENTARIO_id_conversacion_CONVERSACIÓN_id_conversacion FOREIGN KEY (id_conversacion) REFERENCES CONVERSACIÓN(id_conversacion);
ALTER TABLE COMENTARIO ADD CONSTRAINT COMENTARIO_id_usuario_USUARIO_id_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario);

# ======= Tabla usuarios_grupo ========

CREATE TABLE USUARIOS_GRUPO (
	id_grupo INT(1000) AUTO_INCREMENT NOT NULL,
	id_usuario INT(1000) AUTO_INCREMENT NOT NULL,
	PRIMARY KEY (id_grupo,id_usuario)
);

ALTER TABLE USUARIOS_GRUPO ADD CONSTRAINT USUARIOS_GRUPO_id_grupo_GRUPO_id_grupo FOREIGN KEY (id_grupo) REFERENCES GRUPO(id_grupo);
ALTER TABLE USUARIOS_GRUPO ADD CONSTRAINT USUARIOS_GRUPO_id_usuario_USUARIO_id_usuario FOREIGN KEY (id_usuario) REFERENCES USUARIO(id_usuario);




