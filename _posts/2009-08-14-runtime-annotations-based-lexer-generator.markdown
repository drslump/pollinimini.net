---
layout: post
title: Runtime, annotations based, lexer generator
category: Code
tags: [lexer, parsing, php, tokenizer]
---

Just a quick post to publish this class. It allows to easily create lexers (or
lexical scanners or tokenizers) by either extending the class or pointing it to
a class or object.

Takes advantage of PHP's Reflection API to explore the document blocks of your
class looking for special annotations describing patterns (regular expressions)
and rules.

Some features:

 - "First to match" and "longest match" lexing modes.
 - States based lexer with support for a states stack
 - Rules can consume, ignore, repeat in a different state or repeat skipping the rule just matched
 - Implements the iterator interface so it can be used in foreach() loops for example
 - Reports lexing failures indicating the position in the text plus the line and column
 - Caches the internal lexer information so the annotations are only parsed once
 - Allows to save and restore the internal lexer information so it can persisted and cached between requests


<script src="http://gist.github.com/167494.js?file=AnnotationsLexerGenerator.php">
</script>

