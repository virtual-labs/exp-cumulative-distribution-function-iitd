### What is a Cumulative Distribution Function?
The Cumulative Distribution Function (CDF), of a real-valued random variable X, evaluated at x, is the probability function that X will take a value less than or equal to x. It is used to describe the probability distribution of random variables in a table. And with the help of these data, we can easily create a CDF plot in an excel sheet.

In other words, CDF finds the cumulative probability for the given value. To determine the probability of a random variable, it is used and also to compare the probability between values under certain conditions. For discrete distribution functions, CDF gives the probability values till what we specify and for continuous distribution functions, it gives the area under the probability density function up to the given value specified.

### Cumulative Distribution Function Formula
The CDF defined for a discrete random variable and is given as\
$F_{x}(x)=P(X \leq x)$\
Where X is the probability that takes a value less than or equal to x and that lies in the semi-closed interval (a,b], where a<b.\
Therefore the probability within the interval is written as\
$P(a < X \leq b)=F_{x}(b)-F_{x}(a)$\
The CDF defined for a continuous random variable is given as;\
$F_X(x)=\int_{-\infty}^x f_X(t) d t$\
Here, $X$ is expressed in terms of integration of its probability density function $f_x$.
In case, if the distribution of the random variable $X$ has the discrete component at value $b$,\
$P(X=b)=F_x(b)-\lim _{x \rightarrow b-} F_x(x)$
### Cumulative Distribution Function Properties
The cumulative distribution function $\mathrm{F}_{\mathrm{x}}(\mathrm{x})$ of a random variable has the following important properties:
- Every CDF $F_x$ is non decreasing and right continuous
$\lim _{x \rightarrow-\infty}F_x(x)=0 \text{ and }\lim _{x \rightarrow+\infty}F_x(x)=1$
- For all real numbers $a$ and $b$ with continuous random variable X, then the function $f_x$ is equal to the derivative of $F_x$ , such that
$F_{X}(b)-F_{X}(a)=P(a < X \leq b)=\int_{a}^{b}f_{X}(x)d x$
