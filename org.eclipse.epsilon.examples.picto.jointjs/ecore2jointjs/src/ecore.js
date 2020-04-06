// custom shapes to visualise ecore diagrams
ecore = function () {

	var EClass = joint.shapes.basic.Generic.define('ecore.EClass', {
		attrs: {
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
				'font-size': 16, 'font-family': 'monospace'
			},
			'.eclass-attrs-text': {
				'ref': '.eclass-attrs-rect', 'ref-y': 7, 'ref-x': 7,
				'fill': 'black',
				'font-size': 14, 'font-family': 'monospace'
			},
			'.eclass-methods-text': {
				'ref': '.eclass-methods-rect', 'ref-y': 7, 'ref-x': 7,
				'fill': 'black',
				'font-size': 14, 'font-family': 'monospace'
			}
		},

		size: { }, // fill this size attribute for autolayout

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

		// automatically called when creating an object
		initialize: function () {
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

			var rectWidth = this.calculateWidth(rects);

			var accumulatedHeight = 0;

			rects.forEach(function (rect) {

				var lines = Array.isArray(rect.text) ? rect.text : [rect.text];
				var rectHeight = lines.length * 14 + 14; // update with font sizes


				attrs['.eclass-' + rect.type + '-text'].text = lines.join('\n');
				attrs['.eclass-' + rect.type + '-rect'].height = rectHeight;
				attrs['.eclass-' + rect.type + '-rect'].width = rectWidth;
				attrs['.eclass-' + rect.type + '-rect'].transform = 'translate(0,' + accumulatedHeight + ')';

				accumulatedHeight += rectHeight;
			});

			// update size (required for autolayout)
			var size = this.get("size");
			size.width = rectWidth;
			size.height = accumulatedHeight;
		},

		calculateWidth: function(rects) {
			var charSize = 8;
			var widthMargin = 40;

			var width = 0;
			rects.forEach(function(rect) {
				if (Array.isArray(rect.text)) {
					for (index = 0; index < rect.text.length; ++index) {
						if (rect.text[index].length * charSize > width) {
							width = rect.text[index].length * charSize;
						}
					}
				}
				else {
					if (rect.text.length * charSize > width) {
						width = rect.text.length * charSize;
					}
				}
			});
			return width + widthMargin;
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
		Generalization: Generalization,
		Composition: Composition,
		Association: Association
	}
}();
