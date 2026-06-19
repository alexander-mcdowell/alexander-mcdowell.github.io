---
layout: post
title:  "How To Create New Numbers — A Perspective on Ring/Field Theory and Analysis"
katex: true
---

# Preface

The purpose of this blog post is to present a broad overview of undegraduate-level abstract algebra from an alternative perspective. Often, fundamental algebraic structures — most notably groups, rings/modules, and fields — are presented in purely abstract and formal terms. This is essential for providing a logical and rigorous foundation for the discipline, but, at least as it was for me as an undergrad, it fails to explain *why* these structures were invented in the first place and, more importantly, *why* they are defined the way they are and not some other way.

Simply put, I want to reframe abstract algebra — specifically Ring and Field Theory — as the branch of mathematics concerned with creating new number systems, understanding their properties and limitations, and how the *insolvability* of various problems in these number system grants us the ability to create more powerful and more interesting number systems.

When I talk about creating new number systems, I do not mean substituting one symbol for another, such as replacing the Arabic numerals $1, 2, 3, 4,...$ with Chinese characters 一, 二, 三, 四, ... or Roman numerals *I, II, III, IV* or any other real or fictitious set of symbols. What I mean is extending an existing number system, such as the integers, by new numbers with desirable properties absent from the original number system. A classic example of this is the complex numbers: we take the existing real numbers and simply adjoining a new "number" $i$ which satisfies $i^2 = -1$. But, this explanation is unsatisfying. How can we just make up a new number like this? What does $i$ even mean? What's stopping us from adding whatever "number" we want satisfying and properties we desire? How can we guarantee this number system is <span class="annotated">consistent<span class="popup">A number system is consistent if it has no logical contradictions</span></span>?

Throughout this text, there will be two ways to expand a number system.
1. **Addressing problems** — This is the primary method we will be using to create new numbers and works by formalizing the idea of throwing in new numbers with the properties we want. To apply this method, we find a "problem" that we are unable to solve with our existing system and construct a new system with that "problem" solved. Usually, the "problem" refers to polynomials and the numbers we add are the roots of these polynomials.

2. **Filling in the gaps** — Most notably in the context of constructing the real numbers from the rationals, we can use <span class="annotated">analytical<span class="popup">The branch of mathematics concerned with limits, continuity, infinitesimals, differentiability, etc.; calculus and topology</span></span> techniques to add new numbers in-between existing numbers. This method is dependent on our notion of "distance", which is not as obvious and clear-cut as it may seem.

This will be a long read, as it is no easy task to condense hundreds and hundreds of pages of dense mathematical texts spanning algebra, analysis, and number theory into a single article. You can find links to the major sections below.

<div align="center" style="background: #c4c4c4; border: 2px solid black; border-radius: 10px; margin-bottom: 20px">
    <h4>
        <p>
            <a href="#the-integers">The Integers $\mathbb{Z}$</a><br>
            <a href="#the-rationals">The Rationals $\mathbb{Q}$</a><br>
            <a href="#the-reals">The Reals $\mathbb{R}$</a><br>
            <a href="#the-complex-numbers-algebraic-closure">The Complex Numbers $\mathbb{C}$ and Algebraic Closure</a><br>
            <a href="#rings-fields-field-extensions">Rings, Fields and Field Extensions</a><br>
            <a href="#quaternions-generalized-complex-numbers">Quaternions and Generalized Complex Numbers</a><br>
            <a href="#finite-fields">$\mathbb{F}_p$ and Finite Field Arithmetic</a><br>
            <a href="#p-adics">$p$-adics</a><br>
            <a href="#what-next">What's Next?</a><br>
        </p>
    </h4>
</div>

I have written this text in order for it to be understood by people from all sorts of educational backgrounds. Though it is about abstract math, I am writing it for the layman. There are, of course, plenty of mathematical symbols and proofs, but they are there to supplement the text and you do not need to read or understand them all — they are there for the people who want something more rigorous.

May this article teach you something new, elucidate a concept you've been grappling with, or just simply be a fun read.

---

<a name="the-integers"></a>

# The Integers $\mathbb{Z}$

