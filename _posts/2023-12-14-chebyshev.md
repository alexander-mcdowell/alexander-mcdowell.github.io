---
layout: post
title:  "Application of Chebyshev Polynomials to the Rational Equation x^k + x^-k"
katex: true
---

### A study of Chebyshev Polynomials and their seemingly unexpected application to the polynomial $$x^k + x^{-k}$$

This blog post was written as a result of a shower thought I had about a simple problem from high-school algebra. In concerns the representations of $$x^k + x^{-k}$$ as a polynomial with integer coefficients and is inspired by problems one might have seen in high-school mathematics competitions.

<br>

---

<br>

## Studying $$x^k + \dfrac{1}{x^k}$$

The fundamental problem we wish to study is this:

> Let $$k\in \mathbb{N}$$, $$x \in \mathbb{R}$$, and $$C\in \mathbb{R}$$. Suppose $$x$$ solves the following rational equation:
<p align="center">
    $$\large{\displaystyle x + \frac{1}{x} = C}$$
</p>
> We assume that $$C$$ is chosen such that the above equation permits real roots. How can we represent $$x^k + x^{-k}$$ in terms of $$C$$?

Well, to start, we can try looking at the first few values of $$k$$ in order to understand the types of representations $$x^k + x^{-k}$$ permits.

- If $$k=0$$, then $$1 + \dfrac{1}{1} = 2$$ and so this value of $$k$$ yields a *constant* representation.

- If $$k=1$$, then $$x + \dfrac{1}{x} = C$$ and so this value of $$k$$ yields a *linear* representation.

- If $$k=2$$, then $$x^2 + \dfrac{1}{x^2} = \left(x + \dfrac{1}{x}\right)^2 - 2 = C^2 - 2$$ and so this value of $$k$$ yields a *quadratic* representation.

From these initial cases, it apppears that $$x^k + \frac{1}{x^k}$$ can be represented as a degree-$$k$$ polynomial with integer coefficients and evaluated at $$C$$. However, just three examples is not sufficient to establish such a generalization, so let us prove this result more formally.

**Conjecture**: *Suppose* $$x + \frac{1}{x} = C$$ *is satisfied for a given* $$C\in \mathbb{R}$$ *and for some* $$x\in \mathbb{R}$$. *Then there exists some polynomial with integer-valued coefficients* $$p(x) \in \mathbb{Z}[x]$$ *such that* $$x^k + \frac{1}{x^k} = p(C).$$

> Proof: This isn't so hard to demonstrate. Consider $$x^{k-1} + \frac{1}{x^{k-1}}$$. Multiplying this expression by $$x + \frac{1}{x}$$ yields $$(x^{k-1} + \frac{1}{x^{k-1}})(x + \frac{1}{x}) = x^k + x^{k-2} + \frac{1}{x^{k-2}} + \frac{1}{x^{k}}$$.

> If we assume that $$x^k + \frac{1}{x^k} = p_k(C)$$ for some polynomial $$p_k(x) \in \mathbb{Z}[x]$$ chosen based on $$k$$, then it follows that $$p_k(C) = Cp_{k-1}(C) - p_{k-2}(C)$$.

> Since $$p_0(C) = 2$$ and $$p_1(C) = C$$, we can apply this inductive step into order to show that $$p_k(C)$$ for every non-negative integer $$k$$.

What we have just demonstrated is an extremely useful recurrence relation which we can use to derive polynomial representations for larger values of $$k$$.

<p align="center">
    $$\large{\displaystyle \boxed{p_k(x) = Cp_{k-1}(x) - p_{k-2}(x)}}$$
</p>

- For $$k=3$$, we have $$p_3(C) = Cp_2(C) - p_1(C) = C(C^2 - 2) - (C)$$ so $$p_3(C) = C^3 - 3C$$ and thus $$x^3 + \dfrac{1}{x^3} = C^3 - 3C$$.

