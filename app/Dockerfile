# syntax=docker/dockerfile:1

# Step 1: Build the Spring Boot jar with Maven + JDK 17
FROM maven:3.9.9-eclipse-temurin-17 AS builder

WORKDIR /app

COPY pom.xml ./
COPY src ./src

RUN mvn -B clean package -DskipTests

# Step 2: Run on a lightweight JRE image
FROM eclipse-temurin:17.0.15_6-jre

WORKDIR /app

# Run as non-root for better container security
RUN addgroup --system spring && adduser --system --ingroup spring spring

COPY --from=builder /app/target/back-end-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

USER spring

ENTRYPOINT ["java", "-jar", "app.jar"]
