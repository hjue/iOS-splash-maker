﻿var use = {	'iPhone': 'yes',	'iPhone:retina': 'yes',	'iPad': 'no',	'iPad:retina': 'no'};/** * *	iPad: *	- Retina: 1536x2048px (portrait) / 2048x1536px (landscape) *	- Non-retina: 768x1004px (portrait) / 1024x748px (landscape) * *	iPhone/iPod: *	- iPhone5: 640x1136px *	- Retina: 640x960px *	- Non-retina: 320x480px * */Array.prototype.contains = function (item) {	for (var n = this.length; n--;) {		if (item === this[n]) {			return true;		}	}	return false;};String.prototype.contains = function (item) {	return this.indexOf(item) > -1;};// set sizesvar sizes = []; // array-ified object to maintain orderif (doUse('iPad:retina')) {	sizes.push(		['iPad_retina', [1536, 2048]],		['iPad_retina_landscape', [2048, 1536]]	);}if (doUse('iPad')) {	sizes.push(		['iPad', [768, 1004]],		['iPad_landscape', [1024, 748]]	);}if (doUse('iPhone:retina')) {	sizes.push(		['iPhone5_retina', [640, 1136]],		['iPhone_retina', [640, 960]]	);}if (doUse('iPhone')) {	sizes.push(		['iPhone', [320, 480]]	);}$.level = 2; // debug// varsvar doc = app.activeDocument,	doc_height = parse(doc.height),	doc_width = parse(doc.width),	sorted_sizes = [		[], // landscape_retina		[], // portrait_retina		[], // landscape		[]  // portrait	],	group_content = doc.layerSets.getByName('content'),	size_count = sizes.length,	original_size,	saved_sizes = [];// get largest size, make sure it's large enoughvar max_height = 0;var max_width = 0;for (var n = size_count; n--;) {	var dims = sizes[n][1];	if (dims[0] > max_width) {		max_width = dims[0];	}	if (dims[1] > max_height) {		max_height = dims[1];	}}original_size = [max_width, max_height];// check for proper starting document sizeif (doc_width !== original_size[0] || doc_height !== original_size[1]) {	throw new Error('Expected document to be [' + original_size[0] + 'px × ' + original_size[1] + 'px], given [' + doc_width + 'px × ' + doc_height + 'px]');}// transform sizes object into portrait and landscape arrays for conveniencefor (var j = size_count; j--;) {	var size = sizes[j];	var label = size[0];	var isLandscape = label.contains('landscape');	var isRetina = label.contains('retina');	if (isLandscape && isRetina) {		sorted_sizes[0].push(size); // landscape, retina	} else if (isRetina) {		sorted_sizes[1].push(size); // portrait, retina	} else if (isLandscape) {		sorted_sizes[2].push(size); // landscape, non-retina	} else {		sorted_sizes[3].push(size); // portrait, non-retina	}	}// save portraitsfor (var k = 0, kk = sorted_sizes.length; k < kk; k++) {	var set = sorted_sizes[k];	for (var n = set.length; n--;) {		var size = set[n];		// resize				if (k === 0 || k === 1) {						// retina			doc.resizeCanvas(size[1][0], size[1][1], AnchorPosition.MIDDLECENTER);		} else {			// non-retina			doc.resizeImage(size[1][0], size[1][1]);		}		// Save for Web options		opts = new ExportOptionsSaveForWeb();		opts.format = SaveDocumentType.PNG;		opts.PNG8 = false;		// Save it		file = new File(doc.path + '/' + size[0] + '.png');		doc.exportDocument(file, ExportType.SAVEFORWEB, opts);		saved_sizes.push(size[0]);	}}alert('Done! Generated splash screens for ' + saved_sizes.join(', '));// helpersfunction parse (string) {	return parseInt(string, 10);}function doUse (what) {	return use[what] && use[what] === 'yes';}