- For $$k=4$$, we have $$p_4(C) = Cp_3(C) - p_2(C) = C(C^3 - 3C) - (C^2 - 2)$$ so $$p_4(C) = C^4 - 4C^2 + 2$$ and thus $$x^4 + \dfrac{1}{x^4} = C^4 - 4C^2 + 2$$.

- For $$k=5$$, we have $$p_5(C) = Cp_4(C) - p_3(C) = C(C^4 - 4C^2 + 2) - (C^3 - 3C)$$ so $$p_4(C) = C^5 - 5C^3 + 5C$$ and thus $$x^5 + \dfrac{1}{x^5} = C^5 - 5C^3 + 5C$$.

- For $$k=6$$, we have $$p_6(C) = Cp_5(C) - p_4(C) = C(C^5 - 5C^3 + 5C) - (C^4 - 4C^2 + 2)$$ so $$p_6(C) = C^6 - 6C^4 + 9C^2 - 2$$ and thus $$x^6 + \dfrac{1}{x^6} = C^6 - 6C^4 + 9C^2 - 2$$.

We can already start to see some patterns emerge. Define $$a(k, i): \mathbb{N} \times \mathbb{N} \rightarrow \mathbb{Z}$$ to be the function which returns the coefficients of the $$k$$-th polynomial $$p_k(x) = \sum_{i=0}^{k}a(k, i)x^{k-i}$$.

- $$a(k, 0) = 1$$ for all $$k\geq 0$$ and the next non-zero coefficient is $$-k$$.
- If $$k$$ is even, then $$a(k, 2i + 1) = 0$$ (odd-degree terms are absent). Instead, if $$k$$ is odd, then $$a(k, 2i) = 0$$ (even-degree terms are absent). Moreover, the power on each term decrements by 2.
- The coefficients of $$p_k(x)$$ have alternating sign.
- There are $$\left\lceil \dfrac{k + 1}{2} \right\rceil$$ non-zero coefficient terms in $$p_k(x)$$.

Not only do we still need to prove these conjectures, there still remains one important question: *Can we generate* $$p_k(C)$$ *for arbitrary* $$k$$?

<br>

---

<br>

## Solving our Recurrence Relation

We can solve the recurrence relation we previously discovered by first considering an alternate perspective to the equation that began this investigation: $$x + \dfrac{1}{x} = C$$.

Suppose we wanted to understand the very similar yet fundamentally distinct equation $$z + \dfrac{1}{z} = C$$ where $$z\in \mathbb{C}$$ is a root. Rather restrict ourselves to the real numbers, we can expand our field of view (pun intended) to arrive at new conclusions. Furthermore, let us restrict the value of $$C$$ so that $$\|C\| \leq 2$$ for reasons that will soon become apparent.

Every complex number with $$\|z\| \leq 1$$ permits a polar representation $$z = e^{i\theta}$$. Let us suppose that such a $$z$$ solves the complex form of our rational equation. Then $$C = e^{i\theta} + e^{-i\theta} = 2\cos(\theta)$$ and, likewise, $$z^k + \dfrac{1}{z^k} = e^{ik\theta} + e^{-ik\theta} = 2\cos(k\theta)$$. If we can express $$2\cos(k\theta)$$ in terms of $$2\cos(\theta)$$, we will have found a way to express $$z^k + \dfrac{1}{z^k}$$ in terms of $$C$$.

Listing out a couple of terms of $$2\cos(k\theta)$$ and substituting $$C = 2\cos(\theta)$$, we appear to have arrived at the set of polynomials $$p_k(C)$$:
- $$k = 1$$ gives $$2\cos(\theta) = C$$ which matches what we derived for $$p_1(C)$$.
- $$k = 2$$ gives $$2\cos(2\theta) = 2(2\cos^2(\theta) - 1) = 2(\frac{1}{2}C^2 - 1) = C^2 - 2$$ which matches what we derived for $$p_2(C)$$.
- $$k = 3$$ gives $$2\cos(3\theta) = 2(4\cos^3(\theta) - 3\cos(\theta)) = 2(\frac{1}{2}C^3 - \frac{3}{2}C) = C^3 - 3C$$ which matches what we derived for $$p_3(C)$$.

