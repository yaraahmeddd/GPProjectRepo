# Registration API Testing Guide

## Base URL
```
http://localhost:3000/api/register
```

---

## 1. MEMBER TYPE INFORMATION (New Flow)
### GET /register/member-type-info
**Description:** Get classification and form schema for a member type code

**Query Parameters:**
```
?code=MEMBER_TYPE_CODE
```

**Member Type Codes:**
- `VISITOR` - Regular/Visitor member
- `WORKING` - Working employee
- `STUDENT` - University student
- `DEPENDENT` - Dependent of a member
- `FOREIGNER` - Foreign national
- `VISITOR_HONORARY` - Honorary visitor
- `VISITOR_ATHLETIC` - Athletic visitor
- `SEASONAL` - Seasonal member
- `GRADUATE` - Graduate member

**Example Request:**
```
GET /register/member-type-info?code=WORKING
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "code": "WORKING",
    "classification": "Internal",
    "formSchemaKey": "working_member_form"
  }
}
```

---

## 2. ROLE SELECTION
### POST /register/choose-role
**Description:** Select user role (member or team_member)

**Request Body:**
```json
{
  "role": "member"
}
```

**Valid Roles:**
- `member` - Club member
- `team_member` - Sports team member

**Example Response:**
```json
{
  "success": true,
  "message": "Role accepted",
  "data": {
    "role": "member",
    "next_step": "basic_info"
  }
}
```

---

## 3. BASIC REGISTRATION
### POST /register/basic
**Description:** Register basic member information (Step 1)

**Request Body:**
```json
{
  "role": "member",
  "email": "ahmed.ali@example.com",
  "password": "SecurePass123!",
  "first_name_en": "Ahmed",
  "first_name_ar": "أحمد",
  "last_name_en": "Ali",
  "last_name_ar": "علي",
  "phone": "01001234567",
  "gender": "male",
  "nationality": "Egyptian",
  "birthdate": "1990-05-15",
  "national_id": "12345678901234",
  "membership_type_code": "WORKING"
}
```

**Required Fields:**
- `role` - "member" or "team_member"
- `email` - Valid email address
- `password` - Password for account
- `first_name_en` - First name in English
- `last_name_en` - Last name in English
- `national_id` - 14 digits, not starting with 0
- `membership_type_code` - Member type code (defaults to VISITOR)

**Validation Rules:**
- National ID must be exactly 14 digits
- National ID cannot start with 0
- Phone must be 11 digits starting with 01 (010, 011, 012, 015)
- Email must be unique
- National ID must be unique

**Example Response:**
```json
{
  "success": true,
  "message": "Basic registration completed. Continue with next steps.",
  "data": {
    "account_id": 1,
    "member_id": 1,
    "team_member_id": null,
    "role": "member",
    "is_foreign": false,
    "membership_type_code": "WORKING",
    "next_step": "employment_question"
  }
}
```

---

## 4. REFERENCE DATA ENDPOINTS

### GET /register/salary-brackets
**Description:** Get salary bracket options for working members

**Example Response:**
```json
{
  "success": true,
  "data": [
    { "id": 1, "range": "1000-5000" },
    { "id": 2, "range": "5000-10000" }
  ]
}
```

### GET /register/dependent-tiers
**Description:** Get dependent tier options

**Example Response:**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "First Degree" },
    { "id": 2, "name": "Second Degree" }
  ]
}
```

### GET /register/branches
**Description:** Get all branches

**Example Response:**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name_en": "Main Branch", "name_ar": "الفرع الرئيسي" },
    { "id": 2, "name_en": "East Branch", "name_ar": "فرع الشرقية" }
  ]
}
```

### GET /register/visitor-types
**Description:** Get visitor membership types

**Example Response:**
```json
{
  "success": true,
  "data": [
    { "id": 4, "code": "VISITOR", "name": "Regular Visitor" },
    { "id": 5, "code": "VISITOR_HONORARY", "name": "Honorary Visitor" }
  ]
}
```

### GET /register/employment-statuses
**Description:** Get employment status options

**Example Response:**
```json
{
  "success": true,
  "data": [
    { "id": 1, "status": "Full-time" },
    { "id": 2, "status": "Part-time" },
    { "id": 3, "status": "Self-employed" }
  ]
}
```

---

## 5. MEMBERSHIP DETERMINATION
### POST /register/determine-membership
**Description:** Determine membership type based on answers (Step 3)

**Request Body:**
```json
{
  "member_id": 1,
  "is_foreign": false,
  "is_working": true,
  "is_retired": false,
  "is_student": false,
  "is_graduated": false,
  "has_relation": false,
  "relation_member_id": null
}
```

