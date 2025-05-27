<img align="left" height="110" src="./frontend/src/assets/soma_logo.png" />

**SOMA** or Student-Organization Management Application is an information system designed to streamline the management of student organizations, including their events, memberships, and finances. This system aims to enhance organizational efficiency and provide centralized tools for managing all aspects of student-led groups within the academe.




# Core Functionality

1. **Membership Management**
   - Add, update, delete, and search for members.
   - Track members' roles (e.g., President, Treasurer, Member).
   - Track membership status (active, inactive, expelled, suspended, alumni).
   - Note: A student can be a member of multiple organizations (e.g., Varsitarian).

2. **Fees Management**
   - Manage membership fees and dues.
   - Generate reports on the organization's financial status.


# 📋 Generated Reports

1. **Member Overview Report**
   - View all members of the organization by:
     - Role
     - Status
     - Gender
     - Degree Program
     - Batch (year of membership)
     - Committee
   - 📌 _Note: One committee membership per organization per semester._

2. **Unpaid Dues by Semester**
   - View members for a given organization with unpaid membership fees or dues for a specific semester and academic year.

3. **Individual Member Dues**
   - View a member’s unpaid membership fees or dues for all their organizations (Member’s POV).

4. **Executive Committee Report**
   - View all executive committee members of a given organization for a specific academic year.

5. **Presidential History**
   - View all Presidents (or any other role) of a given organization for every academic year in reverse chronological order (current to past).

6. **Late Payments Report**
   - View all late payments made by all members of a given organization for a given semester and academic year.

7. **Member Activity Percentage**
   - View the percentage of active vs inactive members of a given organization for the last `n` semesters.
   - 📌 _Note: `n` is a positive integer._

8. **Alumni Members Report**
   - View all alumni members of a given organization as of a specific date.

9. **Dues Summary**
   - View the total amount of unpaid and paid membership fees or dues of a given organization as of a specific date.

10. **Highest Debt Report**
    - View the member(s) with the highest debt in a given organization for a specific semester.

---
These reports help to better understand and manage the dynamics, obligations, and participation within the organization/s.

# Folder Structure
```
CMSC127-project/
├─ backend/
│  ├─ controllers//
│  ├─ db//
│  ├─ routes//
frontend/
├─ public/
├─ src/
│  ├─ assets/
│  ├─ components/
│  ├─ pages/
│  ├─ App.jsx
│  ├─ main.jsx
```

# Technology Stack

The application is built using the following technologies:

- **SQL** – Used for managing relational data including members, organizations, fees, and reports.
- **Node.js** – Provides the runtime environment for executing backend JavaScript code.
- **Express.js** – A minimal and flexible Node.js web application framework used to build RESTful APIs.
- **React** – A JavaScript library for building fast and interactive user interfaces on the frontend.
- **Tailwind CSS** - To avoid specifity hell