This method appears to work so long as we have a way of calculating $$2\cos(k\theta)$$. To make it easier, let's refer to the expansion of this cosine $$k$$-angle formula as $$T_k(\cos{\theta})$$ where $$T_k(x) \in \mathbb{Z}[x]$$ is the $$k$$th *Chebyshev polynomial*. But how do we calculate this polynomial?

There is an important formula from trigonometry called the *Product-to-Sum / Sum-to-Product* formula. In terms of cosines, it means that $$\cos(\alpha + \beta) + \cos(\alpha - \beta) = 2\cos(\alpha)\sin(\beta)$$. Suppose we define $$\alpha$$ and $$\beta$$ as $$\alpha = (k-1)\theta$$ and $$\beta = \theta$$ so that $$\alpha + \beta = k\theta$$ and $$\alpha - \beta = (k-2)\theta$$. Then, it follows that $$\cos(k\theta) + \cos((k-2)\theta) = 2\cos(\theta)\cos((k-1)\theta)$$. Since $ $T_k(\cos(\theta)) = \cos(k\theta)$$, this means that:

<p align="center">
    $$\large{\displaystyle T_k(\cos{\theta}) + T_{k-2}(\cos{\theta}) = 2\cos(\theta)T_{k-1}(\cos{\theta})}$$
</p>

And, after some rearrangement, we obtain the following recurrence relation in terms of $$T_k(x)$$:

<p align="center">
    $$\large{\displaystyle \boxed{T_k(x) = 2xT_{k-1}(x) - T_{k-2}(x)}}$$
</p>

This recurrence relation is extremely similar to the one we saw earlier with $$p_k(C)$$. In fact, it turns out that we can express $$p_k(C)$$ in terms of $$T_k(C)$$. If we multiply both sides by 2 and apply the substitution $$x = C/2$$, we arrive at $$2T_k(C/2) = 2CT_{k-1}(C/2) - 2T_{k-2}(C/2)$$ which easily simplifies to $$T_k(C/2) = CT_{k-1}(C/2) - T_{k-2}(C/2)$$. Thus:

<p align="center">
    $$\large{\displaystyle \boxed{p_k(C) = 2T_{k}(C/2)}}$$
</p>

The polynomials for our rational equation ended up being the Chebyshev polynomials in disguise! Note that we assumed that $$\|C\| \leq 2$$ for the purpose of solving our equation, but our conclusions ended up being more general than we intended, allowing us to safely disregard this restriction on $$C$$.

So we've solved the recurrence relation! ... Sort of. All we've actually managed to express our unknown polynomial in terms of a more well-knnown and understood polynomial. We still need to figure out how to compute $$p_k(C)$$ for arbitrary $$k$$, preferably without the requirement that we know all of the polynomials for degrees *less* than $$k$$.

<br>

---

<br>

## Coefficients of Chebyshev Polynomials

The term with degree $$n-2m$$ in this polynomial will have coefficient given by the function $$b(n, m)$$ and satisfies the following relation (which is just a restatement of the Chebyshev recurrence relation):

<p align="center">
    $$b(n, m) = 2b(n - 1, m) - b(n - 2, m - 1)$$
</p>

Solving this recurrence relation for $$b(n, m)$$ is not a simple endeavor. Thankfully, mathematicians smarter than me have discovered the following closed-form formula:

<p align="center">
    $$\displaystyle b(n,m)=\left(-1\right)^{m}\cdot2^{\left(n-2m-1\right)}\left(\frac{n}{n-m}\right)\binom{n-m}{m}$$
</p>

