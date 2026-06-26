---
layout: page
center-title: true
write-date: false
title:  "How To Create New Numbers"
subtitle: "A Perspective on Ring/Field Theory and Analysis"
katex: true
exclude: true
---

# 1. The Integers $\mathbb{Z}$

### 1.1. The Natural Numbers $\mathbb{N}$

The simplest number system to start from would be the non-negative integers with the single operation of addition. Whether or not to call these the *counting numbers* or *natural numbers*, represented by the symbol $\mathbb{N}$, is a point of contention among mathematicians and is notably the [first question in an online poll on mathematical conventions](https://cims.nyu.edu/~tjl8195/survey/results.html#q1). For our purposes, $\mathbb{N}$ will include zero.

Much of what follows will not be new, however, it may be presented in a way you may not be used to seeing. We will be utilizing the techniques taught in this section to justify the existence of more complex number systems (pun intended).

The easiest way to formalize the natural numbers is using the **Peano axioms**, which formalize in predicate logic the notion of counting.
> Let the set of natural numbers be $\mathbb{N}$ and define the operation $\mathcal{S}x$ to be the "successor" of $x\in \mathbb{N}$.
Then:
1. Zero is a natural number $\left(0\in \mathbb{N}\right)$.
2. The successor of any natural number is a natural number $\left( x\in \mathbb{N} \implies \mathcal{S}x\in \mathbb{N}\right)$.
3. There are no negative numbers; or, zero is not the successor of any number $\left(\forall x,\mathcal{S}x \neq 0\right)$.
4. Two numbers with the same successors are equal $\left(\forall x, y\in\mathbb{N}, \mathcal{S}x=\mathcal{S}y\implies x=y\right)$.
5. **Axiom of induction/infinity**: Any set $A$ that contains zero and every successor must be the set of natural numbers $\left(0\in A \wedge \left[\forall x\in A, \mathcal{S}x \in A\right]\implies A=\mathbb{N}\right)$.

Essentially, the successor operation applies a "+1" to the number. With this interpretation, Axiom 4 allows us to subtract 1 from both sides of an equation.

For convenience, we can let $\mathcal{S}^k$ correspond to $k$ successors. So, $\mathcal{S}^30 = \mathcal{S}(\mathcal{S}(\mathcal{S}0)) = 3$.

Using successors, we can denote $x+y$ as $\mathcal{S}^yx$ or $y$ successors of $x$ (e.g.: $2+3 = \mathcal{S}^32 = \mathcal{S}^50$). We can then demonstrate that the following intuitive properties of addition hold:
> 1. **Associativty** --- $(x + y) + z = x + (y + z)$.
2. **Commutativity** --- $x + y = y + x$.
3. **Identity** --- $0$ is the unique natural number such that $x + 0 = x$.
4. **Cancellation** --- $x+z=y+z$ implies $x=z$.

for any $x, y, z\in \mathbb{N}$. A more formal definition of addition relies on a result known as the [*recursion theorem*](https://en.wikipedia.org/wiki/Recursion#The_recursion_theorem), which essentially guarantees the existence of recursive functions. I am omitting the proof of this theorem as well as proofs of the properties above for simplicity, but such proofs rely heavily on Axiom $5$. Detailed proofs can be found in <sup><a href="#references">[1]</a></sup> and <sup><a href="#references">[2]</a></sup>.

Many of these properties seem so obvious that it's not worth mentioning. However, a few useful number systems lack these intuitive and natural properties. Famously, the quaternions are noncommutative. We will discuss these weirder number systems later.

We can also go further with our construction of the natural numbers by using a recursive approach. Notice that we didn't define what $0$ actually *is* or what the successor of a number returns --- we only defined what properties both objects satisfy. The best way to represent both concretely is to use sets. Let $0$ correspond to as the empty set, denoted by $\\{\emptyset\\}$. We can then explicitly define $\mathcal{S}x$ as $\mathcal{S}x=\\{\emptyset, x\\}$. Now, we have a representation of the naturals using only sets with each successor having one more set than the last. For instance:
- $1 = \\{\emptyset\\}$ (the set containing the empty set).
- $2 = \\{\emptyset, 1\\} = \\{\emptyset, \\{\emptyset\\}\\}$.
- $3 = \\{\emptyset, 2\\} = \\{\emptyset, \\{\emptyset, \\{\emptyset\\}\\}\\}$.

*... and so on...*

Importantly, each set $X$ representing a natural number $x$ has a cardinality of $x$ (i.e. the number of elements in set $X$) even though at no point in our definition do we reference cardinality. This is to avoid a circular definition, such as "$2$ is a set with a cardinality of $2$". As well, notice that all of Peano's Axioms apply to this set-based construction of the naturals.

It's not that helpful to do arithmetic with the sets directly, so I will continue to use the Arabic numerals we're all familiar with. The point of this aside is to illustrate a way we can interpret the natural numbers as sets which satisfy the properties we want. This will be a common theme as we expand our number system. If you are interested in learning more about this construction, I recommend reading Jacobson's *Basic Algebra*<sup><a href="#references">1</a></sup> and Halmos's *Naive Set Theory*<sup><a href="#references">2</a></sup>.

---

### 1.2. Equality, Equivalence Relations, and Partial Orders

Now would be an important moment to mention how equality is formally defined. The equals sign = denotes a type of relation known as an <span class="annotated">**equivalence relation**<span class="popup">A reflexive, symmetric, and transitive relation; equals.</span></span> and conveys some idea that two objects are "the same". It might seem unnecessary to formalize this notion, but as we will soon see, equivalence relations are incredibly useful tools for constructing new numbers. An equivalence relation $\sim$ over a set $S$ must satisfy the following well-known properties:
> 1. **Reflexivity** --- Any element $x$ is related to itself $\left(\forall x\in S, x \sim x\right)$.
2. **Symmetry** --- If $x\sim y$, then $y\sim x$ $\left(\forall x, y\in S, x \sim y \Longrightarrow y \sim x\right)$.
3. **Transitivity** --- If $x\sim y$ and $y\sim z$, then $x\sim z$ $\left(\forall x, y\in S, x \sim y \wedge y \sim x \Longrightarrow x \sim z\right)$.

where $S$ is any set. Note that the equality relation we're used to satisfies all of the above properties. The congruence and similarity relations from geometry also satisfy these properties. We will encounter other equivalence relations later on.

In the case of equality of the naturals, if we use our set construction, we can say two numbers $x$ are equal if their sets are the same. We can show that two sets $A$ and $B$ are the same if every element of $A$ is an element of $B$ and every element of $B$ is an element of $A$. We can write this mathematically as $A=B$ if and only if $A\subseteq B$ and $B\subseteq A$ where $A\subseteq B \Leftrightarrow \forall x\in A, x\in B$. So, letting the set representations of $x$ and $y$ be $X$ and $Y$ respectively, we can say that $x=y$ if and only if $X\subseteq Y$ and $Y\subseteq X$.

A very important property of an equivalence relation is that it allows us to <span class="annotated">*partition*<span class="popup">Decompose into disjoint sets</span></span> a set $S$. Essentially, for any $x\in S$, we can put all $y\in S$ that are "equal" to $x$ in a set and let $x$ be the representative of this set. We call such a set the <span class="annotated">**equivalence class of $x$**<span class="popup">The set of all elements in a set equal to $x$ with equivlance relation $\sim$</span></span> and is denoted by $\overline{x} = \big\\{y\in S\ \big\|\ x\sim y\big\\}$.

By "partitioning" a set, I mean that the set of all equivalence classes $\overline{x}, \overline{y}, ...$ over $S$ must be <span class="annotated">pairwise disjoint<span class="popup">Given a set of sets $S_1, S_2, ...$, any two sets $S_i$ and $S_j$ satisfy $S_i\cap S_j=\emptyset$. <br>No two sets have an element in common.</span></span> or equal. For instance, if I have the set $S=\\{a,b,c,d,e,f,g\\}$ and $a\sim b$, $a\sim d$, $c\sim e$, and $e\sim g$, then the distinct equivalence classes are $\overline{a}=\\{a, b, d\\}$, $\overline{c} = \\{c, e, g\\}$, and $\overline{f} = \\{f\\}$. Any equivalence class you construct over $S$ must be exactly one of these disjoint equivalence classes.

<div>
    <button class="accordion">Equivalence Relations Partition a Set</button>
    <div class="panel">
        <p>
            <i>Proof:</i> Let $\overline{x}$ and $\overline{y}$ be equivalence classes over the set $S$ with equivalence relation $\sim$ and suppose $z\in \overline{x}\cap \overline{y}$. Then $z\sim x$ and $z\sim y$. By symmetry, $z\sim x$ implies $x\sim z$. By transitivity, $x\sim y$. This means that $\overline{x} \subseteq \overline{y}$ (since $x$ is related to $y$) and $\overline{y} \subseteq \overline{x}$ (since $y$ is related to $x$), so $\overline{x} = \overline{y}$. Thus, any two equivalence class with an element in common must intersect completely or not at all. $\Box$
        </p>
    </div>
</div>

As another example, we could partition the set of all triangles based on similarity (e.g., Angle-Angle similarity, Side-Angle-Side similarity, Side-Side-Side similarity). The equivalence classes might include an equilateral triangle with side-length $1$ or a right triangle with sides $3, 4,$ and $5$. An equilateral triangle with side length $3$ would then belong to the equivalence class of equilateral triangles, whereas a right triangle with side length $6, 8,$ and $10$ would belong to the same equivalence class as a $3, 4, 5$ right triangle.

<div align="center">
    <img src="\assets\how-to-create-numbers\triangle_similarity.png">
    <p><i>An example of equivalence classes using triangle similarity. $A\sim A'$ and $B\sim B'$</i></p>
</div>

Equivalence relations are also important in graph theory. Say we have a graph $G=(V,E)$ where $V$ is the set of vertices and <span style="white-space: nowrap;">$E\subseteq V\times V$</span> is the set of edges. Then, given two vertices $u, v\in V$, the equivalence relation denoting connectedness is defined by $u\sim v$ if and only if there is a route from $u$ to $v$. We vacuously say that $u$ is connected to itself and, for every edge $(u, v)\in E$, it follows that $u\sim v$ (since $u$ is joined to $v$ by an edge). Then, the transitivity property allows us to find every route starting from a specific vertex. The equivalence class of a vertex is therefore the set of all vertices reachable from $u$.

<div align="center">
    <img src="\assets\how-to-create-numbers\graph.png">
    <p><i>An example of equivalence classes using graph connectivity. The equivalence classes are<br>$\overline{0}=\{0,1,2\}, \overline{3}=\{3,4,5\}$, and $\overline{6}=\{6\}$</i></p>
</div>

The importance of equivalence classes will become apparent once we start defining operations over classes. In a sense, equivalence classes _are_ numbers.

One nice feature of the natural numbers is that we can define what it means for two numbers to be greater than another. This might seem obvious (or trivial, as mathematicians like to overuse), but quite a few number systems lack ordering and rely on other number systems (such as the positive real numbers) in order to enforce a kind of order.

For any set $S$, a <span class="annotated">**partial order**<span class="popup">A reflexive, antisymmetric, and transitive relation; less than or equal to.</span></span>, denoted by $\preceq$, is a relation satisfying the following properties:
> 1. **Reflexivity** --- Any element $x$ is related to itself $\left(\forall x\in S, x \preceq x\right)$.
2. **Antisymmetry** --- If $x\preceq y$ and $y\preceq x$, then $x = y$ $\left(\forall x, y\in S, x \preceq y \wedge y\preceq x \Longrightarrow x = y\right)$.
3. **Transitivity** --- If $x\preceq y$ and $y\preceq z$, then $x\preceq z$ $\left(\forall x, y\in S, x \preceq y \wedge y \preceq z \Longrightarrow x \preceq z\right)$.

We can think of $\preceq$ as a generalization of "less than or equal to", and for the naturals we will use the symbol $\leq$. For natural numbers $x$ and $y$, we say that $x\preceq y$ if and only if there exists some natural number $z$ such that $x + z = y$.

---

### 1.3. Negative Integers

Now for our first extension of the naturals. Given two numbers $x$ and $y$ with $x\leq y$, it's a reasonable question to ask what number we need to add to $x$ to get $y$. We represent this difference as $z=y-x$, which must be a natural number. But we have no way of adding a number to $y$ to get $x$, and so we must extend the naturals to incorporate the concept of negatives. It would be easy to just say that there exists a number $-x$ such that $y+(-x)=z$, but how would we represent this more formally? What set does $-x$ correspond to? It can't be a natural number, since Axiom 3 states there can be no number whose successor is $0$.

We can use equivalence relations to help us define negative numbers. For any pair of natural numbers with $a\leq b$, we can find its difference $b-a$ which itself is also a natural number. But, if there is another pair of natural numbers $c\leq d$ with the same difference, we can treat the two pairs as "the same". In other words, $(a, b)$ and $(c,d)$ are "the same" if $b-a=d-c$. Written using only addition, this is the same as $a+d=b+c$. We can then obtain negative numbers if we drop the restrictions that $a\leq b$ and $c\leq d$.

Define a new equivalence relation $\sim$ over the set $\mathbb{N}^2$ such that $(a, b) \sim (c, d) \Longleftrightarrow a+d=b+c$. 
<div>
    <button class="accordion">$(a,b)\sim(c,d)\Longleftrightarrow a+d=b+c$ Is an Equivalence Relation</button>
    <div class="panel">
        <p>
            <i>Proof:</i> Equivalence relations must be reflexive, symmetric, and transitive, so we must verify that each property holds.
            <ul>
                <li> $a+b = b+a$ by commutativity of addition, hence $(a, b)\sim (a, b)$ and so $\sim$ is reflexive.</li>
                <li> Suppose $(a,b)\sim (c,d)$. Then $a+d=b+c$ implies $c+b=d+a$ by commutativity of addition and symmetry of $=$. Thus, $(c, d)\sim (a, b)$ and so $\sim$ is symmetric.</li>
                <li>Suppose $(a,b)\sim (c,d)$ and $(c, d)\sim (e, f)$. Then $a+d=b+c$ and $c+f=d+e$.
                $$\begin{align*}
                    a+d=b+c\\
                    a+d+f=b+c+f && (\text{add } f \text{ to both sides})\\
                    a+d+f=b+d+e && (\text{since } c+f=d+e)\\
                    a+f=b+e && (\text{by cancellation of　} d)\\
                \end{align*}$$
                Thus, $(a, b)\sim (e, f)$ and so $\sim$ is transitive. $\Box$
                </li>
            </ul>
        </p>
    </div>
</div>

What are the equivalence classes under this relation? Since $(a, b)$ represents the difference of $b$ and $a$, every natural number $x$ corresponds to the pair $(a, a + x)$ for any natural number $a$. For instance, $\overline{0} = \\{(a, a)\ \|\ \forall a\in \mathbb{N}\\}$ and $\overline{1} = \\{(a, a + 1)\ \|\ \forall a\in \mathbb{N}\\}$. Notice that for any $(a, b)$, if we swap $a$ and $b$ we get a negative difference. This means that if $x = \overline{(a,b)}$, then $-x=\overline{(b,a)}$.

Finally, if these equivalence classes are in fact numbers, what would it mean to add them? Given arbitrary $(a, b)$ and $(c, d)$, the sum of the differences would be $(b-a)+(d-c)=b+d-a-c=(b+d)-(a+b)$. This difference corresponds to $(a+c,b+d)$. So, if $x=\overline{(a,b)}$ and $y=\overline{(c,d)}$, then $x+y=\overline{(a+c, b+d)}$.

We can also confirm that $x+(-x)=0$ since $\overline{(a, b)} + \overline{(b, a)} = \overline{(a + b, b + a)} = 0$.

---

### 1.4. Multiplication

Similar to addition, we can define multiplication recursively. For $x+y$, we iteratively apply the successor operation $y$ times to $x$. For $xy$, we instead iteratively apply the $+x$ operation $y$ times to $0$.

We expect integer multiplication to satisfy the following properties, which should all feel intuitive:
> 1. *Associativity* --- $x(yz)=(xy)z$
2. *Commutativity* --- $xy=yx$
3. *Distributivity over addition* --- $x(y+z)=xy+xz$
4. *Identity* --- $1\cdot x=x\cdot 1=x$
5. $0\cdot x=x\cdot 0=0$. Furthermore, if $xy=0$ for integers $x, y$, then $x=0$ or $y=0$ or both.

Now that we can add and multiply, we've created our first real number system! In fact, this new structure we've imbued the integers with has a name. We call this number system the *ring of integers*. We will talk about rings in greater detail later on, but for now, any set of objects with defined addition and multiplication operations is known as a ring (what constitutes "addition" and "multiplication" will need to be defined).

---

### 1.5. Divisibiltiy, Primes, and Factorization

The final topic to discuss is how to formalize divisibility and factorization over the integers. Understanding how to factor is important for many number systems, as they are one of the primary techniques for solving equations. Importantly for number theorists, we can find the solution to many <span class="annotated">Diophantine Equations<span class="popup">Polynomial equations where the only solutions are integers.<br> For example: $x^n+y^n=z^n$ where $x,y,z,n\in \mathbb{N}, n>2.$</span></span> by understanding how to factor over integers or over generalizations of the integers (such as the Gaussian Integers --- to be discussed in section 5).

First, some terminology. This terminology will also be routinely used in the section on ring theory. We say that a nonzero integer $d$ *divides* $n$ (or that $d$ is a *divisor* of $n$ and $n$ is a *multiple* of $d$) if and only if $n=qd$ for some integer $q$. We denote this by $d\ \|\ n$. We can further guarantee that this integer is unique.

We haven't defined a division operation for the integers yet as this will be tackled in the next section. For convenience, if $d\ |\ n$, then we will define $\frac{n}{d}=q$ to be the unique integer $q$ (known as the *quotient*) such that $n=qd$.
<div>
    <button class="accordion">Quotients Are Unique</button>
    <div class="panel">
        <p>
            <i>Proof:</i> Suppose for the sake of contradiction that $n=qd$ and $n=q'd$ for distinct $q$ and $q'$. Then $qd = q'd$ and so <span style="white-space: nowrap;">$(q-q')d=0$</span>. Since $d$ is nonzero, it follows that $q-q'=0$ or $q=q'$. Thus, every divisor has a unique quotient. $\Box$
        </p>
    </div>
</div>  

An integer can have several divisors and two or more integers may have several divisors in common. We call the largest divisor that divides a pair of integers $a$ and $b$ the *greatest common divisor* of $a$ and $b$, written as $\gcd(a, b)$. Formally, we say that $g=\gcd(a,b)$ if and only if every integer $d$ satisfying $d\ \|\ a, d\ \|\ b$ implies $d\leq g$.

We can find the greatest divisor of any two integers using the *Euclidean Algorithm*. To do this, we need to use an important theorem.
> (Remainder Theorem) Let $a, b\in \mathbb{Z}$ where $b\neq 0$. Then, there exist integers $q,r$ such that $a=qb+r$ where $0\leq r<\|b\|$.
<div>
    <button class="accordion">Remainder Theorem</button>
    <div class="panel">
        <p>
            <i>Proof:</i> Consider for now only natural numbers $a$ and $b$.
        </p>
        <p>
            Consider the set $S=\{b-qa\ |\ q\in N, b\geq qa\}$. Since $S$ is a set of natural numbers, the well-ordering principle states that there is some minimal element $r=b-qa$ where $r=b-q'a$ for some natural number $q'$. Suppose for the sake of contradiction that $r > b$. Since $b\geq a$, the $r-a=b-q'a-a=b-(q'+1)a$ and so $r-a$ belongs to $S$. But this contradicts the assumption that $r$ is the minimal element in $S$, so $0\leq r < b$ with $q=\frac{b-r}{a}$.
        </p>
        <p>
            If either $a$ or $b$ (or both) are negative, we can simply determine $r$ by applying the previous method to $|a|$ and $|b|$ since any number and its negation share that same positive divisors. Then $q=\frac{b-r}{a}$. $\Box$
        </p>
    </div>
