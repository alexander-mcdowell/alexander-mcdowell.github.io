---
layout: post
center-title: true
write-date: false
title:  "How To Create New Numbers"
subtitle: "A Perspective on Ring/Field Theory and Analysis"
katex: true
---

# Preface

The purpose of this blog post is to present a broad overview of undegraduate-level abstract algebra from an alternative perspective. Often, fundamental algebraic structures — most notably groups, rings/modules, and fields — are presented in purely abstract and formal terms. This is essential for providing a logical and rigorous foundation for the discipline, but, at least as it was for me as an undergrad, it fails to explain *why* these structures were invented in the first place and, more importantly, *why* they are defined the way they are and not some other way.

Simply put, I want to reframe abstract algebra — specifically Ring and Field Theory — as the branch of mathematics concerned with creating new number systems, understanding their properties and limitations, and how the *insolvability* of various problems in these number system grants us the ability to create more powerful and interesting number systems.

When I talk about creating new number systems, I do not mean substituting one numeral for another, such as replacing the Arabic numerals $1, 2, 3, 4,...$ with Chinese characters 一, 二, 三, 四, ... or Roman numerals *I, II, III, IV* or any other real or fictitious set of symbols. I am also not referring to the integers in different radixes, such as base-$2$, base-$16$, or even [factorial](https://en.wikipedia.org/wiki/Factorial_number_system) or [imaginary bases](https://en.wikipedia.org/wiki/Quater-imaginary_base) (although these are interesting in their own right). What I mean is extending an existing number system with new numbers with desirable properties.

A classic example of this is the complex numbers: we take the existing real numbers and simply adjoin a new "number" $i$ which satisfies $i^2 = -1$. However, this explanation is unsatisfying. How can we just make up a new number like this? What does $i$ even mean? What's stopping us from adding any "number" we want satisfying and properties we desire? How can we guarantee this number system is <span class="annotated">consistent<span class="popup">Containing no logical contradictions</span></span>?

Throughout this text, there will be two ways to expand a number system.
1. **Solutions to Equations** — This is the primary method we will be using to create new numbers and works by formalizing the idea of throwing in new numbers with the properties we want. To apply this method, we find a "problem" that we are unable to solve with our existing system and construct a new system with that "problem" solved. Usually, the "problem" refers to polynomials and the numbers we add are the roots of these polynomials.

2. **Filling in the gaps** — Most notably in the context of constructing the real numbers from the rationals, we can use <span class="annotated">analytical<span class="popup">The branch of mathematics concerned with limits, continuity, infinitesimals, differentiability, etc.; calculus and topology</span></span> techniques to add new numbers in-between existing numbers. This method is dependent on our notion of "distance", which is not as obvious and clear-cut as it may seem.

This will be a long read, as it is no easy task to condense hundreds and hundreds of pages of dense mathematical texts spanning algebra, analysis, and number theory into a single article. You can find links to the major sections below.

<div align="center" style="background: #c4c4c4; border: 2px solid black; border-radius: 10px; margin-bottom: 20px">
    <h4>
        <p>
            <a href="../../../how-to-create-new-numbers/set-theory.html">0. Set Theory Primer</a><br>
            <a href="../../../how-to-create-new-numbers/integers.html">1. The Integers $\mathbb{Z}$</a><br>
            <a href="../../../how-to-create-new-numbers/rationals.html">2. The Rationals $\mathbb{Q}$</a><br>
            <a href="../../../how-to-create-new-numbers/reals.html">3. The Reals $\mathbb{R}$</a><br>
            <a href="../../../how-to-create-new-numbers/complex.html">4. The Complex Numbers $\mathbb{C}$ and Algebraic Closure</a><br>
            <a href="../../../how-to-create-new-numbers/rings-fields.html">5. Rings, Fields and Field Extensions</a><br>
            <a href="../../../how-to-create-new-numbers/complex2.html">6. Quaternions and Generalized Complex Numbers</a><br>
            <a href="../../../how-to-create-new-numbers/finite-fields.html">7. $\mathbb{F}_p$ and Finite Field Arithmetic</a><br>
            <a href="../../../how-to-create-new-numbers/p-adics.html">8. $p$-adics</a><br>
            <a href="../../../how-to-create-new-numbers/what-next.html">9. What's Next?</a><br>
            <a href="../../../how-to-create-new-numbers/references.html">10. References</a><br>
        </p>
    </h4>
</div>

I have written this text in order for it to be understood by people from all sorts of educational backgrounds. Though it is about abstract math, I am writing it for the layman. I want this to feel informal, as if it was a conversation between you and a passionate and nerdy friend/colleague. There will, of course, be plenty of mathematical symbols and proofs, but they are there to supplement the text and you do not need to read or understand them all — they are there for the people who want something slightly more rigorous. 

Accordion elements like the ones below will provide optional proofs of important theorems.

<div>
    <button class="accordion">Proof Example</button>
    <div class="panel">
        <p>
            <i>Proof:</i> Proof contents here! $\Box$
        </p>
    </div>
</div>

I hope my work teaches you something new, elucidates a concept you've been grappling with, or is simply just a fun read.