class SceneSetup {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setClearColor(0x87ceeb);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;
        this.controls.screenSpacePanning = true;
        this.controls.rotateSpeed = 0.7;

        this.addGrass();
        this.addWalls();
        this.addLights();
        this.camera.position.set(4, 4, 7);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.renderer.domElement.addEventListener('click', this.onDocumentMouseDown.bind(this), false);

        this.animate();
    }

    addGrass() {
        const geometry = new THREE.PlaneGeometry(40, 40);
        const material = new THREE.MeshLambertMaterial({ color: 0x129D32 });
        const grass = new THREE.Mesh(geometry, material);
        grass.rotation.x = -Math.PI / 2;
        grass.receiveShadow = true;
        this.scene.add(grass);
    }

    addWalls() {
        const wallGeometry = new THREE.BoxGeometry(40, 6, 0.1);
        const wallMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const walls = [];

        walls[0] = new THREE.Mesh(wallGeometry, wallMaterial);
        walls[0].position.set(0, 3, -20);
        this.scene.add(walls[0]);

        walls[1] = new THREE.Mesh(wallGeometry, wallMaterial);
        walls[1].position.set(0, 3, 20);
        this.scene.add(walls[1]);

        walls[2] = new THREE.Mesh(wallGeometry, wallMaterial);
        walls[2].rotation.y = Math.PI / 2;
        walls[2].position.set(-20, 3, 0);
        this.scene.add(walls[2]);

        walls[3] = new THREE.Mesh(wallGeometry, wallMaterial);
        walls[3].rotation.y = Math.PI / 2;
        walls[3].position.set(20, 3, 0);
        this.scene.add(walls[3]);
    }

    addLights() {
        const ambientLight = new THREE.AmbientLight(0xf0f0c0);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(0, 10, 10);
        directionalLight.castShadow = true;

        directionalLight.shadow.camera.left = -30;
        directionalLight.shadow.camera.right = 30;
        directionalLight.shadow.camera.top = 30;
        directionalLight.shadow.camera.bottom = -30;
        directionalLight.shadow.camera.near = 1;
        directionalLight.shadow.camera.far = 50;

        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;

        this.scene.add(directionalLight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    onDocumentMouseDown(event) {
        event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, this.camera);

        let intersects = raycaster.intersectObjects(students.map(student => student.head));

        if (intersects.length > 0 && window.selectedTool === 'name') {
            selectedStudent = students.find(student => student.head === intersects[0].object);
            document.getElementById('studentName').value = selectedStudent.studentName;

            namePrompt.style.display = 'block';
            document.getElementById('studentName').focus();
        }

        if (intersects.length > 0 && window.selectedTool === 'register') {
            selectedStudent = students.find(student => student.head === intersects[0].object);
            selectedStudent.statusIndex++;
            selectedStudent.status = studentStatus[(selectedStudent.statusIndex)% studentStatus.length];
            updateStudentTexture(selectedStudent);   
        }

        if (window.selectedTool === 'move') {
            if(intersects.length > 0 ){
                selectedStudent = students.find(student => student.head === intersects[0].object);
                selectedStudent.head.material.color.set(selectedStudent.head.material.color.getHex() === 0xbbbbbb ? 0xffffff : 0xbbbbbb);
            } else {
                students.forEach(student => {
                    if (student.head.material.color.getHex() === 0xbbbbbb) {
                        student.head.material.color.set(0xffffff);
                    }
                });
            }
        }

        if (intersects.length > 0 && window.selectedTool === 'swap') {
            selectedStudent = students.find(student => student.head === intersects[0].object);
            selectedStudent.head.material.color.set(selectedStudent.head.material.color.getHex() === 0xbbccff ? 0xffffff : 0xbbccff);

            let swapCandidates = students.filter(student => student.head.material.color.getHex() === 0xbbccff);

            if (swapCandidates.length >= 2) {
                let tempName = swapCandidates[0].studentName;
                let tempStatus = swapCandidates[0].status;

                swapCandidates[0].studentName = swapCandidates[1].studentName;
                swapCandidates[1].studentName = tempName;

                swapCandidates[0].status = swapCandidates[1].status;
                swapCandidates[1].status = tempStatus;

                updateStudentTexture(swapCandidates[0]);
                updateStudentTexture(swapCandidates[1]);

                swapCandidates.forEach(student => student.head.material.color.set(0xffffff));
            }
        }
        if (window.selectedTool === 'notes') {
            if (intersects.length > 0) {
                selectedStudent = students.find(student => student.head === intersects[0].object);
                noteareainput.style.display='unset';
                noteareainput.value = selectedStudent.notes;
                noteareainput.focus();
            }else {
                if (selectedStudent) {
                    selectedStudent.notes = noteareainput.value;

                    noteareainput.style.display='none';
                }
            }

        }

        if (intersects.length > 0 && window.selectedTool === 'colour') {
            selectedStudent = students.find(student => student.head === intersects[0].object);
            selectedStudent.colourIndex++;
            selectedStudent.colourIndex = (selectedStudent.colourIndex) % tableColours.length;
            selectedStudent.table.material.color.set(new THREE.Color(tableColours[selectedStudent.colourIndex]));
        }
    }
}