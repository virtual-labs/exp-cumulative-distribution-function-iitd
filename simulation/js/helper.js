"use strict";

//GLOBAL VARIABLES

//HTML Elements
const select = document.forms['info']['distribution'];
const canvas = document.getElementById('graph');
var board = null;

//Graphstyling
const attributes = {
	axis: true,
	boundingbox: [-5, 1.1, -0.1, 5],
	showcopyright: false,
	pan: {
		needShift: false
	},
	defaultAxes: {
		x: {
			name: "\\(x\\)",
			withLabel: true,
			label: {
				position: 'rt',
				offset: [-10, 10],
				useMathJax: true
			}
		},
		y: {
			name: "\\(P(X\\leq x)\\)",
			withLabel: true,
			label: {
				position: 'rt',
				offset: [10, -20],
				useMathJax: true
			}
		}
	}
};

//Useful constants
const MINP = 0.00001;							//Minimum probability shown
const MAXP = 0.99999;							//Maximum probability shown
const MINP_LOG = Math.log(MINP);				//Minimum probabiliy log
const DENSITY = 1000;							//Density(Number of points per unit) of continuous graphs
const TRIALS = 10000;							//Number of trials of an experiment

//Distribution data
const disc = ['und', 'geo', 'bin', 'poi'];										//Discrete distributions
const cont = ['unc', 'exp', 'gam', 'bet', 'chi', 'nor', 'erl', 'stu'];			//Continuous distributions

const int_para = ['und_p1', 'erl_p1', 'chi_p1', 'stu_p1', 'und_p2', 'bin_p2'];
const neg_para = ['und_p1', 'unc_p1', 'nor_p1', 'und_p2', 'unc_p2'];

const parameter1 = new Map([
	['und', 'a'],
	['geo', 'p'],
	['bin', 'p'],
	['poi', '\\lambda'],
	['unc', 'a'],
	['exp', '\\lambda'],
	['nor', '\\mu'],
	['gam', '\\alpha'],
	['erl', 'k'],
	['bet', '\\alpha'],
	['chi', '\\nu'],
	['stu', '\\nu']
]);

const parameter2 = new Map([
	['und', 'b'],
	['bin', 'n'],
	['unc', 'b'],
	['nor', '\\sigma'],
	['gam', '\\beta'],
	['erl', '\\beta'],
	['bet', '\\beta']
]);

const default_p1 = new Map([
	['und', 0],
	['geo', 0.5],
	['bin', 0.5],
	['poi', 2],
	['unc', 0],
	['exp', 0.5],
	['nor', 0],
	['gam', 2],
	['erl', 2],
	['bet', 2],
	['chi', 2],
	['stu', 1]
]);

const default_p2 = new Map([
	['und', 4],
	['bin', 6],
	['unc', 4],
	['nor', 1],
	['gam', 1],
	['erl', 0.5],
	['bet', 3]
]);

const Limits = new Map([
	['und', function (l=0, r=4){
		return [l, r];
	}],
	
	['geo', function (p=0.5, p2=0){
		let end = Math.round(MINP_LOG/Math.log(p));
		return [0, end];
	}],

	['bin', function (p=0.5, n=6){
		return [0, n];
	}],
	
	['poi', function (l=2, p2=0){
		//return [0, Infinity];
		return [0, 7*Math.pow(l, 0.6)];
	}],
	
	['unc', function (l=0, r=4){
		return [l, r];
	}],
	
	['exp', function (l=0.5, p2=0){
		let end = -MINP_LOG/l;
		return [0, end];
	}],

	['nor', function (u=0, s=1){
		return [jStat.normal.inv(MINP, u, s), jStat.normal.inv(MAXP, u, s)];
	}],

	['gam', function (a=2, b=1){
		return [0, jStat.gamma.inv(MAXP, a, 1/b)];
	}],

	['erl', function (k=2, l=0.5){
		return [0, jStat.gamma.inv(MAXP, k, 1/l)];
	}],

	['bet', function (a=2, b=3){
		let start = jStat.beta.inv(MINP, a, b);
		let end = jStat.beta.inv(MAXP, a, b);
		if(a >= 1) {start = 0};
		if(b >= 1) {end = 1};
		return [start, end];
	}],

	['chi', function (k=2, p2=0){
		let start = jStat.chisquare.inv(MINP, k);
		if(k >= 2) {start = 0};
		return [start, jStat.chisquare.inv(MAXP, k)];
	}],

	['stu', function (v=1, p2=0){
		return [Math.max(-10, jStat.studentt.inv(MINP, v)), Math.min(10, jStat.studentt.inv(MAXP, v))];
	}]
]);

