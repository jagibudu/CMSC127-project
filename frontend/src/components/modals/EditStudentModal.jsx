import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

// Starting of the functional component which edits the student in the database
function EditStudentModal({ updateStudent }) {
    // Using state variables for access of the input fields
    const [student_number, setStudentNumber] = useState("");
    const [first_name, setFirstName] = useState("");
    const [middle_initial, setMiddleInitial] = useState("");
    const [last_name, setLastName] = useState("");
    const [gender, setGender] = useState("");
    const [degree_program, setDegreeProgram] = useState("");

    // Functions for dynamic change of values for the input fields
    const handleStudentNumberChange = (event) => {
        setStudentNumber(event.target.value);
    };

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    };

    const handleMiddleInitialChange = (event) => {
        setMiddleInitial(event.target.value);
    };

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    };

    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };

    const handleDegreeProgramChange = (event) => {
        setDegreeProgram(event.target.value);
    };

    // Creation of an async await function which first checks if required inputs are filled,
    // sends a PUT request to the server using axios, then shows a toast message if successful or not
    const handleEditStudent = async () => {
        // Input check (student_number is required per backend)
        if (!student_number || student_number === "") {
        toast.error("Student Number is Required");
        return;
        }

        try {
        // PUT request to server
        const res = await axios.put("http://localhost:3000/students", {
            student_number,
            first_name,
            middle_initial,
            last_name,
            gender,
            degree_program,
        });

        // In case of success
        if (res.status === 200) {
            toast.success("Student Updated");
            updateStudent(res.data); // Update the UI with the edited student
            setStudentNumber(""); // Empty the fields after successful operation
            setFirstName("");
            setMiddleInitial("");
            setLastName("");
            setGender("");
            setDegreeProgram("");
        }
        } catch (error) {
        // In case of error
        console.error("Error Editing Student", error);
        if (error.response?.status === 404) {
            toast.error("Student does not exist.");
        } else {
            toast.error("Error Editing Student");
        }
        }
    };

    // Using Bootstrap pre-built components
    return (
        <>
        <button
            type="button"
            className="btn btn-warning"
            data-bs-toggle="modal"
            id="button"
            data-bs-target="#editStudentModal"
        >
            <b>Edit Student</b>
        </button>

        <div
            className="modal fade"
            id="editStudentModal"
            tabIndex="-1"
            aria-labelledby="EditStudentModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-header">
                <h1 className="modal-title fs-5" id="EditStudentModalLabel">
                    <b>Enter Student Details</b>
                </h1>
                <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                ></button>
                </div>
                <div className="modal-body">
                <div className="mb-3">
                    <label htmlFor="student_number" className="form-label">
                    Student Number:
                    </label>
                    <input
                    type="text"
                    className="form-control"
                    id="student_number"
                    placeholder="Ex: 2021-12345"
                    value={student_number}
                    onChange={handleStudentNumberChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="first_name" className="form-label">
                    First Name:
                    </label>
                    <input
                    type="text"
                    className="form-control"
                    id="first_name"
                    placeholder="Ex: John"
                    value={first_name}
                    onChange={handleFirstNameChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="middle_initial" className="form-label">
                    Middle Initial:
                    </label>
                    <input
                    type="text"
                    className="form-control"
                    id="middle_initial"
                    placeholder="Ex: D"
                    value={middle_initial}
                    onChange={handleMiddleInitialChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="last_name" className="form-label">
                    Last Name:
                    </label>
                    <input
                    type="text"
                    className="form-control"
                    id="last_name"
                    placeholder="Ex: Doe"
                    value={last_name}
                    onChange={handleLastNameChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="gender" className="form-label">
                    Gender:
                    </label>
                    <input
                    type="text"
                    className="form-control"
                    id="gender"
                    placeholder="Ex: Male/Female"
                    value={gender}
                    onChange={handleGenderChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="degree_program" className="form-label">
                    Degree Program:
                    </label>
                    <input
                    type="text"
                    className="form-control"
                    id="degree_program"
                    placeholder="Ex: Computer Science"
                    value={degree_program}
                    onChange={handleDegreeProgramChange}
                    />
                </div>
                </div>
                <div className="modal-footer">
                <button
                    type="button"
                    className="btn btn-warning"
                    onClick={handleEditStudent}
                    data-bs-dismiss="modal"
                >
                    <b>Edit Student</b>
                </button>
                </div>
            </div>
            </div>
        </div>
        </>
    );
}

// Exporting the created function
export default EditStudentModal;