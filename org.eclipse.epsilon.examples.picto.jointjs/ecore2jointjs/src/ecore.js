// custom shapes to visualise ecore diagrams
// TODO: change property names from the original uml ones to adequate ecore ones
ecore = function () {

	var EClass = joint.shapes.basic.Generic.define('ecore.EClass', {
		attrs: {
			rect: { 'width': 200 },

			'.eclass-name-rect': { 'stroke': 'black', 'stroke-width': 1, 'fill': 'white' },
			'.eclass-attrs-rect': { 'stroke': 'black', 'stroke-width': 1, 'fill': 'white' },
			'.eclass-methods-rect': { 'stroke': 'black', 'stroke-width': 1, 'fill': 'white' },

			'.eclass-name-text': {
				'ref': '.eclass-name-rect',
				'ref-y': .5,
				'ref-x': .5,
				'text-anchor': 'middle',
				'y-alignment': 'middle',
				'font-weight': 'bold',
				'fill': 'black',
				// TODO: fix this to a proper font size/style (easier if autosize works!)
				'font-size': 14, 'font-family': 'Times New Roman'
			},
			'.eclass-attrs-text': {
				'ref': '.eclass-attrs-rect', 'ref-y': 5, 'ref-x': 5,
				'fill': 'black',
				'font-size': 12, 'font-family': 'Times New Roman'
			},
			'.eclass-methods-text': {
				'ref': '.eclass-methods-rect', 'ref-y': 5, 'ref-x': 5,
				'fill': 'black',
				'font-size': 12, 'font-family': 'Times New Roman'
			}
		},

		name: [],
		attributes: [],
		methods: []
	}, {
		markup: [
			'<g class="rotatable">',
			'<g class="scalable">',
			'<rect class="eclass-name-rect"/><rect class="eclass-attrs-rect"/><rect class="eclass-methods-rect"/>',
			'</g>',
			'<text class="eclass-name-text"/><text class="eclass-attrs-text"/><text class="eclass-methods-text"/>',
			'</g>'
		].join(''),

		initialize: function () {

			this.on('change:name change:attributes change:methods', function () {
				this.updateRectangles();
				this.trigger('ecore-update');
			}, this);

			this.updateRectangles();

			joint.shapes.basic.Generic.prototype.initialize.apply(this, arguments);
		},

		getClassName: function () {
			return this.get('name');
		},

		updateRectangles: function () {

			var attrs = this.get('attrs');

			var rects = [
				{ type: 'name', text: this.getClassName() },
				{ type: 'attrs', text: this.get('attributes') },
				{ type: 'methods', text: this.get('methods') }
			];

			var offsetY = 0;

			rects.forEach(function (rect) {

				var lines = Array.isArray(rect.text) ? rect.text : [rect.text];
				var rectHeight = lines.length * 20 + 20;

				attrs['.eclass-' + rect.type + '-text'].text = lines.join('\n');
				attrs['.eclass-' + rect.type + '-rect'].height = rectHeight;
				attrs['.eclass-' + rect.type + '-rect'].transform = 'translate(0,' + offsetY + ')';

				offsetY += rectHeight;
			});
		}

	});

	var EClassView = joint.dia.ElementView.extend({

		initialize: function () {

			ElementView.prototype.initialize.apply(this, arguments);

			// TODO: autosize may be achieved in these methods. Investigate
			this.listenTo(this.model, 'ecore-update', function () {
				this.update();
				this.resize();
			});
		}
	});

	// TODO: to make easier the managements of subtypes, the generalizations
	//   should be targeted from the parent to the children
	// (i.e. A -> B should represent  "A supertypeOf B". Right now it's the opposite)
	var Generalization = joint.dia.Link.define('ecore.Generalization', {
		attrs: { '.marker-target': { d: 'M 20 0 L 0 10 L 20 20 z', fill: 'white' } }
	});

	var Composition = joint.dia.Link.define('ecore.Composition', {
		attrs: { '.marker-source': { d: 'M 20 5 L 10 10 L 0 5 L 10 0 z', fill: 'black' } }
	});

	// TODO: divide into unidirectional (with arrow) and bidirectional (without)
	//   Think if maybe we could have a single link defined, and then select
	//   different .marker-source and .marker-target to represent compositions
	//   aggregations, maybe even generalizations, etc.
	// However, having different types could help when parsing the objects / diffing
	var Association = joint.dia.Link.define('ecore.Association');

	return {
		EClass: EClass,
		EClassView: EClassView,
		Generalization: Generalization,
		Composition: Composition,
		Association: Association
	}
}();