</div>

<!-- Euclidean Algorithm -->

By iteratively applying the Remainder Theorem for any $a, b$, we can find $\gcd(a, b)$. As an example, to find the greatest common divisor of $24$ and $18$:



The integers also have two *units*: $1$ and $-1$. We will consider units in more detail later, but for now we consider $1$ and $-1$ to be the only units.

When it comes to factoring, there are two related notions: irreducibility and primality.
- A nonzero integer $x$ is *irreducible* if and only if $x=yz$ implies that either $y$ or $z$ is a unit (i.e., either $y$ or $z$ is $1$ or $-1$). This is how prime integers are typically defined. For instance, $7$ is prime since it can only be written as $1\cdot 7$ or $-1\cdot -7$. But $6$ is not prime since $6=2\cdot 3$ and neither $2$ nor $3$ are units.
- A nonzero integer $p$ is *prime* if and only if $p\ \|\ ab$ implies that $p\ \|\ a$ or $p\ \|\ b$. As an example, $6$ is not a prime number since $6\ \|\ 24$ yet $6$ divide neither $3$ nor $8$. Whereas irreducibility is a property preventing a number to be factored further, primality is a property allowing us to factor a given number completely.
For the integers, these two notions are the same. But it is important to understand the distinction as there are plenty of number systems where irreducibles and primes are not the same.
<div>
    <button class="accordion">All integer irreducibles are prime</button>
    <div class="panel">
        <p>
            <i>Proof:</i> Suppose that $x$ is an irreducible. Then $x=yz$ with either $y$ or $z$ unit and so $x\ |\ yz$. Consider the case where $y$ is a unit. Then there exists a nonzero integer $w$ such that $yw = 1$. So, multiplying $x=yz$ by $w$ on both sides yields $wx = z$ or $x\ |\ z$. If instead $z$ is a unit, then we would have shown that $x\ |\ y$. Thus, $x$ must be prime. $\Box$
        </p>
    </div>
