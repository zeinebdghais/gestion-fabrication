# ===== ÉTAPE 1 : Build =====
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copier pom.xml et télécharger les dépendances (cache Docker)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copier le code source et compiler
COPY src ./src
RUN mvn clean package -DskipTests

# ===== ÉTAPE 2 : Run =====
FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]