We can confirm that this formula does indeed work, starting with the base cases $$n = 0$$, $$1$$, and $$2$$. These values of $$n$$ yield the Chebyshev polynomials $$T_0(x) = 1$$, $$T_1(x) = x$$, and $$T_2(x) = 2x^2 - 1$$ and the coefficients of these polynomials reflect $$b(1, 0) = 1, b(2, 0) = 2, b(2, 1) = -1$$ with $$b(0, 0)$$ defined to equal $$1$$. Note that, by definition, $$b(n, m) = 0$$ for any $$m \geq \left\lceil (n+1)/2\right\rceil$$ in order to ensure there are no terms of negative degree in $$T_n(x)$$ nor cause a division by zero when $$n=m$$.

For arbitrary $$n, m \in \mathbb{N}$$, we can substitute our formula for $$b(n, m)$$ into the Chebyshev recurrence relation.

<p align="center">
    $$b(n, m) = 2b(n - 1, m) - b(n - 2, m - 1)$$

    $$\displaystyle b(n,m) =2\left(\left(-1\right)^{m}\cdot2^{\left(n-2m-2\right)}\left(\frac{n-1}{n-m-1}\right)\binom{n-m-1}{m}\right)-\left(\left(-1\right)^{m-1}\cdot2^{\left(n-2m-1\right)}\left(\frac{n-2}{n-m-1}\right)\binom{n-m-1}{m-1}\right)$$

    $$\displaystyle b(n,m) = \left(-1\right)^{m}\cdot2^{\left(n-2m-1\right)}\left(\frac{n-1}{n-m-1}\binom{n-m-1}{m}+\frac{n-2}{n-m-1}\binom{n-m-1}{m-1}\right)$$

    $$\displaystyle b(n,m)=\left(-1\right)^{m}\cdot2^{\left(n-2m-1\right)}\left(\frac{n-1}{n-m-1}\frac{\left(n-m-1\right)!}{m!\left(n-2m-1\right)!}+\frac{n-2}{n-m-1}\frac{\left(n-m-1\right)!}{\left(m-1\right)!\left(n-2m\right)!}\right)$$

    $$\displaystyle b(n, m) = \left(-1\right)^{m}\cdot2^{\left(n-2m-1\right)}\left(\frac{1}{n-m-1}\right)\left(\frac{\left(n-1\right)\left(n-2m\right)}{n-m}\frac{\left(n-m\right)!}{m!\left(n-2m\right)!}+\frac{m\left(n-2\right)}{n-m}\frac{\left(n-m\right)!}{m!\left(n-2m\right)!}\right)$$

    $$\displaystyle b(n, m) = \left(-1\right)^{m}\cdot2^{\left(n-2m-1\right)}\left(\frac{1}{n-m}\right)\left(\frac{\left(n-1\right)\left(n-2m\right) + m(n-2)}{n-m-1}\right)\binom{n-m}{m}$$

    $$\displaystyle b(n, m) = \left(-1\right)^{m}\cdot2^{\left(n-2m-1\right)}\left(\frac{1}{n-m}\right)\left(\frac{n^2 - mn - n}{n-m-1}\right)\binom{n-m}{m}$$

    $$\displaystyle b(n, m) = \left(-1\right)^{m}\cdot2^{\left(n-2m-1\right)}\left(\frac{n}{n-m}\right)\binom{n-m}{m}$$
</p>

Which is indeed the correct formula.

In order to obtain the coefficients of $$p_n(x)$$, we need only drop $$2^{n-2m-1}$$ from the formula since $$p_n(C) = 2T_n(C/2)$$ implies we divide the $$(n-2m)$$th coefficient by $$2^{n-2m}$$ and then multiply by $$2$$. Thus, we have obtained the formula we have been looking for this whole time:

<p align="center">
    $$\displaystyle \boxed{a(n, m) = \left(-1\right)^{m}\left(\frac{n}{n-m}\right)\binom{n-m}{m}}$$
</p>

With some algebra, we can derive a formula for moving across coefficients in $$p_n(x)$$ where $$n$$ is held constant and $$m$$ is allowed to vary.

Let $$\lambda(n, m)$$ be the function such that $$a(n, m+1) = \lambda(n, m)a(n, m)$$ with $$m\geq 0$$. Then, it can be shown that:

