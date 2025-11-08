---
layout: page
title: Projects
permalink: /projects/
---

<style>
    .project-name {
        display: inline-block;
        overflow: hidden;
        border: 1px solid #ccc;
        background-color: #f1f1f1;
    }

    .project-name button {
        background-color: inherit;
        float: left;
        border: none;
        outline: none;
        cursor: pointer;
        padding: 14px 16px;
        transition: 0.3s;
        font-size: 16px;
        font-weight: bold;
    }

    .project-name button:hover {
        background-color: #ddd;
    }

    .project-name button.active {
        background-color: #ccc;
    }

    .project-content {
        display: none;
        padding: 6px 12px;
        border: 1px solid #ccc;
        background-color: #fdfdfd;
    }
</style>

<script>
    function toggleProject(i) {
        let project_names = document.getElementsByClassName("project-name");
        let project_content = document.getElementsByClassName("project-content");

        if (project_content[i].style.display == "block") {
            project_content[i].style.display = "none";
            project_names[i].className = project_names[i].className.replace(" active", "");
        } else {
            project_content[i].style.display = "block";
            project_names[i].className += " active";
        }
    }
</script>

Below is a collection of various projects I have made.
<hr><br>

<!-- Graph Visualizer -->
<div class="project-name" id="graph-visualizer">
    <button onclick="toggleProject(0)">Graph Visualizer</button>
</div>
<div class="project-content" id="graph-visualizer-content">
    <img src="graph-image.png"/>
    <p>
        A small interactive tool for dynamic visualization of graphs.<br>
        Code may be found <a href="https://github.com/alexander-mcdowell/GraphVisualizer">here</a>.<br>
        Try it out for yourself <a href="/projects/GraphVisualizer/index.html">here</a>!
    </p>
</div>

<!-- Perlin Noise -->
<div class="project-name" id="perlin-noise">
    <button onclick="toggleProject(1)">Perlin Noise Explorer</button>
</div>
<div class="project-content" id="perlin-noise-content">
    <img src="perlin-image.png"/>
    <p>
        A tool for procedural generation of terrain using Perlin Noise, created as the final project for a computer graphics class at UCI.<br>
        Code may be found <a href="https://github.com/alexander-mcdowell/CS114-Final-Project">here</a>.<br>
        Try it out for yourself <a href="/projects/CS114-Final-Project/final.html">here</a>!
    </p>
</div>