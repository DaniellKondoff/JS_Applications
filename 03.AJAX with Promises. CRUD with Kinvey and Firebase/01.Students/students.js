/**
 * Created by Kondoff on 23-Nov-16.
 */
function solve() {
    const appId='kid_BJXTsSi-e';
    const baseUrl = `https://baas.kinvey.com/appdata/${appId}/students`;
    const username = 'guest';
    const password = 'guest';

    let authHeaders={
        "Authorization":"Basic "+btoa(`${username}:${password}`),
        "Content-Type":'application/json'
    };

    let table=$('#results');

    function loadStudents() {
        let tr=table.find("tr:not(:first-child)");
        tr.remove();
        $.get({
            url:baseUrl,
            headers:authHeaders
        })
            .then((students)=>{
                students=students.sort((a,b)=>{
                    return a.ID - b.ID;
                });
                for(let student of students){
                    let row=$('<tr>');
                    let id=$("<td>").text(student.ID);
                    let firstName=$("<td>").text(student.FirstName);
                    let lastName=$("<td>").text(student.LastName);
                    let facultyNumber =$("<td>").text(student.FacultyNumber );
                    let grade=$("<td>").text(student.Grade);
                    row.append(id).append(firstName).append(lastName).append(facultyNumber).append(grade);
                    table.append(row)
                }
            });
    }
    loadStudents();

    $('#addBtn').click(()=>{
        let idInput=$('#studentID');
        let firsName=$('#fistName');
        let lastName=$('#lastName');
        let facultyNumber=$('#facultyNumber');
        let gradeInput=$('#grade');


        //vallidation
        let id=Number(idInput.val());
        let grade=Number(gradeInput.val());
        let facultyRegex=/^\d+$/g;

        if(idInput.val() !=="" &&
            firsName.val() !=="" &&
            lastName.val() !=="" &&
            facultyRegex.test(facultyNumber.val()) &&
            gradeInput.val()!==""){

            let student={
                ID:id,
                FirstName:firsName.val(),
                LastName:lastName.val(),
                FacultyNumber:facultyNumber.val(),
                Grade:grade
            };
            $.ajax({
                url:baseUrl,
                method:"POST",
                headers:authHeaders,
                data: JSON.stringify(student)
            })
                .then(loadStudents);
        }
        idInput.val('');
        firsName.val('');
        lastName.val('');
        facultyNumber.val('');
        gradeInput.val('');
    })

}