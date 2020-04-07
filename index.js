var graph = new joint.dia.Graph();

var paper = ecore.createClassDiagram();

var classes = {}

var classes = {};
var relations = {};
var doc, constraint;

classes["_NamedElement"] = new ecore.EClass({
	name: 'NamedElement',
	attributes: ['name : EString'],
});
classes["_Model"] = new ecore.EClass({
	name: 'Model',
	attributes: ['components : Component[*]', 'connectors : Connector[*]', 'types : Type[*]'],
});
classes["_Component"] = new ecore.EClass({
	name: 'Component',
	attributes: ['inPorts : Port[*]', 'outPorts : Port[*]', 'action : EString'],
});
classes["_Port"] = new ecore.EClass({
	name: 'Port',
	attributes: ['type : Type', 'incoming : Connector[*]', 'outgoing : Connector[*]'],
});
classes["_Connector"] = new ecore.EClass({
	name: 'Connector',
	attributes: ['from : Port', 'to : Port'],
});
classes["_Type"] = new ecore.EClass({
	name: 'Type',
	attributes: [],
});

Object.keys(classes).forEach(function (key) {
	graph.addCell(classes[key]);
});


doc = new ecore.Documentation();
doc.setText("Abstract class for named elements");
doc.addTo(graph);
doc.createLinkFrom(classes._NamedElement).addTo(graph);



doc = new ecore.Documentation();
doc.setText("Root entity that contains components, connectors and ports");
doc.addTo(graph);
doc.createLinkFrom(classes._Model).addTo(graph);

relations["_NamedElement-isSuperTypeOf-_Model"] = new ecore.Generalization({
	source: {
		id: classes._NamedElement.id
	},
	target: {
		id: classes._Model.id
	}
});

constraint = new ecore.Critique();
constraint.setText("NameStartsWithUpperCase:  Component names should start with an upper-case letter ");
constraint.addTo(graph);
constraint.createLinkFrom(classes._Component).addTo(graph);
constraint = new ecore.Constraint();
constraint.setText("AtLeastOnePort:  A component must have at least one port ");
constraint.addTo(graph);
constraint.createLinkFrom(classes._Component).addTo(graph);

doc = new ecore.Documentation();
doc.setText("Components are behavioural blocks that communicate through input and output ports");
doc.addTo(graph);
doc.createLinkFrom(classes._Component).addTo(graph);

relations["_NamedElement-isSuperTypeOf-_Component"] = new ecore.Generalization({
	source: {
		id: classes._NamedElement.id
	},
	target: {
		id: classes._Component.id
	}
});

constraint = new ecore.Critique();
constraint.setText("NameStartsWithLowerCase:  Port names should start with a lower case letter ");
constraint.addTo(graph);
constraint.createLinkFrom(classes._Port).addTo(graph);

doc = new ecore.Documentation();
doc.setText("Ports are used to model the input and output of components");
doc.addTo(graph);
doc.createLinkFrom(classes._Port).addTo(graph);

relations["_NamedElement-isSuperTypeOf-_Port"] = new ecore.Generalization({
	source: {
		id: classes._NamedElement.id
	},
	target: {
		id: classes._Port.id
	}
});

constraint = new ecore.Constraint();
constraint.setText("ConnectsPortsWithSameType:  A connector must connect ports of the same type ");
constraint.addTo(graph);
constraint.createLinkFrom(classes._Connector).addTo(graph);

doc = new ecore.Documentation();
doc.setText("Connectors connect ports of components");
doc.addTo(graph);
doc.createLinkFrom(classes._Connector).addTo(graph);



doc = new ecore.Documentation();
doc.setText("Types of ports. The name should be a valid type name in the target programming language.");
doc.addTo(graph);
doc.createLinkFrom(classes._Type).addTo(graph);

relations["_NamedElement-isSuperTypeOf-_Type"] = new ecore.Generalization({
	source: {
		id: classes._NamedElement.id
	},
	target: {
		id: classes._Type.id
	}
});


relations._Model_components = new ecore.EReference({
	source: {
		id: classes._Model.id
	},
	target: {
		id: classes._Component.id
	},
	attrs: ecore.unidirectionalRefAttrs
});
// append containment attributes
relations._Model_components.attr(ecore.containmentRefAttrs);
relations._Model_connectors = new ecore.EReference({
	source: {
		id: classes._Model.id
	},
	target: {
		id: classes._Connector.id
	},
	attrs: ecore.unidirectionalRefAttrs
});
// append containment attributes
relations._Model_connectors.attr(ecore.containmentRefAttrs);
relations._Model_types = new ecore.EReference({
	source: {
		id: classes._Model.id
	},
	target: {
		id: classes._Type.id
	},
	attrs: ecore.unidirectionalRefAttrs
});
// append containment attributes
relations._Model_types.attr(ecore.containmentRefAttrs);
relations._Component_inPorts = new ecore.EReference({
	source: {
		id: classes._Component.id
	},
	target: {
		id: classes._Port.id
	},
	attrs: ecore.unidirectionalRefAttrs
});
// append containment attributes
relations._Component_inPorts.attr(ecore.containmentRefAttrs);
relations._Component_outPorts = new ecore.EReference({
	source: {
		id: classes._Component.id
	},
	target: {
		id: classes._Port.id
	},
	attrs: ecore.unidirectionalRefAttrs
});
// append containment attributes
relations._Component_outPorts.attr(ecore.containmentRefAttrs);
relations._Port_type = new ecore.EReference({
	source: {
		id: classes._Port.id
	},
	target: {
		id: classes._Type.id
	},
	attrs: ecore.unidirectionalRefAttrs
});
relations._Port_incoming = new ecore.EReference({
	source: {
		id: classes._Port.id
	},
	target: {
		id: classes._Connector.id
	}
});
relations._Port_outgoing = new ecore.EReference({
	source: {
		id: classes._Port.id
	},
	target: {
		id: classes._Connector.id
	}
});

Object.keys(relations).forEach(function (key) {
	graph.addCell(relations[key]);
});

// (fonso) COMMENTED UNTIL THE AUTOLAYOUT FUNCTION IMPROVES
// // avoid links accross classes on movement
// //   this might penalize performance if there are many links
// graph.on('change:position', function (cell) {
// 	Object.keys(relations).forEach(function (key) {
// 		paper.findViewByModel(relations[key]).update();
// 	});
// });

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

paper.fitToContent({
	padding: 50
});
