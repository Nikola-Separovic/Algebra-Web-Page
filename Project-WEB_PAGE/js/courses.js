document.addEventListener('DOMContentLoaded', function () {
    // Set to track added course IDs
    const addedCourses = new Set();
   
    // Animation for elements after the DOM is fully loaded
    setTimeout(function() {
        document.querySelector('.animated-form')?.classList.add('animated-form-active');
        document.querySelector('.animated-title')?.classList.add('animated-title-active');
    }, 100); 


    // Initialize the autocomplete for the course input
    $('#courseInput').autocomplete({
        source: async function (request, response) {
            const courses = await fetchCourses();
            const filteredCourses = courses.filter(course => 
                course.course.toLowerCase().includes(request.term.toLowerCase())
            );
            response(filteredCourses.map(course => ({
                label: course.course,
                value: course.id,
                data: course
            })));
        },
        minLength: 1,
        select: function (event, ui) {
            event.preventDefault();  // Prevent the default behavior(ID)
            if (addedCourses.has(ui.item.value)) {
                alert("This course has already been added.");
                return;
            }

            addedCourses.add(ui.item.value); // Add course ID to the set
            addCourseToTable(ui.item.data);
            updateTotals();
             // Keep the course name in the input field
            $(this).val(ui.item.label);
        }
    });

    // Function to fetch courses from the JSON file
    async function fetchCourses() {
        try {
            const response = await fetch('data/courses.json');
            if (!response.ok) {
                throw new Error('Failed to fetch courses.');
            }
            return response.json();
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }

    // Function to add a course to the table
    function addCourseToTable(course) {
        console.log("Adding course to table: ", course);
        const $courseTableBody = $('#coursesTableBody');
        const $newRow = $(`
        <tr data-course-id="${course.id}"> <!-- Add a data attribute for the course ID -->
                <td>${course.course}</td>
                <td>${course.ects}</td>
                <td>${course.hours}</td>
                <td>${course.lectures}</td>
                <td>${course.exercises}</td>
                <td>${course.type}</td>
                <td><button class="btn btn-danger" onclick="removeCourse(this)">Obriši</button></td>
            </tr>
        `);
        $courseTableBody.prepend($newRow); // Adds the new row to the top of the table body
        $courseTableBody.parent().show(); // Ensure the table is visible
        updateTotals();
    }

    // Function to remove a course from the table
    window.removeCourse = function (button) {
        const $row = $(button).closest('tr');
        const courseId = $row.data('course-id'); // Retrieve the course ID

        addedCourses.delete(courseId); // Remove from the set
        $row.remove();
        updateTotals();
    };

    // Function to update the totals
    function updateTotals() {
        let totalECTS = 0, totalHours = 0, totalLectures = 0, totalExercises = 0;
        $('#coursesTableBody tr:not(:last-child)').each(function() {
            totalECTS += parseInt($(this).find('td').eq(1).text()) || 0;
            totalHours += parseInt($(this).find('td').eq(2).text()) || 0;
            totalLectures += parseInt($(this).find('td').eq(3).text()) || 0;
            totalExercises += parseInt($(this).find('td').eq(4).text()) || 0;
        });

        $('#ects').text(totalECTS);
        $('#sati').text(totalHours);
        $('#predavanja').text(totalLectures);
        $('#vjezbe').text(totalExercises);
    }
});
