var graph = new joint.dia.Graph();

var paper = ecore.createClassDiagram();

var classes = {};
var links = {};

// for greater performance, the diagram is not updated
//   until every element has been created and positioned
paper.freeze();

classes["_Component"] = new ecore.EClass({
	name: 'Component',
	attributes: ['inPorts : Port[*]', 'outPorts : Port[*]', 'action : EString'],
});
classes["_Component"].setFillColor("#c8f0a1");
classes["_NamedElement"] = new ecore.EClass({
	name: 'NamedElement',
	attributes: ['name : EString'],
});
classes["_Port"] = new ecore.EClass({
	name: 'Port',
	attributes: ['type : Type', 'incoming : Connector[*]', 'outgoing : Connector[*]'],
});

Object.keys(classes).forEach(function (key) {
	graph.addCell(classes[key]);
});

index = 0;
constraint = new ecore.Critique();
constraint.setText("NameStartsWithUpperCase:  Component names should start with an upper-case letter ");
constraint.addTo(graph);
constrName = "_Component_c" + index;
index += 1;
links[constrName] = constraint.createLinkFrom(classes._Component);
constraint = new ecore.Constraint();
constraint.setText("AtLeastOnePort:  A component must have at least one port ");
constraint.addTo(graph);
constrName = "_Component_c" + index;
index += 1;
links[constrName] = constraint.createLinkFrom(classes._Component);

doc = new ecore.Documentation();
doc.setText("Components are behavioural blocks that communicate through input and output ports");
doc.addTo(graph);
docName = "_Component_doc";
links[docName] = doc.createLinkFrom(classes._Component);

links["_NamedElement-isSuperTypeOf-_Component"] = new ecore.Generalization({
	source: {
		id: classes._NamedElement.id
	},
	target: {
		id: classes._Component.id
	}
});


links._Component_inPorts = new ecore.EReference({
	source: {
		id: classes._Component.id
	},
	target: {
		id: classes._Port.id
	}
	, labels: [{
		attrs: {
			text: { text: 'inPorts [0..*]' }
		},
		position: {
			offset: 15,
			distance: 0.7
		}
	}]
});
links._Component_inPorts.attr(ecore.unidirectionalRefAttrs);
// append containment attributes
links._Component_inPorts.attr(ecore.containmentRefAttrs);
links._Component_outPorts = new ecore.EReference({
	source: {
		id: classes._Component.id
	},
	target: {
		id: classes._Port.id
	}
	, labels: [{
		attrs: {
			text: { text: 'outPorts [0..*]' }
		},
		position: {
			offset: 15,
			distance: 0.7
		}
	}]
});
links._Component_outPorts.attr(ecore.unidirectionalRefAttrs);
// append containment attributes
links._Component_outPorts.attr(ecore.containmentRefAttrs);

Object.keys(links).forEach(function (key) {
	graph.addCell(links[key]);
});

// automatic layout of the diagram
// https://resources.jointjs.com/docs/jointjs/v3.1/joint.html#layout.DirectedGraph
joint.layout.DirectedGraph.layout(graph, {
	// necessary variables for the autolayout
	dagre: dagre,
	graphlib: dagre.graphlib,
	// any additional options would go here (very good options to parametrize in egx)
	rankSep: 60, // sep between the ranks (each level of top-bottom, left-right, etc.)
	nodeSep: 40, // sep between nodes in a rank
	edgeSep: 20,
	marginX: 5,  // margin with the window borders
	marginY: 5,  // margin with the window borders
	setVertices: true, // fix vertices position in nodes
	setLabels: false, // fix labels position
	rankDir: "TB", // "TB" / "BT" / "LR" / "RL"
	ranker: 'network-simplex' // how to assign ranks to nodes. Others: 'tight-tree' or 'longest-path'
});
paper.unfreeze();
paper.fitToContent();

// link tools setup
Object.keys(links).forEach(function (key) {
	links[key].initTools(paper);
});

paper.on('link:mouseenter', function (linkView) {
	linkView.showTools();
});

paper.on('blank:mouseover', function(linkView) {
	paper.hideTools();
});

// (fonso) COMMENTED UNTIL THE AUTOLAYOUT FUNCTION IMPROVES
// avoid links accross classes on movement
//   this might penalize performance if there are many links
// graph.on('change:position', function (cell) {
// 	// TODO: remove vertices of redrawn links? (with some care)
// 	Object.keys(links).forEach(function (key) {
// 		paper.findViewByModel(links[key]).update();
// 	});
// });
