var graph = new joint.dia.Graph();

new joint.dia.Paper({
	el: document.getElementById('paper'),
	model: graph,
	width: 800,  //TODO: automatic size (responsive to resizes, and node movements)
	height: 600,
	gridSize: 1
	, defaultAnchor: {
		name: 'perpendicular'
	}

	// https://resources.jointjs.com/docs/jointjs/v3.1/joint.html#routers.orthogonal
	, defaultRouter: {
		name: 'orthogonal',
		args: {
			padding: 10
		}
	}
	// https://resources.jointjs.com/docs/jointjs/v3.1/joint.html#routers.manhattan
	// , defaultRouter: {
	// 	name: 'manhattan',
	// 	args: {
	// 		padding: 10
	// 	}
	// }

	// , interactive: false // disables ALL interactions with the graph
});

// var uml = joint.shapes.uml;

var classes = {

	mammal: new ecore.EClass({
		size: {
			width: 240,
			height: 100
		},
		name: 'Mammal',
		attributes: ['dob: Date'],
		methods: ['+ setDateOfBirth(dob: Date): Void',
			'+ getAgeAsDays(): Numeric']
	}),

	person: new ecore.EClass({
		size: {
			width: 260,
			height: 100
		},
		name: 'Person',
		attributes: ['firstName: String', 'lastName: String'],
		methods: ['+ setName(first: String, last: String): Void',
			'+ getName(): String']
	}),

	bloodgroup: new ecore.EClass({
		size: {
			width: 220,
			height: 100
		},
		name: 'BloodGroup',
		attributes: ['bloodGroup: String'],
		methods: ['+ isCompatible(bG: String): Boolean']
	}),

	address: new ecore.EClass({
		size: {
			width: 160,
			height: 100
		},
		name: 'Address',
		attributes: ['houseNumber: Integer', 'streetName: String',
			'town: String', 'postcode: String'],
		methods: []

	}),

	man: new ecore.EClass({
		size: {
			width: 180,
			height: 50
		},
		name: 'Man'
	}),

	woman: new ecore.EClass({
		name: 'Woman',
		methods: ['+ giveABrith(): Person []']
	})

};

Object.keys(classes).forEach(function (key) {
	graph.addCell(classes[key]);
});

var relations = [new ecore.Generalization({
	source: {
		id: classes.man.id
	},
	target: {
		id: classes.person.id
	}
}), new ecore.Generalization({
	source: {
		id: classes.woman.id
	},
	target: {
		id: classes.person.id
	}
}), new ecore.Generalization({
	source: {
		id: classes.person.id
	},
	target: {
		id: classes.mammal.id
	}
}), new ecore.Association({
	source: {
		id: classes.person.id
	},
	target: {
		id: classes.address.id
	}
}), new ecore.Composition({
	source: {
		id: classes.person.id
	},
	target: {
		id: classes.bloodgroup.id
	}
})];

Object.keys(relations).forEach(function (key) {
	graph.addCell(relations[key]);
});

// automatic layout of the diagram
joint.layout.DirectedGraph.layout(graph, {
	// necessary variables for the autolayout
	dagre: dagre,
	graphlib: dagre.graphlib,
	// any additional options would go here
	nodeSep: 50,
	edgeSep: 80,
	rankDir: "TB" // "TB" / "BT" / "LR" / "RL"
});