</div>
<div>
    <button class="accordion">All integer primes are irreducible</button>
    <div class="panel">
        <p>
            <i>Proof:</i> Suppose that $p$ is a prime and $p=ab$ for some $a, b\in \mathbb{Z}$. Then $p$ divides $ab$ and so, by primality, either $p$ divides $a$ or $p$ divides $b$. Without loss of generality, suppose $p$ divides $a$. Then $pc = a$ for some integer $c$ and so $p=pcb$. We can subtract $pcb$ from both sides and factor $p$ to obtain $p(1-bc) = 0$. Since $p$ is nonzero, this means that $bc = 1$ and so both $b$ and $c$ are units. Hence, $p$ must be irreducible $\Box$
        </p>
    </div>
</div>
From now on, when dealing with the integers, I will refer to primes and irreducibles interchangeably as simply "primes". Remember the distinction, however, as it will be crucial later on.

An integer that is neither zero nor prime nor unit is known as a *composite* number.

<!-- Fundamental Theorem of Arithmetic -->

We can prove that there are infinitely many prime numbers using an argument devised by Euclid. If we assume that there are finitely many primes, we can take the product of all these primes and add $1$. The number we get must then be divisible by a prime not in our finite list, thus creating a contradiction.
<div>
    <button class="accordion">There are infinitely many primes</button>
    <div class="panel">
        <p>
            <i>Proof:</i> Suppose there are only finitely many prime numbers.
        </p>
        <p>
            We can list them as $P=\{p_1, p_2, \cdots, p_n\}$ for some $n\in \mathbb{N}$. Let $N=p_1p_2\cdots p_n + 1$.
        </p>
        <p>
            There are two cases for $N$. Either $N$ is prime or composite.
            <ul>
                <li> If $N$ is prime, then we are done --- we have found a prime that is not one of the primes in $P$, thereby contradicting our initial assumption.
                </li> If $N$ is composite, then we can factor it as a product of primes using the Fundamental Theorem of Arithmetic. Notice that for any integer $i\in \mathbb{N}$, $N=qp_i+1$ where $q$ is the product of all primes in $P$ except $p_i$. None of the primes $p_i$ divide $N$, hence all of its prime factors must not belong to $P$, contradicting our initial assumption
            </ul>
            Thus, there are infinitely many primes $\Box$
        </p>
    </div>
</div>

I want to reiterate that the purpose of all this discussion was not to needlessly axiomatize and formalize the basic concepts of integers, addition, and multiplication, but rather, to introduce the idea of defining numbers by the properties we wish them to have and explicitly constructing these numbers using sets. Many of the ideas discussed above will be utilized again and again in the following chapters.