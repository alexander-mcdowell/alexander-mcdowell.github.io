---
layout: page
center-title: true
write-date: false
title:  "How To Create New Numbers"
subtitle: "A Perspective on Ring/Field Theory and Analysis"
katex: true
exclude: true
---

# 0. Set Theory Primer

The purpose of this section is to briefly list and explain some of the set theory terminology I will be using throughout this text. If any of this is unfamiliar, I suggest consulting resources on introductory set theory or propositional and predicate logic.
- A *set* is simply a collection of objects, whether they be numbers, points, or other sets. For our purposes, sets may contain anything.
> This definition is unsatisfying, but rigorously formalizing it using [Zermelo-Fraenkel Set Theory](https://en.wikipedia.org/wiki/Zermelo%E2%80%93Fraenkel_set_theory) is beyond the scope of this text. Importantly, we will be using the **Axiom of Choice**, which states that from any sequence of sets $S_i$ (where $i\in I$ is an index and $I$ is any set), we may construct a new sequence $x_i$ where $x_i\in S_i$ for all $i\in I$.
- Given a set $S$, $x \in S$ denotes that $x$ belongs to $S$.
- $\emptyset$ denotes the *empty set*, which has no elements.
- The *union* of two sets $S$ and $T$ is the set of elements belonging to either $S$ or $T$ or both and is denoted by $S\cup T$.
- The *intersection* of two sets $S$ and $T$ is the set of elements belonging to both $S$ and $T$ and is denoted by $S\cap T$. Two sets $S$ and $T$ are *disjoint* if $S\cap T=\emptyset$.
-  The *difference* of two sets $S$ and $T$ is the set of elements in $S$ that are not elements of $T$ and is denoted by $S-T$.
- The *cardinality* of $S$, denoted as $\|S\|$, measures the size of $S$. For finite sets, $\|S\|$ is the number of elements in $S$. We will not be talking about cardinalities of infinite sets in this text.
- The *Cartesian product* of two sets $S$ and $T$, denoted as $S\times T$ is the set of pairs $(s, t)$ where $s\in S$ and $t\in T$. For instance, if $S = \\{1,2,3\\}$ and $T=\\{1,4\\}$, then $S\times T = \Big\\{(1, 1), (1, 4), (2, 1), (2, 4), (3, 1), (3, 4)\Big\\}$. The cartesian product of $n$ sets $S_1, S_2, ... S_n$ is the set of all possible $n$-tuples. For instance, $S\times T\times U$ is the set of all triples $(s, t, u)$ where $s\in S, t\in T,$ and $u\in U$. The notation $S^n$ indicates $S\underbrace{\times\cdots\times}_{n\text{ times}} S$.

The following are logical symbols and operators that will be used frequently. Let $p$ and $q$ be any proposition and $x$
- $\neg p$ = logical negation. If $p$ is true, then $\neg p$ is false; If $p$ is false, then $\neg p$ is true.
- $p \vee q$ = logical or. True if either $p$ or $q$ or both are true.
- $p \wedge q$ = logical and. Only true if $p$ and $q$ are both true.
- $p \implies q$ = logical implication. If $p$ is true, then $q$ is true.
- $p \Longleftrightarrow q$ = logical biconditional. $p$ is true if and only if $q$ is true. $p$ is equivalent to $q$.
- $\forall x$ = universal quantifier; "for all $x$...".
- $\exists x$ = existential quantifier; "there exists an $x$...".

Finally, a brief description of functions.
- Formally, a (well-defined) function or mapping $f: X\rightarrow Y$ is a set of pairs $(x, y)$ where each $x\in X$ has a unique $y\in Y$ (every input must have a unique output). We write each pair as $f(x)=y$. We can check if a function is well-defined if and only if when $x_1=x_2$, $f(x_1)=f(x_2)$.
    - The set $S$ is called the *domain* of $f$ (the inputs) and the set $T$ is the *target* or *codomain* of $f$ (the set of possible outputs). It may not be true that every element in $T$ is an output of $f$.
    - Given a set $S\in X$, we call the set of outputs for each input of $S$ the *image* of $S$ under $f$ and is denoted by <span style="white-space: nowrap;">$f(S)=\\{f(x)\ \|\ x\in X\\}$</span>. We call $f(X)$ the *image* or *range* of $f$.
    - Given $T\in Y$, we call the set of inputs to $f$ that output an element of $T$ the *preimage* of $T$ and is denoted by <span style="white-space: nowrap;">$f(T)=\\{x\in X \|\ f(x) \in T\\}$</span>.
- $f$ is *onto* or *surjective* if every output has an input. We can write this as $f(X) = Y$ or $\forall y\in Y, \exists x\in X, f(x)=y$
- $f$ is *one-to-one* or *injective* if outputs have unique inputs. We can write this as $f(x)=f(y)\implies x=y$.
- If $f$ is both *surjective* and *injective*, we say that it is *bijective* or a *one-to-one* correspondence. Importantly, a bijective function $f$ has an *inverse* function $f^{-1}: Y\rightarrow X$ such that $f^{-1}(f(x)) = x$ and $f(f^{-1}(y))=y$ for all $x \in X$ and $y\in Y$.