import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import EditStudentModal from "./modals/EditStudentModal";
import CreateStudentModal from "./modals/AddStudentModal";
import DeleteStudentModal from "./modals/DeleteStudentModal";

function Table() {
    const [students, setStudents] = useState([]);
    const hasFetchedStudents = useRef(false);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get("http://localhost:3000/students");
                setStudents(response.data);

                if (!hasFetchedStudents.current) {
                    toast.success("Students Fetched");
                    hasFetchedStudents.current = true;
                }
            } catch (error) {
                console.log("There was an error fetching the students!", error);

                if (!hasFetchedStudents.current) {
                    toast.error("Error Fetching Students");
                    hasFetchedStudents.current = true;
                }
            }
        };

        fetchStudents();
    }, []);

    const addStudent = (student) => {
        setStudents((prevStudents) => [...prevStudents, student]);
    };

    const updateStudent = (updatedStudent) => {
        setStudents((prevStudents) =>
            prevStudents.map((student) =>
                student.student_number === updatedStudent.student_number ? updatedStudent : student
            )
        );
    };

    const deleteStudent = (student_number) => {
        setStudents((prevStudents) =>
            prevStudents.filter((student) => student.student_number !== student_number)
        );
    };

    return (
        <>
            <Toaster richColors closeButton />
            <div className="container mt-5">
                <h1 className="mb-4" id="h1">
                    Student Table
                </h1>
                <CreateStudentModal addStudent={addStudent} />
                <EditStudentModal updateStudent={updateStudent} />
                <DeleteStudentModal deleteStudent={deleteStudent} />

                {students.length === 0 ? (
                    <h3 id="h3">No Students in Database</h3>
                ) : (
                    <table className="table table-bordered table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th>Student Number</th>
                                <th>First Name</th>
                                <th>Middle Initial</th>
                                <th>Last Name</th>
                                <th>Gender</th>
                                <th>Degree Program</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr key={student.student_number}>
                                    <td>{student.student_number}</td>
                                    <td>{student.first_name}</td>
                                    <td>{student.middle_initial}</td>
                                    <td>{student.last_name}</td>
                                    <td>{student.gender}</td>
                                    <td>{student.degree_program}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}

export default Table;