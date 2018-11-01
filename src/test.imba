# ivar namespace.instance.identifier

var monarch = require('./monarch')
var languages = require('./monaco/languages')

import Theme from './theme'

var raw = Theme.toMonaco
var inv = Theme:inverted
export var theme = monarch.TokenTheme.createFromRawTokenTheme(raw:rules)

var css = []

var colors = {
	dark: {}
	light: {}
}

for color,i in theme.getColorMap when i > 0
	colors:dark[i] = color
	if inv[color]
		colors:light[i] = inv[color]
	css.push ".tok{i} \{ color: {color}; \}"
	if inv[color]
		css.push ".mlight .tok{i} \{ color: {inv[color]}; \}"

var cache = {}
var aliases = {
	js: 'javascript'
	jsx: 'javascript'
	ts: 'typescript'
	md: 'markdown'
}
var styleElement
	
export def styles
	css

var registeredLanguages = {}

export def getLanguage lang
	if $web$ and !styleElement
		styleElement = document.createElement('style')
		styleElement:innerHTML = css.join("\n")
		document:head.appendChild(styleElement)
	
	lang = aliases[lang] or lang
	
	if registeredLanguages[lang]
		return registeredLanguages[lang]
	if languages[lang]
		monarch.register(lang,languages[lang]:language:language)
		return registeredLanguages[lang] = true
	return false
		

export def tokenize lang, code, options = {}
	lang = aliases[lang] or lang

	# if $node$ and options:decorate and lang == 'imba'
	# 	# not on the web -- for now
	# 	var compiler = require 'imba/compiler'
	# 	var helpers = require 'imba/lib/compiler/helpers'
	# 	let analysis = compiler.analyze(code,{target: 'web'})
	# 	var locmap = helpers.locationToLineColMap(code)
	# 	var vars = []
	# 	for scope in analysis:scopes
	# 		for item in scope:vars
	# 			for ref in item:refs
	# 				let loc = locmap[ref:loc[0]].concat('identifier.l' + item:type)
	# 				vars.push(loc)
	# 	
	# 	vars = vars.sort do |a,b|
	# 		if a[0] == b[0]
	# 			a[1] - b[1]
	# 		else
	# 			a[0] - b[0]
	# 	
	# 	# console.log "decorations",vars
	# 
	# 	options:decorations = vars
	
	# make sure language exists?
	unless getLanguage(lang)
		console.log "could not find language"
		code = code.replace(/\"/g,"&quot;") if code.indexOf('"') >= 0
		code = code.replace(/\</g,"&lt;") if code.indexOf('<') >= 0
		code = code.replace(/\>/g,"&gt;") if code.indexOf('>') >= 0
		return code
	
	var theme = options:theme
	var decorations = (options:decorations or []).slice
	var lexer = monarch.getLexer(lang)
	var types = theme ? null : []
	var map = {}
	var state = lexer.getInitialState
	var lines = []
	var dec = decorations.shift
	
	
	for line,ln in code.split('\n')
		var result = lexer.tokenize(line,state,0)
		let tokens = result:tokens.filter do |tok| tok:type.indexOf("white") == -1
		let offset = 0
		let lstr = ""

		for token,i in tokens
			# skip whitespace
			let tref
			
			# console.log ln,token:offset,token:type
			if dec and dec[0] == ln and dec[1] == token:offset
				# console.log "found decoration!!!",dec
				token:type = dec[2]
				dec = decorations.shift
	
			let next = tokens[i + 1]
			if theme
				tref = theme._match(token:type)
				tref = tref:_foreground
			else
				let type = token:type.replace(/\./g,' ').replace(lang,'').trim
				tref = map[type]
				if tref == undefined
					tref = map[type] = (types.push(type) - 1)

			let end = next ? next:offset : line:length
			lstr += String.fromCharCode(64 + tref)
			let move = (end) - offset
			lstr += String.fromCharCode(64 + move)
			offset += move
		
		state = result:endState
		lines.push(lstr)
	
	return [code,lines.join('\n'),types]

export def jsonify code, lineCount = 30
	var out = ""
	
	var raw = code[0]
	var tokens = code[1].split('\n')
	var types = code[2]
	
	var i = 0
	var start = 0
	var l = tokens:length
	var lines = raw.split('\n')
	
	var out = []
	
	for line,li in lines
		let start = 0
		let desc = tokens[li]

		let k = 0
		let type
		let color

		while k < desc:length
			let code = desc.charCodeAt(k++) - 64			
			if k % 2 == 0 # move
				let content = line.slice(start,start = start + code)
				out.push([content,color])
			else
				type = code
				color = colors:dark[code]
		out.push(['\n',{}])
	
	return out

export def htmlify code, lineCount = 30
	var out = ""
	
	var raw = code[0]
	var tokens = code[1].split('\n')
	var types = code[2]
	
	var i = 0
	var start = 0
	var l = tokens:length
	var lines = raw.split('\n')
	
	var out = []
	
	for line,li in lines
		let start = 0
		let desc = tokens[li]
		let k = 0
		let s = "<span class='line'>"
		while k < desc:length
			let code = desc.charCodeAt(k++) - 64			
			if k % 2 == 0 # move
				let content = line.slice(start,start = start + code)
				s += content.replace(/\</g,'&lt;').replace(/\>/g,'&gt;')
				s += '</span>'
			else
				s += '<span class="'+(types ? types[code] : ('tok'+code)) +'">'
		s += "</span>"
		out.push(s)
	
	return out.join('\n')

export def highlight code, lang, options = {}
	lang = aliases[lang] or lang
	let langconf = getLanguage(lang)
	unless langconf
		# return htmlify([code])
		return code 
	options:theme ?= theme
	var tokens = tokenize(lang,code,options)
	return options:json ? jsonify(tokens) : htmlify(tokens)

def test code
	highlight(code,'imba',json: true)

console.log JSON.stringify(test("var hello = 1;"))
