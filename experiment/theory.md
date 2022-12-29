### What is a Cumulative Distribution Function?
Let $X$ be a real random variable. The function $F_X$ defined over $\mathbb{R}$ through\
$F_X(x)  :=P_X((-\infty, x])=P(X \leq x)$\
is called the distribution function (or cumulative distribution function (cdf)) of the random variable $X$.

### Cumulative Distribution Function Properties
Let $X$ be a real random variable defined over $(\Omega, \Im, P)$. The distribution function $F_X$ satisfies the following conditions:
1. If $x < y$, then $F_X(x) \leq  F_X(y)$.
2. $F_X\left(x^{+}\right):=\lim _{h \rightarrow 0^{+}} F_X(x+h)=F_X(x) \quad$ for all $x \in \mathbb{R}$.
3. $\lim _{x \rightarrow \infty} F_X(x)=1$.
4. $\lim _{x \rightarrow-\infty} F_X(x)=0$.