const cDist = new Map([
	['und', function uniformd_cdf(k, l=0, r=4){
		return Math.max(0, Math.min((Math.floor(k) - l + 1)/(r - l + 1), 1));
	}],
	
	['geo', function geometric_cdf(k, p=0.5, p2=0){
		if(k < 0){return 0;}
		return (1 - Math.pow(p, Math.floor(k)+1));
	}],

	['bin', function binomial_cdf(k, p=0.5, n=6){
		return jStat.binomial.cdf(k, n, p);
	}],
	
	['poi', function poisson_cdf(k, l=2, p2=0){
		return jStat.poisson.cdf(k, l);
	}],
	
	['unc', function uniformc_cdf(x, l=0, r=4){
		return Math.max(0, Math.min((x - l)/(r - l), 1));
	}],
	
	['exp', function exponential_cdf(x, l=0.5, p2=0){
		if(x < 0) {return 0}
		return 1 - Math.exp(-l*x);
	}],

	['nor', function normal_cdf(x, u=0, s=1){
		return jStat.normal.cdf(x, u, s);
	}],

	['gam', function gamma_cdf(x, a=2, b=1){
		if(x < 0) {return 0}
		return jStat.gamma.cdf(x, a, 1/b);
	}],

	['erl', function erlang_cdf(x, k=2, l=0.5){
		return cDist.get('gam')(x, k, l);
	}],

	['bet', function beta_cdf(x, a=2, b=1){
		return jStat.beta.cdf(x, a, b);
	}],

	['chi', function chi_squared_cdf(x, k=2, p2=0){
		return cDist.get('gam')(x, k/2, 0.5);
	}],

	['stu', function students_t_cdf(x, v=1, p2=0){
		return jStat.studentt.cdf(x, v);
	}]
]);

const cumFunc = new Map([
	['und', `P(X \\leq x) = 
		\\begin{cases}
			0 & x < a \\\\
			\\frac{\\lfloor x \\rfloor - a + 1}{b - a + 1} & a \\leq x < b \\\\
			1 & b \\leq x
		\\end{cases}`],
	
	['geo', `P(X \\leq x) = 
		\\begin{cases}
			0 & x < 0 \\\\
			1 - p^{\\lfloor x \\rfloor +1} & x \\geq 0
		\\end{cases}`],
	
	['bin', `P(X \\leq x) = \\sum_{r = 0}^{r=x} \\binom{n}{r} \\cdot p^r \\cdot (1 - p)^{n-r}`],
	
	['poi', `P(X \\leq x) = \\sum_{r = 0}^{r=x}  e^{-\\lambda}\\cdot\\dfrac{\\lambda^r}{r!}`],
	
	['unc', `P(X \\leq x) = 
		\\begin{cases}
			0 & x < a \\\\
			\\dfrac{x}{b - a} & x \\in [a, b] \\\\ 
			1 & x > b
		\\end{cases}`],
	
	['exp', `P(X \\leq x) = 
		\\begin{cases}
			0 & x < 0 \\\\
			1 - e^{-\\lambda x} & x \\geq 0
		\\end{cases}`],
	
	['nor', `P(X \\leq x) = 
		\\int_{-\\infty}^{x} \\dfrac{1}{\\sigma\\sqrt{2\\pi}}\\cdot e^{-\\frac{1}{2}\\left(\\frac{t-\\mu}{\\sigma}\\right)^2} dt`],
	
	['gam', `P(X \\leq x) = 
		\\begin{cases}
			0 & x < 0 \\\\
			\\displaystyle \\int_{0}^{x} \\dfrac{t^{\\alpha-1}e^{-\\beta t}\\beta^\\alpha}{\\Gamma(\\alpha)} dt & x \\geq 0
		\\end{cases}`],

	['erl', `P(X \\leq x) = 
		\\begin{cases}
			0 & x < 0 \\\\
			\\displaystyle \\int_{0}^{x} \\dfrac{t^{k-1}e^{-\\beta t}\\beta^k}{\\Gamma(k)} dt & x \\geq 0
		\\end{cases}`],
	
	['bet', `P(X \\leq x) = 
		\\begin{cases}
			0 & x < 0 \\\\
			\\displaystyle \\int_{0}^{x} \\dfrac{t^{\\alpha-1}(1-t)^{\\beta-1}}{B(\\alpha, \\beta)} dt & x \\in [0, 1] \\\\
			1 & x > 1
		\\end{cases}`],

	['chi', `P(X \\leq x) = 
		\\begin{cases}
			0 & x < 0 \\\\
			\\displaystyle \\int \\dfrac{x^{k/2 - 1}e^{-x/2}}{2^{k/2}\\cdot\\Gamma(k/2)} & x \\geq 0
		\\end{cases}`],

	['stu', `P(X \\leq x) = 
		\\int_{-\\infty}^{x} \\dfrac{\\Gamma\\left((\\nu+1)/2\\right)}{\\sqrt{\\nu\\pi}\\ \\Gamma(\\nu/2)}\\left(1 + \\dfrac{t^2}{\\nu}\\right)^{-(v+1)/2} dt`]
]);