**Fields:**
- `member_id` - ID from basic registration (required)
- `is_foreign` - Is member a foreigner?
- `is_working` - Is member employed?
- `is_retired` - Is member retired?
- `is_student` - Is member a student?
- `is_graduated` - Is member a graduate?
- `has_relation` - Is member a dependent?
- `relation_member_id` - ID of related member (if dependent)

**Example Response:**
```json
{
  "success": true,
  "message": "Membership type determined automatically",
  "data": {
    "member_type_code": "WORKING",
    "member_type_id": 2,
    "membership_plan_code": "ANNUAL",
    "next_step": "ANNUAL"
  }
}
```

---

## 6. COMPLETE REGISTRATION
### POST /register/complete
**Description:** Create membership and complete registration (Step 4)

**Request Body:**
```json
{
  "member_id": 1,
  "membership_plan_code": "ANNUAL",
  "start_date": "2024-04-27"
}
```

**Fields:**
- `member_id` - Member ID from registration (required)
- `membership_plan_code` - Plan code (ANNUAL, STUDENT, DEPENDENT, SEASONAL) (required)
- `start_date` - Optional, defaults to today

**Example Response:**
```json
{
  "success": true,
  "message": "Registration completed successfully",
  "data": {
    "membership_id": 5,
    "member_id": 1,
    "membership_status": "active",
    "payment_status": "pending",
    "start_date": "2024-04-27T00:00:00.000Z",
    "end_date": "2025-04-27T00:00:00.000Z"
  }
}
```

---

## 7. COMPLETE WORKING MEMBER REGISTRATION
### POST /register/register-working-member
**Description:** Complete single-step registration for working member

**Request Body:**
```json
{
  "email": "work.member@example.com",
  "password": "SecurePass123!",
  "first_name_en": "Mohamed",
  "first_name_ar": "محمد",
  "last_name_en": "Hassan",
  "last_name_ar": "حسن",
  "phone": "01001234567",
  "gender": "male",
  "nationality": "Egyptian",
  "birthdate": "1985-03-20",
  "national_id": "11111111111111",
  "profession_id": 1,
  "department_en": "Engineering",
  "department_ar": "الهندسة",
  "salary": 5000,
  "salary_slip": "optional_path_to_file",
  "employment_start_date": "2020-01-15",
  "membership_plan_id": 1,
  "branch_id": 1
}
```

**Required Fields:**
- `email`, `password`, `first_name_en`, `last_name_en`, `national_id` - Member info
- `profession_id` - Profession ID
- `salary` - Monthly salary
- `membership_plan_id` - Membership plan ID

**Example Response:**
```json
{
  "success": true,
  "message": "Working member registered successfully",
  "data": {
    "account_id": 2,
    "member_id": 2,
    "employee_detail_id": 1,
    "membership_id": 6,
    "member_type": "working",
    "status": "active"
  }
}
```

---

## 8. COMPLETE RETIRED MEMBER REGISTRATION
### POST /register/register-retired-member
**Description:** Complete single-step registration for retired member

**Request Body:**
```json
{
  "email": "retired.member@example.com",
  "password": "SecurePass123!",
  "first_name_en": "Hassan",
  "first_name_ar": "حسن",
  "last_name_en": "Ibrahim",
  "last_name_ar": "إبراهيم",
  "phone": "01101234567",
  "gender": "male",
  "nationality": "Egyptian",
  "birthdate": "1960-01-10",
  "national_id": "22222222222222",
  "profession_id": 2,
  "former_department_en": "Finance",
  "former_department_ar": "المالية",
  "retirement_date": "2020-06-30",
  "last_salary": 8000,
  "salary_slip": "optional_path_to_file",
  "membership_plan_id": 1
}
```

**Required Fields:**
- `email`, `password`, `first_name_en`, `last_name_en`, `national_id` - Member info
- `profession_id` - Previous profession
- `retirement_date` - Date of retirement
- `membership_plan_id` - Membership plan ID

**Example Response:**
```json
{
  "success": true,
  "message": "Retired member registered successfully",
  "data": {
    "account_id": 3,
    "member_id": 3,
    "retired_detail_id": 1,
    "membership_id": 7,
    "member_type": "retired",
    "status": "active"
  }
}
```

---

## 9. COMPLETE STUDENT MEMBER REGISTRATION
### POST /register/register-student-member
**Description:** Complete single-step registration for student member (with file upload)

**Request Type:** multipart/form-data

