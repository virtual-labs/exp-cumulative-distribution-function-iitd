"use strict";

//HELPER FUNCTIONS
function round(x){
	return Math.round(x*1000)/1000;
}

//GRAPH FUNCTIONS
function distGraph(p1, p2, dist='und', dis=true){
	let x = [], y = [];

	let [start, end] = Limits.get(dist)(p1, p2);
	let freq = (dis? 1: DENSITY), gap = 1/freq;

	start = Math.ceil(start * freq);
	end = Math.trunc(end * freq);

	let total = 0;
	for(let i = start; i <= end && (isFinite(end) || total <= MAXP); i++){
		x.push(i*gap);
		y.push(Dist.get(dist)(i*gap, p1, p2));
		total += y.at(-1);
	}

	return {
		name: "Theoretical",
		x: x, y: y,
		mode: (dis? 'markers': 'lines'),
		type: 'scatter'
	};
}

function randGraph(p1, p2, dist='und', dis=true){
	if(dis){
		const m = new Map();
		for(let i = 0; i < TRIALS; i++){
			let v = Rand.get(dist)(p1, p2);
			let cnt = (m.has(v)? m.get(v): 0);
			m.set(v, cnt+1);
		}
		const x = Array.from(m.keys());
		const y = (Array.from(m.values())).map((x) => x/TRIALS);

		return{
			name: "Randomized",
			type: 'bar',
			x: x, y: y,
			width: 0.4
		}
	}

	const res = [];
	for(let i = 0; i < TRIALS; i++){
		res.push(Rand.get(dist)(p1, p2));
	}

	return {
		name: "Randomized",
		x: res,
		type: 'histogram',
		histnorm: 'probability density'
	};
}

function clteGraph(p1, p2, dist='und', cnt=100, dis=true){
	let x = [];
	for(let i = 0; i < TRIALS; i++){
		x.push(0);
		for(let j = 0; j < cnt; j++){
			x[i] += Rand.get(dist)(p1, p2);
		}
		x[i] /= cnt;
	}

	let trace = {
		name: "Experimental",
		x: x,
		type: 'histogram',
		histnorm: 'probability density'
	}

	if(dis){
		trace['xbins'] = {size: 1/cnt};
	}

	return trace;
}

function cumuGraph(p1, p2, dist='und'){
	return x => {return cDist.get(dist)(x, p1, p2)};
}

//MAIN FUNCTIONS
function validate(choice){
	if(choice == ""){
		throw ("Please choose a distribution.");
	}

	//Validation of inputed parameters
	let p1 = document.getElementById('p1').value;
	let p2 = document.getElementById('p2').value;

	if(p1 == '' || (parameter2.has(choice) && p2 == '')){
		throw ("Please enter the required parameters.");
	}

	if(isNaN(p1) || isNaN(p2)){
		throw ("Please enter only numbers as parameters.");
	}

	p1 = parseFloat(p1);
	p2 = parseFloat(p2);

	if((p1 < 0) && !neg_para.includes(choice+'_p1')){
		throw ("The first parameter must be non-negative.");
	}

	if((p2 < 0) && !neg_para.includes(choice+'_p2')){
		throw ("The second parameter must be non-negative.");
	}

	if((choice == 'geo' || choice == 'bin') && (p1 > 1)){
		throw ("Success probability must be below 1.");
	}

	if(int_para.includes(choice+'_p1') && !(Number.isInteger(p1))){
		throw ("The first parameter must be an integer");
	}

	if(int_para.includes(choice+'_p2') && !(Number.isInteger(p2))){
		throw ("The second parameter must be an integer");
	}

	if((choice == 'unc') && (p1 > p2)){
		throw ("The first parameter must be smaller than or equal to the second parameter")
	}

	if((choice == 'und') && (p1 >= p2)){
		throw ("The first parameter must be smaller than the second parameter")
	}

	return [p1, p2];
}

function CDF(){
	const choice = select.options[select.selectedIndex].value;
	const discrete = disc.includes(choice);

	try{
		const [p1, p2] = validate(choice);
		const [s, e] = Limits.get(choice)(p1, p2);

		const margin = (e - s)/20;

		attributes.boundingbox = [s-margin, 1.1, e+margin, -0.1];

		if(board != null){
			JXG.JSXGraph.freeBoard(board);
		}
		board = JXG.JSXGraph.initBoard('graph', attributes);
		
		board.create('functiongraph', [cumuGraph(p1, p2, choice)], {name: 'plt1'});

		if(discrete){
			const x = [], y = [];
			for(let i = s; i <= e; i++){
				x.push(i);
				y.push(cDist.get(choice)(i, p1, p2));
			}
			board.create('chart', [x, y], {chartStyle:'point', name:'plt2'});
		}
	}catch(err){
		alert(err);
	}
}

function change(){
	let choice = select.options[select.selectedIndex].value;

	const elements = document.getElementsByClassName('hidden');
	while(elements.length > 0) {elements[0].classList.remove('hidden');}

	// Parameters and the labels
	const p1l = document.getElementById('p1l');
	const p1 = document.getElementById('p1');

	const p2l = document.getElementById('p2l');
	const p2 = document.getElementById('p2');

	p1l.innerHTML = "\\( " + parameter1.get(choice) + " = \\)";
	p1.value = default_p1.get(choice);

	if(parameter2.has(choice)){
		p2l.innerHTML = "\\( " + parameter2.get(choice) + " = \\)";
		p2.value = default_p2.get(choice);
	}
	else{
		p2l.classList.add('hidden');
		p2.classList.add('hidden');
	}

	MathJax.typeset([p1l, p2l]);

	// Probability: point, range, cumulative
	const prl = document.getElementById("prl");
	prl.innerHTML = '\\(P(X \\leq x) = \\)';
	MathJax.typeset([prl]);

	document.getElementById('x').value = "";
	document.getElementById('pr').value = "";

	// Function
	const func = document.getElementById('func');
	func.innerHTML = "\\[ " + cumFunc.get(choice) + " \\]";
	MathJax.typeset([func]);
}

function outputCumulativeProbability(){
	const choice = select.options[select.selectedIndex].value;

	try{
		const [p1, p2] = validate(choice);
		let x = document.getElementById('x').value;

		if(isNaN(x)){
			throw ("Please enter a number.");
		}

		document.getElementById('pr').value = (x == ""? "": cDist.get(choice)(parseFloat(x), p1, p2).toFixed(6));
	}catch(e){
		alert(e);
	}
}
