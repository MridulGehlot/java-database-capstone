# Smart Clinic Database Schema Design

## MySQL Database Design

The Smart Clinic Management System uses MySQL for structured relational data where relationships, constraints, and consistency are important.

### 1. Patients Table

| Column Name       | Data Type         | Constraints                  |
|------------------|------------------|------------------------------|
| patient_id       | INT              | PRIMARY KEY, AUTO_INCREMENT  |
| full_name        | VARCHAR(100)     | NOT NULL                     |
| email            | VARCHAR(100)     | UNIQUE, NOT NULL             |
| password         | VARCHAR(255)     | NOT NULL                     |
| phone_number     | VARCHAR(15)      | NOT NULL                     |
| date_of_birth    | DATE             | NOT NULL                     |
| address          | VARCHAR(255)     | NULL                         |

---

### 2. Doctors Table

| Column Name       | Data Type         | Constraints                  |
|------------------|------------------|------------------------------|
| doctor_id        | INT              | PRIMARY KEY, AUTO_INCREMENT  |
| full_name        | VARCHAR(100)     | NOT NULL                     |
| specialization   | VARCHAR(100)     | NOT NULL                     |
| email            | VARCHAR(100)     | UNIQUE, NOT NULL             |
| password         | VARCHAR(255)     | NOT NULL                     |
| phone_number     | VARCHAR(15)      | NOT NULL                     |
| availability     | VARCHAR(255)     | NULL                         |

---

### 3. Appointments Table

| Column Name       | Data Type         | Constraints                                |
|------------------|------------------|--------------------------------------------|
| appointment_id   | INT              | PRIMARY KEY, AUTO_INCREMENT                |
| patient_id       | INT              | FOREIGN KEY REFERENCES patients(patient_id)|
| doctor_id        | INT              | FOREIGN KEY REFERENCES doctors(doctor_id)  |
| appointment_date | DATETIME         | NOT NULL                                   |
| status           | VARCHAR(50)      | NOT NULL                                   |
| notes            | TEXT             | NULL                                       |

---

### 4. Admin Table

| Column Name       | Data Type         | Constraints                  |
|------------------|------------------|------------------------------|
| admin_id         | INT              | PRIMARY KEY, AUTO_INCREMENT  |
| username         | VARCHAR(50)      | UNIQUE, NOT NULL             |
| password         | VARCHAR(255)     | NOT NULL                     |
| email            | VARCHAR(100)     | UNIQUE, NOT NULL             |

---

## MongoDB Collection Design

The Smart Clinic system uses MongoDB for flexible document-based storage of prescriptions, where nested and varying data structures are beneficial.

### Collection: Prescriptions

Example document:

```json
{
  "_id": "665f1234abcd5678efgh9012",
  "appointment_id": 101,
  "patient_id": 12,
  "doctor_id": 5,
  "prescription_date": "2026-05-15T10:30:00Z",
  "diagnosis": "Seasonal Viral Fever",
  "medications": [
    {
      "medicine_name": "Paracetamol",
      "dosage": "500mg",
      "frequency": "Twice a day",
      "duration_days": 5
    },
    {
      "medicine_name": "Vitamin C",
      "dosage": "1000mg",
      "frequency": "Once a day",
      "duration_days": 7
    }
  ],
  "doctor_notes": "Drink plenty of fluids and take adequate rest.",
  "follow_up_required": true,
  "follow_up_date": "2026-05-22"
}
```

### Design Justification

- MySQL is used for structured data with strong relationships such as patients, doctors, appointments, and admins.
- Foreign key constraints ensure data integrity between related tables.
- MongoDB is used for prescriptions because prescription formats may vary between patients and doctors.
- Nested medication arrays make MongoDB suitable for flexible and scalable document storage.
- This hybrid database approach combines the strengths of relational and NoSQL databases.