**Form Fields (JSON):**
```json
{
  "email": "student.member@example.com",
  "password": "SecurePass123!",
  "first_name_en": "Fatima",
  "first_name_ar": "فاطمة",
  "last_name_en": "Ahmed",
  "last_name_ar": "أحمد",
  "phone": "01201234567",
  "gender": "female",
  "nationality": "Egyptian",
  "birthdate": "2002-09-15",
  "national_id": "33333333333333",
  "faculty_id": 1,
  "membership_plan_id": 2
}
```

**Files to Upload:**
- `personal_photo` - Personal photo (1 file)
- `national_id_front` - National ID front (1 file)
- `national_id_back` - National ID back (1 file)
- `medical_report` - Medical report (1 file)
- `student_proof` - Student proof/enrollment document (1 file)

**Required Fields:**
- `email`, `password`, `first_name_en`, `last_name_en`, `national_id` - Member info
- `membership_plan_id` - Membership plan ID
- All files are optional but recommended

**Example Response:**
```json
{
  "success": true,
  "message": "Student member registered successfully",
  "data": {
    "account_id": 4,
    "member_id": 4,
    "student_detail_id": 1,
    "membership_id": 8,
    "member_type": "student",
    "status": "active"
  }
}
```

---

## 10. DETAILED INFORMATION SUBMISSION

### POST /register/details/visitor
**Description:** Submit detailed information for visitor member (with file upload)

**Request Type:** multipart/form-data

**Form Fields (JSON):**
```json
{
  "member_id": 1,
  "branch_id": 1,
  "occupation_en": "Manager",
  "occupation_ar": "مدير"
}
```

**Files:**
- `national_id_front` - National ID front (1 file)
- `national_id_back` - National ID back (1 file)
- `personal_photo` - Personal photo (1 file)
- `medical_report` - Medical report (1 file)
- `passport_photo` - Passport photo (1 file, optional)

**Example Response:**
```json
{
  "success": true,
  "message": "Visitor details submitted successfully",
  "data": {
    "member_id": 1,
    "detail_id": 101,
    "status": "pending_review"
  }
}
```

### POST /register/details/working
**Description:** Submit detailed information for working member

**Request Type:** multipart/form-data

**Form Fields:**
```json
{
  "member_id": 2,
  "profession_id": 1,
  "department_en": "Engineering",
  "department_ar": "الهندسة",
  "employment_start_date": "2020-01-15",
  "salary": 5000,
  "branch_id": 1
}
```

**Files:**
- `national_id_front`, `national_id_back`, `personal_photo`, `medical_report`, `salary_slip`

### POST /register/details/retired
**Description:** Submit detailed information for retired member

**Request Type:** multipart/form-data

**Form Fields:**
```json
{
  "member_id": 3,
  "profession_id": 2,
  "former_department_en": "Finance",
  "former_department_ar": "المالية",
  "retirement_date": "2020-06-30",
  "last_salary": 8000,
  "branch_id": 1
}
```

### POST /register/details/student
**Description:** Submit detailed information for student member

**Request Type:** multipart/form-data

**Form Fields:**
```json
{
  "member_id": 4,
  "faculty_id": 1,
  "university_name_en": "Cairo University",
  "university_name_ar": "جامعة القاهرة",
  "enrollment_year": 2021,
  "branch_id": 1
}
```

### POST /register/details/foreigner-seasonal
**Description:** Submit detailed information for foreigner/seasonal member

**Request Type:** multipart/form-data

**Form Fields:**
```json
{
  "member_id": 5,
  "duration_months": 3,
  "visa_status": "tourist",
  "payment_option_id": 1,
  "branch_id": 1
}
```

**Files:** `national_id_front`, `national_id_back`, `personal_photo`, `medical_report`, `passport_photo`

### POST /register/details/dependent
**Description:** Submit detailed information for dependent member

**Request Type:** multipart/form-data

**Form Fields:**
```json
{
  "member_id": 6,
  "primary_member_id": 1,
  "relationship_type_id": 1,
  "dependent_subtype_id": 1,
  "branch_id": 1
}
```

**Files:** `national_id_front`, `national_id_back`, `personal_photo`, `medical_report`, `relation_proof`

---

## 11. STATUS ENDPOINTS

### GET /register/status/:member_id
**Description:** Get member registration status

**Example Request:**
```
GET /register/status/1
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "member_id": 1,
    "status": "pending_review",
    "created_at": "2024-04-27T10:30:00.000Z",
    "updated_at": "2024-04-27T10:35:00.000Z"
  }
}
```

