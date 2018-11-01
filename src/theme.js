function iter$(a){ return a ? (a.toArray ? a.toArray() : a) : []; };

var Theme = exports.Theme = {
	base: 'vs-dark', // can also be vs-dark or hc-black
	inherit: false, // can also be false to completely replace the builtin rules
	
	inverted: {
		'#d9bb73': '#b78100',
		'#a7c9de': '#2e5f7d',
		'#dcdcdc': '#464646',
		'#598da6': '#415e98',
		'#ea9b80': '#a21e1e',
		'#75aaff': '#3360a7',
		'#d4d4d4': '#4d5155',
		'#5d6e7a': '#888888',
		'#7da4b7': '#146186', // string
		'#bd9ac2': '#91359e'
	},
	
	named: {
		TAG: 'D9BB73',
		background: '282f33',
		foreground: 'D4D4D4',
		keyword: 'ea9b80',
		operator: 'ea9b80',
		string: 'B7DE95',
		number: '598DA6',
		bool: '598DA6',
		symbol: 'B7DE95',
		regex: 'FD9231',
		regexgroup: 'FFB26D',
		comment: '5D6E7A',
		constant: 'BD9AC2',
		identifier: 'd4d4d4',
		xml: 'D9BB72',
		xmlref: 'd2845f',
		decl: '75AAFF',
		key: 'a7c9de',
		lineNumber: '3b4750',
		agentCursor: '89b0fc',
		localCursor: 'ffe796',
		lvar: 'dcdbc7',
		limport: '91b7ea',
		
		string: '7da4b7',
		tagbase: '@TAG',
		tagname: '@TAG',
		tagstr: 'a0c6ca',
		tagop: 'd17e53',
		tagbracket: '8e7f54',
		tagattr: '@TAG',
		tagmodifier: 'd99372',
		taglistener: 'd99372',
		special: 'ffdb59'
	},
	
	
	toMonaco: function() {
		var json = JSON.stringify(this);
		var named = this.named;
		json = json.replace(/@(\w+)/g,function(m,key) {
			let val = named[key];
			
			while (val[0] == '@'){
				val = named[val.slice(1)] || '';
			};
			
			if (val instanceof Array) {
				val = val[0];
			};
			
			if (val[0] == '#') {
				val = val.slice(1);
			};
			
			return val || m;
			// named[key] or m
		});
		
		return JSON.parse(json);
	},
	
	toTheme: function() {
		var v_, $1;
		var theme = this.toMonaco();
		var colors = theme.tokenColors = [];
		for (let i = 0, items = iter$(theme.rules), len = items.length, rule; i < len; i++) {
			rule = items[i];
			if (!rule.foreground) { continue; };
			
			let item = {
				name: rule.token,
				scope: rule.token,
				settings: {
					foreground: '#' + rule.foreground
				}
			};
			colors.push(item);
		};
		
		(((v_ = theme.rules),delete theme.rules, v_));
		((($1 = theme.colors),delete theme.colors, $1));
		theme.type = 'dark';
		theme.name = "Imba Dark";
		return theme;
	},
	
	rules: [
		{token: '',foreground: '@foreground',background: '@background'},
		{token: 'invalid',foreground: 'f44747'},
		{token: 'emphasis',fontStyle: 'italic'},
		{token: 'strong',fontStyle: 'bold'},
		
		{token: 'variable',foreground: '74B0DF'},
		{token: 'variable.predefined',foreground: '@keyword'},
		{token: 'variable.parameter',foreground: '9CDCFE'},
		{token: 'identifier',foreground: '@identifier'},
		{token: 'identifier.const',foreground: '@constant'},
		{token: 'identifier.const.class',foreground: '@decl'},
		{token: 'identifier.class',foreground: '@decl'},
		{token: 'identifier.const.tag',foreground: '@decl'},
		{token: 'identifier.decl',foreground: '@decl'},
		{token: 'identifier.tag',foreground: '@decl'},
		{token: 'identifier.def',foreground: '@decl'},
		{token: 'identifier.key',foreground: '@key'},
		{token: 'identifier.env',foreground: '@keyword'},
		{token: 'identifier.special',foreground: '@special'},
		{token: 'identifier.import',foreground: '@limport'},
		{token: 'entity.name.type',foreground: '@decl'},
		{token: 'entity.name.function',foreground: '@decl'},
		{token: 'entity.name.tag',foreground: '@xml'},
		
		{token: 'storage.type.function',foreground: '@keyword'},
		{token: 'storage.type.class',foreground: '@keyword'},
		
		{token: 'comment',foreground: '@comment'},
		{token: 'operator',foreground: '@operator'},
		{token: 'number',foreground: '@number'},
		{token: 'number.hex',foreground: '@number'},
		{token: 'numeric.css',foreground: '@number'},
		{token: 'regexp',foreground: '@regex'},
		{token: 'regexp.escape',foreground: '@regexgroup'},
		{token: 'annotation',foreground: 'cc6666'},
		{token: 'type',foreground: '3DC9B0'},
		{token: 'boolean',foreground: '@bool'},
		
		{token: 'constant.numeric',foreground: '@number'},
		{token: 'constant.language.boolean',foreground: '@bool'},
		
		{token: 'delimiter',foreground: 'DCDCDC'},
		{token: 'delimiter.access.imba',foreground: 'DCDCDB'},
		{token: 'delimiter.html',foreground: '808080'},
		{token: 'delimiter.xml',foreground: '808080'},
		{token: 'delimiter.eq.tag',foreground: 'ea9b7c'},
		
		{token: 'tag',foreground: '@tagbase'},
		{token: 'tag.name',foreground: '@tagname'},
		{token: 'tag.open',foreground: '@tagbracket'},
		{token: 'tag.close',foreground: '@tagbracket'},
		{token: 'tag.attribute',foreground: '@tagattr'},
		{token: 'tag.attribute.listener',foreground: '@taglistener'},
		{token: 'tag.attribute.modifier',foreground: '@tagmodifier'},
		{token: 'paren.open.tag',foreground: '@taglistener'},
		{token: 'paren.close.tag',foreground: '@taglistener'},
		
		{token: 'meta.scss',foreground: 'A79873'},
		{token: 'meta.tag',foreground: '@xml'},
		{token: 'metatag',foreground: 'DD6A6F'},
		{token: 'metatag.content.html',foreground: '9CDCFE'},
		{token: 'metatag.html',foreground: '569CD6'},
		{token: 'metatag.xml',foreground: '569CD6'},
		{token: 'metatag.php',fontStyle: 'bold'},
		
		{token: 'key',foreground: '@key'},
		{token: 'string.key.json',foreground: '9CDCFE'},
		{token: 'string.value.json',foreground: 'CE9178'},
		
		{token: 'attribute.name',foreground: '@key'},
		{token: 'attribute.value',foreground: '@number'},
		{token: 'attribute.value.number.css',foreground: '@number'},
		{token: 'attribute.value.unit.css',foreground: '@number'},
		{token: 'attribute.value.hex.css',foreground: '@number'},
		
		{token: 'string',foreground: '@string'},
		{token: 'string.sql',foreground: '@string'},
		
		{token: 'keyword',foreground: '@keyword'},
		{token: 'keyword.flow',foreground: '@keyword'},
		{token: 'keyword.json',foreground: '@keyword'},
		{token: 'keyword.flow.scss',foreground: '@keyword'},
		
		{token: 'operator.scss',foreground: '909090'},
		{token: 'operator.sql',foreground: '778899'},
		{token: 'operator.swift',foreground: '909090'},
		{token: 'predefined.sql',foreground: 'FF00FF'},
		
		// css
		{token: "entity.name.selector.css",foreground: '@xml'},
		{token: "support.type.property-name.css",foreground: '@decl'},
		{token: "meta.object-literal.key",foreground: '@key'}
	],
	colors: {
		'foreground': '#@foreground',
		'editor.background': '#282f33',
		'editorGutter.background': '#282f33',
		'editor.selectionBackground': '#30455f', // #33393f
		'editorLineNumber.foreground': '#5D6E7A',
		'editorWidget.background': '#383d47', // #20262a
		'editorWidget.border': '#20262a',
		'widget.shadow': '#00000000',
		'list.focusBackground': '#33393f',
		'list.hoverBackground': '#282f33',
		'list.highlightForeground': '#ffffff',
		'input.foreground': '#ffffff',
		'input.background': '#2d3139',
		'input.border': '#262b35',
		'editorSuggestWidget.foreground': '#@foreground',
		'editorHoverWidget.background': '#20262a',
		'editorCursor.foreground': '#@agentCursor'
	}
};

if (false) {};
