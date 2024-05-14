# Cumulative Distribution Function (CDF)

## Introduction

In probability theory and statistics, the Cumulative Distribution Function (CDF) is a fundamental concept used to describe the distribution of a random variable. It provides a way to quantify the probability that a random variable takes on a value less than or equal to a given value. This document aims to explore the theory behind CDFs, their properties, and their applications, along with examples to illustrate key concepts.

## Definition

The Cumulative Distribution Function \( F(x) \) of a random variable \( X \) is defined as the probability that \( X \) takes on a value less than or equal to \( x \), i.e.,

\[ F(x) = P(X \leq x) \]

The CDF is non-decreasing, ranging from 0 to 1 as \( x \) varies from negative infinity to positive infinity.

## Properties

1. **Non-decreasing**: As \( x \) increases, \( F(x) \) can never decrease.
2. **Right-Continuous**: \( F(x) \) is right-continuous, meaning that the limit of \( F(x) \) as \( x \) approaches a particular value from the right is equal to \( F(x) \) at that value.
3. **Limits**: \( \lim_{x \to -\infty} F(x) = 0 \) and \( \lim_{x \to +\infty} F(x) = 1 \).
4. **Probability Interpretation**: The value of \( F(x) \) at any point represents the probability that the random variable is less than or equal to that point.

## Mathematical Representation

The CDF can be represented mathematically in various forms depending on the distribution of the random variable. For example, for a continuous random variable, the CDF can be expressed as an integral of the probability density function (PDF):

\[ F(x) = \int_{-\infty}^{x} f(t) \, dt \]

Where \( f(t) \) is the probability density function.

For a discrete random variable, the CDF is the sum of probabilities up to the given value:

\[ F(x) = \sum_{t \leq x} P(X = t) \]

## Example: Discrete Random Variable

Consider a discrete random variable \( X \) representing the outcome of rolling a fair six-sided die. The probability mass function (PMF) of \( X \) is given by:

\[ P(X = x) = \frac{1}{6} \]

for \( x = 1, 2, 3, 4, 5, 6 \). The CDF \( F(x) \) for this random variable can be calculated as follows:

\[ F(x) = \sum_{t \leq x} P(X = t) \]

\[ F(x) = \sum_{t=1}^{x} \frac{1}{6} \]

For example, the CDF at \( x = 3 \) would be:

\[ F(3) = \frac{1}{6} + \frac{1}{6} + \frac{1}{6} = \frac{3}{6} = \frac{1}{2} \]

## Example: Continuous Random Variable

Consider a continuous random variable \( Y \) following a standard normal distribution with mean \( \mu = 0 \) and standard deviation \( \sigma = 1 \). The CDF \( F(x) \) of this distribution, denoted as \( \Phi(x) \), can be calculated using numerical methods or looked up in standard statistical tables.

For example, the CDF at \( x = 1 \) can be computed using numerical integration:

\[ F(1) = \int_{-\infty}^{1} \frac{1}{\sqrt{2\pi}} e^{-\frac{t^2}{2}} \, dt \]

In this example, the CDF at \( x = 1 \) is approximately 0.8413, indicating that there is a probability of 0.8413 that a randomly selected value from this distribution is less than or equal to 1.

## Applications

1. **Probability Calculations**: CDFs are commonly used to compute probabilities of events involving random variables.
2. **Statistical Inference**: In statistical inference, CDFs play a crucial role in hypothesis testing, confidence interval estimation, and model fitting.
3. **Risk Assessment**: CDFs are utilized in risk assessment to analyze the probability of certain outcomes in areas such as finance, engineering, and environmental science.