### GET /register/seasonal/status/:member_id
**Description:** Get foreigner/seasonal member status

### GET /register/working-status/:member_id
**Description:** Get working member status

### GET /register/retired-status/:member_id
**Description:** Get retired member status

### GET /register/dependent-status/:member_id
**Description:** Get dependent member status

### GET /register/student-status/:member_id
**Description:** Get student member status

---

## 12. REFERENCE DATA FOR WORKING MEMBERS

### GET /register/professions
**Description:** Get professions list for working members

### GET /register/relationship-types
**Description:** Get relationship types for working members

### GET /register/active-working-members
**Description:** Get list of active working members (for relationships)

---

## 13. REFERENCE DATA FOR RETIRED MEMBERS

### GET /register/retired/professions
**Description:** Get professions list for retired members

### GET /register/retired/relationship-types
**Description:** Get relationship types for retired members

### GET /register/retired/active-working-members
**Description:** Get active working members (for retired relationships)

---

## 14. REFERENCE DATA FOR DEPENDENT MEMBERS

### GET /register/dependent/subtypes
**Description:** Get dependent subtypes

### GET /register/dependent/relationship-types
**Description:** Get relationship types for dependents

### GET /register/dependent/active-working-members
**Description:** Get active working members

### GET /register/dependent/active-visitor-members
**Description:** Get active visitor members

### GET /register/dependent/active-members
**Description:** Get all active members

---

## 15. REFERENCE DATA FOR STUDENT MEMBERS

### GET /register/student/statuses
**Description:** Get student status options

### GET /register/student/relationship-types
**Description:** Get relationship types for students

### GET /register/student/active-members
**Description:** Get active members (for student relationships)

---

## 16. PRICING ENDPOINTS

### POST /register/calculate-working-membership-price
**Request Body:**
```json
{
  "membership_plan_id": 1,
  "duration_months": 12
}
```

### POST /register/calculate-retired-membership-price
**Request Body:**
```json
{
  "membership_plan_id": 1,
  "duration_months": 12
}
```

### POST /register/calculate-dependent-membership-price
**Request Body:**
```json
{
  "membership_plan_id": 3,
  "primary_member_id": 1
}
```

### POST /register/calculate-student-membership-price
**Request Body:**
```json
{
  "membership_plan_id": 2,
  "duration_months": 12
}
```

### GET /register/seasonal/duration-options
**Description:** Get duration options for seasonal members

### GET /register/seasonal/visa-statuses
**Description:** Get visa status options

### GET /register/seasonal/payment-options
**Description:** Get payment options

### GET /register/seasonal/pricing/:duration_months
**Description:** Get pricing for a specific duration

**Example:**
```
GET /register/seasonal/pricing/3
```

---

## REGISTRATION FLOW EXAMPLES

### Flow 1: Basic Step-by-Step Registration
1. `POST /register/choose-role` → Select "member"
2. `POST /register/basic` → Register basic info, get member_id
3. `POST /register/determine-membership` → Determine membership type
4. `POST /register/complete` → Complete registration

### Flow 2: Complete Working Member Registration (Single Request)
1. `POST /register/register-working-member` → Complete in one request

### Flow 3: Complete Student Member Registration (With Files)
1. `POST /register/register-student-member` (multipart/form-data) → Complete in one request

### Flow 4: Foreigner/Seasonal Member
1. `POST /register/basic` → Register basic info
2. `GET /register/seasonal/duration-options` → Get duration options
3. `GET /register/seasonal/pricing/:duration_months` → Get pricing
4. `POST /register/details/foreigner-seasonal` → Submit details with files
5. `POST /register/seasonal/membership` → Create seasonal membership

---

## ERROR RESPONSES

### Validation Error (400)
```json
{
  "success": false,
  "message": "Missing required fields (role, email, password, first_name_en, national_id are mandatory)"
}
```

### Conflict Error (409)
```json
{
  "success": false,
  "message": "Email already registered"
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "Related member not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error during registration",
  "error": "Database connection failed"
}
```

---

## TESTING NOTES

- **National ID:** Must be 14 digits, not starting with 0. Example: `12345678901234`
- **Phone:** Must be 11 digits starting with 01. Examples: `01001234567`, `01101234567`, `01201234567`, `01501234567`
- **Email:** Must be unique in system
- **Passwords:** Should be secure and contain mix of characters
- **Dates:** Use ISO format (YYYY-MM-DD)
- **File Uploads:** Use multipart/form-data for endpoints with file fields
- **Member Type Codes:** VISITOR, WORKING, STUDENT, DEPENDENT, FOREIGNER, etc.

