const TABLENAME= 'allseats';
const loginButton = document.getElementById('loginButton');
const signupButton = document.getElementById('signupButton');
const logoutButton = document.getElementById('logoutButton');
const saveChangesButton = document.getElementById('saveChangesButton');

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const submitLogin = document.getElementById('submitLogin');
const submitSignup = document.getElementById('submitSignup');
const classnameinput = document.getElementById('classnameArea');

const noteareainput = document.getElementById('notesArea');

document.getElementById('chooseclass').addEventListener('change', function() {
    const selectedClassName = this.value;
    classnameinput.value = selectedClassName;
    loadFromSupabase(selectedClassName);
});
loginButton.addEventListener('click', () => {
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
});
logoutButton.addEventListener('click', async () => {
    await SB.auth.signOut();
    currentUser = null;
    updateAuthUI();
    clearScene();

});
signupButton.addEventListener('click', () => {
    signupForm.style.display = 'block';
    loginForm.style.display = 'none';
});

submitLogin.addEventListener('click', async () => {
        const email = document.getElementById('emailInput').value;
        const password = document.getElementById('passwordInput').value;
        const { data, error } = await SB.auth.signInWithPassword({
            email: email,
            password: password
        });
        if (error) {
            alert('Login failed: ' + error.message);
        } else {
            currentUser = data.user;
            loginForm.style.display = 'none';
            updateAuthUI();
            //await loadFromSupabase();
            await loadClassFromSupabase();
        }
    });

submitSignup.addEventListener('click', async () => {
        const email = document.getElementById('signupEmailInput').value;
        const password = document.getElementById('signupPasswordInput').value;
        const { data, error } = await SB.auth.signUp({
            email: email,
            password: password
        });
        if (error) {
            alert('Sign Up failed: ' + error.message);
        } else {
            currentUser = data.user;
            signupForm.style.display = 'none';
            updateAuthUI();
            //await loadFromSupabase();
        }
    });

document.getElementById('SelectTools').addEventListener('keydown', function(event) {
            if (event.key.startsWith('Arrow')) {
                event.preventDefault();
            }
        });

document.addEventListener('keydown', function(event) {
    if (namePrompt.style.display !== 'none' && event.key === 'Enter') {
            updateStudentName();
            return;  // Exit the function early to prevent further processing
        }
        
    const moveDistance = 1;
    if(window.selectedTool === 'move'){
        students.forEach(student => {
            if (student.head.material.color.getHex() === 0xbbbbbb) {
                switch (event.key) {
                    case 'ArrowUp':
                        student.table.position.z -= moveDistance;
                        student.head.position.z -= moveDistance;
                        break;
                    case 'ArrowDown':
                        student.table.position.z += moveDistance;
                        student.head.position.z += moveDistance;
                        break;
                    case 'ArrowLeft':
                        student.table.position.x -= moveDistance;
                        student.head.position.x -= moveDistance;
                        break;
                    case 'ArrowRight':
                        student.table.position.x += moveDistance;
                        student.head.position.x += moveDistance;
                        break;
                    case 'Delete':
                        sceneSetup.scene.remove(student.head);
                        sceneSetup.scene.remove(student.table);
                        students.splice(students.indexOf(student), 1);
                }
                sceneSetup.renderer.render(sceneSetup.scene, sceneSetup.camera);
            }
        });
        if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
            event.preventDefault();
            students.forEach(student => {
                student.head.material.color.set(0xbbbbbb);
            });
        }
    }
});
