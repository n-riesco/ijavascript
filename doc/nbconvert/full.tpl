{# Adapted from "full.tpl"

   Copyright (c) IPython Development Team.
   Distributed under the terms of the Modified BSD License. #}

{%- extends "basic.tpl" -%}

{% set path_doc = path_root ~ "doc/" %}
{% set path_jsdoc = path_root ~ "jsdoc/" %}
{% set path_images = path_root ~ "images/" %}
{% set path_css = path_root ~ "css/" %}
{% set path_js = path_root ~ "js/" %}

{% macro make_doc_link(target) %}{{path_doc ~ target ~ ".html"}}{% endmacro %}

{% macro make_menu_entry(target) %}<li><a href="{{make_doc_link(resources.navbar[target])}}">{{target}}</a></li>{% endmacro %}
{% macro make_feature_entry(target) %}<li><a href="{{make_doc_link(resources.navbar["Features"][target])}}">{{target[4:]}}</a></li>{% endmacro %}
{% macro make_tutorial_entry(author, target) %}<li><a href="{{make_doc_link(resources.navbar["Tutorials"][author][target])}}">{{target[4:]}}</a></li>{% endmacro %}

{%- block header -%}
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->

<link rel="shortcut icon" href="{{path_images ~ "favicon.ico"}}" />

<title>{{resources.title}}</title>

<script src="{{path_js ~ "require.min.js"}}"></script>
<script src="{{path_js ~ "jquery.min.js"}}"></script>

<!-- nbconvert styles -->
<link rel="stylesheet" href="{{path_css ~ "nb.css"}}">

<!-- Bootstrap -->
<link href="{{path_css ~ "bootstrap.min.css"}}" rel="stylesheet">

<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
<!--[if lt IE 9]>
<script src="{{path_js ~ "html5shiv.min.js"}}"></script>
<script src="{{path_js ~ "respond.min.js"}}"></script>
<![endif]-->

<!-- Custom stylesheet, it must be in the same directory as the html file -->
<link rel="stylesheet" href="{{path_css ~ "custom.css"}}">

<!-- Load mathjax -->
<script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML"></script>
<!-- MathJax configuration -->
<script type="text/x-mathjax-config">
MathJax.Hub.Config({
    tex2jax: {
        inlineMath: [ ['$','$'], ["\\(","\\)"] ],
        displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
        processEscapes: true,
        processEnvironments: true
    },
    // Center justify equations in code and markdown cells. Elsewhere
    // we use CSS to left justify single line equations in code cells.
    displayAlign: 'center',
    "HTML-CSS": {
        styles: {'.MathJax_Display': {"margin": 0}},
        linebreaks: { automatic: true }
    }
});
</script>
<!-- End of mathjax configuration -->
</head>
{%- endblock header -%}

{% block body %}
<body>
<!-- Bootstrap navigation bar -->
<nav id="menubar" class="navbar navbar-default navbar-static-top">
  <div class="container">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar">
        <span class="sr-only">Toggle navigation</span>
	<!-- 3-bar icon -->
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="{{path_root ~ "index.html"}}">
        <img min-height="50px" height="50px" width="50px" alt="IJS" src="{{path_images ~ "logo-50x50.png"}}">
      </a>
    </div>

    <div id="navbar" class="collapse navbar-collapse">
      <!-- navbar -->
      <ul class="nav navbar-nav">
	<!-- dropdown: Getting started -->
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Getting started <span class="caret"></span></a>
          <ul class="dropdown-menu" role="menu">
	    {{make_menu_entry("Installation")}}
	    {{make_menu_entry("Usage")}}
            <li class="divider"></li>
            <li class="dropdown-header">Main features</li>
	    {% for item in resources.navbar["Features"]|dictsort %}
	    {{make_feature_entry(item[0])}}
	    {% endfor %}
          </ul>
        </li>
	<!-- dropdown: Tutorials -->
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Tutorials <span class="caret"></span></a>
          <ul class="dropdown-menu" role="menu">
	  {% for item in resources.navbar["Tutorials"]|dictsort %}
	    {% set author = item[0] %}
	    {% set tutorials = item[1] %}
            <li class="dropdown-header">By {{author}}</li>
	    {% for item in resources.navbar["Tutorials"][author]|dictsort %}
	    {{make_tutorial_entry(author, item[0])}}
	    {% endfor %}
	  {% endfor %}
          </ul>
        </li>
	<!-- dropdown: Get involved -->
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Get involved <span class="caret"></span></a>
          <ul class="dropdown-menu" role="menu">
            <li><a href="{{path_root ~ "contributing.html"}}">Contribution guidelines</a></li>
            <li class="divider"></li>
            <li class="dropdown-header">Source code documentation</li>
            <li><a href="{{path_jsdoc ~ "index.html"}}">IJavascript</a></li>
            <li><a href="https://n-riesco.github.io/jmp/index.html">JMP</a></li>
            <li><a href="https://n-riesco.github.io/jp-kernel/index.html">jp-kernel</a></li>
            <li><a href="https://n-riesco.github.io/nel/index.html">NEL</a></li>
          </ul>
        </li>
      </ul>

      <!-- navbar-right -->
      <ul class="nav navbar-nav navbar-right">
	<!-- Github -->
        <li><a href="https://github.com/n-riesco/ijavascript">Github</a></li>
	<!-- npm -->
        <li><a href="https://www.npmjs.com/package/ijavascript">npm</a></li>
      </ul>
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container -->
</nav>

  <!-- notebook -->
  {% if resources.md %}
  <div id="markdown" class="container">
    {{ resources.md }}
  </div>
  {% else %}
  <div id="notebook" class="border-box-sizing" tabindex="-1">
    <div id="notebook-container" class="container">
      {{ super() }}
    </div>
  </div>
  {% endif %}
  
  <script src="{{path_js ~ "bootstrap.min.js"}}"></script>
</body>
{%- endblock body %}

{% block footer %}
</html>
{% endblock footer %}
