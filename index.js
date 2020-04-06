var graph = new joint.dia.Graph();

var paper = ecore.createClassDiagram();

var classes = {}

classes.mammal = new ecore.EClass({
	name: 'Mammal',
	attributes: ['dob: Date'],
	methods: ['+ setDateOfBirth(dob: Date): Void',
		'+ getAgeAsDays(): Numeric']
});

classes.person = new ecore.EClass({
	name: 'Person',
	attributes: ['firstName: String', 'lastName: String'],
	methods: ['+ setName(first: String, last: String): Void',
		'+ getName(): String']
});

classes.bloodgroup =  new ecore.EClass({
	name: 'BloodGroup',
	attributes: ['bloodGroup: String'],
	methods: ['+ isCompatible(bG: String): Boolean']
});

classes.address = new ecore.EClass({
	name: 'Address',
	attributes: ['houseNumber: Integer', 'streetName: String',
		'town: String', 'postcode: String'],
	methods: []

});

classes.man =  new ecore.EClass({
	name: 'Man'
});

classes.woman = new ecore.EClass({
	name: 'Woman',
	methods: ['+ giveABrith(): Person []']
});

Object.keys(classes).forEach(function (key) {
	graph.addCell(classes[key]);
});

var relations = [new ecore.Generalization({
	source: {
		id: classes.person.id
	},
	target: {
		id: classes.man.id
	}
}), new ecore.Generalization({
	source: {
		id: classes.person.id
	},
	target: {
		id: classes.woman.id
	}
}), new ecore.Generalization({
	source: {
		id: classes.mammal.id
	},
	target: {
		id: classes.person.id
	}
}), new ecore.EReference({
	source: {
		id: classes.person.id
	},
	target: {
		id: classes.address.id
	},
	attrs: Object.assign({}, ecore.containmentRefAttrs, ecore.unidirectionalRefAttrs)
}), new ecore.EReference({
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

// avoid links accross classes on movement
//   this might penalize performance if there are many links
graph.on('change:position', function(cell) {
	Object.keys(relations).forEach(function (key) {
		paper.findViewByModel(relations[key]).update();
	});
});

// automatic layout of the diagram
joint.layout.DirectedGraph.layout(graph, {
	// necessary variables for the autolayout
	dagre: dagre,
	graphlib: dagre.graphlib,
	// any additional options would go here
	nodeSep: 50,
	edgeSep: 80,
	rankDir: "LR" // "TB" / "BT" / "LR" / "RL"
});
