\# Smart Clinic Management System Architecture



\## Section 1: Architecture Summary



The Smart Clinic Management System is built using Spring Boot and follows a three-tier architecture consisting of the presentation layer, application layer, and data layer.



The presentation layer includes Thymeleaf-based dashboards for Admin and Doctor users, along with REST API clients for patient-related modules such as appointments and patient records. The application layer contains controllers, services, and business logic that process requests and coordinate workflows. The data layer consists of two databases: MySQL for structured relational data such as patients, doctors, appointments, and admin details, and MongoDB for flexible document-based prescription storage.



The system uses Spring MVC for server-rendered web pages and REST controllers for API communication. All requests pass through a common service layer before interacting with repositories. MySQL data is managed using JPA entities, while MongoDB uses document models.



\---



\## Section 2: Numbered Flow of Data and Control



1\. Users access the application through Admin Dashboard, Doctor Dashboard, or REST API clients like appointment and patient modules.



2\. User requests are routed to the appropriate controller depending on the request type, either Thymeleaf MVC controllers or REST controllers.



3\. Controllers forward the request to the service layer where business logic and validation are applied.



4\. The service layer communicates with repository classes to perform required database operations.



5\. MySQL repositories handle structured relational data such as doctors, patients, appointments, and admin records, while MongoDB repositories manage prescription documents.



6\. Database records are mapped into Java model classes using JPA entities for MySQL and document models for MongoDB.



7\. Processed data is returned either as dynamic HTML pages through Thymeleaf templates or as JSON responses through REST APIs.

