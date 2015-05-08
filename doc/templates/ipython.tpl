<!--  Modified from full.tpl which is part of ipython package to add a navbar -->
{# Copyright (c) IPython Development Team.
   Distributed under the terms of the Modified BSD License. #}
{%- extends 'html_basic.tpl' -%}

{%- macro mathjax() -%}
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
{%- endmacro %}


{%- block header -%}
<!DOCTYPE html>
<html>
<head>

<meta charset="utf-8" />
<title>ijavascript</title>

<script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.10/require.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>

<!-- Old compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.0.2/js/bootstrap.min.js"></script>

<!-- Style sheet created from ipython resources.inlining.css -->
<link rel="stylesheet" href="jsdoc/styles/ipython_style.css">

<!-- Loading mathjax macro -->
{{ mathjax() }}

</head>
{%- endblock header -%}

{% block body %}
<body>

  <!-- Custom navbar -->
  {% include './doc/templates/_navbar.tpl' %}

  <div tabindex="-1" id="notebook" class="border-box-sizing">
    <div class="container" id="notebook-container">
{{ super() }}
    </div>
  </div>
</body>
{%- endblock body %}

{% block footer %}
</html>
{% endblock footer %}
