class Student {
    constructor(scene, name = '') {
        this.scene = scene;
        this.studentName = name;
        this.statusIndex = 0;
        this.status = studentStatus[this.statusIndex];
        this.colourIndex = 0;
        this.notes='';
        this.createTable(); 
        this.createHead();
        this.createTableLegs();
    }

    createTable() {
        const geometry = new THREE.BoxGeometry(2, 0.2, 1);
        const material = new THREE.MeshLambertMaterial({ color: new THREE.Color(tableColours[this.colourIndex]) });
        this.table = new THREE.Mesh(geometry, material);
        this.table.position.y = 0.7;
        this.table.castShadow = true;
        this.scene.add(this.table);
    }

    createHead() {
        const geometry = new THREE.BoxGeometry(1.5, 1, 0.1);
        const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
        this.head = new THREE.Mesh(geometry, material);
        this.head.position.y = 1.3;
        this.head.rotation.x = THREE.MathUtils.degToRad(-45);
        this.head.castShadow = true;
        this.scene.add(this.head);
    }

    createTableLegs() {
        const legGeometry = new THREE.BoxGeometry(0.1, 0.6, 0.1);
        const legMaterial = new THREE.MeshLambertMaterial({ color: new THREE.Color(tableColours[this.colourIndex]) });
        const positions = [
            { x: -0.9, z: 0.4 },
            { x: -0.9, z: -0.4 },
            { x: 0.9, z: 0.4 },
            { x: 0.9, z: -0.4 }
        ];
        positions.forEach(pos => {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(pos.x, -0.4, pos.z);
            leg.castShadow = true;
            this.table.add(leg);
        });
    }
}