<p align="center">
    $$\boxed{\lambda(n, m) = -\frac{\left(n-2m\right)\left(n-2m-1\right)}{\left(m+1\right)\left(n-m-1\right)}}$$
</p>

This formula is especially convenient and adapts well when considering coefficients modulo some prime number. Using a computer, we can use this formula to quickly generate polynomial representations of $$x^k + \dfrac{1}{x^k} = C$$. Here, for instance, is $$p_{50}(x) \pmod{10^9+7}$$:

<p align="center">
    $$\large x^{50} - 50x^{48} + 1175x^{46} - 17250x^{44} + 177375x^{42} - 1357510x^{40} + 8021650x^{38}$$

    $$\large - 37469900x^{36} + 140512125x^{34} - 427248250x^{32} + 59575653x^{30} - 148789786x^{28}$$

    $$\large + 562467279x^{26} - 814144972x^{24} + 272634965x^{22} - 639918772x^{20} + 241119729x^{18}$$

    $$\large - 767883493x^{16} + 736618125x^{14} - 227613750x^{12} + 50075025x^{10} - 7400250x^{8}$$

    $$\large 672750x^{6} - 32500x^{4} + 625x^{2} - 2$$
</p>

Whose representation was generated by the following (pretty simple) Python code:

```py
import math

n = 50
M = 1000000007
poly = [1]
for m in range(0, int(math.ceil((n+1)/2))-1):
    coeff = (-(n-2*m) * (n-2*m-1) * pow((m+1) * (n - m - 1), -1, M))%M
    val = (coeff * poly[-1]) % M
    if (poly[-1] > 0): val -= M
    poly.append(val)
degree = n
str_rep = ""
for i in range(len(poly)):
    str_rep += str(abs(poly[i])) + "x^{" + str(degree) + "}"
    degree -= 2
    if (i != len(poly) - 1):
        if (i % 2 == 0): str_rep += " - "
        else: str_rep += " + "
print(str_rep)
```

We can alternatively compute $$a(n, m)\pmod{M}$$ where $$M$$ is prime using the following Python code:

```py
import numpy as np
import math

# Prime sieve courtesy of stack overflow
# https://stackoverflow.com/a/2068548
def sieve(n):
    """ Input n>=6, Returns a array of primes, 2 <= p < n """
    primes = np.ones(n//3 + (n%6==2), dtype=bool)
    for i in range(1,int(n**0.5)//3+1):
        if primes[i]:
            k=3*i+1|1
            primes[       k*k//3     ::2*k] = False
            primes[k*(k-2*(i&1)+4)//3::2*k] = False
    return np.r_[2,3,((3*np.nonzero(primes)[0][1:]+1)|1)]

def factorial_rep(n, primes):
    rep = {}
    for p in primes:
        p = int(p)
        order = 0
        if (p > n): break
        q = p
        while q<=n:
            order += n//q
            q *= p
        rep[p] = order
    return rep

def binom(n, m, M, primes):
    numer = factorial_rep(n - m, primes)
    denom1, denom2 = factorial_rep(m, primes), factorial_rep(n - 2 * m, primes)
    # Merge denominators
    denom = {p: denom1[p] for p in denom1}
    for p in denom2:
        if (p in denom1): denom[p] += denom2[p]
        else: denom[p] = denom2[p]
    # Divide out numerator and denominator
    binom_rep = {p: numer[p] for p in numer}
    for p in denom: binom_rep[p] -= denom[p]
    val = 1
    for p in binom_rep: val = (val * pow(p, binom_rep[p] % (M-1), M)) % M
    return val

def coefficient(n, m, M, primes):
    val = (pow(-1, m%2) * (n%M) * pow(n-m, -1, M) * binom(n, m, M, primes))%M
    if (m%2 == 1): val -= M
    return val
```

We can use this code to conclude that $$a(10^7, 10^6) = 916998232\pmod{10^9 + 7}$$. I would not be surprised if there is a more optimized way of calculating $$a(n, m)$$ using the formula, but this is what I came up with.