The simplest number system to start from would be the non-negative integers with the single operation of addition. Whether or not to call these the *counting numbers* or *natural numbers*, represented by the symbol $\mathbb{N}$, is a point of contention among mathematicians and is notably the [first question in an online poll on mathematical conventions](https://cims.nyu.edu/~tjl8195/survey/results.html#q1). For our purposes, $\mathbb{N}$ will include zero.

<!-- TODO: Brief remark about the history of zero? -->

The easiest way to formalize the positive integers is using the Peano axioms, which formalize in predicate logic the notion of counting.
> Let the set of natural numbers be $\mathbb{N}$ and define the operation $\mathcal{S}x$ to be the "successor" of $x\in \mathbb{N}$.
Then:
1. Zero is a natural number $\left(0\in \mathbb{N}\right)$.
2. The successor of any natural number is a natural number $\left( x\in \mathbb{N} \Longrightarrow \mathcal{S}x\in \mathbb{N}\right)$.
3. There are no negative numbers; or, zero is not the successor of any number $\left(\forall x,\mathcal{S}x \neq 0\right)$.
4. Two numbers with the same successors are equal $\left(\forall x, y\in\mathbb{N}, \mathcal{S}x=\mathcal{S}y\Longrightarrow x=y\right)$.
5. **Axiom of induction**: Any set $A$ that contains zero and every successor must be the set of natural numbers $\left(0\in A \wedge \left[\forall x\in A, \mathcal{S}x \in A\right]\Longrightarrow A=\mathbb{N}\right)$.

Essentially, the successor operation applies a "+1" to the number. With this interpretation, we can reinterpret Axiom 4 as allowing us to subtract 1. For convenience, let $\mathcal{S}^k$ correspond to $k$ successors one after the other. So, $\mathcal{S}^30 = \mathcal{S}(\mathcal{S}(\mathcal{S}0)) = 3$.

There is also an implicit assumption about equality that is worth mentioning. The equals sign = denotes a type of relation known as an <span class="annotated">*equivalence relation*<span class="popup">A reflexive, symmetric, and transitive relation</span></span>, which by definition must satisfies the following well-known properties:
> 1. **Reflexivity**: Any element $x$ equals itself $\left(\forall x\in S, x = x\right)$.
2. **Symmetry**: If $x=y$, then $y=x$ $\left(\forall x, y\in S, x = y \Longrightarrow y = x\right)$.
3. **Transitivity**: If $x=y$ and $y=z$, then $x=z$ $\left(\forall x, y\in S, x = y \wedge y = x \Longrightarrow x = z\right)$.

where $S$ is any set. We will encounter other equivalence relations later on.

Using successors, we can denote $x+y$ as $\mathcal{S}^yx$ or $y$ successors of $x$ (e.g.: $2+3 = \mathcal{S}^32 = \mathcal{S}^50$). We can then demonstrate that the following intuitive properties of addition hold:
> 1. **Associativty**: $(x + y) + z = x + (y + z)$.
2. **Commutativity**: $x + y = y + x$.
3. **Identity**: $0$ is the unique natural number such that $x + 0 = x$.
4. **Cancellation**: $x+z=y+z$ implies $x=z$.
for any $x, y, z\in \mathbb{N}$.

<!-- TODO: Formal proofs of these properties -->

<!-- TODO: Revist the "problematic" axiom Sx=0 and derive the negative numbers -->

<!-- TODO: Define multiplication to construct the ring of integers -->

---

<a name="the-rationals"></a>

# The Rationals $\mathbb{Q}$

Adding the negative integers was not sufficient to solve all of our needs, however, as there are still linear equations that cannot be solved. Take the equation $2x=1$, for instance. We know that $x$ must be less than $1$ but also must be greater than $0$. But there is no such integer satisfying this requirement. To solve this equation, we must expand our number system by filling in the gaps between the integers.

We can define the set of rationals as the set $\mathbb{Q} = \mathbb{N}\times \mathbb{N} = \Big\\{(a,b)\ \Big\|\ a,b\in \mathbb{Z}\Big\\}$. Every number in this set corresponds to a pair of integers where the first is the numerator and the second the denominator. It's convenient to represent elements of $\mathbb{Q}$ not as the pair $(a, b)$ but as $\frac{a}{b}$.

---

<a name="the-reals"></a>

# The Real Numbers $\mathbb{R}$

---

<a name="the-complex-numbers-algebraic-closure"></a>

# The Complex Numbers $\mathbb{C}$ and Algebraic Closure

---

<a name="rings-fields-field-extensions"></a>

# Rings, Fields and Field Extensions

---

<a name="quaternions-generalized-complex-numbers"></a>

# Quaternions and Generalized Complex Numbers

---

<a name="finite-fields"></a>

# $\mathbb{F}_p$ and Finite Field Arithmetic

---

<a name="p-adics"></a>

# $p$-adics

---

<a name="what-next"></a>

# What's Next?