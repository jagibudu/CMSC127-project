import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

// Starting of the functional component which will delete students
function DeleteStudentModal({ deleteStudent }) {
  // Using state variables for access of the input field
    const [student_number, setStudentNumber] = useState("");

    // Function for dynamic change of values for the input field of student_number
    const handleStudentNumberChange = (event) => {
        setStudentNumber(event.target.value);
    };

    // Creation of an async await function which first checks if the input is filled,
    // sends a DELETE request to the server using axios, then shows a toast message if successful or not
    const handleDeleteStudent = async () => {
        // Input check
        if (!student_number || student_number === "") {
        toast.error("Student Number is Required.");
        return;
        }

        try {
        // DELETE request to the server with data payload
        const res = await axios.request({
            method: "delete",
            url: "http://localhost:3000/students",
            data: { student_number },
        });

        // In case of success
        if (res.status === 200) {
            console.log("Student Deleted");
            toast.success(`Student ${student_number} Deleted Successfully`);
            deleteStudent(student_number); // Update the UI by removing the student
            setStudentNumber(""); // Empty the field after successful operation
        }
        } catch (error) {
        // In case of error
        console.error("Error Deleting Student", error);
        if (error.response?.status === 404) {
            toast.error("Student does not exist.");
        } else {
            toast.error("Error Deleting Student");
        }
        }
    };

    // Using Bootstrap pre-built components
    return (
        <>
        <button
            type="button"
            className="btn btn-danger"
            data-bs-toggle="modal"
            id="button"
            data-bs-target="#DeleteStudentModal"
        >
            <b>Delete Student</b>
        </button>

        <div
            className="modal fade"
            id="DeleteStudentModal"
            tabIndex="-1"
            aria-labelledby="DeleteStudentModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-header">
                <h1 className="modal-title fs-5" id="DeleteStudentModalLabel">
                    <b>Enter Student Number</b>
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
                </div>
                <div className="modal-footer">
                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDeleteStudent}
                    data-bs-dismiss="modal"
                >
                    <b>Delete Student</b>
                </button>
                </div>
            </div>
            </div>
        </div>
        </>
    );
}

// Exporting the created function
export default DeleteStudentModal;