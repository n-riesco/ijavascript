{# Get styles from ipython package #}
{%- extends 'null.tpl' -%}

{%- block header -%}
{% for css in resources.inlining.css -%}
    {{ css }}
{% endfor %}

/* Overrides of notebook CSS for static HTML export */
body {
  overflow: visible;
  padding: 8px;
}

div#notebook {
  overflow: visible;
  border-top: none;
}

@media print {
  div.cell {
    display: block;
    page-break-inside: avoid;
  }
  div.output_wrapper {
    display: block;
    page-break-inside: avoid;
  }
  div.output {
    display: block;
    page-break-inside: avoid;
  }
}
{%- endblock header -%}
